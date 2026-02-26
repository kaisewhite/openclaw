#!/usr/bin/env bash
set -euo pipefail

export AWS_REGION="us-east-1"
# Set AWS profile for management account
AWS_PROFILE="mostrom_mgmt"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MANIFEST_FILE="$ROOT_DIR/properties/secrets/linear-dispatcher.secrets.json"
EXAMPLE_FILE="$ROOT_DIR/properties/secrets/linear-dispatcher.secrets.example.json"

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
SECRET_NAME="$(jq -r '.secretName // empty' "$MANIFEST_FILE")"
DESCRIPTION="$(jq -r '.description // "OpenClaw integration secret"' "$MANIFEST_FILE")"
SECRET_JSON="$(jq -c '
  (.values // {})
  | with_entries(
      .value |= (
        if type == "string" then .
        elif type == "number" or type == "boolean" then tostring
        elif type == "null" then ""
        else tojson
        end
      )
    )
' "$MANIFEST_FILE")"
KEY_COUNT="$(jq -r '(.values | keys | length)' "$MANIFEST_FILE")"

if [[ -z "$MANIFEST_ENV" || -z "$SECRET_NAME" ]]; then
  echo "Manifest must include 'environment' and 'secretName'." >&2
  exit 1
fi

if [[ "$KEY_COUNT" -eq 0 ]]; then
  echo "Manifest values object is empty." >&2
  exit 1
fi

for required_key in LINEAR_WEBHOOK_SECRET LINEAR_API_KEY SLACK_BOT_TOKEN SLACK_CHANNEL_ID; do
  required_value="$(echo "$SECRET_JSON" | jq -r --arg key "$required_key" '.[$key] // empty')"
  if [[ -z "$required_value" ]]; then
    echo "Manifest values missing required key: $required_key" >&2
    exit 1
  fi
done

if aws secretsmanager describe-secret \
  --secret-id "$SECRET_NAME" \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" >/dev/null 2>&1; then
  aws secretsmanager put-secret-value \
    --secret-id "$SECRET_NAME" \
    --secret-string "$SECRET_JSON" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" >/dev/null
  echo "Updated integration secret -> $SECRET_NAME"
else
  aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --description "$DESCRIPTION" \
    --secret-string "$SECRET_JSON" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" >/dev/null
  echo "Created integration secret -> $SECRET_NAME"
fi

echo "Done. Secret values were not printed."
