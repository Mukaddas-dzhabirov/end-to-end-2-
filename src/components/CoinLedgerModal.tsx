import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Gift, 
  History, 
  Plus, 
  Sparkles, 
  Check, 
  Trash2,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CoinLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinLedgerModal: React.FC<CoinLedgerModalProps> = ({ isOpen, onClose }) => {
  const { 
    state, 
    levelInfo, 
    redeemReward, 
    addCustomReward, 
    deleteCustomReward 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState('150');
  const [newIcon, setNewIcon] = useState('🎁');

  const isIvory = state.settings.theme.mode === 'ivory';

  if (!isOpen) return null;

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomReward({
      title: newTitle.trim(),
      cost: Math.max(10, parseInt(newCost) || 100),
      icon: newIcon || '🎁',
    });

    setNewTitle('');
    setIsAddingReward(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className={`rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative border ${
        isIvory ? 'bg-[#FAF8F5] border-stone-300 text-stone-900' : 'bg-slate-900 border-slate-800 text-white'
      } animate-in fade-in zoom-in-95 duration-150`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between shrink-0 ${
          isIvory ? 'border-stone-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Монеты & Личные награды
              </h3>
              <p className={`text-xs ${isIvory ? 'text-stone-500' : 'text-slate-400'}`}>
                Твой банк дисциплины: монеты никогда не сгорают
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isIvory ? 'text-stone-400 hover:text-stone-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Ribbon */}
        <div className={`p-4 mx-5 my-3 rounded-2xl border flex items-center justify-between ${
          isIvory ? 'bg-amber-50/60 border-amber-200 text-amber-950' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
              Доступно для наград
            </span>
            <div className="text-2xl font-black font-mono text-amber-500 flex items-center gap-1.5">
              <Coins className="w-5 h-5" />
              <span>{state.availableCoins.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] block opacity-70">
              Всего заработано (XP)
            </span>
            <span className="text-sm font-mono font-bold block">
              {state.lifetimeCoins.toLocaleString()} монет
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 flex gap-2">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : isIvory ? 'bg-stone-100 text-stone-600' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Магазин наград</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : isIvory ? 'bg-stone-100 text-stone-600' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>История начислений</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'rewards' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className={isIvory ? 'text-stone-600' : 'text-slate-400'}>
                  Вознаграждай себя за соблюдение правил:
                </span>
                <button
                  onClick={() => setIsAddingReward(!isAddingReward)}
                  className="text-amber-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Своя награда</span>
                </button>
              </div>

              {/* Add Custom Reward Form */}
              {isAddingReward && (
                <form onSubmit={handleCreateReward} className={`p-3.5 rounded-2xl border space-y-2.5 ${
                  isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <h4 className="font-bold text-xs">Добавить личную награду</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Иконка (эмодзи)"
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      className="w-16 px-2.5 py-1.5 rounded-xl border text-center text-sm"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Например: Поход в сауну, любимый бургер"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border text-xs"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Монет"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="w-20 px-2 py-1.5 rounded-xl border text-xs text-center font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsAddingReward(false)}
                      className="px-3 py-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold cursor-pointer"
                    >
                      Добавить
                    </button>
                  </div>
                </form>
              )}

              {/* Rewards List */}
              <div className="space-y-2">
                {state.personalRewards.map((rew) => {
                  const canAfford = state.availableCoins >= rew.cost;

                  return (
                    <div
                      key={rew.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{rew.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold">{rew.title}</h4>
                          {rew.description && (
                            <p className="text-[11px] text-stone-400">{rew.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-xs text-amber-500">
                          {rew.cost} 🪙
                        </span>

                        <button
                          onClick={() => redeemReward(rew.id)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                              : 'bg-stone-300 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                          }`}
                        >
                          Купить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-2">
              {state.transactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  История начислений пока пуста. Выполняй правила дня, чтобы заработать первые монеты!
                </div>
              ) : (
                state.transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  const dateFormatted = new Date(tx.timestamp).toLocaleString('ru-RU', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={tx.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                        isIvory ? 'bg-white border-stone-200' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isPositive
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-rose-500/15 text-rose-500'
                        }`}>
                          {isPositive ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-xs leading-snug">{tx.description}</p>
                          <span className="text-[10px] text-stone-400 font-mono">{dateFormatted}</span>
                        </div>
                      </div>

                      <div className={`font-mono font-bold text-xs shrink-0 ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {isPositive ? `+${tx.amount}` : tx.amount} 🪙
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
