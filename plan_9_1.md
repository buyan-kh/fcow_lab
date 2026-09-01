# AX014 Drug Discovery Engine v0.1 Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use executing-plans or subagent-driven-development. Steps use checkbox syntax for tracking.

**Goal:** Repurpose the app into AX014’s internal research control room and prove one decision-critical capability: identifying which disease mechanisms deserve real experiments and capital.

**Architecture:** AX014 is an AI-native drug discovery company that discovers and owns therapeutic programs. The first slice is deterministic local infrastructure: disease, target, mechanism, public evidence, available experiments, budget, and timeline go in; target evidence, mechanism risks, conflicts, missing data, a falsifying experiment, therapeutic opportunity, and a Go/Pause/Kill research disposition come out. The prototype never claims physical execution, never invents patients or outcomes, and never presents personal treatment advice. Consumer wellness, personal DNA, fake patient cases, fake AX014 biology, and mock therapeutic results are removed from the primary path.

**Tech Stack:** Next.js/Vinext, React 19, TypeScript, Vitest, Tailwind v4, and existing shadcn Button/Card/Badge/Input/Separator primitives.

---

## Company contract

The AX014 loop is:

```
disease biology
  ↓ causal target hypothesis
  ↓ mechanism validation
  ↓ therapeutic design
  ↓ experiment selection
  ↓ legitimate lab or CRO execution
  ↓ measured result
  ↓ proprietary data
  ↓ better models
  ↓ therapeutic program
```

The first artifact is AX014 Drug Discovery Engine v0.1.

Inputs:

```
Disease
Target
Mechanism
Public evidence
Available experiments
Budget
Timeline
```

Outputs:

```
Target evidence
Mechanism risks
Conflicting data
Missing data
Best falsifying experiment
Therapeutic opportunity
Go, pause, or kill recommendation
```

A recommendation is a program-level research disposition requiring human review. It is not a diagnosis, prescription, dosage, patient risk claim, or individual drug recommendation.

## Disease and modality selection gate

No disease-specific production fixture is added until the founder selects one disease area and one initial modality. The decision record must answer:

1. Is there a tractable unmet need with a measurable biological endpoint?
2. Is public human genetic, mechanistic, and clinical evidence deep enough to benchmark the engine?
3. Can a legitimate lab or CRO run a falsifying experiment within twelve months?
4. Does the modality fit the target biology, assay, manufacturing path, and available capital?
5. What result would decisively kill the program?

Record the decision in docs/ax014_program_selection.md with the disease, modality, target rationale, benchmark sources, experiment cost range, timeline, and kill criteria. Until approval, the UI shows an unselected state and tests use only a Synthetic benchmark fixture. No fictional AX014 asset is shown as real.

## Evidence policy

Every claim carries one label: Verified source, Synthetic benchmark fixture, Inference, Requires experiment, or Unknown. Claims preserve source identifiers, URLs, excerpts, retrieval metadata, contradictions, and limitations. The engine must not fabricate molecules, patients, clinical outcomes, assay results, patents, partnerships, or completed experiments.

## File map

- Create: lib/ax014/domain.ts — typed discovery case, provenance, experiment, result, decision, and report contracts.
- Create: lib/ax014/fixtures.ts — test-only synthetic benchmark case; no default production biology.
- Create: lib/ax014/analysis.ts — pure evidence coverage, falsifier selection, and Go/Pause/Kill logic.
- Create: lib/ax014/analysis.test.ts — deterministic tests and forbidden-output assertions.
- Create: lib/ax014/evidence.ts — bounded source-record adapter; no runtime network calls in v0.1.
- Create: components/ax014/Ax014ResearchWorkspace.tsx — primary control-room shell and boundary.
- Create: components/ax014/DiscoveryEngineFlow.tsx — complete research workflow.
- Modify: app/page.tsx — AX014 control room becomes the default route.
- Modify: components/genome/ResearchWorkspace.tsx — remove from default path; retain only as historical prototype if needed.
- Modify: components/genome/CompanyMode.tsx — label retained data as illustrative legacy fixture.
- Modify: components/lab/PersonalLabWorkspace.tsx — remove from primary navigation.
- Modify: app/globals.css — restrained light shadcn styling; no rails, tinted cards, gradients, or decorative accent bars.
- Create: docs/ax014_discovery_engine_boundary.md — company and physical-loop boundary.
- Create: docs/ax014_program_selection.md — disease/modality decision record.
- Create: docs/ax014_uc_competitive_patent_audit.md — candidate-only UC treatment, pipeline, response-gap, and patent screen.
- Modify: docs/product_reset.md — remove wellness-first definition.

### Task 0: Complete candidate diligence before building disease-specific screens

**Files:**
- Create: docs/ax014_uc_competitive_patent_audit.md
- Modify: docs/ax014_program_selection.md

- [ ] **Step 1: Inventory approved UC treatment classes and active late-stage programs.** Use current AGA/ACG guidance and ClinicalTrials.gov records. Record mechanism, modality, prior-treatment population, endpoint, sponsor, status, and source URL. Treat regional approval differences explicitly.

- [ ] **Step 2: Map response failures and underserved populations.** Start with objectively active, advanced-therapy-exposed UC after adequate exposure. Record primary nonresponse, secondary loss of response, biomarker limitations, and colectomy or hospitalization signals. Mark all causal explanations as inference until replicated.

- [ ] **Step 3: Run a preliminary patent screen.** Search USPTO, Google Patents, and WIPO by target, modality, composition, use, biomarker, and patient-subgroup terms. Record publication number, assignee, priority date, legal-status caveat, claim theme, and source URL. State clearly that this is not freedom-to-operate advice.

- [ ] **Step 4: Define at least three competing mechanism hypotheses.** Compare immune-pathway escape, epithelial repair/barrier failure, and cell-state or tissue-context mismatch. Do not select a target until each hypothesis has evidence, conflicts, missing data, and a falsifier.

- [ ] **Step 5: Design the cheapest decision-quality experiment.** Specify human-relevant model, controls, readouts, cost range to be quoted by a legitimate CRO or academic lab, timeline, and kill criteria. Require consent, biosafety, and institutional oversight for human-derived material.

- [ ] **Step 6: Gate the program.** UC remains a candidate unless the audit identifies a reproducible subgroup, differentiated mechanism, executable falsifier, preliminary patent strategy, and believable path to a development candidate. Do not build UC-specific production screens before this gate is approved.

- [ ] **Step 7: Commit the diligence artifact.**

```bash
git add docs/ax014_uc_competitive_patent_audit.md docs/ax014_program_selection.md
git commit -m "docs: audit ulcerative colitis candidate"
```

### Task 1: Define the discovery-case contract and decision gate

**Files:**
- Create: lib/ax014/domain.ts
- Create: lib/ax014/fixtures.ts
- Create: lib/ax014/evidence.ts
- Create: lib/ax014/analysis.ts
- Create: lib/ax014/analysis.test.ts
- Create: docs/ax014_program_selection.md

- [ ] Step 1: Write failing tests for evidence coverage, Go/Pause/Kill disposition, report section order, physical-loop boundary, and forbidden personal/clinical language. Import analysis functions and fixture names that do not yet exist.

- [ ] Step 2: Run the focused test.

Run: npm test -- lib/ax014/analysis.test.ts

Expected: FAIL because the AX014 modules do not exist.

- [ ] Step 3: Add typed contracts to lib/ax014/domain.ts.

```ts
export type ProvenanceLabel =
  | 'Verified source'
  | 'Synthetic benchmark fixture'
  | 'Inference'
  | 'Requires experiment'
  | 'Unknown';

export type DispositionAction = 'Go' | 'Pause' | 'Kill';
export type Modality =
  | 'small molecule'
  | 'antibody'
  | 'protein'
  | 'cell therapy'
  | 'nucleic acid'
  | 'unselected';

export type SourceRecord = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  retrievedAt: string;
  label: 'Verified source' | 'Synthetic benchmark fixture';
};

export type EvidenceClaim = {
  id: string;
  statement: string;
  provenance: ProvenanceLabel;
  sourceIds: string[];
  excerpt: string;
  limitation: string;
};

export type ExperimentPlan = {
  id: string;
  title: string;
  objective: string;
  model: string;
  costRange: string;
  duration: string;
  readouts: string[];
  controls: string[];
  successCriteria: string[];
  falsifier: string;
  provenance: 'Requires experiment';
  status: 'Proposed' | 'Ready for human review';
};

export type DiscoveryCase = {
  id: string;
  disease: string;
  target: string;
  mechanism: string;
  researchQuestion: string;
  modality: Modality;
  budget: string;
  timeline: string;
  evidence: EvidenceClaim[];
  mechanismRisks: string[];
  missingData: string[];
  therapeuticOpportunity: string;
  availableExperiments: ExperimentPlan[];
};

export type ExperimentResult = {
  experimentId: string;
  provenance: 'Synthetic benchmark fixture';
  executionStatus: 'Not physically executed';
  readouts: Array<{
    name: string;
    value: string;
    interpretation: 'supports' | 'conflicts' | 'inconclusive';
  }>;
  controlStatus: 'Pass' | 'Fail' | 'Unknown';
  limitation: string;
};

export type ResearchDecision = {
  action: DispositionAction;
  label: 'Human review required';
  reason: string;
  nextQuestion: string;
  evidenceUsed: string[];
};

export type DiscoveryReport = {
  caseId: string;
  sections: Array<{
    title: string;
    body: string;
    provenance: ProvenanceLabel;
  }>;
  decision: ResearchDecision;
  boundary: string;
};
```

- [ ] Step 4: Export syntheticBenchmarkCase and syntheticBenchmarkResult from lib/ax014/fixtures.ts. Use neutral IDs, fixed values, and a fixed timestamp. This fixture is test-only and must never appear as an AX014 asset before program selection.

- [ ] Step 5: Create lib/ax014/evidence.ts with a SourceAdapter contract that normalizes preloaded public records. v0.1 performs no network requests and reports missing IDs, stale timestamps, and adapter errors explicitly.

- [ ] Step 6: Implement scoreEvidenceCoverage, selectFalsifyingExperiment, decideResearchDisposition, and buildDiscoveryReport in lib/ax014/analysis.ts. Go requires verified evidence coverage, a passing control, and a falsifier-ready experiment. Kill requires a failed control or a result that weakens the mechanism. All other states are Pause.

- [ ] Step 7: Create docs/ax014_program_selection.md with the unselected state and the five selection questions. Do not name an approved disease or modality until the founder selects them.

- [ ] Step 8: Run the focused test, then commit.

Run: npm test -- lib/ax014/analysis.test.ts

Expected: PASS.

```bash
git add lib/ax014 docs/ax014_program_selection.md
git commit -m "feat: define AX014 drug discovery engine contract"
```

### Task 2: Build the AX014 research control room

**Files:**
- Create: components/ax014/Ax014ResearchWorkspace.tsx
- Create: components/ax014/DiscoveryEngineFlow.tsx
- Modify: app/page.tsx
- Modify: app/globals.css

- [ ] Step 1: Use React memory only with stages select, question, target, evidence, mechanism, experiment, result, decision, and report. Do not use uploads, personal genomic inputs, device connectors, network requests, browser storage, or hidden model calls.

- [ ] Step 2: Render AX014, Drug Discovery Engine v0.1, and Internal research infrastructure on the first screen. Show: Synthetic benchmark only. No patient care. No claim that a physical experiment has run.

- [ ] Step 3: Render the unselected program state with Disease, Target, Mechanism, Public evidence, Available experiments, Budget, and Timeline. Title it Select the first disease and modality. Do not display fictional AX014 biology.

- [ ] Step 4: Add an explicit Open synthetic benchmark action. Mark every benchmark claim and result with Synthetic benchmark fixture. Walk through research question, target evidence, mechanism risks, conflicting data, missing data, therapeutic opportunity, and candidate experiments.

- [ ] Step 5: Render the falsifying experiment plan with model, cost, duration, readouts, controls, success criteria, and falsifier. The action is Mark ready for human review; it must not imply ordering, funding, or completion.

- [ ] Step 6: Add Load synthetic benchmark result. Display Not physically executed and explain that a legitimate lab or CRO measurement is required before any decision can be trusted.

- [ ] Step 7: Render evidence coverage and exactly one Go, Pause, or Kill disposition with Human review required. Add Markdown and JSON downloads using local Blob objects only.

- [ ] Step 8: Make Ax014ResearchWorkspace the default route in app/page.tsx. Keep historical genome and wellness surfaces out of primary navigation and label any retained link as legacy or prototype.

- [ ] Step 9: Add ax014-* styles using light background, neutral rules, compact data tables, plain labels, and one primary action color. Avoid blue rails, tinted cards, gradients, oversized marketing copy, AI badges, and fake activity feeds.

- [ ] Step 10: Run lint and tests.

Run: npm run lint && npm test

Expected: clean lint and passing tests.

```bash
git add app/page.tsx app/globals.css components/ax014
git commit -m "feat: build AX014 research control room"
```

### Task 3: Remove consumer and fictional-product paths

**Files:**
- Modify: components/lab/PersonalLabWorkspace.tsx
- Modify: components/lab/SleepWellnessFlow.tsx
- Modify: components/genome/ResearchWorkspace.tsx
- Modify: components/genome/CompanyMode.tsx
- Modify: app/page.tsx

- [ ] Step 1: Remove PersonalLabWorkspace and SleepWellnessFlow from app/page.tsx and every components/ax014 import. If retained, label them Consumer prototype — not AX014 core.

- [ ] Step 2: Remove personal DNA, genome upload, patient record, and device-connector language from the AX014 path.

- [ ] Step 3: Remove demo diseases, demo genes, mock molecules, fake patients, fake clinical results, and fictional program progress from the primary control room. Retained historical fixtures stay outside components/ax014 and carry Legacy illustrative fixture.

- [ ] Step 4: Preserve evidence review, hypothesis tracking, experiment planning, decision records, and program navigation with typed, provenance-labeled data.

- [ ] Step 5: Run the primary-path guard.

Run: rg -n 'PersonalLabWorkspace|SleepWellnessFlow|genome|demoDiseases|demoGenes|fake patient|mock therapeutic|fetch\\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|type=\"file\"' app/page.tsx components/ax014

Expected: no matches in the AX014 primary path.

- [ ] Step 6: Commit the cleanup.

```bash
git add app/page.tsx components/lab components/genome
git commit -m "refactor: remove consumer and fictional product paths"
```

### Task 4: Document the company and twelve-month operating plan

**Files:**
- Create: docs/ax014_discovery_engine_boundary.md
- Modify: docs/product_reset.md

- [ ] Step 1: State that AX014 discovers and owns therapeutic programs; software is internal infrastructure; value comes from evidence, patents, partnerships, licensing, royalties, medicines, and acquisition value.

- [ ] Step 2: Document the mandatory loop: disease biology → causal target → mechanism validation → therapeutic design → experiment selection → legitimate lab/CRO execution → result ingestion → model update. Prohibit claims of physical execution when only synthetic data exists.

- [ ] Step 3: Include the twelve-month sequence: choose disease; map biology and unmet need; build public target benchmark; select targets; identify dangerous uncertainty; design the cheapest falsifying experiment; engage a legitimate lab/CRO; generate real evidence; publish method and negative results; select modality; create a defensible program; pursue grants, investors, partnerships, or licensing.

- [ ] Step 4: Prohibit consumer wellness recommendations, personal DNA analysis, diagnoses, patient risk claims, prescriptions, dosage, individual drug recommendations, fake patients, mock therapeutic results, invented patents, and invented lab execution.

- [ ] Step 5: Commit the documentation.

```bash
git add docs/ax014_discovery_engine_boundary.md docs/product_reset.md
git commit -m "docs: establish AX014 pharmaceutical company direction"
```

### Task 5: Verify AX014 Drug Discovery Engine v0.1

- [ ] Step 1: Run npm test && npm run lint && npm run build. All tests must pass, lint must be clean, and the production build must complete. Report non-blocking Vinext warnings separately.

- [ ] Step 2: Start npm run dev -- --host 0.0.0.0 and confirm http://localhost:3000 serves the AX014 control room.

- [ ] Step 3: Browser-check: AX014 boundary; unselected disease/modality state; synthetic benchmark labels; source identifiers and limitations; mechanism risks and falsifier; experiment plan; Not physically executed result; Go/Pause/Kill decision; Markdown/JSON reports; no wellness, DNA, patient, molecule, or mock clinical result in the primary route; reusable evidence, hypothesis, experiment, decision, and program navigation.

- [ ] Step 4: Inspect browser requests/logs while opening the benchmark, loading results, and downloading reports. Confirm zero network requests, no browser persistence, no file input, and no personal or clinical payload.

- [ ] Step 5: Run git diff --check && git status --short, commit any targeted fixes, and push git push fcow_lab main. The final worktree must be clean and all AX014 commits must be present on fcow_lab/main.

## Self-review checklist

- AX014 is presented as a pharmaceutical company, not a consumer health app.
- The primary capability selects experiments and capital-worthy mechanisms.
- The physical biology loop is mandatory and never faked.
- Disease and modality selection is an explicit founder decision gate.
- Synthetic benchmark data is test-only or visibly labeled.
- Evidence, hypotheses, experiments, decision records, and program navigation remain core.
- Personal DNA, fake patients, fake AX014 biology, mock therapeutic results, and consumer wellness are removed from the primary path.
- The first artifact is AX014 Drug Discovery Engine v0.1.
