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

- [x] Define goal, metric, baseline, experiment, check-in, and report types.
- [x] Add deterministic synthetic profile and caffeine-cutoff experiment fixtures.
- [x] Add pure report/trend helpers and tests for stable averages and status copy.
- [x] Run `npm test -- lib/lab/analysis.test.ts` and verify it passes.
- [x] Commit with `feat: add personal lab domain fixtures`.

### Task 2: Build the default personal-lab workspace

**Files:**
- Create: `components/lab/PersonalLabWorkspace.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [x] Render safety copy, local-only data boundary, goal selection, baseline, experiment, check-in, trends, and report states.
- [x] Use shadcn Button, Card, Badge, and Input primitives.
- [x] Add local state transitions and no fetch/XHR calls.
- [x] Link Company mode as a secondary mode.
- [x] Run lint and build; fix only actual failures.
- [x] Commit with `feat: make personal lab the default workspace`.

### Task 3: Verify the complete local flow

**Files:**
- Modify: `docs/product_reset.md` if needed to reflect the implemented boundary.

- [x] Run the full test suite.
- [x] Run lint and production build.
- [x] Start the development server and manually walk every state in the browser.
- [x] Confirm the source tree contains no network calls in `components/lab` or `lib/lab`.
- [x] Commit documentation or verification-only changes.
