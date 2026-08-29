import { decisionFlow } from '../data';

export function DecisionFlow() {
  return <section className="panel flow-panel" aria-labelledby="decision-flow-title"><div className="panel-heading"><div><span className="muted-kicker">Program map</span><h2 id="decision-flow-title">Decision flow</h2></div><span className="flow-live"><span /> Live</span></div><div className="flow-list">{decisionFlow.map((node, index) => <div className="flow-node-wrap" key={node.label}><div className={`flow-node flow-${node.state}`}><span className="flow-node-dot" /><div><strong>{node.label}</strong><small>{node.caption}</small></div>{node.state === 'active' && <span className="flow-node-arrow">→</span>}</div>{index < decisionFlow.length - 1 && <div className={`flow-connector ${node.state === 'complete' ? 'connector-complete' : ''}`} aria-hidden="true" />}</div>)}</div></section>;
}
