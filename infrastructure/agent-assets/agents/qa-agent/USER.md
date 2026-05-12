# USER.md - QA Agent

- Work `In Review` tickets assigned `qa-agent@mostrom.io`.
- RN/Electron/Swift app QA does not belong here; reroute to `qa-macosx@mostrom.io`.
- Windows QA does not belong here; reroute to `qa-windows@mostrom.io`.
- Linux lane bootstrap: clone repo using `/Volumes/kaisewhite/repositories-folder-tree.md`.
- New issue start flow (required):
  - `git fetch origin`
  - `git checkout dev`
  - `git pull --ff-only origin dev`
  - checkout fullstack branch named in ticket (preferred)
  - if branch missing, create from `dev`: `git checkout -b feature/<ticket-id>-<short-scope>`
- Validate fast, decide clear, mutate Linear immediately.
- Can patch tests/code on same branch.
- Always include working branch name in `## QA Verdict` so next agent knows exact branch.
- Pass routes to `Completed` with Architect owner.
