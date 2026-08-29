type RecommendationCardProps = { queued: boolean; dismissed: boolean; loading: boolean; onQueue: () => void; onDismiss: () => void; onRestore: () => void };

export function RecommendationCard({ queued, dismissed, loading, onQueue, onDismiss, onRestore }: RecommendationCardProps) {
  if (dismissed) return <section className="recommendation-card recommendation-dismissed" aria-live="polite"><div className="recommendation-dismissed-copy"><span className="muted-kicker">Recommendation hidden</span><strong>Keep the decision surface clean.</strong></div><button className="button button-quiet" onClick={onRestore}>Restore recommendation</button></section>;
  return <section className="recommendation-card" aria-labelledby="recommendation-title">
    <div className="recommendation-topline"><div className="ai-badge"><span className="sparkle" aria-hidden="true">✦</span> AI recommendation</div><span className="confidence"><span className="confidence-dot" /> High confidence</span></div>
    <div className="recommendation-heading"><span className="recommendation-index">01</span><div><p className="muted-kicker">Next-best experiment</p><h2 id="recommendation-title">Run a paired perturbation + rescue study</h2></div></div>
    <p className="recommendation-body">Test target specificity in donor-derived epithelial cells before increasing chemistry investment.</p>
    <div className="recommendation-meta"><div><span>Expected decision impact</span><strong>High</strong></div><div><span>Evidence gap closed</span><strong>Translation</strong></div><div><span>Lab route</span><strong>External</strong></div></div>
    <div className="chip-row"><span className="tool-chip chip-blue">Donor-derived model</span><span className="tool-chip chip-amber">Uncertainty resolver</span><span className="tool-chip">AX-014</span></div>
    {loading ? <div className="analysis-running" role="status"><span className="mini-loader" /> Re-evaluating evidence trail…</div> : <div className="recommendation-actions"><button className={`button button-primary ${queued ? 'button-success' : ''}`} onClick={onQueue}>{queued ? 'Experiment queued' : 'Queue experiment'} <span aria-hidden="true">→</span></button><button className="button button-quiet" onClick={onDismiss}>Dismiss</button></div>}
  </section>;
}
