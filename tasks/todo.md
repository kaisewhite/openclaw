# TODO

## Plan: Stack Name Collision Elimination

- [x] Inspect current stack naming and deployment script behavior.
- [x] Verify CDK artifacts now produce unique physical stack names.
- [x] Verify deployment script only targets intended child artifacts.
- [x] Apply any final code adjustments required to guarantee uniqueness.
- [x] Validate with `cdk list` and `cdk synth`.
- [x] Document review results and residual risks.

## Review

- `infrastructure/bin/openclaw.ts` root stack name set to `openclaw-root-cdk`.
- `npx cdk list --profile mostrom_mgmt` now shows unique physical names:
  - `OpenclawStack/openclaw-cdk (openclaw-cdk)`
  - `OpenclawStack (openclaw-root-cdk)`
- Duplicate physical stack-name check returned no duplicates.
- `infrastructure/scripts/misc.sh` now targets only artifacts matching `^OpenclawStack/`, preventing accidental root wrapper deployment.
- `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.
- `bash infrastructure/scripts/misc.sh` executed successfully end-to-end (all target stacks deployed/no changes) with no name-collision failures.
- `openclaw-linear-dispatcher` exists and is Active after deploy.
- Residual risk: script still deploys both parent and nested child artifacts (safe but redundant); can be optimized separately for deploy speed.

## Plan: Linear Webhook URL Auth Verification

- [x] Diff code changes relevant to URL auth behavior.
- [x] Validate infrastructure templates synth cleanly.
- [x] Run automated test suite.
- [x] Verify live unsigned request behavior.
- [x] Verify live signed request behavior.
- [x] Verify CloudWatch logs show handler execution.

## Review: Linear Webhook URL Auth Verification

- Diff confirms dispatcher Lambda now includes explicit public `lambda:InvokeFunction` permission in CDK.
- `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.
- `npm test -- --runInBand` passes (1/1 suites, 1/1 tests).
- Unsigned URL call now returns app-level `401 invalid_signature` (previously AWS-level `403 Forbidden`).
- Signed URL call returns `200` with JSON body (`{"ok": true, "notified": false, "reason": "irrelevant_event"}` for test payload).
- CloudWatch logs (`/aws/lambda/openclaw-linear-dispatcher`) show request IDs for both unsigned rejects and signed accept path, proving handler execution.

## Plan: Linear -> Lambda -> Slack Incident Debug

- [x] Verify currently deployed webhook URL and Lambda health.
- [x] Inspect recent Lambda logs for incoming Linear deliveries.
- [x] Validate dispatcher integration secret values and required key presence.
- [x] Query Linear API for active webhooks and compare URL/secret assumptions.
- [x] Execute controlled end-to-end test payloads through Lambda to Slack.
- [x] Implement targeted fix and re-verify with logs and delivery evidence.

## Review: Linear -> Lambda -> Slack Incident Debug

- Root cause 1: integration secret had non-real assignee mappings:
  - placeholder Linear UUIDs in `LINEAR_ASSIGNEE_TO_SLACK_USER_MAP`
  - non-matching emails (missing hyphen, e.g. `fullstackagent@...` vs `fullstack-agent@...`)
- Root cause 2: integration secret used Slack bot token for `linear_dispatcher` app which was not in `#development` (`chat.postMessage` returned `not_in_channel`).
- Linear webhook is configured correctly and enabled:
  - URL: `https://bw4rphfhshwnxhlujvvumao6da0knbfq.lambda-url.us-east-1.on.aws/`
  - resource types include `Issue` and `Comment`.
- Fixes applied:
  - Updated AWS integration secret assignee maps to real Linear user IDs and emails.
  - Updated local `infrastructure/properties/secrets/linear-dispatcher.secrets.json` mapping template to match real format.
  - Updated integration secret `SLACK_BOT_TOKEN` to a known channel-capable token (from `fullstack-agent`) for immediate dispatch.
  - Added explicit info logs in dispatcher Lambda for routed/skipped/ignored events.
- Verification:
  - Signed assignment payload now returns: `{"ok": true, "notified": true, "route": "assignee_id", "kind": "issue_assignment"}`
  - CloudWatch shows: `Issue event dispatched to Slack: route=assignee_id type=issue action=update`
  - Dispatcher token identity restored to `linear_dispatcher` after channel invite.
  - Direct Slack probe confirmed post succeeds in `C0AGWNWB2MV` as `Linear Dispatcher`.

## Plan: Remove Diagnostic Event Line From Slack Notifications

- [x] Remove event/route debug line from assignment Slack message.
- [x] Remove event/route debug line from comment Slack message.
- [x] Deploy dispatcher Lambda and verify signed webhook still notifies.

## Review: Remove Diagnostic Event Line From Slack Notifications

- Assignment notification message no longer includes `Event: ... (route: ...)`.
- Comment notification message no longer includes `Event: ... (route: ...)`.
- Deployed `OpenclawStack/openclaw-cdk` successfully.
- Signed assignment webhook test returned:
  - `200 {"ok": true, "notified": true, "route": "assignee_id", "kind": "issue_assignment"}`
- CloudWatch confirms dispatch path executed after deploy:
  - `Issue event dispatched to Slack: route=assignee_id type=issue action=update`

## Plan: Agent Assignment Acknowledgement In Soul Prompts

- [ ] Add mandatory Slack acknowledgment behavior to each active agent soul prompt.
- [ ] Update workflow ordering so acknowledgement happens before execution.
- [ ] Validate prompt updates are present across all agents.
- [ ] Run CDK synth for `OpenclawStack/openclaw-cdk` to ensure no infra config regression.

## Plan: Slack Identity Clarity For Agent Assignment

- [x] Verify current soul assignment rules and identify ambiguity around symbolic mentions vs Slack user IDs.
- [x] Update all agent soul prompts to treat `<@U...>` mention-to-self as authoritative assignment signal.
- [x] Improve dispatcher assignment message to include assignee email context when available.
- [x] Validate changes by diffing prompt + lambda behavior and document review notes.

## Review: Slack Identity Clarity For Agent Assignment

- Updated all active agent souls to use real Slack mention semantics:
  - `architect-agent.md`
  - `senior-fullstack-agent.md`
  - `qa-automation-agent.md`
  - `product-agent.md`
- Assignment rule now explicitly treats dispatcher message `Hey <@U...> ... assigned to you` as authoritative when mention resolves to the agent's own Slack user ID.
- Dispatcher assignment message now includes `Assigned Identity` email (when available from Linear issue context) to provide a second unambiguous identity signal.
- Added assignment enrichment step in Lambda:
  - when assignment payload lacks assignee email, fetch issue context from Linear and merge before routing/message composition.
- Validation evidence:
  - `python3 -m py_compile infrastructure/resources/lambda/lambda_code/app.py` passes.
  - Diff confirms all soul prompts and lambda message/routing paths were updated as intended.

## Plan: Fix Invalid Root-Level Subagents Override

- [x] Move `subagents` override under schema-valid `agents.defaults.subagents`.
- [x] Verify no root-level `subagents` override remains in agent config overrides.
- [x] Run `cdk synth` to validate generated stack/config remains valid.

## Review: Fix Invalid Root-Level Subagents Override

- Updated `infrastructure/properties/index.ts`:
  - `architectSubagentOverrides` now uses `agents.defaults.subagents`.
  - `fullstackSubagentOverrides` now uses `agents.defaults.subagents`.
- Verification:
  - `rg -n "\\bsubagents\\b" infrastructure/properties/index.ts` only shows nested `subagents` entries.
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.

## Plan: Notion Access Documentation

- [x] Review current infra docs and OpenClaw Notion skill requirements.
- [x] Add a dedicated markdown runbook describing end-to-end Notion access enablement for agents.
- [x] Link the runbook from infrastructure README.
- [x] Validate paths and references.

## Review: Notion Access Documentation

- Added runbook: `infrastructure/docs/notion-agent-access.md`.
- Runbook covers:
  - Notion integration creation
  - page/data source sharing requirements
  - adding `NOTION_API_KEY` in agent secret payloads
  - mapping `NOTION_API_KEY` in `properties/index.ts` (`requiredKeys`/`optionalKeys`)
  - deploy + runtime/API verification
  - troubleshooting paths for 401/403/missing env
- Added README link under `Source Of Truth`:
  - `infrastructure/README.md` now points to the Notion runbook.

## Plan: Add Notion API Key To CDK Agent Secrets

- [x] Add `NOTION_API_KEY` to default agent required secret keys in CDK properties.
- [x] Add `NOTION_API_KEY` to the agent secrets example manifest for all agents.
- [x] Update infrastructure README required keys list.
- [x] Run `cdk synth` to validate stack generation.

## Review: Add Notion API Key To CDK Agent Secrets

- Updated `infrastructure/properties/index.ts`:
  - `defaultRequiredSecretKeys` now includes `NOTION_API_KEY`, so all agents receive it via ECS secret injection.
- Updated `infrastructure/properties/secrets/agents.secrets.example.json`:
  - added `NOTION_API_KEY` under each agent's `values` block.
- Updated `infrastructure/README.md` required key list to include `NOTION_API_KEY`.
- Verification:
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.

## Plan: Diagnose Fullstack Agent Circuit Breaker Rollback

- [x] Pull ECS service deployment events for `fullstack-agent`.
- [x] Inspect failed task stop reasons and container exit data.
- [x] Inspect container logs for failed task attempts.
- [x] Patch invalid OpenClaw subagent config key causing startup failure.
- [x] Run `cdk synth` to validate post-fix stack generation.

## Review: Diagnose Fullstack Agent Circuit Breaker Rollback

- Deployment `ecs-svc/6440272065184171619` failed with repeated task starts on task definition `mgmt-fullstack-agent:13`, then circuit breaker rollback.
- Failed task logs showed:
  - `Invalid config at /home/node/.openclaw/openclaw.json`
  - `agents.defaults.subagents: Unrecognized key: "allowAgents"`
- Root cause:
  - `allowAgents` was set under `agents.defaults.subagents`, but OpenClaw schema only permits `allowAgents` in per-agent runtime subagent config (`agents.list[].subagents`), not defaults.
- Fix applied:
  - Removed invalid `allowAgents` from both `architectSubagentOverrides` and `fullstackSubagentOverrides`.
  - Kept valid defaults (`maxConcurrent`, `runTimeoutSeconds`, `archiveAfterMinutes`).
- Verification:
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.

## Plan: Auto-Prune Stale Invalid Subagent Default Keys

- [x] Inspect bootstrap merge behavior for persisted EFS config carry-over.
- [x] Add startup-time prune for stale invalid key `agents.defaults.subagents.allowAgents`.
- [x] Validate bootstrap script syntax and key references.
- [x] Document required redeploy path to apply bootstrap fix.

## Review: Auto-Prune Stale Invalid Subagent Default Keys

- Root cause persisted after config fix because `openclaw-bootstrap.mjs` deep-merges existing EFS `openclaw.json` and does not delete removed keys.
- Added `pruneLegacyInvalidConfigKeys()` in `infrastructure/docker/openclaw-bootstrap.mjs` to remove:
  - `agents.defaults.subagents.allowAgents`
- Bootstrap now logs when stale keys are removed:
  - `[bootstrap] Removed stale config keys: agents.defaults.subagents.allowAgents`
- Validation:
  - `node --check infrastructure/docker/openclaw-bootstrap.mjs` passes.

## Plan: Fix Slack Assignment Trigger From Dispatcher Bot Messages

- [x] Inspect architect agent runtime/event handling path for dispatcher assignment messages.
- [x] Confirm whether Slack bot-authored messages are filtered by default.
- [x] Update agent Slack channel config overrides to allow bot-authored messages.
- [x] Validate stack synthesis after config change.

## Review: Fix Slack Assignment Trigger From Dispatcher Bot Messages

- Root cause:
  - OpenClaw Slack handler drops bot-authored messages unless `channels.slack.allowBots=true`.
  - Dispatcher posts are bot-authored (`Linear Dispatcher`), so assignments never reached agent runtime for acknowledgment logic.
- Evidence:

  - `openclaw/src/slack/monitor/message-handler/prepare.ts` drops bot messages when `allowBots=false`.
  - `openclaw/docs/gateway/configuration-reference.md` states default `allowBots: false`.
- Fix:
  - Set `allowBots: true` in `defaultSlackOverrides` (`infrastructure/properties/index.ts`).
- Validation:
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.

## Plan: Enforce Concise Slack Responses With Full Detail In Linear

- [x] Update all agent soul prompts with explicit Slack-vs-Linear output policy.
- [x] Require concise Slack summaries and prohibit long analysis dumps in channel.
- [x] Add workflow steps that publish full analysis in Linear, then short Slack pointer.
- [x] Verify prompt updates exist across architect/fullstack/qa/product agents.

## Review: Enforce Concise Slack Responses With Full Detail In Linear

- Updated:
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/senior-fullstack-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
  - `infrastructure/agent-assets/agents/product-agent.md`
- Added `Slack vs Linear Output Policy (Required)` to each agent:
  - Slack must stay concise (short status + key bullets + pointer).
  - Full analysis/spec/report content must go to Linear issue comments.
- Updated workflows so each agent posts detailed output to Linear first, then concise Slack update.

## Plan: Fullstack Periodic Progress Updates In Slack + Linear

- [x] Add explicit progress cadence requirements to the fullstack soul prompt.
- [x] Require each cadence update in both Slack (concise) and Linear comments (detailed).
- [x] Integrate cadence checkpoints into the workflow steps.
- [x] Verify prompt text includes the new cadence and posting rules.

## Review: Fullstack Periodic Progress Updates In Slack + Linear

- Updated `infrastructure/agent-assets/agents/senior-fullstack-agent.md` with a new required section:
  - `Progress Update Cadence (Required)`
  - progress updates required every 20 minutes (or milestone/blocker), in both Slack and Linear comments.
- Added required payload for each update:
  - phase delta, blocker status, next action, next update ETA.
- Workflow now includes:
  - kickoff update to Slack + Linear at start.
  - recurring cadence updates during implementation.
  - concise completion update in Slack with full details in Linear/PR.
- Verification:
  - `rg -n "Progress Update Cadence|every 20 minutes|kickoff progress update|cadence updates" infrastructure/agent-assets/agents/senior-fullstack-agent.md` confirms the new policy and workflow steps are present.

## Plan: Apply Periodic Progress Updates To All Agents

- [x] Add progress cadence policy to architect agent soul.
- [x] Add progress cadence policy to product agent soul.
- [x] Add progress cadence policy to QA agent soul.
- [x] Integrate cadence checkpoints into each agent workflow.
- [x] Verify all four active agents now include cadence policy text.

## Review: Apply Periodic Progress Updates To All Agents

- Updated:
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/product-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
- Added `Progress Update Cadence (Required)` to each:
  - updates every 20 minutes (or milestone/blocker)
  - mirrored updates to Slack (concise) + Linear comments (detailed)
  - required content: phase delta, blocker status, next action, next update ETA
  - required pause notice before silence
- Workflow changes:
  - each agent now posts kickoff update to Slack + Linear
  - each agent now posts recurring cadence updates during execution
- Verification:
  - `rg -n "^## Progress Update Cadence|every 20 minutes" infrastructure/agent-assets/agents/*.md`

## Plan: Prevent Lost-Context "No Record" Responses

- [x] Add assignment continuity and recovery rules to fullstack agent soul.
- [x] Add assignment continuity and recovery rules to architect, product, and QA souls.
- [x] Require durable local journal writes per ticket and recovery checks before context-loss claims.
- [x] Update workflow steps to create/update journals and append during cadence updates.
- [x] Verify continuity sections and workflow hooks exist across all active agent souls.

## Review: Prevent Lost-Context "No Record" Responses

- Updated:
  - `infrastructure/agent-assets/agents/senior-fullstack-agent.md`
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/product-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
- Added `Assignment Continuity & Recovery (Required)` to each soul:
  - never claim "no record/not assigned" before recovery checks
  - durable journal per ticket at `tasks/agent-journal/<TICKET-ID>.md`
  - recovery sequence: local journal -> Linear issue -> Slack history
  - if still incomplete, post explicit context-recovery update and proceed from Linear source of truth
- Workflow now requires:
  - journal creation/update immediately after assignment acknowledgement
  - journal append during recurring cadence updates
- Verification:
  - `rg -n "^## Assignment Continuity & Recovery|tasks/agent-journal/<TICKET-ID>.md|context-recovery" infrastructure/agent-assets/agents/*.md`

## Plan: Enforce OpenClaw Memory Workflow Across Agents

## Plan: Agent Secrets Manager Read-All (Read-Only)

- [x] Locate IAM policies attached to agent execution/task roles.
- [x] Keep execution role secret access scoped for ECS injection.
- [x] Grant task role read-only access to all Secrets Manager secrets.
- [x] Verify no Secrets Manager write actions are granted.
- [x] Run `cdk synth` and inspect generated IAM statements.

## Review: Agent Secrets Manager Read-All (Read-Only)

- Updated `infrastructure/resources/agent/index.ts`:
  - renamed scoped policy to `scopedSecretReadPolicy` for execution role secret injection.
  - added `allSecretsReadOnlyPolicy` on agent task role with:
    - `secretsmanager:GetSecretValue`
    - `secretsmanager:DescribeSecret`
    - `secretsmanager:ListSecretVersionIds`
    - `secretsmanager:ListSecrets`
    - `secretsmanager:BatchGetSecretValue`
  - resource scope is `*` to include cross-account secret ARNs (including development account).
- Validation:
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling`
  - `rg -n "secretsmanager:(PutSecretValue|UpdateSecret|CreateSecret|DeleteSecret|TagResource|UntagResource|RotateSecret|ReplicateSecretToRegions)" cdk.out/*.template.json -S` returns no matches.
  - synthesized fullstack task role policy includes read-only secrets actions with `Resource: "*"` in:
    - `cdk.out/OpenclawStackopenclawcdkopenclawfullstackagentcdk08B7B2FF.template.json`

## Plan: Enforce Strict Repo Scope In Ticketing And Execution

- [x] Add explicit repo URL requirements for ticket-creating agents.
- [x] Add strict repo-scope validation before code/test execution for implementation/review agents.
- [x] Add pause/escalation behavior when repo scope is missing or ambiguous.
- [x] Update workflow steps so repo scope is confirmed early and echoed in kickoff updates.
- [x] Verify repo-scope contract language exists in all active agent souls.

## Review: Enforce Strict Repo Scope In Ticketing And Execution

- Updated:
  - `infrastructure/agent-assets/agents/product-agent.md`
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/senior-fullstack-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
- Added `Repository Scope Contract (Required)` in each soul.
- Ticket creators now require canonical Git repo URLs in Linear plus per-repo in/out-of-scope boundaries.
- Fullstack and QA now must read the issue end-to-end and validate repo URLs/scope before any code/test work.
- Added explicit blocker rule: if scope is missing or ambiguous, post clarification in Linear and pause.
- Verification:
  - `rg -n "^## Repository Scope Contract|canonical Git repo URL|missing/ambiguous" infrastructure/agent-assets/agents/*.md`
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling`

- [x] Add default OpenClaw config overrides for pre-compaction memory flush.
- [x] Add default OpenClaw config overrides for memory search provider/model.
- [x] Ensure architect/fullstack subagent overrides retain memory settings after merge.
- [x] Add required durable memory read/write workflow to all active agent souls.
- [x] Verify prompt/config changes and run CDK synth.

## Review: Enforce OpenClaw Memory Workflow Across Agents

- Updated `infrastructure/properties/index.ts`:
  - Added shared `defaultAgentDefaults` under `agents.defaults` with:
    - `compaction.memoryFlush` enabled and durable-memory prompts.
    - `memorySearch` enabled with `provider: gemini` and `model: gemini-embedding-001`.
  - Ensured `architectSubagentOverrides` and `fullstackSubagentOverrides` merge:
    - default memory settings + subagent settings (no overwrite regression).
- Updated agent souls:
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/senior-fullstack-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
  - `infrastructure/agent-assets/agents/product-agent.md`
- Added `Durable Memory Workflow (Required)` to each soul:
  - assignment-start memory recovery (`memory_search` + `memory_get`)
  - write durable memory entries to `memory/YYYY-MM-DD.md`
  - append memory at milestones/blockers/completion
  - require memory + continuity recovery before any context-loss claim
- Validation:
  - `rg -n "defaultAgentDefaults|memoryFlush|memorySearch|provider: \"gemini\"" infrastructure/properties/index.ts`
  - `rg -n "^## Durable Memory Workflow|memory_search|memory_get|memory/YYYY-MM-DD.md" infrastructure/agent-assets/agents/*.md`
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling`

## Plan: Rename Junior Fullstack Agent To Codex Agent

- [x] Update agent identity in infrastructure config (`id`, display name, prompt path, and secret path).
- [x] Update agent-facing assets (soul prompt title + Slack manifest name/display).
- [x] Update secret example files and dispatcher mapping placeholders to `codex-agent`.
- [x] Update README manifest list and verify no stale `junior-fullstack-agent` references remain.
- [x] Run `cdk synth` for `OpenclawStack/openclaw-cdk`.

## Review: Rename Junior Fullstack Agent To Codex Agent

- Updated `infrastructure/properties/index.ts`:
  - agent ID now `codex-agent`
  - display name now `Codex Agent`
  - soul prompt path now `agent-assets/agents/codex-agent.md`
  - secret path now `/openclaw/mgmt/agents/codex-agent`
- Updated agent assets:
  - `infrastructure/agent-assets/agents/codex-agent.md` title now `# Codex Agent`
  - `infrastructure/agent-assets/agents/manifests/codex-agent.manifest.json` app/bot display names now `Codex Agent`
- Updated example secrets/mappings:
  - `infrastructure/properties/secrets/agents.secrets.example.json` entry renamed to `codex-agent`
  - `infrastructure/properties/secrets/linear-dispatcher.secrets.example.json` placeholder assignee map now uses `replace-linear-user-id-codex` and `codex-agent@mostrom.io`
- Updated docs:
  - `infrastructure/README.md` manifest list now includes `codex-agent.manifest.json`
- Verification:
  - `rg -n "junior-fullstack-agent|Junior Fullstack Agent|junior fullstack|JRFS" infrastructure` returns no matches.
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.

## Plan: Auto-Inject Additional Agent Secret Keys

- [x] Add container secret mapping for full agent secret JSON payload.
- [x] Expand the secret JSON into environment variables in entrypoint at runtime.
- [x] Update docs to explain how newly added secret keys propagate.
- [x] Run `cdk synth` to verify infrastructure templates still compile.

## Review: Auto-Inject Additional Agent Secret Keys

- Updated [infrastructure/resources/agent/index.ts](../infrastructure/resources/agent/index.ts):
  - added `OPENCLAW_AGENT_SECRETS_JSON` container secret mapping via `ecs.Secret.fromSecretsManager(secret)`.
  - removed explicit per-key mappings; agents now hydrate env from the full secret payload only.
- Updated [infrastructure/docker/openclaw-entrypoint.sh](../infrastructure/docker/openclaw-entrypoint.sh):
  - added `hydrate_agent_secret_env()` to parse `OPENCLAW_AGENT_SECRETS_JSON` and export each key/value as env vars.
  - unsets `OPENCLAW_AGENT_SECRETS_JSON` after expansion.
- Updated docs:
  - [infrastructure/README.md](../infrastructure/README.md): documented additional key auto-propagation behavior.
  - [infrastructure/docs/gateway-token-and-ecs-exec-runbook.md](../infrastructure/docs/gateway-token-and-ecs-exec-runbook.md): added note for auto-export of new keys.
  - [infrastructure/docs/notion-agent-access.md](../infrastructure/docs/notion-agent-access.md): removed outdated `requiredKeys`/`optionalKeys` guidance.
- Verification:
  - `bash -n infrastructure/docker/openclaw-entrypoint.sh` passes.
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` passes.

## Plan: Document Gateway Token + ECS Exec Setup Runbook

- [x] Create a dedicated markdown runbook for this exact operational flow.
- [x] Include copy/paste commands for token generation, secret updates, secret push, force deployment, and ECS exec.
- [x] Include in-container Codex onboarding + verification commands.
- [x] Link the runbook from `infrastructure/README.md`.
- [x] Verify references resolve.

## Review: Document Gateway Token + ECS Exec Setup Runbook

- Added runbook:
  - `infrastructure/docs/gateway-token-and-ecs-exec-runbook.md`
- Runbook includes:
  - AWS context setup (`AWS_PROFILE`, `AWS_REGION`)
  - `OPENCLAW_GATEWAY_TOKEN` generation
  - `jq` command to update all agent entries in `agents.secrets.json`
  - `push-agent-secrets.sh` command
  - ECS `update-service --force-new-deployment` loop
  - accurate `aws ecs execute-command` one-liner
  - in-container Codex onboarding (`node /app/dist/index.js onboard --auth-choice openai-codex ...`)
  - in-container verification (`node /app/dist/index.js models status`)
  - troubleshooting notes for common failures
- Updated docs index:
  - `infrastructure/README.md` now links the runbook in the runbooks section.
- Verification:
  - `rg -n "Gateway Token \\+ ECS Exec \\+ Codex Onboarding Runbook|gateway-token-and-ecs-exec-runbook" infrastructure/README.md infrastructure/docs/gateway-token-and-ecs-exec-runbook.md`

## Plan: Remove Key-Specific Secret Mapping

- [x] Remove per-agent `requiredKeys`/`optionalKeys` secret mapping from infrastructure properties.
- [x] Use only full secret payload injection (`OPENCLAW_AGENT_SECRETS_JSON`) for agent tasks.
- [x] Keep entrypoint runtime export as the single source of env hydration.
- [x] Update docs that referenced `requiredKeys`/`optionalKeys`.
- [x] Run synth validation.

## Review: Remove Key-Specific Secret Mapping

- Updated [infrastructure/properties/index.ts](../infrastructure/properties/index.ts):
  - removed `requiredKeys`/`optionalKeys` from `AgentSecretsConfig`.
  - removed `defaultRequiredSecretKeys` and per-agent key lists.
- Updated [infrastructure/resources/agent/index.ts](../infrastructure/resources/agent/index.ts):
  - removed key-by-key ECS secret mappings.
  - container now receives only `OPENCLAW_AGENT_SECRETS_JSON`.
- Runtime behavior:
  - [infrastructure/docker/hydrate-agent-secrets.sh](../infrastructure/docker/hydrate-agent-secrets.sh) is the single script that expands all key/value pairs from full secret JSON into env vars.
  - [infrastructure/docker/openclaw-entrypoint.sh](../infrastructure/docker/openclaw-entrypoint.sh) sources the hydrator script before bootstrap.
  - [infrastructure/docker/Dockerfile](../infrastructure/docker/Dockerfile) installs the hydrator script into the runtime image.
- Updated docs:
  - [infrastructure/README.md](../infrastructure/README.md)
  - [infrastructure/docs/notion-agent-access.md](../infrastructure/docs/notion-agent-access.md)
- Verification:
  - `rg -n "requiredKeys|optionalKeys|defaultRequiredSecretKeys" infrastructure -g '!**/cdk.out/**'` returns no matches.
  - `npx cdk synth OpenclawStack/openclaw-cdk --profile mostrom_mgmt --no-bundling` succeeds.
