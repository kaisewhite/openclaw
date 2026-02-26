# OpenClaw CDK Infrastructure

Infrastructure-as-code for running isolated OpenClaw agents on ECS Fargate, plus a Linear -> Slack dispatcher Lambda.

## What This Deploys
- One shared ECR repository for the OpenClaw image.
- One shared ECS cluster.
- One shared EFS filesystem.
- One Fargate service per agent.
- One EFS access point per agent (`/agents/<agent-id>`).
- One CloudWatch log group per agent.
- One Linear -> Slack dispatcher Lambda with Function URL.
- No ALB, Route53, or public ingress resources.

## Source Of Truth
- Agent definitions: [properties/index.ts](./properties/index.ts)
- Agent prompts: [prompts/agents](./prompts/agents)
- Slack app manifests: [prompts/agents/manifests](./prompts/agents/manifests)
- Agent credentials stubs: [prompts/agents/credentials](./prompts/agents/credentials)

## Prerequisites
- AWS CLI authenticated for account `CDK_DEFAULT_ACCOUNT`.
- Docker running locally.
- `jq` installed locally.
- `CDK_DEFAULT_ACCOUNT`, `CDK_DEFAULT_REGION`, and `MGMT_VPC` set in `.env`.

## Script Defaults
The operational scripts are intentionally simple and default to:
- `AWS_REGION="us-east-1"`
- `AWS_PROFILE="mostrom_mgmt"`

Scripts:
- [scripts/secrets/push-agent-secrets.sh](./scripts/secrets/push-agent-secrets.sh)
- [scripts/secrets/push-integration-secret.sh](./scripts/secrets/push-integration-secret.sh)
- [scripts/docker/build-push-openclaw-image.sh](./scripts/docker/build-push-openclaw-image.sh)

## Setup Flow
1. Prepare Slack apps from manifests.
2. Push agent secrets.
3. Push Linear dispatcher secret.
4. Build and push Docker image.
5. Deploy CDK stack.
6. Configure Linear webhook to the Lambda Function URL output.

## Slack Manifests
Manifests live in [prompts/agents/manifests](./prompts/agents/manifests), including:
- `architect-agent.manifest.json`
- `fullstack-agent.manifest.json`
- `qa-agent.manifest.json`
- `pm-agent.manifest.json`
- `linear-dispatcher.manifest.json`

Sync manifests:
```bash
./scripts/slack/sync-agent-manifests.sh
```

If scopes change, reinstall each Slack app.

## Secrets
### Agent Secrets
1. Copy [agents.secrets.example.json](./properties/secrets/agents.secrets.example.json) to `agents.secrets.json`.
2. Fill in real values, including:
- `OPENCLAW_GATEWAY_TOKEN`
- `SLACK_BOT_TOKEN`
- `SLACK_APP_TOKEN`
- `LINEAR_API_KEY`
- `GMAIL_EMAIL`
- `GMAIL_PASSWORD`
- provider key (`OPENAI_API_KEY` or `ANTHROPIC_API_KEY`)
- `GITHUB_TOKEN`
3. Push:
```bash
./scripts/secrets/push-agent-secrets.sh
```

### Linear Dispatcher Secret
1. Copy [linear-dispatcher.secrets.example.json](./properties/secrets/linear-dispatcher.secrets.example.json) to `linear-dispatcher.secrets.json`.
2. Fill in:
- `LINEAR_WEBHOOK_SECRET`
- `LINEAR_API_KEY`
- `SLACK_BOT_TOKEN`
- `SLACK_CHANNEL_ID`
- assignee map keys
3. Push:
```bash
./scripts/secrets/push-integration-secret.sh
```

Important: keep dispatcher secret values as flat key/value strings. For map values, store JSON as escaped strings.

## Build And Deploy
Build and push image:
```bash
./scripts/docker/build-push-openclaw-image.sh
```

Deploy infrastructure:
```bash
npx cdk list
npx cdk synth
npx cdk diff
npx cdk deploy
```

## Docker Toolchain Baseline
The wrapped image pre-installs:
- `node`, `npm`, `pnpm`
- `git`, `git-lfs`, `gh`
- `jq`, `yq`, `rg`, `fd`
- `curl`, `wget`, `unzip`, `zip`, `tar`
- `python3`, `pip`, `venv`
- `make`, `build-essential`
- `aws`
- `shellcheck`, `yamllint`, `pre-commit`

At startup, the entrypoint verifies required binaries and fails fast if missing.

## Linear Webhook
The deploy creates a Function URL export:
- `<project>-linear-dispatcher-url`

Use that URL as the webhook target in Linear and set the same webhook secret value in Linear and Secrets Manager.

## Verification Checklist
- Slack apps connected in Socket Mode for agent bots.
- Agents respond in Slack channels/DMs.
- Dispatcher bot can post into target Slack channel.
- Linear issue assignment triggers a Slack mention.
- Linear comment by non-assignee on an assigned issue triggers a Slack mention.
- `GITHUB_TOKEN` works (`curl https://api.github.com/user` returns `200`).

## Troubleshooting
- `401 Bad credentials` for GitHub: rotate token, push secrets, force ECS new deployment.
- Slack `not_in_channel`: invite bot app to the channel in `SLACK_CHANNEL_ID`.
- Linear webhook `invalid_signature`: webhook secret mismatch.
- Linear webhook `invalid_timestamp`: event too old or clock skew.
