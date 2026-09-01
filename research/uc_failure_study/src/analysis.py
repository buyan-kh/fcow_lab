"""Small, auditable descriptive analysis helpers for UC response labels."""

from collections import Counter
from typing import Iterable

from study_io import SampleRecord


def summarize_groups(records: Iterable[SampleRecord]) -> dict[str, int]:
    counts = Counter(record.response for record in records)
    return {
        "responder": counts.get("responder", 0),
        "nonresponder": counts.get("nonresponder", 0),
        "unknown_or_unusable": counts.get("unknown_or_unusable", 0),
    }
