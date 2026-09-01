"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ModePlaceholder from './ModePlaceholder';
import SleepWellnessFlow from './SleepWellnessFlow';

type ProductMode = 'wellness' | 'explore' | 'clinical';

export default function PersonalLabWorkspace({ onCompanyMode }: { onCompanyMode: () => void }) {
  const [mode, setMode] = useState<ProductMode>('wellness');
  return <div className="lab-shell">
    <header className="lab-topbar">
      <div className="lab-brand"><span className="lab-brand-mark">F</span><div><strong>Frontier Bio</strong><span>Personal health research lab</span></div></div>
      <div className="lab-top-actions"><div className="lab-mode-switch" aria-label="Product mode">{([['wellness', 'Personal Wellness'], ['explore', 'Explore'], ['clinical', 'Clinical Navigation']] as const).map(([id, label]) => <Button key={id} variant={mode === id ? 'secondary' : 'ghost'} size="sm" aria-pressed={mode === id} onClick={() => setMode(id)}>{label}</Button>)}</div><Badge variant="outline" className="lab-local-badge">Local demo only</Badge><Button variant="outline" size="sm" onClick={onCompanyMode}>Company mode</Button></div>
    </header>
    <main className="lab-main">
      <section className="lab-safety" aria-label="Safety boundary"><div><strong>Research only · not medical advice</strong><p>Personal Wellness helps you run bounded behavior experiments from synthetic or local demo data. It does not diagnose, predict risk, prescribe, recommend dosage, or recommend drugs.</p></div><span>No real medical records are processed.</span></section>
      {mode === 'wellness' ? <SleepWellnessFlow /> : mode === 'explore' ? <ModePlaceholder title="Explore" description="Evidence retrieval and plain-language research context will live here next." /> : <ModePlaceholder title="Clinical Navigation" description="Synthetic care-navigation cases and clinician question prep will live here next." />}
    </main>
    <footer className="lab-footer"><span>Frontier Bio · local personal research lab</span><span>Synthetic fixture data · no health network calls</span></footer>
  </div>;
}
