----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|   timestamp   |                                                                                       message                                                                                        |                              logStreamName                              |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| 1772638305739 | [bootstrap] Reconciling OpenClaw runtime config                                                                                                                                      | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638305845 | [bootstrap] Config reconciled for agent 'codex-agent' (workspace='/home/node/.openclaw/workspace', config='/home/node/.openclaw/openclaw.json')                                      | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638305848 | [bootstrap] Starting gateway (bind=lan, port=18789)                                                                                                                                  | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328413 | 2026-03-04T15:32:08.413Z [canvas] host mounted at http://0.0.0.0:18789/__openclaw__/canvas/ (root /home/node/.openclaw/canvas)                                                       | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328417 | 2026-03-04T15:32:08.417Z [gateway] ⚠️  Gateway is binding to a non-loopback address. Ensure authentication is configured before exposing to public networks.                         | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328483 | 2026-03-04T15:32:08.483Z [heartbeat] started                                                                                                                                         | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328488 | 2026-03-04T15:32:08.488Z [health-monitor] started (interval: 300s, grace: 60s)                                                                                                       | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328492 | 2026-03-04T15:32:08.491Z [gateway] agent model: openai-codex/gpt-5.3-codex                                                                                                           | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328494 | 2026-03-04T15:32:08.494Z [gateway] listening on ws://0.0.0.0:18789 (PID 1)                                                                                                           | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328498 | 2026-03-04T15:32:08.498Z [gateway] log file: /tmp/openclaw/openclaw-2026-03-04.log                                                                                                   | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328501 | 2026-03-04T15:32:08.501Z [gateway] security warning: dangerous config flags enabled: gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true. Run `openclaw security audit`. | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328550 | 2026-03-04T15:32:08.550Z [browser/server] Browser control listening on http://127.0.0.1:18791/ (auth=token)                                                                          | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328556 | 2026-03-04T15:32:08.556Z [slack] [default] starting provider                                                                                                                         | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638328808 | 2026-03-04T15:32:08.807Z [slack] socket mode connected                                                                                                                               | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638329051 | 2026-03-04T15:32:09.051Z [gateway] update available (latest): v2026.3.2 (current v2026.2.26). Run: openclaw update                                                                   | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638426235 | 2026-03-04T15:33:46.235Z [gateway] device pairing auto-approved device=6b3d67a7bb91026579cce1e431ff68766854690d4d4d76bf9832fde50b3fa8f5 role=operator                                | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638487573 | 2026-03-04T15:34:47.573Z [reload] config change detected; evaluating reload (gateway.auth.token, gateway.tailscale, meta, auth, session)                                             | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638487577 | 2026-03-04T15:34:47.577Z [reload] config change requires gateway restart (gateway.auth.token, gateway.tailscale, auth)                                                               | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638487581 | 2026-03-04T15:34:47.581Z [gateway] signal SIGUSR1 received                                                                                                                           | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638487584 | 2026-03-04T15:34:47.584Z [gateway] received SIGUSR1; restarting                                                                                                                      | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638487596 | 2026-03-04T15:34:47.596Z [gmail-watcher] gmail watcher stopped                                                                                                                       | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638487604 | 2026-03-04T15:34:47.604Z [gateway] restart mode: full process restart (spawned pid 107)                                                                                              | codex-agent/mgmt-codex-agent-container/d35733f5d21449ab839039ac05fe60bd |
| 1772638621492 | [bootstrap] Reconciling OpenClaw runtime config                                                                                                                                      | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638621603 | [bootstrap] Config reconciled for agent 'codex-agent' (workspace='/home/node/.openclaw/workspace', config='/home/node/.openclaw/openclaw.json')                                      | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638621606 | [bootstrap] Starting gateway (bind=lan, port=18789)                                                                                                                                  | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651314 | 2026-03-04T15:37:31.314Z [canvas] host mounted at http://0.0.0.0:18789/__openclaw__/canvas/ (root /home/node/.openclaw/canvas)                                                       | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651319 | 2026-03-04T15:37:31.319Z [gateway] ⚠️  Gateway is binding to a non-loopback address. Ensure authentication is configured before exposing to public networks.                         | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651399 | 2026-03-04T15:37:31.399Z [heartbeat] started                                                                                                                                         | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651404 | 2026-03-04T15:37:31.404Z [health-monitor] started (interval: 300s, grace: 60s)                                                                                                       | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651408 | 2026-03-04T15:37:31.408Z [gateway] agent model: openai-codex/gpt-5.3-codex                                                                                                           | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651411 | 2026-03-04T15:37:31.411Z [gateway] listening on ws://0.0.0.0:18789 (PID 1)                                                                                                           | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651416 | 2026-03-04T15:37:31.415Z [gateway] log file: /tmp/openclaw/openclaw-2026-03-04.log                                                                                                   | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651418 | 2026-03-04T15:37:31.418Z [gateway] security warning: dangerous config flags enabled: gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true. Run `openclaw security audit`. | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651467 | 2026-03-04T15:37:31.467Z [browser/server] Browser control listening on http://127.0.0.1:18791/ (auth=token)                                                                          | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651475 | 2026-03-04T15:37:31.475Z [slack] [default] starting provider                                                                                                                         | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638651709 | 2026-03-04T15:37:31.709Z [slack] socket mode connected                                                                                                                               | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638730364 | 2026-03-04T15:38:50.364Z [reload] config change detected; evaluating reload (meta.lastTouchedAt)                                                                                     | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638730367 | 2026-03-04T15:38:50.367Z [reload] config change applied (dynamic reads: meta.lastTouchedAt)                                                                                          | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638744851 | 2026-03-04T15:39:04.851Z [reload] config change detected; evaluating reload (meta.lastTouchedAt, wizard, hooks)                                                                      | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638744854 | 2026-03-04T15:39:04.854Z [reload] config hot reload applied (hooks)                                                                                                                  | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772638819344 | 2026-03-04T15:40:19.344Z [slack] delivered reply to channel:C0AGWNWB2MV                                                                                                              | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639028910 | 2026-03-04T15:43:48.910Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639205843 | 2026-03-04T15:46:45.843Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639302764 | 2026-03-04T15:48:22.758+00:00 [tools] exec failed: HTTP_STATUS=200                                                                                                                   | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639302764 | sh: 11: python: Permission denied                                                                                                                                                    | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639302764 | Command not found                                                                                                                                                                    | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639310875 | 2026-03-04T15:48:30.875Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772639385839 | 2026-03-04T15:49:45.839Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772642231481 | 2026-03-04T16:37:11.481Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772642259474 | 2026-03-04T16:37:39.473Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772647445680 | 2026-03-04T18:04:05.680Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772647518836 | 2026-03-04T18:05:18.836Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772647949199 | 2026-03-04T18:12:29.199Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772648388518 | 2026-03-04T18:19:48.517+00:00 typing TTL reached (2m); stopping typing indicator                                                                                                     | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
| 1772648395185 | 2026-03-04T18:19:55.185Z [slack] delivered reply to user:U08L8B27KAP                                                                                                                 | codex-agent/mgmt-codex-agent-container/719c8bb9bf2b44569438ce6e040cb806 |
---

## 2026-03-04 Regression Fixes (Secret Hydration + Codex Deploy Filter)

- [ ] Reproduce and confirm secret hydration parse-failure behavior.
- [ ] Patch `infrastructure/docker/hydrate-agent-secrets.sh` to fail fast on invalid/non-object secret JSON.
- [ ] Patch `infrastructure/scripts/codex.sh` to select Codex child stacks using the actual CDK artifact prefix.
- [ ] Verify both fixes with command-line evidence (before/after style checks).
- [ ] Document results and review notes in this file.

### Review

- Pending implementation.

## 2026-03-04 Agent Non-Response Log Triage (AWS profile `mostrom_mgmt`)

- [x] Enumerate all deployed agent services and their CloudWatch log groups.
- [x] Pull recent (last 6h) log events for each agent and isolate errors/failures.
- [x] Identify shared failure patterns vs agent-specific failures.
- [x] Summarize likely root cause(s) and immediate remediation steps.

### Review

- All services are `ACTIVE` with `desired=1/running=1`, but current task streams (started ~2026-03-04 20:29Z to 20:56Z) show only bootstrap logs and no Slack provider initialization (`[slack] [default] starting provider` / `socket mode connected`).
- Earlier streams for each agent show normal Slack connectivity and replies through ~2026-03-04 18:21Z, then activity stops after task replacement.
- Runtime validation via ECS Exec on all agents shows:
  - `OPENCLAW_AGENT_SECRETS_JSON=SET`
  - `SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN`, model API keys (`OPENAI_API_KEY` / `ANTHROPIC_SETUP_TOKEN`) are `MISSING`
- Container filesystem check indicates deployed image content differs from current repo expectations:
  - `/usr/local/bin/openclaw-entrypoint.sh` in running image does not hydrate JSON secrets.
  - `/usr/local/bin/hydrate-agent-secrets.sh` is absent.
- Likely root cause: deployed image digest (`sha256:e1aa84f...`) is older/out-of-sync with the repo secret-hydration entrypoint flow, so secrets remain unexpanded and Slack/model auth never initialize.

## 2026-03-04 Direct ECS Secret Mapping Hardening

- [x] Add per-agent direct secret env key list to infrastructure properties.
- [x] Add helper to generate ECS `secrets` map from list + JSON payload secret.
- [x] Validate TypeScript build for infrastructure.

### Review

- Implemented `directEnvKeys` on agent secret config and wired ECS secret injection for critical keys.
- Verified compile with `cd infrastructure && npx tsc --noEmit`.

## 2026-03-04 Secret Injection Simplification (Remove Hydration Path)

- [x] Remove runtime hydration script usage from container entrypoint and image build.
- [x] Switch to explicit ECS secret key mappings only.
- [x] Expand per-agent key mappings to include existing operational keys.
- [x] Update docs to reflect direct mapping model.
- [x] Verify with non-emitting TS check and CDK synth.

### Review

- Removed `hydrate-agent-secrets.sh` from runtime path and deleted the script file.
- ECS secret mappings now come only from `directEnvKeys` lists in `properties/index.ts`.
- Added hard fail if an agent has no `directEnvKeys` to prevent silent misconfiguration.
- Verified with:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-codex-agent-cdk"`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-pm-agent-cdk"`
- Synth output confirms direct secret entries exist (e.g. `SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN`, provider token keys) and no `OPENCLAW_AGENT_SECRETS_JSON` mapping.

## 2026-03-05 Live Agent Runtime Verification (AWS profile `mostrom_mgmt`)

- [x] Confirm each service is running on latest expected task definition revision.
- [x] Confirm direct secret key mappings exist in each live task definition.
- [x] Exec into each running agent container and verify required env vars are present.
- [x] Confirm Slack provider initialization and socket-mode connection for each running stream.
- [x] Scan current startup streams for errors.

### Review

- Services healthy: `architect-agent`, `fullstack-agent`, `codex-agent`, `qa-agent`, `pm-agent` all `desired=1/running=1`.
- Runtime env checks succeeded in each running task:
  - `SLACK_APP_TOKEN=SET`
  - `SLACK_BOT_TOKEN=SET`
  - `OPENCLAW_GATEWAY_TOKEN=SET`
  - model key present per model family (`OPENAI_API_KEY` for Codex/QA, `ANTHROPIC_SETUP_TOKEN` for Architect/Fullstack/PM).
- Current task log streams show Slack startup success for every agent:
  - `[slack] [default] starting provider`
  - `[slack] socket mode connected`
- No startup error patterns found in any current stream.

---
## 2026-03-04/05 Full-System Elegance Review (Secrets + Slack Responsiveness + Deploy UX)

- [x] Re-verify live runtime health and message delivery (last 30 minutes, `AWS_PROFILE=mostrom_mgmt`).
- [x] Re-verify current secret injection architecture against deployed task definitions/runtime env.
- [x] Re-evaluate Slack non-response behavior against effective runtime config and logs.
- [x] Re-evaluate deployment utility ergonomics and failure modes.
- [x] Produce a simpler target architecture with migration guidance.

### Review

- Live status at `2026-03-05T01:59:28Z`:
  - All ECS services still healthy (`desired=1`, `running=1`).
  - Agents have recent delivered replies in CloudWatch (e.g. fullstack replies at `2026-03-05T01:40:34Z` through `01:40:35Z`).
- Secret injection architecture is now correct and materially simpler than hydration:
  - ECS task definitions map individual secret keys directly.
  - Runtime env confirms required keys are present.
  - No `OPENCLAW_AGENT_SECRETS_JSON` hydration dependency remains.
- Fullstack non-response root cause is channel mention gating, not secret/auth failure:
  - Runtime config has `channels.slack.groupPolicy="open"`, `channels.slack.requireMention=null`, `channels.slack.channels={}`.
  - OpenClaw default behavior for unset Slack `requireMention` is effectively `true` for channel messages.
  - In-container logs show repeated `reason:"no-mention"` drops around `2026-03-05T01:40-01:41Z` in channel `C0AGWNWB2MV`.
- Deployment utility regression confirmed:
  - `infrastructure/scripts/codex.sh` previously filtered with `^codex/` and silently selected no stacks.
  - Script now matches nested artifact suffix `/openclaw-codex-agent-cdk$`, fails fast on zero matches, and uses repo-local CDK CLI (`npm run cdk --`) to avoid global CLI schema mismatches.

### Elegant Target Design

1. Keep direct ECS secret mapping as the single secret path (already implemented).
2. Replace per-agent duplicated secret key arrays with composable key sets (shared + provider-specific) generated from helper constants/functions.
3. Make Slack channel behavior explicit instead of implicit:
   - For operational channels that should always respond, set explicit channel entries with `requireMention: false`.
   - Use `groupPolicy: "allowlist"` when possible to bound exposure/noise.
4. Add observability for gating decisions:
   - Promote/drop `no-mention` decisions into CloudWatch-visible structured logs/metrics so operators can distinguish "agent down" vs "policy drop" quickly.
5. Keep deployment scripts fail-loud by default:
   - Non-empty stack selection checks.
   - Local pinned CDK CLI usage.


## 2026-03-05 DirectEnvKeys Deduplication

- [x] Define shared/provider secret key sets and a single helper to compose `directEnvKeys`.
- [x] Replace per-agent repeated arrays in `infrastructure/properties/index.ts` with helper calls.
- [x] Preserve existing effective key coverage per agent.
- [x] Validate with `cd infrastructure && npx tsc --noEmit`.
- [x] Document results in this file.

### Review

- Added shared key sets and a single `buildDirectEnvKeys(...)` helper in `infrastructure/properties/index.ts`.
- Replaced all five repeated per-agent `directEnvKeys` arrays with helper-based composition.
- Preserved effective key coverage:
  - `architect-agent`, `fullstack-agent`: anthropic + shared + voice-automation keys.
  - `codex-agent`, `qa-agent`: openai-codex + shared + voice-automation keys.
  - `pm-agent`: anthropic + shared + voice-automation keys.
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && npx ts-node --transpile-only -e 'import { project } from "./properties"; ...'` to print resolved `directEnvKeys` per agent.

## 2026-03-05 DirectEnvKeys Requirement Correction (All Agents Need Voice Keys)

- [x] Update key composition so `GMAIL_APP_PASSWORD` and `GOOGLE_VOICE_NUMBER` are included for every agent.
- [x] Remove unnecessary split/flag logic from direct env key helpers.
- [x] Validate resolved keys and type-check.
- [x] Document results.

### Review

- Moved `GMAIL_APP_PASSWORD` and `GOOGLE_VOICE_NUMBER` into the shared key set so all agents receive them by default.
- Removed `directEnvVoiceAutomationKeys` and `includeVoiceAutomation` helper parameter.
- Verified all agents now resolve with both voice keys via `ts-node` inspection.
- Type-check passed: `cd infrastructure && npx tsc --noEmit`.

## 2026-03-05 Cross-Account Developer Role Assume Grant

- [x] Grant agent ECS task roles permission to `sts:AssumeRole` on `arn:aws:iam::896502667345:role/cross-account-developer`.
- [x] Validate infrastructure TypeScript compiles cleanly.
- [x] Document result and deployment note.

### Review

- Added a dedicated `crossAccountAssumeRolePolicy` in `infrastructure/resources/agent/index.ts` and attached it to each agent `taskRole`.
- Policy allows `sts:AssumeRole` on `arn:aws:iam::896502667345:role/cross-account-developer`.
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk"` and confirmed synthesized IAM policy contains the target role ARN.
- Deployment note: this updates management-account task-role permissions; target account role trust policy still must trust the relevant task roles (or a trusted parent role) for assume-role calls to succeed.

## 2026-03-05 Gateway Token Mismatch (Subagent Spawn Blocker)

- [x] Triage `qa-agent` token mismatch errors from CloudWatch + container state.
- [x] Identify root cause in bootstrap/config behavior.
- [x] Implement permanent fix in bootstrap.
- [x] Apply immediate runtime mitigation to running agents.
- [x] Verify token alignment and post-fix log behavior.

### Review

- Error reproduced from logs at `2026-03-05T16:41:32Z` on `qa-agent`:
  - `[ws] unauthorized ... reason=token_mismatch`
  - `gateway connect failed: unauthorized: gateway token mismatch`
- Root cause:
  - Agent env token (`OPENCLAW_GATEWAY_TOKEN`) differed from persisted `gateway.auth.token` in `/home/node/.openclaw/openclaw.json`.
  - Some local backend gateway-client paths can fall back to config token, causing localhost auth mismatch.
- Permanent code fix:
  - `infrastructure/docker/openclaw-bootstrap.mjs` now writes `gateway.auth.token` from `OPENCLAW_GATEWAY_TOKEN` during bootstrap reconciliation.
- Immediate mitigation applied in running tasks:
  - Synced `gateway.auth.token` to `env.OPENCLAW_GATEWAY_TOKEN` in each agent's `openclaw.json` via ECS Exec.
- Verification:
  - All services now show token parity: `architect`, `fullstack`, `codex`, `qa`, `pm` => `env token == config token`.
  - `qa-agent` shows no new `token_mismatch`/`gateway connect failed` events after restart; latest shows normal Slack socket connect.

## 2026-03-05 Soul Prompt Workflow Update (Linear Ownership + Status Flow)

- [x] Update Architect soul with PR merge responsibility after DONE assignment and conflict resolution expectations.
- [x] Update Architect soul with explicit task-splitting ownership between Fullstack and Codex.
- [x] Update Fullstack and Codex souls to require handoff to QA (`Needs Review` + assign `qa-agent@mostrom.io`).
- [x] Update QA soul with `Needs Review` -> `In Review` flow and pass/fail routing.
- [x] Update PM soul with backlog creation + assignment to Architect (`architect-agent@mostrom.io`).
- [x] Verify edited markdown for consistency.

### Review

- Updated:
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/senior-fullstack-agent.md`
  - `infrastructure/agent-assets/agents/codex-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
  - `infrastructure/agent-assets/agents/product-agent.md`
- Architect now explicitly:
  - splits implementation assignments between `fullstack-agent@mostrom.io` and `codex-agent@mostrom.io`
  - merges PRs into `dev` after QA passes (`DONE` + reassigned to Architect), including merge-conflict handling.
- Fullstack/Codex now explicitly move to `Needs Review` and assign `qa-agent@mostrom.io`.
- QA now explicitly moves `Needs Review` -> `In Review`, then:
  - fail/regression: `Todo` + assign `fullstack-agent@mostrom.io` with reasons
  - pass: `DONE` + assign `architect-agent@mostrom.io`
- PM now explicitly creates in `Backlog` and assigns `architect-agent@mostrom.io`.

## 2026-03-05 Secret Push Guardrails (No-Image Dependency)

- [x] Verify which secret key was missing in AWS and local manifest.
- [x] Add missing PM keys (`GMAIL_APP_PASSWORD`, `GOOGLE_VOICE_NUMBER`) to `agents.secrets.json` and push.
- [x] Add fail-fast required-key validation to `scripts/secrets/push-agent-secrets.sh`.
- [x] Clarify in image build/push script that it does not push secrets.
- [x] Re-run secret push script to validate end-to-end behavior.

### Review

- Root cause was manifest content, not image build: `pm-agent` secret values were missing required keys.
- Secrets now updated in AWS (`/openclaw/mgmt/agents/pm-agent` contains both keys).
- `push-agent-secrets.sh` now fails before any push when required keys are missing.
- `build-push-openclaw-image.sh` now prints explicit notes that secret sync is a separate step.

## 2026-03-06 Fullstack Browser Tool Unavailable (Extension Relay Default)

- [x] Confirm root cause from code/config path for `profile "chrome"` relay behavior in ECS.
- [x] Update agent runtime config overrides to default hosted agents to local launchable browser profile.
- [x] Verify infrastructure TypeScript compile/synth still passes.
- [x] Document results and rollout notes.

### Review

- Root cause confirmed in browser runtime code: default browser profile is `chrome` (extension driver), which throws when no tab is attached (`Chrome extension relay is running, but no tab is connected`), and hosted ECS agents cannot satisfy that interaction.
- Applied infra fix in `infrastructure/properties/index.ts` by adding hosted browser overrides to agent config payload:
  - `browser.defaultProfile = "openclaw"`
  - `browser.headless = true`
  - `browser.noSandbox = true`
- This applies to all managed agents using `defaultOpenclawOverrides` / subagent variants, preventing hosted agents from defaulting to extension relay mode.
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk"`
  - Synth output confirms `OPENCLAW_JSON` now includes `"browser":{"defaultProfile":"openclaw","headless":true,"noSandbox":true}` for `fullstack-agent`.
- Rollout note: deploy affected agent stacks so running ECS tasks pick up the new `OPENCLAW_JSON` env value.

## 2026-03-07 Skill Generalization (Remove Prototype Focus)

- [x] Add and track implementation plan for skill renames and rewrites.
- [x] Rename prototype skill directories to role-based names.
- [x] Rewrite each renamed skill's `SKILL.md` to define general role execution responsibilities.
- [x] Rewrite each renamed skill's `AGENTS.md` intro/workflow/outputs to match non-prototype scope.
- [x] Verify no stale `prototype-*` skill references remain under `infrastructure/agent-assets/skills`.
- [x] Document verification results in this file.

### Review

- Renamed skill directories:
  - `infrastructure/agent-assets/skills/prototype-fullstack-engineer` -> `infrastructure/agent-assets/skills/fullstack-engineer`
  - `infrastructure/agent-assets/skills/prototype-lead-architect` -> `infrastructure/agent-assets/skills/lead-architect`
  - `infrastructure/agent-assets/skills/prototype-project-manager` -> `infrastructure/agent-assets/skills/project-manager`
  - `infrastructure/agent-assets/skills/prototype-qa-engineer` -> `infrastructure/agent-assets/skills/qa-engineer`
- Rewrote role definitions in all renamed `SKILL.md` files:
  - Updated frontmatter `name` values to new role names.
  - Replaced prototype-only language (clickable demo, static mock data, no backend) with production/general execution responsibilities.
  - Updated rules/process/deliverables for end-to-end role execution.
- Rewrote role intros/workflows/outputs in all renamed `AGENTS.md` files to match non-prototype responsibilities.
- Verification:
  - `rg -n "prototype-|-only prototype|Prototype" infrastructure/agent-assets/skills -S` returned no matches.

## 2026-03-14 Agent Full Permissions Defaults

- [x] Confirm the documented OpenClaw config path for elevated/full-permission behavior.
- [x] Update shared managed-agent OpenClaw overrides so all agents default to full elevated execution.
- [x] Ensure exec defaults match unsandboxed Fargate runtime requirements (`gateway` host, `full` security, no approval prompts).
- [x] Verify the infrastructure config compiles and that generated agent config contains the new keys.
- [x] Document results in this file.

### Review

- Docs used:
  - `openclaw/docs/tools/elevated.md`
  - `openclaw/docs/tools/exec.md`
  - `openclaw/docs/gateway/sandbox-vs-tool-policy-vs-elevated.md`
- Implemented shared managed-agent defaults in `infrastructure/properties/index.ts`:
  - `agents.defaults.elevatedDefault = "full"`
  - `tools.elevated.enabled = true`
  - `tools.elevated.allowFrom.slack = ["*"]`
  - `tools.exec.host = "gateway"`
  - `tools.exec.security = "full"`
  - `tools.exec.ask = "off"`
- Rationale:
  - Elevated docs define `agents.defaults.elevatedDefault` as the default session elevated level.
  - Elevated gating still requires `tools.elevated.allowFrom.<provider>`.
  - Exec docs state sandboxing is off by default and `host=sandbox` is not appropriate when sandbox runtime is unavailable; hosted ECS agents need explicit gateway-host exec defaults.
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && npx ts-node --transpile-only -e 'const { project } = require("./properties"); ...'`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk"`
  - Synth output for `OPENCLAW_JSON` includes:
    - `"tools":{"elevated":{"enabled":true,"allowFrom":{"slack":["*"]}},"exec":{"host":"gateway","security":"full","ask":"off"}}`
    - `"agents":{"defaults":{"elevatedDefault":"full", ...}}`

## 2026-03-17 Soul Hardening (Ownership, Handoffs, Feedback Discipline)

- [x] Review all active agent soul prompts and identify shared workflow failures.
- [x] Add standardized operating rules for task ownership, feedback cadence, environment discovery, and blocker escalation.
- [x] Strengthen implementation-agent handoff requirements so completion always includes status change, branch/PR reference, and reassignment to QA.
- [x] Strengthen QA fail-fast behavior so blocked or missing-evidence reviews are reassigned quickly with explicit blocker evidence.
- [x] Strengthen architect/product prompts to enforce decisive routing, scope clarity, and no silent stalls.
- [x] Verify updated soul prompts for consistency and document the resulting operating model.

### Review

- Updated active soul prompts:
  - `infrastructure/agent-assets/agents/architect-agent.md`
  - `infrastructure/agent-assets/agents/senior-fullstack-agent.md`
  - `infrastructure/agent-assets/agents/codex-agent.md`
  - `infrastructure/agent-assets/agents/qa-automation-agent.md`
  - `infrastructure/agent-assets/agents/product-agent.md`
- Added standardized hard rules across roles:
  - first 20 minutes must produce a concrete artifact or explicit blocker
  - no repeated re-check/retry loops without new evidence
  - environment blockers must be verified with real commands and attempted remediation
  - memory/journal updates do not count as completion or handoff
- Implementation agents now explicitly require:
  - branch as source of truth when Linear defines it
  - branch push + Linear update before QA handoff
  - `Needs Review` + assign `qa-agent@mostrom.io` as mandatory completion actions
- QA now explicitly requires:
  - Linear issue as source of truth for branch/commit/PR/`main`
  - PR is optional when issue already defines what to validate
  - fail-fast reassignment out of `In Review` when implementation evidence is missing or stale
  - reassignment back to the responsible implementation owner, not open-ended waiting
- Architect/Product now explicitly require:
  - decisive routing instead of open-ended analysis
  - explicit next owner + next status before handoff is considered complete
- Consistency verification:
  - checked updated sections across all five souls
  - removed the remaining implementation wording that implied QA handoff only happens after PR creation

## 2026-03-17 Bootstrap Split + Session Pruning

- [x] Verify OpenClaw docs for session pruning, memory, heartbeat cadence, and workspace bootstrap file injection.
- [x] Set shared agent context pruning to `cache-ttl` with `ttl: "1h"`.
- [x] Keep memory enabled and ensure agent workspace guidance uses memory files correctly.
- [x] Extend hosted-agent bootstrap to materialize shared `AGENTS.md`, `TOOLS.md`, `USER.md`, `HEARTBEAT.md`, and `IDENTITY.md`.
- [x] Move common operating rules out of role souls into shared workspace files and trim the souls accordingly.
- [x] Verify infrastructure type-checks and generated task definition env/config include the new bootstrap payloads, memory settings, heartbeat cadence, and pruning settings.

### Review

- Docs used:
  - `openclaw/docs/concepts/session-pruning.md`
  - `openclaw/docs/concepts/memory.md`
  - `openclaw/docs/concepts/system-prompt.md`
  - `openclaw/docs/gateway/heartbeat.md`
  - `openclaw/docs/gateway/configuration-reference.md`
- Infrastructure changes:
  - `infrastructure/properties/index.ts`
    - kept `agents.defaults.memorySearch` enabled with Gemini embeddings
    - set `agents.defaults.contextPruning = { mode: "cache-ttl", ttl: "1h" }`
    - set `agents.defaults.heartbeat = { every: "1h" }`
    - added `identityPromptPath` to shared managed-agent bootstrap docs
  - `infrastructure/resources/agent/index.ts`
    - now reads and injects `OPENCLAW_IDENTITY_MD` alongside `AGENTS`, `SOUL`, `TOOLS`, `USER`, and `HEARTBEAT`
  - `infrastructure/docker/openclaw-bootstrap.mjs`
    - already supported writing `IDENTITY.md`; now receives source-controlled content from infra env instead of only generated fallback
- Added shared workspace bootstrap docs:
  - `infrastructure/agent-assets/workspace/AGENTS.md`
  - `infrastructure/agent-assets/workspace/TOOLS.md`
  - `infrastructure/agent-assets/workspace/IDENTITY.md`
  - `infrastructure/agent-assets/workspace/USER.md`
  - `infrastructure/agent-assets/workspace/HEARTBEAT.md`
- Prompt split result:
  - `AGENTS.md` now owns shared execution rules: planning, verification, task tracking, handoff discipline, continuity, and delegation constraints
  - `TOOLS.md` now owns environment-reality and remediation rules
  - `IDENTITY.md` now owns shared agent identity and operating style
  - role `SOUL.md` files were trimmed to role-specific mission, routing, and completion rules
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && npx ts-node --transpile-only -e 'const { project } = require("./properties"); ...'`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk"`
  - Synth output confirms env injection for:
    - `OPENCLAW_AGENTS_MD`
    - `OPENCLAW_SOUL_MD`
    - `OPENCLAW_TOOLS_MD`
    - `OPENCLAW_IDENTITY_MD`
    - `OPENCLAW_USER_MD`
    - `OPENCLAW_HEARTBEAT_MD`
  - Synth output confirms `OPENCLAW_JSON` contains:
    - `"memorySearch":{"enabled":true,"provider":"gemini","model":"gemini-embedding-001"}`
    - `"heartbeat":{"every":"1h"}`
    - `"contextPruning":{"mode":"cache-ttl","ttl":"1h"}`

## 2026-03-17 Per-Agent Bootstrap Layout + Soul Folder

- [x] Replace the single shared workspace bootstrap bundle with shared plus per-agent prompt files.
- [x] Move loose soul markdown files into an explicit `agent-assets/agents/souls/` directory.
- [x] Give each agent its own `TOOLS.md`, `IDENTITY.md`, `USER.md`, and `HEARTBEAT.md` content.
- [x] Keep only truly global rules in shared prompt files and update agent config paths accordingly.
- [x] Verify infrastructure type-checks and synthesized env/config reflect the new per-agent paths.

### Review

- Layout changes:
  - moved shared workflow prompt to `infrastructure/agent-assets/shared/AGENTS.md`
  - moved role souls into `infrastructure/agent-assets/agents/souls/`
  - created per-agent prompt folders:
    - `infrastructure/agent-assets/agents/architect-agent/`
    - `infrastructure/agent-assets/agents/fullstack-agent/`
    - `infrastructure/agent-assets/agents/codex-agent/`
    - `infrastructure/agent-assets/agents/qa-agent/`
    - `infrastructure/agent-assets/agents/pm-agent/`
- Each agent now has its own:
  - `TOOLS.md`
  - `IDENTITY.md`
  - `USER.md`
  - `HEARTBEAT.md`
- Infrastructure path changes:
  - `infrastructure/properties/index.ts`
    - shared `AGENTS.md` now points to `agent-assets/shared/AGENTS.md`
    - added `agentPromptPaths(agentId)` helper for per-agent bootstrap docs
    - souls now resolve from `agent-assets/agents/souls/<agent-id>.md`
- Removed obsolete shared prompt files from `infrastructure/agent-assets/workspace/`.
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && npx ts-node --transpile-only -e 'const { project } = require("./properties"); ...'`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk"`
  - Verified resolved prompt paths for all agents point to:
    - shared `AGENTS.md`
    - per-agent `TOOLS.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`
    - `agents/souls/<agent-id>.md`
  - Synth output confirmed runtime env injection uses the new fullstack-specific `TOOLS.md`, `IDENTITY.md`, `USER.md`, and `HEARTBEAT.md` content.

## 2026-03-18 Agent Asset Path Sync

- [x] Verify the current on-disk `agent-assets` layout after the manual reorganization.
- [x] Update stack prompt-path references so they match the per-agent `SOUL.md` files.
- [x] Update infra script and README references for moved `manifests/` and `credentials/` directories.
- [x] Verify type-checks and synth still succeed with the new folder references.

### Review

- Verified current layout:
  - per-agent prompts live under `infrastructure/agent-assets/agents/<agent-id>/`
  - each agent directory now contains `SOUL.md`
  - `manifests/` now lives at `infrastructure/agent-assets/manifests/`
  - `credentials/` now lives at `infrastructure/agent-assets/credentials/`
- Updated references:
  - `infrastructure/properties/index.ts`
    - `soulPromptPath` now resolves to `agent-assets/agents/<agent-id>/SOUL.md`
  - `infrastructure/scripts/slack/sync-agent-manifests.sh`
    - defaults now point to `agent-assets/manifests` and `agent-assets/credentials`
  - `infrastructure/README.md`
    - docs now point to the reorganized paths
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && npx ts-node --transpile-only -e 'const { project } = require("./properties"); ...'`
  - `cd infrastructure && AWS_PROFILE=mostrom_mgmt npm run cdk -- synth "OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk"`
  - Verified resolved soul paths now point to `agent-assets/agents/<agent-id>/SOUL.md`
  - Synth output confirmed the stack still injects the per-agent `SOUL.md`, `TOOLS.md`, `IDENTITY.md`, `USER.md`, and `HEARTBEAT.md` payloads

## 2026-03-19 Agent Workflow Enforcement Spec

- [x] Review Slack export evidence for repeated agent workflow failures.
- [x] Identify the highest-severity coordination and handoff breakdowns to solve first.
- [x] Write a root-level spec for the target team operating model and enforcement rules.
- [x] Define implementation slices across `infrastructure/` prompt assets, config, and any runtime follow-up areas.
- [x] Record review notes and next-step recommendations without making behavior changes yet.

### Review

- Reviewed `/Users/kaisewhite/Downloads/Mostrom, LLC Slack export Feb 16 2026 - Mar 18 2026/development` for recurring breakdowns.
- Highest-severity recurring failures confirmed from the export:
  - agents reacting to comments as if ownership transferred
  - incomplete Linear handoffs after implementation
  - QA staying blocked too long instead of failing fast or reassigning
  - agents inventing environment blockers instead of verifying/installing
  - cross-project/repo contamination
  - missing periodic updates without explicit follow-up from Kaise
- Wrote a root planning spec at `AGENT_WORKFLOW_ENFORCEMENT_SPEC.md`.
- The spec defines:
  - a strict ticket ownership and state-transition model
  - PM-led enforcement in `#development` (`C0AGWNWB2MV`)
  - heartbeat and escalation expectations
  - implementation/QA closeout contracts
  - environment verification rules before blocker claims
  - a phased implementation plan for `infrastructure/` first, with `openclaw/` runtime audit only if prompt/config changes do not hold at runtime
- Verification for this planning task:
  - confirmed the spec file exists at repo root
  - reviewed the spec content locally after writing

## 2026-03-19 Assignment-Only Dispatcher + Mandatory Linear Comment Read

- [x] Change the Linear dispatcher lambda to stop posting Linear comment events into Slack.
- [x] Update infra docs to reflect assignment-only Slack dispatch behavior.
- [x] Strengthen shared agent workflow rules so assigned agents must read Linear comments before starting execution.
- [x] Strengthen role workflows so implementation, QA, architect, and PM re-read comments before major handoffs or follow-up.
- [x] Verify the lambda file and prompt/docs are internally consistent after the change.

### Review

- Dispatcher change:
  - removed shared-channel routing for Linear comment events from `infrastructure/resources/lambda/lambda_code/app.py`
  - dispatcher now only posts assignment/reassignment notifications into Slack
- Prompt and docs change:
  - `infrastructure/agent-assets/shared/AGENTS.md`
    - startup now explicitly requires reading the Linear issue and all current comments before execution
    - system-of-record section now requires re-reading comments before major state changes or handoffs
  - role workflows updated:
    - `fullstack-agent/SOUL.md`
    - `codex-agent/SOUL.md`
    - `qa-agent/SOUL.md`
    - `architect-agent/SOUL.md`
    - `pm-agent/SOUL.md`
  - docs updated:
    - `infrastructure/resources/lambda/README.md`
    - `infrastructure/README.md`
    - `AGENT_WORKFLOW_ENFORCEMENT_SPEC.md`
- Verification:
  - `python3 -m py_compile infrastructure/resources/lambda/lambda_code/app.py`
  - `rg -n "comment event|New comment on your assigned Linear issue|_is_comment_event|_build_comment_message|_extract_comment_issue" infrastructure/resources/lambda/lambda_code/app.py infrastructure/resources/lambda/README.md infrastructure/README.md`
  - `rg -n "including all comments|Read the Linear issue end-to-end, including all current comments|re-read new Linear comments|Linear issue comments are part of the required source-of-truth context" infrastructure/agent-assets/shared/AGENTS.md infrastructure/agent-assets/agents/*/SOUL.md AGENT_WORKFLOW_ENFORCEMENT_SPEC.md`

## 2026-03-19 Context7 + Impeccable Shared Agent Access

- [x] Determine the OpenClaw-native integration path for Context7 and Impeccable across all agents.
- [x] Vendor the official shared skill folders into `infrastructure/agent-assets/skills`.
- [x] Update the agent image to include the required Context7 binaries.
- [x] Add prompt/docs guidance so agents use Context7 for version-sensitive external docs.
- [x] Verify copied skill assets and updated runtime requirements.

### Review

- Integration decision:
  - OpenClaw agents in this stack load shared skills from `infrastructure/agent-assets/skills` baked into `/opt/openclaw/skills`.
  - Because this stack does not yet expose a clean global MCP registration surface for every agent, Context7 was integrated through its official CLI + skill path rather than MCP-only wiring.
  - The Context7 MCP server binary was still added to the image so it is available for future native MCP wiring.
- Shared skills added from upstream sources:
  - Context7:
    - `context7-cli`
    - `find-docs`
  - Impeccable pack:
    - `adapt`
    - `animate`
    - `arrange`
    - `audit`
    - `bolder`
    - `clarify`
    - `colorize`
    - `critique`
    - `delight`
    - `distill`
    - `extract`
    - `frontend-design` (replaced with the Impeccable-enhanced version)
    - `harden`
    - `normalize`
    - `onboard`
    - `optimize`
    - `overdrive`
    - `polish`
    - `quieter`
    - `teach-impeccable`
    - `typeset`
- Runtime updates:
  - `infrastructure/docker/Dockerfile`
    - now installs `ctx7@0.3.6`
    - now installs `@upstash/context7-mcp@2.1.4`
  - `infrastructure/docker/openclaw-entrypoint.sh`
    - now verifies `ctx7` and `context7-mcp` exist at container startup
- Prompt/docs updates:
  - `infrastructure/agent-assets/shared/AGENTS.md`
    - agents are now explicitly told to use Context7 for third-party library/API/docs freshness
  - `infrastructure/README.md`
    - runtime baseline and skill baseline updated
  - `AGENT_WORKFLOW_ENFORCEMENT_SPEC.md`
    - shared documentation/tooling guidance requirement added
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `find infrastructure/agent-assets/skills -maxdepth 1 -mindepth 1 -type d | sort`
  - `find infrastructure/agent-assets/skills -maxdepth 2 -type f | rg 'context7-cli|find-docs|teach-impeccable|typeset|overdrive|frontend-design'`
  - `rg -n "ctx7|context7-mcp|Context7 documentation lookup|Impeccable design skill pack" infrastructure/docker/Dockerfile infrastructure/docker/openclaw-entrypoint.sh infrastructure/README.md infrastructure/agent-assets/shared/AGENTS.md AGENT_WORKFLOW_ENFORCEMENT_SPEC.md`

## 2026-03-19 CONTEXT7_API_KEY Env Injection

- [x] Add `CONTEXT7_API_KEY` to the shared direct env injection list for all agents.
- [x] Update the example agent secrets file to include `CONTEXT7_API_KEY`.
- [x] Update docs so the required agent secret list matches runtime behavior.
- [x] Verify infrastructure type-checks and confirm the new key is referenced.

### Review

- Added `CONTEXT7_API_KEY` to `directEnvSharedKeys` in `infrastructure/properties/index.ts`, so ECS now injects it for every agent when present in Secrets Manager.
- Updated `infrastructure/properties/secrets/agents.secrets.example.json` so the example secret payload matches the actual runtime env contract.
- Updated `infrastructure/README.md` to list `CONTEXT7_API_KEY` among the agent secret values.
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `rg -n "CONTEXT7_API_KEY" infrastructure/properties/index.ts infrastructure/properties/secrets/agents.secrets.example.json infrastructure/README.md`

## 2026-03-19 Context7 REST API Skill

- [x] Inspect the existing Context7 skills to avoid overlap and pick a focused trigger boundary.
- [x] Add a new shared skill that teaches the Context7 REST API `search` and `context` flow using `CONTEXT7_API_KEY`.
- [x] Verify the new skill file is present and readable in the shared skill bundle.

### Review

- Added a new shared skill at `infrastructure/agent-assets/skills/context7-rest-api/SKILL.md`.
- The skill is intentionally narrow:
  - use when the agent needs raw HTTP access to Context7
  - use when debugging or scripting Context7 lookups directly with `curl`
  - do not use it for normal CLI-based doc retrieval when `context7-cli` or `find-docs` already fits
- The skill teaches:
  - `GET /api/v2/libs/search`
  - `GET /api/v2/context`
  - `Authorization: Bearer $CONTEXT7_API_KEY`
  - the required two-step search -> libraryId -> context flow
  - URL-encoding and common failure modes
- Verification:
  - `sed -n '1,220p' infrastructure/agent-assets/skills/context7-rest-api/SKILL.md`
  - `find infrastructure/agent-assets/skills -maxdepth 2 -name 'SKILL.md' | rg 'context7-rest-api'`

## 2026-03-19 PM Daily Standup + Workflow Cadence Enforcement

- [x] Inspect PM prompt files and OpenClaw cron/runtime behavior to decide where a daily 9 AM ET standup should be wired.
- [x] Update the workflow enforcement spec with the PM daily standup, role-based progress cadence, escalation circuit breaker, QA one-cycle definition, and dispatcher-runtime enforcement stance.
- [x] Update shared and per-agent prompt files so PM/QA/implementation cadence and escalation rules match the spec.
- [x] Enable cron in the agent runtime defaults and seed an idempotent PM daily standup cron job at bootstrap.
- [x] Verify the generated PM runtime config and seeded cron store shape.
- [x] Document review results in this file.

### Review

- Prompt/spec updates:
  - role-based progress cadence is now explicit:
    - implementation, architecture, and PM scoping work: 30 minutes
    - QA validation work: 20 minutes
  - PM enforcement now has a circuit breaker:
    - first follow-up
    - second-cycle escalation plus Linear comment
    - third-cycle escalation to Kaise plus coordination reassignment when ownership is clearly wrong or stale
  - QA now has an explicit one-cycle definition with a single allowed retry only for transient/flaky infrastructure cases
  - dispatcher comment suppression is now documented as a runtime enforcement requirement, not just prompt guidance
  - blocked ownership mutation is now explicit: blocked tickets must be reassigned to the next owner, or to PM for triage if the next owner is unclear
- Runtime/config updates:
  - enabled cron defaults in `infrastructure/properties/index.ts`
  - added bootstrap-managed PM cron job `pm-daily-standup` at `0 9 * * *` `America/New_York`
  - delivery is isolated + direct Slack announce to `channel:C0AGWNWB2MV`
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `cd infrastructure && npx ts-node --transpile-only -e '...'` to confirm PM heartbeat, cron defaults, and bootstrap cron job payload
  - bootstrap dry run:
    - `node infrastructure/docker/openclaw-bootstrap.mjs` with temp `OPENCLAW_STATE_DIR`
    - confirmed `~/.openclaw/cron/jobs.json` contains `pm-daily-standup`
  - idempotency dry run:
    - ran bootstrap twice against the same temp state dir
    - confirmed cron store still contains exactly one job with ID `pm-daily-standup`

## 2026-03-19 Workflow Enforcement Rollout

- [x] Inspect the actual image/deploy scripts and identify the minimal rollout sequence for image, agent stacks, and shared services.
- [x] Build and push the updated OpenClaw image to ECR.
- [x] Deploy `OpenclawStack/openclaw-cdk/openclaw-shared-services-cdk`.
- [x] Deploy the five agent stacks:
  - `OpenclawStack/openclaw-cdk/openclaw-architect-agent-cdk`
  - `OpenclawStack/openclaw-cdk/openclaw-fullstack-agent-cdk`
  - `OpenclawStack/openclaw-cdk/openclaw-codex-agent-cdk`
  - `OpenclawStack/openclaw-cdk/openclaw-qa-agent-cdk`
  - `OpenclawStack/openclaw-cdk/openclaw-pm-agent-cdk`
- [x] Verify live ECS rollout and confirm the PM runtime has the new cron/bootstrap config.
- [x] Document rollout results and any follow-up risks.

### Review

- Rollout plan:
  - build/push image first because the changes touch `infrastructure/docker/Dockerfile`, `openclaw-entrypoint.sh`, and `openclaw-bootstrap.mjs`
  - deploy `openclaw-shared-services-cdk` because the Linear dispatcher lambda changed
  - deploy all five agent stacks because prompts/config/runtime defaults changed across the fleet
- Rollout execution:
  - built and pushed the updated gateway image twice:
    - first push exposed a PM bootstrap regression at runtime
    - second push carried the `openclaw-bootstrap.mjs` fix that strips bootstrap-only metadata from persisted OpenClaw config
  - pushed updated Secrets Manager payloads with `./scripts/secrets/agents.secrets.sh` after ECS surfaced missing live `CONTEXT7_API_KEY` keys
  - deployed shared services plus architect/fullstack/codex/qa stacks successfully
  - PM stack required a second clean deploy after the first ECS circuit-breaker failure rolled the CloudFormation stack back
- Live verification:
  - architect/fullstack/codex/qa/pm services all converged successfully in ECS
  - final PM service is running task definition `mgmt-pm-agent:28`
  - ECS exec against the live PM task confirmed:
    - `agents.defaults.heartbeat.every = "30m"`
    - `agents.defaults.contextPruning.ttl = "1h"`
    - `agents.defaults.memorySearch.enabled = true`
    - persisted `openclaw.json` no longer contains a root `bootstrap` key
    - cron store contains exactly `pm-daily-standup`
- Follow-up risks and observations:
  - ECS service circuit-breaker failures can poison the in-flight CloudFormation update even after the runtime bug is fixed; redeploy from `UPDATE_ROLLBACK_COMPLETE` was required for PM
  - live secret drift mattered: updating local `agents.secrets.json` was not enough until the values were pushed to AWS Secrets Manager

## 2026-03-19 PM Autonomy Tightening

- [x] Review the live PM escalation behavior against the intended workflow ownership model.
- [x] Update PM prompt/spec rules so stale execution and stale QA do not get handed back to Kaise for routine babysitting.
- [x] Deploy the PM prompt changes and verify the new runtime instructions are present.
- [x] Document the resulting behavior change and any remaining escalation boundaries.

### Review

- Current failure:
  - PM is still posting recommendations to Kaise on third-cycle stale QA instead of taking the routing action itself.
- Rule changes:
  - third-cycle PM escalation is now autonomous coordination action, not human babysitting
  - human escalation is reserved for real exceptions: multi-agent outage, no valid next owner, or required business decision
  - stale QA must be moved out of QA limbo by PM on the third cycle instead of being left assigned to QA without a verdict
- Deployment and verification:
  - deployed `OpenclawStack/openclaw-cdk/openclaw-pm-agent-cdk`
  - live PM service converged on task definition `mgmt-pm-agent:29`
  - ECS exec against the live PM task confirmed mounted `USER.md`, `HEARTBEAT.md`, and `SOUL.md` now instruct PM to:
    - not hand routine stale-ticket coordination back to Kaise
    - take coordination action on the third cycle
    - move stale QA tickets out of QA limbo
    - reserve human escalation for true exceptions only

## 2026-03-19 QA Verdict Deadline Tightening

- [x] Review the current QA and PM rules against the observed "reviewing findings/finalizing" stall pattern.
- [x] Update QA and PM prompt/spec rules to hard-cap the post-validation verdict window and treat missed QA verdict deadlines as stale immediately.
- [x] Deploy the QA and PM prompt changes and verify the live runtime text.
- [x] Document the deployed behavior change and remaining risks.

### Review

- Current failure:
  - QA can complete the main validation work, promise a verdict, then spend another 30+ minutes in a non-terminal "reviewing/finalizing" state.
- Rule changes:
  - QA must now post `PASS`, `FAIL`, or `BLOCKED` within 10 minutes of completing the main validation work
  - vague holding updates like "reviewing findings" or "finalizing report" are explicitly disallowed
  - missing that 10-minute window is now itself a routing failure that requires immediate ticket mutation
  - PM now treats missed QA verdict deadlines as stale immediately instead of waiting only on broader inactivity
- Deployment and verification:
  - PM updated cleanly and the live PM task mounted the new stale-QA enforcement text
  - QA required a dedicated verification pass because the service lagged behind the new task definition
  - CloudFormation created `mgmt-qa-agent:23`, and ECS launched the new QA task on that revision
  - ECS exec against the live QA task confirmed mounted `SOUL.md` and `HEARTBEAT.md` now include:
    - the 10-minute post-validation verdict deadline
    - the ban on "reviewing findings/finalizing report" holding states
    - immediate ticket mutation when the verdict deadline is missed
- Remaining risk:
  - ECS/CloudFormation service updates are slow to settle in this environment, so stack status can lag behind the already-correct live runtime state

## 2026-03-19 QA Atomic Closeout Tightening

- [x] Review the new failure mode where QA posts a verdict but delays the actual Linear mutation.
- [x] Update QA and PM rules so verdict publication and Linear mutation are treated as one closeout action, not two delayed steps.
- [x] Deploy the updated QA and PM prompt text and verify it live.
- [x] Document the deployed behavior change and any remaining operational risk.

### Review

- Current failure:
  - QA can now produce the verdict faster, but still leaves the real handoff incomplete by posting the verdict first and promising the Linear mutation later.
- Rule changes:
  - a QA verdict is not complete until the Linear status and assignee mutation is done in the same closeout action window
  - posting the verdict and saying "I will update Linear next" is now explicitly disallowed
  - PM treats a post-verdict mutation delay over 2 minutes as stale immediately
- Deployment and verification:
  - PM rolled to `mgmt-pm-agent:31`
  - QA rolled to `mgmt-qa-agent:24`
  - ECS exec against the live PM task confirmed the new stale signal:
    - `if QA posts a verdict but does not complete the matching Linear state/assignee mutation within 2 minutes, treat that as stale immediately`
  - ECS exec against the live QA task confirmed:
    - QA may not split verdict posting from Linear mutation
    - a posted verdict with no ticket mutation must be corrected before any more commentary
- Remaining risk:
  - CloudFormation/ECS service rollouts continue to lag after the correct runtime prompt is already live, so stack status is not the best near-real-time truth source during deploy

## 2026-03-19 PM Slack Identity Fix

- [x] Inspect how PM is naming agents in Slack follow-ups and standups.
- [x] Update PM/spec/runtime prompt text so Slack messages use agent IDs/display names instead of `@mostrom.io` email-shaped mentions.
- [x] Deploy the PM prompt/runtime changes and verify the live text.
- [x] Document the resulting Slack identity behavior.

### Review

- Current failure:
  - PM is formatting Slack follow-ups like `@qa-agent@mostrom.io`, which is not a valid Slack mention for app-based agents.
- Rule changes:
  - PM Slack copy must use plain agent IDs/display names unless a real Slack `<@U...>` mention token is already known
  - standup sections now use `architect-agent`, `fullstack-agent`, `codex-agent`, and `qa-agent`
  - PM may still use email identities in Linear routing logic, but not as Slack mention syntax
- Deployment and verification:
  - PM rolled to live task definition `mgmt-pm-agent:32`
  - ECS exec against the live PM task confirmed mounted prompt text now says Slack follow-ups must use plain agent IDs/display names or a known real `<@U...>` token
  - live PM prompt text no longer instructs Slack copy to use `qa-agent@mostrom.io`-style mention syntax

## 2026-03-19 Linux Image Chromium Baseline

- [x] Inspect the current image build path to determine whether a real browser binary is guaranteed on `PATH`.
- [x] Patch the wrapped agent image and startup checks so a system `chromium` binary is always present.
- [x] Tighten the image build validation and docs to reflect the browser guarantee.
- [ ] Rebuild and redeploy the image so running agents receive the browser binary.

### Review

- Current failure:
  - the base OpenClaw build can install Playwright-managed Chromium, but the wrapped agent image did not guarantee a system `chromium` binary on `PATH` for agent use.
- Rule changes:
  - the wrapped agent image now installs `chromium` via apt
  - the entrypoint now treats `chromium` as a required binary and fails fast if it is missing
  - the build/push helper now validates `chromium` inside the final image before push
- Remaining work:
  - rebuild and redeploy the image so live ECS tasks pick up the browser binary
## 2026-03-19 Slack Identity Rendering Fix

- [x] Trace whether email-style pseudo-mentions come from PM prompt text, Slack rendering, or both.
- [x] Patch PM Slack guidance so agent emails are never emitted in Slack output and Kaise is treated separately as a human Slack user.
- [x] Patch Slack mrkdwn formatting so invalid <@email> tokens are escaped instead of preserved.
- [ ] Redeploy PM/runtime changes and verify the live Slack output no longer shows pseudo-mentions.

### Review

- Current failure:
  - PM still emitted `qa-agent@mostrom.io` in Slack body text and sometimes `<@kaise@mostrom.io>`-style pseudo-mentions.
- Rule changes:
  - PM Slack copy must never include `@mostrom.io` identities for agent apps; use plain agent IDs instead
  - `Kaise` may be referenced as the human user or with a real Slack user token only when known
  - Slack formatting now preserves only valid Slack angle-token shapes and escapes fake `<@email>` tokens
- Verification:
  - targeted Slack formatter test executed after patch

## 2026-03-19 Dembrandt Baseline

- [x] Read the official Dembrandt getting-started/install guidance and confirm the supported CLI install path.
- [x] Patch the agent image so `dembrandt` is installed for all agents and validated at startup/build time.
- [x] Add a dedicated Dembrandt skill for extraction workflow, browser fallback, and Linux/container guidance.
- [x] Rebuild and redeploy the image so running agents receive Dembrandt.

### Review

- Current requirement:
  - all agents need Dembrandt available locally, and they need a first-class skill explaining when and how to use it.
- Rule changes:
  - the wrapped image now installs `dembrandt@0.6.1`
  - the image preloads Dembrandt's Playwright Chromium/Firefox browsers during build
  - startup/build validation now requires the `dembrandt` binary
  - a new `dembrandt-cli` skill covers extraction flow, `--json-only`, `--dtcg`, `--browser=firefox`, `--slow`, and container fallback with `--no-sandbox`
- Verification:
  - rebuilt and pushed the shared agent image, then forced ECS service redeploys for pm, codex, architect, qa, and fullstack agents
  - verified live in the new PM task that `dembrandt` and `chromium` are both present on `PATH`
  - verified `dembrandt --help` in the live container exposes the expected extraction flags

## 2026-03-20 PM Assignment Recovery Fix

- [x] Inspect PM stale-cancel behavior and write-tool failure.
- [x] Patch PM prompt/runtime so fresh assignments override stale pause/cancel state.
- [x] Patch PM guidance so it never writes temp decision files outside the workspace root.
- [x] Remove Linear assignee email echoes from Slack dispatcher assignment messages.
- [x] Verify the fix and document the result.

### Review

- Current failure:
  - PM carried a stale global cancellation instruction into a fresh ticket assignment and also failed trying to write `/tmp/pm_decision.txt`, which is outside the workspace root.
- Rule changes:
  - shared workflow now says older generic pause/stand-down instructions are ticket-scoped by default and that fresh assignments override them unless Kaise explicitly reaffirms a global pause for that agent
  - PM-specific prompt files now say a fresh assignment to `pm-agent` is active work and must not be ignored due to stale generic cancellation language
  - PM tooling guidance now forbids scratch writes to `/tmp` and redirects scratch artifacts to repo-local paths such as `tasks/tmp/`
  - the Linear dispatcher no longer echoes `Assigned Identity: <email>` into Slack assignment posts
- Verification:
  - `python3 -m py_compile infrastructure/resources/lambda/lambda_code/app.py`
  - `cd infrastructure && npx tsc --noEmit`
  - local dispatcher message build now renders only the Slack mention plus issue line, with no assignee email echo
  - deployed `OpenclawStack/openclaw-cdk` so the dispatcher lambda is live with the new Slack message shape
  - deployed `OpenclawStack/openclaw-cdk/openclaw-pm-agent-cdk`; ECS launched task definition `mgmt-pm-agent:34`
  - ECS exec against the live `mgmt-pm-agent:34` task confirmed the mounted PM prompt text now contains the fresh-assignment override rule
- Remaining risk:
  - the PM CloudFormation stack is still in the normal ECS rollout tail while the new task is already running, so stack status may lag the live runtime briefly

## 2026-03-21 Architect PR-Only Merge Flow

- [x] Inspect architect and shared workflow instructions for direct merge behavior.
- [x] Patch agent rules so architect creates or validates PRs into `dev` instead of merging directly.
- [x] Reserve direct merges into `dev` and `main` for Kaise only.
- [x] Verify prompt changes and document the result.

### Review

- Current failure:
  - `architect-agent` is merging directly into `dev` instead of ensuring a PR exists from the ticket feature branch into `dev`.
- Rule changes:
  - shared workflow now says all agent-delivered code must land through a PR targeting `dev`
  - shared workflow now says no agent may merge directly into `dev` or `main`, and that direct merges are reserved for Kaise only
  - architect's post-QA workflow now creates the missing PR to `dev` when needed, reviews it for architecture readiness, and routes the ticket to `kaise@mostrom.io` for the human merge
  - architect permissions now explicitly deny merge authority
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - verified the architect task definition `mgmt-architect-agent:26` now contains:
    - `If no PR exists yet, create a PR from the ticket's feature branch into dev`
    - `Do not merge the PR. Direct merges into dev or main are reserved for Kaise only`
    - `Assign the ticket to kaise@mostrom.io for the human merge when the PR is merge-ready`
  - verified the codex task definition `mgmt-codex-agent:13` now carries the shared `AGENTS.md` rule that no agent may merge directly into `dev` or `main`
  - deployed the five agent stacks so the shared rule rolls across the fleet
- Remaining risk:
  - architect and codex services are still in the usual ECS rollout tail, so CloudFormation/ECS status may lag the already-minted task definitions briefly

## 2026-03-21 Remove Codex Agent

- [x] Inspect active infrastructure references for `codex-agent`.
- [x] Remove `codex-agent` from agent configuration, prompt routing, manifests, and example secret mappings.
- [x] Verify the remaining infrastructure and document the removal result.

### Review

- Current requirement:
  - `codex-agent` should be removed entirely rather than retargeted to another model.
- Rule changes:
  - removed `codex-agent` from `infrastructure/properties/index.ts`, so the CDK app no longer defines a codex ECS service
  - deleted the `infrastructure/agent-assets/agents/codex-agent/` prompt bundle
  - deleted the codex Slack manifest, credential stub, and dedicated helper script
  - updated architect, QA, and PM prompt routing to assume a single implementation owner (`fullstack-agent`) instead of splitting through codex
  - removed codex from example dispatcher mappings, example agent secrets, and infra docs/runbooks
- Verification:
  - `cd infrastructure && npx tsc --noEmit`
  - `rg -n --glob '!infrastructure/cdk.out*' --glob '!**/cdk.out*' --glob '!tasks/todo.md' --glob '!tasks/lessons.md' 'codex-agent' infrastructure -S` now returns no active infrastructure hits
  - `npm run cdk -- list` no longer includes `openclaw-codex-agent-cdk`
  - CloudFormation confirms `openclaw-codex-agent-cdk` no longer exists
  - ECS confirms service `codex-agent` is `INACTIVE`
  - redeployed `openclaw-shared-services-cdk`, which removed the codex EFS access point successfully
- Remaining risk:
  - `openclaw-architect-agent-cdk` is still in the usual ECS rollout tail while the remaining codex-free stack updates converge

## 2026-03-21 Agent Flow Rewrite From tasks/agent-flow.md

- [x] Review the proposed workflow in `tasks/agent-flow.md` against the live prompt stack.
- [x] Rewrite the shared workflow contract for the new lifecycle: `Backlog -> Planned -> Test Designed -> In Progress -> In Review -> Ready for PR -> Completed`.
- [x] Rewrite `architect-agent` for architecture planning first and final PR-readiness last.
- [x] Rewrite `qa-agent` to own both QA spec (`strict-tdd`) and QA validation phases.
- [x] Rewrite `fullstack-agent` to implement strictly against the QA-authored plan and hand back to QA validation.
- [x] Rewrite `pm-agent` monitoring rules so it enforces the new owner/status transitions.
- [x] Verify prompt consistency and document the final workflow delta.

### Review

- Replaced the old `Backlog -> Todo -> In Progress -> Needs Review -> In Review -> DONE` lifecycle in the active prompt stack with the new workflow from `tasks/agent-flow.md`.
- Shared workflow now defines the canonical owner/status chain:
  - `Backlog` -> `architect-agent`
  - `Planned` -> `qa-agent` for QA spec
  - `Test Designed` -> `fullstack-agent`
  - `In Progress` -> `fullstack-agent`
  - `In Review` -> `qa-agent` for validation
  - `Ready for PR` -> `architect-agent`
  - `Completed` -> Kaise after architect creates or verifies the PR to `dev`
- `architect-agent` now owns two clean stages:
  - pre-implementation planning with `lead-architect`
  - final PR creation and architecture review at `Ready for PR`
- `qa-agent` now owns two clean stages:
  - QA spec with `strict-tdd`
  - QA validation against the authored QA spec, including anti-cheating checks
- `fullstack-agent` now implements against the architect plan plus QA-authored test design and hands off at `In Review`, not `Needs Review`.
- `pm-agent` now enforces the new owner/status pairings and stale-stage expectations instead of the old workflow.
- Verification:
  - `rg -n -e 'Needs Review' -e '\\bTodo\\b' -e '\\bDONE\\b' infrastructure/agent-assets/shared infrastructure/agent-assets/agents/pm-agent infrastructure/agent-assets/agents/architect-agent infrastructure/agent-assets/agents/qa-agent infrastructure/agent-assets/agents/fullstack-agent -S` returned no matches
  - reviewed the rewritten prompt files directly to confirm the new flow is consistent across shared, PM, architect, QA, and fullstack roles

## 2026-03-24 Superpowers Skill Pack Baseline

- [x] Read the upstream `obra/superpowers` install guidance and determine the correct OpenClaw integration path.
- [x] Patch the shared agent image so the upstream Superpowers skill pack is baked into `/opt/openclaw/skills`.
- [x] Add runtime and local build validation so missing Superpowers anchors fail fast.
- [x] Update docs and record that this pass does not deploy the stack.

### Review

- Current requirement:
  - all agents need the Superpowers skills installed, but this stack should not be deployed in this pass.
- Integration decision:
  - upstream Superpowers is a skills framework, not a runtime binary, so the correct OpenClaw-native path is to bake its `skills/` tree into the existing shared `/opt/openclaw/skills` directory rather than try to run Codex-specific install commands inside ECS.
  - pinned the upstream snapshot to commit `8ea39819eed74fe2a0338e71789f06b30e953041` for deterministic builds.
- Rule changes:
  - `infrastructure/docker/Dockerfile` now downloads the pinned Superpowers tarball at build time and merges its `skills/` tree into `/opt/openclaw/skills`
  - `infrastructure/docker/openclaw-entrypoint.sh` now fails fast if any of the 14 upstream Superpowers skills are missing
  - `infrastructure/scripts/docker/build-push-openclaw-image.sh` now validates the full 14-skill Superpowers pack in the built image before any push
  - `infrastructure/README.md` now documents the Superpowers skill pack baseline
- Verification:
  - `bash -n infrastructure/docker/openclaw-entrypoint.sh`
  - `bash -n infrastructure/scripts/docker/build-push-openclaw-image.sh`
  - `docker build --platform linux/amd64 --build-arg OPENCLAW_INSTALL_BROWSER=1 -t openclaw-base:local -f openclaw/Dockerfile openclaw`
  - `docker build --platform linux/amd64 --build-arg BASE_IMAGE=openclaw-base:local -t openclaw-superpowers:test -f infrastructure/docker/Dockerfile .`
  - upstream repo comparison confirmed the Superpowers pack contains 14 skills:
    - `brainstorming`
    - `dispatching-parallel-agents`
    - `executing-plans`
    - `finishing-a-development-branch`
    - `receiving-code-review`
    - `requesting-code-review`
    - `subagent-driven-development`
    - `systematic-debugging`
    - `test-driven-development`
    - `using-git-worktrees`
    - `using-superpowers`
    - `verification-before-completion`
    - `writing-plans`
    - `writing-skills`
  - `docker run --rm --platform linux/amd64 --entrypoint /bin/bash openclaw-superpowers:test -lc '...'` confirmed the image contains all 14 upstream Superpowers skill directories
  - local repo inspection confirmed the Superpowers skills are build-time baked, not vendored under `infrastructure/agent-assets/skills`
  - `docker run --rm --platform linux/amd64 --entrypoint /bin/bash openclaw-superpowers:test -lc '...'` also confirmed:
    - required binaries still resolve on `PATH` (`chromium`, `dembrandt`, `ctx7`, `context7-mcp`)
    - required Superpowers skill files exist in `/opt/openclaw/skills`
- Deployment:
  - intentionally not deployed

## 2026-03-26 Superpowers Skill Routing In Agent Prompts

- [x] Review the Superpowers skill set against the active PM, architect, QA, and fullstack roles.
- [x] Add shared Superpowers routing guidance so agents know when to invoke the right skill class.
- [x] Add role-specific Superpowers guidance for PM, architect, QA, and fullstack workflows.
- [x] Verify the prompt stack reflects the intended skill mapping.

### Review

- Current requirement:
  - agents must not merely have Superpowers installed; they must know which Superpowers skills apply at which stage of the Mostrom workflow.
- Rule changes:
  - shared workflow now defines a Superpowers routing layer:
    - `brainstorming` for ambiguous new work
    - `writing-plans` for concrete multi-step planning
    - `test-driven-development` for implementation and test-plan creation
    - `systematic-debugging` for bugs, failures, and flaky behavior
    - `verification-before-completion` before completion or readiness claims
    - `dispatching-parallel-agents` / `subagent-driven-development` for independent parallel work
  - `pm-agent` now explicitly uses:
    - `brainstorming`
    - `writing-plans`
    - `verification-before-completion`
    - `systematic-debugging`
  - `architect-agent` now explicitly uses:
    - `brainstorming`
    - `writing-plans`
    - `verification-before-completion`
    - `receiving-code-review`
  - `qa-agent` now explicitly uses:
    - `test-driven-development` alongside `strict-tdd`
    - `systematic-debugging`
    - `verification-before-completion`
    - `receiving-code-review`
  - `fullstack-agent` now explicitly uses:
    - `test-driven-development`
    - `systematic-debugging`
    - `verification-before-completion`
    - `receiving-code-review`
    - `dispatching-parallel-agents`
    - `subagent-driven-development`
  - fullstack guidance now explicitly forbids using Superpowers branch-finishing skills to bypass the architect-owned PR stage or Kaise-owned merge step
- Verification:
  - reviewed the rewritten shared and per-agent prompt sections directly to confirm each active role has an explicit Superpowers mapping

## 2026-03-26 PM Superpowers Scope Correction

- [x] Record the user correction that PM was assigned overly broad engineering-oriented Superpowers skills.
- [x] Narrow `pm-agent` Superpowers guidance to PM-appropriate behavior only.
- [x] Verify the PM prompt no longer instructs PM to use implementation-planning or debugging skills by default.

### Review

- Current correction:
  - PM should not be pushed into engineering-heavy Superpowers workflows such as `writing-plans` or `systematic-debugging` as a normal role behavior.
- Rule changes:
  - `pm-agent` now keeps only `brainstorming` as an explicit Superpowers skill trigger for ambiguous scope work.
  - PM guidance now explicitly says implementation-oriented skills like `writing-plans`, `test-driven-development`, and `systematic-debugging` are not default PM workflows.
  - PM still performs evidence-backed coordination by directly checking Linear state, assignee, and last real artifact before posting standups or escalations.
- Verification:
  - reviewed `infrastructure/agent-assets/agents/pm-agent/SOUL.md` and confirmed the over-broad PM skill list was removed
