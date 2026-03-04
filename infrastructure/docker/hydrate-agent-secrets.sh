#!/usr/bin/env bash

raw_secret_json="${OPENCLAW_AGENT_SECRETS_JSON:-}"
if [ -z "$raw_secret_json" ]; then
  return 0 2>/dev/null || exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "[bootstrap] jq not found; skipping OPENCLAW_AGENT_SECRETS_JSON expansion"
  return 0 2>/dev/null || exit 0
fi

while IFS= read -r entry; do
  key="$(printf '%s' "$entry" | jq -r '.key')"
  value="$(printf '%s' "$entry" | jq -r '.value | tostring')"
  if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    export "${key}=${value}"
  fi
done < <(printf '%s' "$raw_secret_json" | jq -rc 'to_entries[]')

unset OPENCLAW_AGENT_SECRETS_JSON
