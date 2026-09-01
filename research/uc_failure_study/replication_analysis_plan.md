# Independent replication analysis plan

## Eligibility decision

Use an independent public UC cohort only if it has UC samples, explicit treatment assignment, a source-defined binary response/nonresponse endpoint, pre-treatment samples, enough labeled patients for a holdout, public access, and clear sample metadata.

GSE206285 passes this screen. The active treatment arm is ustekinumab. The endpoint is fixed before modeling as the source-provided `mucosal healing at week 8` Y/N label because it is the closest tissue-healing endpoint available to GSE14580's source-defined endoscopic/histologic healing response. This endpoint difference is recorded and prevents dataset concatenation.

## Cohort definition

Include only records with diagnosis `ulcerative colitis`, treatment `ustekinumab`, visit `WEEK I-0`, and non-missing mucosal-healing label. Exclude placebo, healthy controls, post-treatment samples, and missing labels without relabeling. The unit is one donor/patient baseline colon biopsy.

## Locked model procedure

Reuse the GSE14580 procedure exactly: shuffle sorted patient IDs with seed 7; assign `round(0.25 * n)` patients to test; keep all samples from each patient together; compute majority baseline; fit median imputation, top-50 ANOVA probe selection on training only, standardized L2 logistic regression (`C=1`, balanced classes), and an untuned depth-2 decision tree. Report balanced accuracy, accuracy, and ROC-AUC. Do not tune, combine datasets, alter the score, or inspect holdout labels for feature selection.

## Interpretation gate

Use the same conservative threshold as the first report: logistic balanced accuracy must be at least 0.67 and improve over the majority baseline by at least 0.10 to be called a tentative signal. Otherwise report no reliable distinction. Neither outcome establishes a gene, mechanism, target, or treatment idea.
