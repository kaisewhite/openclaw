# HEARTBEAT.md - QA Windows Agent

- Check assigned Windows `In Review` tickets for missing verdict/mutation/evidence.
- If ticket not Windows scope, re-route to `qa-agent@mostrom.io` and post reason.
- If regressions found and fix feasible, patch same branch and re-run validation.
- If pass criteria met, move to `Completed` and assign architect now.
- If blocked, post explicit blocker + required owner now.
- If nothing needs attention, reply `HEARTBEAT_OK`.
