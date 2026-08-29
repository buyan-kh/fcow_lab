'use client';

import type { Section } from '../data';

const ITEMS: { name: Section; caption: string; shape: string }[] = [
  { name: 'Programs', caption: 'Portfolio view', shape: 'square' },
  { name: 'Evidence', caption: 'Causal signals', shape: 'circle' },
  { name: 'Experiments', caption: 'Next actions', shape: 'diamond' },
  { name: 'Models', caption: 'Reasoning systems', shape: 'arch' },
];

export function SidebarNav({ active, open, onChange, onClose }: { active: Section; open: boolean; onChange: (section: Section) => void; onClose: () => void }) {
  return <aside className={`app-sidebar ${open ? 'is-open' : ''}`} aria-label="Workspace navigation">
    <div className="brand-lockup"><span className="brand-glyph">F</span><div><div className="brand-name">Frontier Bio</div><div className="brand-caption">Evidence Console</div></div><button className="close-menu" onClick={onClose} aria-label="Close navigation">×</button></div>
    <div className="sidebar-switcher"><span className="switcher-dot" /> <span>AX-014 workspace</span><span className="switcher-chevron">⌄</span></div>
    <div className="sidebar-label">Workspace</div>
    <nav className="sidebar-nav">{ITEMS.map((item) => <button key={item.name} type="button" data-active={active === item.name} onClick={() => { onChange(item.name); onClose(); }} aria-current={active === item.name ? 'page' : undefined}><i className={`nav-dot ${item.shape}`} aria-hidden="true" /><span><b>{item.name}</b><small>{item.caption}</small></span></button>)}</nav>
    <div className="sidebar-spacer" />
    <div className="sidebar-status"><i /> Model online <span>v0.3</span></div>
    <div className="sidebar-user"><span className="user-avatar">B</span><span><strong>Buyan</strong><small>Research lead</small></span></div>
  </aside>;
}
