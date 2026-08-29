export type ExperimentCandidate = {
  id: string;
  title: string;
  decisionImpact: number;
  informationGain: number;
  feasibility: number;
  cost: number;
};

export function rankExperiments(candidates: ExperimentCandidate[]) {
  return [...candidates].sort((a, b) => {
    const scoreA = a.decisionImpact * 0.4 + a.informationGain * 0.35 + a.feasibility * 0.15 - a.cost * 0.1;
    const scoreB = b.decisionImpact * 0.4 + b.informationGain * 0.35 + b.feasibility * 0.15 - b.cost * 0.1;
    return scoreB - scoreA;
  });
}
