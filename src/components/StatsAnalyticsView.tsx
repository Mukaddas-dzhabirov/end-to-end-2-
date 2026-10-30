import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TIME_BLOCKS } from '../utils/timeBlocks';

export const StatsAnalyticsView: React.FC = () => {
  const { 
    state, 
    levelInfo, 
    todayDayLog, 
    weeklyStats, 
    blockProgress, 
    dayOverallPct, 
    focusScore 
  } = useApp();

  const [breakdownView, setBreakdownView] = useState<'daily' | 'weekly'>('daily');
  const isIvory = state.settings.theme.mode === 'ivory';

  // Calculate year totals
  const totalDaysLogged = Object.keys(state.dayLogs).length;
  let totalTasksCompletedAllTime = 0;
  let totalSuperDaysCount = 0;

  Object.values(state.dayLogs).forEach((log) => {
    totalTasksCompletedAllTime += log.completedTaskIds?.length || 0;
    if (log.isSuperDay) totalSuperDaysCount++;
  });

  // Calculate weekly average
  const weeklyAvg = Math.round(
    weeklyStats.reduce((acc, curr) => acc + curr.pct, 0) / Math.max(1, weeklyStats.length)
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top 3 KPI Cards: Focus Score, Level & XP, Streak (matching reference screen) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Focus Score */}
        <div className={`p-3 sm:p-4 rounded-3xl border text-center transition-all ${
          isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-stone-400 mb-1">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span>Focus Score</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-blue-500 font-mono">
            {focusScore}
            <span className="text-xs text-stone-400 font-normal">/100</span>
          </div>
          <span className={`text-[10px] block mt-0.5 ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
            Качество фокуса
          </span>
        </div>

        {/* Level & XP */}
        <div className={`p-3 sm:p-4 rounded-3xl border text-center transition-all ${
          isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-stone-400 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Level & XP</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-500 font-mono flex items-center justify-center gap-1">
            <span>{levelInfo.badge}</span>
            <span>{levelInfo.currentLevel}</span>
          </div>
          <span className={`text-[10px] block mt-0.5 truncate ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
            {levelInfo.title}
          </span>
        </div>

        {/* Streak */}
        <div className={`p-3 sm:p-4 rounded-3xl border text-center transition-all ${
          isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-stone-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Streak</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-red-500 font-mono">
            {totalSuperDaysCount > 0 ? totalSuperDaysCount : (todayDayLog.completedTaskIds.length > 0 ? 1 : 0)}
            <span className="text-xs text-stone-400 font-normal"> дн.</span>
          </div>
          <span className={`text-[10px] block mt-0.5 ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
            Серия дисциплины
          </span>
        </div>
      </div>

      {/* Center Row: Circular Day Ring & Weekly Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Circular Progress Widget (matching reference) */}
        <div className={`p-5 rounded-3xl border flex items-center justify-between gap-4 ${
          isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
        }`}>
          <div className="space-y-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider block ${
              isIvory ? 'text-stone-500' : 'text-slate-400'
            }`}>
              Сегодняшний прогресс
            </span>
            <h4 className={`text-xl font-black ${isIvory ? 'text-stone-900' : 'text-white'}`}>
              {dayOverallPct === 100 ? 'Идеальный день!' : `${dayOverallPct}% выполнено`}
            </h4>
            <p className={`text-xs leading-relaxed ${isIvory ? 'text-stone-600' : 'text-slate-400'}`}>
              Закрыто {todayDayLog.completedTaskIds.length} задач. Заработано +{todayDayLog.earnedCoins} монет XP сегодня.
            </p>
            {todayDayLog.isSuperDay && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                <Sparkles className="w-3 h-3" />
                Super Day Bonus (+150 XP)
              </span>
            )}
          </div>

          {/* SVG Circular Ring */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={isIvory ? '#E7E5E4' : '#1E293B'}
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={dayOverallPct === 100 ? '#10B981' : '#3B82F6'}
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * dayOverallPct) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-xl font-black font-mono ${isIvory ? 'text-stone-900' : 'text-white'}`}>
                {dayOverallPct}%
              </span>
              <span className="text-[9px] text-stone-400 font-medium">ФОКУС</span>
            </div>
          </div>
        </div>

        {/* Weekly Streak Bar Chart (matching reference) */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
          isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider block ${
                isIvory ? 'text-stone-500' : 'text-slate-400'
              }`}>
                Weekly Streak
              </span>
              <span className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
                Средняя продуктивность: <strong className="text-blue-500">{weeklyAvg}%</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-stone-400">7 дней</span>
          </div>

          {/* Bar Chart Columns */}
          <div className="h-28 flex items-end justify-between gap-2 pt-3">
            {weeklyStats.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                {/* Bar */}
                <div className={`w-full max-w-[28px] rounded-lg transition-all relative overflow-hidden flex items-end ${
                  isIvory ? 'bg-stone-100' : 'bg-slate-800'
                }`} style={{ height: '70px' }}>
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      d.isToday 
                        ? 'bg-gradient-to-t from-blue-600 to-cyan-400' 
                        : d.pct >= 75 
                          ? 'bg-blue-500' 
                          : d.pct > 0 
                            ? 'bg-blue-500/50' 
                            : 'bg-transparent'
                    }`}
                    style={{ height: `${Math.max(d.pct > 0 ? 15 : 0, d.pct)}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className={`text-[10px] font-mono ${
                  d.isToday 
                    ? 'font-bold text-blue-500' 
                    : isIvory ? 'text-stone-500' : 'text-slate-400'
                }`}>
                  {d.dayName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productivity Breakdown by 4 Blocks (matching reference screenshot) */}
      <div className={`p-5 rounded-3xl border ${
        isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-md'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className={`text-sm font-bold ${isIvory ? 'text-stone-900' : 'text-white'}`}>
              Productivity Breakdown (по блокам)
            </h4>
            <p className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              Аналитика распределения усилий в течение дня
            </p>
          </div>

          <div className={`flex rounded-xl p-0.5 border ${
            isIvory ? 'bg-stone-100 border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => setBreakdownView('daily')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                breakdownView === 'daily'
                  ? isIvory ? 'bg-white text-stone-900 shadow-xs' : 'bg-slate-800 text-white'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setBreakdownView('weekly')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                breakdownView === 'weekly'
                  ? isIvory ? 'bg-white text-stone-900 shadow-xs' : 'bg-slate-800 text-white'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {TIME_BLOCKS.filter((b) => !b.isRestBlock).map((b) => {
            const progress = blockProgress[b.id] || { total: 0, completed: 0, pct: 0 };
            return (
              <div key={b.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: b.accentColor }}
                    />
                    <span className={`font-semibold ${isIvory ? 'text-stone-800' : 'text-slate-200'}`}>
                      Блок {b.blockNumber}: {b.title}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">({b.timeRange})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-stone-400">{progress.completed}/{progress.total}</span>
                    <span className="font-bold" style={{ color: b.accentColor }}>{progress.pct}%</span>
                  </div>
                </div>

                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  isIvory ? 'bg-stone-100' : 'bg-slate-800'
                }`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress.pct}%`,
                      backgroundColor: b.accentColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
