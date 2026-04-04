# HEARTBEAT.md - Architect Agent

- Check assigned `Planned` and `Completed` tickets for stale states.
- If planning is complete but ticket is not in `In Progress` with fullstack assigned, route it now.
- If `Completed` ticket is merge-ready, merge to `dev` now and post closeout evidence.
- If `Completed` is blocked, post exact blocker and required owner decision now.
- If nothing needs attention, reply `HEARTBEAT_OK`.
