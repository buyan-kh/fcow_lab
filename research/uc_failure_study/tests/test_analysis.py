import sys
import unittest
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC))

from run_analysis import choose_feature_count, metric_summary  # noqa: E402


class AnalysisContractTests(unittest.TestCase):
    def test_feature_count_never_exceeds_available_features(self):
        self.assertEqual(choose_feature_count(3), 3)
        self.assertEqual(choose_feature_count(100), 50)

    def test_metric_summary_reports_balanced_accuracy_and_accuracy(self):
        result = metric_summary([0, 1, 1, 0], [0, 1, 0, 0], [0.2, 0.8, 0.4, 0.1])
        self.assertIn("balanced_accuracy", result)
        self.assertIn("accuracy", result)
        self.assertIn("roc_auc", result)
        self.assertAlmostEqual(result["accuracy"], 0.75)


if __name__ == "__main__":
    unittest.main()
