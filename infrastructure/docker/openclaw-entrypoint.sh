#!/usr/bin/env bash
set -euo pipefail

bool_true() {
  case "${1:-}" in
    1 | true | TRUE | yes | YES | on | ON) return 0 ;;
    *) return 1 ;;
  esac
}

resolve_state_dir() {
  if [ -n "${OPENCLAW_STATE_DIR:-}" ]; then
    printf "%s" "${OPENCLAW_STATE_DIR}"
    return 0
  fi
  if [ -n "${OPENCLAW_HOME:-}" ]; then
    case "${OPENCLAW_HOME}" in
      */.openclaw) printf "%s" "${OPENCLAW_HOME}" ;;
      *) printf "%s/.openclaw" "${OPENCLAW_HOME}" ;;
    esac
    return 0
  fi
  printf "%s" "/home/node/.openclaw"
}

normalize_bind() {
  case "${1:-}" in
    "" | "0.0.0.0") echo "lan" ;;
    "127.0.0.1") echo "loopback" ;;
    *) echo "${1}" ;;
  esac
}

verify_required_bins() {
  local required="${OPENCLAW_REQUIRED_BINS:-node npm pnpm bun bunx git gh lin jq yq rg fd curl wget unzip zip tar python3 aws sam poetry nodemon ctx7 context7-mcp dembrandt make shellcheck yamllint pre-commit sqlite3 psql mysql redis-cli dig nc lsof chromium}"
  local missing=()
  local bin
  for bin in ${required}; do
    if ! command -v "${bin}" >/dev/null 2>&1; then
      missing+=("${bin}")
    fi
  done

  if [ "${#missing[@]}" -gt 0 ]; then
    echo "[bootstrap] Missing required binaries: ${missing[*]}"
    echo "[bootstrap] Rebuild image with required tools baked in."
    exit 1
  fi
}

cleanup_stale_session_locks() {
  local lock_ttl_seconds="${OPENCLAW_SESSION_LOCK_TTL_SECONDS:-300}"
  local now_epoch
  now_epoch="$(date +%s)"
  local removed=0

  shopt -s nullglob
  local lock_file
  for lock_file in "${OPENCLAW_STATE_DIR}"/agents/*/sessions/*.jsonl.lock; do
    [ -f "${lock_file}" ] || continue

    local lock_mtime
    lock_mtime="$(stat -c %Y "${lock_file}" 2>/dev/null || echo 0)"
    local lock_age=$((now_epoch - lock_mtime))

    if [ "${lock_age}" -ge "${lock_ttl_seconds}" ]; then
      rm -f "${lock_file}"
      removed=$((removed + 1))
      echo "[bootstrap] Removed stale session lock: ${lock_file} (age=${lock_age}s, ttl=${lock_ttl_seconds}s)"
    fi
  done
  shopt -u nullglob

  if [ "${removed}" -gt 0 ]; then
    echo "[bootstrap] Stale session lock cleanup completed (removed=${removed})"
  fi
}

OPENCLAW_STATE_DIR="$(resolve_state_dir)"
export OPENCLAW_STATE_DIR
export OPENCLAW_CONFIG_PATH="${OPENCLAW_CONFIG_PATH:-${OPENCLAW_STATE_DIR}/openclaw.json}"
verify_required_bins
cleanup_stale_session_locks

echo "[bootstrap] Reconciling OpenClaw runtime config"
node /usr/local/bin/openclaw-bootstrap.mjs

if bool_true "${OPENCLAW_AUTO_UPDATE:-false}"; then
  UPDATE_CHANNEL="${OPENCLAW_UPDATE_CHANNEL:-stable}"
  echo "[bootstrap] Auto-update enabled (channel: ${UPDATE_CHANNEL})"
  if ! node dist/index.js update --yes --no-restart --channel "${UPDATE_CHANNEL}"; then
    echo "[bootstrap] Auto-update failed, continuing with current build"
  fi
fi

BIND_MODE="$(normalize_bind "${OPENCLAW_GATEWAY_BIND:-lan}")"
PORT="${OPENCLAW_GATEWAY_PORT:-18789}"

echo "[bootstrap] Starting gateway (bind=${BIND_MODE}, port=${PORT})"
exec node dist/index.js gateway --bind "${BIND_MODE}" --port "${PORT}" --allow-unconfigured
