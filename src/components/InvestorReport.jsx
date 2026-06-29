import React from 'react';
import { ScoreGauge } from './ScoreGauge';

export const InvestorReport = ({ data }) => (
  <div className="fade-in">
    {/* Score + Verdict */}
    <div className="info-grid" style={{ gridTemplateColumns: '200px 1fr', marginBottom: 28 }}>
      <div className="info-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScoreGauge score={data.fundingScore} label="Funding Score" size={140} />
      </div>
      <div>
        <div className="verdict-box" style={{ marginBottom: 12 }}>
          <div className="verdict-title">⚖️ VC Verdict</div>
          <div className="verdict-text">{data.verdict}</div>
        </div>
        <div className="tags-list">
          <span className="tag tag-violet">Stage: {data.recommendedFundingStage}</span>
        </div>
      </div>
    </div>

    {/* VC Questions */}
    <div className="section-header">
      <span className="section-icon">❓</span>
      <span className="section-title">VC Due Diligence Questions</span>
    </div>
    <div style={{ marginBottom: 28 }}>
      {data.vcQuestions.map((q, i) => (
        <div key={i} className="vc-question-card">
          <div className="vc-question-text">
            <span className="vc-question-icon">Q{i + 1}</span>
            {q.question}
          </div>
          <div className="vc-answer-text">{q.answer}</div>
        </div>
      ))}
    </div>

    {/* Market & Defensibility */}
    <div className="info-grid" style={{ marginBottom: 28 }}>
      <div className="info-card">
        <div className="info-card-label">📊 Market Size Assessment</div>
        <div className="info-card-value">{data.marketSizeAssessment}</div>
      </div>
      <div className="info-card">
        <div className="info-card-label">🛡️ Defensibility</div>
        <div className="info-card-value">{data.defensibility}</div>
      </div>
    </div>

    {/* Risks */}
    <div className="section-header">
      <span className="section-icon">⚠️</span>
      <span className="section-title">Key Risks & Mitigations</span>
    </div>
    {data.risks.map((r, i) => (
      <div key={i} className="risk-card">
        <div className="risk-label">Risk {i + 1}</div>
        <div className="risk-value">{r.risk}</div>
        <div className="mitigation-label">✓ Mitigation</div>
        <div className="mitigation-value">{r.mitigation}</div>
      </div>
    ))}
  </div>
);
