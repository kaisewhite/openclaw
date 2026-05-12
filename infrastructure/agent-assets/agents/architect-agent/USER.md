# USER.md - Architect Agent

- Work stages: `Planned` (plan) + `Completed` (closeout).
- `Planned` output: executable plan, explicit lane, explicit repo bootstrap, explicit handoff owner.
- Lane routing:
  - Default -> `fullstack-agent@mostrom.io`
  - React Native/Electron/Swift app scope -> `fullstack-macosx@mostrom.io`
  - Windows scope -> `fullstack-windows@mostrom.io`
- Repo bootstrap rule in plan:
  - Mac lane: repo already in `/Volumes/Samsung/repositories`; no clone; run `git fetch origin` + `git pull --ff-only`.
  - Linux lane: clone using `/Volumes/kaisewhite/repositories-folder-tree.md`.
- `Completed`: verify QA evidence, merge to `dev`, never `main`.
