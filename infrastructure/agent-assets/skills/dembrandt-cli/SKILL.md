---
name: dembrandt-cli
description: Use Dembrandt to extract a live website's design system into tokens, assets, and auditable JSON. Activate when the user wants to analyze branding, reverse-engineer a design system, benchmark competitor UI, or export design tokens from a website.
---

# Dembrandt CLI

Use this skill when you need to extract design tokens and brand assets from a live website.

Dembrandt is a Playwright-backed CLI that inspects a site in a real browser and extracts:

- colors
- typography
- spacing
- shadows
- borders and radius
- logos and favicons
- component styling patterns

## Installed Baseline

In this environment, agents have:

- `dembrandt` on `PATH`
- system `chromium` on `PATH`
- Dembrandt's Playwright Chromium and Firefox browsers preinstalled in the image

That means agents should normally run `dembrandt` directly instead of installing it ad hoc.

## Quick Start

Basic extraction:

```bash
dembrandt stripe.com
```

Raw JSON to stdout:

```bash
dembrandt stripe.com --json-only > tokens.json
```

W3C Design Tokens output:

```bash
dembrandt stripe.com --dtcg --json-only > dtcg-tokens.json
```

Dark mode extraction:

```bash
dembrandt stripe.com --dark-mode
```

Mobile viewport extraction:

```bash
dembrandt stripe.com --mobile
```

Slower, more reliable extraction for JS-heavy or bot-protected sites:

```bash
dembrandt stripe.com --slow
```

## Browser Strategy

Default browser path:

- start with the default Chromium-based run

If the target site is bot-protected or Chromium fails:

```bash
dembrandt stripe.com --browser=firefox
```

The Dembrandt docs explicitly call out Firefox as a better fallback for Cloudflare or bot-protected sites.

## Linux / Container Guidance

When running inside headless Linux containers, keep these rules in mind:

- prefer headless/default mode first
- if browser sandboxing causes startup failures, retry with:

```bash
dembrandt stripe.com --no-sandbox
```

- if the page is JS-heavy or hydration is slow, add `--slow`
- if you need visible troubleshooting locally, use `--debug`

Example resilient command:

```bash
dembrandt example.com --browser=firefox --slow --json-only > output.json
```

Example container-friendly fallback:

```bash
dembrandt example.com --no-sandbox --slow --json-only > output.json
```

## Output Expectations

Dembrandt writes extracted output to an `output/<domain>/...` path and can also emit JSON directly.

Use cases:

- competitor design audits
- customer brand reconstruction when no style guide exists
- extracting token baselines for frontend implementation
- benchmarking multiple brands with saved JSON artifacts

## Recommended Workflow

1. Run a normal extraction
2. If the site is protected or flaky, retry with `--browser=firefox`
3. If the site is JS-heavy, retry with `--slow`
4. If running in a restrictive container and browser launch fails, retry with `--no-sandbox`
5. Save JSON output when the result needs to be fed into design/code workflows

## Common Mistakes

- using raw page text or screenshots when the user actually asked for extracted tokens
- forgetting `--json-only` when the output needs to be piped into a file or another tool
- retrying the same browser repeatedly on protected sites instead of switching to Firefox
- claiming Dembrandt is unavailable without first checking `command -v dembrandt`
- treating browser launch failures as fatal before trying `--slow`, `--browser=firefox`, or `--no-sandbox`

## Failure Handling

If Dembrandt fails:

1. capture the exact command and error
2. note whether Chromium or Firefox was used
3. retry with the smallest meaningful change:
   - `--slow`
   - `--browser=firefox`
   - `--no-sandbox`
4. report the concrete failure if extraction still does not succeed
