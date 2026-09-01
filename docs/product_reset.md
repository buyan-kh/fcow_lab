# Frontier Bio Product Reset

**Status:** Reset approved for discovery; implementation paused.  
**Date:** 2026-09-01

## Product definition

Frontier Bio is an evidence-backed research diligence and decision intelligence system for biotech target and therapeutic program evaluation.

The long-term vision remains an operating system that gives serious biotech teams the leverage of a pharmaceutical research organization. The first product must earn that vision by improving one expensive decision for one real user.

## First product

Frontier Bio Research Diligence takes a real target, disease, and therapeutic program context and produces a source-backed decision dossier:

```text
target + disease
  -> public evidence retrieval
  -> source-linked claims
  -> contradictory evidence
  -> known clinical and preclinical failures
  -> translational risk analysis
  -> next experiment recommendation
  -> downloadable decision report
```

The first customer hypothesis is small biotech teams, biotech investors, translational scientists, and pharma strategy teams that need faster, more rigorous diligence before spending millions on experiments or licensing decisions.

The first paid deliverable is a program diligence report delivered in hours instead of weeks. The first measurable value is faster diligence, earlier detection of weak targets, better identification of failed programs, more defensible go/no-go decisions, and less duplicated research.

## Source policy

Use real public sources only for product output. Candidate sources include Open Targets, PubMed, Europe PMC, ClinicalTrials.gov, ClinVar, GWAS Catalog, ChEMBL, FDA materials, SEC filings, and patent databases.

Local fixtures are permitted only in tests. Fixtures must never be presented as real evidence, and the product must not invent targets, diseases, studies, experiments, molecules, metrics, or source identifiers.

Every displayed statement must carry one of these labels:

- Verified source
- Strong evidence
- Conflicting evidence
- Inference
- Unknown
- Requires experiment

Every claim must link to a real source identifier and URL or be explicitly marked as inference/unknown. Contradictions, missing evidence, publication dates, retrieval dates, and source limitations must be visible in the dossier.

## Safety and scope boundaries

- Do not accept personal genomic data.
- Do not build genome upload or personal disease analysis.
- Do not provide diagnosis, medical advice, treatment recommendations, dosage, prescriptions, or instructions for self-experimentation.
- Do not make personalized drug recommendations.
- Do not generate fictional therapeutic programs, molecules, patients, experiments, or clinical outcomes.
- Do not use an LLM to make uncited medical or scientific claims.
- Do not imply that a recommendation has been executed; a next experiment remains a proposal until a human research team confirms it.

## Initial report sections

1. Target and disease scope
2. Source-linked target biology
3. Human genetic and disease evidence
4. Causal and mechanistic evidence
5. Contradictory, missing, and model-limited evidence
6. Known clinical and preclinical failures
7. Translational risk analysis
8. Next experiment and falsifier
9. Evidence coverage and limitations
10. Exportable Markdown and JSON decision report

## Product architecture direction

The next implementation should be a source-backed diligence case, not a genome workspace:

```text
DiligenceCase
  -> Target / Disease context
  -> Source adapters
  -> Claims with provenance
  -> Contradiction and failure analysis
  -> Translational risk factors
  -> Next-experiment proposal
  -> Human-reviewed decision report
```

Source adapters should be explicit and bounded. Each adapter should normalize real public responses into a shared claim contract, preserve source identifiers and excerpts, record retrieval timestamps, and expose errors or rate limits. Local fixtures should implement the same contract in tests without appearing in production UI.

The first interface should make the real decision legible: “Does this target deserve another experiment or more capital?” It should not look like a pharmaceutical operating system, genome interpretation app, or fictional company cockpit.

## What happens to the current app

The current AX-014/IL-6R workspace, genome workflow, fixture evidence, synthetic hypotheses, and fictional experiments are preserved as throwaway UI exploration only. They are not scientific product assets. See `docs/current_state_audit.md` for the complete inventory and reuse/replace map.

No implementation code should be written from the old workflow until a diligence data contract, source policy, and report definition are reviewed and approved.
