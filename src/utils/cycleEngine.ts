import { Cycle } from '../types';

export const CYCLE_1_START = '2026-11-01';
export const CYCLE_1_END = '2027-10-31';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface CycleStatus {
  isPreSeason: boolean;
  preSeasonDaysRemaining: number;
  currentDayNumber: number; // 1 to 365
  totalDays: number;
  daysRemaining: number;
  progressPct: number;
  startDateFormatted: string;
  endDateFormatted: string;
  isCycleEnded: boolean;
}

export function calculateCycleStatus(
  startDateStr: string = CYCLE_1_START,
  endDateStr: string = CYCLE_1_END,
  currentDateStr: string = getTodayDateString()
): CycleStatus {
  const start = parseDateString(startDateStr);
  const end = parseDateString(endDateStr);
  const current = parseDateString(currentDateStr);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Pre-season check: before start date
  if (current.getTime() < start.getTime()) {
    const diffMs = start.getTime() - current.getTime();
    const daysUntilStart = Math.ceil(diffMs / MS_PER_DAY);
    return {
      isPreSeason: true,
      preSeasonDaysRemaining: Math.max(1, daysUntilStart),
      currentDayNumber: 1,
      totalDays: 365,
      daysRemaining: 365,
      progressPct: 0,
      startDateFormatted: '1 ноября 2026',
      endDateFormatted: '31 октября 2027',
      isCycleEnded: false,
    };
  }

  // Active or completed cycle
  const diffFromStartMs = current.getTime() - start.getTime();
  const elapsedDays = Math.floor(diffFromStartMs / MS_PER_DAY) + 1; // day 1 on start date
  const currentDay = Math.min(365, Math.max(1, elapsedDays));
  const remainingDays = Math.max(0, 365 - currentDay);
  const progressPct = Math.min(100, Math.round((currentDay / 365) * 100));
  const isEnded = current.getTime() > end.getTime();

  return {
    isPreSeason: false,
    preSeasonDaysRemaining: 0,
    currentDayNumber: currentDay,
    totalDays: 365,
    daysRemaining: remainingDays,
    progressPct,
    startDateFormatted: '1 ноября 2026',
    endDateFormatted: '31 октября 2027',
    isCycleEnded: isEnded,
  };
}

export function createInitialCycle(cycleNumber: number = 1): Cycle {
  return {
    id: `cycle-${cycleNumber}`,
    cycleNumber,
    title: `Год №${cycleNumber} (2026–2027)`,
    startDate: CYCLE_1_START,
    endDate: CYCLE_1_END,
    isCompleted: false,
    totalDaysActive: 0,
    totalTasksCompleted: 0,
    totalSuperDays: 0,
    finalCompletionRate: 0,
  };
}
