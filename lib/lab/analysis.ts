import type { CheckIn, Experiment, LabReport, PersonalProfile } from './domain';

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
