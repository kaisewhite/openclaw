# OpenClaw Agent Platform Implementation Plan

## Purpose
Convert this CDK template into an OpenClaw multi-agent platform while preserving folder structure and using `properties/index.ts` as the single source of truth for agent definitions.

## Locked Decisions
1. Use AWS Secrets Manager (not SSM Parameter Store).
2. Each agent has its own CloudWatch log group.
3. Secrets are managed from local files and pushed with a bash script.
4. Replace `services` template config with agent-first config in `properties/index.ts`.
5. Use one shared ECR repository for all agents.
6. Run agent tasks in public subnets with public IPs.
7. Remove ALB/Route53 and other template resources not required for OpenClaw agents.
8. Validation workflow is CDK-only (`cdk list`, `cdk synth`, `cdk diff`, `cdk deploy`) and does not use `npm run build`.

## OpenClaw Docker Runtime Requirements (From Docs)
- Container state should persist at `/home/node/.openclaw`; this must be backed by EFS in ECS.
- OpenClaw Docker runtime expects UID/GID `1000:1000`; EFS access points should enforce this.
- Gateway can run with `--allow-unconfigured` for first boot bootstrap.
- If gateway bind is non-loopback (`0.0.0.0`), set `OPENCLAW_GATEWAY_TOKEN`.
- Channels can consume credentials from env vars; Slack channel standard envs are `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN`.
- OpenClaw docs recommend env vars/secrets for API keys and tokens rather than committing them in config files.

## Environment Variables: Config vs Secret

## Non-Secret Runtime Config (ECS plain environment)
- `OPENCLAW_GATEWAY_BIND` (expected: `0.0.0.0` in ECS)
- `OPENCLAW_GATEWAY_PORT` (expected: `80` in ECS)
- `OPENCLAW_HOME` (optional override; default `/home/node/.openclaw`)
- `OPENCLAW_STATE_DIR` (optional override)
- `OPENCLAW_CONFIG_PATH` (optional override)
- `OPENCLAW_SOUL_MD` (bootstrap payload text)
- `OPENCLAW_JSON` (bootstrap payload JSON)
- `OPENCLAW_AUTH_PROFILES_JSON` (bootstrap payload JSON)
- `OPENCLAW_ALLOW_TOOLS` and `OPENCLAW_DENY_TOOLS` (or embedded inside `OPENCLAW_JSON`)
- Agent identity/config vars (agent id, model id, role name, feature flags)

## Secret Runtime Config (ECS secrets from Secrets Manager)
- `OPENCLAW_GATEWAY_TOKEN` (required when exposed on `0.0.0.0`)
- `SLACK_BOT_TOKEN`
- `SLACK_APP_TOKEN`
- LLM provider keys used by that agent (examples):
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `OPENROUTER_API_KEY`
  - Other provider-specific API keys as needed
- Optional integration credentials:
  - `GITHUB_TOKEN` / PAT
  - `GMAIL_EMAIL`
  - `GMAIL_PASSWORD`
  - Any additional external service tokens

## Secret Storage Convention
- One secret per agent per environment in Secrets Manager:
  - Example name: `/openclaw/<env>/agents/<agent-id>`
- Secret JSON includes only values that are actually needed for that agent.
- ECS maps JSON keys to container secret env vars.

## Execution Plan

## Step 0: Pre-Flight Baseline
- Remove generated artifacts (`*.js`, `*.d.ts`) from source tree.
- Ensure `.gitignore` prevents generated TypeScript outputs from being committed.
- Keep current folder structure unchanged.
- Exit criteria: repository is clean of generated compile artifacts.

## Step 1: Define Agent Configuration Schema
- Refactor `properties/index.ts` from `Service[]` to `Agent[]`.
- Add strong interfaces for:
  - identity (`id`, `displayName`, `description`)
  - runtime sizing (`cpu`, `memoryLimitMiB`, `desiredCount`)
  - model/provider settings
  - tool policy (allow/deny)
  - bootstrap payloads (`soul`, `openclawJson`, `authProfiles`)
  - secret key mapping
- Define initial agent roster here.
- Exit criteria: one-file agent roster drives all stack generation.

## Step 2: Strip Unneeded Shared Infrastructure
- Update `resources/stacks/shared/index.ts` to remove:
  - ALB and listener resources
  - Route53 resources
  - Global Accelerator
  - template-only ingress infrastructure
- Keep only shared resources needed for agent platform:
  - ECS cluster
  - shared EFS filesystem
  - SGs for ECS tasks and EFS/NFS
  - shared OpenClaw ECR repository
- Export identifiers required by agent stacks.
- Exit criteria: shared stack contains only OpenClaw runtime primitives.

## Step 3: Implement Per-Agent Compute Construct
- Add agent-focused stack/construct (for example `resources/stacks/fargate/agent/index.ts`).
- For each agent create:
  - EFS access point rooted to `/agents/<agent-id>` with uid/gid 1000
  - agent task role (least privilege)
  - task definition and container
  - per-agent CloudWatch log group
  - Fargate service (`desiredCount=1`, circuit breaker, ECS Exec)
- Networking:
  - deploy tasks in public subnets
  - assign public IP enabled
- Mount EFS access point to `/home/node/.openclaw`.
- Exit criteria: each agent is isolated and independently deployable.

## Step 4: Wire Orchestration To Agents
- Replace service-switch logic in `resources/stacks/main/index.ts` with agent iteration.
- Remove imports/branches for unused template service types.
- Keep environment-loop orchestration in `lib/openclaw-stack.ts` and pass `project.agents`.
- Exit criteria: adding/removing agents only requires updating `properties/index.ts`.

## Step 5: Implement Secrets Bootstrap Workflow
- Add local manifest templates:
  - `properties/secrets/agents.secrets.example.json`
  - optional `.env.example` for local editing convenience
- Add `helpers/secrets/push-agent-secrets.sh` to upsert Secrets Manager entries.
- Script requirements:
  - supports `--env`, `--region`, `--profile`
  - validates required keys before upload
  - masks secrets in logs
- Exit criteria: repeatable local-to-AWS secret provisioning flow exists.

## Step 6: Enforce Least Privilege
- Task role scope:
  - `secretsmanager:GetSecretValue` only for that agent secret ARN
  - EFS client mount/write permissions only for that access point
  - only required CloudWatch log permissions
- Remove wildcard IAM from template baseline.
- Exit criteria: each agent has only role-specific credentials and permissions.

## Step 7: Docker/OpenClaw Bootstrap Contract
- Pass bootstrap payloads via env vars (`OPENCLAW_JSON`, `OPENCLAW_SOUL_MD`, `OPENCLAW_AUTH_PROFILES_JSON`).
- Ensure runtime command supports first-boot (`--allow-unconfigured`).
- Keep config persistence on EFS so task restart does not reinitialize unless forced.
- Exit criteria: first boot initializes config, subsequent boots reuse persisted state.

## Step 8: Validation Gates (CDK-Only)
- Run in this order:
  1. `cdk list`
  2. `cdk synth`
  3. `cdk diff`
  4. `cdk deploy`
- Post-deploy checks:
  - all agent services steady state
  - Slack socket mode connectivity per agent
  - per-agent log group receiving logs
  - EFS persistence survives service restart
  - restarting one service does not affect others
- Exit criteria: all checks pass in at least one environment.

## Step 9: Documentation And Handoff
- Update README with:
  - agent config model
  - secrets bootstrap script usage
  - deployment and validation commands
  - operational runbook for adding an agent
- Exit criteria: new team member can add and deploy an agent without tribal knowledge.

## File-Level Change Map
- `properties/index.ts`
- `lib/openclaw-stack.ts`
- `resources/stacks/main/index.ts`
- `resources/stacks/shared/index.ts`
- `resources/stacks/fargate/agent/index.ts` (new)
- `helpers/secrets/push-agent-secrets.sh` (new)
- `properties/secrets/agents.secrets.example.json` (new)
- `README.md`

## Done Criteria
1. Platform deploys only required agent resources (no ALB/Route53/GA).
2. One shared ECR repo is used by all agents.
3. Each agent has isolated EFS access point and dedicated log group.
4. Secrets are sourced from Secrets Manager and mapped by agent.
5. Agent runtime matches OpenClaw Docker requirements (path, UID/GID, gateway token when exposed).
6. New agent onboarding is a config-only change in `properties/index.ts` + secret creation.
