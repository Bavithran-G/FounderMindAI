import React from 'react';

export const ProductReport = ({ data }) => (
  <div className="fade-in">
    {/* MVP Features */}
    <div className="section-header">
      <span className="section-icon">⚡</span>
      <span className="section-title">MVP Features (Priority Order)</span>
    </div>
    <div style={{ marginBottom: 28 }}>
      {data.mvpFeatures.map((f, i) => (
        <div key={i} className="timeline-task" style={{ marginBottom: 10 }}>
          <div
            style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, #0ea5e9, #6366f1)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div className="task-content">
            <div className="task-text">{f}</div>
          </div>
          {i === 0 && <span className="priority-badge High">Must Have</span>}
          {i === 1 && <span className="priority-badge Medium">High Priority</span>}
          {i > 1 && <span className="priority-badge Low">Important</span>}
        </div>
      ))}
    </div>

    {/* Roadmap */}
    <div className="section-header">
      <span className="section-icon">🗺️</span>
      <span className="section-title">Development Roadmap</span>
    </div>
    <div className="roadmap-phases" style={{ marginBottom: 28 }}>
      {data.roadmap.map((phase, i) => (
        <div key={i} className="roadmap-phase">
          <div className="roadmap-phase-name">{phase.phase}</div>
          <div className="roadmap-duration">⏱ {phase.duration}</div>
          {phase.goals.map((g, j) => (
            <div key={j} className="roadmap-goal">{g}</div>
          ))}
        </div>
      ))}
    </div>

    {/* User Flow */}
    <div className="section-header">
      <span className="section-icon">🔄</span>
      <span className="section-title">User Flow</span>
    </div>
    <div className="user-flow" style={{ marginBottom: 28 }}>
      {data.userFlow.map((step, i) => (
        <div key={i} className="flow-step">
          <div className="flow-step-num">{i + 1}</div>
          <div className="flow-step-text">{step}</div>
        </div>
      ))}
    </div>

    {/* Tech Stack */}
    <div className="section-header">
      <span className="section-icon">⚙️</span>
      <span className="section-title">Recommended Tech Stack</span>
    </div>
    <div className="tech-stack-grid">
      {data.techStack.map((cat, i) => (
        <div key={i} className="tech-category">
          <div className="tech-category-name">{cat.category}</div>
          <div>
            {cat.tools.map((tool, j) => (
              <span key={j} className="tech-tool">{tool}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
