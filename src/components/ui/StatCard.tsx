import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendType = 'positive',
  icon,
  subtitle,
  className = '',
  onClick,
}) => {
  const theme = {
    positive: {
      cardBg:
        'bg-gradient-to-br from-[#d4e6ff]/90 via-[#dcfce7]/85 to-[#c7d2fe]/85 border-[#93c5fd] shadow-[0_12px_28px_-6px_rgba(37,99,235,0.20),inset_0_1px_0_rgba(255,255,255,0.85)] hover:from-[#bfdbfe]/95 hover:via-[#bbf7d0]/90 hover:to-[#a5b4fc]/90 hover:border-[#3b82f6] hover:shadow-[0_18px_38px_-6px_rgba(37,99,235,0.32),0_0_24px_rgba(16,185,129,0.22)]',
      trendText: 'text-[#0f766e]',
      orb: 'from-[#10b981]/35 via-[#3b82f6]/25 to-transparent',
      topBar: 'from-[#10b981] via-[#3b82f6] to-[#06b6d4]',
      iconBg:
        'bg-gradient-to-br from-[#2563eb] to-[#0d9488] text-white border-white/50 shadow-[0_8px_20px_rgba(37,99,235,0.38)]',
    },
    negative: {
      cardBg:
        'bg-gradient-to-br from-[#ffe4e6]/90 via-[#fecdd3]/80 to-[#ffedd5]/85 border-[#fda4af] shadow-[0_12px_28px_-6px_rgba(225,29,72,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] hover:from-[#fecdd3]/95 hover:via-[#fda4af]/85 hover:to-[#fed7aa]/90 hover:border-[#f43f5e] hover:shadow-[0_18px_38px_-6px_rgba(225,29,72,0.30),0_0_24px_rgba(244,63,94,0.22)]',
      trendText: 'text-[#be123c]',
      orb: 'from-[#f43f5e]/35 via-[#fb923c]/25 to-transparent',
      topBar: 'from-[#e11d48] via-[#f43f5e] to-[#f59e0b]',
      iconBg:
        'bg-gradient-to-br from-[#e11d48] to-[#ea580c] text-white border-white/50 shadow-[0_8px_20px_rgba(225,29,72,0.38)]',
    },
    warning: {
      cardBg:
        'bg-gradient-to-br from-[#fef3c7]/90 via-[#fde68a]/80 to-[#ffedd5]/90 border-[#fcd34d] shadow-[0_12px_28px_-6px_rgba(217,119,6,0.20),inset_0_1px_0_rgba(255,255,255,0.85)] hover:from-[#fde68a]/95 hover:via-[#fcd34d]/85 hover:to-[#fed7aa]/95 hover:border-[#f59e0b] hover:shadow-[0_18px_38px_-6px_rgba(217,119,6,0.32),0_0_24px_rgba(245,158,11,0.25)]',
      trendText: 'text-[#92400e]',
      orb: 'from-[#f59e0b]/35 via-[#d97706]/25 to-transparent',
      topBar: 'from-[#f59e0b] via-[#d97706] to-[#4268e8]',
      iconBg:
        'bg-gradient-to-br from-[#d97706] to-[#b45309] text-white border-white/50 shadow-[0_8px_20px_rgba(217,119,6,0.38)]',
    },
    neutral: {
      cardBg:
        'bg-gradient-to-br from-[#dbeafe]/90 via-[#e0e7ff]/85 to-[#ede9fe]/85 border-[#93c5fd] shadow-[0_12px_28px_-6px_rgba(66,104,232,0.20),inset_0_1px_0_rgba(255,255,255,0.85)] hover:from-[#bfdbfe]/95 hover:via-[#c7d2fe]/90 hover:to-[#ddd6fe]/90 hover:border-[#4268e8] hover:shadow-[0_18px_38px_-6px_rgba(66,104,232,0.32),0_0_24px_rgba(99,102,241,0.24)]',
      trendText: 'text-[#1d4ed8]',
      orb: 'from-[#4268e8]/35 via-[#6366f1]/25 to-transparent',
      topBar: 'from-[#4268e8] via-[#6366f1] to-[#d5b27a]',
      iconBg:
        'bg-gradient-to-br from-[#4268e8] to-[#4f46e5] text-white border-white/50 shadow-[0_8px_20px_rgba(66,104,232,0.40)]',
    },
  }[trendType];

  return (
    <div
      onClick={onClick}
      className={`stat-card-tinted group relative p-5 backdrop-blur-xl rounded-2xl border hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer ${theme.cardBg} ${className}`}
    >
      {/* Top Illuminated Accent Line */}
      <div
        className={`absolute inset-x-0 top-0 h-[3.5px] bg-gradient-to-r ${theme.topBar} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Ambient Radial Lighting Orb in Top-Right Corner */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${theme.orb} blur-2xl opacity-85 group-hover:scale-150 group-hover:opacity-100 transition-all duration-500`}
      />

      {/* Specular Shimmer Sweep on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold text-[#334155] group-hover:text-[#1e3a8a] uppercase tracking-wider block transition-colors">
            {label}
          </span>
          <div className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tight mt-1.5 mb-1 group-hover:scale-[1.02] origin-left transition-transform">
            {value}
          </div>
          {trend && (
            <div className={`text-xs font-bold flex items-center gap-1.5 ${theme.trendText}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{trend}</span>
            </div>
          )}
          {subtitle && <p className="text-xs text-[#475569] font-medium mt-1">{subtitle}</p>}
        </div>

        {icon && (
          <div
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${theme.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
