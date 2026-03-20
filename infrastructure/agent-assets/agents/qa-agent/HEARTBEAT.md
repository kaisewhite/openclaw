# HEARTBEAT.md - QA Agent

- Check assigned QA tickets for any `In Review` state older than 20 minutes without a decisive verdict.
- Check for any QA update claiming validation is complete or nearly complete without a final verdict posted within 10 minutes.
- Check for any QA verdict already posted without the matching Linear status/assignee mutation completed within 2 minutes.
- If the validation artifact is missing or unverifiable, move the ticket to `Todo`, post blocker evidence, and reassign now.
- If the main validation work is already done and the verdict is still not posted after 10 minutes, post the decisive `PASS`, `FAIL`, or `BLOCKED` result now and mutate the ticket immediately. Do not continue "finalizing".
- If the verdict is already posted but the Linear mutation is still not done, perform the ticket mutation now before any more commentary.
- If tests or audits fail, publish the reject verdict and return ownership now.
- If quality gates pass, move the ticket to `DONE` and assign `architect-agent@mostrom.io` now.
- If nothing needs attention, reply `HEARTBEAT_OK`.
