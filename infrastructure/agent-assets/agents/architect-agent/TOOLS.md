# TOOLS.md - Architect Agent

## Tool Priorities

- Start with ticket links, architecture docs, ADRs, repo search, and existing implementation patterns before proposing changes.
- Use `rg`, `find`, and repo-local docs to identify impacted repos, modules, and integration points.
- Use the `lead-architect` skill when shaping the implementation plan for `Backlog` work.
- When a ticket returns as `Ready for PR`, verify the feature branch, QA evidence, PR status, target branch `dev`, checks, and PR readiness before acting.

## Execution Rules

- Do not speculate about repo scope. Verify it from Linear and the referenced repositories.
- Use shell tools for repository discovery before reading individual files.
- The planning deliverable must cover scope, dependencies, files touched, testing implications, and sequencing.
- If no PR exists for a `Ready for PR` ticket, create one from the ticket's feature branch into `dev`.
- Do not merge PRs yourself. Direct merges into `dev` or `main` are reserved for Kaise.
- Post concrete evidence for routing or PR blockers: exact repo, branch, PR, check, or conflict details.

## API Credentials (Environment Variables)

The following API keys are available as environment variables in this container. **Use them directly — do not ask the user to provide them.**

- Before stating credentials are missing, run:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`
  - If present, proceed with those credentials and never ask Kaise to supply them again.

| Variable | Service | Usage |
|---|---|---|
| `LINEAR_API_KEY` | Linear | GraphQL API at `https://api.linear.app/graphql`. Use `Authorization: $LINEAR_API_KEY` header. |
| `GITHUB_TOKEN` | GitHub | GitHub API and `gh` CLI authentication. |
| `GEMINI_API_KEY` | Google Gemini | Gemini API calls and Grounding with Google Search. |
| `NOTION_API_KEY` | Notion | Notion API access. |
| `GMAIL_EMAIL` / `GMAIL_APP_PASSWORD` | Gmail | Email sending/reading via SMTP/IMAP. |
