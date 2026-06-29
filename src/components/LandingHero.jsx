import React, { useState } from 'react';

const EXAMPLES = [
  'AI-powered fitness coach for college students',
  'Sustainable fashion marketplace for Gen Z',
  'Mental health app for remote workers',
  'Blockchain-based freelancer payment platform',
  'AR-powered interior design tool',
];

export const LandingHero = ({ onAnalyze, isAnalyzing }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = () => {
    if (idea.trim() && !isAnalyzing) onAnalyze(idea.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <section className="hero">
      {/* Badge */}
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Powered by 6 Specialized AI Agents · Llama 3.3 by Groq
      </div>

      {/* Headline */}
      <h1 className="hero-title">
        <span className="hero-title-line1">Turn Your Startup Idea</span>
        <span className="hero-title-line2">Into a Complete Blueprint</span>
      </h1>

      <p className="hero-subtitle">
        FounderMindAI analyzes your idea with 6 specialized AI agents — from market research
        to investor scoring — and delivers a complete startup intelligence report in minutes.
      </p>

      {/* ── Idea Input ─────────────────────────────────────── */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            id="idea-input"
            className="idea-input"
            placeholder="Describe your startup idea... (e.g. AI tutor for K-12 students)"
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isAnalyzing}
          />
          <button
            id="analyze-btn"
            className="analyze-btn"
            onClick={handleSubmit}
            disabled={!idea.trim() || isAnalyzing}
          >
            {isAnalyzing
              ? <><span style={{ fontSize: 16 }}>⏳</span>Analyzing...</>
              : <><span style={{ fontSize: 16 }}>⚡</span>Analyze</>
            }
          </button>
        </div>

        <p className="input-hint">Press Enter to analyze · Shift+Enter for new line</p>

        <div className="input-examples">
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              className="example-chip"
              onClick={() => setIdea(ex)}
              disabled={isAnalyzing}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-number">6</div>
          <div className="hero-stat-label">AI Agents</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">~2m</div>
          <div className="hero-stat-label">Analysis Time</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">100+</div>
          <div className="hero-stat-label">Insights Generated</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">∞</div>
          <div className="hero-stat-label">Ideas Supported</div>
        </div>
      </div>
    </section>
  );
};
