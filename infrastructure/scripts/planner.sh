#!/bin/bash

export AWS_REGION="us-east-1"
# Set AWS profile for management account
AWS_PROFILE="mostrom_mgmt"

# Create unique output directory for this terminal session
CDK_OUTPUT_DIR="cdk.out.$$"
echo "Using CDK output directory: $CDK_OUTPUT_DIR"

# Cleanup function to remove output directory on exit
cleanup() {
  echo "Cleaning up CDK output directory: $CDK_OUTPUT_DIR"
  rm -rf "$CDK_OUTPUT_DIR"
}
trap cleanup EXIT

# Get child stack artifacts only (skip root wrapper stack to avoid duplicate deploys)
stack_names=$(cdk list --profile $AWS_PROFILE --output "$CDK_OUTPUT_DIR" | awk -F ' ' '{print $1}' | grep 'vacation-planner')

# Loop through stack names
for stack_name in $stack_names; do
  echo "Running commands for stack: $stack_name"

  # Synthesize the stack
  cdk synth "$stack_name" --profile $AWS_PROFILE --no-bundling --output "$CDK_OUTPUT_DIR"

  # Deploy the stack
  cdk deploy "$stack_name" --profile $AWS_PROFILE --require-approval never --output "$CDK_OUTPUT_DIR"

  echo "Finished running commands for stack: $stack_name"
done
