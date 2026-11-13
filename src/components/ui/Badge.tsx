import React from 'react';

export type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'gold' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dotColor: string }> = {
    green: {
      bg: 'bg-[#e8f7f0]/85 border-[#16845f]/30 shadow-[0_0_12px_rgba(22,132,95,0.16)]',
      text: 'text-[#116b4c]',
      dotColor: 'bg-[#16845f] shadow-[0_0_6px_#16845f]',
    },
    amber: {
      bg: 'bg-[#fff4df]/85 border-[#d97706]/30 shadow-[0_0_12px_rgba(217,119,6,0.16)]',
      text: 'text-[#9a5b0c]',
      dotColor: 'bg-[#d97706] shadow-[0_0_6px_#d97706]',
    },
    red: {
      bg: 'bg-[#ffeaec]/85 border-[#c84c58]/35 shadow-[0_0_12px_rgba(200,76,88,0.2)]',
      text: 'text-[#b33642]',
      dotColor: 'bg-[#c84c58] shadow-[0_0_6px_#c84c58]',
    },
    blue: {
      bg: 'bg-[#edf1ff]/85 border-[#4268e8]/30 shadow-[0_0_12px_rgba(66,104,232,0.18)]',
      text: 'text-[#3656c9]',
      dotColor: 'bg-[#4268e8] shadow-[0_0_6px_#4268e8]',
    },
    gray: {
      bg: 'bg-[#f1f5f9]/80 border-[#94a3b8]/30',
      text: 'text-[#475569]',
      dotColor: 'bg-[#64748b]',
    },
    gold: {
      bg: 'bg-[#fbf6ec]/85 border-[#d5b27a]/45 shadow-[0_0_12px_rgba(213,178,122,0.22)]',
      text: 'text-[#8c621d]',
      dotColor: 'bg-[#b7791f] shadow-[0_0_6px_#b7791f]',
    },
    purple: {
      bg: 'bg-[#f3e8ff]/85 border-[#9333ea]/30 shadow-[0_0_12px_rgba(147,51,234,0.16)]',
      text: 'text-[#7e22ce]',
      dotColor: 'bg-[#9333ea] shadow-[0_0_6px_#9333ea]',
    },
  };

  const style = variantStyles[variant] || variantStyles.gray;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-xs transition-all duration-200 hover:scale-105 ${style.bg} ${style.text} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${style.dotColor}`} />}
      {children}
    </span>
  );
};
