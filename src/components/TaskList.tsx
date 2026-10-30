import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Flame, 
  Repeat, 
  AlertCircle,
  ArrowRight,
  Moon,
  Sparkles,
  MoveRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTimeBlockById, TIME_BLOCKS } from '../utils/timeBlocks';
import { Task, TimeBlockId } from '../types';

interface TaskListProps {
  onOpenAddTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onOpenAddTask }) => {
  const { 
    state, 
    selectedBlockId, 
    selectedDate, 
    todayDayLog, 
    toggleTaskCompletion, 
    deleteTask,
    moveTaskToBlock 
  } = useApp();

  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);

  const currentBlock = getTimeBlockById(selectedBlockId);
  const targetDate = new Date(selectedDate);
  const dayOfWeek = targetDate.getDay();
  const isIvory = state.settings.theme.mode === 'ivory';

  // Filter tasks for this block and active day of week
  const blockTasks = state.tasks.filter((t) => {
    if (t.blockId !== selectedBlockId) return false;
    if (t.repeatType === 'daily') return true;
    if (t.repeatType === 'weekdays') {
      return t.repeatDays ? t.repeatDays.includes(dayOfWeek) : true;
    }
    return true;
  });

  const completedCount = blockTasks.filter((t) => 
    todayDayLog.completedTaskIds.includes(t.id)
  ).length;

  // Next block suggestion for quick transfer
  const nextBlockMap: Record<TimeBlockId, TimeBlockId> = {
    block1_morning: 'block2_focus',
    block2_focus: 'block3_work',
    block3_work: 'block4_evening',
    block4_evening: 'block1_morning',
    rest_night: 'block1_morning',
  };

  return (
    <div className={`rounded-3xl p-4 sm:p-6 transition-all border ${
      isIvory 
        ? 'bg-[#FAF8F5] border-stone-200/80 shadow-sm' 
        : 'bg-slate-900/80 border-slate-800 shadow-xl'
    } space-y-5`}>
      {/* Block Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
        isIvory ? 'border-stone-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-base sm:text-lg font-black uppercase tracking-tight"
              style={{ color: currentBlock.accentColor }}
            >
              {currentBlock.title}
            </span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${
              isIvory ? 'bg-stone-200 text-stone-700' : 'bg-slate-800 text-slate-400'
            }`}>
              {currentBlock.timeRange}
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
            {currentBlock.subtitle}
          </p>
        </div>

        {/* Action Button: Add Task */}
        <button
          onClick={onOpenAddTask}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить задачу</span>
        </button>
      </div>

      {/* Special Rest Block Banner if rest_night */}
      {selectedBlockId === 'rest_night' && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
          isIvory 
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
            : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
            <Moon className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm">
              Время отдыха и восстановления (22:00 – 06:00)
            </h4>
            <p className="opacity-80 leading-relaxed">
              По умолчанию здесь <strong>нет обязательных задач</strong>. Качественный сон (7–8 часов) — это главный двигатель твоей дисциплины и энергии на завтра. Ты можешь добавить сюда необязательные приятные ритуалы расслабления.
            </p>
          </div>
        </div>
      )}

      {/* Task List */}
      {blockTasks.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
            isIvory ? 'bg-stone-200 text-stone-500' : 'bg-slate-800 text-slate-400'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isIvory ? 'text-stone-900' : 'text-white'}`}>
              В этом блоке пока нет задач
            </h4>
            <p className={`text-xs max-w-xs mx-auto mt-1 ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              {selectedBlockId === 'rest_night'
                ? 'Отдыхай без чувства вины или добавь спокойный вечерний ритуал.'
                : 'Сформируй привычку или важное дело, чтобы приблизить идеальный день.'}
            </p>
          </div>
          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Добавить задачу в «{currentBlock.title}»
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {blockTasks.map((task) => {
            const isDone = todayDayLog.completedTaskIds.includes(task.id);
            const isAlreadyRewarded = todayDayLog.rewardedTaskIds?.includes(task.id);
            const isTransferring = movingTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isDone
                    ? isIvory
                      ? 'bg-stone-100/70 border-emerald-300 text-stone-500'
                      : 'bg-slate-950/60 border-emerald-900/40 text-slate-400'
                    : isIvory
                      ? 'bg-white border-stone-200/90 text-stone-900 shadow-xs hover:border-amber-400/50'
                      : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 text-slate-100 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105'
                          : isIvory
                            ? 'border-2 border-stone-300 hover:border-amber-500 bg-stone-50'
                            : 'border-2 border-slate-700 hover:border-amber-400 bg-slate-900'
                      }`}
                      title={isDone ? 'Снять отметку' : 'Отметить выполнение (+монеты)'}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold transition-all ${
                            isDone 
                              ? 'line-through opacity-60' 
                              : isIvory ? 'text-stone-900' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.isPriority && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                            <Flame className="w-2.5 h-2.5" />
                            ФОКУС
                          </span>
                        )}

                        {task.repeatType === 'daily' && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono ${
                            isIvory ? 'text-stone-500' : 'text-slate-400'
                          }`}>
                            <Repeat className="w-2.5 h-2.5" />
                            Каждый день
                          </span>
                        )}

                        {isDone && isAlreadyRewarded && (
                          <span className="text-[10px] text-emerald-600 font-mono">
                            ✓ Засчитано
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className={`text-xs ${
                          isDone 
                            ? 'opacity-60' 
                            : isIvory ? 'text-stone-600' : 'text-slate-400'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Coins badge & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-1 rounded-xl flex items-center gap-1 ${
                        isDone
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                      }`}
                      title={task.isPriority ? 'Фокусная задача: +25 монет' : 'Обычная задача: +10 монет'}
                    >
                      <span>+{task.coinsReward}</span>
                      <span className="text-[9px]">XP</span>
                    </span>

                    {/* Quick Move Button (for unfinished tasks) */}
                    {!isDone && (
                      <button
                        onClick={() => setMovingTaskId(isTransferring ? null : task.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                          isTransferring
                            ? 'bg-amber-500 text-white border-amber-500'
                            : isIvory
                              ? 'border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                              : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Перенести задачу в другой блок"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`p-1 rounded-md transition-colors opacity-60 hover:opacity-100 cursor-pointer ${
                        isIvory ? 'text-stone-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'
                      }`}
                      title="Удалить задачу"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Transfer Menu: Move Task to other blocks */}
                {isTransferring && !isDone && (
                  <div className={`mt-3 pt-3 border-t flex flex-wrap items-center gap-1.5 text-xs ${
                    isIvory ? 'border-stone-200 text-stone-700' : 'border-slate-800 text-slate-300'
                  }`}>
                    <span className="font-semibold text-[11px] mr-1">
                      Перенести в:
                    </span>
                    {TIME_BLOCKS.filter((b) => b.id !== task.blockId).map((targetB) => (
                      <button
                        key={targetB.id}
                        onClick={() => {
                          moveTaskToBlock(task.id, targetB.id);
                          setMovingTaskId(null);
                        }}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                          isIvory
                            ? 'bg-stone-50 border-stone-200 hover:border-amber-500 hover:text-amber-700'
                            : 'bg-slate-900 border-slate-700 hover:border-amber-400 hover:text-amber-300'
                        }`}
                      >
                        {targetB.title}
                      </button>
                    ))}
                    <button
                      onClick={() => setMovingTaskId(null)}
                      className="px-2 py-1 text-[11px] text-stone-400 hover:text-stone-600 underline cursor-pointer"
                    >
                      Отмена
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Block Footer summary */}
      {selectedBlockId !== 'rest_night' && (
        <div className={`pt-3 border-t flex items-center justify-between text-xs ${
          isIvory ? 'border-stone-200 text-stone-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <span>
            Выполнено: {completedCount} из {blockTasks.length} задач блока
          </span>
          <span className="text-[11px] text-amber-500 font-medium">
            Бонус за закрытие всех задач блока: +50 монет
          </span>
        </div>
      )}
    </div>
  );
};
