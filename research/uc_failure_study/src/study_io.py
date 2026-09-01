"""Metadata parsing and leakage checks for the public UC response study."""

from __future__ import annotations

import random
import re
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class SampleRecord:
    sample_id: str
    title: str
    patient_id: str
    disease: str
    treatment: str | None
    response: str
    timing: str


def _value(line: str) -> str:
    value = line.split(" = ", 1)[1].strip()
    if len(value) >= 2 and value[0] == value[-1] == '"':
        return value[1:-1]
    return value


def _patient_id(title: str) -> str:
    return re.sub(r"_(?:beforeT|afterT)$", "", title)


def _record(sample: dict[str, str]) -> SampleRecord:
    source = sample.get("source_name", "").lower()
    response_raw = sample.get("response to infliximab", sample.get("response", "")).lower()
    timing_raw = sample.get("before or after first infliximab treatment", sample.get("timing", "")).lower()
    if response_raw == "yes":
        response = "responder"
    elif response_raw == "no":
        response = "nonresponder"
    else:
        response = "unknown_or_unusable"
    if "before first" in timing_raw:
        timing = "baseline"
    elif "after first" in timing_raw:
        timing = "post_treatment"
    else:
        timing = "unknown"
    treatment = "infliximab" if "infliximab" in source or "infliximab" in sample.get("treatment", "").lower() else None
    return SampleRecord(
        sample_id=sample["sample_id"],
        title=sample["title"],
        patient_id=_patient_id(sample["title"]),
        disease=sample.get("disease", "unknown"),
        treatment=treatment,
        response=response,
        timing=timing,
    )


def parse_sample_metadata(text: str) -> list[SampleRecord]:
    records: list[SampleRecord] = []
    current: dict[str, str] = {}
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line.startswith("!Sample_title = "):
            if current:
                records.append(_record(current))
            current = {"title": _value(line)}
        elif current and line.startswith("!Sample_geo_accession = "):
            current["sample_id"] = _value(line)
        elif current and line.startswith("!Sample_source_name_ch1 = "):
            current["source_name"] = _value(line)
        elif current and line.startswith("!Sample_characteristics_ch1 = "):
            characteristic = _value(line)
            if ":" in characteristic:
                key, value = characteristic.split(":", 1)
                current[key.strip().lower()] = value.strip()
    if current:
        records.append(_record(current))
    return records


def inspect_records(records: Iterable[SampleRecord]) -> dict[str, list[str]]:
    records = list(records)
    sample_ids: dict[str, int] = {}
    patient_responses: dict[str, set[str]] = {}
    for record in records:
        sample_ids[record.sample_id] = sample_ids.get(record.sample_id, 0) + 1
        patient_responses.setdefault(record.patient_id, set()).add(record.response)
    duplicate_samples = sorted(sample_id for sample_id, count in sample_ids.items() if count > 1)
    missing_response = sorted({record.sample_id for record in records if record.response == "unknown_or_unusable"})
    missing_treatment = sorted({record.sample_id for record in records if record.treatment is None and record.disease == "UC"})
    conflicting_labels = sorted(patient_id for patient_id, labels in patient_responses.items() if len(labels - {"unknown_or_unusable"}) > 1)
    impossible_dates: list[str] = []
    duplicate_patients = sorted(patient_id for patient_id, count in ((pid, sum(r.patient_id == pid for r in records)) for pid in {r.patient_id for r in records}) if count > 1)
    return {
        "duplicate_samples": duplicate_samples,
        "duplicate_patients": duplicate_patients,
        "missing_response": missing_response,
        "missing_treatment": missing_treatment,
        "conflicting_labels": conflicting_labels,
        "date_fields_available": False,
        "impossible_dates": impossible_dates,
        "replicate_information_available": False,
    }


def patient_level_split(records: Iterable[SampleRecord], test_fraction: float = 0.2, seed: int = 7) -> tuple[list[str], list[str]]:
    patient_ids = sorted({record.patient_id for record in records})
    shuffled = patient_ids[:]
    random.Random(seed).shuffle(shuffled)
    test_count = max(1, round(len(shuffled) * test_fraction)) if shuffled else 0
    return shuffled[test_count:], shuffled[:test_count]
