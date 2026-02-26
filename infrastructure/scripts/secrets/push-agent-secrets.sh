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

if [[ -z "$MANIFEST_ENV" ]]; then
  echo "Manifest missing 'environment'" >&2
  exit 1
fi

if [[ "$AGENT_COUNT" -eq 0 ]]; then
  echo "Manifest has no agents." >&2
  exit 1
fi

echo "Syncing $AGENT_COUNT agent secrets to Secrets Manager in region '$AWS_REGION' (env '$MANIFEST_ENV')."

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
