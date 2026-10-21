import React from 'react';
import { ShieldCheck, Crosshair, Anchor, Eye, Radio, AlertTriangle } from 'lucide-react';

export const OperationalIntelView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-neutral-100">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Eye className="w-4 h-4" />
          <span>Teatro de Operaciones · Medio Oriente</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Arquitectura de Defensa Estratégica: EE.UU., Israel vs. Irán
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Evaluación técnica de las capacidades militares combinadas, sistemas de alerta temprana Tzeva Adom, radares espaciales y vectores de intercepción en tiempo real.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Pillar 1: Israeli Multi-Tier Defense */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Escudo Aéreo de Israel</h3>
          <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <li>
              <strong className="text-white">Arrow 3 & 4 (Hetz):</strong> Intercepción exoatmosférica contra misiles balísticos intercontinentales y de alcance intermedio fuera de la atmósfera.
            </li>
            <li>
              <strong className="text-white">David's Sling (Kela David):</strong> Interceptor Stunner de doble pulso para misiles de crucero y cohetes guiados pesados.
            </li>
            <li>
              <strong className="text-white">Iron Dome (Kipat Barzel):</strong> Defensa cercana contra cohetes tácticos de corto alcance y proyectiles de saturación.
            </li>
          </ul>
        </div>

        {/* Pillar 2: US CENTCOM & Naval BMD */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
            <Anchor className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Despliegue US CENTCOM</h3>
          <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <li>
              <strong className="text-white">Aegis BMD:</strong> Destructores Arleigh Burke con misiles SM-3 y SM-6 en el Mar Rojo y Golfo de Omán.
            </li>
            <li>
              <strong className="text-white">Batería THAAD:</strong> Sistema de defensa de área a gran altitud terminal operado por tropas estadounidenses en el Néguev.
            </li>
            <li>
              <strong className="text-white">Satelital SBIRS:</strong> Detección infrarroja instantánea de llamaradas de lanzamiento desde silos subterráneos.
            </li>
          </ul>
        </div>

        {/* Pillar 3: Iranian Arsenal & Proxy Vectors */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center">
            <Crosshair className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Vectores de la Guardia (IRGC)</h3>
          <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <li>
              <strong className="text-white">Fattah & Kheibar Shekan:</strong> Misiles balísticos de combustible sólido con ojivas de maniobra terminal (MaRV).
            </li>
            <li>
              <strong className="text-white">Emad & Ghadr:</strong> Misiles de medio alcance (1.700 km) con guía de precisión terminal.
            </li>
            <li>
              <strong className="text-white">Shahed-136 / Paveh:</strong> Enjambres de drones merodeadores y misiles de crucero de vuelo rasante para saturar radares.
            </li>
          </ul>
        </div>
      </div>

      {/* Flight & Radar Airspace Awareness Card */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              Estado de los Corredores Aéreos Regionales (NOTAM)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            RADAR ACTIVO
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Los radares civiles y militares mantienen monitoreo continuo de los corredores internacionales sobre Jordania, el Sinaí, Irak y el Golfo Pérsico. Durante alertas de Tzeva Adom, las trayectorias de aproximación al Aeropuerto Internacional Ben Gurion (TLV) son desviadas automáticamente a circuitos de espera sobre el Mar Mediterráneo.
        </p>
      </div>
    </div>
  );
};
