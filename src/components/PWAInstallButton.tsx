import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type { AppLanguage } from '../types';

interface PWAInstallButtonProps {
  appLanguage: AppLanguage;
  variant?: 'topbar' | 'banner' | 'feed-card';
}

const TEXTS: Record<AppLanguage, {
  installApp: string;
  installShort: string;
  bannerTitle: string;
  bannerSubtitle: string;
  installNow: string;
  howToInstall: string;
  installedBadge: string;
  modalTitle: string;
  modalSubtitle: string;
  chromeStep1: string;
  chromeStep2: string;
  edgeStep1: string;
  edgeStep2: string;
  iosStep1: string;
  iosStep2: string;
  close: string;
  directPromptAvailable: string;
}> = {
  es: {
    installApp: 'Instalar Aplicación',
    installShort: 'Instalar App',
    bannerTitle: 'Instala WarFeed en tu Teléfono',
    bannerSubtitle: 'Añade la app a tu pantalla de inicio en Chrome o Edge para navegación ultrarrápida y modo a pantalla completa.',
    installNow: 'Instalar Ahora',
    howToInstall: 'Ver cómo instalar',
    installedBadge: 'App Instalada',
    modalTitle: 'Instalar WarFeed en Chrome o Edge',
    modalSubtitle: 'Convierte este sitio web en una aplicación nativa en tu teléfono o computadora.',
    chromeStep1: 'En Google Chrome, toca el menú de tres puntos (⋮) en la esquina superior o inferior derecha.',
    chromeStep2: 'Selecciona "Instalar aplicación" o "Agregar a la pantalla principal".',
    edgeStep1: 'En Microsoft Edge, toca el menú de tres puntos (...) en la barra de herramientas.',
    edgeStep2: 'Ve a "Aplicaciones" y pulsa "Instalar este sitio como aplicación".',
    iosStep1: 'En Safari para iPhone/iPad, pulsa el botón Compartir (icono de caja con flecha arriba).',
    iosStep2: 'Baja en el menú y selecciona "Añadir a la pantalla de inicio".',
    close: 'Entendido',
    directPromptAvailable: '¡Listo! Tu navegador permite la instalación directa con un clic.'
  },
  en: {
    installApp: 'Install Application',
    installShort: 'Install App',
    bannerTitle: 'Install WarFeed on Your Phone',
    bannerSubtitle: 'Add the app to your home screen via Chrome or Edge for ultra-fast navigation and full-screen experience.',
    installNow: 'Install Now',
    howToInstall: 'How to install',
    installedBadge: 'App Installed',
    modalTitle: 'Install WarFeed in Chrome or Edge',
    modalSubtitle: 'Convert this website into a standalone native application on your phone or PC.',
    chromeStep1: 'In Google Chrome, tap the 3-dots menu (⋮) in the top or bottom right corner.',
    chromeStep2: 'Select "Install app" or "Add to Home screen".',
    edgeStep1: 'In Microsoft Edge, tap the 3-dots menu (...) on the toolbar.',
    edgeStep2: 'Go to "Apps" and click "Install this site as an app".',
    iosStep1: 'In Safari on iOS, tap the Share button (square with arrow up).',
    iosStep2: 'Scroll down and tap "Add to Home Screen".',
    close: 'Got it',
    directPromptAvailable: 'Ready! Your browser supports 1-click direct app installation.'
  },
  fr: {
    installApp: 'Installer l\'Application',
    installShort: 'Installer App',
    bannerTitle: 'Installez WarFeed sur votre Téléphone',
    bannerSubtitle: 'Ajoutez l\'application à votre écran d\'accueil via Chrome ou Edge pour une expérience plein écran.',
    installNow: 'Installer Maintenant',
    howToInstall: 'Comment installer',
    installedBadge: 'App Installée',
    modalTitle: 'Installer WarFeed sous Chrome ou Edge',
    modalSubtitle: 'Transformez ce site en application mobile fluide et autonome.',
    chromeStep1: 'Sur Google Chrome, touchez le menu à trois points (⋮).',
    chromeStep2: 'Sélectionnez "Installer l\'application" ou "Ajouter à l\'écran d\'accueil".',
    edgeStep1: 'Sur Microsoft Edge, ouvrez le menu (...).',
    edgeStep2: 'Sélectionnez "Applications" puis "Installer ce site en tant qu\'application".',
    iosStep1: 'Sur Safari iOS, touchez le bouton Partager.',
    iosStep2: 'Faites défiler vers le bas et touchez "Sur l\'écran d\'accueil".',
    close: 'Fermer',
    directPromptAvailable: 'Prêt ! Votre navigateur permet l\'installation en un clic.'
  },
  he: {
    installApp: 'התקן אפליקציה',
    installShort: 'התקן אפליקציה',
    bannerTitle: 'התקן את WarFeed בטלפון הנייד',
    bannerSubtitle: 'הוסף את האפליקציה למסך הבית ב-Chrome או Edge לגלישה מהירה ומסך מלא.',
    installNow: 'התקן עכשיו',
    howToInstall: 'איך מתקינים?',
    installedBadge: 'אפליקציה מותקנת',
    modalTitle: 'התקנת WarFeed ב-Chrome או Edge',
    modalSubtitle: 'הפוך את האתר לאפליקציה עצמאית בטלפון או במחשב.',
    chromeStep1: 'בדפדפן Google Chrome, לחץ על שלוש הנקודות (⋮) בפינת המסך.',
    chromeStep2: 'בחר "התקן אפליקציה" או "הוסף למסך הבית".',
    edgeStep1: 'בדפדפן Microsoft Edge, לחץ על תפריט שלוש הנקודות (...).',
    edgeStep2: 'בחר "אפליקציות" ולאחר מכן "התקן אתר זה כאפליקציה".',
    iosStep1: 'ב-Safari של אייפון, לחץ על כפתור השיתוף.',
    iosStep2: 'גלול ובחר "הוסף למסך הבית".',
    close: 'הבנתי',
    directPromptAvailable: 'מוכן! הדפדפן שלך תומך בהתקנה ישירה בלחיצה אחת.'
  }
};

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  appLanguage,
  variant = 'topbar'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  const t = TEXTS[appLanguage] || TEXTS.es;

  // If already installed and running standalone, hide the prompt
  if (isInstalled) {
    if (variant === 'topbar') {
      return (
        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>{t.installedBadge}</span>
        </span>
      );
    }
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  // Topbar Button
  if (variant === 'topbar') {
    return (
      <>
        <button
          onClick={handleAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-950/50 hover:shadow-sky-500/20 transition-all border border-sky-400/30 active:scale-95"
          title={t.installApp}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden xs:inline">{t.installShort}</span>
          <Download className="w-3 h-3 shrink-0 opacity-80" />
        </button>

        {showModal && (
          <InstallInstructionsModal
            t={t}
            isIOS={isIOS}
            isInstallable={isInstallable}
            onInstallDirect={install}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Feed Banner Variant
  if (variant === 'banner' && !isBannerDismissed) {
    return (
      <>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/70 via-neutral-900 to-blue-950/60 border border-sky-500/30 p-4 sm:p-5 shadow-xl my-3">
          <button
            onClick={() => setIsBannerDismissed(true)}
            className="absolute top-3 right-3 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800/80 transition-colors"
            title="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
                  <span>{t.bannerTitle}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase">
                    PWA
                  </span>
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5 max-w-xl leading-relaxed">
                  {t.bannerSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleAction}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-sky-500 hover:bg-sky-400 text-neutral-950 shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>{t.installNow}</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                {t.howToInstall}
              </button>
            </div>
          </div>
        </div>

        {showModal && (
          <InstallInstructionsModal
            t={t}
            isIOS={isIOS}
            isInstallable={isInstallable}
            onInstallDirect={install}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return null;
};

interface ModalProps {
  t: typeof TEXTS['es'];
  isIOS: boolean;
  isInstallable: boolean;
  onInstallDirect: () => Promise<boolean>;
  onClose: () => void;
}

const InstallInstructionsModal: React.FC<ModalProps> = ({
  t,
  isIOS,
  isInstallable,
  onInstallDirect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl text-left overflow-hidden">
        {/* Header glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />

        <div className="flex items-start justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {t.modalTitle}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isInstallable && (
          <div className="my-3 p-3 rounded-2xl bg-sky-950/60 border border-sky-500/40 text-xs text-sky-200 flex items-center justify-between gap-3">
            <span>{t.directPromptAvailable}</span>
            <button
              onClick={async () => {
                await onInstallDirect();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs shrink-0 flex items-center gap-1 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.installNow}</span>
            </button>
          </div>
        )}

        <div className="space-y-3.5 my-4 text-xs">
          {/* Chrome Guide */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <span className="text-base">🌐</span>
              <span>Google Chrome (Android / PC)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>{t.chromeStep1}</li>
              <li className="text-sky-300 font-semibold">{t.chromeStep2}</li>
            </ol>
          </div>

          {/* Edge Guide */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <span className="text-base">🌊</span>
              <span>Microsoft Edge (Android / PC)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>{t.edgeStep1}</li>
              <li className="text-sky-300 font-semibold">{t.edgeStep2}</li>
            </ol>
          </div>

          {/* iOS Safari Guide */}
          {isIOS && (
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                <Share className="w-4 h-4 text-sky-400" />
                <span>Safari (iPhone / iPad)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                <li>{t.iosStep1}</li>
                <li className="text-sky-300 font-semibold">{t.iosStep2}</li>
              </ol>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{t.close}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
