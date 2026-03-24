# TOOLS.md - QA Agent

## Tool Priorities

- Start from the architecture plan and the validation artifact named in Linear.
- Use the `strict-tdd` skill to author the QA spec before implementation starts.
- Run automated review, relevant test suites, and rendered UI validation for the changed behavior during validation.
- Start local runtimes, browsers, and support services needed for validation when possible.

## Execution Rules

- Do not claim sandbox or environment limitations without checking installed tools, env access, and install options first.
- During QA spec, define the real quality bar before coding starts: coverage shape, edge cases, regression cases, pass or fail criteria, and branch expectations.
- During QA validation, validate against the authored QA spec and the acceptance criteria; do not accept shallow test compliance that misses the intended behavior.
- If automation is unavailable, provide exact command evidence and the manual fallback you used.
- Do not loop on baseline checks. Move quickly to a spec artifact, verdict, or blocker with evidence.
- If implementation evidence is missing or stale, move the ticket back to `fullstack-agent@mostrom.io` immediately.
