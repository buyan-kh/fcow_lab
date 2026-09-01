import { describe, expect, it } from 'vitest';
import {
  calculateResearchPrioritization,
  classifyEvidenceState,
  detectConflictingEvidence,
  generateMechanismHypothesis,
  generateTherapeuticHypothesis,
  isPersonalTreatmentRecommendation,
} from './analysis';
import { demoEvidence, demoGenes, demoPathways, demoDiseases, demoVariants } from './fixtures';

describe('genome evidence analysis', () => {
  it('classifies evidence from source-backed states and preserves missing evidence', () => {
    expect(classifyEvidenceState({ evidenceState: 'supportive', sourceIdentifier: 'fixture-001' })).toBe('supportive');
    expect(classifyEvidenceState({ evidenceState: 'conflicting', sourceIdentifier: 'fixture-002' })).toBe('conflicting');
    expect(classifyEvidenceState({ evidenceState: 'missing', sourceIdentifier: '' })).toBe('missing');
  });

  it('detects conflicting evidence for the same gene and disease context', () => {
    expect(detectConflictingEvidence(demoEvidence)).toEqual(['GENE-X1::Inflammatory bowel disease (fixture)']);
  });

  it('generates a mechanism hypothesis with support, conflict, and a falsifying experiment', () => {
    const hypothesis = generateMechanismHypothesis(demoVariants, demoEvidence, demoGenes, demoPathways, demoDiseases);
    expect(hypothesis.status).toBe('research hypothesis');
    expect(hypothesis.supportingEvidenceIds).toContain('ev-support-1');
    expect(hypothesis.conflictingEvidenceIds).toContain('ev-conflict-1');
    expect(hypothesis.missingEvidence).toContain('relevant tissue function');
    expect(hypothesis.falsifyingExperiment).toMatch(/perturbation/i);
  });

  it('generates a disease-level therapeutic research hypothesis without personal treatment advice', () => {
    const mechanism = generateMechanismHypothesis(demoVariants, demoEvidence, demoGenes, demoPathways, demoDiseases);
    const therapeutic = generateTherapeuticHypothesis(mechanism);
    expect(therapeutic.notForPersonalTreatment).toBe(true);
    expect(therapeutic.candidateClass).toMatch(/targeted pathway modulation/i);
    expect(isPersonalTreatmentRecommendation(therapeutic.validationPlan)).toBe(false);
    expect(isPersonalTreatmentRecommendation('You should take drug X for your genome.')).toBe(true);
  });

  it('returns named contributing factors for research prioritization heuristics', () => {
    const scores = calculateResearchPrioritization({
      evidenceCount: 3,
      conflictCount: 1,
      missingCount: 1,
      experimentFeasibility: 7,
      humanRelevance: 8,
      therapeuticEvidence: 4,
    });
    expect(scores.evidenceStrength.factors.length).toBeGreaterThan(0);
    expect(scores.evidenceStrength.isClinicalRiskScore).toBe(false);
    expect(scores.experimentalTractability.factors.map((factor) => factor.label)).toContain('Assay feasibility');
  });
});
