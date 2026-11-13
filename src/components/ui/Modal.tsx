'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/55 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidthStyles} max-h-[92vh] flex flex-col bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_25px_70px_-10px_rgba(23,36,59,0.35),0_0_40px_rgba(66,104,232,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] border border-white/80 overflow-hidden transform transition-all duration-200 scale-100 animate-in fade-in zoom-in-95`}
      >
        {/* Top Ambient Lighting Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4268e8] via-[#d5b27a] to-[#16845f]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#e2e8f0]/80 bg-white/60 backdrop-blur-md">
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-[#17243b] tracking-tight">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#64748b] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#64748b] hover:text-[#c84c58] hover:bg-[#fff1f2] transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-130px)] space-y-4 text-sm text-[#334155]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e2e8f0]/80 bg-white/60 backdrop-blur-md">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
