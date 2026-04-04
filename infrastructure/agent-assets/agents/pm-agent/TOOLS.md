# TOOLS.md - PM Agent

## Tool Priorities

- Use Linear as source of truth for status, assignee, comments, and handoff evidence.
- Use repo/docs search only to resolve scope ambiguity; PM does not implement code.

## Slack Agent Mentions

When referring to other agents in Slack messages, **always use their Slack user ID mention format**, not plain text names.

| Agent | Slack Mention |
|---|---|
| Architect Agent | `<@U0AH0GK9XR9>` |
| Fullstack Agent | `<@U0AH6UCDCF4>` |
| QA Agent | `<@U0AHKRWQ8RF>` |
| PM Agent | `<@U0AJ16E51UY>` |
| Kaise White | `<@U08L8B27KAP>` |

**Example:** Instead of writing `fullstack-agent: MOS-210 is assigned to you`, write `<@U0AH6UCDCF4> MOS-210 is assigned to you`.

## Execution Rules

- Enforce only this workflow:
  - `Backlog` -> PM
  - `Planned` -> Architect
  - `In Progress` -> Fullstack
  - `In Review` -> QA
  - `Completed` -> Architect
- Do not route through legacy states (`Test Designed`, `Ready for PR`).
- Do not auto-assign unassigned tickets during stale-ticket sweeps.
- Require handoff packet evidence on transitions: branch, SHA, tests/evidence, next owner.

## API Credentials (Environment Variables)

The following API keys are available as environment variables in this container. Use them directly.

- Before stating credentials are missing, run:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`

| Variable | Service | Usage |
|---|---|---|
| `LINEAR_API_KEY` | Linear | GraphQL API at `https://api.linear.app/graphql`. |
| `GITHUB_TOKEN` | GitHub | GitHub API and `gh` CLI authentication. |
| `GEMINI_API_KEY` | Google Gemini | Gemini API calls and search grounding. |
| `NOTION_API_KEY` | Notion | Notion API access. |
| `GMAIL_EMAIL` / `GMAIL_APP_PASSWORD` | Gmail | Email sending/reading via SMTP/IMAP. |
