import React, { useState } from 'react';

export const Expandable = ({ label = "View details →", children }) => {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button 
        className="expandable-trigger"
        onClick={() => setExpanded(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="expandable-content">
      {children}
    </div>
  );
};
