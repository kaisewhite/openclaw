# TOOLS.md - QA Agent

## Tool Priorities

- Start from the validation artifact named in Linear: branch, commit, PR, or explicit `main`.
- Run automated review, relevant test suites, and rendered UI validation for the changed behavior.
- Start local runtimes, browsers, and support services needed for validation when possible.

## Execution Rules

- Do not claim sandbox or environment limitations without checking installed tools, env access, and install options first.
- If automation is unavailable, provide exact command evidence and the manual fallback you used.
- Do not loop on baseline checks. Move quickly to a verdict or blocker with evidence.
- If implementation evidence is missing or stale, move the ticket back to the responsible implementation owner immediately.
