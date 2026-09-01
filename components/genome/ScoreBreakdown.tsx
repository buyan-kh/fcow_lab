import type { ResearchPriorityScore } from '@/lib/genome/domain';

export default function ScoreBreakdown({ score }: { score: ResearchPriorityScore }) {
  return <div className="research-score"><div className="research-score-head"><strong>{score.label}</strong><span>{score.value}/10</span></div><div className="research-score-track"><i style={{ width: `${score.value * 10}%` }} /></div><div className="research-score-factors">{score.factors.map((factor) => <div key={factor.label}><span>{factor.label}</span><strong>{factor.value}</strong><small>{factor.reason}</small></div>)}</div></div>;
}
