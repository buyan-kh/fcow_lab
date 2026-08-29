'use client';

import { useEffect, useState } from 'react';
import { ContextCards } from '../components/ContextCards';
import { EvidenceTrend } from '../components/EvidenceTrend';
import { PromptBar } from '../components/PromptBar';
import { RecommendationCard } from '../components/RecommendationCard';
import { SidebarNav } from '../components/SidebarNav';
import { TaskRows } from '../components/TaskRows';
import { ToolChips } from '../components/ToolChips';
import { initialEvidence, initialExperiments, program, promptResponses, type Section, uncertainty } from '../data';

export default function Home() {
  const [active, setActive] = useState<Section>('Programs');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [queued, setQueued] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [response, setResponse] = useState<{ title: string; body: string; chips: string[] } | null>(null);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => { setLoading(false); setComplete(true); }, 1600);
    return () => window.clearTimeout(timer);
  }, [loading]);

  const handlePrompt = (prompt: string) => {
    const normalized = prompt.toLowerCase();
    const key = Object.keys(promptResponses).find((item) => normalized.includes(item.replace('?', '')) || item.includes(normalized));
    setResponse(key ? promptResponses[key] : { title: 'That question is outside this demo', body: 'This console is scoped to target-validation evidence and next-experiment selection. Connect a real program workspace to extend the trace.', chips: ['Demo scope'] });
  };

  return <div className="app-frame">
    <SidebarNav active={active} open={sidebarOpen} onChange={setActive} onClose={() => setSidebarOpen(false)} />
    {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    <main className="app-main">
      <header className="app-header"><div className="app-header-left"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button><span className="header-context">Programs <span>/</span> <b>{program.code}</b></span></div><div className="app-header-right"><span className="header-badge"><i /> Illustrative dataset</span><button className="header-icon" aria-label="Notifications">◌</button><button className="header-icon" aria-label="Help">?</button></div></header>
      <div className="main-intro"><div><div className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">{program.code} / {program.name}</div><h1>{active === 'Programs' ? 'Resolve the uncertainty before the spend.' : active}</h1><p>AI-guided decision support for {program.indication.toLowerCase()} discovery.</p></div><div className="program-actions"><button className="ui-button ui-button-ghost" onClick={() => setActive('Evidence')}>View evidence <span aria-hidden="true">↗</span></button><button className="ui-button ui-button-primary" onClick={() => { setComplete(false); setLoading(true); }} disabled={loading}>{loading ? 'Analyzing…' : 'Run analysis'} <span aria-hidden="true">✦</span></button></div></div>
      <div className="meta-strip"><span><strong>Modality</strong> {program.modality}</span><span><strong>Stage</strong> Target validation</span><span><strong>Updated</strong> {program.updated}</span><span className="meta-state">● Decision in progress</span></div>

      <div className="console-grid"><div>
        <div className="section-header"><div><span className="section-index">01</span><h2>Highest-value uncertainty</h2></div><span className="decision-chip"><i />{uncertainty.severity}</span></div>
        <section className="uncertainty-panel"><h3>{uncertainty.title}</h3><p>{uncertainty.body}</p><div className="uncertainty-details"><span><small>Decision at stake</small><strong>{uncertainty.decision}</strong></span><span><small>Why it matters</small><strong>{uncertainty.impact}</strong></span></div></section>
        <RecommendationCard loading={loading} queued={queued} dismissed={dismissed} onQueue={() => setQueued(true)} onDismiss={() => setDismissed(true)} onRestore={() => setDismissed(false)} />
        <div className="source-row"><span className="font-mono text-[9px] uppercase tracking-[.1em] text-ink-3">Reasoning inputs</span><div className="source-chips"><span className="source-chip"><i />Human genetics</span><span className="source-chip"><i style={{ background: 'var(--green)' }} />Perturbation screens</span><span className="source-chip"><i style={{ background: 'var(--orange)' }} />Disease models</span><span className="source-chip">+ 6 sources</span></div></div>
      </div><ContextCards chunks={initialEvidence} /></div>

      <div className="bottom-grid"><TaskRows experiments={initialExperiments} /><EvidenceTrend refreshed={complete} /></div>
      <div className="bottom-wide"><ToolChips complete={complete} /><div className="bio-panel"><div className="section-header"><div><span className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-3">Program map</span><h2>Decision flow</h2></div><span className="font-mono text-[9px] text-green">Live</span></div><div className="mt-4 grid gap-1.5">{['Target hypothesis', 'Human evidence', 'Mechanism validation', 'Lead optimization'].map((label, index) => <div key={label} className={`flex items-center gap-2 rounded-control border px-2.5 py-2 ${index === 2 ? 'border-orange/40 bg-orange-tint' : index === 3 ? 'border-line bg-inset opacity-60' : 'border-line bg-surface'}`}><span className={`size-1.5 rounded-full ${index === 2 ? 'bg-orange' : index === 3 ? 'bg-ink-3' : 'bg-green'}`} /><span className="text-[11px] font-medium text-ink">{label}</span><span className="ml-auto font-mono text-[9px] text-ink-3">{index === 2 ? 'Resolve gap' : index === 3 ? 'Blocked' : 'Complete'}</span></div>)}</div></div></div>
      {response && <section className="prompt-response" aria-live="polite"><span className="response-mark">✦</span><div><span className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-3">Frontier reasoning</span><h2>{response.title}</h2><p>{response.body}</p><div className="flex flex-wrap gap-1.5">{response.chips.map((chip) => <span className="source-chip" key={chip}>{chip}</span>)}</div></div><button className="close-response" onClick={() => setResponse(null)} aria-label="Close response">×</button></section>}
      <PromptBar onSubmit={handlePrompt} /><footer className="footer-line"><span>Frontier Bio · Evidence Console</span><span>Prototype · local demo state</span></footer>
    </main>
  </div>;
}
