import type { CheckIn, Experiment, LabGoal, PersonalProfile, SleepExperiment, SleepGoal, SleepRecord } from './domain';

export const labGoals: LabGoal[] = [
  { id: 'sleep', label: 'Sleep', description: 'Consistency, duration, and recovery signals' },
  { id: 'energy', label: 'Energy', description: 'Steadier energy across the day' },
  { id: 'focus', label: 'Focus', description: 'Protect deep-work windows' },
  { id: 'body-composition', label: 'Body composition', description: 'Track habits and trend direction' },
  { id: 'strength', label: 'Strength', description: 'Train consistently and recover' },
  { id: 'metabolic-health', label: 'Metabolic health', description: 'Organize signals for research' },
  { id: 'stress', label: 'Stress', description: 'Notice patterns in load and recovery' },
  { id: 'healthy-aging', label: 'Healthy aging', description: 'Build sustainable routines' },
];

export const demoProfile: PersonalProfile = {
  name: 'Demo participant',
  goals: ['sleep', 'focus'],
  baseline: { sleepHours: 6.8, energy: 5, focus: 6, caffeineMg: 280, movementMinutes: 34 },
  dataSources: ['Synthetic wearable summary', 'Manual demo check-in'],
  lastUpdated: '2026-09-01',
};

export const demoExperiment: Experiment = {
  id: 'afternoon-caffeine-cutoff',
  title: 'Afternoon caffeine cutoff',
  objective: 'Test whether moving caffeine earlier is associated with more consistent sleep duration and next-day focus.',
  protocol: ['Keep your usual morning caffeine routine.', 'Avoid caffeine after 13:00 for 14 days.', 'Log sleep, energy, focus, and any context each morning.'],
  durationDays: 14,
  primaryMetric: 'sleepHours',
  guardrails: ['This is a reversible behavior experiment, not treatment.', 'Do not change prescribed medication based on this workspace.', 'Stop and seek qualified care if you feel unwell.'],
  status: 'active',
};

export const demoCheckIns: CheckIn[] = [
  { day: 1, sleepHours: 6.9, energy: 5, focus: 6, caffeineMg: 260, movementMinutes: 30 },
  { day: 2, sleepHours: 7.1, energy: 6, focus: 6, caffeineMg: 240, movementMinutes: 36 },
  { day: 3, sleepHours: 7.3, energy: 6, focus: 7, caffeineMg: 220, movementMinutes: 40 },
  { day: 4, sleepHours: 8.3, energy: 7, focus: 8, caffeineMg: 180, movementMinutes: 42, note: 'Earlier cutoff felt manageable.' },
];

export const sleepGoals: SleepGoal[] = [
  { id: 'duration', label: 'Sleep duration', question: 'Can I make my sleep window more consistent?' },
  { id: 'timing', label: 'Sleep timing', question: 'Can I keep a steadier bedtime and wake time?' },
  { id: 'quality', label: 'Sleep quality', question: 'Can I wake feeling more restored?' },
];

export const demoSleepGoal = sleepGoals[2];

const syntheticBaselineValues = [6.7, 6.9, 6.8, 7.0, 6.6, 7.1, 7.2];
const syntheticInterventionValues = [7.2, 7.4, 7.3, 7.8, 7.6, 7.5, 7.4, 7.7, 7.6, 7.8, 7.3, 7.5, 7.4, 7.5];
const makeSleepRecord = (day: number, sleepDuration: number, phase: 'baseline' | 'intervention'): SleepRecord => ({
  day,
  bedtime: phase === 'baseline' ? '23:20' : '22:55',
  wakeTime: phase === 'baseline' ? '06:10' : '06:25',
  sleepDuration,
  sleepLatency: phase === 'baseline' ? 31 : 22,
  nightAwakenings: phase === 'baseline' ? 2 : 1,
  morningEnergy: phase === 'baseline' ? 5 : 6,
  daytimeFocus: phase === 'baseline' ? 6 : 7,
  caffeineTime: phase === 'baseline' ? '15:30' : '12:45',
  exerciseTime: phase === 'baseline' ? '19:10' : '17:45',
  sleepQuality: phase === 'baseline' ? 5 : 7,
  note: phase === 'intervention' && day === 4 ? 'Earlier cutoff felt manageable.' : undefined,
});

export const demoBaseline: SleepRecord[] = syntheticBaselineValues.map((value, index) => makeSleepRecord(index + 1, value, 'baseline'));
export const demoIntervention: SleepRecord[] = syntheticInterventionValues.map((value, index) => makeSleepRecord(index + 1, value, 'intervention'));

export const demoSleepExperiment: SleepExperiment = {
  id: 'synthetic-caffeine-cutoff',
  title: 'Move caffeine earlier',
  intervention: 'No caffeine after 13:00 for 14 days.',
  rationale: 'Caffeine timing is a controllable behavior that may be relevant to sleep onset and perceived sleep quality. This is an educational hypothesis, not a promise of effect.',
  durationDays: 14,
  outcomes: ['Sleep duration', 'Sleep timing', 'Sleep latency', 'Night awakenings', 'Morning energy', 'Daytime focus', 'Subjective sleep quality'],
  guardrails: ['Keep other routines as steady as practical.', 'Do not change prescribed medication based on this experiment.', 'Discuss persistent or concerning symptoms with a qualified clinician.'],
  phase: 'intervention',
};
