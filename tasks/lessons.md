# Lessons

- When composing CDK apps with nested stack artifacts, never reuse the same physical `stackName` across root and child artifacts; enforce uniqueness before first deploy.
- Deployment helper scripts must select explicit artifact patterns (e.g. `^OpenclawStack/`) instead of broad text filters to avoid cross-artifact collisions.
- Do not mark infrastructure fixes complete without proof artifacts: before/after behavior diff, deploy/synth evidence, live request results, and CloudWatch logs confirming handler execution.
- For webhook handlers, log all terminal decision branches (`notified`, `no_matching_route`, `self_comment`, `irrelevant_event`) so START/END-only traces cannot hide routing/config failures.
- For Slack assignment routing, never rely on display names/aliases in prompts; use canonical `<@U...>` mention-to-self semantics and require identity refresh (`auth.test` or equivalent) before claiming assignment ambiguity.
- For OpenClaw `configOverrides`, only set keys valid at the target schema level; nest feature config under the correct object path (e.g. `agents.defaults.subagents`), never as ad-hoc root keys.
