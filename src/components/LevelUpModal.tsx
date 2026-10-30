import React from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, setLevelUpModalData } = useApp();

  if (!levelUpModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-[#0B0F19] border-2 border-amber-500/50 rounded-3xl max-w-sm w-full p-6 sm:p-8 text-center text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative Golden Rays */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mx-auto mb-4 border-2 border-amber-300">
          {levelUpModalData.badge}
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          НОВЫЙ УРОВЕНЬ!
        </span>

        <h3 className="text-3xl font-black text-white tracking-tight font-mono mt-1">
          Уровень {levelUpModalData.newLevel}
        </h3>

        <p className="text-base font-bold text-amber-400 mt-1">
          «{levelUpModalData.title}»
        </p>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed px-2">
          {levelUpModalData.perk}
        </p>

        <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          Твои монеты дисциплины растут и останутся с тобой во всех будущих годовых циклах! 💎
        </div>

        <button
          onClick={() => setLevelUpModalData(null)}
          className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ПРОДОЛЖАТЬ ПУТЬ</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
