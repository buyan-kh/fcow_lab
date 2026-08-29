'use client';

import { useState } from 'react';

const STEPS = [['think', 'Thinking', 'Weighting decision impact'], ['read', 'Read evidence', '9 source chunks'], ['run', 'Select experiment', 'Information gain'], ['write', 'Write decision log', 'AX-014 / next action']];
export function ToolChips({ complete }: { complete: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  return <div className="bio-panel"><button className="flex items-center gap-1.5 text-[12px] text-ink-2" onClick={() => setOpen(open ? null : 'header')} aria-expanded={Boolean(open)}><span className="text-ink-3">⌄</span><span>{complete ? '4 tool calls, 1 decision' : '4 tool calls, 2 messages'}</span></button><div className="mt-2 flex flex-col gap-1.5">{STEPS.map(([icon, label, chip], index) => <button key={label} className="group flex min-w-0 items-center gap-2 rounded-control px-1.5 py-1 text-left hover:bg-hover-2" onClick={() => setOpen(open === label ? null : label)} aria-expanded={open === label}><span className="flex size-4 shrink-0 items-center justify-center text-ink-3">{icon === 'think' ? '✦' : icon === 'read' ? '□' : icon === 'run' ? '›' : '↗'}</span><span className="shrink-0 text-[12px] font-medium text-ink">{label}</span><span className="min-w-0 flex-1 truncate rounded-chip bg-field px-1.5 py-0.5 font-mono text-[10px] text-ink-2">{chip}</span><span className="font-mono text-[10px] text-ink-3">{index + 1}</span>{open === label && <span className="absolute" />}</button>)}{open && open !== 'header' && <div className="ml-6 border-l border-line pl-3 text-[11px] leading-relaxed text-ink-2">{STEPS.find(([,, chip]) => chip === open)?.[2] ?? 'Decision trace expanded.'}</div>}</div></div>;
}
