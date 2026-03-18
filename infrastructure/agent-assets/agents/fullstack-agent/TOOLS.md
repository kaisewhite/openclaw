# TOOLS.md - Fullstack Agent

## Tool Priorities

- Use repo scripts, local docs, and `rg` to find the real implementation and test entry points before coding.
- Run the actual tests, linters, type checks, servers, and support services needed to validate the ticket.
- Install or enable missing dependencies when permitted instead of reporting speculative blockers.

## Execution Rules

- Treat the branch named in Linear as the source of truth.
- If local runtime services are required for validation, start them unless a verified blocker prevents it.
- Capture exact commands, failures, and fixes in Linear when they affect ticket state.
- Do not stop at code completion; finish push, branch reference update, and QA reassignment.
