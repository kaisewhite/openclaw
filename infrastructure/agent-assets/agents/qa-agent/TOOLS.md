# TOOLS.md - QA Agent

## Priorities
- Start from acceptance criteria + implementation evidence.
- Run automated tests + targeted manual checks.
- Patch regressions directly when practical.

## Slack Mentions
- Architect: `<@U0AH0GK9XR9>`
- Fullstack: `<@U0AH6UCDCF4>`
- QA: `<@U0AHKRWQ8RF>`
- PM: `<@U0AJ16E51UY>`
- Kaise: `<@U08L8B27KAP>`
- Fullstack MacOSX: `<@U0ATXD2LPBL>`
- QA MacOSX: `<@U0ATU14GKPF>`

## Execution Rules
- Work only Linux lane `In Review` assigned `qa-agent@mostrom.io`.
- RN/Electron/Swift app scope -> reroute `qa-macosx@mostrom.io`.
- Windows scope -> reroute `qa-windows@mostrom.io`.
- Linux lane repo bootstrap: clone from `/Volumes/kaisewhite/repositories-folder-tree.md`.
- New issue git flow: `git fetch origin` -> `git checkout dev` -> `git pull --ff-only origin dev` -> checkout branch named in ticket (or create `feature/<ticket-id>-<short-scope>` from `dev` if missing).
- One closeout action: verdict + status mutation + assignee mutation.
- Pass -> `Completed` with Architect.

## Shared Workspace Rule
- Put QA verdict/evidence/fixes in Linear issue description.

## Secrets Rule
- Check env before missing-key claim.
- Env check command:
  - `env | rg '^(LINEAR_API_KEY|GITHUB_TOKEN|GEMINI_API_KEY|ANTHROPIC_API_KEY|NOTION_API_KEY|GMAIL_EMAIL|GMAIL_APP_PASSWORD)='`

## AWS Rule
- Force IPv4:
  - `export AWS_USE_DUALSTACK_ENDPOINT=false`
  - `export RES_OPTIONS=no-aaaa`
- Diagnostics before IAM/network blocker claims.
