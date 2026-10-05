import React from 'react';
import { Expandable } from './ui/Expandable';

export const InvestorReport = ({ data }) => (
  <div className="fade-in">

    {/* Metric Strip */}
    <div className="big-anchor-row" style={{ marginTop: 16 }}>
      <div className="big-anchor">
        <div className="big-anchor-value">{(data.fundingScore / 10).toFixed(1)}</div>
        <div className="big-anchor-label">Funding Score</div>
      </div>
      <div className="big-anchor">
        <div className="big-anchor-value">{data.recommendedFundingStage}</div>
        <div className="big-anchor-label">Target Stage</div>
      </div>
    </div>

    {/* Verdict */}
    <div className="editorial-statement" style={{ maxWidth: '100%', margin: '0 0 48px' }}>
      "{data.verdict}"
    </div>

    {/* Market & Defensibility */}
    <div className="editorial-section-header">
      <div className="header-number">01</div>
      <div className="header-title">Investment Thesis</div>
      <div className="header-line"></div>
    </div>

    <div className="editorial-columns" style={{ marginBottom: 48 }}>
      <div>
        <div className="editorial-col-title">Market Assessment</div>
        <div className="editorial-col-value">{data.marketSizeAssessment.split('.')[0] + '.'}</div>
        {data.marketSizeAssessment.includes('.') && (
          <Expandable label="View details →">{data.marketSizeAssessment.substring(data.marketSizeAssessment.indexOf('.') + 1).trim()}</Expandable>
        )}
      </div>
      <div>
        <div className="editorial-col-title">Defensibility</div>
        <div className="editorial-col-value">{data.defensibility.split('.')[0] + '.'}</div>
        {data.defensibility.includes('.') && (
          <Expandable label="View details →">{data.defensibility.substring(data.defensibility.indexOf('.') + 1).trim()}</Expandable>
        )}
      </div>
    </div>

    {/* Risks */}
    <div className="editorial-section-header">
      <div className="header-number">02</div>
      <div className="header-title">Key Execution Risks</div>
      <div className="header-line"></div>
    </div>

    <div style={{ marginBottom: 48 }}>
      {data.risks.map((r, i) => (
        <div key={i} className="compact-insight-row" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="insight-indicator" style={{ fontSize: 18 }}>▲</div>
          <div className="insight-entity" style={{ fontSize: 14 }}>Risk 0{i + 1}</div>
          <div className="insight-desc" style={{ flex: 1, fontSize: 14.5, color: 'var(--text-primary)', fontWeight: 500 }}>{r.risk}</div>
          <Expandable label="Mitigation →">
            <div style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>{r.mitigation}</div>
          </Expandable>
        </div>
      ))}
    </div>

    {/* VC Due Diligence */}
    <div className="editorial-section-header">
      <div className="header-number">03</div>
      <div className="header-title">VC Due Diligence</div>
      <div className="header-line"></div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {data.vcQuestions.map((q, i) => (
        <div key={i} style={{ paddingLeft: '24px', borderLeft: '2px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
            Question 0{i + 1}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.5 }}>
            {q.question}
          </div>
          <Expandable label="Analyst Answer →">
            {q.answer}
          </Expandable>
        </div>
      ))}
    </div>

  </div>
);
