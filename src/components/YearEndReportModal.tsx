import React from 'react';
import { 
  X, 
  Award, 
  Download, 
  Copy, 
  Sparkles, 
  Trophy, 
  Flame, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface YearEndReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YearEndReportModal: React.FC<YearEndReportModalProps> = ({ isOpen, onClose }) => {
  const { state, levelInfo, setCelebrationToast, cycleStatus } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  if (!isOpen) return null;

  // Compute full annual totals
  const totalDaysLogged = Object.keys(state.dayLogs).length;
  let totalTasksCompleted = 0;
  let totalSuperDays = 0;

  Object.values(state.dayLogs).forEach((log) => {
    totalTasksCompleted += log.completedTaskIds?.length || 0;
    if (log.isSuperDay) totalSuperDays++;
  });

  const completionRate = totalDaysLogged > 0 
    ? Math.round((totalSuperDays / Math.max(1, totalDaysLogged)) * 100) 
    : 0;

  const copyReportText = () => {
    const text = `🏆 ИТОГОВЫЙ ОТЧЁТ: MY YEAR. MY RULES.\n` +
      `Год: №${state.activeCycleNumber} (365 дней дисциплины)\n` +
      `Герой: ${state.settings.profile.name}\n` +
      `Уровень: ${levelInfo.currentLevel} — «${levelInfo.title}»\n` +
      `Баланс монет: ${state.lifetimeCoins.toLocaleString()} XP\n` +
      `Выполнено правил: ${totalTasksCompleted}\n` +
      `Идеальных дней (Super Days): ${totalSuperDays}\n` +
      `«${state.settings.profile.motto}»`;

    navigator.clipboard.writeText(text);
    setCelebrationToast('Текст годового отчёта скопирован в буфер! 📋');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className={`rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl relative border ${
        isIvory ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-slate-900 border-slate-800 text-white'
      } animate-in fade-in zoom-in-95 duration-150`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-xl transition-colors cursor-pointer z-10 ${
            isIvory ? 'text-stone-400 hover:text-stone-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="text-center space-y-2">
            <span className="w-12 h-12 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-amber-500/20">
              <Award className="w-7 h-7" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold block">
              ПАСПОРТ ТРИУМФА ДИСЦИПЛИНЫ
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Годовой отчёт результатов
            </h2>
            <p className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              Официальное свидетельство прохождения 365-дневного цикла
            </p>
          </div>

          {/* Certificate Card */}
          <div className={`p-5 rounded-3xl border relative overflow-hidden ${
            isIvory 
              ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-200 shadow-sm' 
              : 'bg-gradient-to-b from-amber-950/20 to-slate-950 border-amber-500/30 shadow-xl'
          }`}>
            <div className="border border-dashed border-amber-500/40 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Владелец года:</span>
                  <span className="text-base font-black text-amber-500">
                    {state.settings.profile.name} {state.settings.profile.avatarEmoji}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Цикл:</span>
                  <span className="text-xs font-mono font-bold">Год №{state.activeCycleNumber}</span>
                </div>
              </div>

              {/* 4 Pillars of Victory */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className={`p-2.5 rounded-xl border ${
                  isIvory ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="text-[10px] text-stone-400 block">Закрыто правил</span>
                  <span className="text-lg font-black font-mono text-emerald-500">{totalTasksCompleted}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isIvory ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="text-[10px] text-stone-400 block">Идеальных дней</span>
                  <span className="text-lg font-black font-mono text-amber-500">{totalSuperDays}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isIvory ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="text-[10px] text-stone-400 block">Накоплено монет</span>
                  <span className="text-lg font-black font-mono text-blue-500">{state.lifetimeCoins.toLocaleString()}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isIvory ? 'bg-white border-stone-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="text-[10px] text-stone-400 block">Ранг персонажа</span>
                  <span className="text-xs font-bold text-amber-500 truncate block mt-1">
                    {levelInfo.title}
                  </span>
                </div>
              </div>

              {/* User Motto */}
              <div className="text-center pt-2">
                <p className="text-xs italic text-stone-500 font-serif">
                  «{state.settings.profile.motto}»
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-emerald-600 font-mono font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Верифицировано локальным кодексом дисциплины</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={copyReportText}
              className={`flex-1 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isIvory ? 'border-stone-300 hover:bg-stone-100 text-stone-800' : 'border-slate-700 hover:bg-slate-800 text-white'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>Скопировать отчёт</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Печать / Сохранить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
