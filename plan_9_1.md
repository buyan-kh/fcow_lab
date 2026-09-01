# Personal Wellness Sleep Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Personal Lab demo with one complete, local-only sleep experiment proof loop while exposing Explore and Clinical Navigation as honest placeholders.

**Architecture:** Keep `app/page.tsx` as the Research/Company mode switch and make `PersonalLabWorkspace` the three-mode consumer shell. Move the functional Personal Wellness flow into a focused sleep-experiment component backed by typed, deterministic baseline/intervention fixtures and pure comparison/report helpers. Explore and Clinical Navigation render placeholder states only; no API, persistence, real medical upload, diagnosis, or drug recommendation is added.

**Tech Stack:** Next.js/Vinext, React 19, TypeScript, Vitest, Tailwind v4, existing shadcn Button/Card/Badge/Input primitives.

---

## Product contract

The only functional product mode in this plan is **Personal Wellness**. The complete flow is:

```text
Sleep goal
  → seven-day baseline
  → one bounded behavior intervention
  → measurable outcomes
  → daily intervention check-ins
  → baseline/intervention comparison
  → weekly learning report
  → keep, modify, or stop
```

The sleep record contains these fields for every day:

- Sleep duration
- Sleep timing (bedtime and wake time)
- Sleep latency
- Night awakenings
- Morning energy
- Daytime focus
- Caffeine timing
- Exercise timing
- Subjective sleep quality

The default deterministic intervention is **“Move caffeine earlier: no caffeine after 13:00 for 14 days.”** It is presented as a reversible behavior protocol, never as treatment or a prescription. The report must use the following contract:

```text
Here is the goal.
Here is the baseline.
Here is the intervention.
Here is why it may be relevant.
Here is what we measured.
Here is what changed.
Here are the limitations.
Here is what to discuss with a clinician if symptoms persist.
```

No screen may output a sleep-disorder diagnosis, personal medical risk claim, prescription drug recommendation, dosage, or claim that the intervention will treat the user.

## File map

- Modify: `lib/lab/domain.ts` — typed sleep records, experiment phases, evidence links, comparison, disposition, and report shapes.
- Modify: `lib/lab/fixtures.ts` — seven synthetic baseline days, fourteen synthetic intervention days, sleep goal options, and one bounded caffeine-timing protocol.
- Modify: `lib/lab/analysis.ts` — pure baseline/intervention comparison, metric summaries, uncertainty text, and keep/modify/stop recommendation.
- Modify: `lib/lab/analysis.test.ts` — test-first coverage for comparison math and non-diagnostic recommendation language.
- Create: `lib/lab/evidence.ts` — source-backed educational sleep links with explicit scope and fixture labeling.
- Create: `components/lab/SleepWellnessFlow.tsx` — the only functional product workflow, using shadcn primitives and local React state.
- Create: `components/lab/ModePlaceholder.tsx` — shared honest placeholder for Explore and Clinical Navigation.
- Modify: `components/lab/PersonalLabWorkspace.tsx` — add visible Personal Wellness / Explore / Clinical Navigation switch and delegate the active mode.
- Modify: `app/globals.css` — style the sleep flow using neutral borders, spacing, and typography; never add blue left rails, tinted callout cards, or decorative accent borders.
- Modify: `docs/superpowers/specs/2026-09-01-personal-longevity-lab-design.md` — record the sleep-first sequencing and three-mode contract if implementation reveals a wording gap.

---

### Task 1: Model the sleep experiment and write failing analysis tests

**Files:**
- Modify: `lib/lab/domain.ts`
- Modify: `lib/lab/fixtures.ts`
- Modify: `lib/lab/analysis.ts`
- Modify: `lib/lab/analysis.test.ts`
- Create: `lib/lab/evidence.ts`

- [ ] **Step 1: Write the failing tests first.** Add these behaviors to `lib/lab/analysis.test.ts`:

```ts
it('compares a seven-day baseline with the intervention period', () => {
  const result = compareSleepPeriods(demoBaseline, demoIntervention);
  expect(result.baseline.sleepDuration).toBe(6.9);
  expect(result.intervention.sleepDuration).toBe(7.5);
  expect(result.delta.sleepDuration).toBe(0.6);
  expect(result.daysLogged).toEqual({ baseline: 7, intervention: 14 });
});

it('recommends a bounded next step without making a medical claim', () => {
  const result = recommendDisposition(compareSleepPeriods(demoBaseline, demoIntervention));
  expect(['keep', 'modify', 'stop']).toContain(result.action);
  expect(result.explanation).toContain('observation');
  expect(result.explanation).not.toMatch(/disorder|diagnos|treat|prescription|dose/i);
});

it('builds a report that names limitations and clinician discussion guidance', () => {
  const report = buildSleepReport(demoSleepGoal, demoExperiment, demoBaseline, demoIntervention);
  expect(report.summary).toContain('synthetic');
  expect(report.limitations.length).toBeGreaterThan(0);
  expect(report.clinicianPrompt).toContain('clinician');
});
```

- [ ] **Step 2: Run the focused test to prove it fails for the missing API.**

Run: `npm test -- lib/lab/analysis.test.ts`

Expected: FAIL because `compareSleepPeriods`, `recommendDisposition`, and `buildSleepReport` do not yet exist and the fixtures do not yet expose seven-day periods.

- [ ] **Step 3: Add the minimal typed domain.** Extend `lib/lab/domain.ts` with:

```ts
export type SleepGoalId = 'duration' | 'timing' | 'quality';
export type SleepGoal = { id: SleepGoalId; label: string; question: string };
export type SleepRecord = {
  day: number;
  bedtime: string;
  wakeTime: string;
  sleepDuration: number;
  sleepLatency: number;
  nightAwakenings: number;
  morningEnergy: number;
  daytimeFocus: number;
  caffeineTime: string;
  exerciseTime: string;
  sleepQuality: number;
  note?: string;
};
export type SleepPhase = 'baseline' | 'intervention';
export type SleepExperiment = {
  id: string;
  title: string;
  intervention: string;
  rationale: string;
  durationDays: number;
  outcomes: string[];
  guardrails: string[];
  phase: SleepPhase;
};
export type SleepComparison = {
  baseline: { sleepDuration: number; sleepLatency: number; nightAwakenings: number; morningEnergy: number; daytimeFocus: number; sleepQuality: number };
  intervention: { sleepDuration: number; sleepLatency: number; nightAwakenings: number; morningEnergy: number; daytimeFocus: number; sleepQuality: number };
  delta: { sleepDuration: number; sleepLatency: number; nightAwakenings: number; morningEnergy: number; daytimeFocus: number; sleepQuality: number };
  daysLogged: { baseline: number; intervention: number };
};
export type Disposition = { action: 'keep' | 'modify' | 'stop'; label: string; explanation: string };
export type SleepReport = { summary: string; goal: string; baseline: SleepComparison['baseline']; intervention: SleepComparison['intervention']; delta: SleepComparison['delta']; limitations: string[]; clinicianPrompt: string; disposition: Disposition };
export type EvidenceLink = { title: string; source: string; url: string; scope: string; fixture: true };
```

- [ ] **Step 4: Add deterministic synthetic fixtures.** In `lib/lab/fixtures.ts`, export `sleepGoals`, `demoSleepGoal`, `demoBaseline` with exactly seven records, `demoIntervention` with exactly fourteen records, and `demoSleepExperiment`. Keep the existing general `DailyMetrics` fixtures only if other tests still use them. Every fixture export must be named synthetic/demo and contain no real person data.

- [ ] **Step 5: Implement pure comparison/report helpers.** In `lib/lab/analysis.ts`, add `averageSleepMetric`, `compareSleepPeriods`, `recommendDisposition`, and `buildSleepReport`. Round numeric deltas to one decimal. Use deterministic thresholds only for product behavior: choose `keep` when sleep duration increases by at least 0.3 hours and sleep quality does not fall; choose `modify` when the result is mixed or fewer than seven intervention days are logged; choose `stop` only when sleep quality and morning energy both decline. The explanation must say “synthetic observation” or “personal observation,” include uncertainty, and never use diagnosis/treatment language.

- [ ] **Step 6: Add source-backed educational links.** Create `lib/lab/evidence.ts` with links for general sleep education (for example, an official public-health sleep-duration page and an official sleep-hygiene page). Store each URL, source title, scope, and `fixture: true`; do not fetch these sources at runtime. The UI may link out when the user chooses, but the local app must not transmit personal data.

- [ ] **Step 7: Run the focused test to prove it passes.**

Run: `npm test -- lib/lab/analysis.test.ts`

Expected: PASS with the new comparison, disposition, and report assertions.

- [ ] **Step 8: Commit the domain slice.**

```bash
git add lib/lab/domain.ts lib/lab/fixtures.ts lib/lab/analysis.ts lib/lab/analysis.test.ts lib/lab/evidence.ts
git commit -m "feat: model sleep experiment proof loop"
```

### Task 2: Build the Personal Wellness sleep flow

**Files:**
- Create: `components/lab/SleepWellnessFlow.tsx`
- Modify: `components/lab/PersonalLabWorkspace.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Define flow state and navigation tests before UI implementation.** Add a focused component test if the project test setup supports DOM rendering; otherwise document the browser assertions in Task 5. The required states are `goal`, `baseline`, `intervention`, `checkin`, `report`. The state must retain records in React memory only and must not call `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `localStorage`, or `sessionStorage`.

- [ ] **Step 2: Render the goal state.** In `SleepWellnessFlow.tsx`, show three sleep-specific goal choices—duration, timing, and quality—using shadcn `Card` or plain buttons with neutral selected styling. Continue only after a goal is selected. Copy must say that the goal is a tracking question, not a diagnosis or outcome promise.

- [ ] **Step 3: Render seven-day baseline entry.** Use a compact responsive table/grid of seven synthetic rows. Each row exposes the nine required sleep fields: bedtime, wake time, duration, latency, awakenings, morning energy, daytime focus, caffeine time, exercise time, and sleep quality. Provide `Use synthetic seven-day baseline` to fill the fixture and a local-only manual edit path. Do not render a file upload control or device connector.

- [ ] **Step 4: Render the bounded intervention.** Present only the caffeine-timing protocol from `demoSleepExperiment`. Show its rationale as educational context, its measurable outcomes, its duration, and guardrails. The primary action should be `Start daily check-ins`, not `Take`, `Use`, or `Treat`.

- [ ] **Step 5: Render daily intervention check-ins.** Show one day at a time with all required fields and a visible `Day N of 14` counter. `Save check-in` appends a record to local React state. Include a fixture shortcut that fills the next deterministic day, but keep the manual inputs editable. Allow `Review current trend` after at least one intervention day and clearly show when fewer than seven days are logged.

- [ ] **Step 6: Render the report.** Call `compareSleepPeriods`, `recommendDisposition`, and `buildSleepReport` and display the contract sections in order: goal, baseline, intervention, relevance, measured outcomes, change, limitations, clinician prompt, and keep/modify/stop. Use plain neutral rules and typography for hierarchy. Never display a disease name, prescription, dose, or treatment claim.

- [ ] **Step 7: Add local JSON download only after the report is visible.** Generate a Blob from the typed report object, download `frontier-bio-sleep-learning-report.json`, and revoke the object URL. The download must contain normalized synthetic records/report fields only and must not contain raw file bytes or identifiers.

- [ ] **Step 8: Add restrained styling.** Extend `app/globals.css` with `sleep-*` classes. Reuse existing shadcn primitives and the current light shell. Do not add colored left rails, tinted callout cards, decorative accent borders, gradients, or new icon dependencies. Use neutral borders, spacing, and a single action color only for primary buttons and data bars.

- [ ] **Step 9: Run lint and the full test suite.**

Run: `npm run lint && npm test`

Expected: ESLint passes and all existing plus new tests pass.

- [ ] **Step 10: Commit the functional Personal Wellness slice.**

```bash
git add components/lab/SleepWellnessFlow.tsx components/lab/PersonalLabWorkspace.tsx app/globals.css
git commit -m "feat: build personal wellness sleep flow"
```

### Task 3: Add honest Explore and Clinical Navigation placeholders

**Files:**
- Create: `components/lab/ModePlaceholder.tsx`
- Modify: `components/lab/PersonalLabWorkspace.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Implement the shared placeholder component.** Accept `title` and `description` props and render exactly these boundary statements: `Coming next.`, `Synthetic demonstration only.`, and `No real medical records are processed.` Add a short sentence explaining that Explore will later host evidence retrieval and Clinical Navigation will later organize synthetic cases for clinician discussion.

- [ ] **Step 2: Add the visible mode switch.** Add `Personal Wellness`, `Explore`, and `Clinical Navigation` controls to the Personal Lab header. Personal Wellness is selected by default and renders `SleepWellnessFlow`. Explore and Clinical Navigation render `ModePlaceholder` only. Keep the existing `Company mode` button as a separate secondary control.

- [ ] **Step 3: Verify the main product has no fictional therapeutic data.** Do not import `data.ts`, `ResearchWorkspace`, `demoDiseases`, `demoEvidence`, `demoGenes`, or AX-014 data into the Personal Wellness tree. The legacy Company mode remains reachable only through its existing button.

- [ ] **Step 4: Run focused source checks.**

Run: `rg -n "AX-014|demoDiseases|demoEvidence|ResearchWorkspace|fetch\\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage" components/lab lib/lab`

Expected: no matches in the new Personal Wellness/placeholder files. Existing legacy genome files may still contain their own fixtures and must not be imported by the new product path.

- [ ] **Step 5: Commit the mode switch.**

```bash
git add components/lab/ModePlaceholder.tsx components/lab/PersonalLabWorkspace.tsx app/globals.css
git commit -m "feat: add honest product mode placeholders"
```

### Task 4: Add privacy and product-boundary documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-09-01-personal-longevity-lab-design.md`
- Create: `docs/personal_wellness_sleep_boundary.md`

- [ ] **Step 1: Document the sleep-specific boundary.** State that this phase accepts synthetic fixtures and local manual values only; does not process real medical records, pathology, molecular reports, DNA, prescriptions, or device credentials; and does not diagnose, prescribe, recommend dosage, or make personal drug recommendations.

- [ ] **Step 2: Document the recommendation contract.** Include the exact eight-part report order and the allowed disposition language: keep, modify, or stop the behavior experiment. Require a clinician discussion prompt when symptoms persist or the user is concerned.

- [ ] **Step 3: Document the sequencing.** Record that Personal Wellness is the only functional mode in this phase, Explore is next, Clinical Navigation follows with synthetic cases, and population-level therapeutic discovery is a later governed layer.

- [ ] **Step 4: Commit the boundary docs.**

```bash
git add docs/superpowers/specs/2026-09-01-personal-longevity-lab-design.md docs/personal_wellness_sleep_boundary.md
git commit -m "docs: define sleep proof loop safety boundary"
```

### Task 5: Verify the complete slice in browser and production checks

**Files:**
- No new source files; verification only unless an actual failure requires a targeted fix.

- [ ] **Step 1: Run the full automated checks.**

Run: `npm test`

Expected: all test files pass, including comparison math, disposition language, and report boundaries.

- [ ] **Step 2: Run lint and production build.**

Run: `npm run lint && npm run build`

Expected: both exit successfully. Record the existing Vinext punycode deprecation/classification warnings separately from failures.

- [ ] **Step 3: Start the development server.**

Run: `npm run dev -- --host 0.0.0.0`

Expected: the app is available at `http://localhost:3000/`. Reuse an existing healthy server if one is already running for this repository.

- [ ] **Step 4: Manually verify Personal Wellness.** In the browser:

1. Confirm the first screen shows `Personal Wellness` selected and the research-only/non-diagnostic boundary.
2. Select `Sleep quality` (or another sleep goal) and continue.
3. Load the synthetic seven-day baseline and edit at least one field locally.
4. Confirm the intervention is exactly one bounded caffeine-timing behavior protocol with outcomes and guardrails.
5. Save at least one manual intervention check-in and confirm the day counter/averages update.
6. Complete or load enough synthetic days to compare baseline and intervention periods.
7. Confirm the report contains goal, baseline, intervention, rationale, measured outcomes, change, limitations, clinician prompt, and keep/modify/stop disposition.
8. Download the JSON report and confirm it contains synthetic normalized records only.
9. Switch to Explore and Clinical Navigation and confirm each shows `Coming next.`, `Synthetic demonstration only.`, and `No real medical records are processed.`
10. Switch to Company mode and confirm AX-014 is available only there, not in Personal Wellness.

- [ ] **Step 5: Verify the network/privacy boundary.** Inspect the new source path and browser diagnostics. Confirm there are no network primitives in `components/lab` or `lib/lab`, no console errors/warnings, and no upload control. Confirm the report download is a local Blob operation.

- [ ] **Step 6: Commit only targeted verification fixes.** If a real failure is found, add a focused regression test before changing code, rerun the affected check, then commit with a message naming the failure. Otherwise leave the working tree clean after the task commits.

## Plan self-review

- Scope is one independently testable subsystem: Personal Wellness sleep proof loop. Explore and Clinical Navigation are placeholders, not second implementations.
- Every required metric is represented in `SleepRecord` and the baseline/check-in UI.
- The report contract, non-diagnostic language, synthetic-only boundary, and clinician prompt are covered by plan tasks and tests.
- Existing Company mode is preserved but not imported into the Personal Wellness path.
- The visual constraint is explicit: neutral hierarchy only; no blue rails or tinted cards.
- No persistence, auth, subscriptions, real uploads, external APIs, or therapeutic discovery are included.
