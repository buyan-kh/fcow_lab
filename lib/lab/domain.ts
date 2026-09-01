export type LabGoalId = 'sleep' | 'energy' | 'focus' | 'body-composition' | 'strength' | 'metabolic-health' | 'stress' | 'healthy-aging';

export type LabGoal = { id: LabGoalId; label: string; description: string };
export type DailyMetrics = { sleepHours: number; energy: number; focus: number; caffeineMg: number; movementMinutes: number };
export type CheckIn = DailyMetrics & { day: number; note?: string };
export type PersonalProfile = { name: string; goals: LabGoalId[]; baseline: DailyMetrics; dataSources: string[]; lastUpdated: string };
export type Experiment = { id: string; title: string; objective: string; protocol: string[]; durationDays: number; primaryMetric: keyof DailyMetrics; guardrails: string[]; status: 'proposed' | 'active' | 'complete' };
export type LabReport = { title: string; summary: string; boundary: string; metrics: DailyMetrics; nextStep: string };

export type SleepGoalId = 'duration' | 'timing' | 'quality';
export type SleepGoal = { id: SleepGoalId; label: string; question: string };
export type SleepRecord = {
  day: number;
  bedtime: string;
  wakeTime: string;
  sleepDuration: number;
  sleepLatency: number;
  nightAwakenings: number;
  morningEnergy: number;
  daytimeFocus: number;
  caffeineTime: string;
  exerciseTime: string;
  sleepQuality: number;
  note?: string;
};
export type SleepPhase = 'baseline' | 'intervention';
export type SleepExperiment = {
  id: string;
  title: string;
  intervention: string;
  rationale: string;
  durationDays: number;
  outcomes: string[];
  guardrails: string[];
  phase: SleepPhase;
};
type SleepAverages = { sleepDuration: number; sleepLatency: number; nightAwakenings: number; morningEnergy: number; daytimeFocus: number; sleepQuality: number };
export type SleepComparison = {
  baseline: SleepAverages;
  intervention: SleepAverages;
  delta: SleepAverages;
  daysLogged: { baseline: number; intervention: number };
};
export type Disposition = { action: 'keep' | 'modify' | 'stop'; label: string; explanation: string };
export type SleepReport = { summary: string; goal: string; intervention: string; rationale: string; baseline: SleepComparison['baseline']; interventionAverage: SleepComparison['intervention']; delta: SleepComparison['delta']; limitations: string[]; clinicianPrompt: string; disposition: Disposition };
export type EvidenceLink = { title: string; source: string; url: string; scope: string; fixture: true };
