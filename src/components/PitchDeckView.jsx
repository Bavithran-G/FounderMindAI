import React, { useState } from 'react';
import { downloadPitchDeckPPT } from '../utils/downloadPPT';

const SLIDE_GRADIENTS = [
  'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, rgba(99,102,241,0.02) 100%)',
  'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(16,185,129,0.02) 100%)',
  'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(245,158,11,0.02) 100%)',
  'linear-gradient(135deg, rgba(245,158,11,0.04) 0%, rgba(244,63,94,0.02) 100%)',
  'linear-gradient(135deg, rgba(244,63,94,0.04) 0%, rgba(14,165,233,0.02) 100%)',
  'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, rgba(139,92,246,0.02) 100%)',
  'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(16,185,129,0.02) 100%)',
  'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(14,165,233,0.02) 100%)',
];

export const PitchDeckView = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pptLoading, setPptLoading] = useState(false);
  const total = data.slides.length;

  const goTo = (idx) => {
    if (idx >= 0 && idx < total) setCurrentSlide(idx);
  };

  const handleDownloadPPT = async () => {
    setPptLoading(true);
    try {
      await downloadPitchDeckPPT(data);
    } catch (e) {
      console.error('PPT generation failed:', e);
      alert('PPT generation failed. Please try again.');
    } finally {
      setPptLoading(false);
    }
  };

  const slide = data.slides[currentSlide];

  return (
    <div className="fade-in">
      {/* Startup name & tagline */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 32,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 6,
          }}
        >
          {data.startupName}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 16, fontStyle: 'italic', marginBottom: 16 }}>
          "{data.tagline}"
        </div>

        {/* Download PPT button — right below the tagline, near the deck */}
        <button
          id="download-ppt-btn"
          onClick={handleDownloadPPT}
          disabled={pptLoading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px',
            background: pptLoading ? 'rgba(244,63,94,0.06)' : 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.35)',
            borderRadius: 12,
            color: '#fb7185',
            cursor: pptLoading ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 600,
            transition: 'all 0.2s',
            letterSpacing: 0.3,
          }}
          onMouseEnter={e => { if (!pptLoading) e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = pptLoading ? 'rgba(244,63,94,0.06)' : 'rgba(244,63,94,0.1)'; }}
        >
          {pptLoading
            ? <><span style={{ fontSize: 16 }}>⏳</span> Generating PPTX...</>
            : <><span style={{ fontSize: 16 }}>🎯</span> Download Pitch Deck (.pptx)</>
          }
        </button>
      </div>

      <div className="pitch-deck-container">
        {/* Navigation */}
        <div className="pitch-deck-nav">
          <button
            className="deck-nav-btn"
            onClick={() => goTo(currentSlide - 1)}
            disabled={currentSlide === 0}
            id="deck-prev"
          >
            ←
          </button>
          <span className="deck-counter">{currentSlide + 1} / {total}</span>
          <button
            className="deck-nav-btn"
            onClick={() => goTo(currentSlide + 1)}
            disabled={currentSlide === total - 1}
            id="deck-next"
          >
            →
          </button>
        </div>

        {/* Slide */}
        <div
          className="pitch-slide"
          key={currentSlide}
          style={{ '--slide-gradient': SLIDE_GRADIENTS[currentSlide % SLIDE_GRADIENTS.length] }}
        >
          <div className="slide-number">Slide {currentSlide + 1} of {total}</div>
          <span className="slide-icon">{slide.icon}</span>
          <div className="slide-title">{slide.title}</div>
          <div className="slide-subtitle">{slide.subtitle}</div>
          <div className="slide-content">{slide.content}</div>
          <div className="slide-points">
            {slide.keyPoints.map((pt, i) => (
              <div key={i} className="slide-point">
                <div className="slide-point-bullet" />
                {pt}
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="deck-dots">
          {data.slides.map((_, i) => (
            <div
              key={i}
              className={`deck-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
