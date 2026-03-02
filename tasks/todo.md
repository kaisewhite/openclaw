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
