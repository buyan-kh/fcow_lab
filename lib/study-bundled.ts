import summary from '../research/uc_failure_study/results/descriptive_summary.json';
import metricsJson from '../research/uc_failure_study/results/model_metrics.json';
import replicationSummary from '../research/uc_failure_study/results/replication_gse206285/descriptive_summary.json';
import replicationMetrics from '../research/uc_failure_study/results/replication_gse206285/model_metrics.json';
import questionText from '../research/uc_failure_study/question.md?raw';
import report from '../research/uc_failure_study/report.md?raw';
import sourcesText from '../research/uc_failure_study/sources.csv?raw';
import { buildStudySnapshot } from './study-shared';

export const bundledStudySnapshot = buildStudySnapshot({
  questionText,
  sourcesText,
  summary,
  metricsJson,
  replicationSummary,
  replicationMetrics,
  report,
});
