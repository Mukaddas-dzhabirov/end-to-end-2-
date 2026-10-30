import React, { useState } from 'react';
import { X, Flame, Plus, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimeBlockId, RepeatType } from '../types';
import { TIME_BLOCKS } from '../utils/timeBlocks';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { selectedBlockId, addTask, state } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blockId, setBlockId] = useState<TimeBlockId>(selectedBlockId);
  const [isPriority, setIsPriority] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>('daily');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      blockId,
      isPriority,
      coinsReward: isPriority ? 25 : 10,
      repeatType,
      repeatDays: repeatType === 'weekdays' ? [1, 2, 3, 4, 5] : undefined,
    });

    setTitle('');
    setDescription('');
    setIsPriority(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl relative border ${
        isIvory ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-slate-900 border-slate-800 text-white'
      } animate-in fade-in zoom-in-95 duration-150`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer ${
            isIvory ? 'text-stone-400 hover:text-stone-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">
              Новое правило дня
            </h3>
            <p className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              Добавь привычку или разовую задачу в свой распорядок
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className={`block font-semibold mb-1 ${isIvory ? 'text-stone-700' : 'text-slate-300'}`}>
              Название задачи / привычки *
            </label>
            <input
              type="text"
              required
              placeholder="Например: 15 минут чтения, Deep Work спринт, стакан воды"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isIvory 
                  ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400' 
                  : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block font-semibold mb-1 ${isIvory ? 'text-stone-700' : 'text-slate-300'}`}>
              Пояснение или цель (необязательно)
            </label>
            <input
              type="text"
              placeholder="Краткое описание пользы или правила"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isIvory 
                  ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400' 
                  : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* Time Block Selector */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isIvory ? 'text-stone-700' : 'text-slate-300'}`}>
              Временной блок дня:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_BLOCKS.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBlockId(b.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    blockId === b.id
                      ? 'bg-amber-500/15 border-amber-500 font-bold'
                      : isIvory
                        ? 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block text-xs font-semibold">{b.title}</span>
                  <span className="block text-[10px] opacity-70 font-mono">{b.timeRange}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Repeat Schedule */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isIvory ? 'text-stone-700' : 'text-slate-300'}`}>
              Частота повторения:
            </label>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => setRepeatType('daily')}
                className={`py-2 px-2 rounded-xl border transition-all cursor-pointer text-xs ${
                  repeatType === 'daily'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-600 font-bold'
                    : isIvory
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Каждый день
              </button>
              <button
                type="button"
                onClick={() => setRepeatType('weekdays')}
                className={`py-2 px-2 rounded-xl border transition-all cursor-pointer text-xs ${
                  repeatType === 'weekdays'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-600 font-bold'
                    : isIvory
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Пн – Пт
              </button>
              <button
                type="button"
                onClick={() => setRepeatType('once')}
                className={`py-2 px-2 rounded-xl border transition-all cursor-pointer text-xs ${
                  repeatType === 'once'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-600 font-bold'
                    : isIvory
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Разово
              </button>
            </div>
          </div>

          {/* Priority Toggle */}
          <div className={`pt-2 border-t flex items-center justify-between ${
            isIvory ? 'border-stone-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isPriority ? 'bg-amber-500/20 text-amber-500' : 'bg-stone-200/50 text-stone-400'
              }`}>
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Фокусная задача</span>
                <span className={`block text-[11px] ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
                  Повышенная награда (+25 монет вместо +10)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPriority(!isPriority)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isPriority ? 'bg-amber-500' : isIvory ? 'bg-stone-300' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs ${
                  isPriority ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl font-semibold cursor-pointer ${
                isIvory ? 'bg-stone-200 hover:bg-stone-300 text-stone-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 cursor-pointer"
            >
              Сохранить правило
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
