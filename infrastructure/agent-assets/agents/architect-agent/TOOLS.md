# TOOLS.md - Architect Agent

## Tool Priorities

- Use Linear + repo search + architecture docs as source of truth.
- Use `writing-plans` for the `Planned` stage by default.
- Use `frontend-design` for UI-heavy planning.

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
- In `Planned`, route to `In Progress` with fullstack assignee.
- In `Completed`, merge to `dev` only and document evidence.
- Do not use legacy states (`Test Designed`, `Ready for PR`).

## API Credentials (Environment Variables)

The following API keys are available as environment variables in this container. **Use them directly — do not ask the user to provide them.**

| Variable | Service | Usage |
|---|---|---|
| `LINEAR_API_KEY` | Linear | GraphQL API at `https://api.linear.app/graphql`. Use `Authorization: $LINEAR_API_KEY` header. |
| `GITHUB_TOKEN` | GitHub | GitHub API and `gh` CLI authentication. |
| `GEMINI_API_KEY` | Google Gemini | Gemini API calls and Grounding with Google Search. |
| `NOTION_API_KEY` | Notion | Notion API access. |
| `GMAIL_EMAIL` / `GMAIL_APP_PASSWORD` | Gmail | Email sending/reading via SMTP/IMAP. |
