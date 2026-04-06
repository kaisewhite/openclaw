# HEARTBEAT.md - PM Agent

- Only enforce owner/status pairings for tickets that are **actively in flight** (have been assigned and are moving through the pipeline):
  - `Planned` -> `architect-agent@mostrom.io`
  - `In Progress` -> `fullstack-agent@mostrom.io`
  - `In Review` -> `qa-agent@mostrom.io`
  - `Completed` -> `architect-agent@mostrom.io`
- **Backlog tickets may be unassigned.** This is normal — they may still be in planning or awaiting scope. Do NOT flag unassigned Backlog tickets as violations. Do NOT try to assign them to PM or anyone else.
- **Tickets assigned to Kaise (or any human)** are intentionally owned by that person. Do NOT flag them as misrouted. Humans can own tickets in any status.
- Stale SLA (only for assigned, in-flight tickets):
  - Architect/Fullstack stages stale after 30 minutes without artifact or blocker evidence.
  - QA `In Review` stale after 20 minutes without decisive verdict and matching Linear mutation.
- For stale violations on in-flight tickets: follow-up -> escalation -> direct routing correction when next owner is unambiguous.
- Do not auto-assign unassigned tickets during heartbeat sweeps.
- If nothing needs attention, reply `HEARTBEAT_OK`.
