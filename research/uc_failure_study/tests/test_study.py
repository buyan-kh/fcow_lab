import sys
import unittest
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC))

from study_io import parse_sample_metadata, inspect_records, patient_level_split  # noqa: E402
from analysis import summarize_groups  # noqa: E402


SOFT_SAMPLE_FIXTURE = """\
!Sample_title = UCR1_beforeT
!Sample_geo_accession = GSM1
!Sample_source_name_ch1 = Colonic mucosal biopsy from UC responder before first infliximab treatment
!Sample_characteristics_ch1 = tissue: Colon
!Sample_characteristics_ch1 = disease: UC
!Sample_characteristics_ch1 = response to infliximab: Yes
!Sample_characteristics_ch1 = before or after first infliximab treatment: Before first infliximab treatment
!Sample_title = UCNR1_beforeT
!Sample_geo_accession = GSM2
!Sample_source_name_ch1 = Colonic mucosal biopsy from UC non-responder before first infliximab treatment
!Sample_characteristics_ch1 = tissue: Colon
!Sample_characteristics_ch1 = disease: UC
!Sample_characteristics_ch1 = response to infliximab: No
!Sample_characteristics_ch1 = before or after first infliximab treatment: Before first infliximab treatment
"""


class StudyInspectionTests(unittest.TestCase):
    def test_parses_response_treatment_disease_timing_and_patient_identity(self):
        records = parse_sample_metadata(SOFT_SAMPLE_FIXTURE)
        self.assertEqual(len(records), 2)
        self.assertEqual(records[0].response, "responder")
        self.assertEqual(records[1].response, "nonresponder")
        self.assertEqual(records[0].treatment, "infliximab")
        self.assertEqual(records[0].disease, "UC")
        self.assertEqual(records[0].timing, "baseline")
        self.assertEqual(records[0].patient_id, "UCR1")

    def test_inspection_reports_duplicates_missing_and_conflicts(self):
        records = parse_sample_metadata(SOFT_SAMPLE_FIXTURE)
        report = inspect_records(records + [records[0]])
        self.assertEqual(report["duplicate_samples"], ["GSM1"])
        self.assertEqual(report["missing_response"], [])
        self.assertEqual(report["conflicting_labels"], [])

    def test_patient_level_split_keeps_related_samples_together(self):
        records = parse_sample_metadata(SOFT_SAMPLE_FIXTURE)
        train, test = patient_level_split(records, test_fraction=0.5, seed=7)
        self.assertTrue(set(train).isdisjoint(test))
        self.assertEqual(set(train) | set(test), {"UCR1", "UCNR1"})

    def test_group_summary_keeps_responder_and_nonresponder_separate(self):
        records = parse_sample_metadata(SOFT_SAMPLE_FIXTURE)
        summary = summarize_groups(records)
        self.assertEqual(summary["responder"], 1)
        self.assertEqual(summary["nonresponder"], 1)
        self.assertEqual(summary["unknown_or_unusable"], 0)


if __name__ == "__main__":
    unittest.main()
