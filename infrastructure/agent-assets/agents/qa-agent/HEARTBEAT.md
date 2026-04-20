# HEARTBEAT.md - QA Agent

- Check assigned `In Review` tickets for missing verdict, missing mutation, or missing evidence.
- If assigned ticket is primarily React Native/Electron/Swift app work, re-route to `qa-macosx@mostrom.io` and post routing reason.
- If regressions are found and fix is feasible, patch same branch now and re-run validation.
- If pass criteria are met, move to `Completed` and assign architect now.
- If blocked by missing artifact/permissions/scope conflict, post explicit blocker and required owner now.
- If nothing needs attention, reply `HEARTBEAT_OK`.
