#!/usr/bin/env bash

if [ -z "${BASH_VERSION:-}" ] || shopt -oq posix; then
  exec bash "$0" "$@"
fi

set -euo pipefail

export AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_PROFILE="${AWS_PROFILE:-mostrom_mgmt}"

# shellcheck disable=SC2207
stack_names=($(cdk list --profile "$AWS_PROFILE" | awk '{print $1}'))

if [[ ${#stack_names[@]} -eq 0 ]]; then
  echo "No CDK stacks found."
  exit 0
fi

for (( i=${#stack_names[@]} - 1; i >= 0; i-- )); do
  stack_name="${stack_names[$i]}"
  echo "Destroying stack: $stack_name"
  cdk destroy "$stack_name" --profile "$AWS_PROFILE" --force
done
