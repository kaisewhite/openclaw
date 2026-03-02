# Notion Access For OpenClaw Agents

This runbook documents how to give your ECS-hosted OpenClaw agents access to Notion.

## Overview

In this project, an agent can use Notion only if all of the following are true:

1. A Notion integration exists in your Notion workspace.
2. The target pages/data sources are shared with that integration.
3. `NOTION_API_KEY` is present in each agent's AWS Secrets Manager secret.
4. `NOTION_API_KEY` is mapped in `infrastructure/properties/index.ts` (`requiredKeys` or `optionalKeys`) so ECS injects it into the container.
5. Agent services are redeployed so new env/secret mappings take effect.

## 1. Create A Notion Integration

1. Open `https://www.notion.so/my-integrations`.
2. Create a new internal integration for your workspace.
3. Copy the integration secret (`ntn_...` / `secret_...`).
4. In Notion, open each target page/data source and use `Connect to` to grant the integration access.

If the integration is not connected to a page/database, API calls will fail even with a valid key.

## 2. Add `NOTION_API_KEY` To Agent Secret Payloads

Update `infrastructure/properties/secrets/agents.secrets.json` for each agent that should use Notion:

```json
{
  "id": "architect-agent",
  "secretName": "/openclaw/mgmt/agents/architect-agent",
  "values": {
    "NOTION_API_KEY": "ntn_your_real_key",
    "...": "..."
  }
}
```

Push secrets:

```bash
cd infrastructure
./scripts/secrets/push-agent-secrets.sh
```

## 3. Map `NOTION_API_KEY` Into ECS Task Secrets

In `infrastructure/properties/index.ts`, add `NOTION_API_KEY` to each target agent's `requiredKeys` or `optionalKeys`.

Recommendation:

- Use `optionalKeys` first if rollout is gradual.
- Move to `requiredKeys` once all agents are populated.

Why this is required: ECS only injects secret keys explicitly listed in `requiredKeys` / `optionalKeys` when creating container secret mappings.

## 4. Deploy Agent Stack Changes

After updating `properties/index.ts` and pushing secrets, redeploy affected agent stack(s):

```bash
cd infrastructure
npx cdk synth
npx cdk deploy
```

Only deployed tasks receive the new secret mapping.

## 5. Verify Inside A Running Agent

Exec into an agent task and verify env injection:

```bash
printenv | rg NOTION_API_KEY
```

If missing, check:

- `NOTION_API_KEY` exists in Secrets Manager secret JSON.
- Agent `requiredKeys`/`optionalKeys` includes `NOTION_API_KEY`.
- Task was replaced after deploy (new task definition revision running).

## 6. Functional API Smoke Test

Run a Notion search call from inside the container:

```bash
curl -sS -X POST "https://api.notion.com/v1/search" \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2025-09-03" \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

Expected outcomes:

- `200`: integration + permissions are working.
- `401`: invalid API key.
- `403`: key valid, but integration lacks access to the target workspace/page/data source.

## 7. Agent-Level Behavior

OpenClaw includes a bundled Notion skill (`openclaw/skills/notion/SKILL.md`) that declares:

- required env var: `NOTION_API_KEY`

Once the env var is injected and Notion permissions are granted, agents can use Notion API workflows.

## Troubleshooting

- `NOTION_API_KEY` exists in secret but not in container:
  - Missing from `requiredKeys`/`optionalKeys`, or service not redeployed.
- API returns empty results:
  - Integration is not connected to relevant Notion pages/data sources.
- Works for one agent but not another:
  - Per-agent secret payload or per-agent secret key mapping differs.
