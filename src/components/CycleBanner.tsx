import React from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../utils/cycleEngine';

export const CycleBanner: React.FC = () => {
  const { cycleStatus, selectedDate, setSelectedDate, state, todayDayLog, dayOverallPct } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';
  const isToday = selectedDate === getTodayDateString();

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yr}-${mo}-${day}`);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yr}-${mo}-${day}`);
  };

  // Human readable date in Russian
  const [y, m, d] = selectedDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const weekdayName = dateObj.toLocaleDateString('ru-RU', { weekday: 'long' });
  const monthDayName = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <div className={`p-4 sm:p-5 rounded-3xl border transition-all relative overflow-hidden ${
      isIvory
        ? 'bg-gradient-to-r from-[#FAF8F5] via-amber-50/40 to-[#FAF8F5] border-stone-200 text-stone-900 shadow-xs'
        : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800 text-white shadow-xl'
    }`}>
      {/* Top Row: Date with Editorial Serif styling (inspired by reference screen) & Cycle Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${
            isIvory ? 'text-amber-700' : 'text-amber-400'
          }`}>
            {weekdayName}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight capitalize mt-0.5">
            {monthDayName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              {cycleStatus.isPreSeason
                ? `Калибровка • Старт через ${cycleStatus.preSeasonDaysRemaining} дн.`
                : `День ${cycleStatus.currentDayNumber} из 365`}
            </span>
            <span className="text-xs text-stone-400 font-mono">• {dayOverallPct}% сегодня</span>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
          isIvory ? 'bg-white border-stone-200 shadow-2xs' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <button
            onClick={handlePrevDay}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isIvory ? 'hover:bg-stone-100 text-stone-700' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Предыдущий день"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-2 text-center">
            <span className={`text-xs font-semibold block ${isIvory ? 'text-stone-800' : 'text-slate-200'}`}>
              {d}.{String(m).padStart(2, '0')}.{y}
            </span>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(getTodayDateString())}
                className="text-[9px] text-amber-500 hover:underline flex items-center justify-center gap-0.5 mx-auto font-medium"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Сегодня
              </button>
            )}
          </div>

          <button
            onClick={handleNextDay}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isIvory ? 'hover:bg-stone-100 text-stone-700' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Следующий день"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar of Year Cycle */}
      <div className={`mt-3.5 pt-3 border-t relative z-10 ${
        isIvory ? 'border-stone-200/80' : 'border-slate-800/80'
      }`}>
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] mb-1 font-medium">
          <span className={`flex items-center gap-1 ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
            <Calendar className="w-3 h-3 text-amber-500" />
            Цикл №{state.activeCycleNumber}: {cycleStatus.startDateFormatted} — {cycleStatus.endDateFormatted}
          </span>
          <span className="font-mono text-amber-500 font-bold">
            {cycleStatus.progressPct}% года
          </span>
        </div>

        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
          isIvory ? 'bg-stone-200' : 'bg-slate-800'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(2, cycleStatus.progressPct)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
