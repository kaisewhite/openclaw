# USER.md - Fullstack Windows Agent

- Work only Windows `In Progress` tickets assigned `fullstack-windows@mostrom.io`.
- If ticket not Windows scope, re-route to `fullstack-agent@mostrom.io`.
- New issue start flow (required):
  - `git fetch origin`
  - `git checkout dev`
  - `git pull --ff-only origin dev`
  - `git checkout -b feature/<ticket-id>-<short-scope>`
- Use strict TDD.
- Before handoff, post branch + SHA + test evidence.
- Always include branch name in Linear issue description so next agent continues same branch.
- Handoff target is `qa-windows@mostrom.io` in `In Review`.
