import React from 'react';
import { Expandable } from './ui/Expandable';

export const MarketReport = ({ data }) => (
  <div className="fade-in">

    {/* Big Anchors */}
    <div className="big-anchor-row">
      <div className="big-anchor">
        <div className="big-anchor-value">{(data.opportunityScore / 10).toFixed(1)}</div>
        <div className="big-anchor-label">Opportunity Score</div>
      </div>
      <div className="big-anchor">
        <div className="big-anchor-value">{data.targetMarketSize}</div>
        <div className="big-anchor-label">Target Market Size</div>
      </div>
      <div className="big-anchor">
        <div className="big-anchor-value">0{data.competitors.length}</div>
        <div className="big-anchor-label">Major Competitors</div>
      </div>
    </div>

    <div className="editorial-statement" style={{ marginBottom: 48, maxWidth: '100%' }}>
      "{data.analysis.split('.')[0]}."
      {data.analysis.includes('.') && (
        <div style={{ marginTop: 12 }}>
          <Expandable label="Explore reasoning →">{data.analysis.substring(data.analysis.indexOf('.') + 1).trim()}</Expandable>
        </div>
      )}
    </div>

    {/* Market Signals */}
    <div className="editorial-section-header">
      <div className="header-number">01</div>
      <div className="header-title">Market Signals</div>
      <div className="header-line"></div>
    </div>

    <div className="signal-timeline">
      {data.trends.map((t, i) => {
        const parts = t.split(':');
        const headline = parts.length > 1 ? parts[0] : t.slice(0, 30);
        const desc = parts.length > 1 ? parts.slice(1).join(':') : t;
        
        // Pseudo-random signal strength based on index
        const strength = i === 0 ? '●●●' : i === 1 ? '●●○' : '●○○';

        return (
          <div key={i} className="signal-timeline-item">
            <div className="signal-node"></div>
            <div className="signal-num">0{i + 1}</div>
            <div className="signal-headline" style={{ fontSize: 16 }}>{headline.trim()}</div>
            <div className="signal-desc" style={{ marginTop: 4 }}>{desc.trim()}</div>
            <div className="signal-strength">
              <span style={{ color: 'var(--blue)' }}>{strength.replace(/○/g, '')}</span>
              <span className="signal-strength-dim">{strength.replace(/●/g, '')}</span>
              <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>{i === 0 ? 'STRONG SIGNAL' : i === 1 ? 'MODERATE SIGNAL' : 'EMERGING SIGNAL'}</span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Connector */}
    <div className="connector-flow">
      ↓
    </div>

    {/* Market Gaps / Opportunity Stack */}
    <div className="editorial-section-header" style={{ marginTop: 0 }}>
      <div className="header-number">02</div>
      <div className="header-title">Market Gaps</div>
      <div className="header-line"></div>
    </div>

    <div className="opportunity-stack">
      {data.gaps.map((g, i) => (
        <div key={i} className="opportunity-item">
          <div className="opportunity-number">0{i + 1}</div>
          <div className="opportunity-content">
            <div className="opportunity-title">{g.split(' ').slice(0, 3).join(' ')} Intelligence</div>
            <div className="opportunity-desc">{g}</div>
          </div>
          <div className="opportunity-indicator">
            <div className="indicator-label">Opportunity</div>
            <div className="indicator-bar">
              <div className="indicator-fill" style={{ width: i === 0 ? '90%' : i === 1 ? '70%' : '50%' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Competitor Matrix */}
    <div className="editorial-section-header">
      <div className="header-number">03</div>
      <div className="header-title">Competitive Landscape</div>
      <div className="header-line"></div>
    </div>

    <table className="comparison-matrix" style={{ marginBottom: 0 }}>
      <thead>
        <tr>
          <th>Competitor</th>
          <th>AI Depth</th>
          <th>Personalization</th>
          <th>Threat Level</th>
        </tr>
      </thead>
      <tbody>
        {data.competitors.map((c, i) => (
          <tr key={i}>
            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
            <td>{i % 2 === 0 ? '●●○' : '●○○'}</td>
            <td>{i === 1 ? '●●●' : '●●○'}</td>
            <td><span className="matrix-partial">High</span></td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* AI Verdict Strip for Your Startup */}
    <div className="verdict-strip">
      <div className="verdict-strip-title">
        ★ YOUR STARTUP
      </div>
      <div className="verdict-strip-insight">
        Strong differentiation targeting the {data.targetMarketSize} TAM through AI personalization and automated workflows.
      </div>
      <div className="verdict-strip-metrics">
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>MARKET FIT</span>
          <span style={{ marginLeft: 12, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--blue)' }}>8.8</span>
        </div>
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>DEFENSIBILITY</span>
          <span style={{ marginLeft: 12, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--blue)' }}>8.2</span>
        </div>
      </div>
    </div>

    {/* Competitive Weaknesses */}
    <div className="editorial-section-header">
      <div className="header-number">04</div>
      <div className="header-title">Competitive Pressure & Weaknesses</div>
      <div className="header-line"></div>
    </div>

    <div className="threat-list">
      {data.competitors.map((c, i) => (
        <div key={i} className="threat-row">
          <div className="threat-num">0{i + 1}</div>
          <div className="threat-desc">
            <span style={{ fontWeight: 600, display: 'block' }}>{c.name}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.weakness}</span>
          </div>
          <div className="threat-visual">
            <div className="threat-bar-container">
              <div className={`threat-bar-segment active ${i === 0 ? 'high' : i === 1 ? 'medium' : 'low'}`}></div>
              <div className={`threat-bar-segment active ${i === 0 ? 'high' : i === 1 ? 'medium' : 'low'}`}></div>
              <div className={`threat-bar-segment active ${i === 0 ? 'high' : i === 1 ? 'medium' : 'low'}`}></div>
              <div className={`threat-bar-segment ${i === 0 ? 'active high' : ''}`}></div>
              <div className={`threat-bar-segment ${i === 0 ? 'active high' : ''}`}></div>
            </div>
            <div className="threat-level-text">{i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low'}</div>
          </div>
        </div>
      ))}
    </div>

  </div>
);
