"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CommandResult, StudySnapshot, StudyStatus } from '@/lib/study-control';
import { bundledStudySnapshot } from '@/lib/study-bundled';

type RunState = 'idle' | 'running' | 'completed' | 'failed';

const emptyMetric = { balancedAccuracy: null, accuracy: null, rocAuc: null };

async function fetchSnapshot(): Promise<StudySnapshot> {
  const response = await fetch('/api/study', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Study files could not be read (HTTP ${response.status}).`);
  const remote = await response.json() as StudySnapshot;
  return remote.status === 'not-run' && bundledStudySnapshot.status === 'completed' ? bundledStudySnapshot : remote;
}

function value(value: number | null | undefined, digits = 0) {
  return typeof value === 'number' ? value.toFixed(digits) : 'Not available';
}

function statusLabel(status: StudyStatus | RunState) {
  if (status === 'completed') return 'Completed';
  if (status === 'failed') return 'Failed';
  if (status === 'running') return 'Running';
  return 'Not run.';
}

function StatusBadge({ status }: { status: StudyStatus | RunState }) {
  return <Badge variant={status === 'failed' ? 'destructive' : status === 'completed' ? 'secondary' : 'outline'}>{statusLabel(status)}</Badge>;
}

export default function UCStudyControlPanel() {
  const [snapshot, setSnapshot] = useState<StudySnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>('idle');
  const [runResult, setRunResult] = useState<CommandResult | null>(null);

  useEffect(() => {
    let active = true;
    fetchSnapshot()
      .then((nextSnapshot) => { if (active) { setSnapshot(nextSnapshot); setLoadError(null); } })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : 'Study files could not be read.'); });
    return () => { active = false; };
  }, []);

  async function runStudy() {
    setRunState('running');
    setRunResult(null);
    try {
      const response = await fetch('/api/study', { method: 'POST' });
      const result = await response.json() as CommandResult;
      setRunResult(result);
      setRunState(result.status);
      setSnapshot(await fetchSnapshot());
    } catch (error) {
      const result: CommandResult = { status: 'failed', output: error instanceof Error ? error.message : 'The local command could not be started.', exitCode: null };
      setRunResult(result);
      setRunState('failed');
    }
  }

  const metrics = snapshot?.metrics ?? { majorityBaseline: emptyMetric, logisticRegression: emptyMetric, tree: emptyMetric };
  const visibleStatus = runState === 'idle' ? snapshot?.status ?? 'not-run' : runState;
  const notRun = visibleStatus === 'not-run';

  return <div className="study-control-shell">
    <header className="study-control-header">
      <div className="study-control-brand"><span className="study-control-mark">AX</span><div><strong>AX014</strong><span>Research control room</span></div></div>
      <div className="study-control-header-meta"><span className="study-control-dot" />Local files only</div>
    </header>

    <main className="study-control-main">
      <section className="study-control-intro">
        <div>
          <p className="study-control-kicker">UC treatment failure study</p>
          <h1>{snapshot?.question ?? 'Not run.'}</h1>
          <p className="study-control-boundary">Public-data research benchmark. Results are descriptive and non-clinical; no target, mechanism, or treatment conclusion is inferred here.</p>
        </div>
        <StatusBadge status={visibleStatus} />
      </section>

      {loadError && <div className="study-control-alert" role="alert">{loadError}</div>}

      <section className="study-control-facts" aria-label="Study facts">
        <div><span>Dataset</span><strong>{snapshot?.datasetName ?? 'Not available'}</strong></div>
        <div><span>Patients</span><strong>{snapshot?.patients ?? 'Not available'}</strong></div>
        <div><span>Responders</span><strong>{snapshot?.responders ?? 'Not available'}</strong></div>
        <div><span>Nonresponders</span><strong>{snapshot?.nonresponders ?? 'Not available'}</strong></div>
      </section>

      {snapshot?.smallTestWarning && <div className="study-control-warning" role="note"><strong>Small test set.</strong> {snapshot.smallTestWarning}</div>}

      <div className="study-control-grid">
        <section className="study-control-section study-control-run">
          <div className="study-control-section-head"><div><p className="study-control-kicker">Execution</p><h2>Run the documented study</h2></div><Button onClick={() => void runStudy()} disabled={runState === 'running'}>{runState === 'running' ? 'Running…' : 'Run Study'}</Button></div>
          <div className="study-control-status-row"><span>Analysis status</span><StatusBadge status={visibleStatus} /></div>
          <label className="study-control-label" htmlFor="study-command">Analysis command</label>
          <pre id="study-command" className="study-control-code">{snapshot?.analysisCommand ?? 'Not available'}</pre>
          <label className="study-control-label" htmlFor="study-inspect-command">Inspection command</label>
          <pre id="study-inspect-command" className="study-control-code">{snapshot?.inspectCommand ?? 'Not available'}</pre>
          <div className="study-control-output-head"><span>Exact command output</span>{runResult && <StatusBadge status={runResult.status} />}</div>
          <pre className="study-control-output" aria-live="polite">{runState === 'running' ? 'Command is running locally…' : runResult?.output || 'No run output yet.'}</pre>
          <div className="study-control-links">
            {snapshot?.resultFiles.map((file) => <a key={file.href} href={file.href}>{file.label}</a>)}
          </div>
        </section>

        <section className="study-control-section">
          <div className="study-control-section-head"><div><p className="study-control-kicker">Comparison</p><h2>Saved model metrics</h2></div><span className="study-control-muted">model_metrics.json</span></div>
          <div className="study-control-table-wrap"><table className="study-control-table"><thead><tr><th>Method</th><th>Balanced accuracy</th><th>Accuracy</th><th>ROC-AUC</th></tr></thead><tbody>
            <tr><th>Majority baseline</th><td>{value(metrics.majorityBaseline.balancedAccuracy, 3)}</td><td>{value(metrics.majorityBaseline.accuracy, 3)}</td><td>{value(metrics.majorityBaseline.rocAuc, 3)}</td></tr>
            <tr><th>Logistic regression</th><td>{value(metrics.logisticRegression.balancedAccuracy, 3)}</td><td>{value(metrics.logisticRegression.accuracy, 3)}</td><td>{value(metrics.logisticRegression.rocAuc, 3)}</td></tr>
            <tr><th>Depth-2 tree</th><td>{value(metrics.tree.balancedAccuracy, 3)}</td><td>{value(metrics.tree.accuracy, 3)}</td><td>{value(metrics.tree.rocAuc, 3)}</td></tr>
          </tbody></table></div>
          {notRun && <p className="study-control-empty">Not run. Saved model metrics are unavailable.</p>}
        </section>
      </div>

      <section className="study-control-section">
        <div className="study-control-section-head"><div><p className="study-control-kicker">Record</p><h2>Experiment history</h2></div><span className="study-control-muted">Source-backed entries only</span></div>
        <div className="study-control-table-wrap"><table className="study-control-table study-control-history"><thead><tr><th>Experiment</th><th>Date</th><th>Dataset</th><th>Method</th><th>Metric</th><th>Result</th><th>Status</th><th>Notes</th></tr></thead><tbody>
          {(snapshot?.history ?? []).map((entry) => <tr key={entry.experiment}><th>{entry.experiment}</th><td>{entry.date}</td><td>{entry.dataset}</td><td>{entry.method}</td><td>{entry.metric}</td><td>{entry.result}</td><td><StatusBadge status={entry.status} /></td><td>{entry.notes}</td></tr>)}
        </tbody></table></div>
        {!snapshot?.history.length && <p className="study-control-empty">Not run. No experiment history is available.</p>}
      </section>

      <div className="study-control-lower-grid">
        <section className="study-control-section study-control-copy"><p className="study-control-kicker">Limitations</p><h2>What this study cannot establish</h2><p>{snapshot?.limitations ?? 'Not available. The report has not been generated.'}</p><a href={snapshot?.reportHref ?? '#'}>Open the full report</a><a href={snapshot?.sourcesHref ?? '#'}>Open the source list</a></section>
        <section className="study-control-next"><p className="study-control-kicker">Next action</p><h2>Independent public replication is required before biological or drug conclusions.</h2><p>Keep the workflow reproducible, compare compatible cohorts, and stop when the evidence does not repeat.</p></section>
      </div>
    </main>
  </div>;
}
