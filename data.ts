export type Section = 'Programs' | 'Evidence' | 'Experiments' | 'Models';

export type ExperimentStatus = 'queued' | 'running' | 'completed' | 'needs review';

export type EvidenceItem = {
  id: string;
  category: string;
  title: string;
  source: string;
  summary: string;
  detail: string;
  tone: 'lime' | 'amber' | 'blue';
};

export type Experiment = {
  id: string;
  title: string;
  assay: string;
  owner: string;
  status: ExperimentStatus;
  signal: string;
};

export const sections: { name: Section; note: string }[] = [
  { name: 'Programs', note: 'Portfolio view' },
  { name: 'Evidence', note: 'Causal signals' },
  { name: 'Experiments', note: 'Next actions' },
  { name: 'Models', note: 'Reasoning systems' },
];

export const program = {
  code: 'AX-014',
  name: 'Target validation',
  indication: 'Inflammatory disease',
  modality: 'Small molecule',
  updated: 'Today, 09:42',
};

export const uncertainty = {
  eyebrow: 'Highest-value uncertainty',
  title: 'Will target inhibition translate to human disease biology?',
  body: 'The program has a strong perturbation signal, but no evidence yet that the mechanism survives donor-to-donor variation.',
  severity: 'High uncertainty',
  decision: 'Advance target validation',
  impact: 'Determines whether AX-014 moves into lead optimization.',
};

export const initialEvidence: EvidenceItem[] = [
  {
    id: 'human-genetics', category: 'Human genetics', title: 'Causal support is directionally aligned', source: 'GWAS + eQTL synthesis', summary: 'Supportive', detail: 'Human evidence points in the same direction as the target hypothesis, but the effect is not yet linked to a responder phenotype.', tone: 'lime',
  },
  {
    id: 'perturbation', category: 'Perturbation biology', title: 'Signal is strong in a single model', source: 'CRISPR knockout screen', summary: 'Model-limited', detail: 'The phenotype is reproducible in the current cell line. The key unknown is whether the pathway holds across primary donor material.', tone: 'blue',
  },
  {
    id: 'translation', category: 'Translation gap', title: 'No paired rescue experiment yet', source: 'Evidence gap detected', summary: 'Missing', detail: 'A rescue experiment would distinguish target-specific biology from a context-specific viability effect before chemistry spend increases.', tone: 'amber',
  },
];

export const initialExperiments: Experiment[] = [
  { id: 'exp-01', title: 'Paired perturbation + rescue study', assay: 'Donor-derived epithelial cells', owner: 'External lab', status: 'queued', signal: 'Decision-critical' },
  { id: 'exp-02', title: 'Replicate target dependency screen', assay: 'Reference cell line', owner: 'Frontier Bio', status: 'running', signal: 'In progress' },
  { id: 'exp-03', title: 'Pathway marker time course', assay: 'Single-cell readout', owner: 'Frontier Bio', status: 'completed', signal: 'Supports hypothesis' },
  { id: 'exp-04', title: 'Off-target viability control', assay: 'Counter-screen panel', owner: 'External lab', status: 'needs review', signal: 'Review signal' },
];

export const decisionFlow = [
  { label: 'Target hypothesis', state: 'complete', caption: 'IL-6R pathway' },
  { label: 'Human evidence', state: 'complete', caption: 'Directionally aligned' },
  { label: 'Mechanism validation', state: 'active', caption: 'Resolve translation gap' },
  { label: 'Lead optimization', state: 'next', caption: 'Blocked by evidence' },
];

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
