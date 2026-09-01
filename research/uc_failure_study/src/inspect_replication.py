"""Inspect the independent GEO replication cohort and its eligibility criteria."""

from __future__ import annotations

import argparse
import gzip
import json
from collections import Counter
from pathlib import Path

from inspect_dataset import matrix_summary
from replication_io import select_active_baseline
from study_io import inspect_records, parse_sample_metadata


def read_soft(path: Path):
    with gzip.open(path, "rt", encoding="utf-8", errors="replace") as handle:
        return parse_sample_metadata(handle.read())


def inspect(soft_path: Path, matrix_path: Path) -> dict[str, object]:
    records = read_soft(soft_path)
    active = select_active_baseline(records, treatment="ustekinumab")
    matrix = matrix_summary(matrix_path)
    metadata_ids = {record.sample_id for record in records}
    matrix_ids = set(matrix["sample_ids"])
    summary = inspect_records(records)
    summary.update(
        {
            "dataset": "GSE206285",
            "metadata_sample_count": len(records),
            "uc_sample_count": sum(record.disease == "UC" for record in records),
            "control_sample_count": sum(record.disease == "Control" for record in records),
            "responder_count_all_samples": sum(record.response == "responder" for record in records),
            "nonresponder_count_all_samples": sum(record.response == "nonresponder" for record in records),
            "baseline_count": sum(record.timing == "baseline" for record in records),
            "treatment_counts": {
                "unknown" if treatment is None else treatment: count
                for treatment, count in Counter(record.treatment for record in records).items()
            },
            "active_baseline_cohort": {
                "treatment": "ustekinumab",
                "sample_count": len(active),
                "patient_count": len({record.patient_id for record in active}),
                "responder_count": sum(record.response == "responder" for record in active),
                "nonresponder_count": sum(record.response == "nonresponder" for record in active),
                "sample_types": dict(Counter(record.sample_type for record in active)),
                "visits": dict(Counter(record.visit for record in active)),
            },
            "matrix_metadata_id_mismatch": {
                "metadata_not_in_matrix": sorted(metadata_ids - matrix_ids),
                "matrix_not_in_metadata": sorted(matrix_ids - metadata_ids),
            },
            "matrix": matrix,
        }
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--soft", type=Path, required=True)
    parser.add_argument("--matrix", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    result = inspect(args.soft, args.matrix)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
