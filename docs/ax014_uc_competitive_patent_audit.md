# AX014 UC Competitive and Patent Audit

**Status:** Candidate diligence only; not an AX014 program commitment  
**Date:** 2026-09-01  
**Scope:** Public-source review of ulcerative colitis (UC) treatments, late-stage competition, response-failure gaps, and an initial patent screen. This is not legal advice, freedom-to-operate clearance, or a clinical recommendation.

## Executive verdict

UC is a valid working candidate because it has deep public biology, measurable disease activity, and a large treatment-failure population. It is not an attractive company commitment by default. The general UC market is crowded across biologics and oral small molecules, and several late-stage programs are pursuing the same broad “another anti-inflammatory therapy” opportunity.

The only investable AX014 thesis would be narrower:

```text
identify a reproducible subgroup that fails existing mechanisms
  → explain the biological failure mode
  → find a measurable response signal
  → design a mechanism-specific treatment concept
  → falsify it in human-relevant models
```

The current audit does not establish that subgroup, mechanism, or patentable treatment. It establishes the diligence work required before AX014 builds UC-specific screens or spends on chemistry.

## Existing treatment map

The 2025 ACG update lists the established UC treatment families as 5-ASA therapies, corticosteroids, thiopurines, methotrexate, S1P receptor modulators, IL-12/23p40 inhibition, IL-23p19 inhibition, anti-integrin therapy, and anti-TNF therapy. Named advanced therapies include ozanimod, etrasimod, ustekinumab, guselkumab, mirikizumab, risankizumab, vedolizumab, infliximab, adalimumab, golimumab, tofacitinib, and upadacitinib. Regional approvals and labels vary, so this is a class map rather than a global regulatory inventory. [ACG 2025 update](https://gi.org/journals-publications/ebgi/alkazzi_aug2025/) [AGA living guideline](https://gastro.org/clinical-guidance/living-guideline-for-moderate-to-severe-ulcerative-colitis/)

| Class | Representative agents | Strategic implication |
| --- | --- | --- |
| 5-ASA | Mesalamine, sulfasalazine, balsalazide, olsalazine | Low-cost standard care; not a differentiated new-program space. |
| Steroids | Prednisone, budesonide MMX, IV/topical corticosteroids | Useful for induction/rescue, unsuitable as a durable disease-modifying thesis. |
| Immunomodulators | Azathioprine, 6-MP; methotrexate has limited UC role | Established but safety/monitoring burdens and weak monotherapy positioning. |
| Anti-TNF | Infliximab, adalimumab, golimumab | Mature class with biosimilars, immunogenicity, primary nonresponse, and secondary loss of response. |
| Anti-integrin | Vedolizumab | Gut-selective mechanism; response is heterogeneous and not biomarker-selected. |
| IL-12/23 and IL-23 | Ustekinumab, guselkumab, mirikizumab, risankizumab | Strong current competition; target class is no longer novel. |
| JAK | Tofacitinib, upadacitinib | Oral efficacy but safety restrictions and crowded follow-on development. |
| S1P | Ozanimod, etrasimod | Oral option with monitoring and class-specific safety constraints. |

## Late-stage competitive map

Public ClinicalTrials.gov records show multiple Phase 3 programs already occupying the most obvious whitespace:

| Program | Sponsor | Mechanism/modality | Public status |
| --- | --- | --- | --- |
| Afimkibart (RO7790121) | Roche | Anti-TL1A antibody | Phase III UC induction/maintenance and pediatric Phase III studies. [NCT06589986](https://clinicaltrials.gov/study/NCT06589986) [NCT07158242](https://clinicaltrials.gov/study/NCT07158242) |
| Tulisokibart (MK-7240/PRA023) | Merck | Anti-TL1A antibody | Phase 3 UC program with IV/SC dosing. [NCT06052059](https://clinicaltrials.gov/study/NCT06052059) |
| Duvakitug | Sanofi | Anti-TL1A antibody | Phase 3 UC induction study. [NCT07184996](https://clinicaltrials.gov/study/NCT07184996) |
| Icotrokinra | Johnson & Johnson | Oral IL-23 receptor inhibitor | Phase 3 UC protocol, estimated 882 participants. [NCT07196748](https://clinicaltrials.gov/study/NCT07196748) |
| LY4268989 / MORF-057 | Eli Lilly | Oral selective α4β7 integrin small molecule | Recruiting Phase 3 UC program. [NCT07415044](https://clinicaltrials.gov/study/NCT07415044) |

**Inference:** An AX014 program that merely chooses “oral,” “IL-23,” “TL1A,” “JAK,” or “integrin” without a differentiated failure biology is unlikely to be fundable or defensible.

## The underserved population worth investigating

The most defensible starting population is adults with objectively active, moderate-to-severe UC who have failed or lost response to one or more advanced therapies despite adequate exposure and confirmed inflammation. The ACG update states that up to one-fifth of patients receiving anti-TNF agents may not respond initially and another 10–15% may lose response each year; it also states that no validated therapeutic biomarker or companion diagnostic currently improves treatment selection. [ACG 2025 update](https://doi.org/10.14309/ajg.0000000000003463)

A 2024 systematic review of second-line biologics after prior failure reported modest remission and mucosal-healing rates and an annual colectomy rate of 9%, underscoring that a treatment-failure population remains clinically important. [Systematic review](https://pubmed.ncbi.nlm.nih.gov/38403257/)

**Candidate population statement (inference, not validated):**

```text
advanced-therapy-exposed UC with objective inflammation,
adequate drug exposure, and reproducible primary or secondary nonresponse
```

This is a research cohort definition for biomarker discovery, not a treatment recommendation.

## Biological opportunity hypotheses

The audit should compare, rather than assume, at least three failure mechanisms:

1. **Immune-pathway escape:** persistent inflammatory signaling despite adequate target blockade.
2. **Epithelial repair/barrier failure:** inflammation remains because mucosal integrity and repair do not recover even when a dominant cytokine pathway is suppressed.
3. **Cell-state or tissue-context mismatch:** the relevant responder cell state is not represented by the selected therapy or standard bulk biomarkers.

These are hypotheses. They require public multi-omics analysis and human-relevant experiments before any target or modality is selected.

## Preliminary patent screen

The initial screen found active or pending patent families touching the most obvious non-cytokine and response-focused ideas:

| Area | Example public family | What it indicates |
| --- | --- | --- |
| Epithelial/endothelial barrier agents | [US20250109144A1](https://patents.google.com/patent/US20250109144A1/en), [US11505583B2](https://patents.google.com/patent/US11505583B2/en) | Barrier-restoring compounds/proteins are already being claimed for IBD and related permeability disorders. |
| GPR35 modulators | [WO2022020617A1](https://patents.google.com/patent/WO2022020617A1/en), [WO2024147009A1](https://patents.google.com/patent/WO2024147009A1/en) | GPR35 agonist/antagonist chemistry and UC uses have existing patent activity. |
| TL1A antibodies | [US20230381308A1](https://patents.google.com/patent/US20230381308A1/en), [WO2021260577A2](https://patents.google.com/patent/WO2021260577A2/en) | The major late-stage TL1A opportunity is heavily patented and clinically occupied. |

**Patent conclusion:** Barrier repair, GPR35, and TL1A cannot be treated as open whitespace from this search. Google Patents is a discovery index and does not establish claim scope, validity, prosecution status, ownership, or freedom to operate. AX014 needs a patent attorney to run a claim-level search before selecting a target, sequence, composition, or use claim.

## Cheapest falsifying experiment

Do not begin with a molecule generator. The cheapest decision-quality sequence is:

1. Build a public benchmark from UC genetics, transcriptomics, single-cell data, treatment-response cohorts, and trial results.
2. Rank failure mechanisms, not molecules, with all claims linked to source identifiers.
3. Select one measurable signature that separates response from nonresponse after adequate exposure.
4. Pre-register a falsifier: the signature must reproduce across independent cohorts and predict a mechanistic readout in a human-derived model.
5. Contract a qualified CRO or academic lab for patient-derived colonic organoid and immune co-culture experiments, subject to appropriate consent, biosafety, and oversight.
6. Measure barrier function, inflammatory signaling, cell-state composition, and pathway-specific response against controls.
7. Kill the mechanism if the signature does not reproduce, does not separate response states, or cannot produce a causal perturbation signal.

The exact cost and timeline require CRO quotations; this document intentionally does not invent a budget.

## Go/no-go gate for UC

UC becomes an AX014 commitment only if the audit produces all of the following:

- A reproducible patient subgroup with a clear treatment-failure definition.
- A mechanism that is not simply a copy of an occupied late-stage class.
- An assay and readout that a legitimate lab can run within the available budget.
- A causal falsifier with a credible kill outcome.
- A preliminary patent strategy reviewed by counsel.
- A believable path from evidence to a development candidate and patient trial.

Until then, UC remains a candidate benchmark for AX014 Drug Discovery Engine v0.1, not a company program.
