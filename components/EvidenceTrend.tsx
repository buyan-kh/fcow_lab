'use client';

import { Liveline, type LivelinePoint, type LivelineSeries } from 'liveline';
import { useMemo } from 'react';

function points(values: number[]): LivelinePoint[] { const end = Math.floor(Date.now() / 1000); return values.map((value, index) => ({ time: end - (values.length - 1 - index) * 8, value })); }
export function EvidenceTrend({ refreshed }: { refreshed: boolean }) {
  const series: LivelineSeries[] = useMemo(() => [{ id: 'human', label: '', data: points([.32, .38, .42, .46, .51, .55, .59]), value: .59, color: 'var(--accent)' }, { id: 'model', label: '', data: points([.12, .15, .19, .23, .22, .28, .31]), value: .31, color: 'var(--orange)' }], []);
  return <div className="bio-panel"><div className="insight-summary"><div><span className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-3">Evidence trend</span><h2>{refreshed ? 'Rescue evidence is now the gating signal.' : 'Translation confidence is lagging target relevance.'}</h2></div><p>Illustrative model view · evidence strength across the current decision loop.</p><div className="insight-metric"><div><strong>{refreshed ? '0.59' : '0.46'}</strong><span>translation confidence</span></div><div className="chart-legend"><span><i />Human evidence</span><span><i className="legend-orange" />Model signal</span></div></div></div><div className="evidence-chart"><div className="chart-head"><span>Signal over time</span><span className="font-mono text-[9px] text-ink-3">last 7 updates</span></div><div className="chart-stage"><Liveline data={[]} value={0} series={series} theme="light" grid={false} pulse={false} window={48} paused scrub={false} cursor="default" lineWidth={2} padding={{ top: 14, right: 4, bottom: 10, left: 4 }} /></div></div></div>;
}
