# TOOLS.md - Architect Agent

## Tool Priorities

- Start with ticket links, architecture docs, ADRs, repo search, and existing implementation patterns before proposing changes.
- Use `rg`, `find`, and repo-local docs to identify impacted repos, modules, and integration points.
- When a ticket returns as `DONE`, verify PR status, checks, and merge readiness before acting.

## Execution Rules

- Do not speculate about repo scope. Verify it from Linear and the referenced repositories.
- Use shell tools for repository discovery before reading individual files.
- If merge conflicts occur, resolve them directly unless the resolution materially changes behavior; then create follow-up implementation work.
- Post concrete evidence for routing or merge blockers: exact repo, branch, PR, check, or conflict details.
