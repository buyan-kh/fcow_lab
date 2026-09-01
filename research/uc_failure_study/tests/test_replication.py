import sys
import unittest
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC))

from study_io import parse_sample_metadata  # noqa: E402
from replication_io import select_active_baseline  # noqa: E402


GSE92415_SAMPLE_FIXTURE = """\
!Sample_title = T17p1_A8
!Sample_geo_accession = GSM9241
!Sample_source_name_ch1 = tissue biopsy
!Sample_characteristics_ch1 = tissue: colon mucosa
!Sample_characteristics_ch1 = subject: 6402-00008
!Sample_characteristics_ch1 = disease: Ulcerative Colitis (UC)
!Sample_characteristics_ch1 = treatment: golimumab
!Sample_characteristics_ch1 = visit: Week 0
!Sample_characteristics_ch1 = wk6response: Yes
!Sample_title = T17p2_F4
!Sample_geo_accession = GSM9242
!Sample_source_name_ch1 = tissue biopsy
!Sample_characteristics_ch1 = tissue: colon mucosa
!Sample_characteristics_ch1 = subject: 7783-00005
!Sample_characteristics_ch1 = disease: Ulcerative Colitis (UC)
!Sample_characteristics_ch1 = treatment: golimumab
!Sample_characteristics_ch1 = visit: Week 0
!Sample_characteristics_ch1 = wk6response: No
"""

GSE206285_SAMPLE_FIXTURE = """\
!Sample_title = CNTO1275UCO3001-100001 colon biopsy week 0
!Sample_geo_accession = GSM2062
!Sample_characteristics_ch1 = tissue: colon
!Sample_characteristics_ch1 = donor id: CNTO1275UCO3001-100001
!Sample_characteristics_ch1 = visit: WEEK I-0
!Sample_characteristics_ch1 = diagnosis: ulcerative colitis
!Sample_characteristics_ch1 = treatment: Ustekinumab 130 mg IV
!Sample_characteristics_ch1 = mucosal healing at week 8: Y
!Sample_characteristics_ch1 = clinical remission at week 8: N
"""


class ReplicationMetadataTests(unittest.TestCase):
    def test_parses_gse92415_response_treatment_baseline_and_patient(self):
        records = parse_sample_metadata(GSE92415_SAMPLE_FIXTURE)
        self.assertEqual(len(records), 2)
        self.assertEqual(records[0].disease, "UC")
        self.assertEqual(records[0].treatment, "golimumab")
        self.assertEqual(records[0].response, "responder")
        self.assertEqual(records[0].timing, "baseline")
        self.assertEqual(records[0].patient_id, "6402-00008")
        self.assertEqual(records[0].sample_type, "colon mucosa")

    def test_week_six_is_not_included_as_baseline(self):
        fixture = GSE92415_SAMPLE_FIXTURE.replace("visit: Week 0", "visit: Week 6")
        records = parse_sample_metadata(fixture)
        self.assertTrue(all(record.timing == "post_treatment" for record in records))

    def test_parses_gse206285_ustekinumab_mucosal_healing_label(self):
        records = parse_sample_metadata(GSE206285_SAMPLE_FIXTURE)
        self.assertEqual(records[0].disease, "UC")
        self.assertEqual(records[0].treatment, "ustekinumab")
        self.assertEqual(records[0].response, "responder")
        self.assertEqual(records[0].timing, "baseline")
        self.assertEqual(records[0].patient_id, "CNTO1275UCO3001-100001")
        self.assertEqual(records[0].sample_type, "colon")

    def test_normalizes_healthy_control_diagnosis(self):
        fixture = GSE206285_SAMPLE_FIXTURE.replace("diagnosis: ulcerative colitis", "diagnosis: healthy control")
        self.assertEqual(parse_sample_metadata(fixture)[0].disease, "Control")

    def test_active_baseline_filter_excludes_placebo_post_treatment_and_unknown(self):
        records = parse_sample_metadata(GSE206285_SAMPLE_FIXTURE)
        placebo = parse_sample_metadata(GSE206285_SAMPLE_FIXTURE.replace("Ustekinumab 130 mg IV", "Placebo IV"))
        post = parse_sample_metadata(GSE206285_SAMPLE_FIXTURE.replace("WEEK I-0", "WEEK I-6"))
        unknown = parse_sample_metadata(GSE206285_SAMPLE_FIXTURE.replace("mucosal healing at week 8: Y", "mucosal healing at week 8: NA"))
        selected = select_active_baseline(records + placebo + post + unknown, treatment="ustekinumab")
        self.assertEqual([record.sample_id for record in selected], [records[0].sample_id])


if __name__ == "__main__":
    unittest.main()
