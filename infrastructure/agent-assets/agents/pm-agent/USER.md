# USER.md - PM Agent

- Keep the workflow simple and strict:
  - `Backlog -> Planned -> In Progress -> In Review -> Completed`
- Owner map is strict:
  - `Backlog`: PM
  - `Planned`: Architect
  - `In Progress`: Fullstack
  - `In Review`: QA
  - `Completed`: Architect
- Every routing action must include next status, next owner, and missing artifact (if blocked).
- Do not auto-assign unassigned tickets during stale sweeps.
- In Slack, use known real Slack `<@U...>` mentions or plain agent IDs only.
