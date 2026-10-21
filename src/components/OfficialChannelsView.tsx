import React from 'react';
import { ExternalLink, ShieldAlert, Send, Radio, PhoneCall, CheckCircle, Globe } from 'lucide-react';

export const OfficialChannelsView: React.FC = () => {
  const channels = [
    {
      title: 'Mako חדשות ישראל (N12 News)',
      description: 'Portal principal de noticias de Israel y Canal 12. Cobertura en vivo con Nir Dvori y corresponsales en la Kirya.',
      url: 'https://www.mako.co.il/news-israel',
      badge: 'mako.co.il',
      badgeColor: 'border-red-800 bg-red-950 text-red-300',
      icon: '🔴'
    },
    {
      title: 'i24NEWS International (Tel Aviv)',
      description: 'Transmisión internacional en inglés y hebreo desde los estudios de Jaffa Port, con cobertura de defensa en tiempo real.',
      url: 'https://www.i24news.tv/en',
      badge: 'i24news.tv',
      badgeColor: 'border-sky-800 bg-sky-950 text-sky-300',
      icon: '🌐'
    },
    {
      title: 'חדשות 13 (Reshet 13 Israel)',
      description: 'Cadena de televisión de Israel con análisis militar especializado de Alon Ben-David y Or Heller.',
      url: 'https://13tv.co.il/',
      badge: '13tv.co.il',
      badgeColor: 'border-amber-800 bg-amber-950 text-amber-300',
      icon: '📺'
    },
    {
      title: 'CNN International (World & Pentagon)',
      description: 'Red global de noticias con corresponsales de defensa en el Pentágono y el Medio Oriente.',
      url: 'https://edition.cnn.com/',
      badge: 'edition.cnn.com',
      badgeColor: 'border-rose-800 bg-rose-950 text-rose-300',
      icon: '🇺🇸'
    },
    {
      title: 'Fox News (World & National Security)',
      description: 'Cobertura estadounidense de defensa, movimientos navales de la Quinta Flota y operaciones en el Comando Central.',
      url: 'https://www.foxnews.com/',
      badge: 'foxnews.com',
      badgeColor: 'border-blue-800 bg-blue-950 text-blue-300',
      icon: '🦅'
    },
    {
      title: 'Reuters (Middle East & World Wire)',
      description: 'Agencia de noticias internacional con despachos diplomáticos de primera línea y monitoreo de mercados estratégicos.',
      url: 'https://www.reuters.com/',
      badge: 'reuters.com',
      badgeColor: 'border-emerald-800 bg-emerald-950 text-emerald-300',
      icon: '⚡'
    },
    {
      title: 'Tzeva Adom (צבע אדום - Red Alert)',
      description: 'Plataforma oficial comunitaria de monitoreo y alerta temprana en tiempo real para todos los distritos de Israel.',
      url: 'https://www.tzevaadom.co.il/en/',
      badge: 'tzevaadom.co.il',
      badgeColor: 'border-rose-800 bg-rose-950 text-rose-300',
      icon: '🚨'
    },
    {
      title: 'Canal Telegram: התרעות על שיגורים',
      description: 'Canal oficial verificado en Telegram con notificaciones push instantáneas en milisegundos tras cada activación de sirena.',
      url: 'https://t.me/s/tzevaadom',
      badge: 't.me/tzevaadom',
      badgeColor: 'border-sky-800 bg-sky-950 text-sky-300',
      icon: '📢'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-neutral-100">
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Fuentes Periodísticas Solicitadas</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Portales de Noticias Verificados & Canales Oficiales
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Cada noticia mostrada en el feed proviene directamente de las coberturas de las principales agencias y cadenas televisivas de Israel y Estados Unidos:
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {channels.map((ch, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{ch.icon}</span>
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${ch.badgeColor}`}>
                  {ch.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">{ch.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{ch.description}</p>
            </div>

            <a
              href={ch.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <span>Abrir {ch.url.replace('https://', '')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Emergency Hotline Box */}
      <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-3">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <PhoneCall className="w-4 h-4" />
          <span>Líneas de Emergencia Inmediata en Israel</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Policía de Israel</span>
            <strong className="text-base font-mono text-white">100</strong>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Ambulancias (MDA)</span>
            <strong className="text-base font-mono text-white">101</strong>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Bomberos y Rescate</span>
            <strong className="text-base font-mono text-white">102</strong>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">Frente Doméstico</span>
            <strong className="text-base font-mono text-white">104</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
