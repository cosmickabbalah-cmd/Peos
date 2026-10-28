import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HeaderTopBar } from './components/HeaderTopBar';
import { InstagramFeed } from './components/InstagramFeed';
import { RedAlertModal } from './components/RedAlertModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CommentsModal } from './components/CommentsModal';
import { AlertRadarDrawer } from './components/AlertRadarDrawer';
import { OperationalIntelView } from './components/OperationalIntelView';
import { OfficialChannelsView } from './components/OfficialChannelsView';
import { INITIAL_POSTS, INITIAL_STORIES } from './data/mockFeed';
import type { FeedPost, MissileAlert, StoryItem, CommentItem, AppLanguage } from './types';
import { alertAudio } from './utils/soundEffects';
import { getNewsCanonicalKey, sortPostsByRecency } from './utils/newsManager';
import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
  triggerEmergencyPushNotification
} from './utils/pushNotifications';
import { UI_TRANSLATIONS } from './utils/translations';
import { ShieldCheck, Newspaper, Radio, Eye, Send, Filter, ShieldAlert, Bell, BellOff, X } from 'lucide-react';
import { AdUnit } from './components/AdUnit';

const DEFAULT_MONITORED_CITIES = ['Tel Aviv - Yafo', 'Jerusalén', 'Haifa'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'radar' | 'intel' | 'channels'>('feed');
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('warfeed_app_language');
      if (saved === 'es' || saved === 'en' || saved === 'fr' || saved === 'he') return saved;
    }
    return 'es';
  });
  const [posts, setPosts] = useState<FeedPost[]>(() => sortPostsByRecency(INITIAL_POSTS));
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [activeAlerts, setActiveAlerts] = useState<MissileAlert[]>([]);
  const [alertHistory, setAlertHistory] = useState<MissileAlert[]>([]);
  const [currentModalAlert, setCurrentModalAlert] = useState<MissileAlert | null>(null);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);
  const [commentsModalPost, setCommentsModalPost] = useState<FeedPost | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? getNotificationPermissionStatus() : 'default'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('warfeed_notifications_enabled');
      if (saved !== null) {
        return saved === 'true';
      }
      return true;
    }
    return true;
  });

  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(() => Date.now());

  // Floating Toast for instant visual feedback on notification bell toggle
  const [notificationToast, setNotificationToast] = useState<{
    enabled: boolean;
    message: string;
  } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotificationToast = (enabled: boolean, message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setNotificationToast({ enabled, message });
    toastTimeoutRef.current = setTimeout(() => {
      setNotificationToast(null);
    }, 3800);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // City Subscription Filter State
  const [cityFilterMode, setCityFilterMode] = useState<'all' | 'custom'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('warfeed_filter_mode');
      if (saved === 'all' || saved === 'custom') return saved;
    }
    return 'all';
  });

  const [monitoredCities, setMonitoredCities] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('warfeed_monitored_cities');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_MONITORED_CITIES;
  });

  const seenAlertIdsRef = useRef<Set<string>>(new Set());

  // Save city filters
  const handleChangeCityFilterMode = (mode: 'all' | 'custom') => {
    setCityFilterMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('warfeed_filter_mode', mode);
    }
    alertAudio.playLikeChime();
  };

  const handleAddMonitoredCity = (city: string) => {
    setMonitoredCities((prev) => {
      if (prev.includes(city)) return prev;
      const updated = [...prev, city];
      if (typeof window !== 'undefined') {
        localStorage.setItem('warfeed_monitored_cities', JSON.stringify(updated));
      }
      return updated;
    });
    alertAudio.playLikeChime();
  };

  const handleRemoveMonitoredCity = (city: string) => {
    setMonitoredCities((prev) => {
      const updated = prev.filter((c) => c !== city);
      if (typeof window !== 'undefined') {
        localStorage.setItem('warfeed_monitored_cities', JSON.stringify(updated));
      }
      return updated;
    });
    alertAudio.playLikeChime();
  };

  // Check if an alert matches the user's city subscription filter
  const doesAlertMatchFilter = useCallback(
    (alert: MissileAlert) => {
      if (cityFilterMode === 'all') return true;
      if (!monitoredCities.length) return true;

      return monitoredCities.some((userCity) => {
        const needle = userCity.toLowerCase().trim();
        return (
          alert.citiesEs.some(
            (c) => c.toLowerCase().includes(needle) || needle.includes(c.toLowerCase())
          ) ||
          alert.citiesHe.some((c) => c.includes(needle) || needle.includes(c)) ||
          alert.zone.toLowerCase().includes(needle)
        );
      });
    },
    [cityFilterMode, monitoredCities]
  );

  // Poll live alerts from backend server
  const fetchLiveAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts/live');
      if (!res.ok) return;
      const data = await res.json();
      if (data.activeAlerts && Array.isArray(data.activeAlerts)) {
        const sortedAlerts = [...data.activeAlerts].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setActiveAlerts(sortedAlerts);

        // Check if there is a new alert (most recent first)
        const newest = sortedAlerts[0];
        if (newest && !seenAlertIdsRef.current.has(newest.id)) {
          seenAlertIdsRef.current.add(newest.id);

          // Check if this alert matches the user's subscribed cities!
          const matches = doesAlertMatchFilter(newest);

          if (matches) {
            setCurrentModalAlert(newest);

            // Push Notification (only if notifications are enabled)
            if (notificationsEnabled && notificationPermission === 'granted') {
              triggerEmergencyPushNotification({
                title: `🚨 צבע אדום / ALERTA ROJA: ${newest.titleEs}`,
                body: `Misiles/Drones hacia ${newest.citiesEs.join(', ')}. Ingrese a refugio (Mamad). Tiempo: ${newest.timeToShelterSec}s. Fuente: ${newest.source}`
              });
            }

            // Siren sound
            if (soundEnabled) {
              alertAudio.startTzevaAdomSiren();
            }
          }
        }
      }
    } catch {
      // offline or server proxying
    }
  }, [soundEnabled, doesAlertMatchFilter, notificationsEnabled, notificationPermission]);

  // Fetch alert history (always newest first)
  const fetchAlertHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts/history');
      if (!res.ok) return;
      const data = await res.json();
      if (data.history && Array.isArray(data.history)) {
        const sortedHistory = [...data.history].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setAlertHistory(sortedHistory);
      }
    } catch {
      // fallback
    }
  }, []);

  // Fetch initial live feed and stories
  const fetchInitialFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/feed');
      if (!res.ok) return;
      const data = await res.json();
      if (data.stories && Array.isArray(data.stories) && data.stories.length > 0) {
        setStories(data.stories);
      }
      if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts((current) => {
          const seenKeys = new Set(current.map((p) => getNewsCanonicalKey(p)));
          const uniqueNew = (data.posts as FeedPost[]).filter(
            (p) => !seenKeys.has(getNewsCanonicalKey(p))
          );
          if (uniqueNew.length === 0) return current;
          return sortPostsByRecency([...uniqueNew, ...current]);
        });
      }
      setLastUpdatedTimestamp(Date.now());
    } catch {
      // offline fallback
    }
  }, []);

  useEffect(() => {
    fetchInitialFeed();
    fetchLiveAlerts();
    fetchAlertHistory();

    const interval = setInterval(() => {
      fetchLiveAlerts();
    }, 4500);

    return () => clearInterval(interval);
  }, [fetchInitialFeed, fetchLiveAlerts, fetchAlertHistory]);

  // Toggle notifications (Activate / Deactivate)
  const handleToggleNotifications = useCallback(() => {
    setNotificationsEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('warfeed_notifications_enabled', String(next));
      }

      // Play audio chime feedback immediately
      try {
        alertAudio.playLikeChime();
      } catch (e) {
        console.warn('Audio chime error:', e);
      }

      if (next) {
        showNotificationToast(
          true,
          appLanguage === 'he'
            ? 'התרעות בזמן אמת וצופרי אזעקה הופעלו'
            : appLanguage === 'es'
            ? 'Alertas en tiempo real y sirenas activadas'
            : appLanguage === 'fr'
            ? 'Alertes en temps réel et sirènes activées'
            : 'Real-time red alerts & siren warnings activated'
        );

        // Request browser push permission non-blockingly in background
        if (typeof window !== 'undefined' && 'Notification' in window) {
          requestNotificationPermission()
            .then((perm) => {
              setNotificationPermission(perm);
              if (perm === 'granted') {
                triggerEmergencyPushNotification({
                  title: '🛡️ WarFeed: Alertas Activadas',
                  body: 'Recibirás avisos inmediatos de misiles (Tzeva Adom) con tiempo de refugio.'
                });
              }
            })
            .catch(() => {});
        }
      } else {
        showNotificationToast(
          false,
          appLanguage === 'he'
            ? 'התרעות הושתקו (לחץ להפעלה מחדש)'
            : appLanguage === 'es'
            ? 'Alertas silenciadas (haz clic para reactivar)'
            : appLanguage === 'fr'
            ? 'Alertes désactivées (cliquez pour réactiver)'
            : 'Alerts muted (click to reactivate)'
        );
      }

      return next;
    });
  }, [appLanguage]);

  // Toggle sound
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (!next) {
        alertAudio.stopTzevaAdomSiren();
      } else {
        alertAudio.playLikeChime();
      }
      return next;
    });
  };


  // Dismiss modal
  const handleDismissModal = () => {
    alertAudio.stopTzevaAdomSiren();
    setCurrentModalAlert(null);
  };

  // Toggle Post Like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      })
    );
  };

  // Toggle Post Save
  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  // Add New Posts dynamically from refresh or 2-minute polling (strictly deduplicated and always sorted newest first)
  const handleAddNewPosts = useCallback((newPosts: FeedPost[]) => {
    setPosts((prev) => {
      const existingKeys = new Set([
        ...prev.map((p) => p.id.toLowerCase()),
        ...prev.map((p) => getNewsCanonicalKey(p))
      ]);
      const deduplicated = newPosts.filter(
        (p) => !existingKeys.has(p.id.toLowerCase()) && !existingKeys.has(getNewsCanonicalKey(p))
      );
      if (!deduplicated.length) return prev;
      return sortPostsByRecency([...deduplicated, ...prev]);
    });
  }, []);

  // Add Comment to Post
  const handleAddComment = (postId: string, comment: CommentItem) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
              comments: [comment, ...(post.comments || [])]
            }
          : post
      )
    );
  };

  const handleAddInlineComment = (postId: string, text: string) => {
    const newComment: CommentItem = {
      id: `c-inline-${Date.now()}`,
      user: 'Usuario Observador (Tú)',
      handle: 'usuario_civil',
      avatar: '🛡️',
      text,
      timestamp: 'Ahora mismo',
      likes: 0
    };
    handleAddComment(postId, newComment);
  };

  const handleChangeLanguage = (lang: AppLanguage) => {
    setAppLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('warfeed_app_language', lang);
    }
  };

  const t = UI_TRANSLATIONS[appLanguage];

  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-rose-500/30 selection:text-rose-200"
      dir={appLanguage === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Strict 3-Zone Header Top Bar */}
      <HeaderTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
        notificationPermission={notificationPermission}
        onRequestNotifications={handleToggleNotifications}
        activeAlertCount={activeAlerts.length}
        cityFilterMode={cityFilterMode}
        monitoredCitiesCount={monitoredCities.length}
        appLanguage={appLanguage}
        onChangeLanguage={handleChangeLanguage}
        lastUpdatedTimestamp={lastUpdatedTimestamp}
      />

      {/* Instant Floating Toast for Notification Bell & Alert Toggles */}
      {notificationToast && (
        <div
          role="status"
          className={`fixed top-18 right-3 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-300 animate-in fade-in slide-in-from-top-2 max-w-sm ${
            notificationToast.enabled
              ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100 shadow-emerald-950/50'
              : 'bg-neutral-900/95 border-neutral-700 text-neutral-200 shadow-black/60'
          }`}
        >
          <div className="shrink-0">
            {notificationToast.enabled ? (
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 border border-emerald-500 flex items-center justify-center text-emerald-300">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
                <BellOff className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold leading-tight">
              {notificationToast.enabled ? 'Notificaciones Activadas' : 'Notificaciones Pausadas'}
            </p>
            <p className="opacity-80 text-[11px] mt-0.5">
              {notificationToast.message}
            </p>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SUB-HEADER ALERT STATUS TICKER */}
      {activeAlerts.length > 0 ? (
        /* ACTIVE ALERT TICKER */
        <div
          onClick={() => setCurrentModalAlert(activeAlerts[0])}
          className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white px-3 sm:px-4 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer border-b border-red-500 shadow-md hover:brightness-110 transition-all min-h-[44px]"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span className="uppercase tracking-wider font-extrabold font-mono">
              צבע אדום / ALERTA:
            </span>
            <span className="truncate">
              {activeAlerts[0].titleEs} — {activeAlerts[0].citiesEs.join(', ')}
            </span>
          </div>
          <span className="whitespace-nowrap shrink-0 underline ml-2 font-mono">
            {activeAlerts[0].timeToShelterSec}s &rarr;
          </span>
        </div>
      ) : (
        /* EXPLICIT NO ALERTS (CIELO EN CALMA) TICKER */
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-3 sm:px-4 py-2 text-xs flex items-center justify-between min-h-[40px]">
          <div className="flex items-center gap-2 text-neutral-300 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate">
              {t.noAlertsTitle}
            </span>
            <span className="hidden md:inline text-neutral-400 truncate">
              · {t.noAlertsSubtitle}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('radar')}
              className="text-neutral-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <Filter className="w-3 h-3 text-rose-400" />
              <span>
                {cityFilterMode === 'all'
                  ? t.filterAllCountry
                  : t.filterCities(monitoredCities.length)}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP FIXED / DISPLAY BANNER (Leaderboard 728x90 Desktop, 320x50 Mobile)
          Placed strategically so it NEVER blocks the interactive radar, sirens or news stream,
          providing 100% constant impressions across all viewports. */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 w-full">
        <AdUnit
          variant="banner-leaderboard"
          slotId="header-leaderboard-gamertesto"
          category="gpuTests"
          customTitle="Canal Oficial GamerTesto: Tests y Rendimiento de Tarjetas Gráficas"
          customDescription="Benchmarks reales de GPUs de gama baja a bestias de gama alta · 7.17K Suscriptores y +440 Vídeos."
          customCta="Suscribirse en YouTube"
          customLink="https://www.youtube.com/@GamerTesto"
        />
      </div>

      {/* Main Content Area (Responsive padding for phone, tablet, and desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-4 sm:py-6 pb-28 md:pb-12">
        {activeTab === 'feed' && (
          <InstagramFeed
            stories={stories}
            posts={posts}
            appLanguage={appLanguage}
            onChangeLanguage={handleChangeLanguage}
            onOpenStory={(idx) => setStoryViewerIndex(idx)}
            onOpenComments={(post) => setCommentsModalPost(post)}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onAddInlineComment={handleAddInlineComment}
            onAddNewPosts={handleAddNewPosts}
          />
        )}

        {activeTab === 'radar' && (
          <AlertRadarDrawer
            activeAlerts={activeAlerts}
            alertHistory={alertHistory}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={handleToggleNotifications}
            notificationPermission={notificationPermission}
            onRequestNotifications={handleToggleNotifications}
            onSelectAlert={(alert) => {
              setCurrentModalAlert(alert);
              if (soundEnabled) alertAudio.startTzevaAdomSiren();
            }}
            cityFilterMode={cityFilterMode}
            onChangeCityFilterMode={handleChangeCityFilterMode}
            monitoredCities={monitoredCities}
            onAddMonitoredCity={handleAddMonitoredCity}
            onRemoveMonitoredCity={handleRemoveMonitoredCity}
          />
        )}

        {activeTab === 'intel' && <OperationalIntelView />}

        {activeTab === 'channels' && <OfficialChannelsView />}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar (Navigation Anchor with safe area) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 h-16 pb-safe grid grid-cols-4 items-center shadow-2xl">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[48px] transition-colors ${
            activeTab === 'feed' ? 'text-rose-500 font-bold' : 'text-neutral-400'
          }`}
        >
          <Newspaper className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t.navNews}</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`relative flex flex-col items-center justify-center gap-1 h-full min-h-[48px] transition-colors ${
            activeTab === 'radar' ? 'text-rose-500 font-bold' : 'text-neutral-400'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t.navSirens}</span>
          {activeAlerts.length > 0 && (
            <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-red-600 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('intel')}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[48px] transition-colors ${
            activeTab === 'intel' ? 'text-rose-500 font-bold' : 'text-neutral-400'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t.navIntel}</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[48px] transition-colors ${
            activeTab === 'channels' ? 'text-rose-500 font-bold' : 'text-neutral-400'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{t.navChannels}</span>
        </button>
      </nav>

      {/* Red Alert Emergency Modal Popup */}
      {currentModalAlert && (
        <RedAlertModal
          alert={currentModalAlert}
          onDismiss={handleDismissModal}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Full-screen Instagram Story Viewer Modal */}
      {storyViewerIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={storyViewerIndex}
          appLanguage={appLanguage}
          onClose={() => setStoryViewerIndex(null)}
        />
      )}

      {/* Instagram Comments Bottom Sheet Modal */}
      {commentsModalPost && (
        <CommentsModal
          post={commentsModalPost}
          onClose={() => setCommentsModalPost(null)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
