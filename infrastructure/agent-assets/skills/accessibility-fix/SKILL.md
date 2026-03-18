---
name: accessibility-fix
description: Fix accessibility issues in rendered UIs with a focus on measured contrast, light/dark theme integrity, interaction-state visibility, and non-color signaling. Use after or during audits to produce concrete code-level remediation.
---

# Accessibility Fix

Apply targeted, code-level remediations for accessibility defects with runtime-verifiable outcomes.

## Rules

- Use rendered UI evidence, not token-only estimates.
- Measure and remediate contrast for both text and non-text elements.
- Validate light and dark mode independently; prevent theme leakage/hydration drift.
- Cover interaction states: default, hover, focus-visible, selected, active, disabled, placeholder, links, status.
- Enforce WCAG thresholds:
  - `4.5:1` normal text
  - `3:1` large text
  - `3:1` non-text UI components/focus indicators/boundaries
- Remove color-only meaning by adding non-color cues (label/icon/pattern/text cue).

## Process

1. Identify failing surfaces from screenshots or rendered pages.
2. Measure ratios and classify failures by severity and user impact.
3. Propose minimal, explicit fixes (exact color pairs, CSS specificity adjustments, state styling updates).
4. Implement changes in code.
5. Re-measure and confirm pass/fail closure.
6. Separate theme-state bugs from pure contrast issues in the report.

## Deliverables

- Pass/fail summary by category
- Findings + fixes table:
  - element/state
  - measured ratio
  - required threshold
  - exact code change
- Theme-specific differences (light-only vs dark-only)
- Residual risks and follow-up items

