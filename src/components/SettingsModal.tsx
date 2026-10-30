import React, { useRef, useState } from 'react';
import { 
  X, 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Bell, 
  ShieldAlert, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    state, 
    exportBackupJSON, 
    importBackupJSON, 
    advanceToNextCycle, 
    resetAllData 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRolloverConfirm, setShowRolloverConfirm] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Настройки и Циклы
              </h3>
              <p className="text-[11px] text-slate-400">
                Управление годовым циклом и данными
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Cycle Rollover / Management */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Calendar className="w-4 h-4" />
              <span>Управление годовым циклом (365 Дней)</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Текущий цикл: <strong>Год №{state.activeCycleNumber}</strong> ({state.cycleStartDate} – {state.cycleEndDate}).
            </p>

            <div className="p-2.5 bg-blue-950/40 border border-blue-900/60 rounded-lg text-[11px] text-blue-300 space-y-1">
              <span className="font-bold block">Правило преемственности:</span>
              <p className="text-[10px] text-blue-200">
                При переходе в новый год баланс монет ({state.lifetimeCoins}), уровень персонажа (Ур. {state.currentLevel}) и достижения сохраняются навсегда! Сбрасывается только годовой календарь 365 дней.
              </p>
            </div>

            {showRolloverConfirm ? (
              <div className="p-3 bg-red-950/60 border border-red-900 rounded-xl space-y-2">
                <span className="text-red-300 font-bold block text-[11px]">
                  Завершить Год №{state.activeCycleNumber} и открыть Год №{state.activeCycleNumber + 1}?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      advanceToNextCycle();
                      setShowRolloverConfirm(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[11px]"
                  >
                    Да, запустить новый год!
                  </button>
                  <button
                    onClick={() => setShowRolloverConfirm(false)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 text-slate-300 text-[11px]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowRolloverConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Симуляция: Переход в следующий Год</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Archive count */}
            {state.cyclesArchive.length > 0 && (
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Завершённых прошлых циклов в архиве: {state.cyclesArchive.length}
              </div>
            )}
          </div>

          {/* Backup & Restore */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-bold text-white block">
              Резервная копия данных (Local-First)
            </span>
            <p className="text-[11px] text-slate-400">
              Все твои задачи, монеты и прогресс хранятся локально на твоем устройстве. Скачай файл резервной копии, чтобы перенести прогресс на другое устройство.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportBackupJSON}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Экспорт JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Импорт JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset All */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
            <span className="font-bold text-red-400 block">
              Опасная зона
            </span>
            <p className="text-[11px] text-slate-400">
              Сброс приложения вернет все задачи и монеты к начальному состоянию.
            </p>

            {showResetConfirm ? (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] text-red-300 font-bold block">
                  Точно сбросить весь прогресс? Это действие необратимо.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetAllData();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 font-bold text-white text-[11px]"
                  >
                    Да, сбросить всё
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 text-slate-300 text-[11px]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="py-2 px-3 rounded-xl border border-red-900/60 hover:bg-red-950/60 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                Сбросить к начальному состоянию
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
