'use client';

import { useEffect, useState } from 'react';
import { ContextCard } from '../components/ContextCard';
import { DecisionFlow } from '../components/DecisionFlow';
import { InsightCard } from '../components/InsightCard';
import { PromptBar } from '../components/PromptBar';
import { RecommendationCard } from '../components/RecommendationCard';
import { SidebarNav } from '../components/SidebarNav';
import { TaskRows } from '../components/TaskRows';
import { initialEvidence, initialExperiments, program, promptResponses, type Section, uncertainty } from '../data';

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('Programs');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queued, setQueued] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [promptResponse, setPromptResponse] = useState<{ title: string; body: string; chips: string[] } | null>(null);

  useEffect(() => {
    if (!analysisRunning) return;
    const timer = window.setTimeout(() => { setAnalysisRunning(false); setAnalysisComplete(true); }, 1600);
    return () => window.clearTimeout(timer);
  }, [analysisRunning]);

  const runAnalysis = () => { setAnalysisComplete(false); setAnalysisRunning(true); };

  const handlePrompt = (prompt: string) => {
    const normalized = prompt.toLowerCase();
    const exact = Object.keys(promptResponses).find((key) => normalized.includes(key.replace('?', '')) || key.includes(normalized));
    setPromptResponse(exact ? promptResponses[exact] : { title: 'That question is outside this demo', body: 'The current console is scoped to target-validation evidence and experiment selection. Connect a real program workspace to extend the reasoning trace.', chips: ['Demo scope'] });
  };

  return <div className="app-shell">
    <SidebarNav activeSection={activeSection} open={sidebarOpen} onSectionChange={setActiveSection} onClose={() => setSidebarOpen(false)} />
    {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    <main className="main-content">
      <header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button><span className="topbar-context">Programs <span>/</span> {program.code}</span></div><div className="topbar-actions"><span className="demo-label"><span /> Illustrative dataset</span><button className="topbar-icon" aria-label="Notifications">◌</button><button className="topbar-icon" aria-label="Help">?</button></div></header>
      <div className="content-wrap">
        <section className="program-header"><div><div className="program-kicker"><span className="status-pulse" /> {program.code} <span className="slash">/</span> {program.name}</div><h1>{activeSection === 'Programs' ? 'Resolve the uncertainty before the spend.' : activeSection}</h1><p className="program-subtitle">AI-guided decision support for {program.indication.toLowerCase()} discovery.</p></div><div className="program-actions"><button className="button button-outline" onClick={() => setActiveSection('Evidence')}>View evidence <span aria-hidden="true">↗</span></button><button className="button button-primary" onClick={runAnalysis} disabled={analysisRunning}>{analysisRunning ? 'Analyzing…' : 'Run analysis'} <span aria-hidden="true">✦</span></button></div></section>
        <div className="program-strip"><span><strong>Modality</strong> {program.modality}</span><span><strong>Stage</strong> Target validation</span><span><strong>Last updated</strong> {program.updated}</span><span className="strip-status"><span className="status-pulse" /> Decision in progress</span></div>
        <div className="workspace-grid"><div className="workspace-primary">
          <section className="uncertainty-block"><div className="section-heading"><span className="number-label">01</span><div><span className="muted-kicker">{initialEvidence.length} evidence threads · weighted by decision impact</span><h2>{uncertainty.eyebrow}</h2></div><span className="severity-pill">{uncertainty.severity}<i /></span></div><div className="uncertainty-card"><div className="uncertainty-accent" /><h3>{uncertainty.title}</h3><p>{uncertainty.body}</p><div className="uncertainty-footer"><span><small>Decision at stake</small><strong>{uncertainty.decision}</strong></span><span><small>Why it matters</small><strong>{uncertainty.impact}</strong></span></div></div></section>
          <RecommendationCard queued={queued} dismissed={dismissed} loading={analysisRunning} onQueue={() => setQueued(true)} onDismiss={() => setDismissed(true)} onRestore={() => setDismissed(false)} />
          <div className="source-row"><span className="muted-kicker">Reasoning inputs</span><div className="tool-chip-row"><span className="tool-chip"><span className="chip-mark chip-mark-genetics" />Human genetics</span><span className="tool-chip"><span className="chip-mark chip-mark-perturb" />Perturbation screens</span><span className="tool-chip"><span className="chip-mark chip-mark-model" />Disease models</span><span className="tool-chip tool-chip-muted">+ 6 sources</span></div></div>
        </div><aside className="workspace-context"><div className="context-heading"><div><span className="muted-kicker">Context cards</span><h2>Evidence trail</h2></div><button className="text-button">View all <span aria-hidden="true">→</span></button></div><div className="context-list">{initialEvidence.map((item) => <ContextCard key={item.id} item={item} />)}</div><div className="context-note"><span className="note-icon">i</span><p><strong>Model note</strong> Evidence is weighted for its ability to change the next program decision, not for volume alone.</p></div></aside></div>
        <div className="lower-grid"><TaskRows experiments={initialExperiments} /><DecisionFlow /><InsightCard refreshed={analysisComplete} /></div>
        {promptResponse && <section className="prompt-response" aria-live="polite"><div className="response-orb">✦</div><div><span className="muted-kicker">Frontier reasoning</span><h2>{promptResponse.title}</h2><p>{promptResponse.body}</p><div className="chip-row">{promptResponse.chips.map((chip) => <span className="tool-chip" key={chip}>{chip}</span>)}</div></div><button className="icon-button" onClick={() => setPromptResponse(null)} aria-label="Close response">×</button></section>}
        <PromptBar onSubmit={handlePrompt} /><footer className="page-footer"><span>Frontier Bio · Evidence Console</span><span>Prototype · local demo state</span></footer>
      </div>
    </main>
  </div>;
}
