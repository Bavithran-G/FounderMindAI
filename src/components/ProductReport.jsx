import React from 'react';
import { Expandable } from './ui/Expandable';

export const ProductReport = ({ data }) => (
  <div className="fade-in">

    <div className="editorial-section-header" style={{ marginTop: 16 }}>
      <div className="header-number">01</div>
      <div className="header-title">Core User Flow</div>
      <div className="header-line"></div>
    </div>

    <div className="flow-horizontal" style={{ marginBottom: 48 }}>
      {data.userFlow.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flow-node">
            <div className="flow-label">Step 0{i + 1}</div>
            <div className="flow-value" style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginTop: 4 }}>
              {step.substring(0, 40)}{step.length > 40 ? '...' : ''}
            </div>
          </div>
          {i < data.userFlow.length - 1 && <div className="flow-arrow">→</div>}
        </React.Fragment>
      ))}
    </div>

    <div className="editorial-section-header">
      <div className="header-number">02</div>
      <div className="header-title">MVP Core Features</div>
      <div className="header-line"></div>
    </div>

    <div className="numbered-intelligence" style={{ marginBottom: 48 }}>
      {data.mvpFeatures.map((f, i) => (
        <div key={i} className="intelligence-item" style={{ alignItems: 'center' }}>
          <div className="intelligence-num">0{i + 1}</div>
          <div className="intelligence-text" style={{ flex: 1, padding: 0 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.split(':')[0]}</span>
            {f.includes(':') && (
              <Expandable label="Details →">{f.substring(f.indexOf(':') + 1).trim()}</Expandable>
            )}
          </div>
          <span
            className={`priority-badge ${i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low'}`}
            style={{ flexShrink: 0 }}
          >
            {i === 0 ? 'Must Have' : i === 1 ? 'High Priority' : 'Important'}
          </span>
        </div>
      ))}
    </div>

    <div className="editorial-section-header">
      <div className="header-number">03</div>
      <div className="header-title">Development Roadmap</div>
      <div className="header-line"></div>
    </div>

    <div className="roadmap-grid" style={{ marginBottom: 48 }}>
      {data.roadmap.map((phase, i) => (
        <div key={i} className="roadmap-phase" style={{ background: 'var(--glass-10)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
          <div className="roadmap-phase-name">{phase.phase}</div>
          <div className="roadmap-duration" style={{ color: 'var(--blue)' }}>{phase.duration}</div>
          {phase.goals.slice(0, 2).map((g, j) => (
            <div key={j} className="roadmap-goal">{g}</div>
          ))}
          {phase.goals.length > 2 && (
            <div style={{ marginTop: 12 }}>
              <Expandable label={`+${phase.goals.length - 2} goals →`}>
                {phase.goals.slice(2).map((g, j) => (
                  <div key={j} className="roadmap-goal" style={{ marginBottom: 4 }}>{g}</div>
                ))}
              </Expandable>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="editorial-section-header">
      <div className="header-number">04</div>
      <div className="header-title">Recommended Stack</div>
      <div className="header-line"></div>
    </div>

    <div className="editorial-columns" style={{ gap: '16px' }}>
      {data.techStack.map((cat, i) => (
        <div key={i} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '16px' }}>
          <div className="flow-label" style={{ marginBottom: 8, textTransform: 'capitalize' }}>{cat.category}</div>
          <div className="tag-list" style={{ gap: '6px' }}>
            {cat.tools.map((tool, j) => (
              <span key={j} className="tag tag-emerald" style={{ fontSize: 12, padding: '4px 10px', margin: 0 }}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

  </div>
);
