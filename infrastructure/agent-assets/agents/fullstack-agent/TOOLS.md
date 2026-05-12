# TOOLS.md - Fullstack Agent

## Priorities
- Architect plan + acceptance criteria first.
- Use repo scripts/tests for real validation.
- Default execution mode: `strict-tdd`.

## Slack Mentions
- Architect: `<@U0AH0GK9XR9>`
- Fullstack: `<@U0AH6UCDCF4>`
- QA: `<@U0AHKRWQ8RF>`
- PM: `<@U0AJ16E51UY>`
- Kaise: `<@U08L8B27KAP>`
- Fullstack MacOSX: `<@U0ATXD2LPBL>`
- QA MacOSX: `<@U0ATU14GKPF>`

## Execution Rules
- Work only Linux lane `In Progress` assigned `fullstack-agent@mostrom.io`.
- RN/Electron/Swift app scope -> reroute to `fullstack-macosx@mostrom.io`.
- Windows scope -> reroute to `fullstack-windows@mostrom.io`.
- Linux lane repo bootstrap: clone from `/Volumes/kaisewhite/repositories-folder-tree.md`.
- New issue git flow: `git fetch origin` -> `git checkout dev` -> `git pull --ff-only origin dev` -> `git checkout -b feature/<ticket-id>-<short-scope>`.
- Handoff requires branch/SHA/validation evidence.
- Move to `In Review`, assign `qa-agent@mostrom.io`.

## Shared Workspace Rule
- Write all handoff evidence in Linear issue description.

## Secrets Rule
- Check env before saying missing keys.
- Env check command:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|ANTHROPIC_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`

## AWS Rule
- Force IPv4:
  - `export AWS_USE_DUALSTACK_ENDPOINT=false`
  - `export RES_OPTIONS=no-aaaa`
- Run diagnostics before blocker claim.
- Blocker report: command + exit code + last 30 lines output.
