import React, { useState } from 'react';
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
  Radio,
  Sparkles,
  TrendingUp,
  Award,
  ChevronDown,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import type { FeedPost, StoryItem } from '../types';
import { alertAudio } from '../utils/soundEffects';

interface InstagramFeedProps {
  stories: StoryItem[];
  posts: FeedPost[];
  onOpenStory: (index: number) => void;
  onOpenComments: (post: FeedPost) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddInlineComment: (postId: string, text: string) => void;
}

const OUTLET_FILTERS = [
  { id: 'all', label: 'Todos', icon: '🌐' },
  { id: 'mako', label: 'Mako (N12)', domain: 'mako.co.il', icon: '🔴' },
  { id: 'i24news', label: 'i24NEWS', domain: 'i24news.tv', icon: '🌐' },
  { id: 'ch13', label: 'Canal 13', domain: '13tv.co.il', icon: '📺' },
  { id: 'cnn', label: 'CNN', domain: 'cnn.com', icon: '🇺🇸' },
  { id: 'foxnews', label: 'Fox News', domain: 'foxnews.com', icon: '🦅' },
  { id: 'reuters', label: 'Reuters', domain: 'reuters.com', icon: '⚡' }
];

const TRENDING_TOPICS = [
  { tag: '#TzevaAdom', tweets: '84.2K posts' },
  { tag: '#IsraelIran', tweets: '142.9K posts' },
  { tag: '#CENTCOM', tweets: '45.1K posts' },
  { tag: '#Arrow3', tweets: '31.8K posts' },
  { tag: '#PikudHaOref', tweets: '29.4K posts' }
];

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  posts,
  onOpenComments,
  onToggleLike,
  onToggleSave
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showOriginalLang, setShowOriginalLang] = useState<Record<string, boolean>>({});
  const [showAnalysis, setShowAnalysis] = useState<Record<string, boolean>>({});
  const [repostedPosts, setRepostedPosts] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Filter posts based on selected news outlet
  const filteredPosts = posts.filter((post) => {
    if (selectedOutlet === 'all') return true;
    return post.sourceOutlet === selectedOutlet;
  });

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  const handleSelectOutlet = (outletId: string) => {
    alertAudio.playLikeChime();
    setSelectedOutlet(outletId);
    setVisibleCount(4); // Reset pagination on filter change
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    alertAudio.playLikeChime();
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 4, filteredPosts.length));
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
    <div className="space-y-4 max-w-2xl mx-auto text-neutral-100">
      {/* X (Twitter) Feed Header & Outlet Filter Bar */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 flex items-center justify-center font-bold text-white text-base">
              𝕏
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Feed de Noticias en Vivo</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                  TIEMPO REAL
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Información traducida al español con acceso directo a fuentes y texto original
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono text-neutral-400">
              Mostrando {displayedPosts.length} de {filteredPosts.length} despachos
            </span>
          </div>
        </div>

        {/* Trending Topics Ticker (X Style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-neutral-800/80">
          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>Tendencias:</span>
          </div>
          {TRENDING_TOPICS.map((topic) => (
            <span
              key={topic.tag}
              className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 text-xs font-medium border border-neutral-800 shrink-0 hover:border-neutral-700 hover:text-white cursor-pointer transition-colors"
            >
              <strong className="text-sky-400 font-semibold">{topic.tag}</strong>
              <span className="text-[10px] text-neutral-500 ml-1.5 hidden md:inline">{topic.tweets}</span>
            </span>
          ))}
        </div>

        {/* Outlet Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {OUTLET_FILTERS.map((outlet) => {
            const isSelected = selectedOutlet === outlet.id;
            return (
              <button
                key={outlet.id}
                onClick={() => handleSelectOutlet(outlet.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <span>{outlet.icon}</span>
                <span>{outlet.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* X (Twitter) Posts Stream */}
      <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl bg-neutral-900 overflow-hidden shadow-lg">
        {displayedPosts.map((post) => {
          const isOriginal = showOriginalLang[post.id];
          const isAnalysisOpen = showAnalysis[post.id];
          const isReposted = repostedPosts[post.id];

          return (
            <article
              key={post.id}
              className="p-4 sm:p-5 hover:bg-neutral-900/60 transition-colors flex gap-3 text-neutral-100"
            >
              {/* Left Column: Author Avatar */}
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center text-base font-bold shadow-sm">
                  {post.authorAvatar}
                </div>
              </div>

              {/* Right Column: Tweet Content & Actions */}
              <div className="flex-1 min-w-0 space-y-2.5">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs truncate">
                    <span className="font-bold text-white text-sm hover:underline cursor-pointer">
                      {post.authorName}
                    </span>

                    {/* Verified Badges */}
                    {post.badgeType === 'GOV' || post.badgeType === 'MILITARY' ? (
                      <span title="Medio o Entidad Gubernamental Verificada">
                        <Award className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      </span>
                    ) : (
                      <span title="Periodista Verificado">
                        <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                      </span>
                    )}

                    <span className="text-neutral-400 font-mono">
                      @{post.authorHandle}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-neutral-400">
                      {post.timestamp}
                    </span>
                  </div>

                  <button className="text-neutral-500 hover:text-neutral-300 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* News Headline (in Spanish by default) */}
                {post.headline && (
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                    {post.headline}
                  </h3>
                )}

                {/* Main Tweet Body: ALWAYS IN SPANISH BY DEFAULT */}
                <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed space-y-2">
                  <p className="whitespace-pre-line">
                    {isOriginal ? post.captionOrig : post.captionEs}
                  </p>
                </div>

                {/* Tactical Tags */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {post.tacticalTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-sky-400 hover:underline cursor-pointer font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Language Toggle Button (Always available at the bottom of the news) */}
                <div className="pt-1 flex items-center gap-3">
                  <button
                    onClick={() => {
                      alertAudio.playLikeChime();
                      setShowOriginalLang((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                      isOriginal
                        ? 'bg-rose-950/80 text-rose-200 border-rose-800'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-rose-400" />
                    <span>
                      {isOriginal
                        ? '🇪🇸 Volver a ver en Español'
                        : '🌐 Ver en idioma original (Hebreo / Inglés)'}
                    </span>
                  </button>

                  {/* AI / OSINT Tactical Context Button */}
                  <button
                    onClick={() =>
                      setShowAnalysis((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAnalysisOpen ? 'Ocultar Contexto' : 'Contexto Militar'}</span>
                  </button>
                </div>

                {/* Collapsible Military Intelligence Community Note */}
                {isAnalysisOpen && (
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                    <div className="flex items-center justify-between text-neutral-400 font-semibold">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Contexto Operacional & Inteligencia
                      </span>
                      {post.intelligenceMetrics?.alertZone && (
                        <span className="text-[11px] font-mono text-neutral-400">
                          {post.intelligenceMetrics.alertZone}
                        </span>
                      )}
                    </div>
                    {post.intelligenceMetrics?.weaponSystem && (
                      <p className="text-[11px] text-neutral-400">
                        Sistemas involucrados: <strong className="text-white">{post.intelligenceMetrics.weaponSystem}</strong>
                      </p>
                    )}
                    <p className="leading-relaxed">
                      {post.analysisEs}
                    </p>
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
                        </div>
                        <p className="text-white font-medium text-xs truncate group-hover:text-sky-300 transition-colors">
                          {post.headline || post.captionEs.slice(0, 80)}...
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-sky-400 shrink-0" />
                    </div>
                  </a>
                )}

                {/* X Interactive Action Bar */}
                <div className="pt-2 flex items-center justify-between max-w-md text-neutral-400 text-xs">
                  {/* Reply */}
                  <button
                    onClick={() => onOpenComments(post)}
                    className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group"
                    title="Responder / Ver comentarios"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-sky-500/10">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="tabular-nums">{post.commentsCount.toLocaleString()}</span>
                  </button>

                  {/* Repost (Retweet) */}
                  <button
                    onClick={() => handleRepost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors group ${
                      isReposted ? 'text-emerald-400' : 'hover:text-emerald-400'
                    }`}
                    title="Republicar"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-emerald-500/10">
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
                    className={`flex items-center gap-1.5 transition-colors group ${
                      post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                    }`}
                    title="Me gusta"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-rose-500/10">
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
                    className={`flex items-center gap-1.5 transition-colors group ${
                      post.isSaved ? 'text-amber-400' : 'hover:text-amber-400'
                    }`}
                    title="Guardar"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-amber-500/10">
                      <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-400' : ''}`} />
                    </div>
                  </button>

                  {/* Share Link */}
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 hover:text-sky-400 transition-colors group"
                    title="Copiar enlace"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-sky-500/10">
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
          );
        })}
      </div>

      {/* NEW: Load More News Button ("Ver más noticias") */}
      <div className="pt-2 pb-6 text-center">
        {visibleCount < filteredPosts.length ? (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 mx-auto active:scale-[0.98] group"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span>Consultando despachos recientes...</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-rose-400 group-hover:translate-y-0.5 transition-transform" />
                <span>Ver más noticias ({filteredPosts.length - visibleCount} despachos disponibles)</span>
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Has visto todos los despachos verificados de las últimas horas · El radar sigue monitoreando 24/7</span>
          </div>
        )}
      </div>
    </div>
  );
};
