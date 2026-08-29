'use client';

import { useState } from 'react';

export function PromptBar({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [value, setValue] = useState('');
  const submit = () => { const prompt = value.trim(); if (!prompt) return; onSubmit(prompt); setValue(''); };
  return <div className="prompt-wrap"><form className="prompt-bar" onSubmit={(event) => { event.preventDefault(); submit(); }}><span className="prompt-spark" aria-hidden="true">✦</span><input value={value} onChange={(event) => setValue(event.target.value)} aria-label="Ask Frontier Bio" placeholder="Ask about the decision, evidence, or next experiment…" /><span className="prompt-shortcut">⌘ ↵</span><button className="prompt-submit" type="submit" aria-label="Submit question">↑</button></form><div className="prompt-suggestions"><span>Try asking</span><button onClick={() => setValue('Why is this the highest-value experiment?')}>Why this experiment?</button><button onClick={() => setValue('What evidence would change the recommendation?')}>What would change it?</button></div></div>;
}
