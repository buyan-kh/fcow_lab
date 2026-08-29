'use client';

import { useState } from 'react';
import type { EvidenceItem } from '../data';

export function ContextCard({ item }: { item: EvidenceItem }) {
  const [expanded, setExpanded] = useState(false);
  return <article className={`context-card context-${item.tone}`}>
    <button className="context-trigger" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><span className="context-index">{item.id === 'human-genetics' ? '01' : item.id === 'perturbation' ? '02' : '03'}</span><span className="context-title-wrap"><span className="muted-kicker">{item.category}</span><strong>{item.title}</strong></span><span className={`status-pill pill-${item.tone}`}>{item.summary}</span><span className="context-chevron" aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <div className="context-source"><span className="source-dot" /> {item.source}</div>{expanded && <p className="context-detail">{item.detail}</p>}
  </article>;
}
