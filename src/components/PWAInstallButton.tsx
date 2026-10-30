import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        title="Установить приложение на телефон"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Установить PWA</span>
        <span className="sm:hidden">Установить</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>На экран «Домой»</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                Установка на iPhone / iPad
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed space-y-2 mb-4">
                1. Нажмите иконку <strong>«Поделиться»</strong> (квадрат со стрелкой вверх) в нижней панели Safari.<br />
                2. Прокрутите меню вниз и выберите <strong>«На экран "Домой"»</strong>.<br />
                3. Нажмите <strong>«Добавить»</strong>. Приложение установится как полноценное мобильное приложение!
              </p>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
