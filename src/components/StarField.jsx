import React, { useEffect, useRef } from 'react';

const BUBBLES_COUNT = 40;

export const StarField = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    for (let i = 0; i < BUBBLES_COUNT; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'star';
      const size = Math.random() * 8 + 3;
      bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 3}s;
        --delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.15 + 0.05};
      `;
      container.appendChild(bubble);
    }
  }, []);

  return (
    <>
      <div className="star-field" ref={containerRef} />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </>
  );
};
