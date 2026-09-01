import { describe, expect, it } from 'vitest';
import { createResearchReport, renderResearchReportJson, renderResearchReportMarkdown } from './analysis';
import { demoDiseases, demoEvidence, demoExperiment, demoGenes, demoPathways, demoUpload, demoVariants } from './fixtures';
import { generateMechanismHypothesis, generateTherapeuticHypothesis, calculateResearchPrioritization } from './analysis';

describe('research report generation', () => {
  it('renders Markdown and JSON with provenance and limitations but no original VCF text', () => {
    const mechanism = generateMechanismHypothesis(demoVariants, demoEvidence, demoGenes, demoPathways, demoDiseases);
    const report = createResearchReport({ upload: demoUpload, variants: demoVariants, evidence: demoEvidence, mechanismHypothesis: mechanism, therapeuticHypothesis: generateTherapeuticHypothesis(mechanism), validationExperiment: demoExperiment, prioritization: calculateResearchPrioritization({ evidenceCount: 2, conflictCount: 1, missingCount: 1, experimentFeasibility: 7, humanRelevance: 8, therapeuticEvidence: 4 }) });
    const markdown = renderResearchReportMarkdown(report);
    const json = renderResearchReportJson(report);
    expect(markdown).toMatch(/research only/i);
    expect(markdown).toMatch(/FB-FIX-A-001/);
    expect(markdown).toMatch(/not a diagnosis/i);
    expect(json).toContain('GENE-X1');
    expect(json).not.toContain('##frontier_bio_synthetic=true');
    expect(json).toContain('limitations');
  });
});
