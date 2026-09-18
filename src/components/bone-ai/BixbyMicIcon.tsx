import React from 'react';

interface BixbyMicIconProps {
  className?: string;
  size?: number;
  isListening?: boolean;
}

export const BixbyMicIcon: React.FC<BixbyMicIconProps> = ({ 
  className = "w-6 h-6", 
  size = 24,
  isListening = false 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${isListening ? 'animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : ''}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bixby-mic-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="35%" stopColor="#6366F1" />
          <stop offset="70%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Solid gradient mic capsule in the center */}
      <rect 
        x="9.5" 
        y="3" 
        width="5" 
        height="10.5" 
        rx="2.5" 
        fill="url(#bixby-mic-gradient)" 
      />

      {/* Curved cradle arc around lower half of capsule */}
      <path 
        d="M6 10.5C6 13.8 8.7 16.5 12 16.5C15.3 16.5 18 13.8 18 10.5" 
        stroke="url(#bixby-mic-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* Bottom horizontal base bar */}
      <path 
        d="M8.5 20.5H15.5" 
        stroke="url(#bixby-mic-gradient)" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
