"""Cohort selection rules for the independent public-data replication."""

from __future__ import annotations

from collections.abc import Iterable

from study_io import SampleRecord


def select_active_baseline(records: Iterable[SampleRecord], treatment: str) -> list[SampleRecord]:
    """Select source-labeled active-treatment baseline samples without relabeling."""

    return [
        record
        for record in records
        if record.disease == "UC"
        and record.treatment == treatment
        and record.timing == "baseline"
        and record.response in {"responder", "nonresponder"}
    ]
