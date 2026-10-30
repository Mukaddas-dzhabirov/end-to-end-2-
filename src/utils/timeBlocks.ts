import { TimeBlockId, TimeBlockInfo } from '../types';

export const TIME_BLOCKS: TimeBlockInfo[] = [
  {
    id: 'block1_morning',
    blockNumber: 1,
    title: 'Утренний старт',
    subtitle: 'Настрой, гидратация, спорт, фокус',
    timeRange: '06:00 – 10:00',
    icon: 'Sunrise',
    accentColor: '#F59E0B', // Amber / Gold
  },
  {
    id: 'block2_focus',
    blockNumber: 2,
    title: 'Продуктивность и развитие',
    subtitle: 'Deep Work, интеллектуальный прорыв, обучение',
    timeRange: '10:00 – 14:00',
    icon: 'Flame',
    accentColor: '#3B82F6', // Blue / Sky
  },
  {
    id: 'block3_work',
    blockNumber: 3,
    title: 'Работа и дневные цели',
    subtitle: 'Закрытие дедлайнов, рабочие спринты, результат',
    timeRange: '14:00 – 18:00',
    icon: 'Briefcase',
    accentColor: '#8B5CF6', // Purple / Lavender
  },
  {
    id: 'block4_evening',
    blockNumber: 4,
    title: 'Вечерний мини-блок',
    subtitle: 'Личное время, итоги, семья и вечерние ритуалы',
    timeRange: '18:00 – 22:00',
    icon: 'Sunset',
    accentColor: '#EC4899', // Pink / Coral
  },
  {
    id: 'rest_night',
    blockNumber: 0,
    title: 'Время отдыха и сна',
    subtitle: 'Восстановление сил, без обязательных задач',
    timeRange: '22:00 – 06:00',
    icon: 'Moon',
    accentColor: '#10B981', // Emerald / Sage
    isRestBlock: true,
  },
];

// Returns the active block based on the current system hour
export function getCurrentTimeBlockId(): TimeBlockId {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'block1_morning';
  if (hour >= 10 && hour < 14) return 'block2_focus';
  if (hour >= 14 && hour < 18) return 'block3_work';
  if (hour >= 18 && hour < 22) return 'block4_evening';
  return 'rest_night';
}

export function getTimeBlockById(id: TimeBlockId): TimeBlockInfo {
  return TIME_BLOCKS.find((b) => b.id === id) || TIME_BLOCKS[0];
}

// 4 main active discipline blocks that participate in Super Day and daily completion score
export const ACTIVE_DISCIPLINE_BLOCKS: TimeBlockId[] = [
  'block1_morning',
  'block2_focus',
  'block3_work',
  'block4_evening',
];
