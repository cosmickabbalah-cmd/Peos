/**
 * Comprehensive Multilingual News Translator
 * Translates news headlines, dispatches, and military/geopolitical intelligence
 * among Spanish (es), French (fr), English (en), and Hebrew (he).
 */

import type { AppLanguage } from '../types';

// Common words and phrase dictionary for instant deterministic translation
const DICTIONARY: Record<string, { es: string; fr: string; en: string; he: string }> = {
  // Common news verbs and phrases
  'breaking news': { es: 'Última hora', fr: 'Dernière minute', en: 'Breaking news', he: 'מבזק מיוחד' },
  'live updates': { es: 'Actualizaciones en vivo', fr: 'Mises à jour en direct', en: 'Live updates', he: 'עדכונים שוטפים' },
  'live blog': { es: 'Minuto a minuto en vivo', fr: 'Direct en continu', en: 'Live blog', he: 'בלוג חי' },
  'air defense': { es: 'defensa aérea', fr: 'défense aérienne', en: 'air defense', he: 'הגנה אווירית' },
  'air strike': { es: 'ataque aéreo', fr: 'frappe aérienne', en: 'air strike', he: 'תקיפה אווירית' },
  'airstrike': { es: 'ataque aéreo', fr: 'frappe aérienne', en: 'airstrike', he: 'תקיפה אווירית' },
  'ballistic missile': { es: 'misil balístico', fr: 'missile balistique', en: 'ballistic missile', he: 'טיל בליסטי' },
  'ballistic missiles': { es: 'misiles balísticos', fr: 'missiles balistiques', en: 'ballistic missiles', he: 'טילים בליסטיים' },
  'cruise missile': { es: 'misil de crucero', fr: 'missile de croisière', en: 'cruise missile', he: 'טיל שיוט' },
  'cruise missiles': { es: 'misiles de crucero', fr: 'missiles de croisière', en: 'cruise missiles', he: 'טילי שיוט' },
  'drone infiltration': { es: 'infiltración de drones', fr: 'infiltration de drones', en: 'drone infiltration', he: 'חדירת כלי טיס עוין' },
  'drone': { es: 'dron', fr: 'drone', en: 'drone', he: 'כטב\"ם' },
  'drones': { es: 'drones', fr: 'drones', en: 'drones', he: 'כטב\"מים' },
  'interception': { es: 'intercepción', fr: 'interception', en: 'interception', he: 'יירוט' },
  'intercepted': { es: 'interceptado', fr: 'intercepté', en: 'intercepted', he: 'יורט' },
  'intercepts': { es: 'intercepta', fr: 'intercepte', en: 'intercepts', he: 'מיירט' },
  'red alert': { es: 'Alerta Roja', fr: 'Alerte Rouge', en: 'Red Alert', he: 'צבע אדום' },
  'sirens': { es: 'sirenas', fr: 'sirènes', en: 'sirens', he: 'אזעקות' },
  'siren sounding': { es: 'sirenas activadas', fr: 'sirènes déclenchées', en: 'sirens sounding', he: 'אזעקות מופעלות' },
  'rocket fire': { es: 'disparo de cohetes', fr: 'tirs de roquettes', en: 'rocket fire', he: 'ירי רקטות' },
  'rockets': { es: 'cohetes', fr: 'roquettes', en: 'rockets', he: 'רקטות' },
  'security cabinet': { es: 'gabinete de seguridad', fr: 'cabinet de sécurité', en: 'security cabinet', he: 'הקבינט הביטחוני' },
  'military base': { es: 'base militar', fr: 'base militaire', en: 'military base', he: 'בסיס צבאי' },
  'border': { es: 'frontera', fr: 'frontière', en: 'border', he: 'גבול' },
  'northern border': { es: 'frontera norte', fr: 'frontière nord', en: 'northern border', he: 'גבול הצפון' },
  'southern border': { es: 'frontera sur', fr: 'frontière sud', en: 'southern border', he: 'גבול הדרום' },
  'home front command': { es: 'Comando del Frente Doméstico', fr: 'Commandement du front intérieur', en: 'Home Front Command', he: 'פיקוד העורף' },
  'defense minister': { es: 'ministro de defensa', fr: 'ministre de la défense', en: 'defense minister', he: 'שר הביטחון' },
  'prime minister': { es: 'primer ministro', fr: 'premier ministre', en: 'prime minister', he: 'ראש הממשלה' },
  'foreign ministry': { es: 'ministerio de exteriores', fr: 'ministère des affaires étrangères', en: 'foreign ministry', he: 'משרד החוץ' },
  'white house': { es: 'Casa Blanca', fr: 'Maison Blanche', en: 'White House', he: 'הבית הלבן' },
  'pentagon': { es: 'Pentágono', fr: 'Pentagone', en: 'Pentagon', he: 'הפנטגון' },
  'centcom': { es: 'Comando Central (CENTCOM)', fr: 'Commandement central (CENTCOM)', en: 'CENTCOM', he: 'סנטקום' },
  'united states': { es: 'Estados Unidos', fr: 'États-Unis', en: 'United States', he: 'ארצות הברית' },
  'us': { es: 'EE.UU.', fr: 'États-Unis', en: 'US', he: 'ארה\"ב' },
  'israel': { es: 'Israel', fr: 'Israël', en: 'Israel', he: 'ישראל' },
  'iran': { es: 'Irán', fr: 'Iran', en: 'Iran', he: 'איראן' },
  'tehran': { es: 'Teherán', fr: 'Téhéran', en: 'Tehran', he: 'טהראן' },
  'lebanon': { es: 'Líbano', fr: 'Liban', en: 'Lebanon', he: 'לבנון' },
  'beirut': { es: 'Beirut', fr: 'Beyrouth', en: 'Beirut', he: 'ביירות' },
  'gaza': { es: 'Gaza', fr: 'Gaza', en: 'Gaza', he: 'עזה' },
  'syria': { es: 'Siria', fr: 'Syrie', en: 'Syria', he: 'סוריה' },
  'damascus': { es: 'Damasco', fr: 'Damas', en: 'Damascus', he: 'דמשק' },
  'yemen': { es: 'Yemen', fr: 'Yémen', en: 'Yemen', he: 'תימן' },
  'houthis': { es: 'hutíes', fr: 'houthis', en: 'Houthis', he: 'חות\'ים' },
  'hezbollah': { es: 'Hezbolá', fr: 'Hezbollah', en: 'Hezbollah', he: 'חיזבאללה' },
  'red sea': { es: 'Mar Rojo', fr: 'Mer Rouge', en: 'Red Sea', he: 'הים האדום' },
  'persian gulf': { es: 'Golfo Pérsico', fr: 'Golfe Persique', en: 'Persian Gulf', he: 'המפרץ הפרסי' },
  'gulf of oman': { es: 'Golfo de Omán', fr: 'Golfe d\'Oman', en: 'Gulf of Oman', he: 'מפרץ עומאן' },
  'tel aviv': { es: 'Tel Aviv', fr: 'Tel-Aviv', en: 'Tel Aviv', he: 'תל אביב' },
  'jerusalem': { es: 'Jerusalén', fr: 'Jérusalem', en: 'Jerusalem', he: 'ירושלים' },
  'haifa': { es: 'Haifa', fr: 'Haïfa', en: 'Haifa', he: 'חיפה' },
  'idf': { es: 'FDI (Ejército de Israel)', fr: 'Tsahal', en: 'IDF', he: 'צה\"ל' },
  'iaf': { es: 'Fuerza Aérea Israelí', fr: 'Armée de l\'air israélienne', en: 'IAF', he: 'חיל האוויר' },
  'air force': { es: 'fuerza aérea', fr: 'armée de l\'air', en: 'air force', he: 'חיל האוויר' },
  'iron dome': { es: 'Cúpula de Hierro', fr: 'Dôme de fer', en: 'Iron Dome', he: 'כיפת ברזל' },
  'arrow 3': { es: 'Arrow 3 (Hetz 3)', fr: 'Arrow 3', en: 'Arrow 3', he: 'חץ 3' },
  'david\'s sling': { es: 'Honda de David', fr: 'Fronde de David', en: 'David\'s Sling', he: 'קלע דוד' },
  'shelter': { es: 'refugio', fr: 'abri', en: 'shelter', he: 'מרחב מוגן' },
  'safe room': { es: 'habitación blindada (Mamad)', fr: 'abri protégé (Mamad)', en: 'safe room (Mamad)', he: 'ממ\"ד' },
  'confirmed': { es: 'confirmado', fr: 'confirmé', en: 'confirmed', he: 'אושר' },
  'reported': { es: 'reportado', fr: 'signalé', en: 'reported', he: 'דווח' },
  'reports': { es: 'reporta', fr: 'rapporte', en: 'reports', he: 'מדווח' },
  'threatens': { es: 'amenaza con', fr: 'menace de', en: 'threatens', he: 'מאיים' },
  'warns': { es: 'advierte', fr: 'met en garde', en: 'warns', he: 'מזהיר' },
  'high alert': { es: 'máxima alerta', fr: 'alerte maximale', en: 'high alert', he: 'כוננות עליונה' },
  'ceasefire': { es: 'alto el fuego', fr: 'cessez-le-feu', en: 'ceasefire', he: 'הפסקת אש' },
  'diplomatic': { es: 'diplomático', fr: 'diplomatique', en: 'diplomatic', he: 'דיפלומטי' },
  'statement': { es: 'comunicado oficial', fr: 'déclaration officielle', en: 'statement', he: 'הודעה רשמית' },
  'defense': { es: 'defensa', fr: 'défense', en: 'defense', he: 'הגנה' },
  'security': { es: 'seguridad', fr: 'sécurité', en: 'security', he: 'ביטחון' },
  'urgent': { es: 'URGENTE', fr: 'URGENT', en: 'URGENT', he: 'דחוף' }
};

// Hebrew keyword maps
const HEBREW_TO_TARGET: { regex: RegExp; es: string; fr: string; en: string }[] = [
  { regex: /ירי רקטות וטילים/g, es: 'Lanzamiento de cohetes y misiles', fr: 'Tir de roquettes et missiles', en: 'Rocket and missile fire' },
  { regex: /חדירת כלי טיס עוין/g, es: 'Infiltración de dron hostil', fr: 'Infiltration de drone ennemi', en: 'Hostile aircraft infiltration' },
  { regex: /ירי רקטות/g, es: 'Disparo de cohetes', fr: 'Tirs de roquettes', en: 'Rocket fire' },
  { regex: /צבע אדום/g, es: 'Alerta Roja (Tzeva Adom)', fr: 'Alerte Rouge (Tseva Adom)', en: 'Red Alert (Tzeva Adom)' },
  { regex: /חיל האוויר/g, es: 'Fuerza Aérea', fr: 'Armée de l\'Air', en: 'Air Force' },
  { regex: /פיקוד העורף/g, es: 'Comando del Frente Doméstico', fr: 'Commandement du Front Intérieur', en: 'Home Front Command' },
  { regex: /צה"ל|צה״ל/g, es: 'Fuerzas de Defensa de Israel (FDI)', fr: 'Armée israélienne (Tsahal)', en: 'Israel Defense Forces (IDF)' },
  { regex: /הקבינט/g, es: 'El Gabinete de Seguridad', fr: 'Le Cabinet de sécurité', en: 'The Security Cabinet' },
  { regex: /יירוט/g, es: 'intercepción', fr: 'interception', en: 'interception' },
  { regex: /יירטו/g, es: 'interceptaron', fr: 'ont intercepté', en: 'intercepted' },
  { regex: /טיל בליסטי/g, es: 'misil balístico', fr: 'missile balistique', en: 'ballistic missile' },
  { regex: /טילים/g, es: 'misiles', fr: 'missiles', en: 'missiles' },
  { regex: /כוננות עליונה/g, es: 'máxima alerta', fr: 'alerte maximale', en: 'high alert' },
  { regex: /מרחב מוגן|ממ"ד|ממ״ד/g, es: 'refugio blindado (Mamad)', fr: 'abri protégé (Mamad)', en: 'safe room (Mamad)' },
  { regex: /מבזק מיוחד|מבזק/g, es: 'Despacho urgente', fr: 'Dépêche urgente', en: 'Breaking dispatch' },
  { regex: /פרסום ראשון/g, es: 'Primicia exclusiva', fr: 'Exclusivité', en: 'First report' },
  { regex: /חדשות/g, es: 'Noticias', fr: 'Nouvelles', en: 'News' },
  { regex: /רשת 13|חדשות 13/g, es: 'Canal 13 Noticias', fr: 'Chaîne 13 Nouvelles', en: 'Channel 13 News' },
  { regex: /ניר דבורי/g, es: 'Nir Dvori', fr: 'Nir Dvori', en: 'Nir Dvori' },
  { regex: /אלון בן דוד/g, es: 'Alon Ben-David', fr: 'Alon Ben-David', en: 'Alon Ben-David' },
  { regex: /אור הלר/g, es: 'Or Heller', fr: 'Or Heller', en: 'Or Heller' },
  { regex: /טהראן/g, es: 'Teherán', fr: 'Téhéran', en: 'Tehran' },
  { regex: /איראן/g, es: 'Irán', fr: 'Iran', en: 'Iran' },
  { regex: /ישראל/g, es: 'Israel', fr: 'Israël', en: 'Israel' },
  { regex: /לבנון/g, es: 'Líbano', fr: 'Liban', en: 'Lebanon' },
  { regex: /גבול הצפון/g, es: 'frontera norte', fr: 'frontière nord', en: 'northern border' }
];

// Spanish to French/English phrase converters
const ES_PHRASES_TO_FR: [RegExp, string][] = [
  [/Última hora/gi, 'Dernière minute'],
  [/En vivo/gi, 'En direct'],
  [/Reporte en vivo/gi, 'Rapport en direct'],
  [/Despacho urgente/gi, 'Dépêche urgente'],
  [/Alerta Roja/gi, 'Alerte Rouge'],
  [/Fuerza Aérea/gi, 'Armée de l\'Air'],
  [/Comando del Frente Doméstico/gi, 'Commandement du Front Intérieur'],
  [/Gabinete de Seguridad/gi, 'Cabinet de Sécurité'],
  [/misil balístico/gi, 'missile balistique'],
  [/misiles balísticos/gi, 'missiles balistiques'],
  [/misil de crucero/gi, 'missile de croisière'],
  [/misiles de crucero/gi, 'missiles de croisière'],
  [/defensa aérea/gi, 'défense aérienne'],
  [/intercepción/gi, 'interception'],
  [/interceptado/gi, 'intercepté'],
  [/refugio blindado/gi, 'abri blindé'],
  [/permanecer 10 minutos/gi, 'rester 10 minutes'],
  [/ingrese de inmediato/gi, 'rejoignez immédiatement'],
  [/máxima alerta/gi, 'alerte maximale'],
  [/Estados Unidos/gi, 'États-Unis'],
  [/El Pentágono/gi, 'Le Pentagone'],
  [/La Casa Blanca/gi, 'La Maison Blanche'],
  [/FDI/gi, 'Tsahal'],
  [/corresponsal/gi, 'correspondant'],
  [/reporta desde/gi, 'rapporte depuis'],
  [/confirma/gi, 'confirme'],
  [/anuncia/gi, 'annonce'],
  [/detectó/gi, 'a détecté'],
  [/detectaron/gi, 'ont détecté'],
  [/baterías/gi, 'batteries'],
  [/enlace satelital/gi, 'liaison satellite'],
  [/radares/gi, 'radars'],
  [/sirenas/gi, 'sirènes']
];

const ES_PHRASES_TO_EN: [RegExp, string][] = [
  [/Última hora/gi, 'Breaking News'],
  [/En vivo/gi, 'Live'],
  [/Reporte en vivo/gi, 'Live Report'],
  [/Despacho urgente/gi, 'Urgent Dispatch'],
  [/Alerta Roja/gi, 'Red Alert'],
  [/Fuerza Aérea/gi, 'Air Force'],
  [/Comando del Frente Doméstico/gi, 'Home Front Command'],
  [/Gabinete de Seguridad/gi, 'Security Cabinet'],
  [/misil balístico/gi, 'ballistic missile'],
  [/misiles balísticos/gi, 'ballistic missiles'],
  [/defensa aérea/gi, 'air defense'],
  [/intercepción/gi, 'interception'],
  [/interceptado/gi, 'intercepted'],
  [/refugio blindado/gi, 'bomb shelter (Mamad)'],
  [/máxima alerta/gi, 'high alert'],
  [/Estados Unidos/gi, 'United States'],
  [/El Pentágono/gi, 'The Pentagon'],
  [/La Casa Blanca/gi, 'The White House'],
  [/FDI/gi, 'IDF']
];

/**
 * Translates a given text to Spanish
 */
export function translateToSpanish(text: string): string {
  if (!text) return '';
  let out = text;

  // If text is in Hebrew
  if (/[\u0590-\u05FF]/.test(text)) {
    for (const h of HEBREW_TO_TARGET) {
      out = out.replace(h.regex, h.es);
    }
  }

  // Common dictionary replacements
  for (const [key, val] of Object.entries(DICTIONARY)) {
    const reg = new RegExp(`\\b${key}\\b`, 'gi');
    out = out.replace(reg, val.es);
  }

  // Clean trailing Google News source suffixes
  out = out.replace(/\s*-\s*(mako|13tv|i24news|reuters|cnn|fox news|bbc news|חדשות)\b/gi, '');

  return out.trim();
}

/**
 * Translates a given text to French
 */
export function translateToFrench(text: string): string {
  if (!text) return '';
  let out = text;

  // If text is in Hebrew
  if (/[\u0590-\u05FF]/.test(text)) {
    for (const h of HEBREW_TO_TARGET) {
      out = out.replace(h.regex, h.fr);
    }
  }

  // If text is in Spanish
  for (const [reg, frVal] of ES_PHRASES_TO_FR) {
    out = out.replace(reg, frVal);
  }

  // Common dictionary replacements
  for (const [key, val] of Object.entries(DICTIONARY)) {
    const reg = new RegExp(`\\b${key}\\b`, 'gi');
    out = out.replace(reg, val.fr);
  }

  // Common French grammar touchups
  out = out.replace(/\bde le\b/g, 'du');
  out = out.replace(/\bde les\b/g, 'des');
  out = out.replace(/\bà le\b/g, 'au');
  out = out.replace(/\s*-\s*(mako|13tv|i24news|reuters|cnn|fox news|bbc news|חדשות)\b/gi, '');

  return out.trim();
}

/**
 * Translates a given text to English
 */
export function translateToEnglish(text: string): string {
  if (!text) return '';
  let out = text;

  // If text is in Hebrew
  if (/[\u0590-\u05FF]/.test(text)) {
    for (const h of HEBREW_TO_TARGET) {
      out = out.replace(h.regex, h.en);
    }
  }

  // If text is in Spanish
  for (const [reg, enVal] of ES_PHRASES_TO_EN) {
    out = out.replace(reg, enVal);
  }

  // Common dictionary replacements
  for (const [key, val] of Object.entries(DICTIONARY)) {
    const reg = new RegExp(`\\b${key}\\b`, 'gi');
    out = out.replace(reg, val.en);
  }

  out = out.replace(/\s*-\s*(mako|13tv|i24news|reuters|cnn|fox news|bbc news|חדשות)\b/gi, '');
  return out.trim();
}

/**
 * Translates a given text to Hebrew
 */
export function translateToHebrew(text: string): string {
  if (!text) return '';
  // If already Hebrew, return
  if (/[\u0590-\u05FF]/.test(text)) {
    return text.replace(/\s*-\s*(mako|13tv|רשת 13)\b/gi, '').trim();
  }

  let out = text;
  for (const [key, val] of Object.entries(DICTIONARY)) {
    const reg = new RegExp(`\\b${key}\\b`, 'gi');
    out = out.replace(reg, val.he);
  }
  return out.trim();
}

/**
 * Universally translates any text into the target application language
 */
export function universalTranslate(text: string, targetLang: AppLanguage): string {
  if (!text) return '';
  switch (targetLang) {
    case 'fr':
      return translateToFrench(text);
    case 'en':
      return translateToEnglish(text);
    case 'he':
      return translateToHebrew(text);
    case 'es':
    default:
      return translateToSpanish(text);
  }
}
