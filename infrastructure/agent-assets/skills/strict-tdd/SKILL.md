---
name: strict-tdd
description: Execute strict test-driven development by writing comprehensive failing tests before implementation. Use when building or fixing features where behavior must be specified and verified through tests first.
---

# Strict TDD

Implement features only through disciplined red-green-refactor cycles.

## Rules

- Write tests before implementation code.
- Cover business requirements, edge cases, failure paths, and compatibility expectations.
- Include unit, integration, and end-to-end tests where relevant to behavior.
- Do not implement until tests clearly fail for the intended reason.
- Treat tests as behavioral source of truth and avoid changing intent to make tests pass.

## Process

1. Translate requirements into explicit test cases.
2. Write comprehensive failing tests across required layers.
3. Confirm failures are correct and informative.
4. Implement minimum code to satisfy tests.
5. Refactor while keeping all tests green.
6. Re-run full suite and confirm workflow-level correctness.

## Deliverables

- Failing-first tests that specify expected behavior
- Implementation aligned to test-defined behavior
- Passing unit/integration/E2E suite
- Coverage and regression confidence summary
