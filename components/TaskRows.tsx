'use client';

import { useMemo, useState } from 'react';
import type { Experiment, ExperimentStatus } from '../data';

const filters: { label: string; value: 'all' | ExperimentStatus }[] = [{ label: 'All', value: 'all' }, { label: 'Queued', value: 'queued' }, { label: 'Running', value: 'running' }, { label: 'Review', value: 'needs review' }];

export function TaskRows({ experiments }: { experiments: Experiment[] }) {
  const [filter, setFilter] = useState<'all' | ExperimentStatus>('all');
  const visibleExperiments = useMemo(() => filter === 'all' ? experiments : experiments.filter((experiment) => experiment.status === filter), [experiments, filter]);
  return <section className="panel task-panel" aria-labelledby="experiment-queue-title"><div className="panel-heading task-heading"><div><span className="muted-kicker">Task rows</span><h2 id="experiment-queue-title">Experiment queue</h2></div><span className="count-badge">{experiments.length} active</span></div><div className="filter-row" role="group" aria-label="Filter experiments">{filters.map((item) => <button key={item.value} className={`filter-button ${filter === item.value ? 'filter-active' : ''}`} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div><div className="task-list">{visibleExperiments.map((experiment) => <div className="task-row" key={experiment.id}><span className={`task-status status-${experiment.status.replace(' ', '-')}`} aria-label={experiment.status} /><div className="task-copy"><strong>{experiment.title}</strong><span>{experiment.assay} <i>·</i> {experiment.owner}</span></div><span className={`task-signal signal-${experiment.status.replace(' ', '-')}`}>{experiment.signal}</span><button className="row-more" aria-label={`More options for ${experiment.title}`}>•••</button></div>)}{visibleExperiments.length === 0 && <div className="empty-task">No experiments in this view.</div>}</div></section>;
}
