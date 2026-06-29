import React, { useEffect, useRef, useState } from 'react';

function getScoreBand(score) {
  if (score >= 86) return { color: '#10b981', band: 'Exceptional' };
  if (score >= 76) return { color: '#34d399', band: 'Strong' };
  if (score >= 66) return { color: '#f59e0b', band: 'Above Avg' };
  if (score >= 51) return { color: '#fb923c', band: 'Average' };
  if (score >= 36) return { color: '#f87171', band: 'Weak' };
  return { color: '#f43f5e', band: 'Poor' };
}

export const ScoreGauge = ({
  score,
  label,
  color: _color = '#7c3aed',
  size = 120,
}) => {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [score]);

  const { color: scoreColor, band } = getScoreBand(score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayed / 100) * circumference;

  return (
    <div className="score-gauge-container">
      <svg
        width={size}
        height={size}
        className="gauge-svg"
        style={{ '--gauge-color': scoreColor }}
      >
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(14,165,233,0.08)" strokeWidth={8}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        <text
          x={size / 2} y={size / 2 - 6}
          textAnchor="middle" dominantBaseline="middle"
          fill={scoreColor}
          fontFamily="Space Grotesk, sans-serif"
          fontSize={size * 0.22} fontWeight="700"
        >
          {displayed}
        </text>
        <text
          x={size / 2} y={size / 2 + size * 0.15}
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(148,163,184,0.7)"
          fontFamily="Inter, sans-serif"
          fontSize={size * 0.1}
        >
          /100
        </text>
      </svg>

      <div className="gauge-label">{label}</div>

      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: 1, color: scoreColor,
        background: `${scoreColor}18`,
        border: `1px solid ${scoreColor}40`,
        borderRadius: 100, padding: '2px 10px', marginTop: 4,
        display: 'inline-block',
      }}>
        {band}
      </div>
    </div>
  );
};
