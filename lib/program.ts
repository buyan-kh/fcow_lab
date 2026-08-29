export type ProgramStage =
  | 'Target hypothesis'
  | 'Mechanism validation'
  | 'Modality selection'
  | 'Candidate design'
  | 'Preclinical development';

export type UncertaintySeverity = 'low' | 'moderate' | 'high';

export type ProgramUncertainty = {
  id: string;
  title: string;
  severity: UncertaintySeverity;
  status: 'open' | 'largely resolved';
};

export type Program = {
  id: string;
  code: string;
  name: string;
  indication: string;
  modality: string;
  stage: ProgramStage;
  updatedAt: string;
  uncertainties: ProgramUncertainty[];
};

export function getGatingUncertainty(program: Program): ProgramUncertainty {
  const openUncertainties = program.uncertainties.filter((uncertainty) => uncertainty.status === 'open');

  return [...openUncertainties].sort((a, b) => {
    const severityScore = { high: 3, moderate: 2, low: 1 } as const;
    return severityScore[b.severity] - severityScore[a.severity];
  })[0] ?? {
    id: 'u-none',
    title: 'No gating uncertainty recorded',
    severity: 'low',
    status: 'largely resolved',
  };
}
