import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classifyCommandResult, readStudySnapshot } from './study-control';

const tempRoots: string[] = [];

function createStudyFixture({ withMetrics = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'ax014-study-'));
  tempRoots.push(root);
  const study = join(root, 'research', 'uc_failure_study');
  const results = join(study, 'results');
  const source = join(results, 'source_data');
  const replication = join(results, 'replication_gse206285');
  for (const path of [source, replication]) {
    mkdirSync(path, { recursive: true });
  }
  writeFileSync(join(study, 'question.md'), '# Research question\n\nCan the public dataset distinguish responders from nonresponders?\n');
  writeFileSync(join(study, 'sources.csv'), 'source_id,title,access_date\nGSE14580,Study,2026-09-01\n');
  writeFileSync(join(study, 'report.md'), '# Report\n\nStudy limitations are substantial.\n');
  writeFileSync(join(results, 'descriptive_summary.json'), JSON.stringify({ dataset: 'GSE14580', uc_baseline_records: 24, groups: { responder: 8, nonresponder: 16, unknown_or_unusable: 6 } }));
  if (withMetrics) {
    writeFileSync(join(results, 'model_metrics.json'), JSON.stringify({
      metrics: {
        majority_baseline: { balanced_accuracy: 0.5, accuracy: 2 / 3, roc_auc: 0.5 },
        logistic_regression: { balanced_accuracy: 0.5, accuracy: 2 / 3, roc_auc: 0.625 },
        decision_tree_depth_2: { balanced_accuracy: 0.625, accuracy: 2 / 3, roc_auc: 0.625 },
      },
      split: { seed: 7, test_fraction: 0.25, test_patients: ['a', 'b', 'c', 'd', 'e', 'f'] },
      test_counts: { responder: 2, nonresponder: 4 },
    }));
  }
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('study control file contract', () => {
  it('reads the real study facts and exact saved metrics', () => {
    const snapshot = readStudySnapshot(createStudyFixture());
    expect(snapshot.status).toBe('completed');
    expect(snapshot.datasetName).toBe('GSE14580');
    expect(snapshot.patients).toBe(24);
    expect(snapshot.responders).toBe(8);
    expect(snapshot.nonresponders).toBe(16);
    expect(snapshot.metrics?.logisticRegression.balancedAccuracy).toBe(0.5);
    expect(snapshot.metrics?.tree.balancedAccuracy).toBe(0.625);
  });

  it('returns an honest not-run state when result files are missing', () => {
    const snapshot = readStudySnapshot(createStudyFixture({ withMetrics: false }));
    expect(snapshot.status).toBe('not-run');
    expect(snapshot.metrics).toBeNull();
    expect(snapshot.statusLabel).toBe('Not run.');
  });

  it('warns clearly when the saved test set has six or fewer patients', () => {
    const snapshot = readStudySnapshot(createStudyFixture());
    expect(snapshot.testPatientCount).toBe(6);
    expect(snapshot.smallTestWarning).toMatch(/six test patients/i);
  });

  it('normalizes a failed command without hiding stderr', () => {
    expect(classifyCommandResult({ code: 1, stdout: 'partial output', stderr: 'python failed' })).toEqual({
      status: 'failed',
      output: 'partial output\npython failed',
      exitCode: 1,
    });
  });
});
