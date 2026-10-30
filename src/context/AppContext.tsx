import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AppState, 
  Task, 
  TimeBlockId, 
  DayLog, 
  Achievement, 
  Cycle, 
  UserSettings,
  CoinTransaction,
  PersonalReward,
  UserProfile,
  ThemeSettings,
  ThemeMode,
  AccentColor
} from '../types';
import { STARTER_TASKS, STARTER_REWARDS } from '../utils/starterTasks';
import { INITIAL_ACHIEVEMENTS } from '../utils/achievements';
import { 
  CYCLE_1_START, 
  CYCLE_1_END, 
  getTodayDateString, 
  calculateCycleStatus,
  createInitialCycle
} from '../utils/cycleEngine';
import { 
  getCurrentTimeBlockId, 
  TIME_BLOCKS,
  ACTIVE_DISCIPLINE_BLOCKS 
} from '../utils/timeBlocks';
import { 
  getLevelInfo, 
  triggerConfetti, 
  playChime, 
  getRandomItem, 
  TASK_CELEBRATIONS, 
  BLOCK_CELEBRATIONS, 
  SUPER_DAY_CELEBRATIONS,
  getDailyPraiseMessage
} from '../utils/gamification';

const STORAGE_KEY = 'my_year_my_rules_v2';

interface LevelUpEvent {
  newLevel: number;
  title: string;
  badge: string;
  perk: string;
}

export interface WeeklyDayData {
  dayName: string;
  shortDate: string;
  dateStr: string;
  pct: number;
  isToday: boolean;
  isFuture: boolean;
  tasksCompleted: number;
  totalTasks: number;
}

interface AppContextType {
  state: AppState;
  selectedBlockId: TimeBlockId;
  setSelectedBlockId: (id: TimeBlockId) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  
  // Task Actions
  toggleTaskCompletion: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTaskToBlock: (taskId: string, targetBlockId: TimeBlockId) => void;

  // Rewards & Ledger
  redeemReward: (rewardId: string) => boolean;
  addCustomReward: (reward: Omit<PersonalReward, 'id'>) => void;
  deleteCustomReward: (rewardId: string) => void;

  // Profile & Theme
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  toggleThemeMode: () => void;
  setAccentColor: (accent: AccentColor) => void;

  // Cycle & State Actions
  advanceToNextCycle: () => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  resetAllData: () => void;

  // Modals & Feedback
  celebrationToast: string | null;
  setCelebrationToast: (msg: string | null) => void;
  levelUpModalData: LevelUpEvent | null;
  setLevelUpModalData: (data: LevelUpEvent | null) => void;
  
  // Computed values
  todayDayLog: DayLog;
  levelInfo: ReturnType<typeof getLevelInfo>;
  cycleStatus: ReturnType<typeof calculateCycleStatus>;
  blockProgress: Record<TimeBlockId, { total: number; completed: number; pct: number }>;
  dayOverallPct: number;
  dailyPraise: { title: string; text: string };
  weeklyStats: WeeklyDayData[];
  focusScore: number;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PROFILE: UserProfile = {
  name: 'Алексей',
  avatarEmoji: '👑',
  motto: 'Мой год. Мои правила. 365 дней победы.',
  joinDate: '2026-10-29',
};

const DEFAULT_SETTINGS: UserSettings = {
  profile: DEFAULT_PROFILE,
  theme: {
    mode: 'dark',
    accent: 'gold',
    density: 'airy',
    streakStyle: 'flame',
  },
  notificationsEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  blockReminders: {
    block1: true,
    block2: true,
    block3: true,
    block4: true,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          lifetimeCoins: parsed.lifetimeCoins ?? 0,
          currentLevel: parsed.currentLevel ?? 1,
          availableCoins: parsed.availableCoins ?? (parsed.lifetimeCoins ?? 0),
          achievements: parsed.achievements?.length ? parsed.achievements : INITIAL_ACHIEVEMENTS,
          cyclesArchive: parsed.cyclesArchive ?? [],
          transactions: parsed.transactions ?? [],
          personalRewards: parsed.personalRewards?.length ? parsed.personalRewards : STARTER_REWARDS,
          activeCycleNumber: parsed.activeCycleNumber ?? 1,
          cycleStartDate: parsed.cycleStartDate ?? CYCLE_1_START,
          cycleEndDate: parsed.cycleEndDate ?? CYCLE_1_END,
          tasks: parsed.tasks?.length ? parsed.tasks : STARTER_TASKS,
          dayLogs: parsed.dayLogs ?? {},
          settings: {
            ...DEFAULT_SETTINGS,
            ...(parsed.settings || {}),
            profile: { ...DEFAULT_PROFILE, ...(parsed.settings?.profile || {}) },
            theme: { ...DEFAULT_SETTINGS.theme, ...(parsed.settings?.theme || {}) },
          },
        };
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }

    return {
      lifetimeCoins: 0,
      currentLevel: 1,
      availableCoins: 0,
      achievements: INITIAL_ACHIEVEMENTS,
      cyclesArchive: [],
      transactions: [],
      personalRewards: STARTER_REWARDS,
      activeCycleNumber: 1,
      cycleStartDate: CYCLE_1_START,
      cycleEndDate: CYCLE_1_END,
      tasks: STARTER_TASKS,
      dayLogs: {},
      settings: DEFAULT_SETTINGS,
    };
  });

  const [selectedBlockId, setSelectedBlockId] = useState<TimeBlockId>(getCurrentTimeBlockId());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);
  const [levelUpModalData, setLevelUpModalData] = useState<LevelUpEvent | null>(null);

  // Auto-sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  // Current day log (with anti-duplicate arrays initialized)
  const todayDayLog: DayLog = useMemo(() => {
    const existing = state.dayLogs[selectedDate];
    if (existing) {
      return {
        ...existing,
        rewardedTaskIds: existing.rewardedTaskIds || [...existing.completedTaskIds],
        rewardedBlockIds: existing.rewardedBlockIds || [...existing.completedBlockIds],
      };
    }
    return {
      date: selectedDate,
      completedTaskIds: [],
      rewardedTaskIds: [],
      completedBlockIds: [],
      rewardedBlockIds: [],
      isSuperDay: false,
      rewardedSuperDay: false,
      earnedCoins: 0,
      spentCoins: 0,
    };
  }, [state.dayLogs, selectedDate]);

  // Current Level info
  const levelInfo = useMemo(() => {
    return getLevelInfo(state.lifetimeCoins);
  }, [state.lifetimeCoins]);

  // Cycle status
  const cycleStatus = useMemo(() => {
    return calculateCycleStatus(state.cycleStartDate, state.cycleEndDate, selectedDate);
  }, [state.cycleStartDate, state.cycleEndDate, selectedDate]);

  // Block progress calculation
  const blockProgress = useMemo(() => {
    const res: Record<TimeBlockId, { total: number; completed: number; pct: number }> = {
      block1_morning: { total: 0, completed: 0, pct: 0 },
      block2_focus: { total: 0, completed: 0, pct: 0 },
      block3_work: { total: 0, completed: 0, pct: 0 },
      block4_evening: { total: 0, completed: 0, pct: 0 },
      rest_night: { total: 0, completed: 0, pct: 100 },
    };

    const targetDate = new Date(selectedDate);
    const dayOfWeek = targetDate.getDay();

    TIME_BLOCKS.forEach((block) => {
      const blockTasks = state.tasks.filter((t) => {
        if (t.blockId !== block.id) return false;
        if (t.repeatType === 'daily') return true;
        if (t.repeatType === 'weekdays') {
          return t.repeatDays ? t.repeatDays.includes(dayOfWeek) : true;
        }
        return true;
      });

      const total = blockTasks.length;
      const completed = blockTasks.filter((t) => todayDayLog.completedTaskIds.includes(t.id)).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : (block.isRestBlock ? 100 : 0);

      res[block.id] = { total, completed, pct };
    });

    return res;
  }, [state.tasks, todayDayLog.completedTaskIds, selectedDate]);

  // Day Overall Completion Percentage (across 4 active blocks)
  const dayOverallPct = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;

    ACTIVE_DISCIPLINE_BLOCKS.forEach((blockId) => {
      totalTasks += blockProgress[blockId]?.total || 0;
      completedTasks += blockProgress[blockId]?.completed || 0;
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [blockProgress]);

  // Daily Praise message
  const dailyPraise = useMemo(() => {
    return getDailyPraiseMessage(dayOverallPct);
  }, [dayOverallPct]);

  // Weekly Stats calculation (last 7 days ending with selected date)
  const weeklyStats = useMemo<WeeklyDayData[]>(() => {
    const days: WeeklyDayData[] = [];
    const baseDate = new Date(selectedDate);
    const todayStr = getTodayDateString();

    const dayLabels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dt = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dt}`;

      const log = state.dayLogs[dateStr];
      const completedCount = log?.completedTaskIds?.length || 0;
      const totalPossible = state.tasks.filter((t) => ACTIVE_DISCIPLINE_BLOCKS.includes(t.blockId)).length || 10;
      const pct = Math.min(100, Math.round((completedCount / totalPossible) * 100));

      days.push({
        dayName: dayLabels[d.getDay()],
        shortDate: `${dt}.${m}`,
        dateStr,
        pct: log ? pct : 0,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr,
        tasksCompleted: completedCount,
        totalTasks: totalPossible,
      });
    }

    return days;
  }, [selectedDate, state.dayLogs, state.tasks]);

  // Focus Score (0 - 100) based on priority tasks closed + consistency
  const focusScore = useMemo(() => {
    const priorityTasks = state.tasks.filter((t) => t.isPriority && ACTIVE_DISCIPLINE_BLOCKS.includes(t.blockId));
    if (priorityTasks.length === 0) return dayOverallPct;
    const completedPriority = priorityTasks.filter((t) => todayDayLog.completedTaskIds.includes(t.id)).length;
    const priorityPct = (completedPriority / priorityTasks.length) * 100;
    return Math.round(priorityPct * 0.6 + dayOverallPct * 0.4);
  }, [state.tasks, todayDayLog.completedTaskIds, dayOverallPct]);

  // ==========================================
  // TASK TOGGLE WITH ANTI-DUPLICATION COIN ENGINE
  // ==========================================
  const toggleTaskCompletion = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isAlreadyCompleted = todayDayLog.completedTaskIds.includes(taskId);
    let newCompletedTaskIds: string[];
    let newRewardedTaskIds = [...(todayDayLog.rewardedTaskIds || [])];
    let newRewardedBlockIds = [...(todayDayLog.rewardedBlockIds || [])];
    let newCompletedBlockIds = [...todayDayLog.completedBlockIds];
    let rewardedSuperDay = todayDayLog.rewardedSuperDay || false;
    let isSuperDay = todayDayLog.isSuperDay;

    let coinsToAdd = 0;
    const newTransactions: CoinTransaction[] = [];
    const nowIso = new Date().toISOString();

    if (!isAlreadyCompleted) {
      // Marking task as completed
      newCompletedTaskIds = [...todayDayLog.completedTaskIds, taskId];

      // ANTI-DUPLICATE CHECK: Did this task already pay out coins on this date?
      const wasRewardedBefore = newRewardedTaskIds.includes(taskId);
      if (!wasRewardedBefore) {
        coinsToAdd += task.coinsReward;
        newRewardedTaskIds.push(taskId);

        newTransactions.push({
          id: `tx-task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: nowIso,
          amount: task.coinsReward,
          type: 'task_completion',
          description: `Выполнена задача: «${task.title}»`,
          taskId,
        });

        // Trigger confetti and audio only when first rewarded
        if (state.settings.soundEnabled) playChime('coin');
        triggerConfetti('small');
        setCelebrationToast(getRandomItem(TASK_CELEBRATIONS));
      } else {
        // Already rewarded today, just acknowledge completion gently
        setCelebrationToast(`Задача «${task.title}» снова активна (монеты уже были начислены)`);
      }

      // Check if this completes the block!
      const targetDate = new Date(selectedDate);
      const dayOfWeek = targetDate.getDay();
      const currentBlockTasks = state.tasks.filter((t) => {
        if (t.blockId !== task.blockId) return false;
        if (t.repeatType === 'weekdays' && t.repeatDays) return t.repeatDays.includes(dayOfWeek);
        return true;
      });

      const willCompleteBlock = currentBlockTasks.length > 0 && currentBlockTasks.every((t) =>
        t.id === taskId ? true : newCompletedTaskIds.includes(t.id)
      );

      if (willCompleteBlock && !newCompletedBlockIds.includes(task.blockId)) {
        newCompletedBlockIds.push(task.blockId);

        // ANTI-DUPLICATE CHECK for Block Bonus (+50 coins)
        if (!newRewardedBlockIds.includes(task.blockId)) {
          newRewardedBlockIds.push(task.blockId);
          coinsToAdd += 50;
          newTransactions.push({
            id: `tx-block-${Date.now()}`,
            timestamp: nowIso,
            amount: 50,
            type: 'block_bonus',
            description: `Бонус за закрытие всего блока «${TIME_BLOCKS.find((b) => b.id === task.blockId)?.title}»!`,
          });

          if (state.settings.soundEnabled) playChime('block');
          triggerConfetti('medium');
          setCelebrationToast(getRandomItem(BLOCK_CELEBRATIONS));
        }
      }

      // Check Super Day (all 4 active blocks completed!)
      const allFourActiveComplete = ACTIVE_DISCIPLINE_BLOCKS.every((bId) => newCompletedBlockIds.includes(bId));
      if (allFourActiveComplete) {
        isSuperDay = true;
        // ANTI-DUPLICATE CHECK for Super Day (+150 coins)
        if (!rewardedSuperDay) {
          rewardedSuperDay = true;
          coinsToAdd += 150;
          newTransactions.push({
            id: `tx-superday-${Date.now()}`,
            timestamp: nowIso,
            amount: 150,
            type: 'super_day',
            description: '👑 ЛЕГЕНДАРНЫЙ СУПЕР-ДЕНЬ! Закрыты все 4 блока на 100%!',
          });

          triggerConfetti('epic');
          setCelebrationToast(getRandomItem(SUPER_DAY_CELEBRATIONS));
        }
      }
    } else {
      // Unchecking task
      newCompletedTaskIds = todayDayLog.completedTaskIds.filter((id) => id !== taskId);
      // NOTE: Under Zero-Guilt rules, coins are never taken back or subtracted!
      // Task remains recorded in rewardedTaskIds so spamming check/uncheck doesn't mint free coins.
      setCelebrationToast('Задача переведена в активный статус');
    }

    // Check Level Up
    const newLifetimeCoins = state.lifetimeCoins + coinsToAdd;
    const newAvailableCoins = state.availableCoins + coinsToAdd;
    const prevLevelInfo = getLevelInfo(state.lifetimeCoins);
    const newLevelInfo = getLevelInfo(newLifetimeCoins);

    if (newLevelInfo.currentLevel > prevLevelInfo.currentLevel) {
      if (state.settings.soundEnabled) playChime('level');
      triggerConfetti('epic');
      setLevelUpModalData({
        newLevel: newLevelInfo.currentLevel,
        title: newLevelInfo.title,
        badge: newLevelInfo.badge,
        perk: newLevelInfo.perk,
      });
    }

    // Update DayLog in state
    const updatedDayLog: DayLog = {
      ...todayDayLog,
      completedTaskIds: newCompletedTaskIds,
      rewardedTaskIds: newRewardedTaskIds,
      completedBlockIds: newCompletedBlockIds,
      rewardedBlockIds: newRewardedBlockIds,
      isSuperDay,
      rewardedSuperDay,
      earnedCoins: todayDayLog.earnedCoins + coinsToAdd,
    };

    setState((prev) => ({
      ...prev,
      lifetimeCoins: newLifetimeCoins,
      availableCoins: newAvailableCoins,
      currentLevel: newLevelInfo.currentLevel,
      transactions: [...newTransactions, ...prev.transactions].slice(0, 300), // keep latest 300
      dayLogs: {
        ...prev.dayLogs,
        [selectedDate]: updatedDayLog,
      },
    }));
  };

  // Move task to a different block
  const moveTaskToBlock = (taskId: string, targetBlockId: TimeBlockId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, blockId: targetBlockId } : t)),
    }));
    const targetBlock = TIME_BLOCKS.find((b) => b.id === targetBlockId);
    setCelebrationToast(`Задача перенесена в «${targetBlock?.title}» 🚀`);
  };

  // Add Task
  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));

    setCelebrationToast('Новое правило добавлено в твой распорядок! 🎯');
  };

  // Edit Task
  const editTask = (taskId: string, updates: Partial<Task>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    setCelebrationToast('Задача удалена из расписания');
  };

  // Redeem Personal Reward in coin shop
  const redeemReward = (rewardId: string): boolean => {
    const reward = state.personalRewards.find((r) => r.id === rewardId);
    if (!reward) return false;

    if (state.availableCoins < reward.cost) {
      setCelebrationToast(`Недостаточно монет для награды (нужно: ${reward.cost}, доступно: ${state.availableCoins})`);
      return false;
    }

    const nowIso = new Date().toISOString();
    const newTx: CoinTransaction = {
      id: `tx-reward-${Date.now()}`,
      timestamp: nowIso,
      amount: -reward.cost,
      type: 'reward_redemption',
      description: `Награда получена: ${reward.icon} «${reward.title}»`,
    };

    setState((prev) => ({
      ...prev,
      availableCoins: prev.availableCoins - reward.cost,
      transactions: [newTx, ...prev.transactions].slice(0, 300),
    }));

    if (state.settings.soundEnabled) playChime('coin');
    triggerConfetti('medium');
    setCelebrationToast(`Награда получена! Наслаждайся: ${reward.title} 🎉`);
    return true;
  };

  const addCustomReward = (reward: Omit<PersonalReward, 'id'>) => {
    const newRew: PersonalReward = {
      ...reward,
      id: `rew-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      personalRewards: [...prev.personalRewards, newRew],
    }));
    setCelebrationToast('Новая личная награда добавлена в магазин! 🎁');
  };

  const deleteCustomReward = (rewardId: string) => {
    setState((prev) => ({
      ...prev,
      personalRewards: prev.personalRewards.filter((r) => r.id !== rewardId),
    }));
  };

  // Profile and Theme actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        profile: {
          ...prev.settings.profile,
          ...updates,
        },
      },
    }));
    setCelebrationToast('Профиль обновлен! ✨');
  };

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: {
          ...prev.settings.theme,
          ...updates,
        },
      },
    }));
  };

  const toggleThemeMode = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: {
          ...prev.settings.theme,
          mode: prev.settings.theme.mode === 'dark' ? 'ivory' : 'dark',
        },
      },
    }));
  };

  const setAccentColor = (accent: AccentColor) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: {
          ...prev.settings.theme,
          accent,
        },
      },
    }));
  };

  // Cycle Rollover: Lifetime coins & level persist forever!
  const advanceToNextCycle = () => {
    const currentCycleNumber = state.activeCycleNumber;
    const nextCycleNumber = currentCycleNumber + 1;

    let totalCompletedTasks = 0;
    let totalSuperDays = 0;
    const activeDates = Object.keys(state.dayLogs);

    activeDates.forEach((date) => {
      const log = state.dayLogs[date];
      totalCompletedTasks += log.completedTaskIds.length;
      if (log.isSuperDay) totalSuperDays++;
    });

    const completionRate =
      activeDates.length > 0 ? Math.round((totalSuperDays / Math.max(1, activeDates.length)) * 100) : 0;

    const completedCycle: Cycle = {
      id: `cycle-${currentCycleNumber}`,
      cycleNumber: currentCycleNumber,
      title: `Год №${currentCycleNumber} (Завершен)`,
      startDate: state.cycleStartDate,
      endDate: state.cycleEndDate,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      totalDaysActive: activeDates.length,
      totalTasksCompleted: totalCompletedTasks,
      totalSuperDays,
      finalCompletionRate: completionRate,
    };

    const nextStartDate = '2027-11-01';
    const nextEndDate = '2028-10-31';

    setState((prev) => ({
      ...prev,
      lifetimeCoins: prev.lifetimeCoins, // PRESERVED
      currentLevel: prev.currentLevel,   // PRESERVED
      availableCoins: prev.availableCoins, // PRESERVED
      achievements: prev.achievements,   // PRESERVED
      cyclesArchive: [...prev.cyclesArchive, completedCycle],
      activeCycleNumber: nextCycleNumber,
      cycleStartDate: nextStartDate,
      cycleEndDate: nextEndDate,
      dayLogs: {}, // RESET FOR NEW YEAR
    }));

    triggerConfetti('epic');
    setCelebrationToast(`Год №${currentCycleNumber} триумфально завершен! Добро пожаловать в Год №${nextCycleNumber}! 🚀`);
  };

  // Backup Export
  const exportBackupJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `my_year_backup_${getTodayDateString()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setCelebrationToast('Резервная копия сохранена в файл JSON! 💾');
    } catch (e) {
      console.error('Export error:', e);
      setCelebrationToast('Ошибка при экспорте резервной копии');
    }
  };

  // Backup Import
  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;

      setState({
        lifetimeCoins: parsed.lifetimeCoins ?? 0,
        currentLevel: parsed.currentLevel ?? 1,
        availableCoins: parsed.availableCoins ?? (parsed.lifetimeCoins ?? 0),
        achievements: parsed.achievements || INITIAL_ACHIEVEMENTS,
        cyclesArchive: parsed.cyclesArchive || [],
        transactions: parsed.transactions || [],
        personalRewards: parsed.personalRewards || STARTER_REWARDS,
        activeCycleNumber: parsed.activeCycleNumber ?? 1,
        cycleStartDate: parsed.cycleStartDate ?? CYCLE_1_START,
        cycleEndDate: parsed.cycleEndDate ?? CYCLE_1_END,
        tasks: parsed.tasks || STARTER_TASKS,
        dayLogs: parsed.dayLogs || {},
        settings: {
          ...DEFAULT_SETTINGS,
          ...(parsed.settings || {}),
        },
      });

      setCelebrationToast('Данные успешно восстановлены из резервной копии! 🌟');
      return true;
    } catch (e) {
      console.error('Import error:', e);
      setCelebrationToast('Ошибка при импорте: неверный формат файла');
      return false;
    }
  };

  // Factory Reset
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      lifetimeCoins: 0,
      currentLevel: 1,
      availableCoins: 0,
      achievements: INITIAL_ACHIEVEMENTS,
      cyclesArchive: [],
      transactions: [],
      personalRewards: STARTER_REWARDS,
      activeCycleNumber: 1,
      cycleStartDate: CYCLE_1_START,
      cycleEndDate: CYCLE_1_END,
      tasks: STARTER_TASKS,
      dayLogs: {},
      settings: DEFAULT_SETTINGS,
    });
    setCelebrationToast('Приложение сброшено к исходному состоянию');
  };

  return (
    <AppContext.Provider
      value={{
        state,
        selectedBlockId,
        setSelectedBlockId,
        selectedDate,
        setSelectedDate,
        toggleTaskCompletion,
        addTask,
        editTask,
        deleteTask,
        moveTaskToBlock,
        redeemReward,
        addCustomReward,
        deleteCustomReward,
        updateProfile,
        updateTheme,
        toggleThemeMode,
        setAccentColor,
        advanceToNextCycle,
        exportBackupJSON,
        importBackupJSON,
        resetAllData,
        celebrationToast,
        setCelebrationToast,
        levelUpModalData,
        setLevelUpModalData,
        todayDayLog,
        levelInfo,
        cycleStatus,
        blockProgress,
        dayOverallPct,
        dailyPraise,
        weeklyStats,
        focusScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
