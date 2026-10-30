import React from 'react';
import { ShieldAlert, Volume2, VolumeX, Bell, BellOff, Filter, Globe, Clock, Calendar, RotateCw } from 'lucide-react';
import type { AppLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderTopBarProps {
  activeTab: 'feed' | 'radar' | 'intel' | 'channels';
  setActiveTab: (tab: 'feed' | 'radar' | 'intel' | 'channels') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  notificationPermission?: NotificationPermission;
  onRequestNotifications?: () => void;
  activeAlertCount: number;
  cityFilterMode: 'all' | 'custom';
  monitoredCitiesCount: number;
  appLanguage: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  lastUpdatedTimestamp?: number;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  notificationsEnabled,
  onToggleNotifications,
  notificationPermission,
  onRequestNotifications,
  activeAlertCount,
  cityFilterMode,
  monitoredCitiesCount,
  appLanguage,
  onChangeLanguage,
  lastUpdatedTimestamp = Date.now()
}) => {
  const t = UI_TRANSLATIONS[appLanguage];

  const d = new Date(lastUpdatedTimestamp || Date.now());
  const localeMap: Record<AppLanguage, string> = {
    es: 'es-ES',
    en: 'en-US',
    fr: 'fr-FR',
    he: 'he-IL'
  };
  const loc = localeMap[appLanguage] || 'es-ES';

  const dateFormatted = d.toLocaleDateString(loc, {
    timeZone: 'Asia/Jerusalem',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeFormatted = d.toLocaleTimeString(loc, {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      {/* Prominent Live Synchronized Date & Time Bar across top of app */}
      <div className="bg-neutral-900 border-b border-neutral-800/90 px-3 sm:px-6 py-2 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Live Indicator & Exact Date and Time */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-600/80 text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EN VIVO</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5 text-neutral-300">
              <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-neutral-400 text-[11px] sm:text-xs">
                {appLanguage === 'he'
                  ? 'תאריך ושעה של העדכון האחרון:'
                  : appLanguage === 'es'
                  ? 'Última actualización:'
                  : appLanguage === 'fr'
                  ? 'Dernière mise à jour :'
                  : 'Last update:'}
              </span>
              <span
                className="font-mono font-bold text-emerald-300 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-700/80 shadow-inner flex items-center gap-1.5"
                title="Fecha y hora oficial de la última actualización en vivo"
              >
                <Clock className="w-3 h-3 text-sky-400" />
                <span className="text-neutral-200">{capitalizedDate}</span>
                <span className="text-neutral-500">|</span>
                <span className="text-emerald-400 font-extrabold">{timeFormatted}</span>
                <span className="text-[10px] text-neutral-400 font-normal hidden sm:inline">(Hora oficial)</span>
              </span>

              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  window.location.reload();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] border border-emerald-400 shadow-sm transition-all cursor-pointer"
                title="Actualizar toda la aplicación como recarga de navegador"
              >
                <RotateCw className="w-3 h-3" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* Israel Completo Coverage Badge */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-950/70 border border-sky-700/60 text-sky-300 font-semibold shadow-sm">
              🇮🇱 Cobertura Completa de Israel
            </span>
            <span className="hidden lg:inline text-neutral-400">
              Política · High-Tech · Economía · Sociedad · Norte · Centro · Jerusalén · Sur
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => setActiveTab('feed')}
          className="text-left flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 shrink-0">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
              {t.appName}
            </span>
            <span className="hidden xs:inline text-[11px] font-semibold text-rose-500 ml-1.5 uppercase tracking-wider">
              {t.appSubtitle}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop & Tablet md:) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => setActiveTab('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeTab === 'feed' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            {t.navNews}
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors hover:text-white py-1 ${
              activeTab === 'radar' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            <span>{t.navSirens}</span>
            {activeAlertCount > 0 && (
              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                {t.activeAlertsCount(activeAlertCount)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('intel')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeTab === 'intel' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            {t.navIntel}
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              activeTab === 'channels' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            {t.navChannels}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Header Language Selector (Quick Compact Switcher) */}
          <div className="flex items-center p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg">
            <button
              onClick={() => onChangeLanguage('es')}
              className={`px-2 py-1.5 rounded-md text-xs font-bold transition-all min-w-[32px] sm:min-w-[36px] min-h-[36px] flex items-center justify-center gap-1 ${
                appLanguage === 'es'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Cambiar a Español"
            >
              <span>🇪🇸</span>
              <span className="hidden sm:inline">ES</span>
            </button>
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-2 py-1.5 rounded-md text-xs font-bold transition-all min-w-[32px] sm:min-w-[36px] min-h-[36px] flex items-center justify-center gap-1 ${
                appLanguage === 'en'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
            <button
              onClick={() => onChangeLanguage('fr')}
              className={`px-2 py-1.5 rounded-md text-xs font-bold transition-all min-w-[32px] sm:min-w-[36px] min-h-[36px] flex items-center justify-center gap-1 ${
                appLanguage === 'fr'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Passer en Français"
            >
              <span>🇫🇷</span>
              <span className="hidden sm:inline">FR</span>
            </button>
            <button
              onClick={() => onChangeLanguage('he')}
              className={`px-2 py-1.5 rounded-md text-xs font-bold transition-all min-w-[32px] sm:min-w-[36px] min-h-[36px] flex items-center justify-center gap-1 ${
                appLanguage === 'he'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="עבור לעברית (Hebrew)"
            >
              <span>🇮🇱</span>
              <span className="hidden sm:inline">עב</span>
            </button>
          </div>

          {/* PWA Install Button for Chrome / Edge */}
          <PWAInstallButton appLanguage={appLanguage} variant="topbar" />

          {/* City filter badge button (Desktop/Tablet) */}
          <button
            onClick={() => setActiveTab('radar')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[44px]"
            title="Configuración de ciudades / City filters"
          >
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate max-w-[110px]">
              {cityFilterMode === 'all' ? t.filterAllCountry : t.filterCities(monitoredCitiesCount)}
            </span>
          </button>

          {/* Audio toggle button */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Sirena con audio / Sound ON' : 'Sirena silenciada / Sound OFF'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0 min-h-[44px] min-w-[44px]"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {/* Notification toggle button (ON / OFF) */}
          <button
            type="button"
            onClick={onToggleNotifications}
            aria-label={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
            title={
              notificationsEnabled
                ? 'Notificaciones ACTIVADAS (Clic para desactivar)'
                : 'Notificaciones DESACTIVADAS (Clic para activar)'
            }
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0 min-h-[44px] min-w-[44px] active:scale-95 cursor-pointer ${
              notificationsEnabled
                ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950 shadow-md shadow-emerald-950/60 ring-1 ring-emerald-500/40'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            {notificationsEnabled ? (
              <Bell className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <BellOff className="w-4 h-4 text-neutral-500" />
            )}
            {!notificationsEnabled && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500/80" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
