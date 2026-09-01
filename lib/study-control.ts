import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildStudySnapshot } from './study-shared';
import type { StudySnapshot } from './study-shared';

export { buildStudySnapshot, classifyCommandResult } from './study-shared';
export type { CommandResult, CommandResultInput, StudySnapshot, StudyStatus, StudyArtifacts, MetricValue, StudyHistoryEntry } from './study-shared';

function readText(path: string) { return existsSync(path) ? readFileSync(path, 'utf8') : null; }
function readJson<T>(path: string): T | null { const text = readText(path); if (!text) return null; try { return JSON.parse(text) as T; } catch { return null; } }

export function readStudySnapshot(root = process.cwd()): StudySnapshot {
  const studyDir = join(root, 'research', 'uc_failure_study');
  const resultsDir = join(studyDir, 'results');
  return buildStudySnapshot({
    questionText: readText(join(studyDir, 'question.md')),
    sourcesText: readText(join(studyDir, 'sources.csv')),
    summary: readJson(join(resultsDir, 'descriptive_summary.json')),
    metricsJson: readJson(join(resultsDir, 'model_metrics.json')),
    replicationSummary: readJson(join(resultsDir, 'replication_gse206285', 'descriptive_summary.json')),
    replicationMetrics: readJson(join(resultsDir, 'replication_gse206285', 'model_metrics.json')),
    report: readText(join(studyDir, 'report.md')),
  });
}
