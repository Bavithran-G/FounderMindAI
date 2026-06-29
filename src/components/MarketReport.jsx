import React from 'react';
import { ScoreGauge } from './ScoreGauge';

export const MarketReport = ({ data }) => (
  <div className="fade-in">
    {/* Top row: Score + Analysis */}
    <div className="info-grid" style={{ gridTemplateColumns: '200px 1fr', marginBottom: 28 }}>
      <div className="info-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScoreGauge score={data.opportunityScore} label="Opportunity Score" size={140} />
      </div>
      <div className="info-card">
        <div className="info-card-label">📊 Market Analysis</div>
        <div className="info-card-value" style={{ fontSize: 15, lineHeight: 1.7 }}>{data.analysis}</div>
        <div style={{ marginTop: 12 }}>
          <span className="tag tag-emerald" style={{ fontSize: 13, padding: '6px 14px' }}>
            🎯 TAM: {data.targetMarketSize}
          </span>
        </div>
      </div>
    </div>

    {/* Competitors */}
    <div className="section-header">
      <span className="section-icon">⚔️</span>
      <span className="section-title">Competitors ({data.competitors.length})</span>
    </div>
    <div className="info-grid" style={{ marginBottom: 28 }}>
      {data.competitors.map((c, i) => (
        <div key={i} className="competitor-card">
          <div className="competitor-name">{c.name}</div>
          <div className="competitor-desc">{c.description}</div>
          <div className="competitor-weakness">⚠ {c.weakness}</div>
        </div>
      ))}
    </div>

    {/* Trends & Gaps */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <div className="section-header">
          <span className="section-icon">📈</span>
          <span className="section-title">Market Trends</span>
        </div>
        <div className="tags-list">
          {data.trends.map((t, i) => (
            <span key={i} className="tag tag-cyan" style={{ fontSize: 13, padding: '8px 14px' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <span className="section-title">Market Gaps</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.gaps.map((g, i) => (
            <div key={i} className="flow-step">
              <div className="flow-step-num">{i + 1}</div>
              <div className="flow-step-text">{g}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

