import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Flame, 
  Star,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../utils/cycleEngine';

export const YearCalendarView: React.FC = () => {
  const { state, selectedDate, setSelectedDate } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  // Selected viewing month (default to currently selected date's month)
  const [viewDate, setViewDate] = useState(() => {
    const [y, m] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Days in month calculation
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getTodayDateString();

  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    days.push({
      dateStr: `${year}-${mStr}-${dStr}`,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Calculate month metrics
  let monthCompletedTasks = 0;
  let monthSuperDays = 0;
  days.forEach((day) => {
    if (!day.dateStr) return;
    const log = state.dayLogs[day.dateStr];
    if (log) {
      monthCompletedTasks += log.completedTaskIds?.length || 0;
      if (log.isSuperDay) monthSuperDays++;
    }
  });

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border transition-all ${
      isIvory ? 'bg-white border-stone-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-xl'
    } space-y-5 animate-in fade-in duration-200`}>
      {/* Calendar Header with Navigation */}
      <div className={`flex items-center justify-between pb-4 border-b ${
        isIvory ? 'border-stone-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${isIvory ? 'text-stone-900' : 'text-white'}`}>
              {monthNames[month]} {year}
            </h3>
            <p className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              Календарь годового цикла дисциплины (365 дней)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isIvory ? 'border-stone-200 hover:bg-stone-100 text-stone-700' : 'border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const today = new Date();
              setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(todayStr);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isIvory ? 'border-stone-200 hover:bg-stone-100 text-stone-800' : 'border-slate-800 hover:bg-slate-800 text-white'
            }`}
          >
            Сегодня
          </button>

          <button
            onClick={handleNextMonth}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isIvory ? 'border-stone-200 hover:bg-stone-100 text-stone-700' : 'border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels (Mon - Sun) */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((w, idx) => (
          <div key={idx} className="text-[11px] font-bold text-stone-400 py-1 font-mono">
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((item, idx) => {
          if (!item.isCurrentMonth) {
            return <div key={idx} className="h-14 rounded-2xl opacity-20" />;
          }

          const isSelected = selectedDate === item.dateStr;
          const isToday = todayStr === item.dateStr;
          const log = state.dayLogs[item.dateStr];
          const hasTasks = log && log.completedTaskIds && log.completedTaskIds.length > 0;
          const isSuperDay = log?.isSuperDay;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(item.dateStr)}
              className={`h-14 rounded-2xl p-1.5 flex flex-col justify-between items-start transition-all relative border cursor-pointer ${
                isSelected
                  ? isIvory 
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30' 
                    : 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40 text-white'
                  : isToday
                    ? isIvory ? 'bg-stone-100 border-blue-500 text-blue-600' : 'bg-slate-900 border-blue-500 text-blue-400'
                    : isSuperDay
                      ? isIvory ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      : hasTasks
                        ? isIvory ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300'
                        : isIvory
                          ? 'bg-[#FAF8F5] border-stone-200/80 text-stone-700 hover:border-stone-300'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className={`text-xs font-bold font-mono ${isToday ? 'text-blue-500' : ''}`}>
                  {item.dayNum}
                </span>

                {isSuperDay && (
                  <span className="text-[10px] text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />
                  </span>
                )}
              </div>

              {/* Completion Indicator */}
              <div className="w-full">
                {hasTasks ? (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-mono opacity-80">
                      {log.completedTaskIds.length}
                    </span>
                  </div>
                ) : isToday ? (
                  <span className="text-[8px] font-black uppercase text-blue-500">Сегодня</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend & Month Stats */}
      <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
        isIvory ? 'border-stone-200 text-stone-600' : 'border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500" />
            <span>Super Day (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500" />
            <span>Выполнены задачи</span>
          </div>
        </div>

        <div className="font-mono text-xs">
          Итоги месяца: <strong>{monthCompletedTasks}</strong> задач • <strong>{monthSuperDays}</strong> супер-дней
        </div>
      </div>
    </div>
  );
};
