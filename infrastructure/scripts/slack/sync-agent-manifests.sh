#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MANIFESTS_DIR="$ROOT_DIR/prompts/agents/manifests"
CREDENTIALS_DIR="$ROOT_DIR/prompts/agents/credentials"
MODE="upsert"
DRY_RUN="false"
SLACK_TOKEN="${SLACK_APP_MANIFEST_TOKEN:-}"

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--token <token>] [--mode upsert|create|update] [--dry-run] [--manifests-dir <dir>] [--credentials-dir <dir>]

Required:
  --token                     Slack app config token (or set SLACK_APP_MANIFEST_TOKEN)

Options:
  --mode                      upsert (default), create, update
  --dry-run                   Validate manifests only; do not create/update
  --manifests-dir             Defaults to prompts/agents/manifests
  --credentials-dir           Defaults to prompts/agents/credentials

Notes:
  - Uses Slack Web API methods: apps.manifest.validate/create/update
  - For update/upsert, appId is read from <agent>.credentials.md as 'appId:<value>'
  - If create/upsert creates a new app, appId is written back to credentials file
  - Scope changes require reinstalling the app in Slack
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --token)
      SLACK_TOKEN="$2"
      shift 2
      ;;
    --mode)
      MODE="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift 1
      ;;
    --manifests-dir)
      MANIFESTS_DIR="$2"
      shift 2
      ;;
    --credentials-dir)
      CREDENTIALS_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$SLACK_TOKEN" ]]; then
  echo "Missing Slack token. Use --token or set SLACK_APP_MANIFEST_TOKEN." >&2
  exit 1
fi

if [[ "$MODE" != "upsert" && "$MODE" != "create" && "$MODE" != "update" ]]; then
  echo "Invalid --mode '$MODE'. Must be one of: upsert, create, update." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required but not installed." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required but not installed." >&2
  exit 1
fi

if [[ ! -d "$MANIFESTS_DIR" ]]; then
  echo "Manifests directory not found: $MANIFESTS_DIR" >&2
  exit 1
fi

print_slack_errors() {
  local response="$1"
  local prefix="$2"
  local error_code
  error_code="$(echo "$response" | jq -r '.error // "unknown_error"')"
  echo "$prefix: $error_code" >&2

  if echo "$response" | jq -e '.errors and (.errors | length > 0)' >/dev/null 2>&1; then
    echo "$response" | jq -r '.errors[] | "- " + ((.pointer // "unknown_pointer") + ": " + (.error // "unknown_error"))' >&2
  elif echo "$response" | jq -e '.response_metadata.messages and (.response_metadata.messages | length > 0)' >/dev/null 2>&1; then
    echo "$response" | jq -r '.response_metadata.messages[] | "- " + .' >&2
  fi
}

call_slack_api() {
  local method="$1"
  local manifest_json="$2"
  local app_id="${3:-}"

  if [[ -n "$app_id" ]]; then
    curl -sS -X POST "https://slack.com/api/$method" \
      -H "Authorization: Bearer $SLACK_TOKEN" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      --data-urlencode "manifest=$manifest_json" \
      --data-urlencode "app_id=$app_id"
  else
    curl -sS -X POST "https://slack.com/api/$method" \
      -H "Authorization: Bearer $SLACK_TOKEN" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      --data-urlencode "manifest=$manifest_json"
  fi
}

read_app_id() {
  local credentials_file="$1"
  if [[ ! -f "$credentials_file" ]]; then
    echo ""
    return 0
  fi

  awk -F: '/^appId:/{print $2}' "$credentials_file" | tr -d '[:space:]' | head -n 1
}

write_app_id() {
  local credentials_file="$1"
  local app_id="$2"

  mkdir -p "$(dirname "$credentials_file")"

  if [[ ! -f "$credentials_file" ]]; then
    cat > "$credentials_file" <<EOF2
appId:$app_id
clientId:
clientSecret:
signingSecret:
verificationToken:
EOF2
    return 0
  fi

  if grep -q '^appId:' "$credentials_file"; then
    sed -i '' "s/^appId:.*/appId:$app_id/" "$credentials_file"
  else
    printf 'appId:%s\n' "$app_id" | cat - "$credentials_file" > "$credentials_file.tmp"
    mv "$credentials_file.tmp" "$credentials_file"
  fi
}

shopt -s nullglob
manifest_files=("$MANIFESTS_DIR"/*.manifest.json)

if [[ ${#manifest_files[@]} -eq 0 ]]; then
  echo "No manifest files found in $MANIFESTS_DIR" >&2
  exit 1
fi

echo "Processing ${#manifest_files[@]} manifest(s) in mode: $MODE"

for manifest_file in "${manifest_files[@]}"; do
  agent_key="$(basename "$manifest_file" .manifest.json)"
  credentials_file="$CREDENTIALS_DIR/${agent_key}.credentials.md"

  manifest_json="$(jq -c . "$manifest_file")"

  validate_response="$(call_slack_api "apps.manifest.validate" "$manifest_json")"
  validate_ok="$(echo "$validate_response" | jq -r '.ok')"

  if [[ "$validate_ok" != "true" ]]; then
    print_slack_errors "$validate_response" "Validation failed for $agent_key"
    exit 1
  fi

  echo "Validated: $agent_key"

  if [[ "$DRY_RUN" == "true" ]]; then
    continue
  fi

  app_id="$(read_app_id "$credentials_file")"

  case "$MODE" in
    create)
      app_id=""
      ;;
    update)
      if [[ -z "$app_id" ]]; then
        echo "Missing appId for $agent_key at $credentials_file (required for --mode update)" >&2
        exit 1
      fi
      ;;
  esac

  if [[ -n "$app_id" ]]; then
    update_response="$(call_slack_api "apps.manifest.update" "$manifest_json" "$app_id")"
    update_ok="$(echo "$update_response" | jq -r '.ok')"

    if [[ "$update_ok" != "true" ]]; then
      print_slack_errors "$update_response" "Update failed for $agent_key ($app_id)"
      exit 1
    fi

    echo "Updated app: $agent_key ($app_id)"
  else
    create_response="$(call_slack_api "apps.manifest.create" "$manifest_json")"
    create_ok="$(echo "$create_response" | jq -r '.ok')"

    if [[ "$create_ok" != "true" ]]; then
      print_slack_errors "$create_response" "Create failed for $agent_key"
      exit 1
    fi

    new_app_id="$(echo "$create_response" | jq -r '.app_id // empty')"
    oauth_url="$(echo "$create_response" | jq -r '.oauth_authorize_url // empty')"

    if [[ -n "$new_app_id" ]]; then
      write_app_id "$credentials_file" "$new_app_id"
      echo "Created app: $agent_key ($new_app_id)"
    else
      echo "Created app for $agent_key but no app_id returned in response" >&2
    fi

    if [[ -n "$oauth_url" ]]; then
      echo "Install URL for $agent_key: $oauth_url"
    fi
  fi
done

echo "Done. If scopes changed, reinstall each app in Slack to apply permissions."
