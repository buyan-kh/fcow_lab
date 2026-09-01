export type LabGoalId = 'sleep' | 'energy' | 'focus' | 'body-composition' | 'strength' | 'metabolic-health' | 'stress' | 'healthy-aging';

export type LabGoal = { id: LabGoalId; label: string; description: string };
export type DailyMetrics = { sleepHours: number; energy: number; focus: number; caffeineMg: number; movementMinutes: number };
export type CheckIn = DailyMetrics & { day: number; note?: string };
export type PersonalProfile = { name: string; goals: LabGoalId[]; baseline: DailyMetrics; dataSources: string[]; lastUpdated: string };
export type Experiment = { id: string; title: string; objective: string; protocol: string[]; durationDays: number; primaryMetric: keyof DailyMetrics; guardrails: string[]; status: 'proposed' | 'active' | 'complete' };
export type LabReport = { title: string; summary: string; boundary: string; metrics: DailyMetrics; nextStep: string };
