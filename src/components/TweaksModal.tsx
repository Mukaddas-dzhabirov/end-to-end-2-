import React from 'react';
import { X, Palette, Sliders, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccentColor, DensityStyle, StreakStyle } from '../types';

interface TweaksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TweaksModal: React.FC<TweaksModalProps> = ({ isOpen, onClose }) => {
  const { state, updateTheme, resetAllData } = useApp();
  const theme = state.settings.theme;
  const isIvory = theme.mode === 'ivory';

  if (!isOpen) return null;

  const accents: { id: AccentColor; label: string; color: string }[] = [
    { id: 'terracotta', label: 'terracotta', color: '#C85A32' },
    { id: 'sage', label: 'sage', color: '#4B7A5D' },
    { id: 'sky', label: 'sky', color: '#3B82F6' },
    { id: 'lavender', label: 'lavender', color: '#8B5CF6' },
    { id: 'gold', label: 'clay / gold', color: '#F59E0B' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-black/60 backdrop-blur-xs p-4 sm:p-6">
      <div className={`rounded-3xl max-w-xs w-full p-5 shadow-2xl relative border ${
        isIvory ? 'bg-white border-stone-200 text-stone-900' : 'bg-slate-900 border-slate-800 text-white'
      } animate-in fade-in slide-in-from-right-5 duration-150 space-y-4`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-200/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-stone-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Tweaks
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Mode Toggle (Dark vs Warm Ivory) */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            THEME MODE
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateTheme({ mode: 'dark' })}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                theme.mode === 'dark'
                  ? 'bg-slate-950 border-slate-700 text-white font-bold ring-1 ring-white/20'
                  : 'bg-stone-100 border-transparent text-stone-500'
              }`}
            >
              Dark Obsidian
            </button>
            <button
              onClick={() => updateTheme({ mode: 'ivory' })}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                theme.mode === 'ivory'
                  ? 'bg-[#F5F2EB] border-amber-500 text-stone-900 font-bold ring-1 ring-amber-500/30'
                  : 'bg-slate-800 border-transparent text-slate-400'
              }`}
            >
              Warm Ivory
            </button>
          </div>
        </div>

        {/* Accent Colors (terracotta, sage, sky, lavender, clay) */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            ACCENT
          </label>
          <div className="flex flex-wrap gap-1.5">
            {accents.map((acc) => (
              <button
                key={acc.id}
                onClick={() => updateTheme({ accent: acc.id })}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  theme.accent === acc.id
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : isIvory
                      ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: acc.color }}
                />
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Density (airy, compact) */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            DENSITY
          </label>
          <div className="flex gap-1.5">
            {(['airy', 'compact'] as DensityStyle[]).map((d) => (
              <button
                key={d}
                onClick={() => updateTheme({ density: d })}
                className={`px-3 py-1 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                  theme.density === d
                    ? 'bg-stone-900 text-white font-bold'
                    : isIvory
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-slate-800 text-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Streak Style (flame, number, bar) */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            STREAK STYLE
          </label>
          <div className="flex gap-1.5">
            {(['flame', 'number', 'bar'] as StreakStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => updateTheme({ streakStyle: s })}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                  theme.streakStyle === s
                    ? 'bg-stone-900 text-white font-bold'
                    : isIvory
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Data Reset */}
        <div className="pt-2 border-t border-stone-200/50 space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            DATA
          </label>
          <button
            onClick={() => {
              if (window.confirm('Сбросить данные к начальным настройкам?')) {
                resetAllData();
                onClose();
              }
            }}
            className="w-full py-1.5 rounded-xl border border-stone-200 text-xs text-stone-500 hover:text-red-500 hover:border-red-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset seed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
