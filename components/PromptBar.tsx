'use client';

import { useState } from 'react';

export function PromptBar({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');
  return <div className="prompt-shell"><form className="prompt-bar" onSubmit={(event) => { event.preventDefault(); const prompt = value.trim(); if (prompt) { onSubmit(prompt); setValue(''); } }}><span className="prompt-star">✦</span><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask about the decision, evidence, or next experiment…" aria-label="Ask Frontier Bio" /><span className="font-mono text-[9px] text-ink-3">⌘ ↵</span><button className="prompt-submit" type="submit" aria-label="Submit question">↑</button></form><div className="prompt-suggestions"><span>Try asking</span><button type="button" onClick={() => setValue('Why is this the highest-value experiment?')}>Why this experiment?</button><button type="button" onClick={() => setValue('What evidence would change the recommendation?')}>What would change it?</button></div></div>;
}
