import React, { useState } from 'react';
import { Expandable } from './ui/Expandable';

export const ExecutionReport = ({ data }) => {
  const [period, setPeriod] = useState('30');
  const tasks = period === '30' ? data.day30 : period === '60' ? data.day60 : data.day90;

  return (
    <div className="fade-in">

      {/* Milestones */}
      <div className="editorial-section-header" style={{ marginTop: 16 }}>
        <div className="header-number">01</div>
        <div className="header-title">Key Milestones</div>
        <div className="header-line"></div>
      </div>

      <div className="numbered-intelligence" style={{ marginBottom: 48 }}>
        {data.milestones.map((m, i) => (
          <div key={i} className="intelligence-item">
            <div className="intelligence-num">0{i + 1}</div>
            <div className="intelligence-text">
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                {m.split(':')[0]}
              </span>
              {m.includes(':') && (
                <Expandable label="View details →">{m.substring(m.indexOf(':') + 1).trim()}</Expandable>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="editorial-section-header">
        <div className="header-number">02</div>
        <div className="header-title">Key Performance Indicators</div>
        <div className="header-line"></div>
      </div>

      <div className="flow-horizontal" style={{ marginBottom: 48 }}>
        {data.kpis.map((kpi, i) => (
          <React.Fragment key={i}>
            <div className="flow-node">
              <div className="flow-value" style={{ fontSize: 16 }}>{kpi.split(' ')[0]}</div>
              <div className="flow-label">{kpi.substring(kpi.indexOf(' ') + 1)}</div>
            </div>
            {i < data.kpis.length - 1 && <div className="flow-arrow">|</div>}
          </React.Fragment>
        ))}
      </div>

      {/* 30/60/90 Action Plan */}
      <div className="editorial-section-header">
        <div className="header-number">03</div>
        <div className="header-title">Action Plan</div>
        <div className="header-line"></div>
      </div>

      <div className="timeline-tabs" style={{ marginBottom: 32 }}>
        {['30', '60', '90'].map(p => (
          <button
            key={p}
            id={`timeline-tab-${p}`}
            className={`timeline-tab ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            Day {p}
          </button>
        ))}
      </div>

      <div key={period} className="signal-timeline">
        {tasks.map((t, i) => (
          <div key={i} className="signal-timeline-item">
            <div className="signal-node" style={{ 
              borderColor: t.priority === 'High' ? 'var(--rose)' : t.priority === 'Medium' ? 'var(--amber)' : 'var(--blue)',
              boxShadow: t.priority === 'High' ? '0 0 10px rgba(251,113,133,0.3)' : t.priority === 'Medium' ? '0 0 10px rgba(251,191,36,0.3)' : '0 0 10px var(--blue-glow)'
            }}></div>
            <div className="signal-num">0{i + 1}</div>
            <div className="signal-headline" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {t.task.split('.')[0]}
            </div>
            {t.task.includes('.') && (
              <div className="signal-desc" style={{ marginTop: 8 }}>
                <Expandable label="Execution Details →">{t.task.substring(t.task.indexOf('.') + 1).trim()}</Expandable>
              </div>
            )}
            <div className="signal-strength" style={{ color: t.priority === 'High' ? 'var(--rose)' : t.priority === 'Medium' ? 'var(--amber)' : 'var(--blue)' }}>
              {t.priority.toUpperCase()} PRIORITY
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
