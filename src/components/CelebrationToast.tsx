import React, { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CelebrationToast: React.FC = () => {
  const { celebrationToast, setCelebrationToast } = useApp();

  useEffect(() => {
    if (!celebrationToast) return;
    const timer = setTimeout(() => {
      setCelebrationToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [celebrationToast, setCelebrationToast]);

  if (!celebrationToast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-3.5 sm:px-5 sm:py-3.5 shadow-2xl flex items-center justify-between gap-3 text-white backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-100">
            {celebrationToast}
          </p>
        </div>

        <button
          onClick={() => setCelebrationToast(null)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
