"use client";

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { averageMetric, buildLabReport, formatExperimentStatus } from '@/lib/lab/analysis';
import type { CheckIn, DailyMetrics, LabGoalId } from '@/lib/lab/domain';
import { demoCheckIns, demoExperiment, demoProfile, labGoals } from '@/lib/lab/fixtures';

type Stage = 'welcome' | 'goal' | 'data' | 'baseline' | 'experiment' | 'checkin' | 'report';
const stages: { id: Stage; label: string }[] = [
  { id: 'goal', label: 'Choose a goal' },
  { id: 'data', label: 'Local data' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'experiment', label: 'Experiment' },
  { id: 'checkin', label: 'Daily check-in' },
  { id: 'report', label: 'Learning report' },
];

function Metric({ label, value, suffix = '' }: { label: string; value: string | number; suffix?: string }) {
  return <div className="lab-metric"><span>{label}</span><strong>{value}{suffix}</strong></div>;
}

function StageHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="lab-heading"><p className="lab-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div>;
}

export default function PersonalLabWorkspace({ onCompanyMode }: { onCompanyMode: () => void }) {
  const [stage, setStage] = useState<Stage>('welcome');
  const [goal, setGoal] = useState<LabGoalId>('sleep');
  const [profile, setProfile] = useState(demoProfile);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(demoCheckIns.slice(0, 3));
  const [draft, setDraft] = useState<DailyMetrics>(demoCheckIns[3]);
  const [notice, setNotice] = useState('');

  const report = useMemo(() => buildLabReport({ ...profile, goals: [goal] }, demoExperiment, checkIns), [profile, goal, checkIns]);
  const averageSleep = averageMetric(checkIns, 'sleepHours');
  const averageFocus = averageMetric(checkIns, 'focus');
  const completeStage = (target: Stage) => { setStage(target); setNotice(''); };
  const updateBaseline = (field: keyof DailyMetrics, value: string) => setProfile((current) => ({ ...current, baseline: { ...current.baseline, [field]: Number(value) || 0 } }));
  const updateDraft = (field: keyof DailyMetrics, value: string) => setDraft((current) => ({ ...current, [field]: Number(value) || 0 }));
  const saveCheckIn = () => {
    setCheckIns((current) => [...current, { ...draft, day: current.length + 1 }]);
    setNotice('Check-in saved locally. No health data left this browser.');
  };
  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'personal-lab-learning-report.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Report downloaded locally.');
  };

  return <div className="lab-shell">
    <header className="lab-topbar">
      <div className="lab-brand"><span className="lab-brand-mark">F</span><div><strong>Frontier Bio</strong><span>Personal lab</span></div></div>
      <div className="lab-top-actions"><Badge variant="outline" className="lab-local-badge">Local demo only</Badge><Button variant="outline" size="sm" onClick={onCompanyMode}>Company mode</Button></div>
    </header>
    <main className="lab-main">
      <section className="lab-safety" aria-label="Safety boundary"><div><strong>Research only · not medical advice</strong><p>Use this workspace to notice patterns and run one reversible behavior experiment. It does not diagnose, predict risk, prescribe, recommend dosage, or recommend drugs.</p></div><span>Synthetic fixtures stay in this browser.</span></section>
      {stage !== 'welcome' ? <div className="lab-layout"><aside className="lab-nav"><p className="lab-eyebrow">Your lab</p><button type="button" className={stage === 'welcome' ? 'lab-nav-item is-active' : 'lab-nav-item'} onClick={() => completeStage('welcome')}>Overview</button>{stages.map((item) => <button type="button" key={item.id} className={stage === item.id ? 'lab-nav-item is-active' : 'lab-nav-item'} onClick={() => completeStage(item.id)}>{item.label}{(['baseline', 'experiment', 'checkin', 'report'] as Stage[]).includes(item.id) && <span>{item.id === 'checkin' ? `${checkIns.length}/14` : '›'}</span>}</button>)}<div className="lab-nav-note"><strong>Privacy boundary</strong><p>No device tokens, clinical files, or personal DNA are accepted in this prototype.</p></div></aside><section className="lab-content">{stage === 'goal' ? <GoalStage goal={goal} setGoal={setGoal} onNext={() => completeStage('data')} /> : null}{stage === 'data' ? <DataStage onNext={() => completeStage('baseline')} /> : null}{stage === 'baseline' ? <BaselineStage profile={profile} updateBaseline={updateBaseline} onNext={() => completeStage('experiment')} /> : null}{stage === 'experiment' ? <ExperimentStage onNext={() => completeStage('checkin')} /> : null}{stage === 'checkin' ? <CheckInStage checkIns={checkIns} draft={draft} updateDraft={updateDraft} saveCheckIn={saveCheckIn} notice={notice} onReport={() => completeStage('report')} /> : null}{stage === 'report' ? <ReportStage report={report} averageSleep={averageSleep} averageFocus={averageFocus} checkIns={checkIns} downloadReport={downloadReport} /> : null}</section></div> : <WelcomeStage onStart={() => completeStage('goal')} />}
    </main>
    <footer className="lab-footer"><span>Frontier Bio · personal health research lab</span><span>Local fixture data · no network calls</span></footer>
  </div>;
}

function WelcomeStage({ onStart }: { onStart: () => void }) {
  return <section className="lab-welcome"><div className="lab-welcome-copy"><p className="lab-eyebrow">A quieter way to learn from your own data</p><h1>One clear question.<br /><em>One safe experiment.</em></h1><p>Frontier Bio helps you turn everyday signals—sleep, energy, focus, movement, and nutrition—into a small, reviewable learning loop.</p><div className="lab-welcome-actions"><Button size="lg" onClick={onStart}>Set up a local demo</Button><span>No account · no device connection · no medical claims</span></div></div><Card className="lab-welcome-card"><CardHeader><Badge variant="outline">Example loop</Badge><CardTitle>Does an earlier caffeine cutoff change sleep?</CardTitle><CardDescription>A behavior hypothesis, not a prescription.</CardDescription></CardHeader><CardContent><div className="lab-loop"><span>Baseline</span><b>→</b><span>14-day experiment</span><b>→</b><span>Review pattern</span></div><div className="lab-rule"><strong>What stays true</strong><p>Every insight is labeled as a personal observation or research context. You decide what to keep, modify, or stop.</p></div></CardContent></Card></section>;
}

function GoalStage({ goal, setGoal, onNext }: { goal: LabGoalId; setGoal: (value: LabGoalId) => void; onNext: () => void }) {
  return <><StageHeading eyebrow="01 · Choose a goal" title="What do you want to understand better?" copy="Pick one focus for this research loop. It is a tracking lens, not a health outcome promise." /><div className="lab-goal-grid">{labGoals.map((item) => <button type="button" key={item.id} className={goal === item.id ? 'lab-goal is-selected' : 'lab-goal'} onClick={() => setGoal(item.id)}><strong>{item.label}</strong><span>{item.description}</span></button>)}</div><div className="lab-next"><span>Selected: <strong>{labGoals.find((item) => item.id === goal)?.label}</strong></span><Button onClick={onNext}>Continue to local data</Button></div></>;
}

function DataStage({ onNext }: { onNext: () => void }) {
  return <><StageHeading eyebrow="02 · Local data" title="Start with a small, honest baseline." copy="This prototype uses a deterministic synthetic profile. Device connections and clinical imports are intentionally out of scope." /><Card className="lab-card"><CardHeader><Badge variant="outline">Synthetic fixture</Badge><CardTitle>Demo participant</CardTitle><CardDescription>Signals are representative only and never leave the browser.</CardDescription></CardHeader><CardContent><div className="lab-data-grid"><Metric label="Data sources" value="2" /><Metric label="Days available" value="14" /><Metric label="Privacy" value="Local" /></div><div className="lab-source-list"><div><strong>Synthetic wearable summary</strong><span>Sleep and movement · fixture</span></div><div><strong>Manual demo check-in</strong><span>Energy, focus, caffeine · fixture</span></div></div><div className="lab-boundary"><strong>Manual entry is local demo input only</strong><p>Do not enter clinical records, real personal DNA, or anything you would not want stored in a browser tab.</p></div></CardContent></Card><div className="lab-next"><span>Nothing is uploaded or logged.</span><Button onClick={onNext}>Review baseline</Button></div></>;
}

function BaselineStage({ profile, updateBaseline, onNext }: { profile: typeof demoProfile; updateBaseline: (field: keyof DailyMetrics, value: string) => void; onNext: () => void }) {
  return <><StageHeading eyebrow="03 · Baseline" title="Make the starting point visible." copy="Adjust the demo values if you want to test the flow. These fields are local and non-clinical." /><Card className="lab-card"><CardHeader><Badge variant="outline">Editable locally</Badge><CardTitle>Current baseline</CardTitle></CardHeader><CardContent><div className="lab-form-grid"><label>Sleep hours<Input type="number" step="0.1" value={profile.baseline.sleepHours} onChange={(event) => updateBaseline('sleepHours', event.target.value)} /></label><label>Energy (1–10)<Input type="number" min="1" max="10" value={profile.baseline.energy} onChange={(event) => updateBaseline('energy', event.target.value)} /></label><label>Focus (1–10)<Input type="number" min="1" max="10" value={profile.baseline.focus} onChange={(event) => updateBaseline('focus', event.target.value)} /></label><label>Caffeine mg/day<Input type="number" min="0" value={profile.baseline.caffeineMg} onChange={(event) => updateBaseline('caffeineMg', event.target.value)} /></label></div><div className="lab-baseline-summary"><Metric label="Movement" value={profile.baseline.movementMinutes} suffix=" min/day" /><Metric label="Last updated" value={profile.lastUpdated} /></div></CardContent></Card><div className="lab-next"><span>Baseline is a reference point, not a diagnosis.</span><Button onClick={onNext}>Review experiment</Button></div></>;
}

function ExperimentStage({ onNext }: { onNext: () => void }) {
  return <><StageHeading eyebrow="04 · One experiment" title={demoExperiment.title} copy={demoExperiment.objective} /><Card className="lab-card"><CardHeader><div className="lab-card-title-row"><Badge>Behavior experiment</Badge><Badge variant="outline">{formatExperimentStatus(demoExperiment.status, 1, demoExperiment.durationDays)}</Badge></div><CardTitle className="lab-card-title">A reversible protocol with a clear falsifier.</CardTitle></CardHeader><CardContent><ol className="lab-protocol">{demoExperiment.protocol.map((step) => <li key={step}>{step}</li>)}</ol><div className="lab-guardrails"><strong>Guardrails</strong>{demoExperiment.guardrails.map((guardrail) => <p key={guardrail}>{guardrail}</p>)}</div></CardContent></Card><div className="lab-next"><span>Primary metric: <strong>sleep hours</strong></span><Button onClick={onNext}>Start local check-ins</Button></div></>;
}

function CheckInStage({ checkIns, draft, updateDraft, saveCheckIn, notice, onReport }: { checkIns: CheckIn[]; draft: DailyMetrics; updateDraft: (field: keyof DailyMetrics, value: string) => void; saveCheckIn: () => void; notice: string; onReport: () => void }) {
  return <><StageHeading eyebrow="05 · Daily check-in" title="Keep the loop lightweight." copy="A check-in is a personal observation. It is not a clinical measurement." /><div className="lab-checkin-layout"><Card className="lab-card"><CardHeader><Badge variant="outline">Day {checkIns.length + 1} of {demoExperiment.durationDays}</Badge><CardTitle>How did today feel?</CardTitle><CardDescription>Use the synthetic values or replace them with local demo values.</CardDescription></CardHeader><CardContent><div className="lab-form-grid"><label>Sleep hours<Input type="number" step="0.1" value={draft.sleepHours} onChange={(event) => updateDraft('sleepHours', event.target.value)} /></label><label>Energy (1–10)<Input type="number" min="1" max="10" value={draft.energy} onChange={(event) => updateDraft('energy', event.target.value)} /></label><label>Focus (1–10)<Input type="number" min="1" max="10" value={draft.focus} onChange={(event) => updateDraft('focus', event.target.value)} /></label><label>Caffeine mg<Input type="number" min="0" value={draft.caffeineMg} onChange={(event) => updateDraft('caffeineMg', event.target.value)} /></label></div><Button className="lab-save-button" onClick={saveCheckIn}>Save local check-in</Button>{notice ? <p className="lab-notice" role="status">{notice}</p> : null}</CardContent></Card><Card className="lab-card lab-progress-card"><CardHeader><Badge variant="outline">Observed so far</Badge><CardTitle>{checkIns.length} days logged</CardTitle></CardHeader><CardContent><div className="lab-progress"><span style={{ width: `${Math.min(100, (checkIns.length / demoExperiment.durationDays) * 100)}%` }} /></div><div className="lab-data-grid"><Metric label="Avg sleep" value={averageMetric(checkIns, 'sleepHours')} suffix=" h" /><Metric label="Avg focus" value={averageMetric(checkIns, 'focus')} suffix=" / 10" /></div><Button variant="outline" onClick={onReport}>Review current trend</Button></CardContent></Card></div></>;
}

function ReportStage({ report, averageSleep, averageFocus, checkIns, downloadReport }: { report: ReturnType<typeof buildLabReport>; averageSleep: number; averageFocus: number; checkIns: CheckIn[]; downloadReport: () => void }) {
  const sleepWidth = Math.min(100, Math.max(8, (averageSleep / 10) * 100));
  const focusWidth = Math.min(100, Math.max(8, (averageFocus / 10) * 100));
  return <><StageHeading eyebrow="06 · Learning report" title="What changed in this small sample?" copy="This is a reviewable observation from synthetic data, not a claim about your health." /><Card className="lab-card"><CardHeader><div className="lab-card-title-row"><Badge>Personal observation</Badge><Badge variant="outline">{checkIns.length} days logged</Badge></div><CardTitle>{report.title}</CardTitle><CardDescription>{report.summary}</CardDescription></CardHeader><CardContent><div className="lab-trend"><div><span>Average sleep</span><strong>{averageSleep} h</strong><div className="lab-bar"><i style={{ width: `${sleepWidth}%` }} /></div></div><div><span>Average focus</span><strong>{averageFocus} / 10</strong><div className="lab-bar"><i style={{ width: `${focusWidth}%` }} /></div></div></div><div className="lab-report-copy"><strong>Next step</strong><p>{report.nextStep}</p></div><div className="lab-boundary"><strong>{report.boundary}</strong></div><Button onClick={downloadReport}>Download local JSON report</Button></CardContent></Card></>;
}
