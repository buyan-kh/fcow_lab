import { describe, expect, it } from 'vitest';
import { averageMetric, buildLabReport, buildSleepReport, compareSleepPeriods, formatExperimentStatus, recommendDisposition } from './analysis';
import { demoBaseline, demoCheckIns, demoExperiment, demoIntervention, demoProfile, demoSleepExperiment, demoSleepGoal } from './fixtures';

describe('personal lab analysis', () => {
  it('averages a metric from completed check-ins', () => {
    expect(averageMetric(demoCheckIns, 'sleepHours')).toBe(7.4);
  });

  it('builds a report that names the experiment and keeps the research boundary', () => {
    const report = buildLabReport(demoProfile, demoExperiment, demoCheckIns);
    expect(report.title).toContain('Afternoon caffeine cutoff');
    expect(report.boundary).toContain('not medical advice');
    expect(report.metrics.sleepHours).toBe(7.4);
  });

  it('uses explicit status language for an active experiment', () => {
    expect(formatExperimentStatus('active', 4, 14)).toBe('Day 4 of 14');
  });

  it('compares a seven-day baseline with the intervention period', () => {
    const result = compareSleepPeriods(demoBaseline, demoIntervention);
    expect(result.baseline.sleepDuration).toBe(6.9);
    expect(result.intervention.sleepDuration).toBe(7.5);
    expect(result.delta.sleepDuration).toBe(0.6);
    expect(result.daysLogged).toEqual({ baseline: 7, intervention: 14 });
  });

  it('recommends a bounded next step without making a medical claim', () => {
    const result = recommendDisposition(compareSleepPeriods(demoBaseline, demoIntervention));
    expect(['keep', 'modify', 'stop']).toContain(result.action);
    expect(result.explanation).toContain('observation');
    expect(result.explanation).not.toMatch(/disorder|diagnos|treat|prescription|dose/i);
  });

  it('builds a report that names limitations and clinician discussion guidance', () => {
    const report = buildSleepReport(demoSleepGoal, demoSleepExperiment, demoBaseline, demoIntervention);
    expect(report.summary).toContain('synthetic');
    expect(report.limitations.length).toBeGreaterThan(0);
    expect(report.clinicianPrompt).toContain('clinician');
  });
});
