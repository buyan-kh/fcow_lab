# Frontier Bio Genome to Mechanism Design

**Status:** Approved for implementation  
**Date:** 2026-09-01  
**Product mode:** Research-first single-page workspace

## Goal

Turn Frontier Bio into a privacy-first genomic research and therapeutic hypothesis workspace using synthetic local data only. Genome Import is the entry point; the existing AX-014 program cockpit remains available as a secondary Company mode.

## User flow

```text
Genome Import
  -> Variant Review
  -> Evidence
  -> Gene and Pathway Context
  -> Mechanism Hypothesis
  -> Therapeutic Research Hypothesis
  -> Validation Experiment
  -> Markdown / JSON Report
```

The user can choose the built-in synthetic demo genome or upload a local VCF marked with `##frontier_bio_synthetic=true`. Files without that marker are rejected before parsing. Parsing and all analysis remain in browser memory; the original VCF bytes are never persisted, logged, or included in reports.

## Product boundaries

The first screen permanently shows a research-only banner: not diagnostic, not medical advice, not a treatment recommendation, and never a reason to change medication. The therapeutic view describes disease-level mechanisms, target classes, public examples, risks, unknowns, and experiments. It never recommends a drug, dose, prescription, synthesis, self-experiment, or treatment for an individual.

Evidence is typed as verified, supportive, conflicting, uncertain, missing, research hypothesis, or requires experiment. Fixture sources are visibly labeled as synthetic public-evidence fixtures. Every research prioritization heuristic displays contributing factors and is not presented as a clinical risk score.

## Architecture

- `lib/genome/domain.ts` owns typed domain objects and state unions.
- `lib/genome/vcf.ts` parses and validates synthetic VCF text with no logging.
- `lib/genome/fixtures.ts` provides the synthetic demo genome and deterministic evidence graph.
- `lib/genome/analysis.ts` annotates variants, detects conflict and missing evidence, generates research hypotheses, ranks experiments, and renders reports.
- `lib/genome/session.ts` defines a small in-memory session contract with explicit deletion.
- `app/page.tsx` composes the Research workspace and embeds the preserved Company cockpit behind a mode switch.

No API route, analytics, cloud storage, authentication, or external request is introduced. Adapter interfaces are represented as local function contracts so future ClinVar, gnomAD, Open Targets, Ensembl, NCBI Gene, PubMed, Europe PMC, PharmGKB, ClinicalTrials.gov, and licensed DrugBank adapters can be added without changing UI domain types.

## Safety and privacy

The application uses only synthetic fixtures. The upload control says “local demo input only,” rejects unmarked clinical files, and offers a delete session action that clears all genome-derived state. No raw genome value is sent to a network endpoint or written to console output. Reports include normalized variants and source-backed research context, but not original VCF bytes.

## Validation

Unit tests cover parsing, malformed input, synthetic labeling, evidence classification, conflict detection, hypothesis generation, treatment-advice prohibition, deletion, log safety, and report generation. The final verification also runs lint, production build, a development server, and a manual browser pass through every research step.
