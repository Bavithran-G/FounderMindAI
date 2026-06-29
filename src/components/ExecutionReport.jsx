import React, { useState } from 'react';

export const ExecutionReport = ({ data }) => {
  const [period, setPeriod] = useState('30');

  const tasks = period === '30' ? data.day30 : period === '60' ? data.day60 : data.day90;

  return (
    <div className="fade-in">
      {/* Milestones */}
      <div className="section-header">
        <span className="section-icon">🏆</span>
        <span className="section-title">Key Milestones</span>
      </div>
      <div style={{ marginBottom: 28 }}>
        {data.milestones.map((m, i) => (
          <div key={i} className="milestone-item">
            <span className="milestone-icon">
              {i === 0 ? '🌱' : i === 1 ? '🌿' : '🌳'}
            </span>
            <div className="milestone-text">{m}</div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="section-header">
        <span className="section-icon">📊</span>
        <span className="section-title">Key Performance Indicators</span>
      </div>
      <div className="tags-list" style={{ marginBottom: 28 }}>
        {data.kpis.map((kpi, i) => (
          <span key={i} className="tag tag-cyan" style={{ fontSize: 13, padding: '8px 14px' }}>
            {kpi}
          </span>
        ))}
      </div>

      {/* Timeline Tabs */}
      <div className="section-header">
        <span className="section-icon">📅</span>
        <span className="section-title">Action Plan</span>
      </div>
      <div className="timeline-tabs">
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

      {/* Tasks */}
      <div key={period}>
        {tasks.map((task, i) => (
          <div key={i} className="timeline-task">
            <div className={`priority-dot priority-${task.priority}`} />
            <div className="task-content">
              <div className="task-text">{task.task}</div>
              <div className="task-owner">👤 {task.owner}</div>
            </div>
            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
