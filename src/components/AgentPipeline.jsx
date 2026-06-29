import React, { useState } from 'react';
import { AgentCard, AGENT_CONFIGS } from './AgentCard';
import { MarketReport } from './MarketReport';
import { BusinessReport } from './BusinessReport';
import { ProductReport } from './ProductReport';
import { InvestorReport } from './InvestorReport';
import { PitchDeckView } from './PitchDeckView';
import { ExecutionReport } from './ExecutionReport';
import { downloadReportPDF } from '../utils/downloadPDF';

const TABS = [
  { key: 'marketResearch', label: '🔍 Market', agent: 'marketResearch' },
  { key: 'businessStrategy', label: '💼 Strategy', agent: 'businessStrategy' },
  { key: 'productArchitect', label: '🏗️ Product', agent: 'productArchitect' },
  { key: 'investor', label: '💰 Investor', agent: 'investor' },
  { key: 'pitchDeck', label: '🎯 Pitch Deck', agent: 'pitchDeck' },
  { key: 'execution', label: '🚀 Execution', agent: 'execution' },
];

export const AgentPipeline = ({
  idea, result, agentStatuses, onNewAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState('marketResearch');
  const [pdfLoading, setPdfLoading] = useState(false);

  const completedCount = Object.values(agentStatuses).filter(s => s === 'complete').length;
  const totalAgents = 6;
  const progressPercent = (completedCount / totalAgents) * 100;
  const allDone = completedCount === totalAgents;

  const getPreview = (key) => {
    switch (key) {
      case 'marketResearch':
        return result.marketResearch
          ? `Score: ${result.marketResearch.opportunityScore}/100 · ${result.marketResearch.competitors.length} competitors found`
          : '';
      case 'businessStrategy':
        return result.businessStrategy
          ? result.businessStrategy.valueProposition.slice(0, 80) + '...'
          : '';
      case 'productArchitect':
        return result.productArchitect
          ? `${result.productArchitect.mvpFeatures.length} MVP features · ${result.productArchitect.techStack.length} tech categories`
          : '';
      case 'investor':
        return result.investor
          ? `Funding Score: ${result.investor.fundingScore}/100 · ${result.investor.recommendedFundingStage}`
          : '';
      case 'pitchDeck':
        return result.pitchDeck
          ? `"${result.pitchDeck.startupName}" — ${result.pitchDeck.slides.length} slides generated`
          : '';
      case 'execution':
        return result.execution
          ? `${result.execution.day30.length + result.execution.day60.length + result.execution.day90.length} total action items`
          : '';
      default:
        return '';
    }
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      await downloadReportPDF(result);
    } catch (e) {
      console.error('PDF generation failed:', e);
      alert('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="pipeline-view">
      {/* Header */}
      <div className="pipeline-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div className="pipeline-idea-label">Analyzing startup idea</div>
            <div className="pipeline-idea-text">"{idea}"</div>
          </div>

          {/* Header action buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            {/* Download PDF — only visible when all agents are done */}
            {allDone && (
              <button
                id="download-pdf-btn"
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px',
                  background: pdfLoading ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.35)',
                  borderRadius: 10,
                  color: '#818cf8',
                  cursor: pdfLoading ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 600,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!pdfLoading) e.currentTarget.style.background = 'rgba(99,102,241,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = pdfLoading ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.12)'; }}
              >
                {pdfLoading
                  ? <><span style={{ fontSize: 15 }}>⏳</span> Generating PDF...</>
                  : <><span style={{ fontSize: 15 }}>📄</span> Download Report</>
                }
              </button>
            )}

            <button
              className="export-btn"
              onClick={onNewAnalysis}
              style={{ background: 'rgba(14,165,233,0.06)', borderColor: 'rgba(14,165,233,0.15)', color: 'var(--accent-sky-deep)' }}
              id="back-to-home"
            >
              ← New Idea
            </button>
          </div>
        </div>

        <div className="pipeline-progress">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-text">
            {allDone
              ? '✓ All agents complete'
              : `${completedCount}/${totalAgents} agents complete`}
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="agents-grid">
        {AGENT_CONFIGS.map(config => (
          <AgentCard
            key={config.key}
            config={config}
            status={agentStatuses[config.key]}
            preview={getPreview(config.key)}
          />
        ))}
      </div>

      {/* Results Tabs */}
      {completedCount > 0 && (
        <div className="report-section">
          <div className="report-tabs">
            {TABS.map(tab => {
              const isComplete = agentStatuses[tab.agent] === 'complete';
              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  className={`report-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => isComplete && setActiveTab(tab.key)}
                  disabled={!isComplete}
                  style={{ opacity: isComplete ? 1 : 0.4, cursor: isComplete ? 'pointer' : 'not-allowed' }}
                >
                  {isComplete && <span className="tab-dot" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div key={activeTab}>
            {activeTab === 'marketResearch' && result.marketResearch && (
              <MarketReport data={result.marketResearch} />
            )}
            {activeTab === 'businessStrategy' && result.businessStrategy && (
              <BusinessReport data={result.businessStrategy} />
            )}
            {activeTab === 'productArchitect' && result.productArchitect && (
              <ProductReport data={result.productArchitect} />
            )}
            {activeTab === 'investor' && result.investor && (
              <InvestorReport data={result.investor} />
            )}
            {activeTab === 'pitchDeck' && result.pitchDeck && (
              <PitchDeckView data={result.pitchDeck} />
            )}
            {activeTab === 'execution' && result.execution && (
              <ExecutionReport data={result.execution} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
