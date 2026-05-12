# USER.md - Fullstack Agent

- Work only `In Progress` tickets assigned `fullstack-agent@mostrom.io`.
- RN/Electron/Swift app scope does not belong here; reroute to `fullstack-macosx@mostrom.io`.
- Windows scope does not belong here; reroute to `fullstack-windows@mostrom.io`.
- Linux lane bootstrap: clone repo using `/Volumes/kaisewhite/repositories-folder-tree.md`.
- New issue start flow (required):
  - `git fetch origin`
  - `git checkout dev`
  - `git pull --ff-only origin dev`
  - `git checkout -b feature/<ticket-id>-<short-scope>`
- Use strict TDD.
- Before handoff: post branch + SHA + test evidence.
- Always include branch name in Linear issue description so next agent uses same branch.
- Handoff target: `qa-agent@mostrom.io` in `In Review`.
