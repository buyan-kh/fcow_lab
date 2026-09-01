import type { EvidenceState } from '@/lib/genome/domain';

const states: EvidenceState[] = ['verified', 'supportive', 'conflicting', 'uncertain', 'missing', 'research hypothesis', 'requires experiment'];

export default function StatusLegend() {
  return <div className="research-legend" aria-label="Evidence state legend">{states.map((state) => <span className={`research-state research-state-${state.replaceAll(' ', '-')}`} key={state}><i aria-hidden="true" />{state}</span>)}</div>;
}
