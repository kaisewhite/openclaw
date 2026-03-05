# Gateway Token + ECS Exec + Codex Onboarding Runbook

Use this runbook when you need to:

- set/update `OPENCLAW_GATEWAY_TOKEN` for agents
- push agent secrets
- roll ECS services so new secrets are loaded
- exec into an agent container
- run Codex OAuth onboarding inside the container

## 1. Set Local AWS Context

```bash
export AWS_PROFILE=mostrom_mgmt
export AWS_REGION=us-east-1
```

## 2. Generate A Gateway Token

```bash
export OPENCLAW_GATEWAY_TOKEN="$(openssl rand -hex 32)"
echo "$OPENCLAW_GATEWAY_TOKEN"
```

## 3. Write Token Into All Agent Secret Entries

From `infrastructure/`:

```bash
cd /Volumes/Samsung/repositories/mostrom/openclaw/infrastructure

jq --arg tok "$OPENCLAW_GATEWAY_TOKEN" \
  '.agents |= map(.values.OPENCLAW_GATEWAY_TOKEN = $tok)' \
  properties/secrets/agents.secrets.json \
  > /tmp/agents.secrets.json && mv /tmp/agents.secrets.json properties/secrets/agents.secrets.json
```

## 4. Push Agent Secrets To Secrets Manager

```bash
./scripts/secrets/push-agent-secrets.sh
```

Note:

- Additional secret keys require explicit ECS mapping in `properties/index.ts` (`directEnvKeys`) followed by deploy.

## 5. Force New Deployments So Tasks Reload Secrets

```bash
for svc in architect-agent fullstack-agent codex-agent qa-agent pm-agent; do
  aws ecs update-service \
    --cluster openclaw \
    --service "$svc" \
    --force-new-deployment >/dev/null
  echo "Forced deployment: $svc"
done
```

## 6. Exec Into A Running Agent Container (Accurate One-Liner)

```bash
AGENT=codex-agent; TASK_ARN=$(AWS_PROFILE=mostrom_mgmt AWS_REGION=us-east-1 aws ecs list-tasks --cluster openclaw --service-name "$AGENT" --desired-status RUNNING --query 'taskArns[0]' --output text); AWS_PROFILE=mostrom_mgmt AWS_REGION=us-east-1 aws ecs execute-command --cluster openclaw --task "$TASK_ARN" --container "mgmt-${AGENT}-container" --interactive --command "/bin/bash"
```

Switch `AGENT=` to any of:

- `architect-agent`
- `fullstack-agent`
- `codex-agent`
- `qa-agent`
- `pm-agent`

## 7. In-Container: Codex OAuth Onboarding

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

## 8. In-Container Verification

```bash
node /app/dist/index.js models status
```

Expected:

- default model resolves to `openai-codex/gpt-5.3-codex` (for Codex-enabled agents)
- auth overview shows `openai-codex:default` profile as OAuth

## 9. Optional Sanity Checks

Check agent config currently on disk:

```bash
cat /home/node/.openclaw/openclaw.json | jq '.gateway.auth.mode, .gateway.auth.token'
```

Check running task for a service:

```bash
aws ecs list-tasks \
  --cluster openclaw \
  --service-name codex-agent \
  --desired-status RUNNING \
  --query 'taskArns' \
  --output table
```

## Troubleshooting

- `The Session Manager plugin was not found`:
  - install AWS Session Manager Plugin locally, then retry `aws ecs execute-command`.
- `openclaw: command not found` inside container:
  - use `node /app/dist/index.js ...` commands (this image uses that path).
- `No provider plugins found`:
  - run onboarding with `--auth-choice openai-codex` as shown above.
- New secrets not visible in container:
  - confirm secret push succeeded, then force new ECS deployment again.
