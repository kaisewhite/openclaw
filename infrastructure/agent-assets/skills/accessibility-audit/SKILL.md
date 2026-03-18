---
name: accessibility-audit
description: Audit rendered UIs for accessibility with emphasis on measured contrast, light/dark theme integrity, and state-level visibility issues. Use when reviewing web interfaces for WCAG conformance and actionable fixes.
---

# Accessibility Audit

Run a rendered-UI accessibility audit with measurable evidence.

## Rules

- Measure computed foreground/background contrast on real rendered pages.
- Audit both light and dark themes, including theme persistence/hydration integrity.
- Validate all key states: default, hover, focus-visible, selected, active, disabled, placeholder, and status states.
- Enforce WCAG thresholds: `4.5:1` normal text, `3:1` large text, `3:1` non-text UI components.
- Flag color-only signaling and require non-color alternatives.

## Process

1. Collect target pages/components and enabled themes.
2. Measure contrast on rendered surfaces (text, icons, borders, focus rings, overlays, gradients).
3. Validate theme-state correctness and leakage between light/dark.
4. Identify failures by element and interaction state.
5. Propose exact, minimally invasive fixes with updated color pairs or styling rules.
6. If automation cannot run, document why and provide manual measured fallback for critical surfaces.

## Deliverables

- Pass/fail summary by category
- Findings table: element/state, colors, measured ratio, threshold, pass/fail, exact fix
- Theme-specific issue split (light-only vs dark-only)
- Separate section for theme-state bugs vs pure contrast issues
