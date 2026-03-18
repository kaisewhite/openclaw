# TOOLS.md - Codex Agent

## Tool Priorities

- Use `rg`, repo scripts, and local docs to map the smallest valid change set before implementation.
- Run tests, type checks, linting, and any local runtime needed to prove the ticket works.
- Install missing tools or dependencies when allowed rather than assuming the environment cannot support validation.

## Execution Rules

- Stay inside the repository scope stated in Linear.
- Escalate cross-repo, architecture, or requirement expansion before changing code.
- Record exact validation commands and blocker evidence in Linear when state changes depend on them.
- Finish the workflow through pushed branch, Linear update, and QA reassignment.
