"""Run the locked GSE14580 baseline models on an independent UC cohort."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

from replication_io import select_active_baseline
from run_analysis import evaluate_models, read_matrix, read_soft
from analysis import summarize_groups


def build_report(summary: dict[str, object], models: dict[str, object]) -> str:
    metrics = models["metrics"]
    baseline = metrics["majority_baseline"]
    logistic = metrics["logistic_regression"]
    tree = metrics["decision_tree_depth_2"]
    second_baseline = float(baseline["balanced_accuracy"])
    repeats_no_signal = float(logistic["balanced_accuracy"]) < 0.67 or float(logistic["balanced_accuracy"]) - second_baseline < 0.10
    if repeats_no_signal:
        repetition = "The first cohort's weak predictive result repeats: this fixed holdout does not show a reliable distinction."
    else:
        repetition = "The first cohort's weak predictive result does not repeat: this cohort shows a stronger fixed-holdout result, which still requires independent validation."
    top_probe = models["top_training_probe_effects"][0] if models["top_training_probe_effects"] else None
    top_text = (
        f"The largest training-only probe effect was {top_probe['probe_id']} (standardized difference {top_probe['standardized_difference']}); this is an observed probe-level association, not a gene, cause, target, or treatment idea."
        if top_probe
        else "No training-only probe effect was available."
    )
    return f"""# AX014 UC failure study — independent replication

## Decision

**Pause.** The dataset is usable for a locked replication benchmark, but the result is not sufficient to justify a lab experiment, target nomination, or therapeutic program.

## 1. Research question

Does the fixed GSE14580 baseline workflow distinguish UC responders from nonresponders in an independent public cohort without changing the score after seeing the result?

## 2. Dataset eligibility screen

GEO [GSE206285](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE206285) passes the pre-specified screen:

- **UC patients:** {summary['uc_sample_count']} UC samples, plus {summary['control_sample_count']} healthy controls.
- **Treatment:** randomized placebo or ustekinumab; the replication cohort is restricted to active ustekinumab.
- **Response labels:** source-provided `mucosal healing at week 8` Y/N.
- **Baseline:** all samples are `WEEK I-0` sigmoid/colon biopsies before induction treatment.
- **Independent-test size:** {summary['active_baseline_cohort']['sample_count']} labeled active-treatment samples ({summary['active_baseline_cohort']['responder_count']} responders, {summary['active_baseline_cohort']['nonresponder_count']} nonresponders), with a fixed 25% patient-level holdout.
- **Public access:** the GEO SOFT and series-matrix files are downloadable without restricted access.
- **Metadata clarity:** diagnosis, donor ID, treatment arm/dose, visit, tissue, and week-8 endpoint are present.

The source publication is [PMID 36192482](https://pubmed.ncbi.nlm.nih.gov/36192482/). The trial endpoint is not identical to GSE14580: this replication uses the source-defined week-8 mucosal-healing label because it is the closest available binary tissue-response endpoint. It is not combined with GSE14580.

## 3. Cohort and data details

- Total matrix: **{summary['matrix_samples']} samples × {summary['matrix_probes']} probes**.
- Active baseline cohort: **{summary['active_baseline_cohort']['sample_count']} patients/samples**.
- Responders: **{summary['active_baseline_cohort']['responder_count']}**.
- Nonresponders: **{summary['active_baseline_cohort']['nonresponder_count']}**.
- Treatment: **ustekinumab IV** (dose arm is retained in metadata but not modeled).
- Sample type: **colon mucosal biopsy**.
- Collection timing: **baseline / WEEK I-0**, before treatment.
- Matrix missing values: **{summary['matrix_missing_values']}**.
- Missing endpoint labels: **{summary['active_baseline_missing_response']} active ustekinumab baseline samples**; excluded before splitting. Public metadata does not provide enough detail to separate primary from secondary nonresponse, and dose is not modeled.
- Metadata/matrix ID mismatch: **none**; duplicate samples/patients: **none**.

## 4. Locked analysis

The exact GSE14580 analysis was reused: patient-level split, seed **7**, test fraction **25%**, training-only top-50 ANOVA probe selection, median imputation, standardized L2 logistic regression (`C=1`, balanced classes), depth-2 decision tree, and majority-class baseline. No tuning, label changes, dataset combination, or feature selection using the holdout was performed.

Train counts: {models['train_counts']['responder']} responders / {models['train_counts']['nonresponder']} nonresponders. Test counts: {models['test_counts']['responder']} responders / {models['test_counts']['nonresponder']} nonresponders.

## 5. Results

| Model | Balanced accuracy | Accuracy | ROC-AUC |
|---|---:|---:|---:|
| Majority baseline | {baseline['balanced_accuracy']:.3f} | {baseline['accuracy']:.3f} | {baseline['roc_auc'] if baseline['roc_auc'] is not None else 'not estimable'} |
| Locked logistic regression | {logistic['balanced_accuracy']:.3f} | {logistic['accuracy']:.3f} | {logistic['roc_auc'] if logistic['roc_auc'] is not None else 'not estimable'} |
| Locked depth-2 tree | {tree['balanced_accuracy']:.3f} | {tree['accuracy']:.3f} | {tree['roc_auc'] if tree['roc_auc'] is not None else 'not estimable'} |

## 6. Does the first pattern repeat?

GSE14580's logistic baseline was balanced accuracy **0.500** versus a **0.500** majority baseline. {repetition}

{top_text}

## 7. Lab-experiment gate

This result is **not strong enough to justify a lab experiment**. It does not establish a gene, mechanism, causal explanation, target, or treatment idea. The next action is a pre-registered independent replication with a compatible endpoint and, if possible, a truly held-out cohort—not molecule generation or perturbation work.

## 8. Reproducibility and limitations

The exact download URLs, access date, inspection output, model metrics, and command logs are stored under `research/uc_failure_study/results/`. The public series matrix contains normalized expression values; raw clinical covariates, prior-treatment history, and detailed endpoint adjudication are incomplete. The holdout is a single fixed split, so its uncertainty is large even with more samples than GSE14580. This is a research benchmark, not a clinical predictor or medical advice.
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--soft", type=Path, required=True)
    parser.add_argument("--matrix", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    records = read_soft(args.soft)
    selected = select_active_baseline(records, treatment="ustekinumab")
    matrix = read_matrix(args.matrix)
    missing_active = [record for record in records if record.disease == "UC" and record.treatment == "ustekinumab" and record.timing == "baseline" and record.response == "unknown_or_unusable"]
    summary = {
        "dataset": "GSE206285",
        "matrix_samples": int(matrix.shape[0]),
        "matrix_probes": int(matrix.shape[1]),
        "matrix_missing_values": int(matrix.isna().sum().sum()),
        "metadata_sample_count": len(records),
        "uc_sample_count": sum(record.disease == "UC" for record in records),
        "control_sample_count": sum(record.disease == "Control" for record in records),
        "baseline_count": sum(record.timing == "baseline" for record in records),
        "treatment_counts": {"ustekinumab": sum(record.treatment == "ustekinumab" for record in records), "placebo": sum(record.treatment == "placebo" for record in records), "unknown": sum(record.treatment is None for record in records)},
        "groups": summarize_groups(records),
        "active_baseline_cohort": {
            "treatment": "ustekinumab",
            "sample_count": len(selected),
            "patient_count": len({record.patient_id for record in selected}),
            "responder_count": sum(record.response == "responder" for record in selected),
            "nonresponder_count": sum(record.response == "nonresponder" for record in selected),
            "sample_types": dict(Counter(record.sample_type for record in selected)),
            "visits": dict(Counter(record.visit for record in selected)),
        },
        "active_baseline_missing_response": len(missing_active),
    }
    args.out.mkdir(parents=True, exist_ok=True)
    models = evaluate_models(matrix, selected, args.out / "probe_effects.csv")
    (args.out / "descriptive_summary.json").write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (args.out / "model_metrics.json").write_text(json.dumps(models, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    report_data = {"summary": summary, "models": models}
    (args.out / "report_data.json").write_text(json.dumps(report_data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    report_path = args.out.parent / "replication_gse206285_report.md"
    report_path.write_text(build_report(summary, models), encoding="utf-8")
    print(json.dumps(report_data, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
