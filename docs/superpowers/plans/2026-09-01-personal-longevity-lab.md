# Personal Longevity Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make a local synthetic personal-health research lab the default product flow while preserving the existing Company mode.

**Architecture:** A typed `lib/lab` domain and deterministic fixture layer drive a single interactive client workspace. `app/page.tsx` owns only the research/company mode switch; no network or persistence is introduced.

**Tech Stack:** Next.js/Vinext, React, TypeScript, shadcn primitives, Tailwind v4, Vitest.

---

### Task 1: Add typed personal-lab domain and fixtures

**Files:**
- Create: `lib/lab/domain.ts`
- Create: `lib/lab/fixtures.ts`
- Create: `lib/lab/analysis.ts`
- Test: `lib/lab/analysis.test.ts`

- [ ] Define goal, metric, baseline, experiment, check-in, and report types.
- [ ] Add deterministic synthetic profile and caffeine-cutoff experiment fixtures.
- [ ] Add pure report/trend helpers and tests for stable averages and status copy.
- [ ] Run `npm test -- lib/lab/analysis.test.ts` and verify it passes.
- [ ] Commit with `feat: add personal lab domain fixtures`.

### Task 2: Build the default personal-lab workspace

**Files:**
- Create: `components/lab/PersonalLabWorkspace.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] Render safety copy, local-only data boundary, goal selection, baseline, experiment, check-in, trends, and report states.
- [ ] Use shadcn Button, Card, Badge, and Input primitives.
- [ ] Add local state transitions and no fetch/XHR calls.
- [ ] Link Company mode as a secondary mode.
- [ ] Run lint and build; fix only actual failures.
- [ ] Commit with `feat: make personal lab the default workspace`.

### Task 3: Verify the complete local flow

**Files:**
- Modify: `docs/product_reset.md` if needed to reflect the implemented boundary.

- [ ] Run the full test suite.
- [ ] Run lint and production build.
- [ ] Start the development server and manually walk every state in the browser.
- [ ] Confirm the source tree contains no network calls in `components/lab` or `lib/lab`.
- [ ] Commit documentation or verification-only changes.
