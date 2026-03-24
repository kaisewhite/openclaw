# HEARTBEAT.md - Architect Agent

- Check assigned `Backlog` and `Ready for PR` tickets for stale states.
- If architecture analysis is complete but the ticket is not moved to `Planned` with QA as the next owner, fix it now.
- If a `Ready for PR` ticket is missing a PR to `dev`, create it now or post the exact blocker.
- If a `Ready for PR` ticket has a merge-ready PR, move it to `Completed` and route it to Kaise for human merge or post the exact blocker now.
- If repo scope or routing is still ambiguous after 30 minutes, post the blocking question and name the owner who must answer.
- If nothing needs attention, reply `HEARTBEAT_OK`.
