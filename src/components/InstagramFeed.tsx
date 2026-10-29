import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  Share,
  ShieldCheck,
  MoreHorizontal,
  ExternalLink,
  Check,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
  ChevronDown,
  Loader2,
  CheckCircle2,
  RotateCw,
  Clock,
  ArrowUp,
  Languages,
  Radio,
  Eye,
  CheckCircle,
  Search,
  X
} from 'lucide-react';
import type { FeedPost, StoryItem, AppLanguage, ChannelCheckReport } from '../types';
import { alertAudio } from '../utils/soundEffects';
import { fetchLatestNews, getNewsCanonicalKey, sortPostsByRecency } from '../utils/newsManager';
import { UI_TRANSLATIONS, getPostContent } from '../utils/translations';
import { AdUnit } from './AdUnit';
import { PWAInstallButton } from './PWAInstallButton';

interface InstagramFeedProps {
  stories: StoryItem[];
  posts: FeedPost[];
  appLanguage: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onOpenStory: (index: number) => void;
  onOpenComments: (post: FeedPost) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddInlineComment: (postId: string, text: string) => void;
  onAddNewPosts?: (newPosts: FeedPost[]) => void;
}

const OUTLET_FILTERS = [
  { id: 'all', label: 'Todos los Medios', labelEn: 'All Sources', labelFr: 'Toutes les sources', labelHe: 'כל המקורות', icon: '🌐' },
  { id: 'standwithus', label: 'StandWithUs', labelEn: 'StandWithUs', labelFr: 'StandWithUs', labelHe: 'StandWithUs', domain: 'standwithus.com', icon: '🇮🇱' },
  { id: 'mako', label: 'Mako Noticias (N12)', labelEn: 'Mako News (N12)', labelFr: 'Mako Actualités (N12)', labelHe: 'חדשות 12 (מאקו)', domain: 'mako.co.il', icon: '🔴' },
  { id: 'ch13', label: 'Canal 13 (Reshet 13)', labelEn: 'Channel 13 (Reshet 13)', labelFr: 'Chaîne 13 (Reshet 13)', labelHe: 'חדשות 13 (רשת 13)', domain: '13tv.co.il', icon: '📺' },
  { id: 'i24news', label: 'i24NEWS', labelEn: 'i24NEWS', labelFr: 'i24NEWS', labelHe: 'i24NEWS', domain: 'i24news.tv', icon: '🌐' },
  { id: 'bbc', label: 'BBC News', labelEn: 'BBC News', labelFr: 'BBC News', labelHe: 'BBC News', domain: 'bbc.com', icon: '🇬🇧' },
  { id: 'cnn', label: 'CNN', labelEn: 'CNN', labelFr: 'CNN', labelHe: 'CNN', domain: 'cnn.com', icon: '🇺🇸' },
  { id: 'foxnews', label: 'Fox News', labelEn: 'Fox News', labelFr: 'Fox News', labelHe: 'Fox News', domain: 'foxnews.com', icon: '🦅' },
  { id: 'reuters', label: 'Reuters', labelEn: 'Reuters', labelFr: 'Reuters', labelHe: 'רויטרס', domain: 'reuters.com', icon: '⚡' }
];

const ISRAEL_SEARCH_SUGGESTIONS = [
  { label: '🇮🇱 StandWithUs', query: 'StandWithUs' },
  { label: '💬 WhatsApp Oficial', query: 'WhatsApp' },
  { label: '🗳️ Elecciones 2026', query: 'Elecciones' },
  { label: '🏛️ Knesset / Política', query: 'Knesset' },
  { label: '💡 Startups & High-Tech', query: 'Tech' },
  { label: '📈 Economía & Shekel', query: 'Economía' },
  { label: '🛡️ Cúpula de Hierro', query: 'Cúpula' },
  { label: '🚀 Hetz 3 (Arrow)', query: 'Hetz' },
  { label: '🎙️ Nir Dvori (N12)', query: 'Nir Dvori' },
  { label: '📺 Alon Ben-David', query: 'Alon Ben-David' },
  { label: '🚨 Tzeva Adom', query: 'Tzeva Adom' },
  { label: '🕍 Jerusalén', query: 'Jerusalén' },
  { label: '🏙️ Tel Aviv', query: 'Tel Aviv' },
  { label: '⚓ Puertos y Haifa', query: 'Haifa' },
  { label: '⚽ Deportes y Sociedad', query: 'Sociedad' }
];

const TRENDING_TOPICS = [
  { tag: '#Israel', tweets: '210.4K' },
  { tag: '#TzevaAdom', tweets: '84.2K' },
  { tag: '#IronDome', tweets: '92.3K' },
  { tag: '#Arrow3', tweets: '31.8K' },
  { tag: '#PikudHaOref', tweets: '29.4K' }
];

export const ISRAEL_CATEGORIES = [
  { id: 'all', label: 'Todo Israel', icon: '🇮🇱' },
  { id: 'POLITICS', label: 'Política & Knesset', icon: '🗳️' },
  { id: 'TECH', label: 'High-Tech & Startups', icon: '💡' },
  { id: 'ECONOMY', label: 'Economía & Negocios', icon: '📈' },
  { id: 'SOCIETY', label: 'Sociedad & Salud', icon: '🏥' },
  { id: 'region-north', label: 'Región Norte (Galilea & Haifa)', icon: '🌲' },
  { id: 'region-center', label: 'Región Centro (Tel Aviv)', icon: '🏢' },
  { id: 'region-jerusalem', label: 'Jerusalén (Capital)', icon: '🕍' },
  { id: 'region-south', label: 'Región Sur (Néguev & Eilat)', icon: '🏜️' },
  { id: 'SPORTS', label: 'Cultura & Deportes', icon: '⚽' },
  { id: 'ADVOCACY', label: 'StandWithUs & Diplomacia', icon: '💬' },
  { id: 'DEFENSE', label: 'Defensa Civil / Pikud HaOref', icon: '🛡️' }
];

export function getCategoryBadgeLabel(category?: string, region?: string): string {
  if (region === 'north') return '🌲 Norte / Galilea';
  if (region === 'south') return '🏜️ Sur / Néguev';
  if (region === 'jerusalem') return '🕍 Jerusalén';
  if (region === 'center') return '🏢 Centro / Tel Aviv';

  switch (category) {
    case 'POLITICS': return '🗳️ Política & Knesset';
    case 'TECH': return '💡 High-Tech & AI';
    case 'ECONOMY': return '📈 Economía & Negocios';
    case 'SOCIETY': return '🏥 Sociedad & Salud';
    case 'SPORTS': return '⚽ Cultura & Deportes';
    case 'ADVOCACY': return '💬 StandWithUs & Diplomacia';
    case 'DEFENSE': return '🛡️ Defensa Civil';
    case 'INTERCEPTION': return '🚀 Defensa Aérea';
    case 'STRIKE': return '🚨 Operaciones';
    case 'NAVAL': return '⚓ Seguridad Costera';
    case 'CULTURE': return '🏛️ Cultura & Patrimonio';
    case 'DIPLOMACY': return '🌐 Diplomacia';
    case 'GEOINT': return '📡 Inteligencia';
    default: return '🇮🇱 Israel';
  }
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  posts,
  appLanguage,
  onChangeLanguage,
  onOpenComments,
  onToggleLike,
  onToggleSave,
  onAddNewPosts
}) => {
  const t = UI_TRANSLATIONS[appLanguage];

  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(15);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showOriginalLang, setShowOriginalLang] = useState<Record<string, boolean>>({});
  const [showAnalysis, setShowAnalysis] = useState<Record<string, boolean>>({});
  const [repostedPosts, setRepostedPosts] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Search filter evaluation across all localized content and metrics
  const matchesSearch = useCallback((post: FeedPost, query: string): boolean => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();

    if (post.headline && post.headline.toLowerCase().includes(q)) return true;
    if (post.headlineEs && post.headlineEs.toLowerCase().includes(q)) return true;
    if (post.headlineEn && post.headlineEn.toLowerCase().includes(q)) return true;
    if (post.headlineFr && post.headlineFr.toLowerCase().includes(q)) return true;
    if (post.headlineHe && post.headlineHe.toLowerCase().includes(q)) return true;

    if (post.captionEs && post.captionEs.toLowerCase().includes(q)) return true;
    if (post.captionEn && post.captionEn.toLowerCase().includes(q)) return true;
    if (post.captionFr && post.captionFr.toLowerCase().includes(q)) return true;
    if (post.captionHe && post.captionHe.toLowerCase().includes(q)) return true;
    if (post.captionOrig && post.captionOrig.toLowerCase().includes(q)) return true;

    if (post.authorName && post.authorName.toLowerCase().includes(q)) return true;
    if (post.authorHandle && post.authorHandle.toLowerCase().includes(q)) return true;
    if (post.location && post.location.toLowerCase().includes(q)) return true;

    if (post.tacticalTags && post.tacticalTags.some((tag) => tag.toLowerCase().includes(q))) return true;

    if (post.intelligenceMetrics) {
      if (post.intelligenceMetrics.alertZone && post.intelligenceMetrics.alertZone.toLowerCase().includes(q)) return true;
      if (post.intelligenceMetrics.intercepted && post.intelligenceMetrics.intercepted.toLowerCase().includes(q)) return true;
      if (post.intelligenceMetrics.weaponSystem && post.intelligenceMetrics.weaponSystem.toLowerCase().includes(q)) return true;
    }

    if (post.analysisEs && post.analysisEs.toLowerCase().includes(q)) return true;
    if (post.analysisEn && post.analysisEn.toLowerCase().includes(q)) return true;
    if (post.analysisFr && post.analysisFr.toLowerCase().includes(q)) return true;

    return false;
  }, []);

  // Real-time Refresh and 2-Minute Polling State
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(120); // 2 minutes (120s)
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(() => Date.now());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedPostIds, setHighlightedPostIds] = useState<Set<string>>(new Set());
  const [channelsReport, setChannelsReport] = useState<ChannelCheckReport[]>([]);
  const [showChannelAuditModal, setShowChannelAuditModal] = useState<boolean>(false);
  const [auditSummary, setAuditSummary] = useState<string>('7 canales oficiales verificados (Mako, Canal 13, i24NEWS, CNN, Fox News, Reuters, Tzeva Adom)');

  // Format last update as exact date and time (e.g. "25/10/2026 - 10:24:30")
  const formatLastUpdatedDateTime = (ts: number, lang: AppLanguage) => {
    const d = new Date(ts);
    const locale = lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : lang === 'he' ? 'he-IL' : 'es-ES';
    const dateStr = d.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return `${dateStr} - ${timeStr}`;
  };

  const formatOfficialTimestamp = (timestamp: string, lang: AppLanguage) => {
    if (lang === 'he') {
      return timestamp.replace('(Hora oficial)', '(שעה רשמית)');
    }
    if (lang === 'en') {
      return timestamp.replace('(Hora oficial)', '(Official time)');
    }
    if (lang === 'fr') {
      return timestamp.replace('(Hora oficial)', '(Heure officielle)');
    }
    return timestamp;
  };

  // Function to run the 2-minute periodic channel check
  const checkTwoMinuteUpdates = useCallback(async () => {
    try {
      const result = await fetchLatestNews(posts);
      setLastUpdatedTimestamp(Date.now());
      if (result.channelsReport && result.channelsReport.length > 0) {
        setChannelsReport(result.channelsReport);
      }
      if (result.auditSummary) {
        setAuditSummary(result.auditSummary);
      }

      // Check if ANY channel published genuinely new information
      if (result.hasNew && result.newPosts.length > 0) {
        const currentKeys = new Set([
          ...posts.map((p) => p.id.toLowerCase()),
          ...posts.map((p) => getNewsCanonicalKey(p))
        ]);

        const uniqueNew = result.newPosts.filter(
          (p) => !currentKeys.has(p.id.toLowerCase()) && !currentKeys.has(getNewsCanonicalKey(p))
        );

        if (uniqueNew.length > 0 && onAddNewPosts) {
          onAddNewPosts(uniqueNew);
          const newIds = new Set(uniqueNew.map((p) => p.id));
          setHighlightedPostIds(newIds);
          setTimeout(() => setHighlightedPostIds(new Set()), 10000);
          alertAudio.playLikeChime();
          const authorTitle = uniqueNew[0].authorName || 'Medio Oficial';
          setToastMessage(`✓ ${authorTitle}: Nueva noticia en tiempo real incorporada`);
          setTimeout(() => setToastMessage(null), 4500);
          setVisibleCount((prev) => Math.max(prev, 8));
        }
      } else {
        // "si no es nueva no haga nada"
        // Strict requirement: DO NOTHING TO THE FEED! Do not add or recycle any old posts.
        setHighlightedPostIds(new Set());
      }
    } catch (err) {
      console.warn('[Feed] Error checking for channel updates:', err);
    }
  }, [posts, onAddNewPosts]);

  // 2-Minute Auto-Check Countdown Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkTwoMinuteUpdates();
          return 120; // reset countdown to 2 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkTwoMinuteUpdates]);

  // Handle Manual Refresh Button Click
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    alertAudio.playLikeChime();

    try {
      const result = await fetchLatestNews(posts);
      setLastUpdatedTimestamp(Date.now());
      setCountdown(120); // reset 2-minute timer on manual refresh
      if (result.channelsReport && result.channelsReport.length > 0) {
        setChannelsReport(result.channelsReport);
      }
      if (result.auditSummary) {
        setAuditSummary(result.auditSummary);
      }

      if (result.hasNew && result.newPosts.length > 0) {
        const currentKeys = new Set([
          ...posts.map((p) => p.id.toLowerCase()),
          ...posts.map((p) => getNewsCanonicalKey(p))
        ]);

        const uniqueNew = result.newPosts.filter(
          (p) => !currentKeys.has(p.id.toLowerCase()) && !currentKeys.has(getNewsCanonicalKey(p))
        );

        if (uniqueNew.length > 0 && onAddNewPosts) {
          onAddNewPosts(uniqueNew);
          const newIds = new Set(uniqueNew.map((p) => p.id));
          setHighlightedPostIds(newIds);
          setTimeout(() => setHighlightedPostIds(new Set()), 10000);
          const authorTitle = uniqueNew[0].authorName || 'Medio Oficial';
          setToastMessage(`✓ ${authorTitle}: Nueva noticia incorporada al feed`);
          setVisibleCount((prev) => Math.max(prev, 8));
        } else {
          // If already in feed: do nothing
          setHighlightedPostIds(new Set());
          setToastMessage(t.noNewInfoDoNothing);
        }
      } else {
        // "si no es nueva no haga nada"
        // Strict requirement: DO NOTHING TO THE FEED!
        setHighlightedPostIds(new Set());
        setToastMessage(t.noNewInfoDoNothing);
      }
      setTimeout(() => setToastMessage(null), 4500);
    } finally {
      setTimeout(() => setIsRefreshing(false), 380);
    }
  };

  // Format countdown mm:ss
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // ALWAYS sort posts so that the most recent is strictly first
  const sortedAllPosts = sortPostsByRecency(posts);

  // Filter posts based on selected news outlet, category/region, AND search query
  const rawFiltered = sortedAllPosts.filter((post) => {
    const matchesOutlet = selectedOutlet === 'all' || post.sourceOutlet === selectedOutlet;
    if (!matchesOutlet) return false;

    if (selectedCategory !== 'all') {
      if (selectedCategory.startsWith('region-')) {
        const regionKey = selectedCategory.replace('region-', '');
        if (post.regionTag !== regionKey) return false;
      } else {
        if (post.threatCategory !== selectedCategory) return false;
      }
    }

    return matchesSearch(post, searchQuery);
  });

  // Explicitly sort filtered posts to guarantee most recent is on top for every outlet
  const filteredPosts = sortPostsByRecency(rawFiltered);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  const handleSelectOutlet = (outletId: string) => {
    alertAudio.playLikeChime();
    setSelectedOutlet(outletId);
    setVisibleCount(15);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    alertAudio.playLikeChime();
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 10, filteredPosts.length));
      setIsLoadingMore(false);
    }, 380);
  };

  const handleRepost = (postId: string) => {
    alertAudio.playLikeChime();
    setRepostedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShare = (postId: string) => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto text-neutral-100">
      {/* 0. PROMINENT TOP DATE AND TIME DISPLAY ("agrega arriba la fecha y hora de la última actualización") */}
      <section
        aria-label="Fecha y hora de la última actualización"
        className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-950/90 via-neutral-900 to-sky-950/90 border-2 border-emerald-500/80 rounded-2xl sm:rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center shrink-0 shadow-inner">
            <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                {appLanguage === 'he'
                  ? 'תאריך ושעה של העדכון האחרון'
                  : appLanguage === 'es'
                  ? 'ÚLTIMA ACTUALIZACIÓN EN VIVO'
                  : appLanguage === 'fr'
                  ? 'DERNIÈRE MISE À JOUR EN DIRECT'
                  : 'LIVE LAST UPDATE TIMESTAMP'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold">
                🟢 EN VIVO
              </span>
            </div>
            <p className="text-white font-mono font-bold text-xs sm:text-sm pt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>📅 {new Date(lastUpdatedTimestamp).toLocaleDateString(appLanguage === 'he' ? 'he-IL' : appLanguage === 'en' ? 'en-US' : appLanguage === 'fr' ? 'fr-FR' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="text-neutral-500">|</span>
              <span className="text-emerald-400 font-extrabold">🕒 {new Date(lastUpdatedTimestamp).toLocaleTimeString(appLanguage === 'he' ? 'he-IL' : appLanguage === 'en' ? 'en-US' : appLanguage === 'fr' ? 'fr-FR' : 'es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              <span className="text-[10px] text-neutral-400 font-normal">
                {appLanguage === 'he' ? '(שעה רשמית בישראל)' : '(Hora oficial de Israel y medios)'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-emerald-400"
            title="Sincronizar novedades ahora"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? (appLanguage === 'he' ? 'מעדכן...' : 'Actualizando...') : (appLanguage === 'he' ? 'רענן כעת' : 'Actualizar')}</span>
          </button>
        </div>
      </section>

      {/* 1. LARGE PROMINENT LANGUAGE SWITCHER BUTTON (Requested by user) */}
      <section
        aria-label="Selector de idioma / Language Switcher"
        className="p-3.5 sm:p-5 bg-gradient-to-b from-neutral-900 to-neutral-900/90 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-xl space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-rose-500" />
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
              {appLanguage === 'es' && 'Cambiar Idioma de las Noticias'}
              {appLanguage === 'en' && 'Change Live News Language'}
              {appLanguage === 'fr' && 'Changer la Langue des Actualités'}
              {appLanguage === 'he' && 'שינוי שפת המבזקים (עברית)'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {appLanguage.toUpperCase()}
          </span>
        </div>

        {/* 4 LARGE, TACTILE TOUCH BUTTONS FOR ES / EN / FR / HE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Spanish Button */}
          <button
            onClick={() => {
              alertAudio.playLikeChime();
              onChangeLanguage('es');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl sm:rounded-2xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 min-h-[54px] sm:min-h-[58px] active:scale-[0.98] border font-bold text-xs sm:text-sm shadow-md ${
              appLanguage === 'es'
                ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40 shadow-rose-950/60'
                : 'bg-neutral-950/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white hover:bg-neutral-950'
            }`}
          >
            <span className="text-xl sm:text-2xl leading-none">🇪🇸</span>
            <div className="text-center sm:text-left leading-tight">
              <span className="block font-extrabold">Español</span>
              <span className="text-[9px] sm:text-[10px] font-normal opacity-80 hidden xs:block">Predeterminado</span>
            </div>
          </button>

          {/* English Button */}
          <button
            onClick={() => {
              alertAudio.playLikeChime();
              onChangeLanguage('en');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl sm:rounded-2xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 min-h-[54px] sm:min-h-[58px] active:scale-[0.98] border font-bold text-xs sm:text-sm shadow-md ${
              appLanguage === 'en'
                ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40 shadow-rose-950/60'
                : 'bg-neutral-950/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white hover:bg-neutral-950'
            }`}
          >
            <span className="text-xl sm:text-2xl leading-none">🇬🇧</span>
            <div className="text-center sm:text-left leading-tight">
              <span className="block font-extrabold">English</span>
              <span className="text-[9px] sm:text-[10px] font-normal opacity-80 hidden xs:block">Live Feed</span>
            </div>
          </button>

          {/* French Button */}
          <button
            onClick={() => {
              alertAudio.playLikeChime();
              onChangeLanguage('fr');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl sm:rounded-2xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 min-h-[54px] sm:min-h-[58px] active:scale-[0.98] border font-bold text-xs sm:text-sm shadow-md ${
              appLanguage === 'fr'
                ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40 shadow-rose-950/60'
                : 'bg-neutral-950/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white hover:bg-neutral-950'
            }`}
          >
            <span className="text-xl sm:text-2xl leading-none">🇫🇷</span>
            <div className="text-center sm:text-left leading-tight">
              <span className="block font-extrabold">Français</span>
              <span className="text-[9px] sm:text-[10px] font-normal opacity-80 hidden xs:block">En direct</span>
            </div>
          </button>

          {/* Hebrew Button */}
          <button
            onClick={() => {
              alertAudio.playLikeChime();
              onChangeLanguage('he');
            }}
            className={`py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl sm:rounded-2xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 min-h-[54px] sm:min-h-[58px] active:scale-[0.98] border font-bold text-xs sm:text-sm shadow-md ${
              appLanguage === 'he'
                ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40 shadow-rose-950/60'
                : 'bg-neutral-950/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white hover:bg-neutral-950'
            }`}
          >
            <span className="text-xl sm:text-2xl leading-none">🇮🇱</span>
            <div className="text-center sm:text-left leading-tight">
              <span className="block font-extrabold">עברית</span>
              <span className="text-[9px] sm:text-[10px] font-normal opacity-80 hidden xs:block">חדשות רשמיות</span>
            </div>
          </button>
        </div>
      </section>

      {/* X (Twitter) Feed Header & Outlet Filter Bar */}
      <div className="p-3.5 sm:p-5 bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl space-y-3.5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-neutral-700 flex items-center justify-center font-bold text-white text-lg shadow-inner shrink-0">
              𝕏
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {t.feedTitle}
                </h2>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-700/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {t.realtimeBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                {t.feedSubtitle}
              </p>
            </div>
          </div>

          {/* Action Bar: Manual Refresh Button & 2-Minute Timer Display */}
          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* 2-Minute Auto-Check Countdown Indicator */}
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 font-mono shadow-inner min-h-[44px]"
              title="Comprobación automática cada 2 minutos en segundo plano"
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-neutral-400 hidden xs:inline">{t.autoCountdownPrefix}</span>
              <span className="text-emerald-400 font-bold tabular-nums">{formattedCountdown}</span>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 border min-h-[44px] ${
                isRefreshing
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700 cursor-wait'
                  : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-400 hover:shadow-sky-900/40'
              }`}
              title="Consultar y actualizar noticias inmediatamente"
            >
              <RotateCw className={`w-4 h-4 shrink-0 ${isRefreshing ? 'animate-spin text-white' : 'text-sky-100'}`} />
              <span className="whitespace-nowrap">{isRefreshing ? t.refreshingBtn : t.refreshBtn}</span>
            </button>
          </div>
        </div>

        {/* Status Line: Exact date and time of the last update */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 border-t border-neutral-800/60 pt-2 px-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-neutral-400">
              {t.lastUpdatedPrefix}
            </span>
            <span
              className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-400 bg-neutral-950 px-2 py-0.5 rounded border border-emerald-900/60 shadow-inner"
              title={`Última sincronización: ${formatLastUpdatedDateTime(lastUpdatedTimestamp, appLanguage)}`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="tabular-nums">
                {formatLastUpdatedDateTime(lastUpdatedTimestamp, appLanguage)}
              </span>
            </span>
          </div>
          <span className="font-mono text-neutral-400 text-right whitespace-nowrap pl-2">
            {t.dispatchesCount(displayedPosts.length, filteredPosts.length)}
          </span>
        </div>

        {/* Channel Verification Audit Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <Radio className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span className="text-white font-medium text-xs truncate">
              {auditSummary}
            </span>
          </div>
          <button
            onClick={() => setShowChannelAuditModal(true)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shrink-0 active:scale-95"
            title="Ver estado verificado de cada uno de los 7 canales"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.channelVerifyTitle}</span>
          </button>
        </div>

        {/* Transient feedback toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs px-2 py-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}

        {/* Real-Time Search & Specific Filter for Israel News */}
        <section aria-label={t.searchLabel} className="space-y-3 pt-2 border-t border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/80 text-[11px] font-extrabold text-rose-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{t.israelOnlyBadge}</span>
            </div>
            {searchQuery && (
              <span className="text-[11px] font-mono text-neutral-400">
                {t.searchResultsCount(filteredPosts.length, searchQuery)}
              </span>
            )}
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <div className="absolute left-3.5 sm:left-4 pointer-events-none text-neutral-400 flex items-center">
              <Search className="w-4 h-4 text-rose-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(8);
              }}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              className="w-full bg-neutral-950 border border-neutral-700 hover:border-neutral-500 focus:border-rose-500 rounded-xl sm:rounded-2xl pl-10 sm:pl-11 pr-10 py-3 sm:py-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-rose-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  alertAudio.playLikeChime();
                }}
                className="absolute right-3 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title={t.searchClear}
                aria-label={t.searchClear}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggested Israel Keywords Chips (One-tap filtering) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold text-neutral-400 shrink-0 uppercase tracking-wider mr-1">
                {t.searchSuggestionsLabel}
              </span>
              {ISRAEL_SEARCH_SUGGESTIONS.map((item) => {
                const isActive = searchQuery.toLowerCase().trim() === item.query.toLowerCase().trim();
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      alertAudio.playLikeChime();
                      setSearchQuery(isActive ? '' : item.query);
                      setVisibleCount(8);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-1 ring-rose-400'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Search Result Tag */}
          {searchQuery && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-950/90 border border-rose-500/40 text-xs shadow-inner animate-in fade-in">
              <span className="text-neutral-200 font-medium truncate">
                {t.searchResultsCount(filteredPosts.length, searchQuery)}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  alertAudio.playLikeChime();
                }}
                className="text-rose-400 hover:text-rose-300 font-bold underline ml-2 shrink-0 cursor-pointer text-xs"
              >
                {t.searchClear}
              </button>
            </div>
          )}
        </section>

        {/* Trending Topics Ticker (X Style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-neutral-800/80">
          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.trendingLabel}</span>
          </div>
          {TRENDING_TOPICS.map((topic) => (
            <span
              key={topic.tag}
              className="px-2.5 py-1 rounded-md bg-neutral-950 text-neutral-300 text-xs font-medium border border-neutral-800 shrink-0 hover:border-neutral-700 hover:text-white cursor-pointer transition-colors"
            >
              <strong className="text-sky-400 font-semibold">{topic.tag}</strong>
              <span className="text-[10px] text-neutral-500 ml-1.5 hidden md:inline">{topic.tweets}</span>
            </span>
          ))}
        </div>

        {/* Outlet Filter Tabs (Mobile & Tablet touch scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5">
          {OUTLET_FILTERS.map((outlet) => {
            const isSelected = selectedOutlet === outlet.id;
            const outletLabel =
              appLanguage === 'he' && (outlet as any).labelHe
                ? (outlet as any).labelHe
                : appLanguage === 'en' && outlet.labelEn
                ? outlet.labelEn
                : appLanguage === 'fr' && outlet.labelFr
                ? outlet.labelFr
                : outlet.label;

            return (
              <button
                key={outlet.id}
                onClick={() => handleSelectOutlet(outlet.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 border min-h-[40px] ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <span>{outlet.icon}</span>
                <span>{outletLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Category & Regional Filter Bar for Complete, Organized Israel Coverage ("Israel completo acomodado") */}
        <div className="space-y-2 pt-2.5 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🇮🇱</span>
                <span>{appLanguage === 'he' ? 'נושאים ואזורים בישראל' : 'Cobertura de Israel por Categoría & Región'}</span>
              </span>
              <span className="text-[10px] text-sky-400 font-mono font-semibold bg-sky-950/70 border border-sky-800/80 px-2 py-0.5 rounded-full">
                {selectedCategory === 'all' ? '12 Sectores' : '1 Seleccionado'}
              </span>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => {
                  alertAudio.playLikeChime();
                  setSelectedCategory('all');
                  setVisibleCount(15);
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
              >
                {appLanguage === 'he' ? 'הצג הכל' : 'Mostrar todo'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {ISRAEL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    alertAudio.playLikeChime();
                    setSelectedCategory(cat.id);
                    setVisibleCount(15);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 border min-h-[38px] active:scale-95 ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md font-bold ring-1 ring-rose-400'
                      : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PWA Phone Installation Banner for Chrome / Edge */}
      <PWAInstallButton appLanguage={appLanguage} variant="banner" />

      {/* X (Twitter) Posts Stream (Responsive for Mobile, Tablet, Desktop) */}
      {filteredPosts.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400 shadow-inner">
            <Search className="w-8 h-8 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t.searchNoResults(searchQuery)}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Prueba buscando por ciudades (Tel Aviv, Haifa, Jerusalén), defensas aéreas (Cúpula de Hierro, Hetz, THAAD), o restablece el filtro.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedOutlet('all');
                alertAudio.playLikeChime();
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {t.searchReset}
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl sm:rounded-3xl bg-neutral-900 overflow-hidden shadow-lg">
        {displayedPosts.map((post, postIndex) => {
          const isOriginal = !!showOriginalLang[post.id];
          const isAnalysisOpen = !!showAnalysis[post.id];
          const isReposted = !!repostedPosts[post.id];

          // Localized Content
          const content = getPostContent(post, appLanguage, isOriginal);

          return (
            <React.Fragment key={post.id}>
              {/* Strategic In-Feed Native Ad Unit (Inserted seamlessly into the list) - GamerTesto YouTube Channel */}
              {postIndex > 0 && postIndex % 3 === 0 && (
                <div className="p-3.5 sm:p-5 bg-neutral-950/80 border-y border-red-500/20">
                  <AdUnit
                    variant="native-feed"
                    slotId={`feed-native-gamertesto-${postIndex}`}
                    category={postIndex % 6 === 0 ? 'gpuTests' : 'benchmarks'}
                  />
                </div>
              )}

              <article
                className="p-3.5 sm:p-5 hover:bg-neutral-900/60 transition-colors flex gap-2.5 sm:gap-3.5 text-neutral-100"
              >
              {/* Left Column: Author Avatar */}
              <div className="shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center text-base sm:text-lg font-bold shadow-sm">
                  {post.authorAvatar}
                </div>
              </div>

              {/* Right Column: Tweet Content & Actions */}
              <div className="flex-1 min-w-0 space-y-2.5">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs truncate">
                    <span className="font-bold text-white text-sm sm:text-base hover:underline cursor-pointer">
                      {appLanguage === 'he'
                        ? ((post as any).authorNameHe || post.authorName)
                        : (post.authorName || '')
                            .replace(/חדשות 13/g, 'Noticias Canal 13 (Reshet 13)')
                            .replace(/חדשות 12|ערוץ 12|מאקו/g, 'Mako Noticias (N12)')
                            .replace(/ערוץ 13/g, 'Canal 13 Israel')
                            .replace(/[\u0590-\u05FF]+/g, '')
                            .trim() || post.authorName}
                    </span>

                    {/* Verified Badges */}
                    {post.badgeType === 'GOV' || post.badgeType === 'MILITARY' ? (
                      <span title="Medio o Entidad Oficial Verificada">
                        <Award className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      </span>
                    ) : (
                      <span title="Periodista / Medio Verificado">
                        <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                      </span>
                    )}

                    <span className="text-neutral-400 font-mono">
                      @{post.authorHandle}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span
                      className="text-neutral-300 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
                      title={appLanguage === 'he' ? "שעה מדויקת של פרסום באתר הרשמי" : "Hora exacta de publicación en el medio oficial"}
                    >
                      {formatOfficialTimestamp(post.timestamp, appLanguage)}
                    </span>

                    {/* Visible indicator that this is the most recent dispatch */}
                    {postIndex === 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-950/80 border border-rose-500/80 text-rose-300 flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        {appLanguage === 'he' ? 'הכי מעודכן' : appLanguage === 'es' ? 'MÁS RECIENTE' : appLanguage === 'fr' ? 'PLUS RÉCENT' : 'MOST RECENT'}
                      </span>
                    )}

                    {highlightedPostIds.has(post.id) && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 border border-emerald-500 text-emerald-300 animate-pulse flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        {t.newBadge}
                      </span>
                    )}
                  </div>

                  <button className="text-neutral-500 hover:text-neutral-300 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Category & Region Pill Badge */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-950 border border-neutral-700/80 text-rose-300 shadow-sm">
                    {getCategoryBadgeLabel(post.threatCategory, post.regionTag)}
                  </span>
                  {post.location && (
                    <span className="text-[10px] text-neutral-400 font-medium bg-neutral-950/60 px-2 py-0.5 rounded border border-neutral-800">
                      📍 {appLanguage !== 'he' && /[\u0590-\u05FF]/.test(post.location)
                            ? post.location.replace(/[\u0590-\u05FF]+/g, '').trim() || 'Israel'
                            : post.location}
                    </span>
                  )}
                  {post.whatsappUrl && (
                    <a
                      href={post.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 border border-emerald-600/70 text-emerald-300 hover:bg-emerald-900 transition-colors shadow-sm"
                    >
                      <span>💬 WhatsApp Oficial</span>
                    </a>
                  )}
                </div>

                {/* News Headline (in current language) */}
                {content.headline && (
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                    {content.headline}
                  </h3>
                )}

                {/* Main Tweet Body */}
                <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed space-y-2">
                  <p className="whitespace-pre-line">
                    {content.caption}
                  </p>
                </div>

                {/* Tactical Tags */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {post.tacticalTags.map((tag) => {
                    const displayTag = appLanguage !== 'he' && /[\u0590-\u05FF]/.test(tag)
                      ? '#' + tag.replace('#', '').replace(/[\u0590-\u05FF]+/g, '').trim()
                      : tag;
                    if (!displayTag || displayTag === '#') return null;
                    return (
                      <span
                        key={tag}
                        className="text-xs text-sky-400 hover:underline cursor-pointer font-medium"
                      >
                        {displayTag}
                      </span>
                    );
                  })}
                </div>

                {/* Language Toggle Button & Tactical Context Button */}
                <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Language Toggle Button */}
                  <button
                    onClick={() => {
                      alertAudio.playLikeChime();
                      setShowOriginalLang((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border min-h-[44px] active:scale-95 ${
                      isOriginal
                        ? 'bg-rose-950/90 text-rose-200 border-rose-700 shadow-sm'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      {isOriginal
                        ? t.backToLanguage(appLanguage)
                        : t.viewOriginal}
                    </span>
                  </button>

                  {/* AI / OSINT Tactical Context Button */}
                  <button
                    onClick={() =>
                      setShowAnalysis((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950/60 transition-colors min-h-[44px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{isAnalysisOpen ? t.hideContext : t.militaryContext}</span>
                  </button>
                </div>

                {/* Collapsible Military Intelligence Community Note */}
                {isAnalysisOpen && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                    <div className="flex items-center justify-between text-neutral-400 font-semibold">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t.contextHeader}
                      </span>
                      {post.intelligenceMetrics?.alertZone && (
                        <span className="text-[11px] font-mono text-neutral-400">
                          {post.intelligenceMetrics.alertZone}
                        </span>
                      )}
                    </div>
                    {post.intelligenceMetrics?.weaponSystem && (
                      <p className="text-[11px] text-neutral-400">
                        {t.systemsInvolved} <strong className="text-white">{post.intelligenceMetrics.weaponSystem}</strong>
                      </p>
                    )}
                    <p className="leading-relaxed">
                      {content.analysis}
                    </p>
                  </div>
                )}

                {/* StandWithUs WhatsApp Official Channel & Website Quick Access */}
                {(post.whatsappUrl || post.sourceOutlet === 'standwithus' || post.authorName.includes('StandWithUs')) && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="text-sm">💬</span>
                        <span>Canal Oficial de WhatsApp & Web de StandWithUs</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/60">
                        Canal Verificado
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={post.whatsappUrl || "https://whatsapp.com/channel/0029Va7oX9aDjiOXw6o30N1o"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <span>Unirse en WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={post.sourceUrl || "https://www.standwithus.com/"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        <span>Sitio Web Oficial</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* X Source Link Card (Clickable URL to official source) */}
                {post.sourceUrl && (
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                          <Globe className="w-3 h-3 text-sky-400" />
                          <span className="font-mono uppercase font-semibold">
                            {post.sourceUrl.replace('https://', '').replace('www.', '')}
                          </span>
                          <span className="text-neutral-600">·</span>
                          <span className="text-sky-400/90 font-mono text-[10px]">
                            {formatOfficialTimestamp(post.timestamp, appLanguage)}
                          </span>
                        </div>
                        <p className="text-white font-medium text-xs truncate group-hover:text-sky-300 transition-colors">
                          {content.headline || content.caption.slice(0, 80)}...
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-sky-400 shrink-0" />
                    </div>
                  </a>
                )}

                {/* X Interactive Action Bar (Touch Targets $\ge 44 \times 44$px for Mobile Thumbs) */}
                <div className="pt-2 flex items-center justify-between max-w-md text-neutral-400 text-xs">
                  {/* Reply */}
                  <button
                    onClick={() => onOpenComments(post)}
                    className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group min-h-[44px] min-w-[44px]"
                    title="Responder / Ver comentarios"
                  >
                    <div className="p-2 rounded-full group-hover:bg-sky-500/10">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="tabular-nums">{post.commentsCount.toLocaleString()}</span>
                  </button>

                  {/* Repost (Retweet) */}
                  <button
                    onClick={() => handleRepost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors group min-h-[44px] min-w-[44px] ${
                      isReposted ? 'text-emerald-400' : 'hover:text-emerald-400'
                    }`}
                    title="Republicar"
                  >
                    <div className="p-2 rounded-full group-hover:bg-emerald-500/10">
                      <Repeat2 className="w-4 h-4" />
                    </div>
                    <span className="tabular-nums">
                      {(post.sharesCount + (isReposted ? 1 : 0)).toLocaleString()}
                    </span>
                  </button>

                  {/* Like (Heart) */}
                  <button
                    onClick={() => {
                      alertAudio.playLikeChime();
                      onToggleLike(post.id);
                    }}
                    className={`flex items-center gap-1.5 transition-colors group min-h-[44px] min-w-[44px] ${
                      post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                    }`}
                    title="Me gusta"
                  >
                    <div className="p-2 rounded-full group-hover:bg-rose-500/10">
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                    </div>
                    <span className="tabular-nums">{post.likesCount.toLocaleString()}</span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() => {
                      alertAudio.playLikeChime();
                      onToggleSave(post.id);
                    }}
                    className={`flex items-center gap-1.5 transition-colors group min-h-[44px] min-w-[44px] ${
                      post.isSaved ? 'text-amber-400' : 'hover:text-amber-400'
                    }`}
                    title="Guardar"
                  >
                    <div className="p-2 rounded-full group-hover:bg-amber-500/10">
                      <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-400' : ''}`} />
                    </div>
                  </button>

                  {/* Share Link */}
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group min-h-[44px] min-w-[44px]"
                    title="Copiar enlace"
                  >
                    <div className="p-2 rounded-full group-hover:bg-sky-500/10">
                      {copiedPostId === post.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </article>
            </React.Fragment>
          );
        })}
        </div>
      )}

      {/* Load More News Button ("Ver más noticias") */}
      <div className="pt-2 pb-6 text-center">
        {visibleCount < filteredPosts.length ? (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 mx-auto active:scale-[0.98] min-h-[48px] group"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span>{t.loadingMore}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-rose-400 group-hover:translate-y-0.5 transition-transform" />
                <span>{t.loadMoreBtn(filteredPosts.length - visibleCount)}</span>
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.allCaughtUp}</span>
          </div>
        )}
      </div>

      {/* Channel-by-Channel Verification Modal */}
      {showChannelAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  {t.channelVerifyTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowChannelAuditModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.channelVerifySubtitle}. En cada ciclo de 2 minutos o al presionar "Actualizar", se evalúa cada canal de forma estricta. Si se detecta un despacho genuinamente nuevo, se incorpora al feed; si no es nuevo, no se realiza ninguna modificación.
            </p>

            {/* 7 Channels Breakdown List */}
            <div className="divide-y divide-neutral-800/80 border border-neutral-800 rounded-xl bg-neutral-950 overflow-hidden max-h-[300px] overflow-y-auto">
              {(channelsReport.length > 0 ? channelsReport : [
                { channelId: 'mako', channelName: 'Mako Noticias (N12 Israel)', icon: '🔴', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' },
                { channelId: 'ch13', channelName: 'Noticias Canal 13 (חדשות 13)', icon: '📺', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' },
                { channelId: 'i24news', channelName: 'i24NEWS International', icon: '🌐', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' },
                { channelId: 'cnn', channelName: 'CNN Breaking / Pentagon', icon: '🇺🇸', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' },
                { channelId: 'foxnews', channelName: 'Fox News Defense', icon: '🦅', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' },
                { channelId: 'reuters', channelName: 'Reuters Wire Service', icon: '⚡', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' },
                { channelId: 'telegram', channelName: 'Tzeva Adom / Home Front Command', icon: '🚨', hasNew: false, statusMessage: 'Al día · Sin noticias nuevas' }
              ]).map((ch) => (
                <div key={ch.channelId} className="p-3 flex items-center justify-between text-xs hover:bg-neutral-900/40 transition-colors">
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span className="text-base sm:text-lg shrink-0">{ch.icon}</span>
                    <div className="truncate">
                      <span className="font-semibold text-white block truncate">{ch.channelName}</span>
                      <span className="text-[10px] text-neutral-400 truncate block">{ch.statusMessage}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      ch.hasNew
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {ch.hasNew ? 'NUEVA' : 'AL DÍA'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-400 text-center sm:text-left">
                Última revisión: {formatLastUpdatedDateTime(lastUpdatedTimestamp, appLanguage)}
              </span>
              <button
                onClick={() => {
                  setShowChannelAuditModal(false);
                  handleManualRefresh();
                }}
                disabled={isRefreshing}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Verificar canales ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
