import React from 'react';
import { 
  X, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Coins, 
  Sparkles, 
  Crown, 
  Zap, 
  Sunrise, 
  Footprints, 
  Compass 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEVEL_TIERS } from '../utils/gamification';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const { state, levelInfo } = useApp();

  if (!isOpen) return null;

  const unlockedCount = state.achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Зал славы и достижения
              </h3>
              <p className="text-[11px] text-slate-400">
                Разблокировано {unlockedCount} из {state.achievements.length} трофеев
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Level Progress Overview Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-indigo-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{levelInfo.badge}</span>
                <div>
                  <span className="text-base font-black text-white font-mono block">
                    Уровень {levelInfo.currentLevel}
                  </span>
                  <span className="text-xs text-amber-400 font-bold block">
                    «{levelInfo.title}»
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Баланс монет</span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
                  <Coins className="w-3.5 h-3.5" />
                  {state.lifetimeCoins.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress to next level */}
            {levelInfo.nextTitle ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>До «{levelInfo.nextTitle}»</span>
                  <span className="font-mono text-amber-300">
                    Ещё {levelInfo.coinsToNext.toLocaleString()} монет
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                    style={{ width: `${levelInfo.progressPct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-400 font-bold">
                Максимальный ранг достигнут! Абсолютная легенда! 👑
              </div>
            )}
          </div>

          {/* Achievements Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Трофеи годовой дисциплины
            </h4>

            <div className="space-y-2.5">
              {state.achievements.map((ach) => {
                const pct = Math.min(100, Math.round((ach.progress / ach.target) * 100));

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      ach.isUnlocked
                        ? 'bg-amber-500/5 border-amber-500/30 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          ach.isUnlocked
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {ach.isUnlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${ach.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                            {ach.title}
                          </span>
                          {ach.isUnlocked && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400">
                              ОТКРЫТО
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-normal">
                          {ach.description}
                        </p>

                        {!ach.isUnlocked && (
                          <div className="pt-1.5 space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>Прогресс: {ach.progress} / {ach.target}</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-mono text-amber-400 font-bold block">
                        +{ach.coinsBonus} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
