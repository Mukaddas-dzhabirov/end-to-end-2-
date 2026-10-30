import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Sparkles, FileText, Check, Shield } from 'lucide-react';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'name' | 'concept' | 'specs'>('name');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Концепция и Выбор Названия
              </h3>
              <p className="text-[11px] text-slate-400">
                MY YEAR. MY RULES. — 365 Дней Дисциплины
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('name')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'name'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🏆 Выбор Названия
          </button>
          <button
            onClick={() => setActiveSubTab('concept')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'concept'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Концепция и Механика
          </button>
          <button
            onClick={() => setActiveSubTab('specs')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'specs'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📁 Комплект Документов (3 файла)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeSubTab === 'name' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                  Однозначный фаворит и рекомендация:
                </span>
                <h4 className="text-xl font-black text-white mt-1">
                  «MY YEAR. MY RULES.»
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Это не просто ярлык трекера — это <strong>личный манифест</strong>. Оно звучит дерзко, статусно и кинематографично. Пользователь открывает приложение не потому, что "надо", а потому что это <em>его год</em> и <em>его правила</em>.
                </p>
              </div>

              <h5 className="font-bold text-slate-200 pt-2">
                Сравнительный анализ вариантов:
              </h5>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">
                      1. MY YEAR. MY RULES. (Победитель 🥇)
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Выбор №1
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Сразу передаёт суть: 365-дневный персональный цикл + свобода настраивать свои правила на 4 блока без токсичного внешнего давления. Превосходно смотрится на иконке телефона.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-300 text-sm">
                    2. LEVEL UP
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Отличный игровой акцент, но слишком обобщённый (существуют сотни приложений с таким именем). Теряется уникальная связка с 365-дневным годовым циклом.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-300 text-sm">
                    3. 365 DAYS
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Чётко указывает на длительность, но звучит сухо и математично, без эмоционального огня и личной привязки.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-300 text-sm">
                    4. MY DISCIPLINE &amp; BECOME BETTER
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Слишком нравоучительно. Слово «дисциплина» у многих вызывает ассоциации со школой или армией, а «Become Better» звучит как шаблонный лозунг из фитнес-журнала.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'concept' && (
            <div className="space-y-3 leading-relaxed">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block text-xs">
                  Утверждённая архитектура года:
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc pl-4">
                  <li><strong>1 ноября 2026:</strong> Торжественный старт Цикла №1.</li>
                  <li><strong>31 октября 2027:</strong> Финал 365 дней, заморозка итогового отчёта года.</li>
                  <li><strong>1 ноября 2027:</strong> Автоматический старт Цикла №2.</li>
                  <li><strong>Преемственность:</strong> Баланс монет, общий уровень и открытые трофеи сохраняются навсегда! Календарь 365 дней начинает новый отсчёт.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-blue-400 block text-xs">
                  Твой новый распорядок дня:
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc pl-4">
                  <li><strong>06:00–10:00:</strong> Блок 1 — Утренний старт (гидратация, спорт, фокус)</li>
                  <li><strong>10:00–14:00:</strong> Блок 2 — Продуктивность и развитие (Deep Work, обучение)</li>
                  <li><strong>14:00–18:00:</strong> Блок 3 — Работа и завершение дневных целей (дедлайны, спринты)</li>
                  <li><strong>18:00–22:00:</strong> Блок 4 — Вечерний мини-блок (личное время, итоги, семья)</li>
                  <li><strong>22:00–06:00:</strong> Время отдыха и сна (без обязательных задач по умолчанию)</li>
                </ul>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block text-xs">
                  Прогрессия уровней:
                </span>
                <p className="text-[11px] text-slate-300">
                  Уровень 1 — Новичок • Уровень 2 — Дисциплинированный • Уровень 3 — Организованный • Уровень 4 — Мастер продуктивности • Уровень 5 — Легенда дисциплины.
                </p>
              </div>
            </div>
          )}

          {activeSubTab === 'specs' && (
            <div className="space-y-3">
              <p className="text-slate-300 text-xs">
                Все три фундаментальных проектных документа уже сформированы в корневой директории репозитория:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-white text-xs block">
                      /CLAUDE.md
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Главные правила для разработчика, архитектура стэка, гайдлайны UI/UX, правила работы с датами и Local-First хранилищем.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-white text-xs block">
                      /TECHNICAL_SPEC.md
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Подробное ТЗ: математика XP, формулы рангов, модель циклов (1 ноября 2026 – 31 октября 2027), спецификация 4-х блоков, Web App Manifest и звуковые эффекты.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-white text-xs block">
                      /DEVELOPMENT_PLAN.md
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Последовательный план из 8 спринтов с чек-листами, критериями приёмки (DoD) и деталями реализации.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs"
          >
            Понятно, к приложению!
          </button>
        </div>
      </div>
    </div>
  );
};
