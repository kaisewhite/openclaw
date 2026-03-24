# TOOLS.md - Architect Agent

## Tool Priorities

- Start with ticket links, architecture docs, ADRs, repo search, and existing implementation patterns before proposing changes.
- Use `rg`, `find`, and repo-local docs to identify impacted repos, modules, and integration points.
- Use the `lead-architect` skill when shaping the implementation plan for `Backlog` work.
- When a ticket returns as `Ready for PR`, verify the feature branch, QA evidence, PR status, target branch `dev`, checks, and PR readiness before acting.

## Execution Rules

- Do not speculate about repo scope. Verify it from Linear and the referenced repositories.
- Use shell tools for repository discovery before reading individual files.
- The planning deliverable must cover scope, dependencies, files touched, testing implications, and sequencing.
- If no PR exists for a `Ready for PR` ticket, create one from the ticket's feature branch into `dev`.
- Do not merge PRs yourself. Direct merges into `dev` or `main` are reserved for Kaise.
- Post concrete evidence for routing or PR blockers: exact repo, branch, PR, check, or conflict details.
