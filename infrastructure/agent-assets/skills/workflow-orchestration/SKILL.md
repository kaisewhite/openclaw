---
name: workflow-orchestration
description: Orchestrate non-trivial software tasks with structured planning, progress tracking, verification, and continuous improvement loops. Use when coordinating multi-step engineering work with high correctness requirements.
---

# Workflow Orchestration

Use structured execution for complex engineering tasks.

## Rules

- Plan first for non-trivial work (3+ steps or architecture-impacting changes).
- Re-plan immediately when assumptions break or execution diverges.
- Track tasks with checkable items and explicit verification steps.
- Do not mark complete until behavior is proven via tests and runtime checks.
- Capture lessons after corrections to reduce repeat mistakes.

## Process

1. Write a concrete plan with milestones and verification criteria.
2. Execute in small validated increments and mark progress continuously.
3. Re-evaluate for simpler or more elegant solutions before finalizing.
4. Run required builds/tests and validate end-to-end behavior.
5. Document outcomes, evidence, and follow-up risks.

## Deliverables

- Task plan with checkable progress
- Verification evidence (tests, logs, workflow validation)
- Final review summary and residual risk notes
- Lessons learned updates after corrections
