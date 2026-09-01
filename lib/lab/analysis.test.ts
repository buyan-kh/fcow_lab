import { describe, expect, it } from 'vitest';
import { averageMetric, buildLabReport, formatExperimentStatus } from './analysis';
import { demoCheckIns, demoExperiment, demoProfile } from './fixtures';

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
});
