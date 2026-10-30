import confetti from 'canvas-confetti';

export interface LevelTier {
  level: number;
  requiredCoins: number;
  title: string;
  badge: string;
  perk: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  { 
    level: 1, 
    requiredCoins: 0, 
    title: 'Новичок', 
    badge: '🌱', 
    perk: 'Первый шаг к осознанной дисциплине и управлению своим днём' 
  },
  { 
    level: 2, 
    requiredCoins: 150, 
    title: 'Дисциплинированный', 
    badge: '⚡', 
    perk: 'Формирование устойчивых утренних и рабочих привычек' 
  },
  { 
    level: 3, 
    requiredCoins: 500, 
    title: 'Организованный', 
    badge: '🎯', 
    perk: 'Все 4 блока дня работают синхронно и без сбоев' 
  },
  { 
    level: 4, 
    requiredCoins: 1200, 
    title: 'Мастер продуктивности', 
    badge: '👑', 
    perk: 'Глубокий фокус Deep Work и стабильное закрытие целей' 
  },
  { 
    level: 5, 
    requiredCoins: 3000, 
    title: 'Легенда дисциплины', 
    badge: '🌌', 
    perk: 'Ты управляешь своим временем, энергией и годовыми результатами' 
  },
  { 
    level: 6, 
    requiredCoins: 6000, 
    title: 'Мастер воли', 
    badge: '⚔️', 
    perk: 'Абсолютная внутренняя опора и нерушимый фокус' 
  },
  { 
    level: 7, 
    requiredCoins: 12000, 
    title: 'Архитектор судьбы', 
    badge: '🏛️', 
    perk: 'Твоя система дисциплины вдохновляет окружающих' 
  },
  { 
    level: 8, 
    requiredCoins: 25000, 
    title: 'Владыка правил', 
    badge: '💎', 
    perk: '365 дней служат твоим великим целям' 
  },
];

export function getLevelInfo(coins: number) {
  let currentTier = LEVEL_TIERS[0];
  let nextTier: LevelTier | null = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (coins >= LEVEL_TIERS[i].requiredCoins) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || null;
    } else {
      break;
    }
  }

  const currentLevelCoins = currentTier.requiredCoins;
  const nextLevelCoins = nextTier ? nextTier.requiredCoins : currentLevelCoins;
  const diff = nextLevelCoins - currentLevelCoins;
  const progressCoins = coins - currentLevelCoins;
  const progressPct = nextTier ? Math.min(100, Math.max(0, Math.round((progressCoins / diff) * 100))) : 100;
  const coinsToNext = nextTier ? Math.max(0, nextLevelCoins - coins) : 0;

  return {
    currentLevel: currentTier.level,
    title: currentTier.title,
    badge: currentTier.badge,
    perk: currentTier.perk,
    progressPct,
    coinsToNext,
    nextTitle: nextTier?.title || null,
  };
}

// Daily Praise generator based on progress percentage
export function getDailyPraiseMessage(pct: number): { title: string; text: string } {
  if (pct === 100) {
    return {
      title: 'Легендарный результат!',
      text: 'Все блоки дня закрыты на 100%! Ты абсолютно неуязвим и правишь своим днём!',
    };
  }
  if (pct >= 75) {
    return {
      title: 'Мощный темп!',
      text: 'Больше 75% дня закрыто. Остались считанные шаги до идеального дня!',
    };
  }
  if (pct >= 50) {
    return {
      title: 'Экватор преодолен!',
      text: 'Половина дневных задач позади. Ты опережаешь большинство людей!',
    };
  }
  if (pct >= 25) {
    return {
      title: 'Отличный разгон!',
      text: 'Первые блоки дня взяты. Сохраняй спокойный фокус и уверенность.',
    };
  }
  return {
    title: 'Твой день — твои правила!',
    text: 'Каждый день начинается с маленького выбора. Сделай первый шаг в Утреннем старте.',
  };
}

// Friendly, emotional, gamer-inspired celebrations
export const TASK_CELEBRATIONS = [
  'Красавчик! Ещё один кирпичик в фундамент твоего года! 🧱',
  'Засчитано! Дисциплина всегда бьёт мотивацию! 🚀',
  'Чётко в цель! Ты управляешь своим днём, а не он тобой! 🎯',
  'Плюс монеты в твой банк величия! Так держать! 💰',
  'Уверенный шаг вперед! Ты на верной волне! ⚡',
  'Мощно! Твои правила работают безупречно! 🔥',
  'Великолепно! Каждый день строит новую версию тебя! 🌟',
  'Зафиксировано! Вперёд к следующей победе! 🛡️',
];

export const BLOCK_CELEBRATIONS = [
  'ВЕСЬ БЛОК ЗАКРЫТ! +50 монет в твою копилку! Чистый триумф! 🏆',
  'ИДЕАЛЬНЫЙ БЛОК! Стопроцентный фокус и дисциплина! ⚡',
  'Блок зачищен под ноль! Ты просто машина! 🚀',
  'Великолепная фаза дня завершена! С гордостью шагаем дальше! 🌈',
];

export const SUPER_DAY_CELEBRATIONS = [
  'ЛЕГЕНДАРНЫЙ ДЕНЬ! Все 4 блока выполнены на 100%! +150 бонусных монет! 👑🎆',
  'МАКСИМАЛЬНЫЙ ТРИУМФ! 4 из 4 блоков в зелёной зоне! Ты король этого дня! 🌟',
  'СУПЕР-ДЕНЬ! 100% дисциплины. Вот так создаются легенды года! 💎',
];

export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Visual fireworks / confetti
export function triggerConfetti(intensity: 'small' | 'medium' | 'epic' = 'small') {
  if (typeof window === 'undefined') return;

  if (intensity === 'small') {
    confetti({
      particleCount: 26,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981', '#3B82F6'],
      ticks: 120,
    });
  } else if (intensity === 'medium') {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#8B5CF6', '#10B981', '#3B82F6'],
      ticks: 180,
    });
  } else {
    // Epic: Double cannons
    const end = Date.now() + 1000;
    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 200,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#FDE047'],
      });
    }, 200);
  }
}

// Web Audio API pure synthesizer chime (no external audio file required)
export function playChime(type: 'coin' | 'level' | 'block' = 'coin') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'coin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'block') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.4);
      });
    } else if (type === 'level') {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.55);
      });
    }
  } catch (e) {
    // Audio Context might be locked by browser autoplay policy before user gesture
  }
}
