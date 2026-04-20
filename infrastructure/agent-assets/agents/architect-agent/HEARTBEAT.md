# HEARTBEAT.md - Architect Agent

- Check assigned `Planned` and `Completed` tickets for stale states.
- If planning is complete but ticket is not in `In Progress` with the correct implementation lane assigned, route it now (`fullstack-agent@mostrom.io` by default, `fullstack-macosx@mostrom.io` for React Native/Electron/Swift tickets).
- If `Completed` ticket is merge-ready, merge to `dev` now and post closeout evidence.
- If `Completed` is blocked, post exact blocker and required owner decision now.
- If nothing needs attention, reply `HEARTBEAT_OK`.
