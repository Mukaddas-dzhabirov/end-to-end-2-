import React from 'react';
import { 
  Sunrise, 
  Flame, 
  Briefcase, 
  Sunset, 
  Moon, 
  Check 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TIME_BLOCKS, getCurrentTimeBlockId } from '../utils/timeBlocks';
import { TimeBlockId } from '../types';

export const TimeBlockTabs: React.FC = () => {
  const { selectedBlockId, setSelectedBlockId, blockProgress, state } = useApp();
  const currentActualBlock = getCurrentTimeBlockId();
  const isIvory = state.settings.theme.mode === 'ivory';

  const getIcon = (id: TimeBlockId) => {
    switch (id) {
      case 'block1_morning':
        return <Sunrise className="w-4 h-4" />;
      case 'block2_focus':
        return <Flame className="w-4 h-4" />;
      case 'block3_work':
        return <Briefcase className="w-4 h-4" />;
      case 'block4_evening':
        return <Sunset className="w-4 h-4" />;
      case 'rest_night':
        return <Moon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold px-1">
        <span className={isIvory ? 'text-stone-600' : 'text-slate-400'}>
          Твой распорядок дня (4 блока + ночной отдых)
        </span>
        <span className="text-[11px] font-mono opacity-60">
          Активен: {TIME_BLOCKS.find(b => b.id === currentActualBlock)?.title}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
        {TIME_BLOCKS.map((block) => {
          const isSelected = selectedBlockId === block.id;
          const isCurrentNow = currentActualBlock === block.id;
          const progress = blockProgress[block.id] || { total: 0, completed: 0, pct: 0 };
          const isComplete = progress.total > 0 && progress.completed === progress.total;

          return (
            <button
              key={block.id}
              onClick={() => setSelectedBlockId(block.id)}
              style={{
                borderColor: isSelected 
                  ? block.accentColor 
                  : isComplete 
                    ? '#10B981' 
                    : undefined,
              }}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? isIvory 
                    ? 'bg-white shadow-md ring-2 ring-amber-500/20' 
                    : 'bg-slate-900 shadow-xl ring-1 ring-white/10'
                  : isIvory
                    ? 'bg-[#F5F2EB] border-stone-200 hover:border-stone-300'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top row with Icon, Number, and Badges */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                  style={{ 
                    backgroundColor: block.accentColor,
                  }}
                >
                  {getIcon(block.id)}
                </div>

                <div className="flex items-center gap-1">
                  {isComplete && !block.isRestBlock && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                  {isCurrentNow && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      СЕЙЧАС
                    </span>
                  )}
                </div>
              </div>

              {/* Block Number & Title */}
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                  isIvory ? 'text-stone-500' : 'text-slate-400'
                }`}>
                  {block.blockNumber > 0 ? `Блок ${block.blockNumber}` : 'Отдых'}
                </span>
                <span className={`text-xs font-bold block truncate ${
                  isIvory ? 'text-stone-900' : 'text-white'
                }`}>
                  {block.title}
                </span>
                <span className={`text-[10px] font-mono block ${
                  isIvory ? 'text-stone-500' : 'text-slate-400'
                }`}>
                  {block.timeRange}
                </span>
              </div>

              {/* Progress info */}
              {!block.isRestBlock ? (
                <div className="mt-2 pt-1.5 border-t border-slate-700/30 flex items-center justify-between text-[10px]">
                  <span className={isIvory ? 'text-stone-500 font-mono' : 'text-slate-400 font-mono'}>
                    {progress.completed}/{progress.total}
                  </span>
                  <span 
                    className="font-bold"
                    style={{ color: isComplete ? '#10B981' : block.accentColor }}
                  >
                    {progress.pct}%
                  </span>
                </div>
              ) : (
                <div className="mt-2 pt-1.5 border-t border-slate-700/30 text-[10px] text-emerald-500 font-medium">
                  Релакс & Сон
                </div>
              )}

              {/* Bottom Progress Line */}
              {!block.isRestBlock && (
                <div className={`w-full h-1 rounded-full overflow-hidden mt-1.5 ${
                  isIvory ? 'bg-stone-200' : 'bg-slate-800'
                }`}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress.pct}%`,
                      backgroundColor: isComplete ? '#10B981' : block.accentColor,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
