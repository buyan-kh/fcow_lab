"""Inspect a GEO SOFT + series-matrix download without modifying source data."""

from __future__ import annotations

import argparse
import gzip
import json
from pathlib import Path

from study_io import inspect_records, parse_sample_metadata


def read_text(path: Path) -> str:
    with gzip.open(path, "rt", encoding="utf-8", errors="replace") as handle:
        return handle.read()


def matrix_summary(path: Path) -> dict[str, object]:
    sample_ids: list[str] = []
    probe_count = 0
    missing_values = 0
    in_table = False
    with gzip.open(path, "rt", encoding="utf-8", errors="replace") as handle:
        for raw_line in handle:
            line = raw_line.rstrip("\n")
            if line.startswith("!series_matrix_table_begin"):
                in_table = True
                continue
            if line.startswith("!series_matrix_table_end"):
                break
            if not in_table:
                continue
            fields = line.split("\t")
            if not sample_ids:
                sample_ids = [field.strip('"') for field in fields[1:]]
                continue
            if len(fields) < 2:
                continue
            probe_count += 1
            missing_values += sum(1 for value in fields[1:] if value.strip() in {"", "NA", "null"})
    return {
        "sample_ids": sample_ids,
        "sample_count": len(sample_ids),
        "probe_count": probe_count,
        "missing_matrix_values": missing_values,
        "duplicate_matrix_samples": sorted({sample_id for sample_id in sample_ids if sample_ids.count(sample_id) > 1}),
    }


def inspect(soft_path: Path, matrix_path: Path) -> dict[str, object]:
    records = parse_sample_metadata(read_text(soft_path))
    summary = inspect_records(records)
    matrix = matrix_summary(matrix_path)
    metadata_ids = {record.sample_id for record in records}
    matrix_ids = set(matrix["sample_ids"])
    summary.update(
        {
            "dataset": "GSE14580",
            "metadata_sample_count": len(records),
            "uc_sample_count": sum(record.disease == "UC" for record in records),
            "control_sample_count": sum(record.disease == "Control" for record in records),
            "responder_count": sum(record.response == "responder" for record in records),
            "nonresponder_count": sum(record.response == "nonresponder" for record in records),
            "baseline_count": sum(record.timing == "baseline" for record in records),
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
