# UC Study Control Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only React control panel backed by the checked-in UC study files and exact documented analysis command.

**Architecture:** Pure TypeScript helpers read and normalize `research/uc_failure_study` artifacts, exposing honest `not-run` and `failed` states. A minimal App Router route serves the snapshot and executes the existing Python command locally with `spawn`, while the client dashboard renders facts, metrics, history, limitations, and command output without inventing values.

**Tech Stack:** React 19, Next/Vinext App Router, TypeScript, Vitest, existing shadcn primitives, Node `fs` and `child_process`.

---

### Task 1: File-backed study reader and command contract

**Files:**
- Create: `lib/study-control.ts`
- Test: `lib/study-control.test.ts`

- [x] Write failing tests for parsing saved summary/metrics, missing files returning `not-run`, six-patient warning, and nonzero command results becoming `failed`.
- [x] Run `npm test lib/study-control.test.ts` and observe the expected missing-module failure.
- [x] Implement typed readers for `question.md`, `descriptive_summary.json`, `model_metrics.json`, the saved replication summary/metrics, `report.md`, and `sources.csv`; use `Not run.` when required files are absent.
- [x] Implement an injected command-result normalizer so command failure is deterministic and testable.
- [x] Rerun the focused tests and the complete Vitest suite.

### Task 2: Minimal local API

**Files:**
- Create: `app/api/study/route.ts`
- Test: `lib/study-control.test.ts`

- [x] Add `GET` to return only the parsed study snapshot and links to local report/source files.
- [x] Add `POST` to spawn the documented `uv run ... run_analysis.py` command with fixed arguments and return stdout/stderr, exit code, and generated-file links.
- [x] Keep the route local-only: no fetch, upload, external URL, or database code.
- [x] Add route-level behavior tests through the pure command contract, then run tests.

### Task 3: Dashboard UI

**Files:**
- Create: `components/study/UCStudyControlPanel.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [x] Render question, dataset facts, status, exact metrics comparison, command block, history, limitations, and next action from the snapshot.
- [x] Add Run Study interaction with running/completed/failed states and exact output.
- [x] Show a prominent six-patient holdout warning when the saved test count is six or fewer.
- [x] Use restrained shadcn-based layout and remove the consumer wellness/company modes from the primary experience.
- [x] Run lint, build, and browser verification against the local dev server.

### Task 4: Verification and commit

- [x] Run `npm test`, `npm run lint`, and `npm run build`.
- [x] Manually verify loaded values, missing-file states, Run Study behavior, and absence of fictional scientific content.
- [x] Commit all meaningful changes and report exact files and results.
