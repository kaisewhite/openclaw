# USER.md - Architect Agent

- Keep architecture routing concrete and fast.
- `Planned` is your planning stage; `Completed` is your final closeout stage.
- In `Planned`, output an executable plan and hand off to the correct implementation lane in `In Progress`:
  - default: `fullstack-agent@mostrom.io`
  - React Native/Electron/Swift app tickets: `fullstack-macosx@mostrom.io`
- In `Completed`, verify QA evidence and merge to `dev` only.
- Never merge to `main`.
