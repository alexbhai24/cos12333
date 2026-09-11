import React from 'react';
import './DotLoader.css';

interface DotLoaderProps {
  isLoading?: boolean;
}

export const DotLoader: React.FC<DotLoaderProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <div className="dot-loader-container pointer-events-none" aria-label="Loading..." aria-hidden="true">
      <div className="dot-loader">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
        <div className="dot dot-4"></div>
        <div className="dot dot-5"></div>
        <div className="dot dot-6"></div>
      </div>
    </div>
  );
};
