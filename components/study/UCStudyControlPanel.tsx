"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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

function value(metric: number | null | undefined) { return typeof metric === 'number' ? metric.toFixed(3) : 'Not run'; }
function statusLabel(status: StudyStatus | RunState) { return status === 'completed' ? 'COMPLETED' : status === 'failed' ? 'FAILED' : status === 'running' ? 'RUNNING' : 'NOT RUN'; }
function StatusMark({ status }: { status: StudyStatus | RunState }) { return <span className={`study-console-status study-console-status-${status}`}><i aria-hidden="true" />{statusLabel(status)}</span>; }

export default function UCStudyControlPanel() {
  const [snapshot, setSnapshot] = useState<StudySnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>('idle');
  const [runResult, setRunResult] = useState<CommandResult | null>(null);

  useEffect(() => {
    let active = true;
    fetchSnapshot().then((next) => { if (active) { setSnapshot(next); setLoadError(null); } }).catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : 'Study files could not be read.'); });
    return () => { active = false; };
  }, []);

  async function runStudy() {
    setRunState('running'); setRunResult(null);
    try {
      const response = await fetch('/api/study', { method: 'POST' });
      const result = await response.json() as CommandResult;
      setRunResult(result); setRunState(result.status); setSnapshot(await fetchSnapshot());
    } catch (error) {
      setRunResult({ status: 'failed', output: error instanceof Error ? error.message : 'The local command could not be started.', exitCode: null });
      setRunState('failed');
    }
  }

  const metrics = snapshot?.metrics ?? { majorityBaseline: emptyMetric, logisticRegression: emptyMetric, tree: emptyMetric };
  const visibleStatus = runState === 'idle' ? snapshot?.status ?? 'not-run' : runState;
  const hasHistory = Boolean(snapshot?.history.length);

  return <div className="study-console">
    <header className="study-console-topbar"><div className="study-console-wordmark"><strong>AX014</strong><span>internal research</span></div><div className="study-console-utility"><span>LOCAL WORKSPACE</span><StatusMark status={visibleStatus} /></div></header>
    <div className="study-console-frame">
      <aside className="study-console-sidebar" aria-label="Primary navigation"><div className="study-console-sidebar-heading">WORKSPACE</div><nav>{['Studies', 'Datasets', 'Runs', 'Evidence', 'Reports'].map((item) => <button type="button" className={item === 'Studies' ? 'is-active' : ''} key={item}><span aria-hidden="true">{item === 'Studies' ? '▸' : '·'}</span>{item}</button>)}</nav><div className="study-console-sidebar-foot">No external services<br />Local study files only</div></aside>
      <main className="study-console-main">
        <section className="study-console-record-head"><div><div className="study-console-breadcrumb">STUDIES / UC TREATMENT FAILURE</div><h1>UC treatment failure</h1><div className="study-console-record-meta"><span>Study ID: UC-001</span><span>Dataset: {snapshot?.datasetName ?? 'Not available'}</span><StatusMark status={visibleStatus} /></div></div><Button onClick={() => void runStudy()} disabled={runState === 'running'}>{runState === 'running' ? 'Running…' : 'Run study'}</Button></section>
        {loadError && <div className="study-console-error" role="alert">{loadError}</div>}
        <section className="study-console-question" aria-label="Study question"><span>QUESTION</span><p>{snapshot?.question ?? 'Not run.'}</p></section>
        <section className="study-console-facts" aria-label="Study facts"><div><span>DATASET</span><strong>{snapshot?.datasetName ?? 'Not available'}</strong></div><div><span>PATIENTS</span><strong>{snapshot?.patients ?? 'Not available'}</strong></div><div><span>RESPONDERS</span><strong>{snapshot?.responders ?? 'Not available'}</strong></div><div><span>NONRESPONDERS</span><strong>{snapshot?.nonresponders ?? 'Not available'}</strong></div></section>
        {snapshot?.smallTestWarning && <div className="study-console-warning" role="note"><strong>WARNING</strong><span>{snapshot.smallTestWarning}</span></div>}
        <section className="study-console-section" aria-labelledby="execution-heading"><div className="study-console-section-head"><div><span className="study-console-section-label">RUN</span><h2 id="execution-heading">Study execution</h2></div><StatusMark status={visibleStatus} /></div><div className="study-console-command-grid"><div><span className="study-console-field-label">ANALYSIS COMMAND</span><pre>{snapshot?.analysisCommand ?? 'Not available'}</pre></div><div><span className="study-console-field-label">INSPECTION COMMAND</span><pre>{snapshot?.inspectCommand ?? 'Not available'}</pre></div></div><div className="study-console-output-block"><div className="study-console-output-head"><span className="study-console-field-label">COMMAND OUTPUT</span>{runResult && <StatusMark status={runResult.status} />}</div><pre aria-live="polite">{runState === 'running' ? 'Command is running locally…' : runResult?.output || 'No run output.'}</pre></div><div className="study-console-links">{snapshot?.resultFiles.map((file) => <a key={file.href} href={file.href}>{file.label}</a>)}</div></section>
        <section className="study-console-section" aria-labelledby="metrics-heading"><div className="study-console-section-head"><div><span className="study-console-section-label">RESULTS</span><h2 id="metrics-heading">Saved model metrics</h2></div><span className="study-console-file-ref">model_metrics.json</span></div><div className="study-console-table-wrap"><table className="study-console-table"><thead><tr><th>METHOD</th><th>BALANCED ACCURACY</th><th>ACCURACY</th><th>ROC-AUC</th></tr></thead><tbody><tr><th>Majority baseline</th><td>{value(metrics.majorityBaseline.balancedAccuracy)}</td><td>{value(metrics.majorityBaseline.accuracy)}</td><td>{value(metrics.majorityBaseline.rocAuc)}</td></tr><tr><th>Logistic regression</th><td>{value(metrics.logisticRegression.balancedAccuracy)}</td><td>{value(metrics.logisticRegression.accuracy)}</td><td>{value(metrics.logisticRegression.rocAuc)}</td></tr><tr><th>Depth-2 tree</th><td>{value(metrics.tree.balancedAccuracy)}</td><td>{value(metrics.tree.accuracy)}</td><td>{value(metrics.tree.rocAuc)}</td></tr></tbody></table></div>{visibleStatus === 'not-run' && <p className="study-console-empty">Not run. Saved model metrics are unavailable.</p>}</section>
        <section className="study-console-section" aria-labelledby="history-heading"><div className="study-console-section-head"><div><span className="study-console-section-label">AUDIT LOG</span><h2 id="history-heading">Experiment history</h2></div><span className="study-console-file-ref">Source-backed entries only</span></div><div className="study-console-table-wrap"><table className="study-console-table study-console-history"><thead><tr><th>EXPERIMENT</th><th>DATE</th><th>DATASET</th><th>METHOD</th><th>METRIC</th><th>RESULT</th><th>STATUS</th><th>NOTES</th></tr></thead><tbody>{(snapshot?.history ?? []).map((entry) => <tr key={entry.experiment}><th>{entry.experiment}</th><td>{entry.date}</td><td>{entry.dataset}</td><td>{entry.method}</td><td>{entry.metric}</td><td>{entry.result}</td><td><StatusMark status={entry.status} /></td><td>{entry.notes}</td></tr>)}</tbody></table></div>{!hasHistory && <p className="study-console-empty">Not run. No experiment history is available.</p>}</section>
        <section className="study-console-notes" aria-label="Study notes"><div><span className="study-console-section-label">LIMITATIONS</span><p>{snapshot?.limitations ?? 'Not available. The report has not been generated.'}</p></div><div className="study-console-note-links"><a href={snapshot?.reportHref ?? '#'}>Open report</a><a href={snapshot?.sourcesHref ?? '#'}>Open source list</a></div></section>
        <section className="study-console-next"><span className="study-console-section-label">NEXT ACTION</span><strong>Independent public replication is required before biological or drug conclusions.</strong></section>
      </main>
    </div>
  </div>;
}
