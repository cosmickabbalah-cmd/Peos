import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Radio,
  ExternalLink,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  Plus,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import type { MissileAlert } from '../types';

interface AlertRadarDrawerProps {
  activeAlerts: MissileAlert[];
  alertHistory: MissileAlert[];
  onTriggerTestAlert: (city?: string, type?: 'missile' | 'drone') => void;
  notificationPermission: NotificationPermission;
  onRequestNotifications: () => void;
  onSelectAlert: (alert: MissileAlert) => void;
  cityFilterMode: 'all' | 'custom';
  onChangeCityFilterMode: (mode: 'all' | 'custom') => void;
  monitoredCities: string[];
  onAddMonitoredCity: (city: string) => void;
  onRemoveMonitoredCity: (city: string) => void;
}

const PRESET_POPULAR_CITIES = [
  'Tel Aviv - Yafo',
  'Jerusalén',
  'Haifa',
  'Beersheba',
  'Ashdod',
  'Ashkelon',
  'Eilat',
  'Kiryat Shmona',
  'Sderot',
  'Herzliya',
  'Ramat Gan',
  'Netanya'
];

export const AlertRadarDrawer: React.FC<AlertRadarDrawerProps> = ({
  activeAlerts,
  alertHistory,
  onTriggerTestAlert,
  notificationPermission,
  onRequestNotifications,
  onSelectAlert,
  cityFilterMode,
  onChangeCityFilterMode,
  monitoredCities,
  onAddMonitoredCity,
  onRemoveMonitoredCity
}) => {
  const [customCityInput, setCustomCityInput] = useState('');

  const handleAddCustomCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityInput.trim()) return;
    onAddMonitoredCity(customCityInput.trim());
    setCustomCityInput('');
  };

  const shelterTimeReference = [
    { zone: 'Línea de Confrontación Norte & Otef Aza', time: '15 segundos', cities: 'Kiryat Shmona, Metula, Sderot, Nahal Oz' },
    { zone: 'Galilea Central & Néguev Occidental', time: '30 segundos', cities: 'Safed, Carmiel, Netivot, Ofakim' },
    { zone: 'Shephelah & Costa Sur', time: '45 segundos', cities: 'Ashdod, Ashkelon, Yavne, Kiryat Gat' },
    { zone: 'Bahía de Haifa & Néguev Central', time: '60 segundos', cities: 'Haifa, Krayot, Acre, Beersheba' },
    { zone: 'Distrito Central (Gush Dan) & Jerusalén', time: '90 segundos', cities: 'Tel Aviv, Ramat Gan, Herzliya, Jerusalén' },
    { zone: 'Mar Rojo & Aravá', time: '3 minutos', cities: 'Eilat, Mitzpe Ramon, Valle de Aravá' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Threat & Notification Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Radar Tzeva Adom & Sirenas de Emergencia
                </h2>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  EN LÍNEA
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Monitor conectado con tzevaadom.co.il y canal oficial de Telegram התרעות על שיגורים
              </p>
            </div>
          </div>

          {/* Push Notification Activation Card */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {notificationPermission === 'granted' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Push Activo</span>
              </div>
            ) : (
              <button
                onClick={onRequestNotifications}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Activar Notificaciones Push</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Simulator Action Bar */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Simulador / Prueba Inmediata de Alarma צבע אדום</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">Prueba sonido y popup</span>
          </div>

          <p className="text-xs text-neutral-400">
            Haz clic para detonar una alerta con sirena sonora (Web Audio API) y popup de emergencia:
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Tel Aviv (Gush Dan - 90s)', city: 'Tel Aviv - Yafo', type: 'missile' as const },
              { label: 'Haifa (Bahía - 60s)', city: 'Haifa - Carmel', type: 'drone' as const },
              { label: 'Jerusalén (Distrito 162 - 90s)', city: 'Jerusalén', type: 'missile' as const },
              { label: 'Kiryat Shmona (Norte - 15s)', city: 'Kiryat Shmona', type: 'drone' as const },
              { label: 'Eilat (Sur - 3min)', city: 'Eilat', type: 'missile' as const },
            ].map((preset) => (
              <button
                key={preset.city}
                onClick={() => onTriggerTestAlert(preset.city, preset.type)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-rose-900/60 hover:border-rose-600 text-rose-300 hover:text-white text-xs font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: City Customization & Alert Subscription Filter */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Ciudades a Monitorear (Filtro Personalizado)
              </h3>
              <p className="text-xs text-neutral-400">
                Elige si deseas recibir el popup y sirena para todo el país o solo para tus ciudades de interés
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 self-start sm:self-auto">
            <button
              onClick={() => onChangeCityFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                cityFilterMode === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todas las Ciudades
            </button>
            <button
              onClick={() => onChangeCityFilterMode('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                cityFilterMode === 'custom'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Solo Mis Ciudades ({monitoredCities.length})
            </button>
          </div>
        </div>

        {/* Custom Cities Manager (visible when custom mode is selected) */}
        {cityFilterMode === 'custom' && (
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300">
                Tus ciudades suscritas ({monitoredCities.length}):
              </span>
              <span className="text-neutral-500">
                Solo estas ciudades dispararán el popup y la sirena sonora
              </span>
            </div>

            {/* Monitored City Chips */}
            <div className="flex flex-wrap gap-2">
              {monitoredCities.length === 0 ? (
                <p className="text-xs text-amber-400/90 py-1">
                  ⚠️ No has agregado ninguna ciudad. Haz clic en las sugerencias abajo o escribe una ciudad.
                </p>
              ) : (
                monitoredCities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-rose-950 text-rose-200 border border-rose-800/80"
                  >
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{city}</span>
                    <button
                      onClick={() => onRemoveMonitoredCity(city)}
                      className="p-0.5 rounded-md hover:bg-rose-900/60 text-rose-400 hover:text-rose-100 transition-colors"
                      title={`Eliminar ${city}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Quick add suggestions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-neutral-400 font-medium">
                Agregar rápidamente ciudades principales:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_POPULAR_CITIES.map((city) => {
                  const isSelected = monitoredCities.includes(city);
                  return (
                    <button
                      key={city}
                      onClick={() => {
                        if (isSelected) onRemoveMonitoredCity(city);
                        else onAddMonitoredCity(city);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-rose-900/40 text-rose-200 border-rose-700'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 text-rose-400" /> : <Plus className="w-3 h-3" />}
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom City Input */}
            <form onSubmit={handleAddCustomCity} className="flex items-center gap-2 pt-2 border-t border-neutral-900">
              <input
                type="text"
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                placeholder="Escribe otra ciudad (ej: Rishon LeZion, Tiberias, Netivot)..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!customCityInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Active Alerts OR Calm State (Explicitly stating when there are no alerts!) */}
      {activeAlerts.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              Alertas Rojas Activas en este momento
            </span>
            <span className="font-mono text-neutral-400">{activeAlerts.length} zonas</span>
          </div>

          <div className="grid gap-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 to-neutral-900 border-2 border-red-600 shadow-lg shadow-red-950/50 cursor-pointer hover:border-red-500 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{alert.titleEs}</span>
                    <span className="text-xs font-mono font-bold text-rose-300">({alert.titleHe})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold animate-pulse">
                    EN CURSO
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {alert.citiesEs.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                  <span>Tiempo al refugio: <strong className="text-white font-mono">{alert.timeToShelterSec}s</strong></span>
                  <span className="text-rose-400 font-semibold underline">Ver Popup y Sirena &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Explicit Calm State: When there are NO alerts */
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-emerald-900/40 space-y-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  No hay ninguna alerta de misiles activa en este momento
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  CIELO EN CALMA (שקט)
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Los sistemas Tzeva Adom y el canal oficial de Telegram siguen escaneando 24/7. Si se detecta un lanzamiento hacia tus ciudades, se activará el popup y la sirena inmediatamente.
              </p>
            </div>
          </div>

          <button
            onClick={() => onTriggerTestAlert()}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-neutral-950 border border-rose-900/60 hover:border-rose-600 rounded-lg whitespace-nowrap shrink-0 transition-colors"
          >
            Probar Alerta de Prueba
          </button>
        </div>
      )}

      {/* Official Shelter Time Guide (Comando del Frente Doméstico) */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Tabla Oficial de Tiempos de Llegada a Refugio (זמן התגוננות)
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Pikud HaOref</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shelterTimeReference.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300">{item.zone}</span>
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">
                  {item.time}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Ciudades: {item.cities}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alert History Timeline */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Registro Histórico Reciente de Sirenas
            </h3>
          </div>
          <span className="text-xs text-neutral-400">{alertHistory.length} registros</span>
        </div>

        <div className="divide-y divide-neutral-800/80">
          {alertHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAlert(item)}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-800/40 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">{item.titleEs}</span>
                  <span className="text-[11px] text-neutral-400 font-mono">({item.zone})</span>
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] text-neutral-300">
                  {item.citiesEs.join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-400 shrink-0">
                <span className="font-mono text-[11px]">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button className="text-rose-400 hover:text-rose-300 text-xs font-medium">
                  Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Sources Footer */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div>
          <span>Fuentes Oficiales Integradas: </span>
          <strong className="text-neutral-200">tzevaadom.co.il · Pikud HaOref · ערוץ התרעות על שיגורים בטלגרם</strong>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.tzevaadom.co.il/en/"
            target="_blank"
            rel="noreferrer"
            className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-medium"
          >
            <span>Sitio Tzeva Adom</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-neutral-700">|</span>
          <a
            href="https://t.me/s/tzevaadom"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium"
          >
            <span>Canal Telegram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
