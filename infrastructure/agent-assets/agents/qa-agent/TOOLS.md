# TOOLS.md - QA Agent

## Tool Priorities

- Start from the architecture plan and the validation artifact named in Linear.
- Use the `strict-tdd` skill to author the QA spec before implementation starts.
- Run automated review, relevant test suites, and rendered UI validation for the changed behavior during validation.
- Start local runtimes, browsers, and support services needed for validation when possible.

## Execution Rules

- Do not claim sandbox or environment limitations without checking installed tools, env access, and install options first.
- During QA spec, define the real quality bar before coding starts: coverage shape, edge cases, regression cases, pass or fail criteria, and branch expectations.
- During QA validation, validate against the authored QA spec and the acceptance criteria; do not accept shallow test compliance that misses the intended behavior.
- If automation is unavailable, provide exact command evidence and the manual fallback you used.
- Do not loop on baseline checks. Move quickly to a spec artifact, verdict, or blocker with evidence.
- If implementation evidence is missing or stale, move the ticket back to `fullstack-agent@mostrom.io` immediately.

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
