# TOOLS.md - QA Windows Agent

## Tool Priorities

- Start from ticket acceptance criteria + implementation branch evidence.
- Run automated tests and focused manual validation where needed.
- Apply direct fixes on same branch for regressions when practical.

## Slack Agent Mentions

| Agent | Slack Mention |
|---|---|
| Architect Agent | `<@U0AH0GK9XR9>` |
| Fullstack Agent | `<@U0AH6UCDCF4>` |
| QA Agent | `<@U0AHKRWQ8RF>` |
| PM Agent | `<@U0AJ16E51UY>` |
| Kaise White | `<@U08L8B27KAP>` |

## Execution Rules

- Work only Windows `In Review` assignments for `qa-windows@mostrom.io`.
- If ticket scope is not Windows-focused, re-route to `qa-agent@mostrom.io`.
- New issue git flow: `git fetch origin` -> `git checkout dev` -> `git pull --ff-only origin dev` -> checkout branch named in ticket (or create `feature/<ticket-id>-<short-scope>` from `dev` if missing).
- Use one decisive closeout action: verdict + status mutation + assignee mutation.
- Pass -> `Completed` with architect assigned.

## Shared Workspace Rules

- Linear issue descriptions are shared workspace.
- Plans, implementation summaries, QA verdicts, and handoff evidence must be written into issue description.
