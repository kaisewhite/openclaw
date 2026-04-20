# TOOLS.md - QA Agent

## Tool Priorities

- Start from ticket acceptance criteria + implementation branch evidence.
- Run automated tests and focused manual validation where needed.
- Apply direct fixes on same branch for regressions when practical.

## Slack Agent Mentions

When referring to other agents in Slack messages, **always use their Slack user ID mention format**, not plain text names.

| Agent | Slack Mention |
|---|---|
| Architect Agent | `<@U0AH0GK9XR9>` |
| Fullstack Agent | `<@U0AH6UCDCF4>` |
| QA Agent | `<@U0AHKRWQ8RF>` |
| PM Agent | `<@U0AJ16E51UY>` |
| Kaise White | `<@U08L8B27KAP>` |
| Fullstack MacOSX | `<@U0ATXD2LPBL>` |
| QA MacOSX | `<@U0ATU14GKPF>` |

**Example:** Instead of writing `fullstack-agent: MOS-210 is assigned to you`, write `<@U0AH6UCDCF4> MOS-210 is assigned to you`.

## Shared Workspace Rules (Required)

- **Linear issue descriptions are the shared workspace.** All plans, implementation summaries, QA verdicts, and handoff evidence must be written into the issue description — not just comments, and never only to local files.
- Local files on your workspace are **not accessible** to other agents or humans. If you save something locally, it is invisible to the team.
- Every handoff must leave the issue description in a state where the next agent (or a human) can pick it up and fully understand what has been done and what needs to happen next.

## Execution Rules

- Work only in Linux (AWS) lane `In Review` assignments (`qa-agent@mostrom.io`) unless explicitly redirected.
- If ticket scope is primarily React Native/Electron/Swift app work, re-route to `qa-macosx@mostrom.io` instead of validating in this lane.
- Use one decisive closeout action: verdict + status mutation + assignee mutation.
- Pass -> `Completed` with architect assigned.
- Do not route via legacy states (`Test Designed`, `Ready for PR`).

## Secrets Access Rule (Required)

- API credentials are already injected into the container as environment variables.
- **Never say you cannot access secrets/credentials until you have actually checked the environment.**
- Before claiming a key is missing, run an environment check for the exact variable(s) you need.
- If a key is present but invalid, say **invalid** or **auth failure** — do not say missing.
- If a key is absent, report the exact variable name that is missing.

## API Credentials (Environment Variables)

- Before stating credentials are missing, run:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|ANTHROPIC_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`

The following API keys are available as environment variables in this container. **Use them directly — do not ask the user to provide them. Before saying anything is missing, check env first.**

| Variable | Service | Usage |
|---|---|---|
| `LINEAR_API_KEY` | Linear | GraphQL API at `https://api.linear.app/graphql`. Use `Authorization: $LINEAR_API_KEY` header. |
| `GITHUB_TOKEN` | GitHub | GitHub API and `gh` CLI authentication. |
| `GEMINI_API_KEY` | Google Gemini | Gemini API calls and Grounding with Google Search. |
| `ANTHROPIC_API_KEY` | Anthropic Claude | Fallback model API calls. |
| `NOTION_API_KEY` | Notion | Notion API access. |
| `GMAIL_EMAIL` / `GMAIL_APP_PASSWORD` | Gmail | Email sending/reading via SMTP/IMAP. |

## AWS Access Rules (Required)

- Agents are expected to read AWS resources in the dev account using the configured cross-account access path.
- Force IPv4 for AWS CLI in this environment:
  - `export AWS_USE_DUALSTACK_ENDPOINT=false`
  - `export RES_OPTIONS=no-aaaa`
- Do not claim AWS connectivity or IAM blockers before running the diagnostics below.
- Never label an issue as "VPC/network" without command evidence.

### Diagnostics Intent

- Confirm base AWS identity.
- Confirm cross-account identity/context.
- Confirm the exact target read operation works in that context.
- Use short timeouts and no pager so diagnostics are deterministic.

### Blocker Reporting Standard

- If blocked, include:
  - exact command
  - exit code
  - last 30 lines of stderr/stdout
- Do not hand-wave with "hangs indefinitely" without timeout-bounded evidence.
