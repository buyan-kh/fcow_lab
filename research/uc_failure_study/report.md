# AX014 UC failure study report

## 1. Research question

Can public data distinguish ulcerative colitis treatment responders from nonresponders on new patients or samples without leakage?

## 2. Data source

GEO [GSE14580](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE14580): pre-treatment colonic mucosal expression from 24 active UC patients treated with infliximab, with 8 responders and 16 nonresponders, plus 6 controls. The associated publication is [PMID 19700435](https://pubmed.ncbi.nlm.nih.gov/19700435/).

## 3. Data access conditions

The data are publicly downloadable from NCBI GEO. No personal data was uploaded, transmitted, or linked to external records. The exact URLs and access date are recorded in sources.csv.

## 4. Group definitions

Responder and nonresponder use the source-defined infliximab response label. Primary nonresponse versus loss of response cannot be separated from this accession and is reported as unknown.

## 5. Analysis methods

One fixed patient-level holdout split (random seed 7, 25% test fraction) was created before fitting. Primary metric: balanced accuracy. Secondary metrics: accuracy and ROC-AUC. Models: majority-class baseline, training-only feature selection plus L2 logistic regression, and one depth-2 decision tree. No hyperparameter tuning was performed.

## 6. Results

The fixed split contained 6 responders and 12 nonresponders for training, and 2 responders and 4 nonresponders for testing.

- Majority baseline balanced accuracy: 0.500
- Logistic regression balanced accuracy: 0.500
- Logistic regression accuracy: 0.667
- Logistic regression ROC-AUC: 0.625
- Depth-2 tree balanced accuracy: 0.625

Answer: **no reliable distinction on the fixed holdout.**

## 7. Failed analyses

No deep learning, molecule generation, causal inference, or target nomination was attempted. Those analyses were out of scope for this small single-study cohort.

## 8. Missing data

The downloaded series matrix had zero missing expression cells. Public metadata does not fully expose treatment exposure details, concurrent therapies, disease severity covariates, or a separable primary-versus-secondary failure label.

## 9. Limitations

Only 24 UC patients are available, with a six-patient holdout. This is not a clinical predictor or a reliable estimate of out-of-study performance. See limitations.md.

## 10. Conflicting evidence

The model comparison is not a biological conflict test. A model that differs from the majority baseline on six test samples is unstable evidence; the dataset has no independent validation cohort.

## 11. What we learned

Probe 220353_at had the largest training-only standardized difference (3.16584). This is labeled **observed in this analysis** and is not a gene-level mechanism.

## 12. What we still do not know

We do not know whether a pattern repeats in another treatment cohort, whether it separates primary nonresponse from loss of response, or whether any observed expression difference is causal.

## 13. Cheapest experiment to test the strongest hypothesis

First reproduce the analysis in an independent public cohort. Only if a response-associated signal repeats should AX014 contract a qualified lab to test a pre-registered perturbation in human-relevant colonic tissue or organoid models, with controls and a kill criterion.

## 14. Go, pause, or kill recommendation

**Pause.** The public dataset supports a reproducible data inspection and a small baseline benchmark, but not a validated responder classifier, mechanism, target, or therapeutic idea. The next action is independent public replication, not molecule generation.
