import React from 'react';
import { Expandable } from './ui/Expandable';

const getFirstSentence = (text) => text ? text.split('.')[0] + '.' : '';
const getRestOfText = (text) => text ? text.substring(text.indexOf('.') + 1).trim() : '';

export const BusinessReport = ({ data }) => {
  const revenueNodes = data.revenueModel.split(/(?:,|\band\b)/i).map(s => s.trim()).filter(Boolean);

  return (
    <div className="fade-in">

      <div className="editorial-section-header" style={{ marginTop: 16 }}>
        <div className="header-number">01</div>
        <div className="header-title">Value Proposition</div>
        <div className="header-line"></div>
      </div>

      <div className="editorial-statement" style={{ maxWidth: '100%', margin: '24px 0 48px' }}>
        "{data.valueProposition}"
      </div>

      <div className="editorial-section-header">
        <div className="header-number">02</div>
        <div className="header-title">Strategic Advantages</div>
        <div className="header-line"></div>
      </div>

      <div className="editorial-columns" style={{ marginBottom: 48 }}>
        <div>
          <div className="editorial-col-title">Competitive Moat</div>
          <div className="editorial-col-value">{getFirstSentence(data.moat)}</div>
          {getRestOfText(data.moat) && (
            <Expandable label="Explore reasoning →">{getRestOfText(data.moat)}</Expandable>
          )}
        </div>
        <div>
          <div className="editorial-col-title">Unique Selling Point</div>
          <div className="editorial-col-value">{getFirstSentence(data.usp)}</div>
          {getRestOfText(data.usp) && (
            <Expandable label="Explore reasoning →">{getRestOfText(data.usp)}</Expandable>
          )}
        </div>
      </div>

      <div className="editorial-section-header">
        <div className="header-number">03</div>
        <div className="header-title">Revenue Architecture</div>
        <div className="header-line"></div>
      </div>

      <div className="flow-horizontal" style={{ marginBottom: 16 }}>
        {revenueNodes.map((node, i) => (
          <React.Fragment key={i}>
            <div className="flow-node">
              <div className="flow-value" style={{ fontSize: 16 }}>{node.substring(0, 15)}{node.length > 15 ? '...' : ''}</div>
              <div className="flow-label">Revenue Stream {i + 1}</div>
            </div>
            {i < revenueNodes.length - 1 && <div className="flow-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
      
      <div style={{ marginBottom: 48 }}>
        <Expandable label="View full revenue strategy →">{data.revenueModel}</Expandable>
      </div>

      <div className="editorial-section-header">
        <div className="header-number">04</div>
        <div className="header-title">Pricing Strategy</div>
        <div className="header-line"></div>
      </div>

      <div className="pricing-grid" style={{ marginBottom: 48 }}>
        {data.pricingTiers.map((tier, i) => (
          <div key={i} className={`pricing-card ${i === 1 ? 'featured' : ''}`}>
            <div className="pricing-tier-name">{tier.name}</div>
            <div className="pricing-price">{tier.price}</div>
            {tier.features.slice(0, 2).map((f, j) => (
              <div key={j} className="pricing-feature">
                <span className="pricing-check">✓</span>
                {f}
              </div>
            ))}
            {tier.features.length > 2 && (
              <div style={{ marginTop: 12 }}>
                <Expandable label={`+${tier.features.length - 2} features →`}>
                  {tier.features.slice(2).map((f, j) => (
                    <div key={j} className="pricing-feature" style={{ marginBottom: 4 }}>
                      <span className="pricing-check">✓</span>
                      {f}
                    </div>
                  ))}
                </Expandable>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="editorial-section-header">
        <div className="header-number">05</div>
        <div className="header-title">Target Audience</div>
        <div className="header-line"></div>
      </div>

      <div className="tag-list" style={{ marginBottom: 24 }}>
        {data.customerSegments.map((seg, i) => (
          <span key={i} className="tag tag-indigo" style={{ fontSize: 13, padding: '6px 14px' }}>
            {seg}
          </span>
        ))}
      </div>

    </div>
  );
};
