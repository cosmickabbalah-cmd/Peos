import type { AppLanguage, FeedPost } from '../types';

export interface UIStrings {
  appName: string;
  appSubtitle: string;
  feedTitle: string;
  feedSubtitle: string;
  realtimeBadge: string;
  refreshBtn: string;
  refreshingBtn: string;
  autoCountdownPrefix: string;
  lastUpdatedPrefix: string;
  dispatchesCount: (displayed: number, total: number) => string;
  loadMoreBtn: (remaining: number) => string;
  loadingMore: string;
  allCaughtUp: string;
  trendingLabel: string;
  allOutlets: string;
  viewOriginal: string;
  backToLanguage: (lang: AppLanguage) => string;
  militaryContext: string;
  hideContext: string;
  contextHeader: string;
  systemsInvolved: string;
  sourceLinkPrefix: string;
  newBannerTitle: (count: number) => string;
  newBadge: string;
  tapToView: string;
  toastUpdated: (count: number) => string;
  toastUpToDate: string;
  toastDispatches: (count: number) => string;
  noAlertsTitle: string;
  noAlertsSubtitle: string;
  filterAllCountry: string;
  filterCities: (count: number) => string;
  testSimulation: string;
  navNews: string;
  navSirens: string;
  navIntel: string;
  navChannels: string;
  activeAlertsCount: (count: number) => string;
  selectLanguage: string;
  channelVerifyTitle: string;
  channelVerifySubtitle: string;
  channelsCheckedSummary: (count: number) => string;
  channelStatusUpToDate: string;
  channelStatusNew: string;
  noNewInfoDoNothing: string;
  searchPlaceholder: string;
  searchLabel: string;
  searchClear: string;
  searchResultsCount: (count: number, query: string) => string;
  searchNoResults: (query: string) => string;
  searchReset: string;
  searchSuggestionsLabel: string;
  israelOnlyBadge: string;
}

export const UI_TRANSLATIONS: Record<AppLanguage, UIStrings> = {
  es: {
    appName: 'WarFeed',
    appSubtitle: 'Live Radar',
    feedTitle: 'Feed de Noticias en Vivo',
    feedSubtitle: 'Monitoreo directo de medios israelíes y estadounidenses oficiales',
    realtimeBadge: 'TIEMPO REAL',
    refreshBtn: 'Actualizar Información',
    refreshingBtn: 'Actualizando...',
    autoCountdownPrefix: 'Auto en:',
    lastUpdatedPrefix: 'Última actualización:',
    dispatchesCount: (displayed, total) => `${displayed} de ${total} despachos`,
    loadMoreBtn: (remaining) => `Ver más noticias (${remaining} despachos disponibles)`,
    loadingMore: 'Consultando despachos recientes...',
    allCaughtUp: 'Has visto todos los despachos verificados · Radar activo 24/7',
    trendingLabel: 'Tendencias:',
    allOutlets: 'Todos',
    viewOriginal: '🌐 Ver en idioma original (Hebreo / Inglés)',
    backToLanguage: () => '🇪🇸 Volver a ver en Español',
    militaryContext: 'Contexto Militar',
    hideContext: 'Ocultar Contexto',
    contextHeader: 'Contexto Operacional & Inteligencia',
    systemsInvolved: 'Sistemas involucrados:',
    sourceLinkPrefix: 'Fuente verificada:',
    newBannerTitle: (count) => `⬆️ Hay ${count} nueva${count > 1 ? 's' : ''} noticia${count > 1 ? 's' : ''} en tiempo real`,
    newBadge: 'NUEVO',
    tapToView: 'Toca para ver',
    toastUpdated: (count) => `✓ ${count} noticia(s) nueva(s) incorporada(s) al feed`,
    toastUpToDate: '✓ El feed de noticias está completamente al día',
    toastDispatches: (count) => `✓ ${count} nuevo(s) despacho(s) en tiempo real`,
    noAlertsTitle: 'No hay alertas activas en este momento',
    noAlertsSubtitle: 'Cielos en calma (שקט) en todos los sectores monitoreados',
    filterAllCountry: 'Filtro: Todo el país',
    filterCities: (count) => `Filtrando por ${count} ciudades`,
    testSimulation: 'Simular Alerta צבע אדום',
    navNews: 'Noticias',
    navSirens: 'Sirenas',
    navIntel: 'Análisis',
    navChannels: 'Canales',
    activeAlertsCount: (count) => `${count} Activas`,
    selectLanguage: 'Idioma / Language / Langue',
    channelVerifyTitle: 'Revisión por Canales Oficiales',
    channelVerifySubtitle: 'Monitoreo canal por canal (Mako, Canal 13, i24NEWS, CNN, Fox News, Reuters, Tzeva Adom)',
    channelsCheckedSummary: (count) => `${count} canales oficiales verificados`,
    channelStatusUpToDate: 'Al día · Sin noticias nuevas',
    channelStatusNew: 'Nueva noticia detectada',
    noNewInfoDoNothing: 'Todos los canales oficiales están al día. No se detectó información nueva, no se realizaron cambios.',
    searchPlaceholder: 'Buscar en noticias de Israel (ej: Tel Aviv, Cúpula de Hierro, Nir Dvori, Mako, FDI)...',
    searchLabel: 'Buscar noticias específicas de Israel',
    searchClear: 'Limpiar búsqueda',
    searchResultsCount: (count, query) => `${count} noticia${count === 1 ? '' : 's'} encontrada${count === 1 ? '' : 's'} para "${query}"`,
    searchNoResults: (query) => `No se encontraron noticias con "${query}".`,
    searchReset: 'Restablecer filtro de búsqueda',
    searchSuggestionsLabel: 'Búsquedas sugeridas:',
    israelOnlyBadge: '🇮🇱 COBERTURA 100% ISRAEL'
  },
  en: {
    appName: 'WarFeed',
    appSubtitle: 'Live Radar',
    feedTitle: 'Live Breaking News Feed',
    feedSubtitle: 'Direct verified war intelligence from official Israeli & US defense outlets',
    realtimeBadge: 'REAL-TIME',
    refreshBtn: 'Refresh News',
    refreshingBtn: 'Refreshing...',
    autoCountdownPrefix: 'Auto in:',
    lastUpdatedPrefix: 'Last updated:',
    dispatchesCount: (displayed, total) => `${displayed} of ${total} dispatches`,
    loadMoreBtn: (remaining) => `Load more news (${remaining} dispatches available)`,
    loadingMore: 'Checking latest field dispatches...',
    allCaughtUp: 'All verified dispatches viewed · Continuous radar active 24/7',
    trendingLabel: 'Trending:',
    allOutlets: 'All Sources',
    viewOriginal: '🌐 View original language (Hebrew / English / Persian)',
    backToLanguage: () => '🇬🇧 Switch back to English',
    militaryContext: 'Military Context',
    hideContext: 'Hide Context',
    contextHeader: 'Operational Context & Tactical Intel',
    systemsInvolved: 'Systems involved:',
    sourceLinkPrefix: 'Verified Source:',
    newBannerTitle: (count) => `⬆️ ${count} new real-time dispatch${count > 1 ? 'es' : ''} available`,
    newBadge: 'NEW',
    tapToView: 'Tap to view',
    toastUpdated: (count) => `✓ ${count} new intelligence report(s) added to feed`,
    toastUpToDate: '✓ News feed is completely up to date',
    toastDispatches: (count) => `✓ ${count} live real-time dispatch(es) loaded`,
    noAlertsTitle: 'No active missile alerts at this time',
    noAlertsSubtitle: 'Calm skies across all monitored air defense sectors',
    filterAllCountry: 'Filter: Nationwide',
    filterCities: (count) => `Filtered for ${count} cities`,
    testSimulation: 'Simulate Tzeva Adom Siren',
    navNews: 'News',
    navSirens: 'Sirens',
    navIntel: 'Intel',
    navChannels: 'Channels',
    activeAlertsCount: (count) => `${count} Active`,
    selectLanguage: 'Language / Idioma / Langue',
    channelVerifyTitle: 'Channel-by-Channel Verification',
    channelVerifySubtitle: 'Inspecting official outlets: Mako, Channel 13, i24NEWS, CNN, Fox News, Reuters, Tzeva Adom',
    channelsCheckedSummary: (count) => `${count} official channels checked`,
    channelStatusUpToDate: 'Up to date · No new stories',
    channelStatusNew: 'New report detected',
    noNewInfoDoNothing: 'All official channels are up to date. No new information found; no changes made.',
    searchPlaceholder: 'Search Israel news (e.g. Tel Aviv, Iron Dome, Nir Dvori, IDF, sirens)...',
    searchLabel: 'Search specific Israel news',
    searchClear: 'Clear search',
    searchResultsCount: (count, query) => `${count} stor${count === 1 ? 'y' : 'ies'} found for "${query}"`,
    searchNoResults: (query) => `No stories found for "${query}".`,
    searchReset: 'Reset search filter',
    searchSuggestionsLabel: 'Suggested searches:',
    israelOnlyBadge: '🇮🇱 100% ISRAEL COVERAGE'
  },
  fr: {
    appName: 'WarFeed',
    appSubtitle: 'Radar en Direct',
    feedTitle: "Fil d'Actualités en Temps Réel",
    feedSubtitle: 'Suivi direct vérifié des médias officiels israéliens et américains',
    realtimeBadge: 'TEMPS RÉEL',
    refreshBtn: 'Actualiser les Infos',
    refreshingBtn: 'Actualisation...',
    autoCountdownPrefix: 'Auto dans :',
    lastUpdatedPrefix: 'Dernière mise à jour :',
    dispatchesCount: (displayed, total) => `${displayed} sur ${total} dépêches`,
    loadMoreBtn: (remaining) => `Voir plus d'actualités (${remaining} dépêches disponibles)`,
    loadingMore: 'Recherche de nouvelles dépêches...',
    allCaughtUp: 'Toutes les dépêches vérifiées sont consultées · Veille radar 24/7',
    trendingLabel: 'Tendances :',
    allOutlets: 'Toutes les sources',
    viewOriginal: '🌐 Voir en langue originale (Hébreu / Anglais)',
    backToLanguage: () => '🇫🇷 Revenir au Français',
    militaryContext: 'Contexte Militaire',
    hideContext: 'Masquer le Contexte',
    contextHeader: 'Contexte Opérationnel & Renseignement Tactique',
    systemsInvolved: 'Systèmes impliqués :',
    sourceLinkPrefix: 'Source vérifiée :',
    newBannerTitle: (count) => `⬆️ ${count} nouvelle${count > 1 ? 's' : ''} actualité${count > 1 ? 's' : ''} en direct`,
    newBadge: 'NOUVEAU',
    tapToView: 'Appuyer pour voir',
    toastUpdated: (count) => `✓ ${count} nouvelle(s) dépêche(s) ajoutée(s) au fil`,
    toastUpToDate: '✓ Le fil d’actualités est parfaitement à jour',
    toastDispatches: (count) => `✓ ${count} dépêche(s) en temps réel chargée(s)`,
    noAlertsTitle: "Aucune alerte missile active pour l'instant",
    noAlertsSubtitle: 'Ciel calme (Sheket) sur tous les secteurs surveillés',
    filterAllCountry: 'Filtre : Tout le pays',
    filterCities: (count) => `Filtré pour ${count} villes`,
    testSimulation: 'Simuler Alerte Rouge (Tzeva Adom)',
    navNews: 'Actualités',
    navSirens: 'Sirènes',
    navIntel: 'Analyses',
    navChannels: 'Canaux',
    activeAlertsCount: (count) => `${count} Actives`,
    selectLanguage: 'Langue / Language / Idioma / שפה',
    channelVerifyTitle: 'Vérification par Canal Officiel',
    channelVerifySubtitle: 'Contrôle direct : Mako, Chaîne 13, i24NEWS, CNN, Fox News, Reuters, Tzeva Adom',
    channelsCheckedSummary: (count) => `${count} canaux officiels vérifiés`,
    channelStatusUpToDate: 'À jour · Aucune nouvelle dépêche',
    channelStatusNew: 'Nouvelle dépêche détectée',
    noNewInfoDoNothing: 'Tous les canaux officiels sont à jour. Aucune nouvelle information détectée, aucune modification effectuée.',
    searchPlaceholder: "Rechercher dans les actualités d'Israël (ex: Tel-Aviv, Dôme de Fer, Tsahal, Mako)...",
    searchLabel: "Rechercher des actualités spécifiques d'Israël",
    searchClear: 'Effacer la recherche',
    searchResultsCount: (count, query) => `${count} actualité${count === 1 ? '' : 's'} trouvée${count === 1 ? '' : 's'} pour "${query}"`,
    searchNoResults: (query) => `Aucune actualité trouvée pour "${query}".`,
    searchReset: 'Réinitialiser la recherche',
    searchSuggestionsLabel: 'Recherches suggérées :',
    israelOnlyBadge: '🇮🇱 COUVERTURE 100% ISRAËL'
  },
  he: {
    appName: 'WarFeed',
    appSubtitle: 'מכ"ם חי',
    feedTitle: 'עדכוני חדשות בשידור חי',
    feedSubtitle: 'מעקב ישיר ומאומת אחר גורמי ביטחון רשמיים בישראל ובארה"ב',
    realtimeBadge: 'בזמן אמת',
    refreshBtn: 'רענן מידע',
    refreshingBtn: 'מרענן...',
    autoCountdownPrefix: 'עדכון אוטומטי בעוד:',
    lastUpdatedPrefix: 'עדכון אחרון:',
    dispatchesCount: (displayed, total) => `${displayed} מתוך ${total} מבזקים`,
    loadMoreBtn: (remaining) => `טען עוד מבזקים (${remaining} זמינים)`,
    loadingMore: 'בודק מבזקים אחרונים מהשטח...',
    allCaughtUp: 'צפית בכל המבזקים המאומתים · מכ"ם פעיל 24/7',
    trendingLabel: 'נושאים חמים:',
    allOutlets: 'כל הערוצים',
    viewOriginal: '🌐 צפה בשפה המקורית',
    backToLanguage: () => '🇮🇱 חזרה לעברית',
    militaryContext: 'הקשר צבאי',
    hideContext: 'הסתר הקשר',
    contextHeader: 'הקשר מבצעי ומודיעין טקטי',
    systemsInvolved: 'מערכות מעורבות:',
    sourceLinkPrefix: 'מקור מאומת:',
    newBannerTitle: (count) => `⬆️ ישנם ${count} מבזקים חדשים בזמן אמת`,
    newBadge: 'חדש',
    tapToView: 'לחץ לצפייה',
    toastUpdated: (count) => `✓ נוספו ${count} מבזקי מודיעין חדשים`,
    toastUpToDate: '✓ פיד החדשות מעודכן לחלוטין',
    toastDispatches: (count) => `✓ ${count} מבזקים בזמן אמת נטענו`,
    noAlertsTitle: 'אין התרעות פעילות כעת',
    noAlertsSubtitle: 'שקט מוחלט בכל גזרות ההגנה האווירית המנוטרות',
    filterAllCountry: 'סינון: כל הארץ',
    filterCities: (count) => `מסונן לפי ${count} ערים`,
    testSimulation: 'הפעל סימולציית צבע אדום',
    navNews: 'חדשות',
    navSirens: 'התרעות',
    navIntel: 'מודיעין',
    navChannels: 'ערוצים',
    activeAlertsCount: (count) => `${count} פעילות`,
    selectLanguage: 'שפה / Language / Idioma',
    channelVerifyTitle: 'בדיקה פרטנית לפי ערוצים רשמיים',
    channelVerifySubtitle: 'בדיקת ערוצים רשמיים (N12/Mako, ערוץ 13, i24NEWS, CNN, פוקס ניוז, רויטרס, פיקוד העורף)',
    channelsCheckedSummary: (count) => `${count} ערוצים רשמיים נבדקו`,
    channelStatusUpToDate: 'מעודכן · אין מבזקים חדשים',
    channelStatusNew: 'זוהה מבזק חדש',
    noNewInfoDoNothing: 'כל הערוצים הרשמיים מעודכנים. לא זוהה מידע חדש ולא בוצעו שינויים.',
    searchPlaceholder: 'חיפוש במבזקי חדשות ישראל (לדוגמה: תל אביב, כיפת ברזל, ניר דבורי, צה"ל)...',
    searchLabel: 'חיפוש מבזקים ספציפיים על ישראל',
    searchClear: 'נקה חיפוש',
    searchResultsCount: (count, query) => `נמצאו ${count} מבזקים עבור "${query}"`,
    searchNoResults: (query) => `לא נמצאו מבזקים התואמים את "${query}".`,
    searchReset: 'איפוס חיפוש',
    searchSuggestionsLabel: 'חיפושים נפוצים:',
    israelOnlyBadge: '🇮🇱 100% סיקור ישראל'
  }
};

/**
 * Returns localized headline, caption, and analysis for a given FeedPost
 */
export function getPostContent(
  post: FeedPost,
  lang: AppLanguage,
  isOriginal: boolean
): { headline: string; caption: string; analysis: string } {
  if (isOriginal) {
    return {
      headline: post.headline || post.headlineEs || '',
      caption: post.captionOrig,
      analysis: post.analysisEs || ''
    };
  }

  if (lang === 'he') {
    return {
      headline: post.headlineHe || (post.langOrig === 'he' ? (post.captionOrig.length > 70 ? post.captionOrig.slice(0, 70) + '...' : post.captionOrig) : (post.headline || post.headlineEs || '')),
      caption: post.langOrig === 'he' ? post.captionOrig : (post.captionHe || post.captionOrig || post.captionEs),
      analysis: post.analysisEs || ''
    };
  }

  if (lang === 'en') {
    return {
      headline: post.headlineEn || post.headline || post.headlineEs || '',
      caption: post.captionEn || post.captionOrig || post.captionEs,
      analysis: post.analysisEn || post.analysisEs || ''
    };
  }

  if (lang === 'fr') {
    return {
      headline: post.headlineFr || post.headline || post.headlineEs || '',
      caption: post.captionFr || post.captionEs,
      analysis: post.analysisFr || post.analysisEs || ''
    };
  }

  // Default Spanish
  return {
    headline: post.headlineEs || post.headline || '',
    caption: post.captionEs,
    analysis: post.analysisEs || ''
  };
}
