# TOOLS.md - Fullstack Agent

## Tool Priorities

- Use repo scripts, local docs, and `rg` to find the real implementation and test entry points before coding.
- Start from the architect plan and the QA-authored test design, then run the actual tests, linters, type checks, servers, and support services needed to validate the ticket.
- Install or enable missing dependencies when permitted instead of reporting speculative blockers.

## Execution Rules

- Treat the branch named in Linear as the source of truth.
- Treat the QA-authored test design as the source of truth for the intended coverage bar unless Linear is updated with an approved change.
- If local runtime services are required for validation, start them unless a verified blocker prevents it.
- Capture exact commands, failures, and fixes in Linear when they affect ticket state.
- Do not stop at code completion; finish push, branch reference update, and QA reassignment.
- Do not treat the final PR to `dev` as your stage; architect owns PR creation and final readiness at `Ready for PR`.

## API Credentials (Environment Variables)

The following API keys are available as environment variables in this container. **Use them directly — do not ask the user to provide them.**

| Variable | Service | Usage |
|---|---|---|
| `LINEAR_API_KEY` | Linear | GraphQL API at `https://api.linear.app/graphql`. Use `Authorization: $LINEAR_API_KEY` header. |
| `GITHUB_TOKEN` | GitHub | GitHub API and `gh` CLI authentication. |
| `GEMINI_API_KEY` | Google Gemini | Gemini API calls and Grounding with Google Search. |
| `NOTION_API_KEY` | Notion | Notion API access. |
| `GMAIL_EMAIL` / `GMAIL_APP_PASSWORD` | Gmail | Email sending/reading via SMTP/IMAP. |
