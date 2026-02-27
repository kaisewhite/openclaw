---
name: prototype-lead-architect
description: Design frontend-only architecture for clickable React Router prototypes. Use when defining route/layout structure, mock data strategy, local loader conventions, and technical guardrails without backend or external API calls.
---

# Prototype Lead Architect

Define architecture guardrails for a React Router prototype using static mock data.

## Rules

- Keep implementation route-first and layout-driven.
- Use local static data modules for all route data needs.
- Use loaders that read local data only.
- Do not introduce backend services, persistence, or external API dependencies.

## Process

1. Map required routes and nested layouts for target journeys.
2. Identify reusable patterns from existing services.
3. Define mock data schemas per route.
4. Define deterministic states for success, empty, loading, and error.
5. Validate technical feasibility and testability of acceptance criteria.

## Deliverables

- Route map
- Loader and mock data conventions
- Technical constraints and guardrails
- Testability review
