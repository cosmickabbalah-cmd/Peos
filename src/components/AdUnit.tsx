import React from 'react';
import { ExternalLink, Youtube, Play, Sparkles, TrendingUp } from 'lucide-react';

export type AdVariant =
  | 'banner-leaderboard'  // 728x90 desktop / 320x50 mobile top display banner
  | 'banner-sticky'       // Fixed top/bottom floating banner with dismiss option
  | 'native-feed'         // In-feed card blended seamlessly with news/alerts
  | 'action-box'          // 300x250 or 336x280 High visibility box next to Download / Export actions
  | 'sidebar-skyscraper'; // 300x600 or 160x600 lateral skyscraper

export interface AdUnitProps {
  variant: AdVariant;
  slotId?: string;
  adClient?: string;
  className?: string;
  category?: 'gpuTests' | 'benchmarks' | 'community' | 'latestVideo' | 'defense' | 'tech' | 'emergency' | 'general';
  customTitle?: string;
  customDescription?: string;
  customCta?: string;
  customLink?: string;
}

const GAMERTESTO_URL = 'https://www.youtube.com/@GamerTesto';
const GAMERTESTO_BANNER_IMG = '/assets/aistudio/image_ac3b2a8d.png';

// Presets focused on @GamerTesto YouTube channel (Testing all GPUs from low-end to high-end beasts)
const SPONSOR_PRESETS = {
  gpuTests: {
    advertiser: 'GamerTesto · YouTube Channel',
    channelHandle: '@GamerTesto',
    badge: 'Canal de YouTube',
    headline: 'GamerTesto: Test & Rendimiento de Tarjetas Gráficas de Gama Baja a Alta',
    description: '¿Quieres saber cuántos FPS da tu gráfica? Pruebas reales en Apex Legends, Warzone y los últimos juegos.',
    cta: 'Suscribirse al Canal',
    link: GAMERTESTO_URL,
    tag: '7.17K SUBS · 445 VÍDEOS',
    metric: 'Tests de GPUs Reales'
  },
  benchmarks: {
    advertiser: 'GamerTesto Official (@GamerTesto)',
    channelHandle: '@GamerTesto',
    badge: 'YouTube Gaming & Hardware',
    headline: 'Comparativas y Benchmarks de Tarjetas de Video en Vivo',
    description: 'Probamos desde las tarjetas gráficas más económicas hasta las bestias de última generación para PC Gaming.',
    cta: 'Ver en YouTube',
    link: GAMERTESTO_URL,
    tag: 'BENCHMARKS & FPS',
    metric: '445 Vídeos Publicados'
  },
  community: {
    advertiser: 'GamerTesto Hardware Labs',
    channelHandle: '@GamerTesto',
    badge: 'Hardware & Gaming',
    headline: 'Descubre el Rendimiento Real de tu Próxima Tarjeta Gráfica',
    description: 'No compres a ciegas: revisa pruebas de temperaturas, consumo eléctrico y FPS estables en el canal @GamerTesto.',
    cta: 'Ir a @GamerTesto',
    link: GAMERTESTO_URL,
    tag: 'PC GAMER COMUNIDAD',
    metric: '7.17K Suscriptores'
  },
  latestVideo: {
    advertiser: 'GamerTesto en YouTube',
    channelHandle: '@GamerTesto',
    badge: 'Canal Destacado',
    headline: 'Nuevos Análisis de Gráficas y Optimización de Juegos de PC',
    description: 'Aprende qué GPU rinde mejor según tu presupuesto con gameplays fluidos y recomendaciones de compra.',
    cta: 'Ver Canal de YouTube',
    link: GAMERTESTO_URL,
    tag: 'HARDWARE GAMING',
    metric: 'Gama Baja a Alta'
  },
  // Fallbacks mapped directly to GamerTesto variants
  defense: {
    advertiser: 'GamerTesto · Pruebas de GPUs',
    channelHandle: '@GamerTesto',
    badge: 'Canal Patrocinador',
    headline: 'GamerTesto: Test de Rendimiento de Tarjetas Gráficas',
    description: 'Pruebas exhaustivas de todas las tarjetas de video del mercado en juegos competitivos.',
    cta: 'Suscribirse en YouTube',
    link: GAMERTESTO_URL,
    tag: '7.17K SUBS',
    metric: 'GPU Testing'
  },
  tech: {
    advertiser: 'GamerTesto (@GamerTesto)',
    channelHandle: '@GamerTesto',
    badge: 'Hardware & Benchmarks',
    headline: '¿Qué Tarjeta Gráfica Comprar? Benchmarks con GamerTesto',
    description: 'Comparativas de FPS y consumo en directo desde gama baja hasta la más potente.',
    cta: 'Ver en YouTube',
    link: GAMERTESTO_URL,
    tag: 'PC HARDWARE',
    metric: '445 Vídeos'
  },
  emergency: {
    advertiser: 'GamerTesto YouTube',
    channelHandle: '@GamerTesto',
    badge: 'Patrocinador',
    headline: 'GamerTesto: Análisis y Test de Tarjetas Gráficas',
    description: 'Canal dedicado a probar el rendimiento real de cualquier tarjeta gráfica en PC.',
    cta: 'Visitar @GamerTesto',
    link: GAMERTESTO_URL,
    tag: 'GAMER TESTO',
    metric: 'YouTube Partner'
  },
  general: {
    advertiser: 'GamerTesto · YouTube Gaming',
    channelHandle: '@GamerTesto',
    badge: 'Patrocinador Oficial',
    headline: 'Canal Oficial GamerTesto: Pruebas de Tarjetas Gráficas de Gama Baja a Alta',
    description: 'Descubre el verdadero rendimiento de tu GPU en los títulos más exigentes.',
    cta: 'Suscribirse en YouTube',
    link: GAMERTESTO_URL,
    tag: '7.17K SUSCRIPTORES',
    metric: 'GamerTesto'
  }
};

export const AdUnit: React.FC<AdUnitProps> = ({
  variant,
  slotId = 'gamertesto-ad-slot',
  adClient = 'ca-pub-XXXXXXXXXXXXXX',
  className = '',
  category = 'gpuTests',
  customTitle,
  customDescription,
  customCta,
  customLink
}) => {
  const sponsor = SPONSOR_PRESETS[category] || SPONSOR_PRESETS.gpuTests;
  const title = customTitle || sponsor.headline;
  const description = customDescription || sponsor.description;
  const cta = customCta || sponsor.cta;
  const link = customLink || sponsor.link || GAMERTESTO_URL;

  // YouTube Branded Compliance Header
  const renderAdBadge = (label?: string) => (
    <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest font-mono pb-1.5">
      <div className="flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold flex items-center gap-1">
          <Youtube className="w-3 h-3 text-red-500 fill-red-500" />
          {label || sponsor.badge}
        </span>
        <span className="text-neutral-400 hidden sm:inline">· {sponsor.advertiser}</span>
      </div>
      <span className="text-[10px] text-neutral-500 font-mono">@GamerTesto</span>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /* 1. TOP DISPLAY / LEADERBOARD BANNER (728x90 on Desktop, 320x50 on Mobile)   */
  /* -------------------------------------------------------------------------- */
  if (variant === 'banner-leaderboard') {
    return (
      <div
        data-ad-placement="display-leaderboard"
        data-ad-slot={slotId}
        className={`w-full bg-neutral-900/95 border border-neutral-800 hover:border-red-600/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 relative overflow-hidden transition-all shadow-md ${className}`}
      >
        {renderAdBadge('Publicidad · GamerTesto YouTube')}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-3 rounded-xl border border-neutral-800/90 relative overflow-hidden">
          {/* Subtle background glow from red/orange accent */}
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-red-600/10 via-orange-600/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto relative z-10">
            {/* GamerTesto Avatar / Logo */}
            <a
              href={link}
              target="_blank"
              rel="noreferrer sponsored"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-red-500/60 shadow-md shrink-0 group block bg-neutral-950"
              title="Abrir canal @GamerTesto en YouTube"
            >
              <img
                src={GAMERTESTO_BANNER_IMG}
                alt="Canal de YouTube GamerTesto"
                className="w-full h-full object-cover object-left group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow" />
              </div>
            </a>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-red-300 font-extrabold px-1.5 py-0.5 rounded bg-red-950/80 border border-red-800">
                  {sponsor.tag}
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold hidden md:inline">
                  {sponsor.metric}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {title}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-300 truncate mt-0.5 max-w-xl">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end relative z-10">
            <a
              href={link}
              target="_blank"
              rel="noreferrer sponsored"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 min-h-[42px] whitespace-nowrap active:scale-95"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>{cta}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* 2. NATIVE IN-FEED AD UNIT (Blends into News / Earthquakes List Feed)        */
  /* -------------------------------------------------------------------------- */
  if (variant === 'native-feed') {
    return (
      <div
        data-ad-placement="in-feed-native"
        data-ad-slot={slotId}
        className={`p-4 sm:p-5 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-red-500/40 rounded-2xl sm:rounded-3xl shadow-lg transition-colors relative overflow-hidden ${className}`}
      >
        {renderAdBadge('Contenido Patrocinado · GamerTesto')}

        <div className="flex items-start gap-3 sm:gap-4 pt-1">
          {/* Channel Avatar / YouTube Icon */}
          <a
            href={link}
            target="_blank"
            rel="noreferrer sponsored"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-red-500/60 shadow-md shrink-0 block bg-neutral-950 relative group"
            title="Ir a @GamerTesto en YouTube"
          >
            <img
              src={GAMERTESTO_BANNER_IMG}
              alt="GamerTesto YouTube Banner"
              className="w-full h-full object-cover object-left group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 inset-x-0 bg-red-600/90 py-0.5 flex items-center justify-center">
              <Youtube className="w-3 h-3 text-white fill-white" />
            </div>
          </a>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-white text-sm sm:text-base">
                  {sponsor.advertiser}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950/80 text-red-300 font-mono font-bold border border-red-800">
                  YOUTUBE
                </span>
                <span className="text-neutral-400 text-xs hidden sm:inline">
                  · 7.17K suscriptores · 445 vídeos
                </span>
              </div>
            </div>

            {/* Headline */}
            <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
              {title}
            </h4>

            {/* Body */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {description}
            </p>

            {/* Channel Banner Preview Card */}
            <a
              href={link}
              target="_blank"
              rel="noreferrer sponsored"
              className="block rounded-xl overflow-hidden border border-neutral-800 hover:border-red-500/60 transition-all group mt-2 bg-neutral-950"
            >
              <div className="relative aspect-[21/7] sm:aspect-[24/7] w-full overflow-hidden bg-neutral-950">
                <img
                  src={GAMERTESTO_BANNER_IMG}
                  alt="GamerTesto YouTube Channel Header"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-white font-bold border border-neutral-700 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-400" />
                      Tests de Gráficas de Gama Baja a Alta
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-md group-hover:bg-red-500 transition-colors">
                    <Youtube className="w-3 h-3 fill-white" />
                    <span>Ver Canal</span>
                  </span>
                </div>
              </div>
            </a>

            {/* Rich Callout Bar */}
            <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-neutral-300 font-medium">
                  {sponsor.tag}: Benchmarks reales en juegos como Apex Legends y los últimos lanzamientos de PC.
                </span>
              </div>

              <a
                href={link}
                target="_blank"
                rel="noreferrer sponsored"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 min-h-[40px] shadow-md shadow-red-950/50"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                <span>{cta}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* 3. HIGH-VISIBILITY ACTION BLOCK (300x250 or 336x280 Rect near Actions)     */
  /* -------------------------------------------------------------------------- */
  if (variant === 'action-box') {
    return (
      <div
        data-ad-placement="action-block-rectangle"
        data-ad-slot={slotId}
        className={`w-full max-w-sm mx-auto p-4 rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-black border-2 border-red-500/50 shadow-2xl relative space-y-3 ${className}`}
      >
        {renderAdBadge('Publicidad GamerTesto (300x250)')}

        <div className="p-4 rounded-xl bg-neutral-950/95 border border-neutral-800 space-y-3 text-center">
          {/* Banner thumbnail preview */}
          <a
            href={link}
            target="_blank"
            rel="noreferrer sponsored"
            className="block relative rounded-xl overflow-hidden border border-neutral-800 group"
          >
            <div className="aspect-[16/7] w-full overflow-hidden bg-neutral-950">
              <img
                src={GAMERTESTO_BANNER_IMG}
                alt="GamerTesto Channel Banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </a>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider flex items-center justify-center gap-1">
              <Youtube className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              YOUTUBE · 7.17K SUBS · 445 VÍDEOS
            </span>
            <h4 className="text-sm font-bold text-white leading-tight">
              {title}
            </h4>
            <p className="text-xs text-neutral-300 leading-normal">
              {description}
            </p>
          </div>

          <a
            href={link}
            target="_blank"
            rel="noreferrer sponsored"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 min-h-[44px] active:scale-95"
          >
            <Youtube className="w-4 h-4 fill-white" />
            <span>{cta}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <div className="text-[10px] text-neutral-400 font-mono pt-1">
            Canal de YouTube: <strong className="text-white">youtube.com/@GamerTesto</strong>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* 4. SIDEBAR SKYSCRAPER (Lateral for Desktop)                                */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      data-ad-placement="sidebar-skyscraper"
      data-ad-slot={slotId}
      className={`p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 ${className}`}
    >
      {renderAdBadge('Banner GamerTesto')}

      <div className="space-y-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
        <a
          href={link}
          target="_blank"
          rel="noreferrer sponsored"
          className="block rounded-lg overflow-hidden border border-neutral-800"
        >
          <img
            src={GAMERTESTO_BANNER_IMG}
            alt="GamerTesto YouTube Banner"
            className="w-full object-cover"
          />
        </a>
        <span className="text-[10px] font-mono text-red-400 font-bold block">
          CANAL YOUTUBE @GAMERTESTO
        </span>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-neutral-400">{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer sponsored"
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5"
        >
          <Youtube className="w-3.5 h-3.5 fill-white" />
          <span>{cta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
