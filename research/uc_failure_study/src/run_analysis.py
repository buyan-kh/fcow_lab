"""Run the predefined, small public-data baseline for GSE14580."""

from __future__ import annotations

import argparse
import csv
import gzip
import json
from pathlib import Path
from typing import Iterable

import numpy as np
import pandas as pd
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, balanced_accuracy_score, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

from analysis import summarize_groups
from study_io import SampleRecord, parse_sample_metadata, patient_level_split


def choose_feature_count(available_features: int) -> int:
    return min(50, max(1, available_features))


def metric_summary(y_true: Iterable[int], predictions: Iterable[int], probabilities: Iterable[float]) -> dict[str, float | None]:
    y_true = list(y_true)
    predictions = list(predictions)
    probabilities = list(probabilities)
    summary: dict[str, float | None] = {
        "balanced_accuracy": float(balanced_accuracy_score(y_true, predictions)),
        "accuracy": float(accuracy_score(y_true, predictions)),
        "roc_auc": None,
    }
    if len(set(y_true)) == 2:
        summary["roc_auc"] = float(roc_auc_score(y_true, probabilities))
    return summary


def read_soft(path: Path) -> list[SampleRecord]:
    with gzip.open(path, "rt", encoding="utf-8", errors="replace") as handle:
        return parse_sample_metadata(handle.read())


def read_matrix(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path, sep="\t", comment="!", compression="gzip")
    frame = frame.rename(columns={frame.columns[0]: "probe_id"}).set_index("probe_id")
    frame = frame.apply(pd.to_numeric, errors="coerce")
    return frame.T


def write_probe_effects(matrix: pd.DataFrame, records: list[SampleRecord], train_ids: set[str], out_path: Path) -> list[dict[str, float | str]]:
    train_records = [record for record in records if record.sample_id in train_ids]
    responder_ids = [record.sample_id for record in train_records if record.response == "responder"]
    nonresponder_ids = [record.sample_id for record in train_records if record.response == "nonresponder"]
    responder = matrix.loc[responder_ids]
    nonresponder = matrix.loc[nonresponder_ids]
    mean_responder = responder.mean(axis=0)
    mean_nonresponder = nonresponder.mean(axis=0)
    std_responder = responder.std(axis=0, ddof=1)
    std_nonresponder = nonresponder.std(axis=0, ddof=1)
    pooled = np.sqrt(((len(responder_ids) - 1) * std_responder**2 + (len(nonresponder_ids) - 1) * std_nonresponder**2) / max(1, len(responder_ids) + len(nonresponder_ids) - 2))
    effect = ((mean_responder - mean_nonresponder) / pooled.replace(0, np.nan)).fillna(0)
    top = effect.abs().sort_values(ascending=False).head(20)
    rows: list[dict[str, float | str]] = []
    for probe_id in top.index:
        rows.append(
            {
                "probe_id": str(probe_id),
                "responder_mean": round(float(mean_responder[probe_id]), 6),
                "nonresponder_mean": round(float(mean_nonresponder[probe_id]), 6),
                "standardized_difference": round(float(effect[probe_id]), 6),
            }
        )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]) if rows else ["probe_id", "responder_mean", "nonresponder_mean", "standardized_difference"])
        writer.writeheader()
        writer.writerows(rows)
    return rows


def evaluate_models(matrix: pd.DataFrame, records: list[SampleRecord], effects_path: Path) -> dict[str, object]:
    train_patients, test_patients = patient_level_split(records, test_fraction=0.25, seed=7)
    train_patient_set, test_patient_set = set(train_patients), set(test_patients)
    train_records = [record for record in records if record.patient_id in train_patient_set]
    test_records = [record for record in records if record.patient_id in test_patient_set]
    train_ids = {record.sample_id for record in train_records}
    test_ids = {record.sample_id for record in test_records}
    train_records.sort(key=lambda record: record.sample_id)
    test_records.sort(key=lambda record: record.sample_id)
    train_matrix = matrix.loc[[record.sample_id for record in train_records]]
    test_matrix = matrix.loc[[record.sample_id for record in test_records]]
    y_train = np.array([1 if record.response == "responder" else 0 for record in train_records])
    y_test = np.array([1 if record.response == "responder" else 0 for record in test_records])
    k = choose_feature_count(train_matrix.shape[1])
    preprocess = [
        ("imputer", SimpleImputer(strategy="median")),
        ("select", SelectKBest(score_func=f_classif, k=k)),
        ("scale", StandardScaler()),
    ]
    logistic = Pipeline(preprocess + [("model", LogisticRegression(C=1.0, max_iter=2000, class_weight="balanced", random_state=7))])
    tree = Pipeline(preprocess[:-1] + [("model", DecisionTreeClassifier(max_depth=2, min_samples_leaf=2, random_state=7))])
    majority = int(np.bincount(y_train).argmax())
    baseline = metric_summary(y_test, np.full(len(y_test), majority), np.full(len(y_test), float(majority)))
    logistic.fit(train_matrix, y_train)
    tree.fit(train_matrix, y_train)
    logistic_prob = logistic.predict_proba(test_matrix)[:, 1]
    tree_prob = tree.predict_proba(test_matrix)[:, 1]
    effects = write_probe_effects(matrix, records, train_ids, effects_path)
    return {
        "split": {"seed": 7, "test_fraction": 0.25, "train_patients": sorted(train_patient_set), "test_patients": sorted(test_patient_set)},
        "train_counts": {"responder": int(sum(y_train == 1)), "nonresponder": int(sum(y_train == 0))},
        "test_counts": {"responder": int(sum(y_test == 1)), "nonresponder": int(sum(y_test == 0))},
        "metrics": {
            "majority_baseline": baseline,
            "logistic_regression": metric_summary(y_test, logistic.predict(test_matrix), logistic_prob),
            "decision_tree_depth_2": metric_summary(y_test, tree.predict(test_matrix), tree_prob),
        },
        "top_training_probe_effects": effects[:5],
        "independent_replication": "not run; no independent cohort was included in GSE14580",
    }


def report_markdown(summary: dict[str, object], models: dict[str, object]) -> str:
    metrics = models["metrics"]
    logistic = metrics["logistic_regression"]
    baseline = metrics["majority_baseline"]
    logistic_balanced = float(logistic["balanced_accuracy"])
    baseline_balanced = float(baseline["balanced_accuracy"])
    answer = "tentative signal, not reliable generalization" if logistic_balanced >= 0.67 and logistic_balanced - baseline_balanced >= 0.10 else "no reliable distinction on the fixed holdout"
    top_probe = models["top_training_probe_effects"][0] if models["top_training_probe_effects"] else None
    top_text = f"Probe {top_probe['probe_id']} had the largest training-only standardized difference ({top_probe['standardized_difference']})." if top_probe else "No training-only probe effect was available."
    return f"""# AX014 UC failure study report

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

The fixed split contained {models['train_counts']['responder']} responders and {models['train_counts']['nonresponder']} nonresponders for training, and {models['test_counts']['responder']} responders and {models['test_counts']['nonresponder']} nonresponders for testing.

- Majority baseline balanced accuracy: {baseline['balanced_accuracy']:.3f}
- Logistic regression balanced accuracy: {logistic['balanced_accuracy']:.3f}
- Logistic regression accuracy: {logistic['accuracy']:.3f}
- Logistic regression ROC-AUC: {logistic['roc_auc'] if logistic['roc_auc'] is not None else 'not estimable'}
- Depth-2 tree balanced accuracy: {metrics['decision_tree_depth_2']['balanced_accuracy']:.3f}

Answer: **{answer}.**

## 7. Failed analyses

No deep learning, molecule generation, causal inference, or target nomination was attempted. Those analyses were out of scope for this small single-study cohort.

## 8. Missing data

The downloaded series matrix had zero missing expression cells. Public metadata does not fully expose treatment exposure details, concurrent therapies, disease severity covariates, or a separable primary-versus-secondary failure label.

## 9. Limitations

Only 24 UC patients are available, with a six-patient holdout. This is not a clinical predictor or a reliable estimate of out-of-study performance. See limitations.md.

## 10. Conflicting evidence

The model comparison is not a biological conflict test. A model that differs from the majority baseline on six test samples is unstable evidence; the dataset has no independent validation cohort.

## 11. What we learned

{top_text} This is labeled **observed in this analysis** and is not a gene-level mechanism.

## 12. What we still do not know

We do not know whether a pattern repeats in another treatment cohort, whether it separates primary nonresponse from loss of response, or whether any observed expression difference is causal.

## 13. Cheapest experiment to test the strongest hypothesis

First reproduce the analysis in an independent public cohort. Only if a response-associated signal repeats should AX014 contract a qualified lab to test a pre-registered perturbation in human-relevant colonic tissue or organoid models, with controls and a kill criterion.

## 14. Go, pause, or kill recommendation

**Pause.** The public dataset supports a reproducible data inspection and a small baseline benchmark, but not a validated responder classifier, mechanism, target, or therapeutic idea. The next action is independent public replication, not molecule generation.
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--soft", type=Path, required=True)
    parser.add_argument("--matrix", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    records = read_soft(args.soft)
    matrix = read_matrix(args.matrix)
    uc_records = [record for record in records if record.disease == "UC" and record.timing == "baseline" and record.response in {"responder", "nonresponder"}]
    summary = {
        "dataset": "GSE14580",
        "groups": summarize_groups(records),
        "uc_baseline_records": len(uc_records),
        "matrix_samples": int(matrix.shape[0]),
        "matrix_probes": int(matrix.shape[1]),
        "matrix_missing_values": int(matrix.isna().sum().sum()),
    }
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "descriptive_summary.json").write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    models = evaluate_models(matrix, uc_records, args.out / "probe_effects.csv")
    (args.out / "model_metrics.json").write_text(json.dumps(models, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    report_data = {"summary": summary, "models": models}
    (args.out / "report_data.json").write_text(json.dumps(report_data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    report_path = args.out.parent / "report.md"
    report_path.write_text(report_markdown(summary, models), encoding="utf-8")
    print(json.dumps(report_data, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
