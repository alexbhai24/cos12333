import React from 'react';

interface Control {
  label: string;
  key: string;
}

interface GameControlsProps {
  controls: Control[];
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({ controls, className = '' }) => (
  <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
    {controls.map((c, i) => (
      <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-400">
        <kbd className="px-2 py-0.5 bg-[#09182D] border border-[rgba(0,240,255,0.2)] rounded-md font-mono text-cyan-300 text-[10px]">
          {c.key}
        </kbd>
        <span>{c.label}</span>
      </div>
    ))}
  </div>
);
