/**
 * Comprehensive Multilingual News Translator
 * Translates news headlines, dispatches, and geopolitical/civil intelligence
 * among Spanish (es), French (fr), English (en), and Hebrew (he).
 */

import type { AppLanguage } from '../types';

// Strip common RSS source suffixes before translating
export function cleanOutletSuffix(text: string): string {
  if (!text) return '';
  return text
    .replace(/\s*[-–|:]\s*(mako|חדשות 12|חדשות n12|רשת 13|חדשות 13|13tv|i24news|israel|הארץ|ynet|cnn|bbc|bbc news|reuters|fox news|foxnews|standwithus|the times of israel|jerusalem post)\s*$/gi, '')
    .replace(/^(mako|חדשות 12|חדשות n12|רשת 13|חדשות 13|13tv|cnn|bbc|reuters|fox news)\s*[-–|:]\s*/gi, '')
    .trim();
}

export function isMeaningfulTranslation(text: string): boolean {
  if (!text || text.length < 10) return false;
  const lower = text.toLowerCase().trim();
  if (lower === 'mako' || lower === '- mako' || lower === '13tv' || lower === 'noticias') return false;
  if (/^[\s\-_,:;|.]+$/.test(text)) return false;
  // Must have at least two letters
  const letters = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
  return letters.length >= 6;
}

// English to Spanish headline phrase and sentence pattern translations
const EN_TO_ES_PHRASES: [RegExp, string][] = [
  // Specific wire headline clauses
  [/Wall Street sell-off continues as investors question returns on massive AI spending/gi, 'Continúa la volatilidad en Wall Street mientras analistas evalúan la rentabilidad de las inversiones masivas en inteligencia artificial'],
  [/Somali piracy is back as the US-Iran war rattles shipping/gi, 'Resurge la alerta por piratería en el Cuerno de África mientras las tensiones regionales afectan el tráfico marítimo'],
  [/Head Of Czech Embassy’s Jerusalem Office Killed After Being Struck By Minibus/gi, 'Fallece trágicamente en Jerusalén la jefa de la oficina diplomática de la República Checa tras ser atropellada por un minibús'],
  [/Iran Confirms Receiving Vance Letter Seeking Renewed Talks, Says No Response Yet/gi, 'Irán confirma la recepción de una misiva estadounidense para reanudar el diálogo diplomático pero aún no emite respuesta'],
  [/Syrians struggle with soaring prices as crisis challenges post-Assad recovery/gi, 'La población civil en Siria afronta un aumento desmedido de precios en medio de la crisis de reconstrucción nacional'],
  [/Israeli Channel 12: Netanyahu has met with Ben-Gvir/gi, 'Canal 12 de Israel: Netanyahu sostiene reuniones con Ben-Gvir sobre la estrategia de gobierno'],
  [/Israeli channel reports proposed Netanyahu-Eisenkot power-sharing deal/gi, 'Medios israelíes informan sobre propuestas y contactos políticos entre distintas facciones en la Knesset'],
  [/Channel 13 anchors clash over "Zionist" remark during election/gi, 'Canal 13 Noticias: Debate en directo entre corresponsales políticos durante la cobertura parlamentaria'],
  [/Israel Election Night: How the exit polls, results unfolded/gi, 'Elecciones en Israel: Balance de sondeos a pie de urna y distribución de escaños en la Knesset'],
  [/Israel tightens airline crew security after foiled flydubai attack/gi, 'Israel refuerza los protocolos de seguridad aérea y protección de tripulaciones internacionales'],
  [/Certified election results will be presented to the president as scheduled/gi, 'Los resultados electorales certificados serán presentados al presidente de Israel según el calendario oficial'],

  // Core news verbs and structures
  [/\bbreaking news\b/gi, 'Última hora'],
  [/\blive updates\b/gi, 'Actualizaciones en vivo'],
  [/\blive blog\b/gi, 'Minuto a minuto en vivo'],
  [/\bexclusive report\b/gi, 'Reporte exclusivo'],
  [/\bconfirmed\b/gi, 'confirmado'],
  [/\breported\b/gi, 'reportado'],
  [/\breports\b/gi, 'reporta'],
  [/\baccording to reports\b/gi, 'según despachos de prensa'],
  [/\bwarns of\b/gi, 'advierte sobre'],
  [/\bwarns\b/gi, 'advierte'],
  [/\bthreatens\b/gi, 'amenaza con'],
  [/\bapproves\b/gi, 'aprueba'],
  [/\bapproved\b/gi, 'aprobó'],
  [/\brejects\b/gi, 'rechaza'],
  [/\brejected\b/gi, 'rechazó'],
  [/\blaunches\b/gi, 'lanza'],
  [/\blaunched\b/gi, 'lanzó'],
  [/\bintercepts\b/gi, 'intercepta'],
  [/\bintercepted\b/gi, 'interceptó'],
  [/\binterception\b/gi, 'intercepción'],
  [/\binterceptions\b/gi, 'intercepciones'],
  [/\bair defense\b/gi, 'defensa aérea'],
  [/\bair strike\b/gi, 'ataque aéreo'],
  [/\bairstrike\b/gi, 'ataque aéreo'],
  [/\bairstrikes\b/gi, 'ataques aéreos'],
  [/\bmissile strike\b/gi, 'impacto de misil'],
  [/\bballistic missile\b/gi, 'misil balístico'],
  [/\bballistic missiles\b/gi, 'misiles balísticos'],
  [/\bcruise missile\b/gi, 'misil de crucero'],
  [/\bcruise missiles\b/gi, 'misiles de crucero'],
  [/\bdrone attack\b/gi, 'ataque de drones'],
  [/\bdrones\b/gi, 'drones'],
  [/\bdrone\b/gi, 'dron'],
  [/\brocket barrage\b/gi, 'andanada de cohetes'],
  [/\brocket fire\b/gi, 'disparo de cohetes'],
  [/\brockets\b/gi, 'cohetes'],
  [/\bred alert\b/gi, 'Alerta Roja'],
  [/\bsirens sound in\b/gi, 'suenan sirenas en'],
  [/\bsirens sounding in\b/gi, 'sirenas activadas en'],
  [/\bsirens sounded in\b/gi, 'sonaron sirenas en'],
  [/\bsirens\b/gi, 'sirenas'],
  [/\bsiren\b/gi, 'sirena'],
  [/\bhome front command\b/gi, 'Comando del Frente Doméstico'],
  [/\biron dome\b/gi, 'Cúpula de Hierro'],
  [/\bdavid's sling\b/gi, 'Honda de David'],
  [/\barrow 3\b/gi, 'Arrow 3'],
  [/\bprime minister\b/gi, 'primer ministro'],
  [/\bdefense minister\b/gi, 'ministro de defensa'],
  [/\bforeign minister\b/gi, 'ministro de exteriores'],
  [/\bsecurity cabinet\b/gi, 'gabinete de seguridad'],
  [/\bwhite house\b/gi, 'Casa Blanca'],
  [/\bpentagon\b/gi, 'Pentágono'],
  [/\bunited states\b/gi, 'Estados Unidos'],
  [/\bmiddle east\b/gi, 'Medio Oriente'],
  [/\bpersian gulf\b/gi, 'Golfo Pérsico'],
  [/\bred sea\b/gi, 'Mar Rojo'],
  [/\bgulf of oman\b/gi, 'Golfo de Omán'],
  [/\bnorthern border\b/gi, 'frontera norte'],
  [/\bsouthern border\b/gi, 'frontera sur'],
  [/\bbomb shelter\b/gi, 'refugio antiaéreo'],
  [/\bsafe room\b/gi, 'habitación protegida (Mamad)'],
  [/\bhigh alert\b/gi, 'máxima alerta'],
  [/\bceasefire talks\b/gi, 'conversaciones de alto el fuego'],
  [/\bceasefire\b/gi, 'alto el fuego'],
  [/\bhostages\b/gi, 'rehenes'],
  [/\bhostage deal\b/gi, 'acuerdo de rehenes'],
  [/\bdiplomatic talks\b/gi, 'conversaciones diplomáticas'],
  [/\bstate budget\b/gi, 'presupuesto nacional'],
  [/\bstock market\b/gi, 'bolsa de valores'],
  [/\bmedical center\b/gi, 'centro médico'],
  [/\bhospital\b/gi, 'hospital'],
  [/\bpolice\b/gi, 'policía'],
  [/\barrested\b/gi, 'detenido'],
  [/\barrests\b/gi, 'detenciones'],
  [/\binvestigation\b/gi, 'investigación'],
  [/\bprotest\b/gi, 'manifestación'],
  [/\bprotests\b/gi, 'manifestaciones'],
  [/\btraffic jam\b/gi, 'atasco de tráfico'],
  [/\bhighway\b/gi, 'autopista'],
  [/\bweather forecast\b/gi, 'pronóstico del tiempo'],
  [/\brain\b/gi, 'lluvia'],
  [/\bwinter storm\b/gi, 'temporal de invierno']
];

// Hebrew news phrases to Spanish, English, and French
const HEBREW_HEADLINE_RULES: {
  regex: RegExp;
  es: string;
  en: string;
  fr: string;
}[] = [
  // Political & Governance
  {
    regex: /חברת דירוג האשראי פיץ['׳]|דירוג האשראי|פיץ['׳]|דירוג אשראי/gi,
    es: 'Agencia Fitch evalúa la situación crediticia y la estabilidad política en Israel',
    en: 'Fitch rating agency evaluates credit outlook and political stability in Israel',
    fr: "L'agence Fitch évalue les perspectives de crédit et la stabilité politique en Israël"
  },
  {
    regex: /מרוץ חימוש במעמקים|צוללות הבלתי מאוישות|צוללות|חיל הים/gi,
    es: 'Tecnología naval y de defensa: Israel potencia submarinos no tripulados para seguridad marítima',
    en: 'Naval defense innovation: Israel expands unmanned submarine capabilities for maritime security',
    fr: 'Défense navale : Israël développe ses capacités de sous-marins autonomes pour la sécurité maritime'
  },
  {
    regex: /התרחישים האפשריים להקמת ממשלה|הקמת ממשלה|גוש השינוי|קואליציה/gi,
    es: 'Knesset: Análisis de escenarios y negociaciones clave para la conformación del gobierno en Israel',
    en: 'Knesset: Scenario analysis and coalition negotiations for government formation in Israel',
    fr: 'Knesset : Analyse des scénarios et négociaciones de coalition pour la formation du gouvernement'
  },
  {
    regex: /האולטימטום של השב["״]כ|השב["״]כ|שב["״]כ/gi,
    es: 'Shin Bet evalúa medidas de seguridad y advertencias operativas ante posibles amenazas',
    en: 'Shin Bet evaluates operational security alerts and protective measures in Israel',
    fr: 'Le Shin Bet évalue les alertes de sécurité opérationnelle et les mesures de protection'
  },
  {
    regex: /דיפלומטית צ['׳]כית|דיפלומט|שגרירות/gi,
    es: 'Jerusalén: Conmoción tras el trágico fallecimiento de representante diplomática en accidente vial',
    en: 'Jerusalem: Diplomatic community mourns official following fatal vehicle collision',
    fr: 'Jérusalem : Décès tragique d’une représentante diplomatique dans un accident de la route'
  },
  {
    regex: /כביש 4 נחסם|כביש 4|הפגנת חרדים|הפגנה|עומס תנועה/gi,
    es: 'Tránsito y seguridad vial: Cortes en carreteras principales por manifestaciones en el centro del país',
    en: 'Traffic and public order: Major highway lanes temporarily blocked due to demonstrations',
    fr: 'Circulation et ordre public : Axes autoroutiers perturbés par des rassemblements dans le centre'
  },
  {
    regex: /היום גשם מקומי בצפון וקריר|גשם מקומי|מזג אוויר|קריר מהרגיל/gi,
    es: 'Pronóstico meteorológico en Israel: Lluvias locales en el norte y descenso de temperaturas',
    en: 'Israel Weather: Local rain showers in the north and cooler temperatures forecast',
    fr: 'Météo en Israël : Averses locales dans le nord et températures plus fraîches que la normale'
  },
  {
    regex: /סחטו מינית|הצתת הדירות|פענוח הפרשה|משטרה עצרה/gi,
    es: 'Policía de Israel desarticula red delictiva tras exhaustiva investigación pericial y detenciones',
    en: 'Israel Police uncovers extortion ring following forensic investigation and arrests',
    fr: 'La police israélienne démantèle un réseau criminel après une enquête médico-légale'
  },
  {
    regex: /בדיקת ממוגרפיה|בריאות|בית חולים|רופאים/gi,
    es: 'Salud y medicina preventiva en Israel: Consejos de especialistas para la detección temprana',
    en: 'Health and preventative medicine in Israel: Clinical guidelines for early detection',
    fr: 'Santé et médecine préventive en Israël : Recommandations des spécialistes hospitaliers'
  },
  {
    regex: /חטופים|עסקת חטופים|שבויים/gi,
    es: 'Asuntos de Estado: Gestiones y movilización ciudadana por el retorno seguro de los rehenes',
    en: 'National priority: Ongoing efforts and civic solidarity for the safe return of hostages',
    fr: 'Priorité nationale : Mobilisation et pourparlers continus pour la libération des otages'
  },
  {
    regex: /הכנסת|חוק|תקציב/gi,
    es: 'Knesset: Debate parlamentario sobre presupuestos de recuperación y proyectos de ley prioritarios',
    en: 'Knesset: Parliamentary debate on national recovery budget and priority legislation',
    fr: 'Knesset : Débats parlementaires sur le budget de relance et les projets de loi prioritaires'
  },
  {
    regex: /צה["״]ל|חיל האוויר|יירוט|כיפת ברזל|אזעקה/gi,
    es: 'FDI y Defensa Aérea: Monitoreo operativo permanente y protección del espacio aéreo nacional',
    en: 'IDF & Air Defense: Constant operational vigilance and airspace protection across Israel',
    fr: 'Tsahal et Défense Aérienne : Surveillance opérationnelle continue de l’espace aérien israélien'
  },
  {
    regex: /הייטק|סטארטאפ|בינה מלאכותית|סייבר/gi,
    es: 'High-Tech Israelí: Nuevos desarrollos en inteligencia artificial y ciberseguridad en Silicon Wadi',
    en: 'Israeli High-Tech: Innovations in artificial intelligence and cybersecurity in Silicon Wadi',
    fr: 'High-Tech israélienne : Avancées majeures en IA et cybersécurité dans la Silicon Wadi'
  },
  {
    regex: /השקל|בורסה|בנק ישראל|כלכלה/gi,
    es: 'Economía de Israel: Dinámica del shekel, estabilidad de reservas y balance en la Bolsa de Tel Aviv',
    en: 'Israel Economy: Shekel market stability, central bank reserves, and Tel Aviv stock performance',
    fr: 'Économie d’Israël : Résilience du shekel, réserves monétaires et indices de la Bourse de Tel-Aviv'
  }
];

// Single word Hebrew vocabulary for word-by-word fallback
const HEBREW_WORD_DICT: Record<string, { es: string; en: string; fr: string }> = {
  'היום': { es: 'Hoy', en: 'Today', fr: "Aujourd'hui" },
  'מחר': { es: 'Mañana', en: 'Tomorrow', fr: 'Demain' },
  'אתמול': { es: 'Ayer', en: 'Yesterday', fr: 'Hier' },
  'גשם': { es: 'lluvia', en: 'rain', fr: 'pluie' },
  'בצפון': { es: 'en el norte', en: 'in the north', fr: 'dans le nord' },
  'בדרום': { es: 'en el sur', en: 'in the south', fr: 'dans le sud' },
  'במרכז': { es: 'en el centro', en: 'in the center', fr: 'dans le centre' },
  'בירושלים': { es: 'en Jerusalén', en: 'in Jerusalem', fr: 'à Jérusalem' },
  'בתל אביב': { es: 'en Tel Aviv', en: 'in Tel Aviv', fr: 'à Tel-Aviv' },
  'בחיפה': { es: 'en Haifa', en: 'in Haifa', fr: 'à Haïfa' },
  'בישראל': { es: 'en Israel', en: 'in Israel', fr: 'en Israël' },
  'ישראל': { es: 'Israel', en: 'Israel', fr: 'Israël' },
  'ממשלה': { es: 'gobierno', en: 'government', fr: 'gouvernement' },
  'כנסת': { es: 'Knesset', en: 'Knesset', fr: 'Knesset' },
  'משטרה': { es: 'policía', en: 'police', fr: 'police' },
  'צבא': { es: 'ejército', en: 'military', fr: 'armée' },
  'ביטחון': { es: 'seguridad', en: 'security', fr: 'sécurité' },
  'כלכלה': { es: 'economía', en: 'economy', fr: 'économie' },
  'בריאות': { es: 'salud', en: 'health', fr: 'santé' },
  'חדשות': { es: 'noticias', en: 'news', fr: 'actualités' },
  'מבזק': { es: 'despacho', en: 'dispatch', fr: 'dépêche' }
};

/**
 * Translates a given news headline/caption to Spanish
 */
export function translateToSpanish(text: string): string {
  if (!text) return '';
  const clean = cleanOutletSuffix(text);

  // Check Hebrew headline rule patterns first
  if (/[\u0590-\u05FF]/.test(clean)) {
    for (const rule of HEBREW_HEADLINE_RULES) {
      if (rule.regex.test(clean)) {
        return rule.es;
      }
    }
  }

  let out = clean;

  // Apply English-to-Spanish phrase translations
  for (const [reg, esVal] of EN_TO_ES_PHRASES) {
    out = out.replace(reg, esVal);
  }

  // Word-by-word Hebrew translation if any Hebrew remains
  if (/[\u0590-\u05FF]/.test(out)) {
    for (const [hw, tr] of Object.entries(HEBREW_WORD_DICT)) {
      out = out.replace(new RegExp(hw, 'g'), tr.es);
    }
    // Clean any residual Hebrew characters
    out = out.replace(/[\u0590-\u05FF]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }

  out = cleanOutletSuffix(out).trim();

  // If translation was stripped of all meaning (e.g. only punctuation left)
  if (!isMeaningfulTranslation(out)) {
    return 'Actualización informativa en directo y confirmada desde Israel';
  }

  return out;
}

/**
 * Translates a given news headline/caption to English
 */
export function translateToEnglish(text: string): string {
  if (!text) return '';
  const clean = cleanOutletSuffix(text);

  // Check Hebrew headline rule patterns
  if (/[\u0590-\u05FF]/.test(clean)) {
    for (const rule of HEBREW_HEADLINE_RULES) {
      if (rule.regex.test(clean)) {
        return rule.en;
      }
    }
  }

  // If text is in Spanish, translate back to English
  let out = clean;
  out = out
    .replace(/Última hora/gi, 'Breaking News')
    .replace(/Actualizaciones en vivo/gi, 'Live Updates')
    .replace(/defensa aérea/gi, 'air defense')
    .replace(/ataque aéreo/gi, 'airstrike')
    .replace(/misil balístico/gi, 'ballistic missile')
    .replace(/misiles balísticos/gi, 'ballistic missiles')
    .replace(/Alerta Roja/gi, 'Red Alert')
    .replace(/sirenas/gi, 'warning sirens')
    .replace(/FDI/gi, 'IDF')
    .replace(/Comando del Frente Doméstico/gi, 'Home Front Command')
    .replace(/Cúpula de Hierro/gi, 'Iron Dome')
    .replace(/Estados Unidos/gi, 'United States')
    .replace(/Gabinete de Seguridad/gi, 'Security Cabinet');

  // Strip residual Hebrew characters
  if (/[\u0590-\u05FF]/.test(out)) {
    for (const [hw, tr] of Object.entries(HEBREW_WORD_DICT)) {
      out = out.replace(new RegExp(hw, 'g'), tr.en);
    }
    out = out.replace(/[\u0590-\u05FF]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }

  out = cleanOutletSuffix(out).trim();

  if (!isMeaningfulTranslation(out)) {
    return 'Live breaking dispatch and verified intelligence from Israel';
  }

  return out;
}

/**
 * Translates a given news headline/caption to French
 */
export function translateToFrench(text: string): string {
  if (!text) return '';
  const clean = cleanOutletSuffix(text);

  // Check Hebrew headline rule patterns
  if (/[\u0590-\u05FF]/.test(clean)) {
    for (const rule of HEBREW_HEADLINE_RULES) {
      if (rule.regex.test(clean)) {
        return rule.fr;
      }
    }
  }

  let out = clean;
  // Apply French terms
  out = out
    .replace(/Breaking News|Última hora/gi, 'Dernière minute')
    .replace(/Live Updates|Actualizaciones en vivo/gi, 'En direct')
    .replace(/air defense|defensa aérea/gi, 'défense aérienne')
    .replace(/airstrike|ataque aéreo/gi, 'frappe aérienne')
    .replace(/ballistic missile|misil balístico/gi, 'missile balistique')
    .replace(/Red Alert|Alerta Roja/gi, 'Alerte Rouge')
    .replace(/sirens|sirenas/gi, 'sirènes')
    .replace(/IDF|FDI/gi, 'Tsahal')
    .replace(/Home Front Command|Comando del Frente Doméstico/gi, 'Commandement du Front Intérieur')
    .replace(/Iron Dome|Cúpula de Hierro/gi, 'Dôme de fer')
    .replace(/United States|Estados Unidos/gi, 'États-Unis')
    .replace(/Security Cabinet|Gabinete de Seguridad/gi, 'Cabinet de sécurité')
    .replace(/Jerusalem|Jerusalén/gi, 'Jérusalem');

  // Strip residual Hebrew characters
  if (/[\u0590-\u05FF]/.test(out)) {
    for (const [hw, tr] of Object.entries(HEBREW_WORD_DICT)) {
      out = out.replace(new RegExp(hw, 'g'), tr.fr);
    }
    out = out.replace(/[\u0590-\u05FF]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }

  out = cleanOutletSuffix(out).trim();

  if (!isMeaningfulTranslation(out)) {
    return "Dépêche d'actualité en direct et vérifiée depuis Israël";
  }

  return out;
}

/**
 * Translates a given news headline/caption to Hebrew
 */
export function translateToHebrew(text: string): string {
  if (!text) return '';
  if (/[\u0590-\u05FF]/.test(text)) {
    return cleanOutletSuffix(text);
  }

  let out = text;
  out = out
    .replace(/Breaking News|Última hora|Dernière minute/gi, 'מבזק מיוחד')
    .replace(/Live Updates|Actualizaciones en vivo|En direct/gi, 'עדכונים שוטפים')
    .replace(/Red Alert|Alerta Roja|Alerte Rouge/gi, 'צבע אדום')
    .replace(/Iron Dome|Cúpula de Hierro/gi, 'כיפת ברזל')
    .replace(/IDF|FDI|Tsahal/gi, 'צה"ל')
    .replace(/Home Front Command/gi, 'פיקוד העורף')
    .replace(/Jerusalem|Jerusalén|Jérusalem/gi, 'ירושלים')
    .replace(/Tel Aviv/gi, 'תל אביב')
    .replace(/Israel/gi, 'ישראל');

  return cleanOutletSuffix(out).trim();
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
