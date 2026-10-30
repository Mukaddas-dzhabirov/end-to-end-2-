import React from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyPraiseCard: React.FC = () => {
  const { dailyPraise, dayOverallPct, todayDayLog, state } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  return (
    <div className={`p-4 rounded-3xl border transition-all ${
      todayDayLog.isSuperDay
        ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-emerald-500/20 border-amber-500/40 shadow-lg shadow-amber-500/10'
        : isIvory
          ? 'bg-white border-stone-200/90 shadow-xs'
          : 'bg-slate-900/60 border-slate-800/80 shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
            todayDayLog.isSuperDay
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
              : 'bg-amber-500/15 text-amber-500'
          }`}>
            {todayDayLog.isSuperDay ? <Trophy className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold tracking-tight ${
                isIvory ? 'text-stone-900' : 'text-white'
              }`}>
                {dailyPraise.title}
              </h3>
              {todayDayLog.isSuperDay && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-current" />
                  SUPER DAY
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 leading-relaxed ${
              isIvory ? 'text-stone-600' : 'text-slate-300'
            }`}>
              {dailyPraise.text}
            </p>
          </div>
        </div>

        {/* Circular / Badge Progress Pill */}
        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold block" style={{ color: '#F59E0B' }}>
            {dayOverallPct}% дня
          </span>
          <span className={`text-[10px] block ${isIvory ? 'text-stone-400' : 'text-slate-500'}`}>
            {todayDayLog.completedTaskIds.length} правил
          </span>
        </div>
      </div>
    </div>
  );
};
