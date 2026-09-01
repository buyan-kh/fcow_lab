import type { DiseaseAssociation, EvidenceItem, Gene, GenomeUpload, MechanismHypothesis, Pathway, ResearchPrioritization, ResearchPriorityScore, ResearchReport, TherapeuticHypothesis, Variant } from './domain';

const forbiddenTreatmentPatterns = [/you\s+(should|must|need to)\s+(take|use|start|stop)/i, /prescrib/i, /dosage/i, /personalized\s+drug/i, /treat\s+your\s+genome/i, /you\s+have\s+\w+/i];

export function classifyEvidenceState(item: Pick<EvidenceItem, 'evidenceState' | 'sourceIdentifier'>): EvidenceItem['evidenceState'] {
  return item.sourceIdentifier.trim() ? item.evidenceState : 'missing';
}

export function detectConflictingEvidence(items: EvidenceItem[]): string[] {
  const contexts = new Map<string, Set<EvidenceItem['evidenceState']>>();
  for (const item of items) {
    const key = `${item.gene}::${item.disease}`;
    const states = contexts.get(key) ?? new Set<EvidenceItem['evidenceState']>();
    states.add(item.evidenceState);
    contexts.set(key, states);
  }
  return [...contexts.entries()].filter(([, states]) => states.has('supportive') && states.has('conflicting')).map(([key]) => key);
}

export function generateMechanismHypothesis(variants: Variant[], evidence: EvidenceItem[], genes: Gene[], pathways: Pathway[], diseases: DiseaseAssociation[]): MechanismHypothesis {
  const variant = variants[0];
  const gene = genes.find((item) => item.symbol === variant?.gene) ?? genes[0];
  const pathway = pathways.find((item) => item.geneIds.includes(gene.id)) ?? pathways[0];
  const disease = diseases.find((item) => item.geneIds.includes(gene.id)) ?? diseases[0];
  const supportingEvidenceIds = evidence.filter((item) => item.gene === gene.symbol && item.evidenceState === 'supportive').map((item) => item.id);
  const conflictingEvidenceIds = evidence.filter((item) => item.gene === gene.symbol && item.evidenceState === 'conflicting').map((item) => item.id);
  return {
    id: 'mh-fixture-1', title: `${gene.symbol} → ${pathway.name}`, statement: `A synthetic variant context in ${gene.symbol} may alter ${pathway.name}, which is relevant to ${disease.name} at a disease-level research context.`, affectedGene: gene.symbol, affectedPathway: pathway.name, disease: disease.name, supportingEvidenceIds, conflictingEvidenceIds,
    missingEvidence: ['relevant tissue function', 'replication across controlled contexts'], confidenceLabel: conflictingEvidenceIds.length ? 'moderate' : 'low', falsifyingExperiment: 'A controlled perturbation and rescue study fails to reproduce a pathway-consistent signal across synthetic donor contexts.', status: 'research hypothesis',
  };
}

export function generateTherapeuticHypothesis(mechanism: MechanismHypothesis): TherapeuticHypothesis {
  return {
    id: 'th-fixture-1', mechanismHypothesisId: mechanism.id, target: mechanism.affectedGene, modality: 'Modality-agnostic research exploration', candidateClass: 'Targeted pathway modulation (research class)', knownExamples: ['Publicly documented pathway inhibitor class (fixture link)', 'Publicly documented genetic perturbation class (fixture link)'], supportingEvidenceIds: mechanism.supportingEvidenceIds, risks: ['On-target effects may differ by tissue context', 'A coherent mechanism may not translate to efficacy'], unknowns: ['Causal direction remains unresolved', 'No individual response or clinical efficacy can be inferred'], notForPersonalTreatment: true, validationPlan: 'Compare perturbation and rescue assays in controlled models, then review public disease-level evidence. This is a research plan, not a treatment recommendation or instruction for self-experimentation.',
  };
}

function score(label: string, value: number, factors: ResearchPriorityScore['factors']): ResearchPriorityScore {
  return { label, value: Math.max(0, Math.min(10, Math.round(value))), factors, isClinicalRiskScore: false };
}

export function calculateResearchPrioritization(input: { evidenceCount: number; conflictCount: number; missingCount: number; experimentFeasibility: number; humanRelevance: number; therapeuticEvidence: number }): ResearchPrioritization {
  const evidence = Math.min(10, input.evidenceCount * 2 + 2);
  return {
    evidenceStrength: score('Evidence strength', evidence, [{ label: 'Source-backed items', value: input.evidenceCount, weight: 0.6, reason: 'Counts labeled fixture evidence items.' }, { label: 'Conflict penalty', value: input.conflictCount, weight: -0.4, reason: 'Mixed directions reduce prioritization.' }]),
    mechanisticCoherence: score('Mechanistic coherence', 7 - input.conflictCount, [{ label: 'Pathway linkage', value: 7, weight: 0.7, reason: 'Fixture graph links gene to pathway.' }, { label: 'Conflict penalty', value: input.conflictCount, weight: -0.3, reason: 'Conflicting fixtures lower coherence.' }]),
    dataCompleteness: score('Data completeness', 10 - input.missingCount * 3, [{ label: 'Missing evidence gaps', value: input.missingCount, weight: -0.5, reason: 'Explicit gaps lower completeness.' }]),
    evidenceConflict: score('Evidence conflict', input.conflictCount * 4, [{ label: 'Conflicting contexts', value: input.conflictCount, weight: 0.8, reason: 'Higher means more disagreement to resolve.' }]),
    experimentalTractability: score('Experimental tractability', input.experimentFeasibility, [{ label: 'Assay feasibility', value: input.experimentFeasibility, weight: 1, reason: 'Fixture estimate for the proposed assay.' }]),
    therapeuticTractability: score('Therapeutic tractability', input.therapeuticEvidence, [{ label: 'Public research precedent', value: input.therapeuticEvidence, weight: 1, reason: 'Disease-level fixture precedent only.' }]),
    humanRelevance: score('Human relevance', input.humanRelevance, [{ label: 'Context relevance', value: input.humanRelevance, weight: 1, reason: 'Fixture estimate; not a clinical score.' }]),
  };
}

export function isPersonalTreatmentRecommendation(text: string): boolean {
  return forbiddenTreatmentPatterns.some((pattern) => pattern.test(text));
}

export function assertResearchOnlyText(text: string): void {
  if (isPersonalTreatmentRecommendation(text)) throw new Error('Personal treatment recommendations are prohibited in research mode.');
}

export function createResearchReport(input: Omit<ResearchReport, 'reportVersion' | 'generatedAt' | 'limitations'> & { upload: GenomeUpload; generatedAt?: string }): ResearchReport {
  return {
    reportVersion: '0.1', generatedAt: input.generatedAt ?? new Date().toISOString(), upload: { ...input.upload }, variants: input.variants.map((variant) => ({ ...variant, sourceIds: [...variant.sourceIds] })), evidence: input.evidence.map((item) => ({ ...item })), mechanismHypothesis: { ...input.mechanismHypothesis, supportingEvidenceIds: [...input.mechanismHypothesis.supportingEvidenceIds], conflictingEvidenceIds: [...input.mechanismHypothesis.conflictingEvidenceIds], missingEvidence: [...input.mechanismHypothesis.missingEvidence] }, therapeuticHypothesis: { ...input.therapeuticHypothesis, knownExamples: [...input.therapeuticHypothesis.knownExamples], supportingEvidenceIds: [...input.therapeuticHypothesis.supportingEvidenceIds], risks: [...input.therapeuticHypothesis.risks], unknowns: [...input.therapeuticHypothesis.unknowns] }, validationExperiment: { ...input.validationExperiment, controls: [...input.validationExperiment.controls] }, prioritization: input.prioritization,
    limitations: ['Synthetic fixture data only; no clinical or individual inference.', 'Evidence is public-evidence fixture content and may be conflicting or missing.', 'Research prioritization heuristics are not clinical risk scores.', 'Do not use this output to change medication; consult a qualified clinician or genetic counselor for health decisions.'],
  };
}

export function renderResearchReportJson(report: ResearchReport): string {
  return JSON.stringify(report, null, 2);
}

export function renderResearchReportMarkdown(report: ResearchReport): string {
  const variantLines = report.variants.map((variant) => `- ${variant.id}: ${variant.chromosome}:${variant.position} ${variant.referenceAllele}>${variant.alternateAllele} · genotype ${variant.genotype} · quality ${variant.quality} · ${variant.evidenceState}`).join('\n');
  const evidenceLines = report.evidence.map((item) => `- **${item.evidenceState}** ${item.claim} — ${item.sourceTitle} (${item.sourceIdentifier})`).join('\n');
  return `# Frontier Bio Genome to Mechanism Research Report\n\n**Research only.** Not a diagnosis, medical advice, treatment recommendation, or personalized drug recommendation.\n\n## Input\n\n- ${report.upload.filename}\n- ${report.upload.sourceLabel}\n- ${report.upload.variantCount} normalized variants\n\n## Variant review\n\n${variantLines}\n\n## Evidence (fixture-labeled)\n\n${evidenceLines}\n\n## Mechanism hypothesis\n\n**${report.mechanismHypothesis.title}**\n\n${report.mechanismHypothesis.statement}\n\nStatus: ${report.mechanismHypothesis.status}; confidence: ${report.mechanismHypothesis.confidenceLabel}.\n\nMissing evidence: ${report.mechanismHypothesis.missingEvidence.join(', ')}.\n\nFalsifier: ${report.mechanismHypothesis.falsifyingExperiment}\n\n## Therapeutic research hypothesis\n\nTarget class: ${report.therapeuticHypothesis.candidateClass}\n\n${report.therapeuticHypothesis.validationPlan}\n\nKnown public examples are research context only: ${report.therapeuticHypothesis.knownExamples.join('; ')}.\n\n## Validation experiment\n\n**${report.validationExperiment.title}** — ${report.validationExperiment.assayType}.\n\n${report.validationExperiment.objective}\n\nFalsifier: ${report.validationExperiment.falsifier}\n\n## Limitations\n\n${report.limitations.map((limitation) => `- ${limitation}`).join('\n')}\n`;
}
