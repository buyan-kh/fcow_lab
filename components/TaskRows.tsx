'use client';

import { useState } from 'react';
import type { Experiment } from '../data';

export function TaskRows({ experiments }: { experiments: Experiment[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return <div className="bio-panel"><div className="section-header"><div><span className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-3">Task rows</span><h2>Experiment queue</h2></div><span className="font-mono text-[10px] text-ink-3">{experiments.length} active</span></div><div className="flex flex-col gap-2">{experiments.map((experiment) => { const active = open === experiment.id; return <div className="overflow-hidden rounded-card bg-surface shadow-card" key={experiment.id}><button className="flex h-11 w-full items-center gap-2.5 px-2.5 text-left" onClick={() => setOpen(active ? null : experiment.id)} aria-expanded={active}><span className={`size-2 shrink-0 rounded-full ${experiment.status === 'completed' ? 'bg-green' : experiment.status === 'running' ? 'bg-accent' : experiment.status === 'needs review' ? 'bg-orange' : 'bg-ink-3'}`} /><span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink">{experiment.title}</span><span className="hidden text-[11px] text-ink-3 sm:block">{experiment.signal}</span><span className="font-mono text-[11px] text-ink-3">{active ? '−' : '+'}</span></button>{active && <div className="grid grid-cols-[20px_1fr] gap-2.5 px-2.5 pb-3"><span className="mx-auto h-full w-px bg-line" /><div className="flex flex-col gap-1 text-[11px] text-ink-2"><span>{experiment.assay}</span><span className="font-mono text-[10px] text-ink-3">Owner · {experiment.owner}</span><span className="font-mono text-[10px] text-ink-3">Status · {experiment.status}</span></div></div>}</div>; })}</div></div>;
}
