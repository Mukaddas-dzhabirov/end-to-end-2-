import React from 'react';
import { 
  Coins, 
  Trophy, 
  Settings, 
  Flame, 
  Bell, 
  Sliders, 
  Sparkles,
  User,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenLedger: () => void;
  onOpenNotifications: () => void;
  onOpenTweaks: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAchievements, 
  onOpenSettings,
  onOpenProfile,
  onOpenLedger,
  onOpenNotifications,
  onOpenTweaks,
}) => {
  const { state, levelInfo, todayDayLog } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3.5 sm:px-6 py-2.5 transition-colors ${
      isIvory ? 'bg-[#FAF8F5]/90 border-stone-200' : 'bg-[#0B0F19]/90 border-slate-800/80'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 shrink-0">
            365
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className={`font-black text-sm sm:text-base tracking-tight uppercase ${
                isIvory ? 'text-stone-900' : 'text-white'
              }`}>
                MY YEAR. MY RULES.
              </h1>
              {todayDayLog.isSuperDay && (
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                  <Flame className="w-2.5 h-2.5 fill-current" />
                  SUPER DAY
                </span>
              )}
            </div>
            <p className={`text-[10px] font-medium hidden sm:block ${
              isIvory ? 'text-stone-500' : 'text-slate-400'
            }`}>
              4 блока дня • Premium Productivity
            </p>
          </div>
        </div>

        {/* Stats & Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Profile Badge (avatar + Level) */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              isIvory 
                ? 'bg-white border-stone-200 hover:border-stone-300 text-stone-800 shadow-2xs' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
            }`}
            title="Персональный профиль и личный кодекс"
          >
            <span className="text-sm">{state.settings.profile.avatarEmoji}</span>
            <span className="hidden sm:inline font-mono">Ур.{levelInfo.currentLevel}</span>
          </button>

          {/* Coins Button (Available & Lifetime XP) */}
          <button
            onClick={onOpenLedger}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl border font-mono font-bold text-xs shadow-2xs transition-all cursor-pointer ${
              isIvory
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Банк монет и личные награды"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{state.availableCoins.toLocaleString()}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isIvory 
                ? 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Уведомления о начале временных блоков"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Achievements Trophy */}
          <button
            onClick={onOpenAchievements}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isIvory 
                ? 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Зал трофеев и достижений"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Tweaks Menu (Accent, Mode, Density) */}
          <button
            onClick={onOpenTweaks}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isIvory 
                ? 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Настройка стилей (Tweaks)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isIvory 
                ? 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Резервное копирование и управление циклом"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
