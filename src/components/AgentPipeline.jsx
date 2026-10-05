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
  { key: 'marketResearch',   label: 'Market',     icon: '◈', agent: 'marketResearch' },
  { key: 'businessStrategy', label: 'Strategy',   icon: '◉', agent: 'businessStrategy' },
  { key: 'productArchitect', label: 'Product',    icon: '⬡', agent: 'productArchitect' },
  { key: 'investor',         label: 'Investor',   icon: '★', agent: 'investor' },
  { key: 'pitchDeck',        label: 'Pitch Deck', icon: '▷', agent: 'pitchDeck' },
  { key: 'execution',        label: 'Execution',  icon: '◆', agent: 'execution' },
];

export const AgentPipeline = ({ idea, result, agentStatuses, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState('marketResearch');
  const [pdfLoading, setPdfLoading] = useState(false);

  const completedCount = Object.values(agentStatuses).filter(s => s === 'complete').length;
  const totalAgents = 6;
  const progressPercent = (completedCount / totalAgents) * 100;
  const allDone = completedCount === totalAgents;

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

  // Auto-switch to first completed tab
  React.useEffect(() => {
    const firstComplete = TABS.find(t => agentStatuses[t.agent] === 'complete');
    if (firstComplete && agentStatuses[activeTab] !== 'complete') {
      setActiveTab(firstComplete.key);
    }
  }, [agentStatuses]);

  // Compute scores
  const marketScore  = result.marketResearch?.opportunityScore  || 0;
  const businessScore= result.businessStrategy?.viabilityScore  || 0;
  const investorScore= result.investor?.fundabilityScore        || 0;
  const overallScore = allDone ? ((marketScore + businessScore + investorScore) / 30).toFixed(1) : null;

  return (
    <div className="pipeline-view">

      {/* Header */}
      <div className="pipeline-header">
        <div className="pipeline-header-top">
          <div>
            <div className="pipeline-idea-label" style={{ fontSize: 11, letterSpacing: 2 }}>
              STARTUP INTELLIGENCE REPORT
            </div>
            <div className="pipeline-idea-text">"{idea}"</div>
          </div>

          <div className="pipeline-actions">
            {allDone && (
              <button
                id="download-pdf-btn"
                className="action-btn"
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
              >
                {pdfLoading
                  ? <><span className="mini-spinner" />Generating...</>
                  : <>↓ Download PDF</>
                }
              </button>
            )}
            <button
              className="action-btn"
              onClick={onNewAnalysis}
              id="back-to-home"
            >
              ← New Idea
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="pipeline-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={`progress-label ${allDone ? 'done' : ''}`}>
            {allDone
              ? '✓ All 6 agents complete'
              : `${completedCount} / ${totalAgents} agents analyzing...`}
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
          />
        ))}
      </div>

      {/* Executive Snapshot — shown once all done */}
      {allDone && (
        <div className="fade-in" style={{ marginBottom: 48 }}>

          {/* Big Score Row */}
          <div className="big-anchor-row" style={{ marginTop: 40 }}>
            <div className="big-anchor">
              <div className="big-anchor-value" style={{
                color: 'var(--blue-light)',
                fontSize: 64,
                textShadow: '0 0 40px var(--blue-glow)'
              }}>
                {overallScore}
              </div>
              <div className="big-anchor-label">Overall Startup Score</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '0 8px' }} />
            <div className="big-anchor">
              <div className="big-anchor-value">{(marketScore / 10).toFixed(1)}</div>
              <div className="big-anchor-label">Market</div>
            </div>
            <div className="big-anchor">
              <div className="big-anchor-value">{(businessScore / 10).toFixed(1)}</div>
              <div className="big-anchor-label">Business</div>
            </div>
            <div className="big-anchor">
              <div className="big-anchor-value">{(investorScore / 10).toFixed(1)}</div>
              <div className="big-anchor-label">Investment</div>
            </div>
          </div>

          {/* Verdict */}
          <div className="verdict-strip">
            <div className="verdict-strip-title">
              ★ AI VERDICT
            </div>
            <div className="verdict-strip-insight">
              {result.investor?.verdict || 'A comprehensive intelligence report detailing the market opportunity, product strategy, and business model.'}
            </div>
          </div>

          {/* Orientation hint */}
          <div style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 8
          }}>
            Explore the full report below
          </div>
          <div className="connector-flow" style={{ padding: '8px 0 0' }}>↓</div>
        </div>
      )}

      {/* Result Tabs */}
      {completedCount > 0 && (
        <div className="report-section">
          <div className="report-tabs-wrapper">
            {TABS.map(tab => {
              const isComplete = agentStatuses[tab.agent] === 'complete';
              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  className={`report-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => isComplete && setActiveTab(tab.key)}
                  disabled={!isComplete}
                >
                  {isComplete && <span className="tab-indicator" />}
                  <span style={{ marginRight: 6, opacity: 0.7 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div key={activeTab} className="fade-in">
            {activeTab === 'marketResearch'   && result.marketResearch   && <MarketReport   data={result.marketResearch} />}
            {activeTab === 'businessStrategy' && result.businessStrategy && <BusinessReport  data={result.businessStrategy} />}
            {activeTab === 'productArchitect' && result.productArchitect && <ProductReport   data={result.productArchitect} />}
            {activeTab === 'investor'         && result.investor         && <InvestorReport  data={result.investor} />}
            {activeTab === 'pitchDeck'        && result.pitchDeck        && <PitchDeckView   data={result.pitchDeck} />}
            {activeTab === 'execution'        && result.execution        && <ExecutionReport data={result.execution} />}
          </div>
        </div>
      )}
    </div>
  );
};
