# Analysis plan

## Dataset and unit of analysis

Use GSE14580 baseline UC samples only. The unit is one patient with one pre-treatment colonic mucosal biopsy. Controls are excluded from supervised responder/nonresponder models and retained only in the descriptive inventory. No related samples may cross a split; the split key is patient ID.

## Predefined groups

- Responder: source label “response to infliximab: Yes”.
- Nonresponder: source label “response to infliximab: No”.
- Primary nonresponse and loss of response: not separately identifiable in GSE14580; report as unknown rather than combine them.
- Unknown or unusable: controls, missing/ambiguous labels, missing treatment, or non-baseline samples.

## Order of operations

1. Inspect metadata, matrix dimensions, missingness, duplicates, and sample-ID alignment.
2. Describe group counts, treatment, disease, sample type, timing, and measurement platform.
3. Report expression missingness and sample-level distribution checks.
4. Run an exploratory effect-size table for probes using the training partition only.
5. Fit the predefined statistical baseline and logistic regression inside a pipeline that performs feature selection only on the training partition.
6. Fit one shallow decision tree only as a secondary comparator; do not tune it.
7. Report results on one fixed, stratified, patient-level holdout split.

## Split and metrics

Use `train_test_split(test_size=0.25, stratify=response, random_state=7)` over patient IDs. The split is fixed before model fitting and is never tuned against. The primary metric is balanced accuracy because the responder classes are imbalanced (8 versus 16). Also report accuracy and ROC-AUC when both test classes are present. The majority-class baseline is computed on the same test split.

The logistic regression pipeline is: median imputation, variance filtering, top-50 ANOVA feature selection fit on training data only, standardization, and L2 logistic regression with `C=1.0` and `max_iter=2000`. The tree comparator is a `DecisionTreeClassifier(max_depth=2, min_samples_leaf=2, random_state=7)` with the same training-only feature selection. No hyperparameter search is performed.

## Interpretation rules

Any pattern is labeled `observed in this analysis`. It is not called a mechanism, biomarker, target, or treatment recommendation. A negative or unstable test result is a valid result. An independent dataset is required before claiming reproducibility; GSE14580 alone cannot establish that.
