import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Coins, 
  Calendar, 
  Save, 
  Smile 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { state, updateProfile, levelInfo } = useApp();
  const profile = state.settings.profile;
  const isIvory = state.settings.theme.mode === 'ivory';

  const [name, setName] = useState(profile.name);
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatarEmoji);
  const [motto, setMotto] = useState(profile.motto);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Чемпион',
      avatarEmoji: avatarEmoji || '👑',
      motto: motto.trim() || 'Мой год. Мои правила.',
    });
    setIsEditing(false);
  };

  const AVATAR_OPTIONS = ['👑', '⚡', '🦅', '🦁', '🚀', '🎯', '💎', '🔥', '🛡️', '🐺', '🌟', '🧘‍♂️'];

  // Lifetime counts
  let totalTasksCompleted = 0;
  let totalSuperDays = 0;
  Object.values(state.dayLogs).forEach((log) => {
    totalTasksCompleted += log.completedTaskIds?.length || 0;
    if (log.isSuperDay) totalSuperDays++;
  });

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

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/10">
            {profile.avatarEmoji}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black">{profile.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                Ур. {levelInfo.currentLevel}
              </span>
            </div>
            <p className={`text-xs italic ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
              «{profile.motto}»
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className={`p-3 rounded-2xl border flex items-center gap-2 mb-4 text-xs ${
          isIvory ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
        }`}>
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>100% приватный профиль:</strong> твои данные хранятся только локально на устройстве. Никаких серверов и публичных списков.
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`p-3 rounded-2xl border text-center ${
            isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <Coins className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-base font-black font-mono block text-amber-500">
              {state.lifetimeCoins.toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-400">Всего монет</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center ${
            isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <Flame className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <span className="text-base font-black font-mono block text-red-500">
              {totalSuperDays}
            </span>
            <span className="text-[10px] text-stone-400">Супер-дней</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center ${
            isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <Trophy className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <span className="text-base font-black font-mono block text-blue-500">
              {totalTasksCompleted}
            </span>
            <span className="text-[10px] text-stone-400">Закрыто задач</span>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Имя пользователя:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Выбери аватар:</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setAvatarEmoji(emoji)}
                    className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-transform cursor-pointer ${
                      avatarEmoji === emoji ? 'border-amber-500 bg-amber-500/20 scale-110' : 'border-stone-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Девиз года:</label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl border text-stone-400 cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-500 text-white font-bold cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={`w-full py-2.5 rounded-2xl border text-xs font-bold transition-colors cursor-pointer ${
              isIvory ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            Редактировать профиль
          </button>
        )}
      </div>
    </div>
  );
};
