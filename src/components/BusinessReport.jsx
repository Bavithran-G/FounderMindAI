import React from 'react';

export const BusinessReport = ({ data }) => (
  <div className="fade-in">
    {/* Value Prop & USP */}
    <div className="verdict-box" style={{ marginBottom: 24 }}>
      <div className="verdict-title">💡 Value Proposition</div>
      <div className="verdict-text">{data.valueProposition}</div>
    </div>

    <div className="info-grid" style={{ marginBottom: 28 }}>
      <div className="info-card">
        <div className="info-card-label">🏰 Competitive Moat</div>
        <div className="info-card-value">{data.moat}</div>
      </div>
      <div className="info-card">
        <div className="info-card-label">⭐ Unique Selling Point</div>
        <div className="info-card-value">{data.usp}</div>
      </div>
      <div className="info-card">
        <div className="info-card-label">💵 Revenue Model</div>
        <div className="info-card-value">{data.revenueModel}</div>
      </div>
    </div>

    {/* Pricing Tiers */}
    <div className="section-header">
      <span className="section-icon">💳</span>
      <span className="section-title">Pricing Tiers</span>
    </div>
    <div className="pricing-grid" style={{ marginBottom: 28 }}>
      {data.pricingTiers.map((tier, i) => (
        <div key={i} className={`pricing-card ${i === 1 ? 'featured' : ''}`}>
          <div className="pricing-tier-name">{tier.name}</div>
          <div className="pricing-price">{tier.price}</div>
          {tier.features.map((f, j) => (
            <div key={j} className="pricing-feature">
              <span className="pricing-check">✓</span>
              {f}
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Customer Segments */}
    <div className="section-header">
      <span className="section-icon">👥</span>
      <span className="section-title">Customer Segments</span>
    </div>
    <div className="tags-list">
      {data.customerSegments.map((seg, i) => (
        <span key={i} className="tag tag-violet" style={{ fontSize: 14, padding: '8px 16px' }}>
          {seg}
        </span>
      ))}
    </div>
  </div>
);
