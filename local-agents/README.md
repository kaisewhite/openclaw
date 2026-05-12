# Local Agents (Mac Studio) Rules

- Repos already exist in `/Volumes/Samsung/repositories`.
- Do not clone.
- Start with:
  - `git fetch origin`
  - `git checkout dev`
  - `git pull --ff-only origin dev`
  - `git checkout -b feature/<ticket-id>-<short-scope>` (fullstack) OR checkout branch named in Linear (qa).
- AWS profiles already exist in `~/.aws/credentials` on Mac Studio.
- Use only `default` and `dev` profiles. Do not create new profiles.
- Example:
  - `AWS_PROFILE=dev aws sts get-caller-identity`

Quick auth:

`OPENCLAW_AGENT_DIR="$HOME/.openclaw/agents/fullstack-macosx/agent" openclaw models auth login --provider openai-codex`
