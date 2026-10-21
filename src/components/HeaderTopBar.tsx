import React from 'react';
import { ShieldAlert, Volume2, VolumeX, Bell, Filter } from 'lucide-react';

interface HeaderTopBarProps {
  activeTab: 'feed' | 'radar' | 'intel' | 'channels';
  setActiveTab: (tab: 'feed' | 'radar' | 'intel' | 'channels') => void;
  onTriggerSimulatedAlert: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationPermission: NotificationPermission;
  onRequestNotifications: () => void;
  activeAlertCount: number;
  cityFilterMode: 'all' | 'custom';
  monitoredCitiesCount: number;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  activeTab,
  setActiveTab,
  onTriggerSimulatedAlert,
  soundEnabled,
  onToggleSound,
  notificationPermission,
  onRequestNotifications,
  activeAlertCount,
  cityFilterMode,
  monitoredCitiesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => setActiveTab('feed')}
          className="text-left flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
              WarFeed
            </span>
            <span className="text-xs font-semibold text-rose-500 ml-1.5 uppercase tracking-wider">
              Live Radar
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => setActiveTab('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'feed' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Feed de Noticias
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors hover:text-white ${
              activeTab === 'radar' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            <span>Radar Tzeva Adom</span>
            {activeAlertCount > 0 && (
              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                {activeAlertCount} Activas
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('intel')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'intel' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Análisis Operacional
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'channels' ? 'text-white border-b-2 border-rose-500 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Canales Oficiales
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* City filter badge button */}
          <button
            onClick={() => setActiveTab('radar')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title="Configurar ciudades para recibir alertas"
          >
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate max-w-[120px]">
              {cityFilterMode === 'all' ? 'Todas las ciudades' : `${monitoredCitiesCount} ciudades`}
            </span>
          </button>

          {/* Audio toggle button */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Sirena con audio habilitado' : 'Sirena silenciada'}
            className="w-10 h-10 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {/* Browser notification permission request button */}
          <button
            onClick={onRequestNotifications}
            title={notificationPermission === 'granted' ? 'Notificaciones push activas' : 'Activar notificaciones de misiles'}
            className="w-10 h-10 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Bell className={`w-4 h-4 ${notificationPermission === 'granted' ? 'text-emerald-400' : 'text-neutral-400'}`} />
            {notificationPermission !== 'granted' && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Single Primary Action: Trigger Test/Live Missile Alert */}
          <button
            onClick={onTriggerSimulatedAlert}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-[0.98] rounded-lg shadow-md shadow-rose-950/40 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simular Alerta צבע אדום</span>
          </button>
        </div>
      </div>
    </header>
  );
};
