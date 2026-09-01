"use client";

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { buildSleepReport, compareSleepPeriods, recommendDisposition } from '@/lib/lab/analysis';
import type { SleepGoalId, SleepRecord } from '@/lib/lab/domain';
import { demoBaseline, demoIntervention, demoSleepExperiment, demoSleepGoal, sleepGoals } from '@/lib/lab/fixtures';
import { sleepEvidence } from '@/lib/lab/evidence';

type SleepStage = 'goal' | 'baseline' | 'intervention' | 'checkin' | 'report';
const stages: { id: SleepStage; label: string }[] = [
  { id: 'goal', label: 'Goal' },
  { id: 'baseline', label: '7-day baseline' },
  { id: 'intervention', label: 'Intervention' },
  { id: 'checkin', label: 'Daily check-in' },
  { id: 'report', label: 'Weekly report' },
];

const numericSleepFields = new Set<keyof SleepRecord>(['sleepDuration', 'sleepLatency', 'nightAwakenings', 'morningEnergy', 'daytimeFocus', 'sleepQuality']);

const blankRecord = (day: number): SleepRecord => ({ day, bedtime: '23:00', wakeTime: '06:30', sleepDuration: 7, sleepLatency: 20, nightAwakenings: 1, morningEnergy: 6, daytimeFocus: 6, caffeineTime: '12:30', exerciseTime: '17:30', sleepQuality: 6 });

function Heading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="sleep-heading"><p className="sleep-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div>;
}

function Metric({ label, value, suffix = '' }: { label: string; value: string | number; suffix?: string }) {
  return <div className="sleep-metric"><span>{label}</span><strong>{value}{suffix}</strong></div>;
}

export default function SleepWellnessFlow() {
  const [stage, setStage] = useState<SleepStage>('goal');
  const [goal, setGoal] = useState<SleepGoalId>(demoSleepGoal.id);
  const [baseline, setBaseline] = useState<SleepRecord[]>([]);
  const [intervention, setIntervention] = useState<SleepRecord[]>([]);
  const [draft, setDraft] = useState<SleepRecord>(blankRecord(1));
  const [notice, setNotice] = useState('');

  const selectedGoal = sleepGoals.find((item) => item.id === goal) ?? demoSleepGoal;
  const comparison = useMemo(() => compareSleepPeriods(baseline, intervention), [baseline, intervention]);
  const report = useMemo(() => buildSleepReport(selectedGoal, demoSleepExperiment, baseline, intervention), [selectedGoal, baseline, intervention]);
  const disposition = useMemo(() => recommendDisposition(comparison), [comparison]);

  const go = (next: SleepStage) => { setStage(next); setNotice(''); };
  const loadBaseline = () => { setBaseline(demoBaseline.map((record) => ({ ...record }))); setNotice('Synthetic seven-day baseline loaded locally.'); };
  const updateRecord = (setRecords: (records: SleepRecord[]) => void, records: SleepRecord[], index: number, field: keyof SleepRecord, value: string) => {
    const next = records.map((record, recordIndex) => recordIndex === index ? { ...record, [field]: numericSleepFields.has(field) ? Number(value) || 0 : value } : record);
    setRecords(next);
  };
  const updateDraft = (field: keyof SleepRecord, value: string) => setDraft((current) => ({ ...current, [field]: numericSleepFields.has(field) ? Number(value) || 0 : value }));
  const saveCheckIn = () => {
    const nextDay = intervention.length + 1;
    setIntervention((records) => [...records, { ...draft, day: nextDay }]);
    setDraft({ ...blankRecord(nextDay + 1), ...(demoIntervention[nextDay] ? { ...demoIntervention[nextDay], day: nextDay + 1 } : {}) });
    setNotice(`Day ${nextDay} saved locally. No health data left this browser.`);
  };
  const loadIntervention = () => { setIntervention(demoIntervention.map((record) => ({ ...record }))); setNotice('Synthetic fourteen-day intervention sample loaded locally.'); };
  const downloadReport = () => {
    const payload = { report, baseline, intervention };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'frontier-bio-sleep-learning-report.json'; anchor.click(); URL.revokeObjectURL(url); setNotice('Report downloaded locally.');
  };

  return <div className="sleep-flow">
    <nav className="sleep-step-nav" aria-label="Sleep experiment steps">{stages.map((item) => <button type="button" key={item.id} className={stage === item.id ? 'sleep-step is-active' : 'sleep-step'} onClick={() => go(item.id)}>{item.label}{item.id === 'checkin' ? <span>{intervention.length}/14</span> : null}</button>)}</nav>
    {stage === 'goal' ? <GoalStage goal={goal} setGoal={setGoal} onNext={() => go('baseline')} /> : null}
    {stage === 'baseline' ? <BaselineStage baseline={baseline} loadBaseline={loadBaseline} updateBaseline={(index, field, value) => updateRecord(setBaseline, baseline, index, field, value)} notice={notice} onNext={() => go('intervention')} /> : null}
    {stage === 'intervention' ? <InterventionStage onNext={() => go('checkin')} /> : null}
    {stage === 'checkin' ? <CheckInStage intervention={intervention} draft={draft} updateDraft={updateDraft} saveCheckIn={saveCheckIn} loadIntervention={loadIntervention} notice={notice} onReport={() => go('report')} /> : null}
    {stage === 'report' ? <ReportStage report={report} disposition={disposition} baseline={baseline} intervention={intervention} downloadReport={downloadReport} notice={notice} /> : null}
  </div>;
}

function GoalStage({ goal, setGoal, onNext }: { goal: SleepGoalId; setGoal: (value: SleepGoalId) => void; onNext: () => void }) {
  return <><Heading eyebrow="01 · Sleep goal" title="Choose the question you want to test." copy="This is a tracking lens for a short personal experiment, not a diagnosis or promise of an outcome." /><div className="sleep-goal-list">{sleepGoals.map((item) => <button type="button" key={item.id} className={goal === item.id ? 'sleep-goal is-selected' : 'sleep-goal'} onClick={() => setGoal(item.id)}><strong>{item.label}</strong><span>{item.question}</span></button>)}</div><div className="sleep-next"><span>Selected: <strong>{sleepGoals.find((item) => item.id === goal)?.label}</strong></span><Button onClick={onNext}>Enter seven-day baseline</Button></div></>;
}

function BaselineStage({ baseline, loadBaseline, updateBaseline, notice, onNext }: { baseline: SleepRecord[]; loadBaseline: () => void; updateBaseline: (index: number, field: keyof SleepRecord, value: string) => void; notice: string; onNext: () => void }) {
  return <><Heading eyebrow="02 · Baseline" title="Enter seven ordinary nights." copy="Use the synthetic sample or edit each row with local demo values. These observations are not clinical measurements." /><Card className="sleep-card"><CardHeader><div className="sleep-card-title-row"><Badge variant="outline">{baseline.length === 7 ? 'Ready' : 'Synthetic sample'}</Badge><CardTitle>Seven-day baseline</CardTitle></div><CardDescription>All values stay in React memory and are never uploaded.</CardDescription></CardHeader><CardContent><div className="sleep-table-actions"><Button variant="outline" onClick={loadBaseline}>Use synthetic seven-day baseline</Button>{notice ? <span role="status">{notice}</span> : null}</div>{baseline.length ? <div className="sleep-table-wrap"><table className="sleep-table"><thead><tr><th>Day</th><th>Bed</th><th>Wake</th><th>Hours</th><th>Latency</th><th>Awakenings</th><th>Energy</th><th>Focus</th><th>Caffeine</th><th>Exercise</th><th>Quality</th></tr></thead><tbody>{baseline.map((record, index) => <SleepRow key={record.day} record={record} onChange={(field, value) => updateBaseline(index, field, value)} />)}</tbody></table></div> : <div className="sleep-empty">Load the synthetic baseline to begin. Manual entry is local demo input only.</div>}</CardContent></Card><div className="sleep-next"><span>{baseline.length}/7 nights entered</span><Button onClick={onNext} disabled={baseline.length !== 7}>Review one intervention</Button></div></>;
}

function SleepRow({ record, onChange }: { record: SleepRecord; onChange: (field: keyof SleepRecord, value: string) => void }) {
  const fieldInput = (field: keyof SleepRecord, type: 'number' | 'time' = 'number', step?: string) => <Input aria-label={`${field} day ${record.day}`} type={type} step={step} value={String(record[field])} onChange={(event) => onChange(field, event.target.value)} />;
  return <tr><td><strong>{record.day}</strong></td><td>{fieldInput('bedtime', 'time')}</td><td>{fieldInput('wakeTime', 'time')}</td><td>{fieldInput('sleepDuration', 'number', '0.1')}</td><td>{fieldInput('sleepLatency')}</td><td>{fieldInput('nightAwakenings')}</td><td>{fieldInput('morningEnergy')}</td><td>{fieldInput('daytimeFocus')}</td><td>{fieldInput('caffeineTime', 'time')}</td><td>{fieldInput('exerciseTime', 'time')}</td><td>{fieldInput('sleepQuality')}</td></tr>;
}

function InterventionStage({ onNext }: { onNext: () => void }) {
  return <><Heading eyebrow="03 · One bounded intervention" title={demoSleepExperiment.title} copy={demoSleepExperiment.intervention} /><Card className="sleep-card"><CardHeader><div className="sleep-card-title-row"><Badge>Behavior protocol</Badge><Badge variant="outline">14 days</Badge></div><CardTitle>One change, then observe.</CardTitle><CardDescription>{demoSleepExperiment.rationale}</CardDescription></CardHeader><CardContent><div className="sleep-outcome-grid">{demoSleepExperiment.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}</div><div className="sleep-guardrails"><strong>Guardrails</strong>{demoSleepExperiment.guardrails.map((item) => <p key={item}>{item}</p>)}</div><div className="sleep-evidence"><strong>General education</strong>{sleepEvidence.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer">{item.title} · {item.source} ↗</a>)}</div></CardContent></Card><div className="sleep-next"><span>Primary question: <strong>{demoSleepGoal.question}</strong></span><Button onClick={onNext}>Start daily check-ins</Button></div></>;
}

function CheckInStage({ intervention, draft, updateDraft, saveCheckIn, loadIntervention, notice, onReport }: { intervention: SleepRecord[]; draft: SleepRecord; updateDraft: (field: keyof SleepRecord, value: string) => void; saveCheckIn: () => void; loadIntervention: () => void; notice: string; onReport: () => void }) {
  return <><Heading eyebrow="04 · Daily check-in" title="Record what happened, one day at a time." copy="Daily results are personal observations. They do not establish a diagnosis or prove that one behavior caused a change." /><div className="sleep-checkin-layout"><Card className="sleep-card"><CardHeader><Badge variant="outline">Day {Math.min(intervention.length + 1, 14)} of 14</Badge><CardTitle>Today’s local check-in</CardTitle><CardDescription>Keep other routines as steady as practical and note meaningful context.</CardDescription></CardHeader><CardContent><div className="sleep-form-grid"><label>Bedtime<Input type="time" value={draft.bedtime} onChange={(event) => updateDraft('bedtime', event.target.value)} /></label><label>Wake time<Input type="time" value={draft.wakeTime} onChange={(event) => updateDraft('wakeTime', event.target.value)} /></label><label>Sleep duration<Input type="number" step="0.1" value={draft.sleepDuration} onChange={(event) => updateDraft('sleepDuration', event.target.value)} /></label><label>Sleep latency (min)<Input type="number" value={draft.sleepLatency} onChange={(event) => updateDraft('sleepLatency', event.target.value)} /></label><label>Night awakenings<Input type="number" value={draft.nightAwakenings} onChange={(event) => updateDraft('nightAwakenings', event.target.value)} /></label><label>Morning energy (1–10)<Input type="number" min="1" max="10" value={draft.morningEnergy} onChange={(event) => updateDraft('morningEnergy', event.target.value)} /></label><label>Daytime focus (1–10)<Input type="number" min="1" max="10" value={draft.daytimeFocus} onChange={(event) => updateDraft('daytimeFocus', event.target.value)} /></label><label>Caffeine time<Input type="time" value={draft.caffeineTime} onChange={(event) => updateDraft('caffeineTime', event.target.value)} /></label><label>Exercise time<Input type="time" value={draft.exerciseTime} onChange={(event) => updateDraft('exerciseTime', event.target.value)} /></label><label>Sleep quality (1–10)<Input type="number" min="1" max="10" value={draft.sleepQuality} onChange={(event) => updateDraft('sleepQuality', event.target.value)} /></label></div><div className="sleep-action-row"><Button onClick={saveCheckIn} disabled={intervention.length >= 14}>Save local check-in</Button><Button variant="outline" onClick={loadIntervention}>Load synthetic 14-day sample</Button></div>{notice ? <p className="sleep-notice" role="status">{notice}</p> : null}</CardContent></Card><Card className="sleep-card sleep-progress-card"><CardHeader><Badge variant="outline">Observed so far</Badge><CardTitle>{intervention.length} of 14 days</CardTitle></CardHeader><CardContent><div className="sleep-progress"><span style={{ width: `${Math.min(100, (intervention.length / 14) * 100)}%` }} /></div><div className="sleep-metric-grid"><Metric label="Days logged" value={intervention.length} suffix=" / 14" /><Metric label="Next step" value={intervention.length >= 7 ? 'Review' : 'Keep logging'} /></div><Button variant="outline" onClick={onReport} disabled={!intervention.length}>Review current trend</Button></CardContent></Card></div></>;
}

function ReportStage({ report, disposition, baseline, intervention, downloadReport, notice }: { report: ReturnType<typeof buildSleepReport>; disposition: ReturnType<typeof recommendDisposition>; baseline: SleepRecord[]; intervention: SleepRecord[]; downloadReport: () => void; notice: string }) {
  const comparison = compareSleepPeriods(baseline, intervention);
  return <><Heading eyebrow="05 · Weekly learning report" title="What changed in this experiment?" copy="A reviewable personal observation from local synthetic data. It is not a medical conclusion." /><Card className="sleep-card"><CardHeader><div className="sleep-card-title-row"><Badge>Personal observation</Badge><Badge variant="outline">{intervention.length} intervention days</Badge></div><CardTitle>{report.summary}</CardTitle><CardDescription>Uncertainty stays visible so the next decision is proportionate to the evidence.</CardDescription></CardHeader><CardContent><div className="sleep-report-section"><strong>Goal</strong><p>{report.goal}</p></div><div className="sleep-report-section"><strong>Intervention</strong><p>{report.intervention}</p><p className="sleep-muted">Why it may be relevant: {report.rationale}</p></div><div className="sleep-report-section"><strong>Measured outcomes</strong><div className="sleep-metric-grid"><Metric label="Sleep duration" value={comparison.intervention.sleepDuration} suffix=" h" /><Metric label="Sleep quality" value={comparison.intervention.sleepQuality} suffix=" / 10" /><Metric label="Morning energy" value={comparison.intervention.morningEnergy} suffix=" / 10" /><Metric label="Daytime focus" value={comparison.intervention.daytimeFocus} suffix=" / 10" /></div></div><div className="sleep-report-section"><strong>What changed</strong><div className="sleep-change-list"><span>Sleep duration <b>{comparison.delta.sleepDuration >= 0 ? '+' : ''}{comparison.delta.sleepDuration} h</b></span><span>Sleep latency <b>{comparison.delta.sleepLatency >= 0 ? '+' : ''}{comparison.delta.sleepLatency} min</b></span><span>Night awakenings <b>{comparison.delta.nightAwakenings >= 0 ? '+' : ''}{comparison.delta.nightAwakenings}</b></span><span>Sleep quality <b>{comparison.delta.sleepQuality >= 0 ? '+' : ''}{comparison.delta.sleepQuality} / 10</b></span></div></div><div className="sleep-report-section"><strong>Limitations</strong>{report.limitations.map((item) => <p key={item} className="sleep-muted">{item}</p>)}</div><div className="sleep-report-section"><strong>What to discuss with a clinician</strong><p>{report.clinicianPrompt}</p></div><div className="sleep-disposition"><span>Next bounded decision</span><strong>{disposition.label}</strong><p>{disposition.explanation}</p></div><div className="sleep-action-row"><Button onClick={downloadReport}>Download local JSON report</Button>{notice ? <span role="status">{notice}</span> : null}</div></CardContent></Card></>;
}
