import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'soft' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'group relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap font-semibold rounded-xl transition-all duration-250 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs md:text-sm px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5 font-bold',
  };

  // 80% Translucent Background + Specular Top Highlight + Live Hover Glow
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-[#4268e8]/85 via-[#5176f5]/85 to-[#3556d4]/85 text-white border border-white/25 shadow-[0_4px_18px_rgba(66,104,232,0.38),inset_0_1px_0_rgba(255,255,255,0.45)] hover:from-[#4268e8]/95 hover:to-[#2e4ec7]/95 hover:border-[#93b4ff]/60 hover:shadow-[0_8px_28px_rgba(66,104,232,0.62),0_0_18px_rgba(96,136,255,0.45),inset_0_1px_0_rgba(255,255,255,0.65)]',
    secondary:
      'bg-white/80 text-[#1e293b] border border-[#cbd5e1]/80 shadow-[0_2px_10px_rgba(23,36,59,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/95 hover:border-[#4268e8]/50 hover:text-[#4268e8] hover:shadow-[0_8px_22px_rgba(66,104,232,0.18),0_0_14px_rgba(66,104,232,0.12)]',
    dark:
      'bg-gradient-to-r from-[#17243b]/85 via-[#1f314f]/85 to-[#17243b]/85 text-white border border-white/15 shadow-[0_4px_16px_rgba(23,36,59,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#1e2f4d]/95 hover:to-[#273d63]/95 hover:border-[#d5b27a]/55 hover:shadow-[0_8px_26px_rgba(23,36,59,0.5),0_0_16px_rgba(213,178,122,0.28)]',
    soft:
      'bg-[#edf1ff]/80 text-[#4268e8] border border-[#cbd8ff]/80 shadow-[0_2px_12px_rgba(66,104,232,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-[#e0e8ff]/90 hover:border-[#4268e8]/50 hover:shadow-[0_6px_20px_rgba(66,104,232,0.26),0_0_12px_rgba(66,104,232,0.18)]',
    danger:
      'bg-white/80 text-[#c84c58] border border-[#fecdd3] shadow-[0_2px_10px_rgba(200,76,88,0.1)] hover:bg-[#fff1f2]/90 hover:border-[#c84c58]/60 hover:shadow-[0_6px_20px_rgba(200,76,88,0.28),0_0_12px_rgba(200,76,88,0.2)]',
    ghost:
      'bg-white/40 text-[#475569] border border-transparent hover:bg-white/80 hover:border-[#e2e8f0] hover:text-[#4268e8] hover:shadow-[0_4px_14px_rgba(66,104,232,0.12)]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Live Specular Shimmer Light Sweep on Hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out"
      />

      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
              {icon}
            </span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
              {icon}
            </span>
          )}
        </span>
      )}
    </button>
  );
};
