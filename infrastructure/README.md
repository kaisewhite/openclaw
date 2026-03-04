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
- Agent prompts: [agent-assets/agents](./agent-assets/agents)
- Agent skills: [agent-assets/skills](./agent-assets/skills)
- Slack app manifests: [agent-assets/agents/manifests](./agent-assets/agents/manifests)
- Agent credentials stubs: [agent-assets/agents/credentials](./agent-assets/agents/credentials)
- Integration runbooks: [docs](./docs)

Notion setup runbook:

- [Notion Access For OpenClaw Agents](./docs/notion-agent-access.md)
- [Gateway Token + ECS Exec + Codex Onboarding Runbook](./docs/gateway-token-and-ecs-exec-runbook.md)

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

Manifests live in [agent-assets/agents/manifests](./agent-assets/agents/manifests), including:

- `architect-agent.manifest.json`
- `fullstack-agent.manifest.json`
- `codex-agent.manifest.json`
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
- `NOTION_API_KEY`
- `GMAIL_EMAIL`
- `GMAIL_PASSWORD`
- provider key (`OPENAI_API_KEY` or `ANTHROPIC_SETUP_TOKEN`)
- `GITHUB_TOKEN`

3. Push:

```bash
./scripts/secrets/push-agent-secrets.sh
```

Additional key behavior:

- Agent tasks now receive the full secret JSON as `OPENCLAW_AGENT_SECRETS_JSON`.
- `infrastructure/docker/hydrate-agent-secrets.sh` expands that JSON into env vars at runtime.
- If you add new key/value pairs to an agent secret, they are available in the container after a new deployment without changing CDK secret mappings.

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

- `node`, `npm`, `pnpm`, `bun`, `bunx`, `nodemon`
- `git`, `git-lfs`, `gh`
- `lin` (Linear CLI)
- `jq`, `yq`, `rg`, `fd`
- `curl`, `wget`, `unzip`, `zip`, `tar`
- `python3`, `pip`, `venv`, `poetry`
- `make`, `build-essential`
- `aws`, `sam`
- `sqlite3`, `psql`, `mysql`, `redis-cli`
- `dig`, `nc`, `lsof`, `ping`
- `shellcheck`, `yamllint`, `pre-commit`

Browser testing baseline:

- Build script defaults `OPENCLAW_INSTALL_BROWSER=1`, which bakes Chromium + Playwright runtime deps into the base image.
- Override with `OPENCLAW_INSTALL_BROWSER=0` only when you explicitly want a smaller image.

Skills baseline:

- All skills in [agent-assets/skills](./agent-assets/skills) are baked into the image at `/opt/openclaw/skills`.
- Agents load these automatically via `skills.load.extraDirs` in `properties/index.ts`.

Plugin baseline:

- Memory Core plugin is explicitly selected by default via `plugins.slots.memory = "memory-core"` in `properties/index.ts`.

Slack rendering baseline:

- Slack live preview streaming is disabled by default (`channels.slack.streaming = "off"`).
- This ensures final responses are delivered through OpenClaw's Markdown-to-Slack mrkdwn conversion path for cleaner formatting.

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

## Codex OAuth Setup (Any Agent)

Use this when you want an agent to use a Codex subscription auth profile instead of `OPENAI_API_KEY`.

1. Update the agent model in [properties/index.ts](./properties/index.ts):

- set `model.provider` to `openai-codex`
- set `model.model` to `gpt-5.3-codex`
- remove `OPENAI_API_KEY` from that agent's secret JSON if you want Codex OAuth only

2. Deploy the agent stack (example for QA):

```bash
npx cdk deploy OpenclawStack/openclaw-cdk/openclaw-qa-agent-cdk --profile mostrom_mgmt --require-approval never
```

3. Exec into the running container:

```bash
AWS_PROFILE=mostrom_mgmt AWS_REGION=us-east-1 aws ecs list-tasks \
  --cluster openclaw --service-name qa-agent --desired-status RUNNING --query 'taskArns[0]' --output text

AWS_PROFILE=mostrom_mgmt AWS_REGION=us-east-1 aws ecs execute-command \
  --cluster openclaw \
  --task <TASK_ID_OR_ARN> \
  --container mgmt-qa-agent-container \
  --interactive \
  --command "/bin/bash"
```

4. Inside the container, run Codex OAuth onboarding:

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

5. Verify:

```bash
node /app/dist/index.js models status
```

Expected result:

- default model resolves to `openai-codex/gpt-5.3-codex`
- auth store shows `openai-codex:default` as OAuth
- no dependency on `OPENAI_API_KEY` for that agent

## Troubleshooting

- `401 Bad credentials` for GitHub: rotate token, push secrets, force ECS new deployment.
- Slack `not_in_channel`: invite bot app to the channel in `SLACK_CHANNEL_ID`.
- Linear webhook `invalid_signature`: webhook secret mismatch.
- Linear webhook `invalid_timestamp`: event too old or clock skew.
