# OpenClaw Multi-Agent Platform — Requirements Document

## Project Overview

Deploy and manage multiple isolated OpenClaw AI agents on AWS, where each agent runs as an independent Fargate service within a shared ECS cluster. The system uses EFS for persistent storage and Slack as the primary communication channel. A CDK project defines the entire infrastructure as code, enabling repeatable, single-command deployments.

---

## Goals

1. **Agent isolation** — Each agent operates as a fully independent unit. One agent crashing, restarting, or misbehaving has zero impact on others.

2. **Declarative deployment** — Define all agents in CDK. A single `cdk deploy` provisions the full fleet from scratch with no manual steps, no interactive wizards, and no one-off tasks.

3. **Self-bootstrapping containers** — Each agent container checks for configuration on its EFS volume at startup. If this is a first boot on a fresh volume, the container writes its own configuration files before starting the gateway. No external scripts, Lambdas, or human intervention required.

4. **Least-privilege permissions** — Each agent receives only the credentials and tool access it needs for its specific role. A product manager agent cannot push code. A coding agent cannot delete infrastructure.

5. **Minimal operational surface** — No extra services to manage beyond what's strictly necessary. No additional Lambdas, no separate databases, no custom orchestration layers. Just ECS, EFS, SSM, and the agents themselves.

---

## Agents

The initial deployment includes 4–5 agents, each with a distinct role, model, resource allocation, and permission set. Examples:

**Product Manager** — Reads GitHub issues, manages project tracking, drafts specs. Read-only access to repositories. Lightweight resources. Uses a fast, cost-effective model.

**Fullstack Engineer** — Writes code, creates branches, opens PRs, runs builds. Full read-write GitHub access. Higher CPU and memory allocation. Uses the most capable model available.

**DevOps / SRE** — Monitors infrastructure, manages deployments, reads logs. Access to AWS-related tooling and GitHub Actions workflows. Moderate resources.

**Alert Monitor** — Watches for notifications, triages incoming signals, routes to the right agent or person via Slack. Minimal resources. Uses the cheapest, fastest model.

**Researcher** — Browses the web, reads documentation, synthesizes information. Browser tool access enabled. No write access to repositories or infrastructure.

The exact agent roster is configurable. Adding or removing an agent means adding or removing a construct in CDK and redeploying.

---

## Architecture

### Compute — ECS Fargate

All agents run in a single ECS cluster. Each agent is a separate ECS Fargate service with a desired count of one. Services are independent — they have their own task definitions, their own scaling configuration, and their own health checks.

The OpenClaw Docker image is built once, pushed to ECR, and shared across all agents. Each agent gets its identity from environment variables and EFS configuration, not from the image itself.

### Storage — EFS

A single EFS filesystem is shared across all agents. Each agent gets its own EFS access point, rooted at a dedicated subdirectory (e.g., `/pm/`, `/fullstack/`, `/alerts/`). Access points enforce POSIX uid/gid 1000 to match the `node` user inside the OpenClaw container.

From each agent's perspective, it sees `/home/node/.openclaw/` as its own private storage. Agents cannot read or write each other's data.

EFS stores everything OpenClaw needs to persist: configuration files, agent workspaces, session history, channel credentials, and skill data.

### Secrets — SSM Parameter Store

All sensitive values (Slack tokens, LLM API keys, GitHub PATs) are stored as SecureString parameters in SSM Parameter Store under a per-agent path (e.g., `/openclaw/pm/*`, `/openclaw/fullstack/*`).

ECS injects these as environment variables at task launch time. Secrets never touch disk, never appear in task definitions, and never get written to EFS. They exist only in memory inside the running container.

### Networking

Each Fargate task gets a public IP for outbound internet access. This is required for Slack Socket Mode, which initiates outbound WebSocket connections to Slack's servers.

No inbound load balancer is needed for Slack communication. Socket Mode is outbound-only.

If the OpenClaw Control UI needs to be exposed for any agent, an ALB or Tailscale can be added later, but it is not a launch requirement.

### Logging — CloudWatch

All agents log to a shared CloudWatch log group with per-agent stream prefixes. This allows filtering logs by agent while keeping everything in one place.

---

## Slack Integration

Each agent has its own Slack app, created manually in the Slack App Console before deployment. Each Slack app provides:

- A bot token (`xoxb-...`) for posting messages and reading channels
- An app token (`xapp-...`) for Socket Mode WebSocket connections
- A distinct bot identity (name, icon) so users can tell agents apart in Slack

Each agent connects independently to Slack via Socket Mode. There is no shared Slack app and no shared bot identity.

Slack tokens are stored in SSM and injected as environment variables. The OpenClaw gateway reads them from the standard `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN` environment variables.

Each Slack app requires the following bot scopes: `chat:write`, `channels:history`, `channels:read`, `groups:history`, `im:history`, `mpim:history`, `users:read`, `app_mentions:read`, `assistant:write`, `reactions:read`, `reactions:write`, `files:read`, `files:write`, `commands`.

Socket Mode must be enabled with an app-level token scoped to `connections:write`.

Event subscriptions: `app_mention`, `message.channels`, `message.groups`, `message.im`, `message.mpim`, `reaction_added`, `reaction_removed`.

---

## Permission Model

Permissions are enforced at three layers:

### Layer 1: Credential Scoping (hard boundary)

Each agent receives only the credentials it needs. A product manager agent gets a GitHub PAT with `repo:read` and `issues:read`. A fullstack agent gets a PAT with full `repo`, `workflow`, and `write:packages` scopes. An alert agent may get no GitHub token at all.

This is the primary security boundary. Even if all other controls fail, an agent physically cannot perform actions its tokens don't authorize.

### Layer 2: Tool Allow/Deny Lists (process boundary)

OpenClaw's per-agent tool configuration restricts which tools the gateway makes available. Tools include `exec`, `read`, `write`, `edit`, `apply_patch`, `browser`, `process`, and session management tools.

A deny list blocks specific tools. An allow list limits the agent to only the listed tools. Deny always wins over allow.

This prevents an agent from attempting actions that its credentials might technically permit but that its role should not perform.

### Layer 3: Per-Agent Skills (capability boundary)

Each agent's workspace contains its own `skills/` directory. Skills define what the agent knows how to do — git workflows, project management, deployment pipelines, research techniques.

An agent without a coding skill won't attempt to write code, even if its tools and credentials would allow it.

---

## Container Bootstrap Process

Each agent uses a custom Docker image that extends the official OpenClaw image with an entrypoint script. The script runs before the gateway starts and handles first-boot configuration:

1. Check if `~/.openclaw/openclaw.json` exists on EFS.
2. If it does not exist (first boot on a fresh EFS volume):
   - Create the required directory structure (`workspace/`, `agents/main/agent/`, `agents/main/sessions/`).
   - Write `openclaw.json` from an environment variable provided by the task definition.
   - Write `SOUL.md` (system prompt) from an environment variable.
   - Write `auth-profiles.json` with the appropriate provider configuration.
3. Start the OpenClaw gateway with `--allow-unconfigured`.

On subsequent boots (container restarts, redeployments, ECS task replacements), the config already exists on EFS and the gateway starts immediately.

Configuration updates are handled by updating the environment variables in CDK and redeploying. The entrypoint script can be extended to detect config changes and update files on EFS if needed, or a force-rewrite flag can be set.

---

## CDK Project Structure

The CDK project defines a reusable construct that encapsulates everything needed for one agent. The main stack instantiates this construct once per agent.

### Shared Infrastructure (created once)

- VPC with public subnets (for outbound internet)
- ECS Fargate cluster
- EFS filesystem with mount targets in each subnet
- CloudWatch log group
- ECR repository for the OpenClaw image
- IAM execution role (shared across agents — pulls images, reads SSM, pushes logs)
- Security groups (one for EFS NFS traffic, one for Fargate tasks)

### Per-Agent Resources (created per agent via construct)

- EFS access point (unique root directory, uid/gid 1000)
- SSM SecureString parameters for Slack tokens, API keys, GitHub PAT
- IAM task role (scoped to that agent's EFS access point and SSM path)
- ECS task definition (CPU, memory, image, EFS volume, secrets, environment variables containing the agent's `openclaw.json` and `SOUL.md`)
- ECS Fargate service (desired count 1, circuit breaker enabled, ECS Exec enabled)

### What the construct accepts as input

- Agent ID and display name
- Model identifier
- CPU and memory allocation
- System prompt text
- Slack bot token and app token (as SSM parameter references)
- LLM provider API key (as SSM parameter reference)
- Optional GitHub PAT (as SSM parameter reference)
- Tool allow and deny lists
- OpenClaw JSON configuration overrides

---

## Sandboxing

OpenClaw's built-in agent sandboxing feature relies on Docker-in-Docker, which is not available in Fargate. Sandboxing is disabled for all agents.

Tool allow/deny lists and credential scoping serve as the alternative containment strategy.

If full sandboxing becomes a requirement, the compute layer would need to move to ECS on EC2 with Docker socket access.

---

## What Is Not In Scope

- **Control plane / fleet dashboard** — May be added later. For now, agents are managed through CDK and the AWS console.
- **Agent-to-agent direct messaging** — OpenClaw's `agentToAgent` tool only works within a single gateway. Cross-agent communication happens through Slack (one bot messages a channel where another bot listens).
- **Auto-scaling** — Each agent runs exactly one task. There is no horizontal scaling.
- **Database** — No external database. OpenClaw's file-based sessions and configuration on EFS are sufficient.
- **Custom domain / HTTPS** — The Control UI is not exposed publicly. Access is via ECS Exec or optionally Tailscale.
- **CI/CD pipeline** — The Docker image is built and pushed manually or via a separate pipeline. CDK handles only infrastructure.
- **Cost optimization** — No Fargate Spot, no scale-to-zero. Agents run continuously. Cost optimization can be layered in later.

---

## Success Criteria

1. Running `cdk deploy` on a clean AWS account produces a fully operational fleet of agents with no manual intervention beyond pre-creating Slack apps and storing their tokens in SSM.
2. Each agent responds to Slack messages independently within 60 seconds of deployment completing.
3. Stopping or crashing one agent has no observable effect on the others.
4. Redeploying a single agent (via CDK) preserves its session history and workspace data on EFS.
5. Adding a new agent requires only adding a new construct instantiation in CDK and running `cdk deploy`.
