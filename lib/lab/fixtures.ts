import type { CheckIn, Experiment, LabGoal, PersonalProfile } from './domain';

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
