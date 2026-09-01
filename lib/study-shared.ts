export type StudyStatus = 'completed' | 'not-run' | 'failed';
export type MetricValue = { balancedAccuracy: number | null; accuracy: number | null; rocAuc: number | null };
export type StudyHistoryEntry = { experiment: string; date: string; dataset: string; method: string; metric: string; result: string; status: StudyStatus; notes: string };
export type StudySnapshot = {
  question: string | null; datasetName: string | null; patients: number | null; responders: number | null; nonresponders: number | null;
  status: StudyStatus; statusLabel: string;
  metrics: { majorityBaseline: MetricValue; logisticRegression: MetricValue; tree: MetricValue } | null;
  testPatientCount: number | null; smallTestWarning: string | null; analysisCommand: string; inspectCommand: string;
  reportHref: string; sourcesHref: string; resultFiles: Array<{ label: string; href: string }>;
  limitations: string | null; history: StudyHistoryEntry[];
};
export type CommandResultInput = { code: number | null; stdout: string; stderr: string };
export type CommandResult = { status: Exclude<StudyStatus, 'not-run'>; output: string; exitCode: number | null };
type MetricRecord = { balanced_accuracy?: unknown; accuracy?: unknown; roc_auc?: unknown };
type SummaryRecord = { dataset?: string; uc_baseline_records?: number; groups?: Record<string, unknown>; active_baseline_cohort?: { patient_count?: number } };
type MetricsRecord = { metrics?: Record<string, MetricRecord>; split?: { test_patients?: string[] } };
export type StudyArtifacts = { questionText: string | null; sourcesText: string | null; summary: SummaryRecord | null; metricsJson: MetricsRecord | null; replicationSummary: SummaryRecord | null; replicationMetrics: MetricsRecord | null; report: string | null };

export const ANALYSIS_COMMAND = 'uv run --with numpy==2.4.6 --with pandas==3.0.5 --with scipy==1.17.1 --with scikit-learn==1.9.0 python research/uc_failure_study/src/run_analysis.py --soft research/uc_failure_study/results/source_data/GSE14580_family.soft.gz --matrix research/uc_failure_study/results/source_data/GSE14580_series_matrix.txt.gz --out research/uc_failure_study/results | tee research/uc_failure_study/results/logs/analysis.txt';
export const INSPECT_COMMAND = 'python3 research/uc_failure_study/src/inspect_dataset.py --soft research/uc_failure_study/results/source_data/GSE14580_family.soft.gz --matrix research/uc_failure_study/results/source_data/GSE14580_series_matrix.txt.gz --out research/uc_failure_study/results/inspection.json | tee research/uc_failure_study/results/logs/inspection.txt';

function metric(metrics: Record<string, MetricRecord> | undefined, key: string): MetricValue {
  const value = metrics?.[key];
  return { balancedAccuracy: typeof value?.balanced_accuracy === 'number' ? value.balanced_accuracy : null, accuracy: typeof value?.accuracy === 'number' ? value.accuracy : null, rocAuc: typeof value?.roc_auc === 'number' ? value.roc_auc : null };
}
function countLabel(count: number) { return count === 6 ? 'six' : String(count); }
function accessDate(sources: string | null, id: string) { const row = sources?.split('\n').find((line) => line.startsWith(`${id},`)); return row?.split(',')[6] || 'Not recorded.'; }
function reportLimitations(report: string | null) { return report?.match(/## (?:\d+\.\s*)?Limitations\s*\n\n([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim() || null; }
function historyEntry(input: { name: string; date: string; dataset: string; metric: MetricValue; status: StudyStatus; patients: number | null; testPatientCount: number | null }): StudyHistoryEntry {
  const result = input.metric.balancedAccuracy === null ? 'Not run.' : `Balanced accuracy ${input.metric.balancedAccuracy.toFixed(3)}`;
  const notes = input.status === 'not-run' ? 'Saved model metrics are missing.' : input.testPatientCount !== null && input.testPatientCount <= 6 ? `Only ${input.testPatientCount} test patients; estimate is highly unstable.` : `${input.patients ?? 'Unknown'} patients in the saved analysis.`;
  return { experiment: input.name, date: input.date, dataset: input.dataset, method: 'Majority + logistic regression + depth-2 tree', metric: 'Balanced accuracy', result, status: input.status, notes };
}

export function classifyCommandResult(result: CommandResultInput): CommandResult {
  return { status: result.code === 0 ? 'completed' : 'failed', output: [result.stdout.trimEnd(), result.stderr.trimEnd()].filter(Boolean).join('\n'), exitCode: result.code };
}

export function buildStudySnapshot({ questionText, sourcesText, summary, metricsJson, replicationSummary, replicationMetrics, report }: StudyArtifacts): StudySnapshot {
  const hasMetrics = Boolean(metricsJson?.metrics);
  const testPatientCount = Array.isArray(metricsJson?.split?.test_patients) ? metricsJson.split.test_patients.length : null;
  const patients = typeof summary?.uc_baseline_records === 'number' ? summary.uc_baseline_records : null;
  const status: StudyStatus = hasMetrics ? 'completed' : 'not-run';
  const currentMetric = metric(metricsJson?.metrics, 'logistic_regression');
  const replicationPatients = typeof replicationSummary?.active_baseline_cohort?.patient_count === 'number' ? replicationSummary.active_baseline_cohort.patient_count : null;
  const replicationTestCount = Array.isArray(replicationMetrics?.split?.test_patients) ? replicationMetrics.split.test_patients.length : null;
  const replicationStatus: StudyStatus = replicationMetrics?.metrics ? 'completed' : 'not-run';
  const question = questionText?.match(/## Primary question\s*\n\s*([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim() || null;
  const datasetName = typeof summary?.dataset === 'string' ? summary.dataset : null;
  return {
    question, datasetName, patients, responders: typeof summary?.groups?.responder === 'number' ? summary.groups.responder : null, nonresponders: typeof summary?.groups?.nonresponder === 'number' ? summary.groups.nonresponder : null,
    status, statusLabel: status === 'completed' ? 'Completed' : 'Not run.',
    metrics: hasMetrics ? { majorityBaseline: metric(metricsJson?.metrics, 'majority_baseline'), logisticRegression: currentMetric, tree: metric(metricsJson?.metrics, 'decision_tree_depth_2') } : null,
    testPatientCount, smallTestWarning: testPatientCount !== null && testPatientCount <= 6 ? `This result is based on only ${countLabel(testPatientCount)} test patients (${testPatientCount} total). Treat the estimate as highly unstable.` : null,
    analysisCommand: ANALYSIS_COMMAND, inspectCommand: INSPECT_COMMAND, reportHref: '/api/study?artifact=report', sourcesHref: '/api/study?artifact=sources',
    resultFiles: [{ label: 'model_metrics.json', href: '/api/study?artifact=model_metrics' }, { label: 'descriptive_summary.json', href: '/api/study?artifact=summary' }, { label: 'probe_effects.csv', href: '/api/study?artifact=probes' }, { label: 'report_data.json', href: '/api/study?artifact=report_data' }],
    limitations: reportLimitations(report),
    history: [historyEntry({ name: 'Initial response benchmark', date: accessDate(sourcesText, 'GSE14580'), dataset: 'GSE14580', metric: currentMetric, status, patients, testPatientCount }), historyEntry({ name: 'Independent replication', date: accessDate(sourcesText, 'GSE206285'), dataset: 'GSE206285', metric: metric(replicationMetrics?.metrics, 'logistic_regression'), status: replicationStatus, patients: replicationPatients, testPatientCount: replicationTestCount })],
  };
}
