'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#16845f] shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-[#b7791f] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#c84c58] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#4268e8] shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#17243b] text-white rounded-xl shadow-xl border border-white/10 text-xs md:text-sm animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-3">
              {icons[toast.type || 'info']}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

