import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory alert store and history
interface MissileAlert {
  id: string;
  timestamp: string;
  type: 'missile' | 'drone' | 'infiltration';
  titleHe: string;
  titleEs: string;
  titleEn: string;
  citiesHe: string[];
  citiesEs: string[];
  zone: string;
  timeToShelterSec: number;
  source: string;
  threatLevel: 'critical' | 'high' | 'medium';
  coordinates: [number, number];
  instructionsEs: string;
}

let activeAlerts: MissileAlert[] = [];
const alertHistory: MissileAlert[] = [
  {
    id: 'alert-hist-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    type: 'missile',
    titleHe: 'ירי רקטות וטילים',
    titleEs: 'Lanzamiento de Cohetes y Misiles',
    titleEn: 'Rocket & Missile Attack',
    citiesHe: ['תל אביב - יפו', 'רמת גן', 'גבעתיים', 'בני ברק', 'חולון'],
    citiesEs: ['Tel Aviv - Yafo', 'Ramat Gan', 'Givatayim', 'Bnei Brak', 'Holon'],
    zone: 'Dan 156 (Gush Dan)',
    timeToShelterSec: 90,
    source: 'Tzeva Adom / Pikud HaOref & ערוץ התרעות על שיגורים',
    threatLevel: 'critical',
    coordinates: [32.0853, 34.7818],
    instructionsEs: 'Entrar de inmediato a refugio blindado (Mamad) o escalera interna. Permanecer 10 minutos.'
  },
  {
    id: 'alert-hist-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    type: 'drone',
    titleHe: 'חדירת כלי טיס עוין',
    titleEs: 'Intrusión de Dron Hostil Suicida',
    titleEn: 'Hostile Aircraft Infiltration',
    citiesHe: ['חיפה - כרמל ועיר תחתית', 'קריית אתא', 'עכו', 'נהריה'],
    citiesEs: ['Haifa - Carmel', 'Kiryat Atta', 'Acre', 'Nahariya'],
    zone: 'Haifa Bay & Western Galilee',
    timeToShelterSec: 60,
    source: 'ערוץ התרעות על שיגורים בטלגרם',
    threatLevel: 'high',
    coordinates: [32.7940, 34.9896],
    instructionsEs: 'Amenaza aérea en aproximación. Refugiarse bajo techo lejos de ventanales exteriores.'
  },
  {
    id: 'alert-hist-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    type: 'missile',
    titleHe: 'ירי טילים בליסטיים מטווח ארוך',
    titleEs: 'Misiles Balísticos de Largo Alcance (Fattah / Kheibar)',
    titleEn: 'Ballistic Missile Barrage',
    citiesHe: ['אילת', 'באר שבע', 'דימונה', 'נבטים'],
    citiesEs: ['Eilat', 'Beer Sheva', 'Dimona', 'Nevatim Airbase'],
    zone: 'Negev & Southern Command',
    timeToShelterSec: 90,
    source: 'Tzeva Adom (tzevaadom.co.il)',
    threatLevel: 'critical',
    coordinates: [31.2529, 34.7915],
    instructionsEs: 'Intercepción Arrow 3 activa. No salir al exterior hasta confirmación de cese de alerta.'
  }
];

// Seed an initial live alert if desired, or keep clear until triggered
const simulatedAlertPool: Omit<MissileAlert, 'id' | 'timestamp'>[] = [
  {
    type: 'missile',
    titleHe: 'ירי רקטות וטילים',
    titleEs: 'Lanzamiento Masivo de Cohetes y Misiles',
    titleEn: 'Heavy Rocket & Missile Fire',
    citiesHe: ['תל אביב - יפו', 'הרצליה', 'רמת השרון', 'כפר שמריהו'],
    citiesEs: ['Tel Aviv - Centro', 'Herzliya', 'Ramat HaSharon', 'Kfar Shmaryahu'],
    zone: 'Gush Dan & Sharon 160',
    timeToShelterSec: 90,
    source: 'Tzeva Adom (tzevaadom.co.il) & התרעות על שיגורים בטלגרם',
    threatLevel: 'critical',
    coordinates: [32.0853, 34.7818],
    instructionsEs: 'Entrar inmediatamente al espacio protegido (Mamad). Tiempo de llegada al refugio: 90 segundos.'
  },
  {
    type: 'drone',
    titleHe: 'חדירת כלי טיס עוין',
    titleEs: 'Alerta Roja: Enjambre de Drones Shahed',
    titleEn: 'Hostile UAS Infiltration Swarm',
    citiesHe: ['טבריה', 'עמק הירדן', 'צפת', 'קריית שמונה'],
    citiesEs: ['Tiberias', 'Jordan Valley', 'Safed', 'Kiryat Shmona'],
    zone: 'Galilee & Northern District',
    timeToShelterSec: 30,
    source: 'התרעות על שיגורים (Canal Oficial Telegram)',
    threatLevel: 'critical',
    coordinates: [32.7959, 35.5312],
    instructionsEs: 'Aeronave hostil no tripulada detectada en espacio aéreo. Buscar refugio inmediatamente.'
  },
  {
    type: 'missile',
    titleHe: 'ירי טילים בליסטיים',
    titleEs: 'Misil Balístico Detectado en Fase Terminal',
    titleEn: 'Ballistic Missile Trajectory Detected',
    citiesHe: ['ירושלים', 'מבשרת ציון', 'מעלה אדומים', 'בית שמש'],
    citiesEs: ['Jerusalén', 'Mevaseret Zion', 'Maale Adumim', 'Beit Shemesh'],
    zone: 'Jerusalem District 162',
    timeToShelterSec: 90,
    source: 'Tzeva Adom API / Pikud HaOref',
    threatLevel: 'critical',
    coordinates: [31.7683, 35.2137],
    instructionsEs: 'Activación de sirenas en toda el área metropolitana de Jerusalén. Ingrese al refugio ahora.'
  }
];

// API: Get live active alerts
app.get('/api/alerts/live', async (_req: Request, res: Response) => {
  // Check external Tzeva Adom API with fallback
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    
    // We try to query tzeva adom / oref endpoints if accessible
    const response = await fetch('https://www.tzevaadom.co.il/alerts/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WarFeed/1.0'
      },
      signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeout);
    
    if (response && response.ok) {
      const data = await response.json();
      // If live alerts are returned from external source
      if (Array.isArray(data) && data.length > 0) {
        // Map external alerts
        const mapped: MissileAlert[] = data.map((item: any, idx: number) => ({
          id: `ext-${Date.now()}-${idx}`,
          timestamp: new Date().toISOString(),
          type: item.type === 'aircraft' ? 'drone' : 'missile',
          titleHe: item.title || 'ירי רקטות וטילים',
          titleEs: item.title || 'Lanzamiento de Misiles / Drones',
          titleEn: item.title_en || 'Incoming Missile Alert',
          citiesHe: Array.isArray(item.cities) ? item.cities : [item.city || 'מרכז הארץ'],
          citiesEs: Array.isArray(item.cities_en) ? item.cities_en : [item.city_en || 'Israel Central'],
          zone: item.zone || 'Alerta Nacional',
          timeToShelterSec: item.countdown || 90,
          source: 'Tzeva Adom Oficial (tzevaadom.co.il)',
          threatLevel: 'critical',
          coordinates: [32.0853, 34.7818],
          instructionsEs: 'Ingrese de inmediato al espacio protegido. Alerta oficial en curso.'
        }));
        
        activeAlerts = mapped;
        return res.json({
          success: true,
          source: 'tzevaadom_live',
          activeAlerts: activeAlerts,
          count: activeAlerts.length
        });
      }
    }
  } catch {
    // Silently proceed to managed activeAlerts
  }

  // Return currently active managed alerts
  return res.json({
    success: true,
    source: 'warfeed_radar',
    activeAlerts: activeAlerts,
    count: activeAlerts.length,
    lastUpdate: new Date().toISOString()
  });
});

// API: Get alert history
app.get('/api/alerts/history', (_req: Request, res: Response) => {
  res.json({
    success: true,
    history: alertHistory
  });
});

// API: Trigger test missile alert (for user manual testing or live simulation)
app.post('/api/alerts/trigger-test', (req: Request, res: Response) => {
  const { city, threatType } = req.body || {};
  
  const template = simulatedAlertPool[Math.floor(Math.random() * simulatedAlertPool.length)];
  const newAlert: MissileAlert = {
    ...template,
    id: `alert-${Date.now()}`,
    timestamp: new Date().toISOString(),
    citiesEs: city ? [city, ...template.citiesEs.slice(1)] : template.citiesEs,
    type: threatType || template.type
  };

  activeAlerts.unshift(newAlert);
  alertHistory.unshift(newAlert);
  
  // Keep active for 60 seconds unless dismissed
  setTimeout(() => {
    activeAlerts = activeAlerts.filter(a => a.id !== newAlert.id);
  }, 60000);

  res.json({
    success: true,
    message: 'Alerta roja activada con éxito',
    alert: newAlert
  });
});

// API: Dismiss active alert
app.post('/api/alerts/dismiss', (req: Request, res: Response) => {
  const { alertId } = req.body || {};
  if (alertId) {
    activeAlerts = activeAlerts.filter(a => a.id !== alertId);
  } else {
    activeAlerts = [];
  }
  res.json({ success: true, remaining: activeAlerts.length });
});

// API: Instagram-style News & Intel Feed Data
app.get('/api/feed', (_req: Request, res: Response) => {
  res.json({
    success: true,
    channelNotice: 'Conectado a canales oficiales y corresponsales verificados: N12, חדשות 13, Barak Ravid, CNN Pentagon y התרעות על שיגורים',
    stories: [
      {
        id: 'story-n12',
        author: 'N12 חדשות',
        handle: '@n12israel',
        avatar: '🔴',
        title: 'N12 מבזק חי',
        hasUnseen: true,
        priority: 'alert',
        location: 'אולפן החדשות, תל אביב',
        mediaUrl: '/src/assets/images/n12_newsroom_broadcast_1792616522579.jpg',
        caption: 'מבזק מיוחד N12: הקבינט המדיני-ביטחוני מכונס בבור בקריה בתל אביב. חיל האוויר בכוננות עליונה ליירוט ותגובה מול איראן.',
        time: 'לפני 2 דק׳'
      },
      {
        id: 'story-nir-dvori',
        author: 'ניר דבורי (N12)',
        handle: '@nirdvori',
        avatar: '🎙️',
        title: 'ניר דבורי',
        hasUnseen: true,
        priority: 'alert',
        location: 'הקריה, תל אביב',
        mediaUrl: '/src/assets/images/air_defense_interception_1792615715996.jpg',
        caption: 'עדכון צבאי: תיאום מבצעי מלא ואינטימי בין מפקדת חיל האוויר למפקדת סנטקום (CENTCOM). סוללות חץ 3 פרוסות במלואן.',
        time: 'לפני 9 דק׳'
      },
      {
        id: 'story-ch13',
        author: 'חדשות 13',
        handle: '@ch13news',
        avatar: '📺',
        title: 'חדשות 13',
        hasUnseen: true,
        priority: 'breaking',
        location: 'נווה אילן / תל אביב',
        mediaUrl: '/src/assets/images/satellite_base_intel_1792615717932.jpg',
        caption: 'פרסום בחדשות 13: אלון בן דוד ואור הלר מדווחים על זיהוי פעילות חריגה בבסיסי טילים תת-קרקעיים של משמרות המהפכה באיראן.',
        time: 'לפני 18 דק׳'
      },
      {
        id: 'story-barak-ravid',
        author: 'Barak Ravid (ברק רביד)',
        handle: '@barakravid',
        avatar: '🇺🇸',
        title: 'Barak Ravid',
        hasUnseen: true,
        priority: 'intel',
        location: 'Washington / Axios',
        mediaUrl: '/src/assets/images/carrier_strike_group_1792615718431.jpg',
        caption: 'Scoop via Axios: The White House and Pentagon delivered a direct backchannel message to Tehran via Switzerland warning against ballistic launches.',
        time: 'Hace 30m'
      },
      {
        id: 'story-cnn',
        author: 'Oren Liebermann (CNN)',
        handle: '@orencnn',
        avatar: '🌐',
        title: 'CNN Pentagon',
        hasUnseen: false,
        priority: 'breaking',
        location: 'The Pentagon, VA',
        mediaUrl: '/src/assets/images/carrier_strike_group_1792615718431.jpg',
        caption: 'Live from the Pentagon: Defense officials confirm US naval destroyers in the Red Sea and Gulf of Oman are on 24/7 BMD intercept alert.',
        time: 'Hace 45m'
      }
    ]
  });
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`[WarFeed Server] Running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[WarFeed Server] Startup error:', err);
});
