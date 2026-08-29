# Frontier Bio Product Design

**Status:** Draft for founder review  
**Date:** 2026-08-29  
**Product center:** Program cockpit  
**Initial wedge:** Mechanism validation and next-experiment selection

## 1. Product definition

Frontier Bio is an AI-native therapeutics company. Its first software surface is a research workspace for making high-stakes biological decisions inside a therapeutic program.

The product answers one question:

> What is the most important thing we may be wrong about, and what is the next experiment most likely to resolve it before we commit more capital?

The first product is not the company itself, and it is not a generic AI assistant. It is the operating surface through which Frontier Bio turns scientific evidence into explicit decisions, physical experiments, proprietary feedback, and eventually therapeutic assets.

## 2. Product thesis

Drug programs do not fail only because teams cannot generate enough candidates. They fail when teams make expensive commitments while critical biological assumptions remain implicit, weakly supported, or untested.

Frontier Bio should therefore optimize the decision loop around uncertainty:

```text
program
  -> hypotheses
  -> evidence and claims
  -> unresolved uncertainty
  -> candidate experiments
  -> selected experiment
  -> physical result
  -> updated belief
  -> advance, pause, partner, license, or kill
```

The product must make that loop inspectable. A recommendation without evidence, assumptions, falsification criteria, or a recorded outcome is incomplete.

## 3. First user and job to be done

The first user is the Frontier Bio research or program lead evaluating one therapeutic program. The initial workflow is intentionally single-program and decision-centered; multi-program portfolio management comes later.

The user wants to:

1. Understand what the program is trying to prove.
2. See which claims are supported, conflicting, missing, or hypothetical.
3. Identify the uncertainty with the largest effect on the next capital decision.
4. Compare candidate experiments under money, time, tissue, assay, and external-lab constraints.
5. Approve one next experiment with explicit success and kill criteria.
6. Record the result and update the program’s decision state.

## 4. Product boundary

### In scope for v1

- One program cockpit for a single active therapeutic program.
- A structured evidence ledger with source provenance.
- Explicit hypotheses, mechanisms, uncertainties, and decision consequences.
- A ranked list of candidate experiments.
- A recommendation packet for one next experiment.
- Human approval before an experiment is queued.
- A decision record with advance, pause, partner, license, and kill outcomes.
- Thinking, loading, tool-use, and evidence states that make AI work visible.
- Large, readable layouts suitable for scientific review.

### Deliberately out of scope for v1

- Autonomous wet-lab execution.
- Molecular generation as the primary experience.
- Replacing an ELN, LIMS, data warehouse, or laboratory information system.
- Full clinical-trial operations.
- Portfolio optimization across many programs.
- A chat-first homepage.
- Unsupported confidence scores or fabricated scientific claims.
- A polished demo that is not connected to a reviewable decision loop.

## 5. Core domain objects

The product is organized around decision objects, not UI widgets.

| Object | Purpose | Minimum fields |
| --- | --- | --- |
| Program | The therapeutic effort being evaluated | name, modality, indication, stage, owner, current decision |
| Decision | The capital or research choice currently at stake | question, options, deadline, required evidence, consequence |
| Hypothesis | A biological claim the program depends on | statement, mechanism, population, status, falsifier |
| Evidence item | A source-backed observation or result | claim, source, excerpt, provenance, evidence state, date |
| Uncertainty | A gap or disagreement that could change the decision | question, impact, current belief, missing evidence, rank |
| Experiment | A proposed way to discriminate between hypotheses | protocol, cost, time, material, expected information gain, owner |
| Outcome | The observed result of an experiment | measurements, controls, quality, interpretation, attachments |
| Decision record | A durable explanation of what the team decided | decision, evidence, rationale, action, threshold, author, timestamp |

## 6. Program cockpit information architecture

The cockpit has one dominant reading order:

1. **Current decision** — what must be decided and by when.
2. **Highest-value uncertainty** — the unresolved question most likely to change that decision.
3. **Evidence ledger** — source-backed support, conflict, and absence.
4. **Recommended experiment** — what to run, why it discriminates, and what it costs.
5. **Decision thresholds** — what result advances, pauses, or kills the program.
6. **Experiment queue** — alternatives ranked by information gain and feasibility.
7. **Decision record** — the reviewable artifact produced by the work.

The default screen should read like a research review, not a metrics dashboard. The primary uncertainty and recommended experiment receive the largest visual treatment. Secondary context is available without competing for attention.

## 7. AI behavior

The AI system is a constrained reasoning pipeline. It should expose intermediate work and allow a scientist to challenge each step.

### Evidence processing

- Ingest public papers, genetics resources, assay results, experiment records, and user-provided documents.
- Normalize sources and retain stable identifiers.
- Extract claims only with source spans or explicit user-entered provenance.
- Detect duplicate, contradictory, stale, and missing evidence.
- Separate verified fact, strong evidence, interpretation, hypothesis, unknown, and future experiment.

### Uncertainty ranking

Rank uncertainties using explicit factors:

- Effect on the current decision.
- Degree of disagreement or missing evidence.
- Reversibility of the decision.
- Cost of waiting or committing.
- Feasibility of a discriminating experiment.
- Potential to create reusable proprietary evidence.

The system must show the factors behind a rank. “Highest-value” cannot be a black-box label.

### Experiment recommendation

For each candidate experiment, produce:

- The competing hypotheses it distinguishes.
- The observation that would change the current belief.
- Expected information gain and how it is estimated.
- Cost, time, sample, assay, and external-lab requirements.
- Controls and minimum quality criteria.
- Advance, pause, and kill interpretations.
- What data will be reusable by future models.

The AI recommends. A human approves. Physical execution and result entry remain explicit steps.

## 8. Required state language

Scientific states must be unambiguous and consistent across the workspace.

### Evidence states

- Verified
- Supportive
- Conflicting
- Model-limited
- Missing
- Hypothesis
- Requires experiment

### Experiment states

- Proposed
- Needs review
- Queued
- In progress
- Complete
- Blocked
- Rejected

### Decision states

- Open
- Evidence review
- Experiment selected
- Awaiting result
- Advance
- Pause
- Partner
- License
- Kill

## 9. Design-system strategy

Dooping Design Book supplies the product and operational patterns: stable semantic tokens, reusable administrative interactions, evidence-heavy review flows, and explicit state design. Its repository separates tokens, copied React references, and higher-level patterns, which is a useful boundary for this product. See: https://github.com/kielchang/dooping-design-book

Beautiful UI supplies the implementation components used by the workspace. The foundation should be established before feature modules:

1. Foundation tokens.
2. `ThinkingState`.
3. `LoadingState`.
4. `ToolChips`.
5. Evidence and source primitives.
6. Experiment and recommendation primitives.
7. Program cockpit composition.

The two systems must not be layered as competing visual themes. A single semantic token adapter should map the product vocabulary to the implementation tokens.

## 10. Readability and layout requirements

The current prototype’s type scale is too small for scientific review. These are product requirements, not optional polish:

- Body text: at least 16px.
- Primary program and uncertainty text: 20–30px.
- Section headings: 18–24px.
- Evidence, experiment, and control text: at least 14px.
- Metadata: at least 13px when it carries meaning.
- Labels may be smaller only when redundant with readable text.
- No important status may be communicated only through color.
- No key information may be hidden behind hover.
- The main content area must support a comfortable reading width on desktop.
- Mobile layouts must preserve readable text and remove secondary density rather than shrink everything.
- The cockpit should use one dominant column plus a supporting context rail, not a wall of equal cards.
- Every loading or reasoning state must explain what the system is doing.

## 11. Technical shape for the first build

The current repository is a Next/Vinext React site. The first product implementation should stay local and deterministic while the product contract is validated.

### Phase 1: Research workspace shell

- Typed fixtures for one realistic program.
- Explicit domain objects from Section 5.
- Foundation tokens and prerequisite state components.
- Program cockpit with large readable hierarchy.
- Evidence cards with provenance and expandable detail.
- Recommendation card with decision criteria.
- Experiment queue and decision record.

### Phase 2: Evidence and decision services

- Persistence for programs, evidence, experiments, and decisions.
- Source ingestion and citation identifiers.
- Structured claim extraction.
- Deterministic uncertainty ranking baseline.
- Human edits and overrides.

### Phase 3: Closed-loop learning

- Experiment result ingestion.
- Outcome quality checks.
- Prospective evaluation of ranking quality.
- Model updates using positive, negative, and inconclusive results.
- Multiple programs and portfolio-level capital decisions.

The first build should not pretend Phase 2 or Phase 3 exists. A transparent fixture-backed prototype is acceptable if its state and limitations are visible.

## 12. Validation metrics

The product is successful only if it improves decisions, not if it creates more UI or more generated text.

Initial metrics:

- Time from program review start to a reviewable decision packet.
- Percentage of recommendations with complete provenance.
- Expert agreement on the highest-value uncertainty.
- Expert agreement on the proposed experiment’s decision relevance.
- Rate of unsupported claims detected before review.
- Rate of recommendations that include falsifying criteria.
- Prospective ranking quality versus a simple cost or urgency baseline.
- Percentage of completed experiments whose outcomes update the decision record.
- Rate of decisions explicitly paused or killed before unnecessary downstream spend.

No metric should be reported as a causal improvement until there is prospective evaluation.

## 13. Failure modes and safeguards

### False certainty

**Risk:** The system converts weak evidence into a confident recommendation.  
**Safeguard:** Source spans, evidence states, uncertainty labels, and explicit missing evidence are mandatory.

### Literature synthesis without biological truth

**Risk:** A coherent narrative is mistaken for validated mechanism.  
**Safeguard:** Separate literature evidence from experimental evidence and require a falsifying experiment.

### Optimizing for cheap experiments

**Risk:** The system recommends easy but decision-irrelevant work.  
**Safeguard:** Rank by decision impact and discriminative power before cost.

### Overfitting to available assays

**Risk:** The next experiment is chosen because it is available, not because it is informative.  
**Safeguard:** Show unavailable-but-valuable experiments and the reason they were deferred.

### Confusing software activity with therapeutic progress

**Risk:** More documents, tool calls, or generated candidates are treated as progress.  
**Safeguard:** The primary unit of progress is a better-supported decision or a high-quality physical result.

### Unreviewable automation

**Risk:** Scientists cannot reconstruct why a recommendation was made.  
**Safeguard:** Preserve intermediate reasoning inputs, source links, model version, user edits, and decision history.

## 14. Product principles

1. Resolve the uncertainty before increasing the spend.
2. Make every important claim inspectable.
3. Distinguish evidence from interpretation.
4. Optimize for information gain, not activity volume.
5. Treat negative results as valuable data.
6. Keep a human accountable for the decision.
7. Prefer prospective validation over retrospective storytelling.
8. Build the proprietary data loop through useful experiments.
9. Use software revenue as a means to fund learning, not as the end state.
10. Earn the right to own therapeutic assets through better biological decisions.

## 15. Definition of done for v1

V1 is ready for a real design-partner review when a scientist can:

1. Open one program and understand the current decision in under one minute.
2. Trace the highest-value uncertainty to the evidence that caused the ranking.
3. Compare at least three experiments with explicit trade-offs.
4. Inspect the recommended experiment’s hypotheses, controls, cost, time, and falsifier.
5. Approve or reject the recommendation.
6. Record a result and see the decision state update.
7. Export a decision record that another scientist can audit without using the AI system.

The interface must pass these checks at readable desktop and mobile sizes. No implementation work should be considered complete if the product is technically functional but the uncertainty, evidence, or decision cannot be read comfortably.

## 16. Next five product actions

1. Replace the current demo vocabulary with the domain objects and state language defined here.
2. Build the token and prerequisite-component foundation using Dooping patterns and Beautiful UI implementations.
3. Create one realistic, source-labeled program dataset with competing mechanisms and a genuine evidence gap.
4. Rebuild the cockpit around the decision reading order in Section 6 at the larger type scale.
5. Run a structured review with one drug-discovery expert and record where the recommendation is scientifically unconvincing.

## 17. Open questions for the next design review

These are intentionally deferred until the core boundary is approved:

- Which initial therapeutic area will provide the first public, non-confidential program dataset?
- Should the first real workflow begin with target validation, mechanism of action, or patient stratification?
- What minimum evidence schema is required before an uncertainty can be ranked?
- Which external laboratory capabilities should be available in the first experiment marketplace?
- What is the threshold for converting a software insight into a Frontier Bio-owned program?

