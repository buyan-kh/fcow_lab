# Current State Audit

**Date:** 2026-09-01  
**Conclusion:** The current repository is a throwaway UI exploration backed by fictional program data and synthetic fixtures. It must not be presented as scientific evidence, a therapeutic platform, or a product that has evaluated a real target.

## 1. Fictional domain objects

### `data.ts`

- `program`: fictional program `AX-014`, named `IL-6R epithelial signaling`, with indication `Inflammatory bowel disease`, modality `Small molecule`, and stage `Mechanism validation`.
- `ProgramUncertainty` entries: fictional questions about pathway causality, donor translation, and prospective biomarker measurement.
- `gatingUncertainty`: fictional claim that donor rescue would unlock modality selection and chemistry planning.
- `EvidenceItem` objects in `initialEvidence`: fictional human genetics, CRISPR, pSTAT3 biomarker, and translation-gap records.
- `Experiment` objects in `initialExperiments`: fictional donor perturbation/rescue, reference-line dependency, pSTAT3 time-course, and off-target viability experiments.
- `decisionFlow`: fictional discovery stages, including an IL-6R pathway and a candidate-design path.
- `candidateShortlist`: fictional modality gate, binding-site hypothesis, and lead-series records.
- `decisionRecord`: fictional recommendation to run a donor-derived rescue study before chemistry planning.
- `promptResponses`: fictional AI answers about why the rescue experiment is ranked first and what evidence would change the recommendation.

### `lib/genome/fixtures.ts`

- `SYNTHETIC_VCF`: an invented VCF-like string containing `GENE-X1`, `GENE-Y2`, `var-x1`, `var-y2`, and invented coordinates.
- `demoVariants`: invented variant records with invented annotations, quality values, and evidence states.
- `demoGenes`: invented `GENE-X1` and `GENE-Y2` gene objects.
- `demoPathways`: invented `P1 epithelial cytokine signaling (fixture)` pathway.
- `demoDiseases`: invented disease-context association `Inflammatory bowel disease (fixture)`.
- `demoEvidence`: three invented evidence records with `example.org` URLs and identifiers `FB-FIX-A-001`, `FB-FIX-B-002`, and `FB-GAP-003`.
- `demoExperiment`: invented `Controlled GENE-X1 perturbation and rescue study`.
- `demoUpload`: invented synthetic demo upload metadata.

### `lib/genome/analysis.ts`

- `generateMechanismHypothesis`: creates an invented gene → pathway → disease narrative from the fixture graph.
- `generateTherapeuticHypothesis`: creates an invented target-class narrative and invented “publicly documented” example labels.
- `calculateResearchPrioritization`: calculates invented numerical heuristics from fixture inputs.
- `createResearchReport`: packages the invented objects as a downloadable report.

## 2. Mock evidence items

The following evidence is presented as data but has no real source backing:

1. “The synthetic GENE-X1 context is associated with altered epithelial cytokine signaling in the fixture.” Source: `Frontier Bio public-evidence fixture A`, identifier `FB-FIX-A-001`, URL `https://example.org/frontier-bio/fixture-a`.
2. “A separate synthetic fixture did not reproduce the direction of the GENE-X1 signaling change.” Source: `Frontier Bio public-evidence fixture B`, identifier `FB-FIX-B-002`, URL `https://example.org/frontier-bio/fixture-b`.
3. “No fixture establishes whether GENE-Y2 changes function in the relevant tissue.” Source: `Evidence gap registry (fixture)`, identifier `FB-GAP-003`, URL `https://example.org/frontier-bio/gaps`.
4. The original `data.ts` evidence cards claim a directionally aligned human genetic signal, a reproducible CRISPR dependency, a measurable pSTAT3 readout, and a missing donor-rescue fact. None has a citation or real dataset.
5. The genome report preview repeats the fixture claims and adds source identifiers, but the identifiers and URLs are invented and must not be mistaken for public evidence.

## 3. Mock experiments

### `data.ts`

- `exp-01`: Paired perturbation + rescue study in donor-derived epithelial cells.
- `exp-02`: Replicate target dependency screen in a reference cell-line panel.
- `exp-03`: Pathway marker time course using a single-cell pSTAT3 readout.
- `exp-04`: Off-target viability counter-screen panel.

These records include invented owners, statuses, rankings, costs, durations, falsifiers, and consequences. No experiment has been ordered, run, or reported.

### `lib/genome/fixtures.ts`

- `exp-fixture-1`: Controlled GENE-X1 perturbation and rescue study with invented assay type, controls, duration, and falsifier.

The UI action “Mark for human review” changes only browser state and never places an order or represents a real experiment.

## 4. Unsupported scientific claims

- `IL-6R epithelial signaling` is treated as a real program context without a real sponsor, dataset, or source.
- The app implies an inflammatory bowel disease connection and describes it as directionally aligned.
- The app implies a CRISPR target dependency and a pathway-consistent pSTAT3 readout.
- The app implies donor-derived rescue is the highest-value next experiment.
- The app implies a positive rescue result would unlock chemistry planning.
- The app generates a gene → pathway → disease graph that visually suggests mechanistic coherence.
- The app generates confidence labels and 0–10 prioritization scores from invented inputs.
- The app names “publicly documented pathway inhibitor class” and “publicly documented genetic perturbation class” without identifying real drugs or sources.
- The app describes target-specific mechanism, translational relevance, and therapeutic tractability using no real evidence.
- `ThinkingState` and `ToolChips` mention real public resources such as Open Targets and PubMed, but no retrieval occurs.
- `docs/genome_product_thesis.md`, `docs/genome_data_contract.md`, `docs/genome_privacy_threat_model.md`, `docs/public_data_sources.md`, and the genome design/plan documents describe a product contract that the implementation does not satisfy with real sources.

The labels “synthetic,” “fixture,” and “research only” reduce but do not eliminate the risk that polished scientific language is read as credible evidence. The current app should therefore not be demoed as a scientific result.

## 5. Components that are purely presentation

- `components/DecisionRecord.tsx`: renders supplied copy and labels; it has no scientific or source-retrieval logic.
- `components/DiscoveryPipeline.tsx`: renders supplied stages; it does not validate program state.
- `components/LoadingState.tsx`: visual loading animation/status copy only.
- `components/ThinkingState.tsx`: visual reasoning/tool list only; its named sources are not queried.
- `components/ToolChips.tsx`: visual tool chips only.
- `components/genome/StatusLegend.tsx`: renders evidence-state labels.
- `components/genome/ScoreBreakdown.tsx`: renders scores supplied by fixture analysis.
- `components/genome/CompanyMode.tsx`: presentation wrapper for the fictional AX-014 data.
- `components/genome/ResearchWorkspace.tsx`: UI state machine and presentation for fictional fixtures; its local parsing is functional, but its scientific content is not real.
- `components/ui/*`: generic shadcn/Radix presentation primitives.
- Most of `app/globals.css`: visual tokens and layout rules, including legacy evidence-console styles.
- `app/page.tsx`: mode switch only; it has no domain authority.

## 6. Components and modules that can be reused

- `components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `separator.tsx`, `sheet.tsx`, and `tabs.tsx` can remain generic UI primitives.
- The layout/accessibility patterns in `app/globals.css` can be selectively retained after removing fictional copy and reducing duplicated legacy styles.
- `components/LoadingState.tsx` can be adapted to show real retrieval/parsing states once a source-backed pipeline exists.
- `components/ThinkingState.tsx` can be adapted only if every displayed tool/source corresponds to a real request or deterministic test fixture; its current source list must not imply retrieval.
- `components/ToolChips.tsx` can be reused for transparent source/retrieval status.
- `lib/utils.ts` is generic.
- The deterministic sorting shape in `lib/decision.ts` may be reused for a real, clearly labeled diligence prioritization function after its fictional test/program inputs are removed.
- `lib/genome/vcf.ts` is reusable only as a parsing experiment for tests; it must not be connected to personal uploads or treated as a scientific analysis service.
- The report download mechanics in `lib/genome/analysis.ts` may be reused after replacing all fixture scientific content with source-backed claims.

## 7. Files to archive or replace

### Archive as throwaway exploration

- `data.ts`
- `components/genome/CompanyMode.tsx`
- `components/genome/ResearchWorkspace.tsx`
- `components/genome/ScoreBreakdown.tsx`
- `components/genome/StatusLegend.tsx`
- `lib/genome/fixtures.ts`
- `lib/genome/analysis.ts`
- `lib/genome/domain.ts`
- `lib/genome/session.ts`
- `lib/genome/vcf.ts`
- `lib/genome/*.test.ts`
- `docs/genome_product_thesis.md`
- `docs/genome_privacy_threat_model.md`
- `docs/genome_data_contract.md`
- `docs/therapeutic_hypothesis_boundaries.md`
- `docs/public_data_sources.md`
- `docs/research_only_disclaimer.md`
- `docs/superpowers/specs/2026-09-01-genome-to-mechanism-design.md`
- `docs/superpowers/plans/2026-09-01-genome-to-mechanism.md`

### Replace for the diligence product

- `app/page.tsx`: replace the Genome Import-first workflow with target + disease diligence input and source-backed retrieval states.
- `app/layout.tsx`: replace Genome to Mechanism metadata with Research Diligence metadata.
- `lib/program.ts`: replace AX-014 program types with diligence case, target, disease, source, claim, contradiction, failure, risk, experiment, and report types.
- `lib/decision.ts` and `lib/decision.test.ts`: replace fictional experiment ranking behavior with transparent diligence prioritization behavior.
- `components/DecisionRecord.tsx`: replace “saved program judgment” copy with an evidence-backed diligence decision record.
- `components/DiscoveryPipeline.tsx`: replace drug-discovery stage labels with the target → evidence → risk → next experiment sequence.
- The legacy evidence-console styles in `app/globals.css`: keep tokens selectively, but remove fictional labels, duplicated console layouts, and visual treatment that suggests completed science.

### Keep only as generic foundation

- `components/ui/*`
- `lib/utils.ts`
- `next.config.ts`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, and package configuration unless the real-source architecture requires changes.

No files are deleted by this audit.
