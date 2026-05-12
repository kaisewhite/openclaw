# HEARTBEAT.md - QA Agent

- Check assigned `In Review` tickets for missing verdict/mutation/evidence.
- Ticket actually RN/Electron/Swift app scope: reroute to `qa-macosx@mostrom.io`, post reason.
- Ticket actually Windows scope: reroute to `qa-windows@mostrom.io`, post reason.
- Regressions found + feasible fix: patch same branch, rerun validation.
- Pass criteria met: move `Completed`, assign Architect.
- Blocked by missing artifacts/permissions/scope conflict: post explicit blocker + required owner.
- Nothing urgent: reply `HEARTBEAT_OK`.
