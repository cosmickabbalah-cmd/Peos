import React, { useEffect, useState } from 'react';
import { ShieldAlert, Volume2, VolumeX, X, ExternalLink, ShieldCheck, MapPin, Clock } from 'lucide-react';
import type { MissileAlert } from '../types';
import { alertAudio } from '../utils/soundEffects';

interface RedAlertModalProps {
  alert: MissileAlert;
  onDismiss: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const RedAlertModal: React.FC<RedAlertModalProps> = ({
  alert,
  onDismiss,
  soundEnabled,
  onToggleSound
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(alert.timeToShelterSec || 90);
  const initialTime = alert.timeToShelterSec || 90;

  // Countdown timer
  useEffect(() => {
    setTimeLeft(alert.timeToShelterSec || 90);
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [alert.id, alert.timeToShelterSec]);

  // Audio siren playback on alert appearance
  useEffect(() => {
    if (soundEnabled) {
      alertAudio.startTzevaAdomSiren();
    }
    return () => {
      alertAudio.stopTzevaAdomSiren();
    };
  }, [soundEnabled]);

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / initialTime) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-neutral-900 border-2 border-red-600 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.5)] overflow-hidden my-auto text-neutral-100">
        {/* Flashing Emergency Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 px-5 py-4 flex items-center justify-between text-white border-b border-red-500/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/20 animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">צבע אדום</span>
                <span className="text-xs uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded font-mono font-bold">
                  TZEVA ADOM
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                Alerta Roja Inmediata de Misiles y Proyectiles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors"
              title={soundEnabled ? 'Silenciar sirena' : 'Activar sonido de sirena'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-300" />}
            </button>
            <button
              onClick={onDismiss}
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Countdown & Zone Hero */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo para ingresar a refugio (Mamad)</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                <span className="text-sm font-sans font-medium text-neutral-400 ml-2">segundos</span>
              </div>
              <p className="text-xs text-neutral-400">
                Zona de alerta: <strong className="text-neutral-200">{alert.zone}</strong>
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-rose-500 transition-all duration-1000 ease-linear"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-sm font-bold text-white tabular-nums">
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Cities under attack */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold">
              <span className="flex items-center gap-1.5 text-rose-300">
                <MapPin className="w-3.5 h-3.5" />
                Localidades y Ciudades Afectadas
              </span>
              <span className="font-mono text-neutral-500">
                {alert.citiesEs.length} zonas en alerta
              </span>
            </div>
            
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
              <div className="flex flex-wrap gap-2">
                {alert.citiesEs.map((city, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-950/60 text-rose-200 border border-rose-800/80"
                  >
                    {city}
                    {alert.citiesHe[idx] && (
                      <span className="ml-1.5 text-[11px] text-rose-300/70 font-normal">
                        ({alert.citiesHe[idx]})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Official Emergency Instructions */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Instrucciones Oficiales de Vida (Pikud HaOref):</span>
            </div>
            <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
              <li>Ingresar de inmediato a la habitación reforzada (Mamad), refugio antibombas o escalera interna.</li>
              <li>Cerrar y trabar la puerta de acero blindada y la ventana hermética.</li>
              <li>Si está al aire libre: arrojarse al suelo, cubrirse la cabeza con las manos y mantenerse pegado al suelo.</li>
              <li><strong>Permanecer en el refugio al menos 10 minutos</strong> tras finalizar las sirenas (riesgo de metralla e impactos secundarios).</li>
            </ul>
          </div>

          {/* Official Source Badges & External links */}
          <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Fuente: <strong>{alert.source}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.tzevaadom.co.il/en/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium underline-offset-4 hover:underline"
              >
                <span>tzevaadom.co.il</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-neutral-700">|</span>
              <a
                href="https://t.me/s/tzevaadom"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium underline-offset-4 hover:underline"
              >
                <span>Telegram Oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              if (soundEnabled) onToggleSound();
            }}
            className="px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            {soundEnabled ? 'Silenciar Sirena' : 'Sirena Silenciada'}
          </button>
          <button
            onClick={onDismiss}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors"
          >
            Estoy en Refugio / Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
