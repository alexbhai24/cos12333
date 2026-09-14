import React from 'react';

interface MessagePlusIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const MessagePlusIcon: React.FC<MessagePlusIconProps> = ({ 
  className = "w-6 h-6", 
  size = 24,
  strokeWidth = 1.8 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Refined Bixby-style speech bubble matching user reference */}
      <path d="M18.5 12C18.5 7.5 15.5 5 12 5C8.5 5 5.5 7.5 5.5 12C5.5 14 6.2 15.6 7.4 16.6L6.2 19.4C6 19.8 6.4 20.2 6.8 20L9.8 18.5C10.5 18.8 11.2 19 12 19H13.5" />
      {/* Crisp plus symbol at the bottom right */}
      <path d="M16.5 18.5H21.5" />
      <path d="M19 16V21" />
    </svg>
  );
};
