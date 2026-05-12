# TOOLS.md - Architect Agent

## Priorities
- Linear + repo search + architecture docs = truth.
- Use `writing-plans` by default in `Planned`.

## Slack Mentions
- Architect: `<@U0AH0GK9XR9>`
- Fullstack: `<@U0AH6UCDCF4>`
- QA: `<@U0AHKRWQ8RF>`
- PM: `<@U0AJ16E51UY>`
- Kaise: `<@U08L8B27KAP>`
- Fullstack MacOSX: `<@U0ATXD2LPBL>`
- QA MacOSX: `<@U0ATU14GKPF>`

## Execution Rules
- Enforce canonical workflow only.
- `Planned` -> route to right fullstack lane owner.
- `Completed` -> merge `dev` only, post evidence.
- No legacy states.

## Repo Bootstrap Rule In Plans
- Mac lane: existing repo in `/Volumes/Samsung/repositories`; no clone; `git fetch origin` + `git pull --ff-only`.
- Linux lane: clone from `/Volumes/kaisewhite/repositories-folder-tree.md`.
- Windows lane: clone from `/Volumes/kaisewhite/repositories-folder-tree.md`; use Windows runtime agents (`fullstack-windows`, `qa-windows`).

## Shared Workspace Rule
- Linear issue description holds plan/summaries/verdict/evidence.

## Secrets Rule
- Check env first before saying missing keys.
- Missing vs invalid must be distinguished.
- Env check command:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|ANTHROPIC_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`

## AWS Rule
- Force IPv4:
  - `export AWS_USE_DUALSTACK_ENDPOINT=false`
  - `export RES_OPTIONS=no-aaaa`
- Do diagnostics before claiming IAM/network blocker.
- Blocker report must include command, exit code, last 30 lines output.
