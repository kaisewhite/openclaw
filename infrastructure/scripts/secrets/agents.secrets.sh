#!/usr/bin/env bash
set -euo pipefail

export AWS_REGION="us-east-1"
# Set AWS profile for management account
AWS_PROFILE="mostrom_mgmt"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MANIFEST_FILE="$ROOT_DIR/properties/secrets/agents.secrets.json"
EXAMPLE_FILE="$ROOT_DIR/properties/secrets/agents.secrets.example.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required but not installed." >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required but not installed." >&2
  exit 1
fi

if [[ ! -f "$MANIFEST_FILE" ]]; then
  echo "Manifest file not found: $MANIFEST_FILE" >&2
  echo "Copy example and fill values: $EXAMPLE_FILE" >&2
  exit 1
fi

MANIFEST_ENV="$(jq -r '.environment // empty' "$MANIFEST_FILE")"
AGENT_COUNT="$(jq '.agents | length' "$MANIFEST_FILE")"
REQUIRED_SHARED_KEYS=(
  GEMINI_API_KEY
  GITHUB_TOKEN
  GMAIL_APP_PASSWORD
  GMAIL_EMAIL
  GMAIL_PASSWORD
  GOOGLE_VOICE_NUMBER
  LINEAR_API_KEY
  NOTION_API_KEY
  OPENCLAW_GATEWAY_TOKEN
  SLACK_APP_TOKEN
  SLACK_BOT_TOKEN
)

if [[ -z "$MANIFEST_ENV" ]]; then
  echo "Manifest missing 'environment'" >&2
  exit 1
fi

if [[ "$AGENT_COUNT" -eq 0 ]]; then
  echo "Manifest has no agents." >&2
  exit 1
fi

echo "Syncing $AGENT_COUNT agent secrets to Secrets Manager in region '$AWS_REGION' (env '$MANIFEST_ENV')."

VALIDATION_FAILED=0
for index in $(seq 0 $((AGENT_COUNT - 1))); do
  AGENT_ID="$(jq -r ".agents[$index].id // empty" "$MANIFEST_FILE")"
  SECRET_NAME="$(jq -r ".agents[$index].secretName // empty" "$MANIFEST_FILE")"
  CUSTOM_REQUIRED_KEYS_COUNT="$(jq -r "(.agents[$index].requiredKeys // [] | length)" "$MANIFEST_FILE")"

  if [[ -z "$AGENT_ID" || -z "$SECRET_NAME" ]]; then
    echo "Validation error at index $index: missing id or secretName" >&2
    VALIDATION_FAILED=1
    continue
  fi

  if [[ "$CUSTOM_REQUIRED_KEYS_COUNT" -gt 0 ]]; then
    while IFS= read -r key; do
      if [[ -z "$key" ]]; then
        continue
      fi
      if ! jq -e ".agents[$index].values | has(\"$key\")" "$MANIFEST_FILE" >/dev/null; then
        echo "Validation error for '$AGENT_ID': missing required key '$key'" >&2
        VALIDATION_FAILED=1
      fi
    done < <(jq -r ".agents[$index].requiredKeys[]?" "$MANIFEST_FILE")
    continue
  fi

  for key in "${REQUIRED_SHARED_KEYS[@]}"; do
    if ! jq -e ".agents[$index].values | has(\"$key\")" "$MANIFEST_FILE" >/dev/null; then
      echo "Validation error for '$AGENT_ID': missing required key '$key'" >&2
      VALIDATION_FAILED=1
    fi
  done

  if ! jq -e ".agents[$index].values | has(\"GEMINI_API_KEY\")" "$MANIFEST_FILE" >/dev/null; then
    echo "Validation error for '$AGENT_ID': missing provider key (need GEMINI_API_KEY)" >&2
    VALIDATION_FAILED=1
  fi

  if ! jq -e ".agents[$index].values | has(\"ANTHROPIC_API_KEY\")" "$MANIFEST_FILE" >/dev/null; then
    echo "Validation error for '$AGENT_ID': missing fallback key (need ANTHROPIC_API_KEY)" >&2
    VALIDATION_FAILED=1
  fi
done

if [[ "$VALIDATION_FAILED" -ne 0 ]]; then
  echo "Secret manifest validation failed. No secrets were pushed." >&2
  exit 1
fi

for index in $(seq 0 $((AGENT_COUNT - 1))); do
  AGENT_ID="$(jq -r ".agents[$index].id // empty" "$MANIFEST_FILE")"
  SECRET_NAME="$(jq -r ".agents[$index].secretName // empty" "$MANIFEST_FILE")"
  SECRET_JSON="$(jq -c ".agents[$index].values // {}" "$MANIFEST_FILE")"
  KEY_COUNT="$(jq -r "(.agents[$index].values | keys | length)" "$MANIFEST_FILE")"

  if [[ -z "$AGENT_ID" || -z "$SECRET_NAME" ]]; then
    echo "Skipping index $index: missing id or secretName" >&2
    continue
  fi

  if [[ "$KEY_COUNT" -eq 0 ]]; then
    echo "Skipping '$AGENT_ID': values object is empty" >&2
    continue
  fi

  if aws secretsmanager describe-secret \
    --secret-id "$SECRET_NAME" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" >/dev/null 2>&1; then
    aws secretsmanager put-secret-value \
      --secret-id "$SECRET_NAME" \
      --secret-string "$SECRET_JSON" \
      --profile "$AWS_PROFILE" \
      --region "$AWS_REGION" >/dev/null
    echo "Updated secret for '$AGENT_ID' -> $SECRET_NAME"
  else
    aws secretsmanager create-secret \
      --name "$SECRET_NAME" \
      --description "OpenClaw agent secret for $AGENT_ID" \
      --secret-string "$SECRET_JSON" \
      --profile "$AWS_PROFILE" \
      --region "$AWS_REGION" >/dev/null
    echo "Created secret for '$AGENT_ID' -> $SECRET_NAME"
  fi
done

echo "Done. Secret values were not printed."
