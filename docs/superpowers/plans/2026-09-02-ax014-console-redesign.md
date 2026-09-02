# AX014 Internal Console Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Replace the public-facing UC study page with a minimal internal AWS-style operations console using only black, white, neutral gray, and green.

**Architecture:** Keep the existing local study reader and API contract. Replace only the presentation layer and its scoped styles: utility header, left navigation, compact record header, table-first study content, and plain bordered sections. Remove explicitly requested design artifacts while preserving research methodology/data documentation.

**Tech Stack:** Existing React/Vinext App Router, TypeScript, existing shadcn Button/Badge primitives, CSS, Vitest.

---

### Task 1: Remove obsolete design documentation

**Files:**
- Delete: `design.md`
- Delete: `plan_9_1.md`
- Delete: all files under `docs/superpowers/specs/`
- Delete: old UI/product plans under `docs/superpowers/plans/`, excluding the current UC control-panel plan and this plan

- [x] Remove only the explicit design artifacts listed above with `git rm`.
- [x] Confirm research files under `research/uc_failure_study/` and the current UC implementation plan remain present.

### Task 2: Replace the dashboard markup with an internal console shell

**Files:**
- Modify: `components/study/UCStudyControlPanel.tsx`

- [x] Replace the article-like intro with a compact utility row: `AX014`, `Studies`, `UC treatment failure`, local status, and `Run Study`.
- [x] Add a non-interactive left navigation listing `Studies`, `Datasets`, `Runs`, `Evidence`, and `Reports`.
- [x] Keep all existing real-data sections and exact values: study question as a record field, facts table, commands, output, metrics, history, limitations, and artifact links.
- [x] Remove marketing/editorial copy, hero treatment, dark callout panel, decorative labels, and any consumer/product framing.
- [x] Keep failure, missing-file, and six-patient warning behavior unchanged.

### Task 3: Replace decorative styling with black/white/green utility styling

**Files:**
- Modify: `app/globals.css`

- [x] Remove the old `.study-control-*` rules and add square-corner, 1px-border, table-first `.study-console-*` styles.
- [x] Use only `#000`, `#fff`, neutral grays, and green (`#16803c`) for active/success state.
- [x] Remove gradients, shadows, colored warning panels, oversized headings, rounded cards, and decorative accent rails from the control-panel styles.
- [x] Keep responsive behavior as a stacked utility layout on narrow screens.

### Task 4: Verify and commit

- [x] Run `npm test`, `npm run lint`, and `npm run build`.
- [x] Start the dev server and manually verify the console is table-first, has no public headline, uses the three-color palette, displays real metrics, and preserves the failed Run Study explanation.
- [x] Confirm no raw genome network call exists; the only client fetches remain local `/api/study` calls.
- [x] Commit the redesign and documentation cleanup.
