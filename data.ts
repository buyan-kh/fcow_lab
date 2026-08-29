import { getGatingUncertainty, type Program } from './lib/program';

export type Section = 'Overview' | 'Biology' | 'Experiments' | 'Molecules' | 'Development';
export type ExperimentStatus = 'queued' | 'running' | 'completed' | 'needs review';
export type EvidenceTone = 'green' | 'blue' | 'orange' | 'red';

export type EvidenceItem = {
  id: string;
  category: string;
  title: string;
  source: string;
  summary: string;
  detail: string;
  tone: EvidenceTone;
  confidence: 'high' | 'moderate' | 'low';
};

export type Experiment = {
  id: string;
  title: string;
  assay: string;
  owner: string;
  status: ExperimentStatus;
  signal: string;
  decisionImpact: number;
  informationGain: number;
  feasibility: number;
  cost: number;
  duration: string;
  falsifier: string;
  consequence: string;
};

export const sections: { name: Section; note: string }[] = [
  { name: 'Overview', note: 'Decision cockpit' },
  { name: 'Biology', note: 'Mechanism evidence' },
  { name: 'Experiments', note: 'Resolve uncertainty' },
  { name: 'Molecules', note: 'Modality gate' },
  { name: 'Development', note: 'Translational plan' },
];

export const program: Program = {
  id: 'fb-014',
  code: 'AX-014',
  name: 'IL-6R epithelial signaling',
  indication: 'Inflammatory bowel disease',
  modality: 'Small molecule',
  stage: 'Mechanism validation',
  updatedAt: '2026-08-29T09:42:00-07:00',
  uncertainties: [
    { id: 'u-mechanism', title: 'Is the pathway causal in disease-relevant tissue?', severity: 'moderate', status: 'largely resolved' },
    { id: 'u-translation', title: 'Does target inhibition translate across donors?', severity: 'high', status: 'open' },
    { id: 'u-biomarker', title: 'Can pathway response be measured prospectively?', severity: 'moderate', status: 'open' },
  ],
};

export const gatingUncertainty = {
  ...getGatingUncertainty(program),
  eyebrow: 'Gating uncertainty',
  body: 'The reference-line phenotype is reproducible, but we do not yet know whether target inhibition produces the same pathway response in primary donor material.',
  evidence: '3 supportive evidence items, 1 critical gap',
  decision: 'A positive donor-rescue signal unlocks modality selection and chemistry planning.',
};

export const initialEvidence: EvidenceItem[] = [
  {
    id: 'human-genetics', category: 'Human genetics', title: 'Genetic direction is aligned with target inhibition', source: 'GWAS + eQTL synthesis', summary: 'Supportive', detail: 'The human genetic signal points in the same direction as the target hypothesis. The association is not yet connected to a responder phenotype.', tone: 'green', confidence: 'moderate',
  },
  {
    id: 'perturbation', category: 'Perturbation biology', title: 'Target dependency is reproducible in one reference model', source: 'CRISPR knockout screen', summary: 'Model-limited', detail: 'The phenotype repeats in the current cell line. The translation question is whether primary donor tissue preserves the same dependency.', tone: 'blue', confidence: 'moderate',
  },
  {
    id: 'biomarker', category: 'Biomarker feasibility', title: 'pSTAT3 is a tractable proximal readout', source: 'Pathway marker time course', summary: 'Measurable', detail: 'The pathway marker moves with perturbation and provides a quantitative readout for a donor-rescue experiment.', tone: 'green', confidence: 'high',
  },
  {
    id: 'translation-gap', category: 'Translation gap', title: 'No donor-replicated rescue experiment yet', source: 'Evidence gap detected', summary: 'Missing', detail: 'This is the highest-value missing fact. A rescue study can distinguish target-specific biology from a context-specific viability effect before chemistry spend increases.', tone: 'orange', confidence: 'high',
  },
];

export const initialExperiments: Experiment[] = [
  {
    id: 'exp-01', title: 'Paired perturbation + rescue study', assay: 'Donor-derived epithelial cells', owner: 'External lab', status: 'queued', signal: 'Decision-critical', decisionImpact: 10, informationGain: 9, feasibility: 8, cost: 5, duration: '3 weeks', falsifier: 'No target-specific rescue across at least 3 donors.', consequence: 'Pause target program and redirect chemistry budget.',
  },
  {
    id: 'exp-02', title: 'Replicate target dependency screen', assay: 'Reference cell line panel', owner: 'Frontier Bio', status: 'running', signal: 'In progress', decisionImpact: 5, informationGain: 4, feasibility: 10, cost: 2, duration: '10 days', falsifier: 'Dependency is absent in two of three reference contexts.', consequence: 'Downgrade confidence and repeat mechanism review.',
  },
  {
    id: 'exp-03', title: 'Pathway marker time course', assay: 'Single-cell pSTAT3 readout', owner: 'Frontier Bio', status: 'completed', signal: 'Supports hypothesis', decisionImpact: 4, informationGain: 5, feasibility: 9, cost: 2, duration: '1 week', falsifier: 'Marker response is not dose- or time-consistent.', consequence: 'Rework biomarker strategy before donor testing.',
  },
  {
    id: 'exp-04', title: 'Off-target viability control', assay: 'Counter-screen panel', owner: 'External lab', status: 'needs review', signal: 'Review signal', decisionImpact: 6, informationGain: 6, feasibility: 7, cost: 4, duration: '2 weeks', falsifier: 'Phenotype persists under target-independent toxicity controls.', consequence: 'Invalidate current rescue interpretation.',
  },
];

export const decisionFlow = [
  { label: 'Target hypothesis', state: 'complete', caption: 'IL-6R pathway' },
  { label: 'Human evidence', state: 'complete', caption: 'Directionally aligned' },
  { label: 'Mechanism validation', state: 'active', caption: 'Resolve donor translation' },
  { label: 'Modality selection', state: 'next', caption: 'Blocked by evidence' },
  { label: 'Candidate design', state: 'next', caption: 'Not started' },
  { label: 'Development', state: 'next', caption: 'Not started' },
];

export const candidateShortlist = [
  { name: 'Modality gate', state: 'blocked', note: 'Biology selects modality after mechanism validation' },
  { name: 'Binding site hypothesis', state: 'unresolved', note: 'No chemistry spend committed' },
  { name: 'Lead series', state: 'not started', note: 'Awaiting translational evidence' },
];

export const decisionRecord = {
  question: 'What must be true before AX-014 enters chemistry planning?',
  recommendation: 'Run the paired perturbation + rescue study in donor-derived epithelial cells.',
  rationale: 'It has the highest expected decision impact because it tests target-specific mechanism in the most human-relevant available context.',
  criteria: 'Advance if rescue is observed across at least 3 donors with a pathway-consistent pSTAT3 response.',
  owner: 'Frontier Bio biology team',
  recorded: '29 Aug 2026, 09:42 PT',
};

export const promptResponses: Record<string, { title: string; body: string; chips: string[] }> = {
  'why is this the highest-value experiment?': {
    title: 'Because it can change the program decision',
    body: 'The rescue study tests target specificity in the most human-relevant context currently available. A positive result unlocks chemistry; a negative result prevents avoidable spend.',
    chips: ['Decision impact', 'Translation', 'Cost-aware'],
  },
  'what evidence would change the recommendation?': {
    title: 'A donor-replicated rescue signal',
    body: 'The recommendation strengthens if rescue is observed across multiple donors with pathway-consistent markers. It weakens if the phenotype disappears outside the reference line.',
    chips: ['Donor replication', 'Rescue', 'Mechanism'],
  },
};
