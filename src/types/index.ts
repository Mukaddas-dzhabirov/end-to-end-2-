export type TimeBlockId = 
  | 'block1_morning'   // 06:00 – 10:00: Блок 1 — Утренний старт
  | 'block2_focus'     // 10:00 – 14:00: Блок 2 — Продуктивность и развитие
  | 'block3_work'      // 14:00 – 18:00: Блок 3 — Работа и завершение дневных целей
  | 'block4_evening'   // 18:00 – 22:00: Вечерний мини-блок — Личное время, итоги и вечерние задачи
  | 'rest_night';      // 22:00 – 06:00: Время отдыха (без обязательных задач по умолчанию)

export interface TimeBlockInfo {
  id: TimeBlockId;
  blockNumber: number; // 1, 2, 3, 4, or 0 for rest
  title: string;
  subtitle: string;
  timeRange: string;
  icon: string;
  accentColor: string;
  isRestBlock?: boolean;
}

export type RepeatType = 'daily' | 'weekdays' | 'once';

export interface Task {
  id: string;
  title: string;
  description?: string;
  blockId: TimeBlockId;
  coinsReward: number; // 10 base, 25 for priority
  isPriority: boolean;
  repeatType: RepeatType;
  repeatDays?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  completedAt?: string; // ISO date string of completion
  createdAt: string;
  originalBlockId?: TimeBlockId;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  rewardedTaskIds: string[]; // ANTI-DUPLICATE: tasks that already paid out coins for this day
  completedBlockIds: TimeBlockId[];
  rewardedBlockIds?: TimeBlockId[]; // ANTI-DUPLICATE: block bonuses awarded for this day
  isSuperDay: boolean; // all 4 active blocks completed
  rewardedSuperDay?: boolean; // ANTI-DUPLICATE: Super Day bonus awarded
  earnedCoins: number;
  spentCoins?: number;
  notes?: string;
}

export interface CoinTransaction {
  id: string;
  timestamp: string; // ISO format
  amount: number; // positive = earned, negative = spent
  type: 'task_completion' | 'block_bonus' | 'super_day' | 'achievement' | 'reward_redemption';
  description: string;
  taskId?: string;
}

export interface PersonalReward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'coins' | 'blocks' | 'cycle';
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  coinsBonus: number;
}

export interface Cycle {
  id: string;
  cycleNumber: number;
  title: string;
  startDate: string; // e.g. "2026-11-01"
  endDate: string; // e.g. "2027-10-31"
  isCompleted: boolean;
  completedAt?: string;
  totalDaysActive: number;
  totalTasksCompleted: number;
  totalSuperDays: number;
  finalCompletionRate: number;
}

export interface UserProfile {
  name: string;
  avatarEmoji: string;
  motto: string;
  joinDate: string;
}

export type ThemeMode = 'dark' | 'ivory';
export type AccentColor = 'terracotta' | 'sage' | 'sky' | 'lavender' | 'gold';
export type DensityStyle = 'airy' | 'compact';
export type StreakStyle = 'flame' | 'number' | 'bar';

export interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentColor;
  density: DensityStyle;
  streakStyle: StreakStyle;
}

export interface UserSettings {
  profile: UserProfile;
  theme: ThemeSettings;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  blockReminders: {
    block1: boolean;
    block2: boolean;
    block3: boolean;
    block4: boolean;
  };
}

export interface AppState {
  // Global persistent (NEVER resets across cycles)
  lifetimeCoins: number;
  currentLevel: number;
  availableCoins: number; // spendable in personal rewards shop
  achievements: Achievement[];
  cyclesArchive: Cycle[];
  transactions: CoinTransaction[];
  personalRewards: PersonalReward[];

  // Current Active Cycle state
  activeCycleNumber: number;
  cycleStartDate: string;
  cycleEndDate: string;

  // Task templates & Daily records
  tasks: Task[];
  dayLogs: Record<string, DayLog>; // keyed by YYYY-MM-DD

  // Settings & Profile
  settings: UserSettings;
}
