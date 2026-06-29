import React from 'react';
import { getHistory, deleteAnalysis } from '../utils/history';

function getScoreColor(score) {
  if (score >= 86) return '#10b981'; // Exceptional (emerald)
  if (score >= 76) return '#34d399'; // Strong
  if (score >= 66) return '#f59e0b'; // Above Avg (amber)
  if (score >= 51) return '#fb923c'; // Average (orange)
  if (score >= 36) return '#f87171'; // Weak (coral)
  return '#f43f5e';                  // Poor (red)
}

export const HistorySidebar = ({
  currentId,
  onSelect,
  onNewAnalysis,
  refreshKey,
}) => {
  const history = getHistory();

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteAnalysis(id);
    window.dispatchEvent(new CustomEvent('history-updated'));
  };

  return (
    <aside className="sidebar" id="history-sidebar">
      <div className="sidebar-header">
        <span style={{ fontSize: 24 }}>🧠</span>
        <span className="sidebar-logo">FounderMindAI</span>
      </div>

      <div className="sidebar-section-title">Past Analyses</div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div>No analyses yet. Enter your first startup idea to get started!</div>
        </div>
      ) : (
        history.map(item => {
          const score = item.marketResearch?.opportunityScore;
          const scoreColor = score ? getScoreColor(score) : '#10b981';

          return (
            <div
              key={item.id}
              className={`history-item ${item.id === currentId ? 'active' : ''}`}
              onClick={() => onSelect(item)}
              id={`history-${item.id}`}
            >
              <div className="history-item-idea">{item.idea}</div>
              <div className="history-item-date">🕐 {formatDate(item.timestamp)}</div>
              {score !== undefined && (
                <div style={{ marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: scoreColor,
                      background: `${scoreColor}18`,
                      padding: '2px 8px',
                      borderRadius: 100,
                      border: `1px solid ${scoreColor}40`,
                    }}
                  >
                    Score: {score}/100
                  </span>
                </div>
              )}
              <button
                className="history-item-delete"
                onClick={e => handleDelete(e, item.id)}
                title="Delete analysis"
              >
                ✕
              </button>
            </div>
          );
        })
      )}

      <button className="new-analysis-btn" onClick={onNewAnalysis} id="new-analysis-btn">
        ⚡ New Analysis
      </button>
    </aside>
  );
};
