'use client';

import { sections, type Section } from '../data';

type SidebarNavProps = { activeSection: Section; open: boolean; onSectionChange: (section: Section) => void; onClose: () => void };

export function SidebarNav({ activeSection, open, onSectionChange, onClose }: SidebarNavProps) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Workspace navigation">
      <div className="sidebar-topline"><div className="brand-mark" aria-hidden="true">F</div><div><p className="brand-name">Frontier Bio</p><p className="brand-subtitle">Evidence Console</p></div><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation">×</button></div>
      <div className="workspace-switcher"><span className="workspace-dot" aria-hidden="true" /><span>AX-014 workspace</span><span className="chevron" aria-hidden="true">⌄</span></div>
      <div className="nav-label">Workspace</div>
      <nav className="nav-list">
        {sections.map((section, index) => { const active = section.name === activeSection; return <button className={`nav-item ${active ? 'nav-item-active' : ''}`} key={section.name} onClick={() => { onSectionChange(section.name); onClose(); }} aria-current={active ? 'page' : undefined}><span className={`nav-glyph glyph-${index + 1}`} aria-hidden="true" /><span className="nav-item-copy"><span>{section.name}</span><small>{section.note}</small></span>{active && <span className="nav-active-dot" aria-hidden="true" />}</button>; })}
      </nav>
      <div className="nav-divider" /><div className="nav-label">Workspace tools</div>
      <div className="tool-list"><button className="tool-item"><span className="tool-symbol">⌕</span>Search evidence<span className="shortcut">⌘ K</span></button><button className="tool-item"><span className="tool-symbol">↗</span>Export decision log</button></div>
      <div className="sidebar-footer"><div className="status-line"><span className="status-pulse" /> Model online <span className="status-time">v0.3</span></div><div className="user-row"><span className="avatar">B</span><span><strong>Buyan</strong><small>Research lead</small></span><span className="more">•••</span></div></div>
    </aside>
  );
}
