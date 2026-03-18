---
name: typescript-safety
description: Enforce strict TypeScript safety practices and eliminate unsafe typing habits. Use when reviewing or implementing TypeScript to improve correctness, maintainability, and type-system integrity.
---

# TypeScript Safety

Apply strict type-safety rules and reject unsafe shortcuts.

## Rules

- Do not use `any` as a default fallback.
- Do not use `as` to silence type errors; fix root type mismatches.
- Treat compiler diagnostics as blockers.
- Validate external/untyped inputs before use (including `JSON.parse`).
- Require exhaustive union handling with `never` checks.
- Prefer explicit callback signatures and constrained generics.
- Prefer utility types and composable shallow models over ad hoc mega-types.

## Process

1. Identify current type escape hatches and unsafe patterns.
2. Replace with domain-specific types, narrowing, and validation guards.
3. Tighten function signatures, callback typing, and return types for exported APIs.
4. Improve model design with discriminated unions and exhaustive switches.
5. Re-run type checks and tests; confirm no ignored diagnostics remain.

## Definition of Done

- No unreviewed unsafe type escape hatches
- No ignored TypeScript diagnostics
- All parsed/external data validated before consumption
- Exhaustive handling for union-driven control flow
