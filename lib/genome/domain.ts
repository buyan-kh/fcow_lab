export type EvidenceState =
  | 'verified'
  | 'supportive'
  | 'conflicting'
  | 'uncertain'
  | 'missing'
  | 'research hypothesis'
  | 'requires experiment';

export type GenomeUpload = {
  id: string;
  filename: string;
  isSynthetic: true;
  sourceLabel: 'Built-in synthetic demo' | 'Local synthetic VCF';
  variantCount: number;
};

export type Variant = {
  id: string;
  chromosome: string;
  position: number;
  referenceAllele: string;
  alternateAllele: string;
  genotype: string;
  quality: number;
  filter: string;
  gene: string;
  transcript: string;
  variantType: 'SNV' | 'indel';
  clinicalSignificance: string;
  evidenceState: EvidenceState;
  sourceIds: string[];
};

export type Gene = { id: string; symbol: string; name: string; summary: string };
export type Pathway = { id: string; name: string; description: string; geneIds: string[] };
export type DiseaseAssociation = { id: string; name: string; context: string; geneIds: string[] };

export type EvidenceItem = {
  id: string;
  claim: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceIdentifier: string;
  publicationDate: string;
  retrievedDate: string;
  evidenceType: 'fixture association' | 'fixture literature' | 'fixture gap';
  evidenceState: EvidenceState;
  gene: string;
  variant?: string;
  disease: string;
  excerpt: string;
  limitations: string;
};

export type MechanismHypothesis = {
  id: string;
  title: string;
  statement: string;
  affectedGene: string;
  affectedPathway: string;
  disease: string;
  supportingEvidenceIds: string[];
  conflictingEvidenceIds: string[];
  missingEvidence: string[];
  confidenceLabel: 'low' | 'moderate' | 'high';
  falsifyingExperiment: string;
  status: 'research hypothesis' | 'requires experiment';
};

export type TherapeuticHypothesis = {
  id: string;
  mechanismHypothesisId: string;
  target: string;
  modality: string;
  candidateClass: string;
  knownExamples: string[];
  supportingEvidenceIds: string[];
  risks: string[];
  unknowns: string[];
  notForPersonalTreatment: true;
  validationPlan: string;
};

export type ValidationExperiment = {
  id: string;
  title: string;
  objective: string;
  assayType: string;
  falsifier: string;
  controls: string[];
  expectedDuration: string;
  status: 'proposed' | 'needs review' | 'queued';
};

export type ScoreFactor = { label: string; value: number; weight: number; reason: string };
export type ResearchPriorityScore = {
  label: string;
  value: number;
  factors: ScoreFactor[];
  isClinicalRiskScore: false;
};
export type ResearchPrioritization = {
  evidenceStrength: ResearchPriorityScore;
  mechanisticCoherence: ResearchPriorityScore;
  dataCompleteness: ResearchPriorityScore;
  evidenceConflict: ResearchPriorityScore;
  experimentalTractability: ResearchPriorityScore;
  therapeuticTractability: ResearchPriorityScore;
  humanRelevance: ResearchPriorityScore;
};

export type ResearchReport = {
  reportVersion: string;
  generatedAt: string;
  upload: GenomeUpload;
  variants: Variant[];
  evidence: EvidenceItem[];
  mechanismHypothesis: MechanismHypothesis;
  therapeuticHypothesis: TherapeuticHypothesis;
  validationExperiment: ValidationExperiment;
  prioritization: ResearchPrioritization;
  limitations: string[];
};

export type EvidenceAdapter = {
  annotate: (variants: Variant[]) => Promise<EvidenceItem[]>;
};
