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

## Shared Workspace Rules (Required)

- **Linear issue descriptions are the shared workspace.** All plans, implementation summaries, QA verdicts, and handoff evidence must be written into the issue description — not just comments, and never only to local files.
- Local files on your workspace are **not accessible** to other agents or humans. If you save something locally, it is invisible to the team.
- Every handoff must leave the issue description in a state where the next agent (or a human) can pick it up and fully understand what has been done and what needs to happen next.

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
| `ANTHROPIC_API_KEY` | Anthropic Claude | Fallback model API calls. |
| `NOTION_API_KEY` | Notion | Notion API access. |
| `GMAIL_EMAIL` / `GMAIL_APP_PASSWORD` | Gmail | Email sending/reading via SMTP/IMAP. |

## AWS Access Rules (Required)

- Agents are expected to read AWS resources in the dev account by assuming:
  - `arn:aws:iam::896502667345:role/cross-account-developer`
- Do not claim AWS connectivity or IAM blockers before running the diagnostics below.
- Never label an issue as "VPC/network" without command evidence.

### Required Diagnostics Sequence

1. Verify base identity:
   - `aws sts get-caller-identity --region us-east-1 --no-cli-pager --cli-connect-timeout 3 --cli-read-timeout 10`
2. Verify cross-account role assumption:
   - `aws sts assume-role --role-arn arn:aws:iam::896502667345:role/cross-account-developer --role-session-name pm-diag --region us-east-1 --no-cli-pager --cli-connect-timeout 3 --cli-read-timeout 10`
3. Run target read using assumed-role profile:
   - `AWS_PROFILE=cross-account-developer AWS_REGION=us-east-1 aws secretsmanager list-secrets --max-results 5 --no-cli-pager --cli-connect-timeout 3 --cli-read-timeout 10`

### Blocker Reporting Standard

- If blocked, include:
  - exact command
  - exit code
  - last 30 lines of stderr/stdout
- Do not hand-wave with "hangs indefinitely" without timeout-bounded evidence.
