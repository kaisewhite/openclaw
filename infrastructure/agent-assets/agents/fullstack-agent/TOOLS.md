# TOOLS.md - Fullstack Agent

## Tool Priorities

- Use repo scripts, local docs, and `rg` to find the real implementation and test entry points before coding.
- Start from the architect plan and the QA-authored test design, then run the actual tests, linters, type checks, servers, and support services needed to validate the ticket.
- Install or enable missing dependencies when permitted instead of reporting speculative blockers.

## Execution Rules

- Treat the branch named in Linear as the source of truth.
- Treat the QA-authored test design as the source of truth for the intended coverage bar unless Linear is updated with an approved change.
- If local runtime services are required for validation, start them unless a verified blocker prevents it.
- Capture exact commands, failures, and fixes in Linear when they affect ticket state.
- Do not stop at code completion; finish push, branch reference update, and QA reassignment.
- Do not treat the final PR to `dev` as your stage; architect owns PR creation and final readiness at `Ready for PR`.
