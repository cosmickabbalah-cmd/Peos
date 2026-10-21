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
import type { FeedPost, MissileAlert, StoryItem, CommentItem } from './types';
import { alertAudio } from './utils/soundEffects';
import {
  requestNotificationPermission,
  getNotificationPermissionStatus,
  triggerEmergencyPushNotification
} from './utils/pushNotifications';
import { ShieldCheck, Newspaper, Radio, Eye, Send, Filter, ShieldAlert } from 'lucide-react';

const DEFAULT_MONITORED_CITIES = ['Tel Aviv - Yafo', 'Jerusalén', 'Haifa'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'radar' | 'intel' | 'channels'>('feed');
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
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
        setActiveAlerts(data.activeAlerts);

        // Check if there is a new alert
        const newest = data.activeAlerts[0];
        if (newest && !seenAlertIdsRef.current.has(newest.id)) {
          seenAlertIdsRef.current.add(newest.id);

          // Check if this alert matches the user's subscribed cities!
          const matches = doesAlertMatchFilter(newest);

          if (matches) {
            setCurrentModalAlert(newest);

            // Push Notification
            triggerEmergencyPushNotification({
              title: `🚨 צבע אדום / ALERTA ROJA: ${newest.titleEs}`,
              body: `Misiles/Drones hacia ${newest.citiesEs.join(', ')}. Ingrese a refugio (Mamad). Tiempo: ${newest.timeToShelterSec}s. Fuente: ${newest.source}`
            });

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
  }, [soundEnabled, doesAlertMatchFilter]);

  // Fetch alert history
  const fetchAlertHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts/history');
      if (!res.ok) return;
      const data = await res.json();
      if (data.history && Array.isArray(data.history)) {
        setAlertHistory(data.history);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    fetchLiveAlerts();
    fetchAlertHistory();

    const interval = setInterval(() => {
      fetchLiveAlerts();
    }, 4500);

    return () => clearInterval(interval);
  }, [fetchLiveAlerts, fetchAlertHistory]);

  // Request browser push notification permission
  const handleRequestNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      alertAudio.playLikeChime();
      triggerEmergencyPushNotification({
        title: '🛡️ WarFeed: Notificaciones Activadas',
        body: 'Recibirás alertas inmediatas de misiles (Tzeva Adom) y Telegram con tiempo de refugio.'
      });
    }
  };

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

  // Trigger instant test missile alert
  const handleTriggerSimulatedAlert = async (city?: string, type?: 'missile' | 'drone') => {
    alertAudio.playRadarPing();
    const targetCity = city || (monitoredCities[0] || 'Tel Aviv - Yafo');

    try {
      const res = await fetch('/api/alerts/trigger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: targetCity, threatType: type || 'missile' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alert) {
          seenAlertIdsRef.current.add(data.alert.id);
          setActiveAlerts((prev) => [data.alert, ...prev]);
          setAlertHistory((prev) => [data.alert, ...prev]);

          // Test alert always opens modal
          setCurrentModalAlert(data.alert);

          // Push Notification
          triggerEmergencyPushNotification({
            title: `🚨 צבע אדום / ALERTA ROJA: ${data.alert.titleEs}`,
            body: `Alerta en ${data.alert.citiesEs.join(', ')}. Tiempo de ingreso a refugio: ${data.alert.timeToShelterSec} segundos.`
          });

          if (soundEnabled) {
            alertAudio.startTzevaAdomSiren();
          }
          return;
        }
      }
    } catch {
      // Client-side fallback if server offline
    }

    // Client fallback alert
    const fallbackAlert: MissileAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: type || 'missile',
      titleHe: 'ירי רקטות וטילים',
      titleEs: 'Lanzamiento Masivo de Cohetes y Misiles Balísticos',
      titleEn: 'Heavy Rocket & Ballistic Missile Barrage',
      citiesHe: ['תל אביב - יפו', 'רמת גן', 'בני ברק', 'גבעתיים'],
      citiesEs: targetCity ? [targetCity, 'Ramat Gan', 'Givatayim'] : ['Tel Aviv - Yafo', 'Ramat Gan', 'Bnei Brak', 'Givatayim'],
      zone: 'Gush Dan 156 (Distrito Central)',
      timeToShelterSec: 90,
      source: 'Tzeva Adom (tzevaadom.co.il) & ערוץ התרעות על שיגורים',
      threatLevel: 'critical',
      coordinates: [32.0853, 34.7818],
      instructionsEs: 'Entrar de inmediato a la habitación protegida (Mamad). Tiempo de llegada al refugio: 90 segundos.'
    };

    seenAlertIdsRef.current.add(fallbackAlert.id);
    setActiveAlerts((prev) => [fallbackAlert, ...prev]);
    setAlertHistory((prev) => [fallbackAlert, ...prev]);
    setCurrentModalAlert(fallbackAlert);

    triggerEmergencyPushNotification({
      title: `🚨 צבע אדום: ${fallbackAlert.titleEs}`,
      body: `Alerta hacia ${fallbackAlert.citiesEs.join(', ')}. Tiempo al refugio: ${fallbackAlert.timeToShelterSec}s.`
    });

    if (soundEnabled) {
      alertAudio.startTzevaAdomSiren();
    }
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-rose-500/30 selection:text-rose-200">
      {/* Strict 3-Zone Header Top Bar */}
      <HeaderTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerSimulatedAlert={() => handleTriggerSimulatedAlert()}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        notificationPermission={notificationPermission}
        onRequestNotifications={handleRequestNotifications}
        activeAlertCount={activeAlerts.length}
        cityFilterMode={cityFilterMode}
        monitoredCitiesCount={monitoredCities.length}
      />

      {/* SUB-HEADER ALERT STATUS TICKER */}
      {activeAlerts.length > 0 ? (
        /* ACTIVE ALERT TICKER */
        <div
          onClick={() => setCurrentModalAlert(activeAlerts[0])}
          className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer border-b border-red-500 shadow-md hover:brightness-110 transition-all"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span className="uppercase tracking-wider font-extrabold font-mono">
              צבע אדום / ALERTA EN CURSO:
            </span>
            <span className="truncate">
              {activeAlerts[0].titleEs} — {activeAlerts[0].citiesEs.join(', ')}
            </span>
          </div>
          <span className="whitespace-nowrap shrink-0 underline ml-2 font-mono">
            Ver Refugio ({activeAlerts[0].timeToShelterSec}s) &rarr;
          </span>
        </div>
      ) : (
        /* EXPLICIT NO ALERTS (CIELO EN CALMA) TICKER */
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-300 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">
              No hay alertas activas en este momento
            </span>
            <span className="hidden sm:inline text-neutral-400">
              · Cielos en calma (שקט) en todos los sectores monitoreados
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
                  ? 'Filtro: Todo el país'
                  : `Filtrando por ${monitoredCities.length} ciudades`}
              </span>
            </button>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <button
              onClick={() => handleTriggerSimulatedAlert()}
              className="text-rose-400 hover:text-rose-300 font-semibold hidden sm:inline"
            >
              Probar Simulacro
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'feed' && (
          <InstagramFeed
            stories={stories}
            posts={posts}
            onOpenStory={(idx) => setStoryViewerIndex(idx)}
            onOpenComments={(post) => setCommentsModalPost(post)}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onAddInlineComment={handleAddInlineComment}
          />
        )}

        {activeTab === 'radar' && (
          <AlertRadarDrawer
            activeAlerts={activeAlerts}
            alertHistory={alertHistory}
            onTriggerTestAlert={handleTriggerSimulatedAlert}
            notificationPermission={notificationPermission}
            onRequestNotifications={handleRequestNotifications}
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

      {/* Mobile Ergonomic Bottom Tab Bar (Navigation Anchor) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 h-16 grid grid-cols-4 items-center">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${
            activeTab === 'feed' ? 'text-rose-500 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Newspaper className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Noticias</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`relative flex flex-col items-center justify-center gap-1 h-full transition-colors ${
            activeTab === 'radar' ? 'text-rose-500 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Sirenas</span>
          {activeAlerts.length > 0 && (
            <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-red-600 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('intel')}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${
            activeTab === 'intel' ? 'text-rose-500 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Análisis</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${
            activeTab === 'channels' ? 'text-rose-500 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Canales</span>
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
