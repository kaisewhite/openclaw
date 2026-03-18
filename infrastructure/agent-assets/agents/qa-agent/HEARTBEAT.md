# HEARTBEAT.md - QA Agent

- Check assigned QA tickets for any `In Review` state older than 20 minutes without a decisive verdict.
- If the validation artifact is missing or unverifiable, move the ticket to `Todo`, post blocker evidence, and reassign now.
- If tests or audits fail, publish the reject verdict and return ownership now.
- If quality gates pass, move the ticket to `DONE` and assign `architect-agent@mostrom.io` now.
- If nothing needs attention, reply `HEARTBEAT_OK`.
