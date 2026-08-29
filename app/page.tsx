"use client";

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DecisionRecord from '@/components/DecisionRecord';
import DiscoveryPipeline from '@/components/DiscoveryPipeline';
import LoadingState from '@/components/LoadingState';
import ThinkingState from '@/components/ThinkingState';
import ToolChips from '@/components/ToolChips';
import {
  candidateShortlist,
  decisionFlow,
  decisionRecord,
  gatingUncertainty,
  initialEvidence,
  initialExperiments,
  program,
  promptResponses,
  sections,
  type Experiment,
  type Section,
} from '@/data';
import { rankExperiments } from '@/lib/decision';

const experimentCandidates = initialExperiments.map(({ id, title, decisionImpact, informationGain, feasibility, cost }) => ({
  id,
  title,
  decisionImpact,
  informationGain,
  feasibility,
  cost,
}));

const rankedIds = rankExperiments(experimentCandidates).map((experiment) => experiment.id);

function Sidebar({ activeSection, onSelect }: { activeSection: Section; onSelect: (section: Section) => void }) {
  return (
    <aside className="workspace-sidebar">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">F</span>
        <div>
          <strong>Frontier Bio</strong>
          <span>Research workspace</span>
        </div>
      </div>
      <div className="sidebar-rule" />
      <p className="sidebar-label">Workspace</p>
      <nav className="sidebar-nav" aria-label="Workspace navigation">
        {sections.map((section) => (
          <button
            key={section.name}
            type="button"
            className={activeSection === section.name ? 'sidebar-link sidebar-link-active' : 'sidebar-link'}
            onClick={() => onSelect(section.name)}
          >
            <span>{section.name}</span>
            <small>{section.note}</small>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <p className="sidebar-label">Portfolio</p>
        <div className="portfolio-item">
          <span className="portfolio-dot" />
          <div><strong>{program.code}</strong><small>Mechanism validation</small></div>
        </div>
        <div className="portfolio-item portfolio-item-muted">
          <span className="portfolio-dot" />
          <div><strong>New program</strong><small>Not yet scoped</small></div>
        </div>
      </div>
    </aside>
  );
}

function EvidenceList() {
  return (
    <div className="evidence-list">
      {initialEvidence.map((item) => (
        <div className="evidence-row" key={item.id}>
          <span className={`evidence-status evidence-status-${item.tone}`} aria-hidden="true" />
          <div className="evidence-main">
            <div className="evidence-title-row">
              <strong>{item.title}</strong>
              <Badge variant="outline">{item.summary}</Badge>
            </div>
            <p>{item.detail}</p>
            <span className="evidence-source">{item.category} · {item.source} · {item.confidence} confidence</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperimentRow({ experiment, selected, onSelect }: { experiment: Experiment; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={selected ? 'experiment-row experiment-row-selected' : 'experiment-row'} onClick={onSelect}>
      <span className="experiment-rank">{rankedIds.indexOf(experiment.id) + 1}</span>
      <span className="experiment-main">
        <strong>{experiment.title}</strong>
        <span>{experiment.assay} · {experiment.owner}</span>
      </span>
      <span className="experiment-score"><strong>{experiment.decisionImpact}/10</strong><span>decision impact</span></span>
      <Badge variant={experiment.status === 'queued' ? 'default' : 'secondary'}>{experiment.status}</Badge>
    </button>
  );
}

function MoleculeGate() {
  return (
    <Card className="workspace-card">
      <CardHeader className="workspace-card-header">
        <div><p className="workspace-kicker">Downstream asset work</p><CardTitle>Modality and candidate gate</CardTitle></div>
        <Badge variant="secondary">Not yet unlocked</Badge>
      </CardHeader>
      <CardContent>
        <p className="section-intro">Frontier Bio does not choose a modality before the mechanism earns it. The current program is modeled as a small-molecule default, pending translational evidence.</p>
        <div className="candidate-list">
          {candidateShortlist.map((candidate) => (
            <div className="candidate-row" key={candidate.name}>
              <div><strong>{candidate.name}</strong><p>{candidate.note}</p></div>
              <Badge variant="outline">{candidate.state}</Badge>
            </div>
          ))}
        </div>
        <div className="notice-box">Illustrative internal view. No discovered drug candidate is represented here.</div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('Overview');
  const [selectedId, setSelectedId] = useState('exp-01');
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<{ title: string; body: string; chips: string[] } | null>(null);
  const selectedExperiment = initialExperiments.find((experiment) => experiment.id === selectedId) ?? initialExperiments[0];
  const selectedRank = rankedIds.indexOf(selectedExperiment.id) + 1;
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(program.updatedAt)), []);

  const selectSection = (section: Section) => setActiveSection(section);
  const runAnalysis = () => {
    setAnalysisComplete(false);
    setAnalysisRunning(true);
    window.setTimeout(() => {
      setAnalysisRunning(false);
      setAnalysisComplete(true);
    }, 3600);
  };
  const submitPrompt = (value = prompt) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;
    setResponse(promptResponses[normalized] ?? {
      title: 'The program is still gated on translation',
      body: 'Ask about the recommendation, falsifier, or evidence gap to inspect the reasoning behind this decision.',
      chips: ['Translation', 'Falsifier', 'Evidence gap'],
    });
    setPrompt('');
  };

  return (
    <div className="workspace-shell">
      <Sidebar activeSection={activeSection} onSelect={selectSection} />
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="mobile-nav">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm">Menu</Button></SheetTrigger>
              <SheetContent side="left">
                <SheetHeader><SheetTitle>Frontier Bio</SheetTitle><SheetDescription>Research workspace navigation</SheetDescription></SheetHeader>
                <div className="mobile-nav-list">{sections.map((section) => <SheetClose asChild key={section.name}><Button variant={activeSection === section.name ? 'secondary' : 'ghost'} onClick={() => selectSection(section.name)}>{section.name}</Button></SheetClose>)}</div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="topbar-context"><span className="topbar-dot" />Internal program view <span>/</span> {program.code}</div>
          <div className="topbar-actions"><Badge variant="outline">Private workspace</Badge><Button variant="outline" size="sm" onClick={runAnalysis}>Re-run analysis</Button></div>
        </header>

        <div className="workspace-content">
          <div className="program-heading">
            <div>
              <p className="workspace-kicker">Program {program.code}</p>
              <h1>{program.name}</h1>
              <p className="program-subtitle">{program.indication} <span>·</span> {program.modality} <span>·</span> {program.stage}</p>
            </div>
            <div className="program-heading-meta"><span>Last updated</span><strong>{dateLabel}, 09:42 PT</strong></div>
          </div>

          <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as Section)} className="workspace-tabs">
            <TabsList variant="line">
              {sections.map((section) => <TabsTrigger key={section.name} value={section.name}>{section.name}</TabsTrigger>)}
            </TabsList>

            <TabsContent value="Overview" className="workspace-tab-content">
              <section className="decision-banner">
                <div className="decision-banner-copy"><p className="workspace-kicker">Current decision</p><h2>Should AX-014 move into chemistry planning?</h2><p>Not yet. The program needs one translational experiment before additional discovery capital is committed.</p></div>
                <div className="decision-banner-state"><Badge variant="destructive">Gated</Badge><span>Mechanism validation</span></div>
              </section>

              <section className="uncertainty-layout">
                <Card className="workspace-card uncertainty-card">
                  <CardHeader className="workspace-card-header"><div><p className="workspace-kicker">{gatingUncertainty.eyebrow}</p><CardTitle>{gatingUncertainty.title}</CardTitle></div><Badge variant="destructive">High uncertainty</Badge></CardHeader>
                  <CardContent><p className="uncertainty-body">{gatingUncertainty.body}</p><div className="uncertainty-facts"><div><span>Evidence state</span><strong>{gatingUncertainty.evidence}</strong></div><div><span>Decision consequence</span><strong>{gatingUncertainty.decision}</strong></div></div></CardContent>
                </Card>
                <Card className="workspace-card metric-card"><CardContent><span className="metric-label">Open uncertainties</span><strong className="metric-number">2</strong><span className="metric-foot">1 high priority · 1 moderate</span><Separator /><span className="metric-label">Evidence items</span><strong className="metric-number">4</strong><span className="metric-foot">3 supportive · 1 missing</span></CardContent></Card>
              </section>

              <section className="recommendation-layout">
                <Card className="workspace-card recommendation-card">
                  <CardHeader className="workspace-card-header"><div><p className="workspace-kicker">Recommended next experiment</p><CardTitle>{selectedExperiment.title}</CardTitle></div><Badge>Rank {selectedRank} of {initialExperiments.length}</Badge></CardHeader>
                  <CardContent><p className="recommendation-lede">{selectedExperiment.assay} will test target-specific rescue in the most human-relevant context currently available.</p><div className="recommendation-grid"><div><span>Falsifier</span><strong>{selectedExperiment.falsifier}</strong></div><div><span>If falsified</span><strong>{selectedExperiment.consequence}</strong></div><div><span>Expected duration</span><strong>{selectedExperiment.duration}</strong></div><div><span>Owner</span><strong>{selectedExperiment.owner}</strong></div></div><div className="recommendation-actions"><Button onClick={runAnalysis}>Analyze decision</Button><Button variant="outline" onClick={() => setActiveSection('Experiments')}>Compare experiments</Button></div>{analysisRunning ? <div className="analysis-state"><ThinkingState variant="Steps" /><LoadingState label="Scoring evidence against the decision" variant="Drive" /><ToolChips /></div> : analysisComplete ? <div className="analysis-complete"><Badge variant="secondary">Analysis updated</Badge><span>The rescue study remains the highest-value experiment.</span></div> : null}</CardContent>
                </Card>
                <Card className="workspace-card evidence-card"><CardHeader className="workspace-card-header"><div><p className="workspace-kicker">Evidence supporting the decision</p><CardTitle>What we know so far</CardTitle></div><Button variant="ghost" size="sm" onClick={() => setActiveSection('Biology')}>View all</Button></CardHeader><CardContent><EvidenceList /></CardContent></Card>
              </section>
            </TabsContent>

            <TabsContent value="Biology" className="workspace-tab-content"><div className="section-heading"><div><p className="workspace-kicker">Biology and translational evidence</p><h2>Claims, sources, and unresolved gaps</h2></div><Badge variant="outline">4 evidence items</Badge></div><Card className="workspace-card"><CardContent><EvidenceList /></CardContent></Card><DecisionRecord {...decisionRecord} /></TabsContent>
            <TabsContent value="Experiments" className="workspace-tab-content"><div className="section-heading"><div><p className="workspace-kicker">Decision-critical work</p><h2>Rank experiments by information value</h2><p>Select a row to inspect its falsifier and capital consequence.</p></div><Badge variant="outline">4 candidates</Badge></div><Card className="workspace-card experiment-card"><CardContent className="experiment-list">{[...initialExperiments].sort((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id)).map((experiment) => <ExperimentRow key={experiment.id} experiment={experiment} selected={experiment.id === selectedId} onSelect={() => setSelectedId(experiment.id)} />)}</CardContent></Card><Card className="workspace-card selected-detail"><CardHeader className="workspace-card-header"><div><p className="workspace-kicker">Selected experiment</p><CardTitle>{selectedExperiment.title}</CardTitle></div><Badge variant="default">Decision impact {selectedExperiment.decisionImpact}/10</Badge></CardHeader><CardContent><div className="detail-columns"><div><span>Information gain</span><strong>{selectedExperiment.informationGain}/10</strong></div><div><span>Feasibility</span><strong>{selectedExperiment.feasibility}/10</strong></div><div><span>Estimated cost</span><strong>{selectedExperiment.cost}/10</strong></div><div><span>Falsifier</span><strong>{selectedExperiment.falsifier}</strong></div></div></CardContent></Card></TabsContent>
            <TabsContent value="Molecules" className="workspace-tab-content"><div className="section-heading"><div><p className="workspace-kicker">Molecule work</p><h2>Earn the modality decision with biology</h2><p>Chemistry remains intentionally unstarted until the mechanism survives the donor experiment.</p></div><Badge variant="secondary">Blocked</Badge></div><MoleculeGate /><DecisionRecord {...decisionRecord} /></TabsContent>
            <TabsContent value="Development" className="workspace-tab-content"><div className="section-heading"><div><p className="workspace-kicker">From mechanism to medicine</p><h2>Drug discovery operating path</h2><p>Each stage opens only when the prior uncertainty is resolved.</p></div><Badge variant="outline">Program map</Badge></div><DiscoveryPipeline stages={decisionFlow as { label: string; caption: string; status: 'complete' | 'active' | 'next' }[]} /><DecisionRecord {...decisionRecord} /></TabsContent>
          </Tabs>

          {activeSection === 'Overview' ? <section className="decision-record-wrap"><DecisionRecord {...decisionRecord} /></section> : null}

          <section className="prompt-section"><div className="prompt-heading"><div><p className="workspace-kicker">Ask the program</p><h2>Inspect the reasoning before you commit capital.</h2></div><span>Decision context stays attached to the program record.</span></div><div className="prompt-form"><Input value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submitPrompt(); }} placeholder="Ask why this experiment is ranked first..." /><Button onClick={() => submitPrompt()}>Ask</Button></div><div className="prompt-suggestions"><button type="button" onClick={() => submitPrompt('why is this the highest-value experiment?')}>Why is this the highest-value experiment?</button><button type="button" onClick={() => submitPrompt('what evidence would change the recommendation?')}>What evidence would change the recommendation?</button></div>{response ? <div className="prompt-response"><div><p className="workspace-kicker">Program answer</p><h3>{response.title}</h3><p>{response.body}</p><div className="response-chips">{response.chips.map((chip) => <Badge variant="secondary" key={chip}>{chip}</Badge>)}</div></div><Button variant="ghost" size="sm" onClick={() => setResponse(null)}>Dismiss</Button></div> : null}</section>
          <footer className="workspace-footer"><span>Frontier Bio · internal research system</span><span>Decision record v0.1 · {dateLabel}</span></footer>
        </div>
      </main>
    </div>
  );
}
