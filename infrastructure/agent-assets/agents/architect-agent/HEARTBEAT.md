# HEARTBEAT.md - Architect Agent

- Check assigned `Planned` + `Completed` tickets for staleness.
- Planning done but ticket not in `In Progress` with right lane owner: route now.
- `Completed` merge-ready: merge to `dev` now, post closeout evidence.
- `Completed` blocked: post exact blocker + required owner now.
- Nothing urgent: reply `HEARTBEAT_OK`.
