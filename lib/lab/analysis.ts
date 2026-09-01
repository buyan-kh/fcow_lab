import type { CheckIn, Experiment, LabReport, PersonalProfile, SleepComparison, SleepExperiment, SleepGoal, SleepRecord, SleepReport } from './domain';

export function averageMetric(checkIns: CheckIn[], metric: keyof CheckIn): number {
  if (!checkIns.length) return 0;
  const total = checkIns.reduce((sum, checkIn) => sum + Number(checkIn[metric] ?? 0), 0);
  return Math.round((total / checkIns.length) * 10) / 10;
}

export function formatExperimentStatus(status: Experiment['status'], day: number, duration: number): string {
  if (status === 'complete') return 'Complete';
  if (status === 'proposed') return 'Ready to start';
  return `Day ${day} of ${duration}`;
}

export function buildLabReport(profile: PersonalProfile, experiment: Experiment, checkIns: CheckIn[]): LabReport {
  const metrics = {
    sleepHours: averageMetric(checkIns, 'sleepHours'),
    energy: averageMetric(checkIns, 'energy'),
    focus: averageMetric(checkIns, 'focus'),
    caffeineMg: averageMetric(checkIns, 'caffeineMg'),
    movementMinutes: averageMetric(checkIns, 'movementMinutes'),
  };
  const baseline = profile.baseline.sleepHours;
  const delta = Math.round((metrics.sleepHours - baseline) * 10) / 10;
  return {
    title: `${experiment.title} · learning report`,
    summary: `${checkIns.length} of ${experiment.durationDays} days logged. Average sleep was ${metrics.sleepHours} hours (${delta >= 0 ? '+' : ''}${delta} vs baseline).`,
    boundary: 'Research only · not medical advice. This fixture report cannot diagnose, predict personal risk, or recommend treatment.',
    metrics,
    nextStep: 'Review the pattern with your own context; keep, modify, or stop the experiment based on how it felt and what you observed.',
  };
}

const sleepMetrics = ['sleepDuration', 'sleepLatency', 'nightAwakenings', 'morningEnergy', 'daytimeFocus', 'sleepQuality'] as const;
type SleepMetric = typeof sleepMetrics[number];
const round = (value: number) => Math.round(value * 10) / 10;
const averageSleepMetric = (records: SleepRecord[], metric: SleepMetric) => records.length ? round(records.reduce((sum, record) => sum + record[metric], 0) / records.length) : 0;

export function compareSleepPeriods(baseline: SleepRecord[], intervention: SleepRecord[]): SleepComparison {
  const baselineAverage = Object.fromEntries(sleepMetrics.map((metric) => [metric, averageSleepMetric(baseline, metric)])) as SleepComparison['baseline'];
  const interventionAverage = Object.fromEntries(sleepMetrics.map((metric) => [metric, averageSleepMetric(intervention, metric)])) as SleepComparison['intervention'];
  const delta = Object.fromEntries(sleepMetrics.map((metric) => [metric, round(interventionAverage[metric] - baselineAverage[metric])])) as SleepComparison['delta'];
  return { baseline: baselineAverage, intervention: interventionAverage, delta, daysLogged: { baseline: baseline.length, intervention: intervention.length } };
}

export function recommendDisposition(comparison: SleepComparison) {
  if (comparison.delta.sleepQuality < 0 && comparison.delta.morningEnergy < 0) return { action: 'stop' as const, label: 'Stop and review', explanation: 'This synthetic observation moved in an unfavorable direction across the primary quality and energy signals; stop the behavior experiment and discuss persistent symptoms with a clinician.' };
  if (comparison.daysLogged.intervention < 7 || comparison.delta.sleepQuality < 0 || comparison.delta.sleepDuration < 0) return { action: 'modify' as const, label: 'Modify and observe', explanation: 'This synthetic observation is mixed or incomplete; modify one part of the protocol or collect more consistent observations before drawing a conclusion.' };
  return { action: 'keep' as const, label: 'Keep for now', explanation: 'This synthetic observation is directionally favorable, but it is not proof of causation; keep the bounded behavior only if it remains practical and feels appropriate.' };
}

export function buildSleepReport(goal: SleepGoal, experiment: SleepExperiment, baseline: SleepRecord[], intervention: SleepRecord[]): SleepReport {
  const comparison = compareSleepPeriods(baseline, intervention);
  return {
    summary: `This synthetic learning report includes ${comparison.daysLogged.baseline} baseline days and ${comparison.daysLogged.intervention} intervention days. Sleep duration changed by ${comparison.delta.sleepDuration >= 0 ? '+' : ''}${comparison.delta.sleepDuration} hours on average.`,
    goal: `${goal.label}: ${goal.question}`,
    intervention: experiment.intervention,
    rationale: experiment.rationale,
    baseline: comparison.baseline,
    interventionAverage: comparison.intervention,
    delta: comparison.delta,
    limitations: ['This is synthetic fixture data, not a clinical measurement.', 'A short within-person observation cannot establish causation.', 'Self-reported context and adherence may be incomplete.'],
    clinicianPrompt: 'If sleep concerns persist, worsen, or affect daily life, discuss the pattern and your questions with a qualified clinician.',
    disposition: recommendDisposition(comparison),
  };
}
