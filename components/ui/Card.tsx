import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-md 
        border border-white/10 
        rounded-xl 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-white/10 hover:border-amber-500/30 hover:shadow-amber-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};