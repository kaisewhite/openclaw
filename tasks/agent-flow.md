1. `pm-agent` owns `Backlog` intake and writes implementation-ready tickets.
2. `architect-agent` owns `Planned` and uses `writing-plans` (and `frontend-design` for UI-heavy work) to produce executable architecture + implementation guidance.
3. `architect-agent` moves ticket to `In Progress` and assigns `fullstack-agent`.
4. `fullstack-agent` owns `In Progress` and uses `strict-tdd` / `test-driven-development` to implement test-first.
5. `fullstack-agent` posts branch + SHA + validation evidence, then moves ticket to `In Review` and assigns `qa-agent`.
6. `qa-agent` owns `In Review` validation and may fix regressions directly on the same branch (test or code) instead of bouncing back to fullstack.
7. `qa-agent` re-runs validation after QA fixes and posts decisive verdict.
8. If quality gates pass, `qa-agent` moves ticket to `Completed` and assigns `architect-agent`.
9. `architect-agent` owns `Completed`, performs final closeout, and merges into `dev` only.

Canonical status model:

- `Backlog` -> `pm-agent`
- `Planned` -> `architect-agent`
- `In Progress` -> `fullstack-agent`
- `In Review` -> `qa-agent`
- `Completed` -> `architect-agent`

Rules:

- No legacy workflow states (`Test Designed`, `Ready for PR`).
- No QA/fullstack ping-pong for normal regressions; QA fixes directly in `In Review` when feasible.
- Every handoff must include branch, SHA, validation evidence, and explicit next owner/status.
- Merges are to `dev` only.
