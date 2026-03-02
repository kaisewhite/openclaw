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
