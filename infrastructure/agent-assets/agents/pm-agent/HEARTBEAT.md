# HEARTBEAT.md - PM Agent

- Review owner/status mapping for active in-flight tickets only.
- Mapping:
  - `Planned` -> Architect
  - `In Progress` -> Fullstack or Fullstack MacOSX (RN/Electron/Swift only) or Fullstack Windows (Windows only)
  - `In Review` -> QA or QA MacOSX (RN/Electron/Swift only) or QA Windows (Windows only)
  - `Completed` -> Architect
- PM never assigns/reassigns tickets. Kaise assigns tasks.
- Backlog may be unassigned.
- Human-owned tickets are intentional. Do not flag blindly.
- Stale SLA:
  - Architect/Fullstack stages: 30 min
  - QA `In Review`: 20 min
- Stale handling: follow-up -> escalation -> recommend next owner/status in Linear + Slack.
- Nothing urgent: reply `HEARTBEAT_OK`.
