import { describe, expect, it } from 'vitest';
import { rankExperiments, type ExperimentCandidate } from './decision';
import { getGatingUncertainty, type Program } from './program';

describe('rankExperiments', () => {
  it('puts the experiment with the highest decision impact and information gain first', () => {
    const candidates: ExperimentCandidate[] = [
      { id: 'cheap-but-weak', title: 'Repeat target screen', decisionImpact: 3, informationGain: 2, feasibility: 10, cost: 1 },
      { id: 'decision-critical', title: 'Paired perturbation and rescue', decisionImpact: 10, informationGain: 9, feasibility: 7, cost: 5 },
    ];

    expect(rankExperiments(candidates)[0].id).toBe('decision-critical');
  });

  it('selects translation as the gating uncertainty when mechanism evidence is strong but donor evidence is missing', () => {
    const program: Program = {
      id: 'fb-014',
      code: 'AX-014',
      name: 'IL-6R epithelial signaling',
      indication: 'Inflammatory bowel disease',
      modality: 'Small molecule',
      stage: 'Mechanism validation',
      updatedAt: '2026-08-29T09:42:00-07:00',
      uncertainties: [
        { id: 'u-mechanism', title: 'Is the pathway causal?', severity: 'moderate', status: 'largely resolved' },
        { id: 'u-translation', title: 'Does target inhibition translate across donors?', severity: 'high', status: 'open' },
      ],
    };

    expect(getGatingUncertainty(program).id).toBe('u-translation');
  });
});
