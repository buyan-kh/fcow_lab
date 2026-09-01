# AX014 Therapeutic Discovery Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-center the product on AX014’s internal AI-native pharmaceutical discovery engine and ship one deterministic, reviewable research-program loop from disease mechanism to experiment decision.

**Architecture:** The primary workspace is a research command center, not a consumer wellness app. A typed local domain models a research program, evidence claims, hypotheses, proposed experiment, synthetic result ingestion, belief update, and human review decision. The physical lab boundary is explicit: AX014 can propose and ingest an experiment result, but the prototype never claims that a lab, CRO, patient, molecule, or clinical program actually exists or ran. Existing wellness and legacy cockpit surfaces remain reachable only as secondary prototypes until the discovery loop is validated.

**Tech Stack:** Next.js/Vinext, React 19, TypeScript, Vitest, Tailwind v4, existing shadcn Button/Card/Badge/Input/Separator primitives.

---

## Product contract

AX014 is an AI-native pharmaceutical company and research lab. Its long-term loop is:

```text
human biology
  → disease mechanism
  → target hypothesis
  → therapeutic research hypothesis
  → experiment plan
  → lab or CRO execution
  → measured result
  → belief update
  → candidate advance or kill decision
  → proprietary biological evidence
```

The first functional proof must make one serious research decision legible:

```text
Research question
  → disease and target map
  → source-backed evidence
  → mechanism hypothesis
  → therapeutic research hypothesis
  → falsifiable experiment plan
  → synthetic result ingestion
  → updated confidence and uncertainty
  → advance / revise / kill recommendation
  → Markdown and JSON research report
```

This is a research workflow for AX014 scientists and decision-makers. It must not present a medicine to an individual, diagnose a patient, prescribe a treatment, recommend dosage, or imply that an experiment was physically executed. Every synthetic claim, result, and hypothesis is visibly labeled as fixture data or inference.

The first program fixture is `AX014-IL6R-001`, an illustrative inflammatory-disease target program retained only as a deterministic synthetic demonstration. It is not a real AX014 asset, clinical program, molecule, patient cohort, or therapeutic claim.

The sleep experiment implementation is demoted to a later consumer access surface. It is not the default product experience and must not appear in the primary research workspace.

## Domain behavior and labels

Every visible evidence item uses one of these labels:

- `Verified source` — a real public URL supplied in the fixture contract.
- `Synthetic fixture` — deterministic local demonstration data, not a real study or result.
- `Inference` — a reasoning step derived from displayed evidence; requires human review.
- `Requires experiment` — a proposed test that has not been run.
- `Unknown` — missing information that blocks a confident conclusion.

Allowed decision language is `Advance to review`, `Revise hypothesis`, or `Kill program`. These are research workflow dispositions, not clinical recommendations. Every disposition includes the evidence used, uncertainty, falsifier, and named human owner for the next review.

## File map

- Create: `lib/ax014/domain.ts` — typed research-program, evidence, hypothesis, experiment, result, update, and report contracts.
- Create: `lib/ax014/fixtures.ts` — deterministic synthetic AX014 program, claims, hypotheses, experiment, and result; no real patient or molecule data.
- Create: `lib/ax014/analysis.ts` — pure confidence update, evidence coverage, disposition, and report builders.
- Create: `lib/ax014/analysis.test.ts` — test-first coverage for deterministic math, uncertainty, labels, and forbidden medical/personal language.
- Create: `lib/ax014/evidence.ts` — source-backed public links and fixture metadata; no runtime fetching.
- Create: `components/ax014/Ax014ResearchWorkspace.tsx` — primary AX014 command-center shell and visible research-only boundary.
- Create: `components/ax014/DiscoveryProgramFlow.tsx` — the complete program flow: question, map, evidence, hypotheses, experiment, result, update, report.
- Modify: `app/page.tsx` — make `Ax014ResearchWorkspace` the default route and keep the existing cockpit as a secondary legacy surface.
- Modify: `components/genome/CompanyMode.tsx` — relabel the preserved cockpit as secondary illustrative legacy mode without importing it into the new path.
- Modify: `app/globals.css` — style the command center with neutral shadcn-based hierarchy; do not add blue left rails, tinted callout cards, decorative accent borders, gradients, or AI-slop section bars.
- Create: `docs/ax014_discovery_engine_boundary.md` — document the pharma-company thesis, physical-loop boundary, synthetic fixture policy, and prohibited outputs.
- Modify: `docs/product_reset.md` — replace the wellness-first product definition with the AX014 discovery-engine definition and stage sequencing.

### Task 1: Define the AX014 research domain and failing analysis tests

**Files:**
- Create: `lib/ax014/domain.ts`
- Create: `lib/ax014/fixtures.ts`
- Create: `lib/ax014/analysis.ts`
- Create: `lib/ax014/analysis.test.ts`
- Create: `lib/ax014/evidence.ts`

- [ ] **Step 1: Write failing tests for the decision loop.** Add these tests to `lib/ax014/analysis.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildResearchReport, computeBeliefUpdate, decideDisposition } from './analysis';
import { demoAx014Program, demoEvidence, demoExperiment, demoResult } from './fixtures';

describe('AX014 discovery analysis', () => {
  it('updates confidence deterministically from a synthetic result', () => {
    const update = computeBeliefUpdate(demoAx014Program.mechanismHypothesis, demoResult);
    expect(update.priorConfidence).toBe(0.54);
    expect(update.posteriorConfidence).toBe(0.67);
    expect(update.status).toBe('mixed evidence');
    expect(update.sourceLabel).toBe('Synthetic fixture');
  });

  it('selects a research disposition without clinical or personal claims', () => {
    const update = computeBeliefUpdate(demoAx014Program.mechanismHypothesis, demoResult);
    const disposition = decideDisposition(update, demoExperiment);
    expect(['Advance to review', 'Revise hypothesis', 'Kill program']).toContain(disposition.action);
    expect(disposition.explanation).toMatch(/research|experiment|uncertainty/i);
    expect(disposition.explanation).not.toMatch(/patient|diagnos|prescription|dosage|treat you|take /i);
  });

  it('builds a report with provenance, falsifier, and physical-lab boundary', () => {
    const report = buildResearchReport(demoAx014Program, demoEvidence, demoExperiment, demoResult);
    expect(report.sections.map((section) => section.title)).toEqual([
      'Research question', 'Disease and target map', 'Evidence', 'Mechanism hypothesis',
      'Therapeutic research hypothesis', 'Experiment plan', 'Result ingestion',
      'Belief update', 'Decision', 'Limitations',
    ]);
    expect(report.boundary).toContain('physical experiment');
    expect(report.claims.every((claim) => claim.sourceLabel)).toBe(true);
    expect(JSON.stringify(report)).not.toMatch(/prescription|dosage|diagnose|personal risk/i);
  });
});
```

- [ ] **Step 2: Run the focused test and verify the missing API failure.**

Run: `npm test -- lib/ax014/analysis.test.ts`

Expected: FAIL because the AX014 domain, fixtures, and pure analysis functions do not exist yet.

- [ ] **Step 3: Add the typed domain contracts.** Implement `lib/ax014/domain.ts` with these exported shapes:

```ts
export type EvidenceLabel = 'Verified source' | 'Synthetic fixture' | 'Inference' | 'Requires experiment' | 'Unknown';
export type DispositionAction = 'Advance to review' | 'Revise hypothesis' | 'Kill program';
export type ProgramStage = 'mechanism' | 'target' | 'therapeutic hypothesis' | 'experiment';

export type EvidenceClaim = {
  id: string;
  statement: string;
  label: EvidenceLabel;
  sourceTitle: string;
  sourceUrl: string;
  excerpt: string;
  limitation: string;
};

export type MechanismHypothesis = {
  id: string;
  statement: string;
  priorConfidence: number;
  predictedReadout: string;
  falsifier: string;
  owner: string;
};

export type TherapeuticResearchHypothesis = {
  id: string;
  statement: string;
  modalityClass: 'small molecule' | 'antibody' | 'protein' | 'cell therapy' | 'unknown';
  intendedBiology: string;
  constraints: string[];
  label: 'Inference';
};

export type ResearchProgram = {
  id: string;
  code: string;
  diseaseArea: string;
  researchQuestion: string;
  stage: ProgramStage;
  target: string;
  targetRationale: string;
  mechanismHypothesis: MechanismHypothesis;
  therapeuticHypothesis: TherapeuticResearchHypothesis;
  uncertainties: string[];
};

export type ExperimentPlan = {
  id: string;
  title: string;
  objective: string;
  model: 'cell assay' | 'human tissue model' | 'animal model' | 'clinical cohort' | 'unknown';
  inputs: string[];
  readouts: string[];
  controls: string[];
  successCriteria: string[];
  falsifier: string;
  executionStatus: 'proposed' | 'sent to lab' | 'result received';
  label: 'Requires experiment';
};

export type ExperimentResult = {
  experimentId: string;
  receivedAt: string;
  label: 'Synthetic fixture';
  readouts: Array<{ name: string; observed: string; direction: 'supports' | 'mixed' | 'weakens' | 'unknown' }>;
  controlCheck: string;
  rawDataStored: false;
  executionNote: string;
};

export type BeliefUpdate = {
  priorConfidence: number;
  posteriorConfidence: number;
  status: 'supports' | 'mixed evidence' | 'weakens' | 'inconclusive';
  rationale: string;
  remainingUncertainty: string[];
  sourceLabel: 'Synthetic fixture';
};

export type ResearchDisposition = {
  action: DispositionAction;
  explanation: string;
  nextHumanReview: string;
  evidenceUsed: string[];
};

export type ResearchReportSection = { title: string; body: string; label: EvidenceLabel };
export type ResearchReport = {
  programId: string;
  generatedAt: string;
  sections: ResearchReportSection[];
  claims: EvidenceClaim[];
  beliefUpdate: BeliefUpdate;
  disposition: ResearchDisposition;
  boundary: string;
};
```

- [ ] **Step 4: Add deterministic synthetic program fixtures.** Export `demoAx014Program`, `demoEvidence`, `demoExperiment`, and `demoResult` from `lib/ax014/fixtures.ts`. Use stable IDs, fixed strings, and a fixed timestamp. Every non-source claim must carry `Synthetic fixture`, `Inference`, or `Requires experiment`; do not include real patient records, DNA, clinical outcomes, compound names, dosages, or raw assay files.

- [ ] **Step 5: Implement pure analysis functions.** In `lib/ax014/analysis.ts`, add `computeBeliefUpdate`, `decideDisposition`, and `buildResearchReport`. Use explicit deterministic rules: confidence is clamped to `[0, 1]`, rounded to two decimals, and increased by `0.13` for a supporting readout, unchanged for mixed readouts, and decreased by `0.16` for a weakening readout. `Advance to review` requires posterior confidence `>= 0.65` and a passing control; `Kill program` requires posterior confidence `< 0.35` and a failed control; all other states are `Revise hypothesis`. The report must preserve provenance and include the physical-experiment boundary.

- [ ] **Step 6: Add source-backed educational links without runtime requests.** Create `lib/ax014/evidence.ts` with official public source metadata only. The fixture can reference stable source pages such as Open Targets, PubMed, and ClinicalTrials.gov, but each displayed source must be labeled `Verified source` and include its URL. Do not fetch sources from the browser, send research inputs to an endpoint, or claim that a fixture is current evidence.

- [ ] **Step 7: Run the focused test to verify the implementation.**

Run: `npm test -- lib/ax014/analysis.test.ts`

Expected: PASS with the deterministic confidence, disposition, report-section, and forbidden-language assertions.

- [ ] **Step 8: Commit the domain slice.**

```bash
git add lib/ax014
git commit -m "feat: model AX014 discovery decision loop"
```

### Task 2: Build the AX014 research command center

**Files:**
- Create: `components/ax014/Ax014ResearchWorkspace.tsx`
- Create: `components/ax014/DiscoveryProgramFlow.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Define the local flow state.** `DiscoveryProgramFlow` must use only React memory with stages `question`, `map`, `evidence`, `mechanism`, `therapeutic`, `experiment`, `result`, `update`, and `report`. It must not call `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `localStorage`, `sessionStorage`, or any upload/file-picker API.

- [ ] **Step 2: Render the AX014 header and boundary.** Show `AX014` as the company/lab name, `AI-native therapeutic discovery engine` as the descriptor, and a first-screen boundary stating: `Research workflow only. Synthetic demonstration data. No patient care, prescriptions, or claims that a physical experiment has run.` Use neutral borders and typography instead of colored rails or tinted cards.

- [ ] **Step 3: Render the research-question stage.** Show the synthetic program code, disease area, target, and question: `Does this target deserve a falsifiable mechanism experiment?` Require the user to press `Open program` before advancing. Display `Synthetic fixture` beside the program identity.

- [ ] **Step 4: Render the disease/target map and evidence stages.** Show disease biology, target rationale, uncertainty list, and evidence claims with their source label, source title, URL, excerpt, and limitation. Keep `Verified source`, `Synthetic fixture`, and `Inference` visually distinct using badges and text—not decorative color panels.

- [ ] **Step 5: Render mechanism and therapeutic research hypotheses.** Display the mechanism statement, prior confidence, predicted readout, falsifier, modality class, intended biology, and constraints. Use the exact label `Therapeutic research hypothesis`; do not phrase it as a drug recommendation or clinical treatment.

- [ ] **Step 6: Render the experiment plan.** Show objective, model, inputs, readouts, controls, success criteria, falsifier, and `Requires experiment`. The primary action is `Mark plan ready for lab review`; it must set a local status only and never imply that a lab or CRO was contacted.

- [ ] **Step 7: Render synthetic result ingestion.** Show a readout table with the deterministic fixture result and a button labeled `Load synthetic result`. Once loaded, show `Synthetic fixture · result received` and an explicit note: `This result was not generated by a physical lab and must not be used as evidence of efficacy.` Provide `Review result` as the only next action.

- [ ] **Step 8: Render belief update and decision.** Call the pure analysis functions and show prior/posterior confidence, supporting/mixed/weakening readouts, remaining uncertainty, falsifier status, and one disposition: `Advance to review`, `Revise hypothesis`, or `Kill program`. Include a human-review owner and next decision. Do not display a candidate drug, dose, patient outcome, diagnosis, or treatment recommendation.

- [ ] **Step 9: Render Markdown and JSON reports.** Once the report stage is visible, provide `Download Markdown report` and `Download JSON report`. Both downloads must contain typed synthetic program data, labels, provenance, uncertainty, and the physical-lab boundary. Use `Blob` and `URL.createObjectURL` locally; revoke the URL after download. Do not include raw personal data or raw uploaded bytes.

- [ ] **Step 10: Replace the default route.** Modify `app/page.tsx` so `Ax014ResearchWorkspace` renders by default. Keep the current legacy `CompanyMode` reachable through a secondary `Legacy cockpit` action. The sleep wellness workspace may remain in source for later consumer work but must not be imported into the default route.

- [ ] **Step 11: Add restrained command-center styling.** Add `ax014-*` classes in `app/globals.css` with light background, readable type, 1px neutral rules, compact data tables, and one action color for primary buttons. Explicitly avoid blue vertical rails, tinted information cards, gradient backgrounds, oversized marketing copy, decorative AI badges, and new icon dependencies.

- [ ] **Step 12: Run lint and tests.**

Run: `npm run lint && npm test`

Expected: ESLint passes and all existing plus AX014 tests pass.

- [ ] **Step 13: Commit the command center.**

```bash
git add app/page.tsx app/globals.css components/ax014
git commit -m "feat: build AX014 research command center"
```

### Task 3: Preserve secondary modes without diluting AX014

**Files:**
- Modify: `components/genome/CompanyMode.tsx`
- Modify: `components/lab/PersonalLabWorkspace.tsx`
- Modify: `components/lab/ModePlaceholder.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Relabel the legacy cockpit honestly.** Change the preserved cockpit eyebrow and copy to `Legacy illustrative cockpit` and `Synthetic fixture data`. Keep its existing route and data isolated from `components/ax014`.

- [ ] **Step 2: Demote the wellness surface.** Keep `PersonalLabWorkspace` available as a secondary `Consumer access prototype` route, but remove it from the AX014 primary navigation. Its safety boundary must continue to state that it is not medical advice and uses synthetic/local demo values only.

- [ ] **Step 3: Keep future surfaces explicit.** If Explore or Clinical Navigation remains visible, use the exact placeholder statements `Coming next.`, `Synthetic demonstration only.`, and `No real medical records are processed.` Do not render fictional therapeutic programs in those placeholders.

- [ ] **Step 4: Run an import and network guard check.**

Run: `rg -n "SleepWellnessFlow|demoDiseases|demoEvidence|fetch\\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|input[^>]+type=\\\"file\\\"" components/ax014 app/page.tsx`

Expected: no matches in the AX014 primary path.

- [ ] **Step 5: Commit the secondary-mode cleanup.**

```bash
git add components/genome/CompanyMode.tsx components/lab/PersonalLabWorkspace.tsx components/lab/ModePlaceholder.tsx app/globals.css
git commit -m "refactor: isolate secondary prototype surfaces"
```

### Task 4: Document the AX014 company boundary and staged business path

**Files:**
- Create: `docs/ax014_discovery_engine_boundary.md`
- Modify: `docs/product_reset.md`

- [ ] **Step 1: Document the company thesis.** State that AX014 builds AI systems that discover disease mechanisms, design therapeutic research hypotheses, select experiments, and learn from biological results until a validated medicine emerges. The platform is infrastructure for research programs; it is not primarily a wellness dashboard.

- [ ] **Step 2: Document the physical-loop requirement.** Include the sequence `AI hypothesis → experiment choice → lab/CRO execution → measurement → belief update → advance or kill`. State that the prototype can propose and ingest synthetic results but cannot claim physical execution, efficacy, safety, or clinical success.

- [ ] **Step 3: Document the staged business path.** Record: build the engine; create differentiated biological evidence; create or license a therapeutic program; partner for capital and development; retain ownership, milestones, royalties, or internal development; repeat across diseases and modalities. Consumer access is a later surface, not the company definition.

- [ ] **Step 4: Document prohibited outputs and fixture policy.** Prohibit diagnoses, personal risk claims, prescriptions, dosage, individual drug recommendations, invented patients, invented clinical outcomes, and fabricated lab execution. Require visible labels for all synthetic data and inferences.

- [ ] **Step 5: Commit the documentation.**

```bash
git add docs/ax014_discovery_engine_boundary.md docs/product_reset.md
git commit -m "docs: define AX014 discovery engine boundary"
```

### Task 5: Verify the complete AX014 discovery loop

**Files:**
- No new source files unless a verification failure requires a targeted fix.

- [ ] **Step 1: Run automated checks.**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, lint is clean, and the production build completes. Known Vinext Node deprecation or route-classification warnings may be reported separately if they do not fail the build.

- [ ] **Step 2: Start the development server.**

Run: `npm run dev -- --host 0.0.0.0`

Expected: the app is available at `http://localhost:3000`.

- [ ] **Step 3: Manually verify the browser flow.** Confirm, in order:

1. AX014 header and research-only boundary are visible on first load.
2. Synthetic program opens with disease area, target, and research question.
3. Disease/target map shows evidence labels, source links, limitations, and uncertainties.
4. Mechanism and therapeutic research hypotheses are clearly marked as inference.
5. Experiment plan shows controls, readouts, success criteria, falsifier, and `Requires experiment`.
6. Synthetic result ingestion shows the non-physical-execution warning.
7. Belief update changes confidence deterministically and exposes remaining uncertainty.
8. Disposition is exactly one of `Advance to review`, `Revise hypothesis`, or `Kill program`.
9. Markdown and JSON downloads contain labels, provenance, uncertainty, and boundary text.
10. Legacy cockpit remains reachable as a secondary illustrative surface; no wellness UI appears in the AX014 primary flow.

- [ ] **Step 4: Verify privacy and network behavior.** Use browser developer logs/network inspection and source search to confirm no request is made when advancing stages, loading the synthetic result, or downloading reports. Confirm there is no file input and no raw genome, patient, or clinical record data in the report payload.

- [ ] **Step 5: Check the final diff and commit.**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and a clean worktree after the final commit.

```bash
git log --oneline -6
git push fcow_lab main
```

Expected: the AX014 discovery-engine commits are present on `fcow_lab/main`.

## Self-review checklist

- The default product is an AX014 research command center, not a wellness app.
- The first proof is a falsifiable therapeutic research decision, not a consumer recommendation.
- The physical lab/CRO loop is visible and never simulated as completed.
- Synthetic fixtures are deterministic and visibly labeled.
- Evidence claims retain source URLs, excerpts, and limitations.
- Research hypotheses are disease/program level and never personalized to an individual.
- The legacy cockpit and wellness prototype are secondary and isolated from the AX014 path.
- Tests, lint, build, browser verification, privacy checks, and push are explicit deliverables.
