import React from 'react';
import { ExternalLink, ShieldAlert, Send, Radio, PhoneCall, CheckCircle, Globe } from 'lucide-react';

export const OfficialChannelsView: React.FC = () => {
  const channels = [
    {
      title: 'StandWithUs (WhatsApp & Portal Web)',
      description: 'Organización internacional de educación y diplomacia pro-Israel con actualizaciones en vivo continuas a través de su canal oficial de WhatsApp y sitio web.',
      url: 'https://www.standwithus.com/',
      whatsappUrl: 'https://whatsapp.com/channel/0029Va7oX9aDjiOXw6o30N1o',
      badge: 'standwithus.com',
      badgeColor: 'border-emerald-700 bg-emerald-950 text-emerald-300',
      icon: '🇮🇱'
    },
    {
      title: 'Irán & Alertas Estratégicas (FDI & CENTCOM)',
      description: 'Monitoreo 24/7 de vectores balísticos, silos subterráneos del CGRI, actividad nuclear y coordinación defensiva de las baterías Hetz-3 y THAAD.',
      url: 'https://www.i24news.tv/en/tags/iran',
      badge: 'i24news.tv/iran',
      badgeColor: 'border-purple-800 bg-purple-950 text-purple-300',
      icon: '🇮🇷'
    },
    {
      title: 'Mako Noticias Israel (N12 News)',
      description: 'Portal principal de noticias de Israel y Canal 12. Cobertura en vivo con Nir Dvori y corresponsales en la Kirya.',
      url: 'https://www.mako.co.il/news-dailynews',
      badge: 'mako.co.il',
      badgeColor: 'border-red-800 bg-red-950 text-red-300',
      icon: '🔴'
    },
    {
      title: 'i24NEWS International (Tel Aviv)',
      description: 'Transmisión internacional en inglés y hebreo desde los estudios de Jaffa Port, con cobertura de defensa en tiempo real.',
      url: 'https://www.i24news.tv/en/news/israel',
      badge: 'i24news.tv',
      badgeColor: 'border-sky-800 bg-sky-950 text-sky-300',
      icon: '🌐'
    },
    {
      title: 'Canal 13 Noticias (Reshet 13 Israel)',
      description: 'Cadena de televisión de Israel con análisis militar especializado de Alon Ben-David y Or Heller.',
      url: 'https://13tv.co.il/news/news-flash/',
      badge: '13tv.co.il',
      badgeColor: 'border-amber-800 bg-amber-950 text-amber-300',
      icon: '📺'
    },
    {
      title: 'BBC News (Israel & Middle East)',
      description: 'Cobertura en directo de la BBC desde Jerusalén y Londres sobre acontecimientos políticos, sociedad y defensa de Israel.',
      url: 'https://www.bbc.com/news/topics/c207p54m43qt',
      badge: 'bbc.com',
      badgeColor: 'border-red-700 bg-red-950 text-red-300',
      icon: '🇬🇧'
    },
    {
      title: 'CNN International (Israel Desk)',
      description: 'Cobertura internacional desde Jerusalén y el Pentágono sobre el escudo de defensa aérea de Israel y coordinación aliada.',
      url: 'https://edition.cnn.com/middle-east',
      badge: 'edition.cnn.com',
      badgeColor: 'border-rose-800 bg-rose-950 text-rose-300',
      icon: '🇺🇸'
    },
    {
      title: 'Fox News (Israel National Security & Defense)',
      description: 'Reportes de seguridad centrados en la defensa del territorio israelí, radares navales Aegis y protección del espacio aéreo.',
      url: 'https://www.foxnews.com/category/world/world-regions/middle-east/israel',
      badge: 'foxnews.com',
      badgeColor: 'border-blue-800 bg-blue-950 text-blue-300',
      icon: '🦅'
    },
    {
      title: 'Reuters (Jerusalem & Tel Aviv Wire)',
      description: 'Despachos desde las mesas de Jerusalén y Tel Aviv sobre puertos israelíes, economía, política y resiliencia de Israel.',
      url: 'https://www.reuters.com/world/middle-east/',
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
      title: 'Canal Telegram: Alertas de Misiles (Tzeva Adom)',
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

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {ch.whatsappUrl && (
                <a
                  href={ch.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                >
                  <span>💬 Canal WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  ch.whatsappUrl
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                <span>{ch.whatsappUrl ? 'Sitio Web' : `Abrir ${ch.url.replace('https://', '')}`}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
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
