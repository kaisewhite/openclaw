# Lessons

- When composing CDK apps with nested stack artifacts, never reuse the same physical `stackName` across root and child artifacts; enforce uniqueness before first deploy.
- Deployment helper scripts must select explicit artifact patterns (e.g. `^OpenclawStack/`) instead of broad text filters to avoid cross-artifact collisions.
- Do not mark infrastructure fixes complete without proof artifacts: before/after behavior diff, deploy/synth evidence, live request results, and CloudWatch logs confirming handler execution.
- For webhook handlers, log all terminal decision branches (`notified`, `no_matching_route`, `self_comment`, `irrelevant_event`) so START/END-only traces cannot hide routing/config failures.
- For Slack assignment routing, never rely on display names/aliases in prompts; use canonical `<@U...>` mention-to-self semantics and require identity refresh (`auth.test` or equivalent) before claiming assignment ambiguity.
- For OpenClaw `configOverrides`, only set keys valid at the target schema level; nest feature config under the correct object path (e.g. `agents.defaults.subagents`), never as ad-hoc root keys.
- For Slack-triggered automations, remember dispatcher/webhook posts are usually bot-authored; if agents must react to those messages, explicitly enable `channels.slack.allowBots=true` (with mention gating to avoid noise/loops).
- For multi-agent channel hygiene, enforce a strict split: concise Slack execution updates only, full technical analysis/spec/report content in Linear comments.
- If assignment visibility is critical, encode explicit progress cadence in the agent soul (time-based + milestone-based) and require mirrored Slack + ticket comment updates to eliminate silent execution windows.
- When a behavior rule is intended platform-wide, apply it to all active agent souls in the same change to prevent role drift and inconsistent runtime behavior.
- For multi-session agents, require a durable per-ticket journal + explicit recovery checks (journal, Linear, Slack) before any "no record" response to avoid false context loss claims.
- For durable recall, pair prompt-level memory discipline (read/write `memory/YYYY-MM-DD.md` + memory tools) with config-level safeguards (`agents.defaults.compaction.memoryFlush` and `agents.defaults.memorySearch`) so behavior survives compaction and restarts.
- Cross-account Secrets Manager access requires two sides: caller IAM allow on agent task role and resource/KMS policy allowance in the target account; role-side `Resource: "*"` alone is not sufficient if target-account policies block access.
- Prevent cross-repo scope creep by requiring canonical Git repo URLs and explicit per-repo boundaries in ticket creation, and requiring execution agents to validate repo scope from the issue before any git/code/test actions.
