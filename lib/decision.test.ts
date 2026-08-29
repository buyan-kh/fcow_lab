import { describe, expect, it } from 'vitest';
import { rankExperiments, type ExperimentCandidate } from './decision';

describe('rankExperiments', () => {
  it('puts the experiment with the highest decision impact and information gain first', () => {
    const candidates: ExperimentCandidate[] = [
      { id: 'cheap-but-weak', title: 'Repeat target screen', decisionImpact: 3, informationGain: 2, feasibility: 10, cost: 1 },
      { id: 'decision-critical', title: 'Paired perturbation and rescue', decisionImpact: 10, informationGain: 9, feasibility: 7, cost: 5 },
    ];

    expect(rankExperiments(candidates)[0].id).toBe('decision-critical');
  });
});
