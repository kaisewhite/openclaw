#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Usage:
  $0 <script.sikuli>
USAGE
}

command -v java >/dev/null 2>&1 || { echo "Missing required binary: java" >&2; exit 1; }
[[ -n "${SIKULI_JAR:-}" ]] || { echo "Missing required env: SIKULI_JAR" >&2; exit 1; }
[[ $# -eq 1 ]] || { usage; exit 1; }

java -jar "$SIKULI_JAR" -r "$1"
