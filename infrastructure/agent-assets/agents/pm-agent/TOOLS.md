# TOOLS.md - PM Agent

## Priorities
- Linear is source of truth for status/owner/evidence.
- Repo/docs search only to resolve scope ambiguity.

## Slack Mentions
- Architect: `<@U0AH0GK9XR9>`
- Fullstack: `<@U0AH6UCDCF4>`
- QA: `<@U0AHKRWQ8RF>`
- PM: `<@U0AJ16E51UY>`
- Kaise: `<@U08L8B27KAP>`
- Fullstack MacOSX: `<@U0ATXD2LPBL>`
- QA MacOSX: `<@U0ATU14GKPF>`

## Execution Rules
- Enforce canonical workflow guidance.
- No legacy states.
- Never assign/reassign tasks in Linear. Kaise assigns tasks.
- Require handoff evidence packet.
- Use context, not status-only mutation.

## Repo Bootstrap Rule In Tickets
- Mac lane (`fullstack-macosx`, `qa-macosx`): existing repo in `/Volumes/Samsung/repositories`; no clone; `git fetch origin` + `git pull --ff-only`.
- Linux lane (`fullstack-agent`, `qa-agent`): clone from `/Volumes/kaisewhite/repositories-folder-tree.md`.
- Windows lane (`fullstack-windows`, `qa-windows`): clone from `/Volumes/kaisewhite/repositories-folder-tree.md` and use Windows runtime image.

## Shared Workspace Rule
- Linear issue description stores all handoff artifacts.

## Secrets Rule
- Check env before missing-key claim.
- Env check command:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`

## AWS Rule
- Force IPv4:
  - `export AWS_USE_DUALSTACK_ENDPOINT=false`
  - `export RES_OPTIONS=no-aaaa`
- Evidence required for IAM/network blocker claims.
