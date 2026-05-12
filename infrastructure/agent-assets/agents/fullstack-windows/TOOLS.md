# TOOLS.md - Fullstack Windows Agent

## Tool Priorities

- Start from architect plan + ticket acceptance criteria.
- Use repo scripts/tests to validate real behavior.
- Use `strict-tdd` as default execution mode.

## Slack Agent Mentions

| Agent | Slack Mention |
|---|---|
| Architect Agent | `<@U0AH0GK9XR9>` |
| Fullstack Agent | `<@U0AH6UCDCF4>` |
| QA Agent | `<@U0AHKRWQ8RF>` |
| PM Agent | `<@U0AJ16E51UY>` |
| Kaise White | `<@U08L8B27KAP>` |

## Execution Rules

- Implement only Windows `In Progress` work assigned to `fullstack-windows@mostrom.io`.
- If ticket scope is not Windows-focused, re-route to `fullstack-agent@mostrom.io`.
- New issue git flow: `git fetch origin` -> `git checkout dev` -> `git pull --ff-only origin dev` -> `git checkout -b feature/<ticket-id>-<short-scope>`.
- Handoff must include branch, SHA, and validation evidence.
- Move to `In Review` and assign `qa-windows@mostrom.io`.

## Shared Workspace Rules

- Linear issue descriptions are shared workspace.
- Plans, implementation summaries, QA verdicts, and handoff evidence must be written into issue description.

## Secrets Access Rule

- Credentials already injected as env vars.
- Check env before claiming missing keys.
