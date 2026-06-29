import React from 'react';

export const AGENT_CONFIGS = [
  {
    key: 'marketResearch',
    number: 'Agent 01',
    name: 'Market Research',
    description: 'Finds competitors, analyzes market trends, identifies gaps, and scores the opportunity.',
    icon: '🔍',
    accentColor: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.06)',
    borderColor: 'rgba(14, 165, 233, 0.15)',
  },
  {
    key: 'businessStrategy',
    number: 'Agent 02',
    name: 'Business Strategist',
    description: 'Crafts revenue model, pricing tiers, customer segments, and value proposition.',
    icon: '💼',
    accentColor: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.06)',
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  {
    key: 'productArchitect',
    number: 'Agent 03',
    name: 'Product Architect',
    description: 'Designs MVP features, user flow, development roadmap, and recommended tech stack.',
    icon: '🏗️',
    accentColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    key: 'investor',
    number: 'Agent 04',
    name: 'VC Investor',
    description: 'Acts as a Sequoia-level VC: evaluates market size, defensibility, risks, and gives a funding score.',
    icon: '💰',
    accentColor: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.06)',
    borderColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    key: 'pitchDeck',
    number: 'Agent 05',
    name: 'Pitch Deck',
    description: 'Auto-generates a complete 8-slide investor pitch deck with narrative and key points.',
    icon: '🎯',
    accentColor: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.06)',
    borderColor: 'rgba(244, 63, 94, 0.15)',
  },
  {
    key: 'execution',
    number: 'Agent 06',
    name: 'Execution Planner',
    description: 'Generates a concrete 30/60/90-day action plan with priorities, owners, and KPIs.',
    icon: '🚀',
    accentColor: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.06)',
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
];


export const AgentCard = ({ config, status, preview }) => {
  const statusLabel = {
    idle: 'Pending',
    running: 'Analyzing',
    complete: 'Complete',
    error: 'Error',
  }[status];

  return (
    <div
      className={`agent-card ${status}`}
      style={{
        '--agent-color': `linear-gradient(90deg, ${config.accentColor}, ${config.accentColor}66)`,
      }}
    >
      <div className="agent-card-top">
        <div
          className="agent-icon-wrap"
          style={{ background: config.bgColor, borderColor: config.borderColor }}
        >
          {config.icon}
        </div>
        <div className={`agent-status-badge status-${status}`}>
          <span className="status-dot" />
          {statusLabel}
        </div>
      </div>

      <div className="agent-number">{config.number}</div>
      <div className="agent-name">{config.name}</div>
      <div className="agent-description">{config.description}</div>

      {status === 'running' && (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <div className="thinking-dots">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </div>
        </div>
      )}

      {status === 'complete' && preview && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            marginTop: 8,
            padding: '8px 12px',
            background: 'rgba(16,185,129,0.04)',
            borderRadius: 8,
            borderLeft: `3px solid ${config.accentColor}`,
            lineHeight: 1.5,
          }}
        >
          {preview}
        </div>
      )}

      {status === 'complete' && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ✓ Analysis complete
        </div>
      )}
    </div>
  );
};
