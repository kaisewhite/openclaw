# HEARTBEAT.md - PM Agent

- Enforce strict owner/status pairings:
  - `Backlog` -> `pm-agent@mostrom.io`
  - `Planned` -> `architect-agent@mostrom.io`
  - `In Progress` -> `fullstack-agent@mostrom.io`
  - `In Review` -> `qa-agent@mostrom.io`
  - `Completed` -> `architect-agent@mostrom.io`
- Stale SLA:
  - PM/Architect/Fullstack stages stale after 30 minutes without artifact or blocker evidence.
  - QA `In Review` stale after 20 minutes without decisive verdict and matching Linear mutation.
- For stale violations: follow-up -> escalation -> direct routing correction when next owner is unambiguous.
- Do not auto-assign unassigned tickets during heartbeat sweeps.
- If nothing needs attention, reply `HEARTBEAT_OK`.
