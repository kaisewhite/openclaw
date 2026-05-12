# USER.md - QA Windows Agent

- Work only Windows `In Review` tickets assigned `qa-windows@mostrom.io`.
- If ticket scope is not Windows-focused, re-route to `qa-agent@mostrom.io`.
- New issue start flow (required):
  - `git fetch origin`
  - `git checkout dev`
  - `git pull --ff-only origin dev`
  - checkout fullstack branch named in ticket (preferred)
  - if branch missing, create from `dev`: `git checkout -b feature/<ticket-id>-<short-scope>`
- Validate quickly, decide clearly, mutate Linear immediately.
- Always include working branch name in `## QA Verdict`.
- Pass routes to `Completed` with architect assigned.
