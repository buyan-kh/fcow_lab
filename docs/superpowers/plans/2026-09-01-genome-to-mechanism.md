# Frontier Bio Genome to Mechanism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, synthetic-only Research workspace that flows from Genome Import through evidence-backed hypotheses, validation experiments, and Markdown/JSON report export while retaining the current AX-014 cockpit as secondary Company mode.

**Architecture:** Add focused typed genome modules for parsing, fixtures, analysis, session deletion, and report rendering. Replace the current page shell with a Research-first single-page workspace and move the existing cockpit into a clearly secondary Company mode. Keep all state in React memory; do not add network calls, persistence, analytics, or authentication.

**Tech Stack:** Next 16/Vinext, React 19, TypeScript, Vitest, existing shadcn primitives, lucide-react, CSS in `app/globals.css`.

---

### Task 1: Domain contract and safety fixtures

**Files:**
- Create: `lib/genome/domain.ts`
- Create: `lib/genome/fixtures.ts`
- Create: `lib/genome/analysis.test.ts`

- [ ] **Step 1: Write failing domain behavior tests** for fixture labeling, evidence states, conflicts, hypotheses, heuristic factor transparency, and treatment-advice prohibition.
- [ ] **Step 2: Run `npm test -- lib/genome/analysis.test.ts` and confirm the new imports/functions fail because the modules do not exist.**
- [ ] **Step 3: Define the typed objects from the approved design and deterministic synthetic fixtures for two variants, genes, pathways, diseases, evidence items, one mechanism hypothesis, one therapeutic research hypothesis, and one validation experiment.
- [ ] **Step 4: Implement analysis helpers that classify evidence, detect conflicting claims, generate research-only hypotheses, calculate named prioritization heuristics with factors, and reject personal treatment language.
- [ ] **Step 5: Run the focused test and then the full suite; confirm green.**

### Task 2: Synthetic VCF parser and in-memory session

**Files:**
- Create: `lib/genome/vcf.ts`
- Create: `lib/genome/session.ts`
- Create: `lib/genome/vcf.test.ts`
- Create: `lib/genome/session.test.ts`

- [ ] **Step 1: Write failing tests** for the required synthetic header, malformed rows, genotype/quality/filter parsing, browser-memory session creation, deletion, and the absence of raw variant logging.
- [ ] **Step 2: Run the focused tests and confirm they fail for missing parser/session exports.**
- [ ] **Step 3: Implement strict local parsing: require `##frontier_bio_synthetic=true`, require VCF column headers, validate chromosome/position/alleles/genotype/quality/filter, and return typed `Variant` values without logging input text.
- [ ] **Step 4: Implement `createGenomeSession` and `deleteGenomeSession` as immutable in-memory operations; do not use localStorage, fetch, console logging, or server actions.
- [ ] **Step 5: Run focused and full tests; confirm green.**

### Task 3: Report rendering and privacy documentation

**Files:**
- Modify: `lib/genome/analysis.ts`
- Create: `lib/genome/report.test.ts`
- Create: `docs/genome_product_thesis.md`
- Create: `docs/genome_privacy_threat_model.md`
- Create: `docs/genome_data_contract.md`
- Create: `docs/therapeutic_hypothesis_boundaries.md`
- Create: `docs/public_data_sources.md`
- Create: `docs/research_only_disclaimer.md`

- [ ] **Step 1: Write failing report tests** for Markdown and JSON output, source provenance, normalized variants, explicit limitations, and exclusion of original VCF text.
- [ ] **Step 2: Run the report test and confirm it fails.**
- [ ] **Step 3: Implement deterministic report renderers and download-safe payload types; include report metadata, fixture labels, evidence states, hypotheses, heuristic factors, experiment plan, and disclaimer while excluding original VCF bytes.
- [ ] **Step 4: Write the six required documents covering thesis, threat model, data contract, therapeutic boundaries, future public sources, and visible disclaimer language.
- [ ] **Step 5: Run focused and full tests; confirm green.**

### Task 4: Research-first single-page workspace

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `components/genome/ResearchWorkspace.tsx`
- Create: `components/genome/StatusLegend.tsx`
- Create: `components/genome/ScoreBreakdown.tsx`
- Create: `components/genome/CompanyMode.tsx`

- [ ] **Step 1: Compose the entry screen around Genome Import with demo selection, marker-gated file input, local-only messaging, delete session, and persistent safety banner.
- [ ] **Step 2: Add in-page navigation/state for Variant Review, Evidence, Gene and Pathway Context, Mechanism Hypothesis, Therapeutic Research Hypothesis, Validation Experiment, and Report export.
- [ ] **Step 3: Render typed variant rows, evidence cards with source identifiers/fixture labels, conflict and missing evidence, an explicit gene → pathway → disease graph, hypotheses with confidence/status labels, therapeutic target classes only, experiment queue, score factor breakdowns, and Markdown/JSON downloads.
- [ ] **Step 4: Add a Company mode switch that preserves the existing AX-014 cockpit components and labels the mode as illustrative secondary context.
- [ ] **Step 5: Update metadata and CSS for readable 16px+ body copy, clear state text, responsive layout, and visible first-screen limitations.
- [ ] **Step 6: Run the app locally and verify keyboard-accessible controls and the complete flow in the browser.**

### Task 5: Full verification and handoff

**Files:**
- Modify: any files required by verification failures only.

- [ ] **Step 1: Run `npm test` and record exact test counts and failures.
- [ ] **Step 2: Run `npm run lint` and record exact output.
- [ ] **Step 3: Run `npm run build` and record the exit status/output.
- [ ] **Step 4: Start `npm run dev`, manually walk the full research flow in the browser, and verify no raw genome value appears in a network request or console output.
- [ ] **Step 5: Review `git diff --stat` and `git status --short`; report exact changed files and verification evidence.
