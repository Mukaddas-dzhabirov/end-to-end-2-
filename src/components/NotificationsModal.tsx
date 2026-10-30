import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Clock, 
  Volume2, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { state, setCelebrationToast } = useApp();
  const isIvory = state.settings.theme.mode === 'ivory';

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [reminders, setReminders] = useState({
    block1: true,
    block2: true,
    block3: true,
    block4: true,
  });

  if (!isOpen) return null;

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setCelebrationToast('Уведомления не поддерживаются в этом браузере');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('MY YEAR. MY RULES.', {
          body: 'Уведомления активированы! Ты будешь вовремя начинать каждый блок дня.',
          icon: '/pwa-192x192.png',
        });
        setCelebrationToast('Уведомления успешно подключены! 🔔');
      }
    } catch (e) {
      console.error('Notification request error:', e);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Блок 1: Утренний старт (06:00)', {
        body: 'Пора включить энергию! Вода, зарядка и главный фокус дня ждут тебя. 🔥',
        icon: '/pwa-192x192.png',
      });
      setCelebrationToast('Тестовое уведомление отправлено!');
    } else {
      requestNotificationPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl relative border ${
        isIvory ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-slate-900 border-slate-800 text-white'
      } animate-in fade-in zoom-in-95 duration-150`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer ${
            isIvory ? 'text-stone-400 hover:text-stone-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Уведомления о блоках</h3>
            <p className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              Напоминания о старте каждого из 4-х периодов дня
            </p>
          </div>
        </div>

        {/* Permission Status */}
        <div className={`p-4 rounded-2xl border mb-4 text-xs space-y-2.5 ${
          permission === 'granted'
            ? isIvory ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
            : isIvory ? 'bg-stone-100 border-stone-200 text-stone-700' : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Статус разрешений в браузере:</span>
            <span className={`font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
              permission === 'granted' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
            }`}>
              {permission === 'granted' ? 'Разрешено ✓' : 'Требует активации'}
            </span>
          </div>

          {permission !== 'granted' ? (
            <button
              onClick={requestNotificationPermission}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Включить уведомления на телефоне
            </button>
          ) : (
            <button
              onClick={sendTestNotification}
              className={`w-full py-2 rounded-xl font-semibold border cursor-pointer transition-colors ${
                isIvory ? 'bg-white border-stone-300 hover:bg-stone-50' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Проверить тестовое уведомление
            </button>
          )}
        </div>

        {/* Block Reminders Schedule */}
        <div className="space-y-2 mb-4 text-xs">
          <span className={`font-bold block ${isIvory ? 'text-stone-700' : 'text-slate-300'}`}>
            Расписание оповещений:
          </span>

          {[
            { id: 'block1', title: '06:00 — Блок 1: Утренний старт', desc: 'Настрой, зарядка и фокус' },
            { id: 'block2', title: '10:00 — Блок 2: Продуктивность и развитие', desc: 'Deep Work и ключевой прорыв' },
            { id: 'block3', title: '14:00 — Блок 3: Работа и цели', desc: 'Закрытие дедлайнов и задач' },
            { id: 'block4', title: '18:00 — Блок 4: Вечерний мини-блок', desc: 'Личное время и подведение итогов' },
          ].map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div>
                <span className="font-semibold block">{item.title}</span>
                <span className="text-[10px] text-stone-400">{item.desc}</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20"
        >
          Готово
        </button>
      </div>
    </div>
  );
};
