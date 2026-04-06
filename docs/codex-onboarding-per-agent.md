# Codex Onboarding Per Agent (ECS Exec Runbook)

Use this after infrastructure changes are already deployed. This runbook does not include deploy steps.

## 1. Local AWS Session

```bash
export AWS_PROFILE=mostrom_mgmt
export AWS_REGION=us-east-1
export CLUSTER_NAME=openclaw
```

## 2. Agent List

```bash
AGENTS=(
  architect-agent
  fullstack-agent
  qa-agent
  pm-agent
)
```

## 3. Ensure Each Service Has A Running Task

Check running tasks:

```bash
for AGENT in "${AGENTS[@]}"; do
  TASK_ARN=$(aws ecs list-tasks \
    --cluster "$CLUSTER_NAME" \
    --service-name "$AGENT" \
    --desired-status RUNNING \
    --query 'taskArns[0]' \
    --output text)
  echo "$AGENT -> $TASK_ARN"
done
```

## 4. Exec Into Each Container

```bash
AGENT=architect-agent
TASK_ARN=$(aws ecs list-tasks \
  --cluster "$CLUSTER_NAME" \
  --service-name "$AGENT" \
  --desired-status RUNNING \
  --query 'taskArns[0]' \
  --output text)

aws ecs execute-command \
  --cluster "$CLUSTER_NAME" \
  --task "$TASK_ARN" \
  --container "mgmt-${AGENT}-container" \
  --interactive \
  --command "/bin/bash"
```

Repeat this for each agent in `AGENTS`.

## 5. In-Container Codex Setup

Run these inside the container:

```bash
export OPENCLAW_STATE_DIR=/home/node/.openclaw
export OPENCLAW_CONFIG_PATH=/home/node/.openclaw/openclaw.json

node /app/dist/index.js onboard \
  --auth-choice openai-codex \
  --skip-channels \
  --skip-skills \
  --skip-health \
  --skip-ui \
  --no-install-daemon
```

## 6. In-Container Verification

```bash
node /app/dist/index.js models status
cat /home/node/.openclaw/auth-profiles.json | jq .
```

Expected:

- Default model resolves to `openai-codex/gpt-5.3-codex`.
- `openai-codex:default` exists in auth profiles and is OAuth-backed.
- Gemini remains available only as fallback model.

## 7. Fast Repeat Workflow (All Agents)

Use this to print the exact exec command for each running agent:

```bash
for AGENT in "${AGENTS[@]}"; do
  TASK_ARN=$(aws ecs list-tasks \
    --cluster "$CLUSTER_NAME" \
    --service-name "$AGENT" \
    --desired-status RUNNING \
    --query 'taskArns[0]' \
    --output text)

  if [[ -z "$TASK_ARN" || "$TASK_ARN" == "None" ]]; then
    echo "No running task for $AGENT"
    continue
  fi

  echo "aws ecs execute-command --cluster $CLUSTER_NAME --task $TASK_ARN --container mgmt-${AGENT}-container --interactive --command /bin/bash"
done
```

Then run each printed command, complete onboarding, and verify before moving to the next agent.

## Troubleshooting

- `The Session Manager plugin was not found`: install AWS Session Manager Plugin locally.
- `TargetNotConnectedException` on exec: wait for task to be fully healthy, then retry.
- `No running task for <agent>`: scale service up (`--desired-count 1`) and wait.
- Onboarding fails auth: rerun onboarding in the same container and complete OAuth prompts.
