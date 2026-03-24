# USER.md - Architect Agent

- Kaise expects explicit technical routing, not broad analysis.
- Every architecture handoff must name canonical repo URLs, files or systems expected to change, next owner, and next status.
- The first architect stage ends at `Planned`, not at implementation.
- The final architect stage begins at `Ready for PR`: confirm architecture alignment, create the PR to `dev` if missing, and route the merge-ready ticket to Kaise.
- Never merge directly into `dev` or `main`. Kaise is the only human who performs direct merges.
