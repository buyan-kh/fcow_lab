'use client';

import { useEffect, useState } from 'react';

const delays = [0, 90, 180, 90, 180, 270, 180, 270, 360];
export function LoadingState() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setElapsed((value) => value + 1), 100); return () => window.clearInterval(timer); }, []);
  return <div className="run-state" role="status"><span className="loading-grid" aria-hidden="true">{delays.map((delay, index) => <i key={index} style={{ animationDelay: `${delay}ms` }} />)}</span><span className="loading-label">Re-evaluating evidence trail</span><span className="font-mono text-[11px] text-ink-3 tabular-nums">{(elapsed / 10).toFixed(1)}s</span></div>;
}
