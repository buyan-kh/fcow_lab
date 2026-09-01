# AX014 UC failure study — independent replication

## Decision

**Pause.** The dataset is usable for a locked replication benchmark, but the result is not sufficient to justify a lab experiment, target nomination, or therapeutic program.

## 1. Research question

Does the fixed GSE14580 baseline workflow distinguish UC responders from nonresponders in an independent public cohort without changing the score after seeing the result?

## 2. Dataset eligibility screen

GEO [GSE206285](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE206285) passes the pre-specified screen:

- **UC patients:** 550 UC samples, plus 18 healthy controls.
- **Treatment:** randomized placebo or ustekinumab; the replication cohort is restricted to active ustekinumab.
- **Response labels:** source-provided `mucosal healing at week 8` Y/N.
- **Baseline:** all samples are `WEEK I-0` sigmoid/colon biopsies before induction treatment.
- **Independent-test size:** 358 labeled active-treatment samples (56 responders, 302 nonresponders), with a fixed 25% patient-level holdout.
- **Public access:** the GEO SOFT and series-matrix files are downloadable without restricted access.
- **Metadata clarity:** diagnosis, donor ID, treatment arm/dose, visit, tissue, and week-8 endpoint are present.

The source publication is [PMID 36192482](https://pubmed.ncbi.nlm.nih.gov/36192482/). The trial endpoint is not identical to GSE14580: this replication uses the source-defined week-8 mucosal-healing label because it is the closest available binary tissue-response endpoint. It is not combined with GSE14580.

## 3. Cohort and data details

- Total matrix: **568 samples × 54715 probes**.
- Active baseline cohort: **358 patients/samples**.
- Responders: **56**.
- Nonresponders: **302**.
- Treatment: **ustekinumab IV** (dose arm is retained in metadata but not modeled).
- Sample type: **colon mucosal biopsy**.
- Collection timing: **baseline / WEEK I-0**, before treatment.
- Matrix missing values: **0**.
- Missing endpoint labels: **6 active ustekinumab baseline samples**; excluded before splitting. Public metadata does not provide enough detail to separate primary from secondary nonresponse, and dose is not modeled.
- Metadata/matrix ID mismatch: **none**; duplicate samples/patients: **none**.

## 4. Locked analysis

The exact GSE14580 analysis was reused: patient-level split, seed **7**, test fraction **25%**, training-only top-50 ANOVA probe selection, median imputation, standardized L2 logistic regression (`C=1`, balanced classes), depth-2 decision tree, and majority-class baseline. No tuning, label changes, dataset combination, or feature selection using the holdout was performed.

Train counts: 39 responders / 229 nonresponders. Test counts: 17 responders / 73 nonresponders.

## 5. Results

| Model | Balanced accuracy | Accuracy | ROC-AUC |
|---|---:|---:|---:|
| Majority baseline | 0.500 | 0.811 | 0.5 |
| Locked logistic regression | 0.614 | 0.667 | 0.7163577759871073 |
| Locked depth-2 tree | 0.559 | 0.833 | 0.660757453666398 |

## 6. Does the first pattern repeat?

GSE14580's logistic baseline was balanced accuracy **0.500** versus a **0.500** majority baseline. The first cohort's weak predictive result repeats: this fixed holdout does not show a reliable distinction.

The largest training-only probe effect was 202830_PM_s_at (standardized difference 0.921682); this is an observed probe-level association, not a gene, cause, target, or treatment idea.

## 7. Lab-experiment gate

This result is **not strong enough to justify a lab experiment**. It does not establish a gene, mechanism, causal explanation, target, or treatment idea. The next action is a pre-registered independent replication with a compatible endpoint and, if possible, a truly held-out cohort—not molecule generation or perturbation work.

## 8. Reproducibility and limitations

The exact download URLs, access date, inspection output, model metrics, and command logs are stored under `research/uc_failure_study/results/`. The public series matrix contains normalized expression values; raw clinical covariates, prior-treatment history, and detailed endpoint adjudication are incomplete. The holdout is a single fixed split, so its uncertainty is large even with more samples than GSE14580. This is a research benchmark, not a clinical predictor or medical advice.
