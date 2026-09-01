# AX014 UC failure study

## Purpose

This is one reproducible public-data study for the question: **why do some people with ulcerative colitis fail existing treatments?** The first dataset is GEO GSE14580, a pre-treatment colonic mucosal expression cohort labeled by response to infliximab.

This repository contains analysis code and reports only. It does not build a website, agent swarm, molecule generator, patient-facing product, or clinical recommendation. It uses no personal medical data and no confidential Genentech or UCSF data.

## Source data

Download the two required GEO files into `results/source_data/`:

```bash
mkdir -p research/uc_failure_study/results/source_data
curl -L --fail --silent --show-error https://ftp.ncbi.nlm.nih.gov/geo/series/GSE14nnn/GSE14580/soft/GSE14580_family.soft.gz -o research/uc_failure_study/results/source_data/GSE14580_family.soft.gz
curl -L --fail --silent --show-error https://ftp.ncbi.nlm.nih.gov/geo/series/GSE14nnn/GSE14580/matrix/GSE14580_series_matrix.txt.gz -o research/uc_failure_study/results/source_data/GSE14580_series_matrix.txt.gz
```

The exact URLs, publication, access date, cohort counts, and limitations are in `sources.csv` and `data_notes.md`.

## Reproduce inspection

```bash
python3 research/uc_failure_study/src/inspect_dataset.py \
  --soft research/uc_failure_study/results/source_data/GSE14580_family.soft.gz \
  --matrix research/uc_failure_study/results/source_data/GSE14580_series_matrix.txt.gz \
  --out research/uc_failure_study/results/inspection.json \
  | tee research/uc_failure_study/results/logs/inspection.txt
```

Expected key findings: 30 samples, 24 UC baseline samples, 8 responders, 16 nonresponders, 6 controls, 54,675 probes, zero matrix missing values, and zero metadata/matrix ID mismatches.

## Reproduce tests

```bash
uv run --with numpy==2.4.6 --with pandas==3.0.5 --with scipy==1.17.1 --with scikit-learn==1.9.0 \
  python3 -m unittest discover -s research/uc_failure_study/tests -v
```

## Reproduce analysis

The analysis uses Python 3.14 with pinned scientific packages supplied through uv:

```bash
uv run --with numpy==2.4.6 --with pandas==3.0.5 --with scipy==1.17.1 --with scikit-learn==1.9.0 \
  python research/uc_failure_study/src/run_analysis.py \
  --soft research/uc_failure_study/results/source_data/GSE14580_family.soft.gz \
  --matrix research/uc_failure_study/results/source_data/GSE14580_series_matrix.txt.gz \
  --out research/uc_failure_study/results \
  | tee research/uc_failure_study/results/logs/analysis.txt
```

The exact split, metrics, baseline, model settings, and interpretation rules are in `analysis_plan.md`. Results are written only after the script runs.

## Outputs

- `results/inspection.json` — machine-readable inspection findings.
- `results/descriptive_summary.json` — group counts and missingness.
- `results/probe_effects.csv` — exploratory probe-level effect sizes.
- `results/model_metrics.json` — fixed-split baseline, logistic, and tree metrics.
- `results/report_data.json` — report inputs and labels.
- `report.md` — final study report, generated after analysis.

## Interpretation boundary

An observed expression pattern is not a mechanism. A model score is not a target, drug, diagnosis, or treatment recommendation. If the fixed holdout result is weak or unstable, the report will say so. Independent replication is required before AX014 spends on a biological experiment.
