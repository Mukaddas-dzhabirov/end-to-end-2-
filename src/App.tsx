/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CycleBanner } from './components/CycleBanner';
import { DailyPraiseCard } from './components/DailyPraiseCard';
import { TimeBlockTabs } from './components/TimeBlockTabs';
import { TaskList } from './components/TaskList';
import { StatsAnalyticsView } from './components/StatsAnalyticsView';
import { YearCalendarView } from './components/YearCalendarView';
import { TaskModal } from './components/TaskModal';
import { LevelUpModal } from './components/LevelUpModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { CelebrationToast } from './components/CelebrationToast';
import { ConceptModal } from './components/ConceptModal';
import { CoinLedgerModal } from './components/CoinLedgerModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { TweaksModal } from './components/TweaksModal';
import { YearEndReportModal } from './components/YearEndReportModal';
import { 
  CheckSquare, 
  BarChart3, 
  Calendar, 
  Award, 
  Plus, 
  BookOpen, 
  Sliders,
  Moon,
  Sun
} from 'lucide-react';

type MainViewTab = 'checklist' | 'stats' | 'calendar' | 'report';

function DashboardContent() {
  const { state, toggleThemeMode } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  const [activeTab, setActiveTab] = useState<MainViewTab>('checklist');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTweaksOpen, setIsTweaksOpen] = useState(false);
  const [isYearReportOpen, setIsYearReportOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500/30 selection:text-amber-700 ${
      isIvory ? 'bg-[#F7F4EE] text-stone-900' : 'bg-[#0B0F19] text-slate-100'
    }`}>
      {/* Top Header */}
      <Header
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTweaks={() => setIsTweaksOpen(true)}
      />

      {/* Main App Container (Mobile-first, max-w-4xl) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-24">
        {/* Concept & Strategy Ribbon */}
        <div className={`rounded-2xl p-3 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5 border transition-all ${
          isIvory 
            ? 'bg-amber-500/10 border-amber-500/20 text-stone-800' 
            : 'bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border-amber-500/20 text-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              MY YEAR. MY RULES.
            </span>
            <span className="text-xs opacity-60 hidden sm:inline">
              • 4 блока дня • 365 дней цикла • Premium Productivity
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConceptOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ТЗ & Правила</span>
            </button>

            <button
              onClick={toggleThemeMode}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isIvory ? 'border-stone-300 bg-white hover:bg-stone-50' : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
              }`}
              title={isIvory ? 'Переключить в Dark Mode' : 'Переключить в Warm Ivory'}
            >
              {isIvory ? <Moon className="w-3.5 h-3.5 text-stone-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Primary View Navigation Tabs (matching reference screen pill tabs) */}
        <div className={`p-1 rounded-2xl border flex items-center gap-1 overflow-x-auto ${
          isIvory ? 'bg-white border-stone-200 shadow-2xs' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? isIvory ? 'bg-stone-900 text-white shadow-xs' : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isIvory ? 'text-stone-600 hover:text-stone-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Распорядок</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? isIvory ? 'bg-stone-900 text-white shadow-xs' : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isIvory ? 'text-stone-600 hover:text-stone-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>My Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? isIvory ? 'bg-stone-900 text-white shadow-xs' : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isIvory ? 'text-stone-600 hover:text-stone-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Календарь</span>
          </button>

          <button
            onClick={() => setIsYearReportOpen(true)}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isIvory ? 'text-stone-600 hover:text-stone-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Отчёт года</span>
          </button>
        </div>

        {/* Tab 1: Checklist & Daily Blocks */}
        {activeTab === 'checklist' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
            {/* 365 Days Cycle Progress & Date Navigator */}
            <CycleBanner />

            {/* Daily Praise Card with Personalized Progress */}
            <DailyPraiseCard />

            {/* 4 Time Blocks Tabs */}
            <TimeBlockTabs />

            {/* Active Block Task List */}
            <TaskList onOpenAddTask={() => setIsTaskModalOpen(true)} />
          </div>
        )}

        {/* Tab 2: Stats & Analytics (Replicating left reference screen) */}
        {activeTab === 'stats' && (
          <StatsAnalyticsView />
        )}

        {/* Tab 3: Full Period Calendar (Interactive 365 Days Grid) */}
        {activeTab === 'calendar' && (
          <YearCalendarView />
        )}
      </main>

      {/* Floating Action Button (matching bottom right '+' on reference screen) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Добавить новую задачу"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Footer */}
      <footer className={`border-t py-6 px-4 text-center text-xs space-y-1 ${
        isIvory ? 'bg-[#FAF8F5] border-stone-200 text-stone-500' : 'bg-slate-950/80 border-slate-900 text-slate-500'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">MY YEAR. MY RULES.</span>
            <span>•</span>
            <span>365 дней личной дисциплины</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Профиль ({state.settings.profile.name})
            </button>
            <span>•</span>
            <button
              onClick={() => setIsLedgerOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Награды ({state.availableCoins} 🪙)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Бэкап данных
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ConceptModal
        isOpen={isConceptOpen}
        onClose={() => setIsConceptOpen(false)}
      />

      <CoinLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <TweaksModal
        isOpen={isTweaksOpen}
        onClose={() => setIsTweaksOpen(false)}
      />

      <YearEndReportModal
        isOpen={isYearReportOpen}
        onClose={() => setIsYearReportOpen(false)}
      />

      <LevelUpModal />
      <CelebrationToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
