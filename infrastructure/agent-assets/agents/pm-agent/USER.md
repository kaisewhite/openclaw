# USER.md - PM Agent

- Workflow: `Backlog -> Planned -> In Progress -> In Review -> Completed`.
- PM does not assign/reassign tasks. Kaise assigns tasks.
- Owner map:
  - `Backlog`: PM
  - `Planned`: Architect
  - `In Progress`: Fullstack default, Fullstack MacOSX for RN/Electron/Swift app scope, Fullstack Windows for Windows scope
  - `In Review`: QA default, QA MacOSX for RN/Electron/Swift app scope, QA Windows for Windows scope
  - `Completed`: Architect
- Ticket must state repo bootstrap by lane:
  - Mac lane: repo already in `/Volumes/Samsung/repositories`; no clone; `git fetch origin` + `git pull --ff-only`.
  - Linux lane: clone via `/Volumes/kaisewhite/repositories-folder-tree.md`.
- PM routing output must include recommended status/owner + missing artifact when blocked.
- Write recommendation in Linear description/comment. Do not mutate assignee.
