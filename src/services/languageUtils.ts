import { Language } from '../types';

/**
 * Normalizes Unicode string: trims, lowercases, and folds accents.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Detects language from native scripts or language keywords in query.
 */
export function detectLanguageFromQuery(query: string): Language | null {
  if (!query) return null;
  const q = query.trim();
  const lower = q.toLowerCase();

  // 1. Script checks
  if (/[\u0B80-\u0BFF]/.test(q)) return 'Tamil';
  if (/[\u0C00-\u0C7F]/.test(q)) return 'Telugu';
  if (/[\u0D00-\u0D7F]/.test(q)) return 'Malayalam';
  if (/[\u0C80-\u0CFF]/.test(q)) return 'Kannada';
  if (/[\u0980-\u09FF]/.test(q)) return 'Bengali';
  if (/[\u0A00-\u0A7F]/.test(q)) return 'Punjabi';
  if (/[\u0A80-\u0AFF]/.test(q)) return 'Gujarati';
  if (/[\u0600-\u06FF]/.test(q)) {
    if (lower.includes('urdu') || lower.includes('اردو')) return 'Urdu';
    return 'Arabic';
  }
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(q)) return 'Korean';
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(q)) return 'Japanese';
  if (/[\u0900-\u097F]/.test(q)) {
    if (lower.includes('marathi') || lower.includes('मराठी')) return 'Marathi';
    return 'Hindi';
  }

  // 2. Keyword checks in Latin
  if (/\b(tamil|kollywood|chennai|madras)\b/i.test(lower)) return 'Tamil';
  if (/\b(hindi|bollywood)\b/i.test(lower)) return 'Hindi';
  if (/\b(telugu|tollywood|hyderabad)\b/i.test(lower)) return 'Telugu';
  if (/\b(malayalam|mollywood|kerala|kochi)\b/i.test(lower)) return 'Malayalam';
  if (/\b(kannada|sandalwood|bengaluru|bangalore)\b/i.test(lower)) return 'Kannada';
  if (/\b(punjabi|bhangra)\b/i.test(lower)) return 'Punjabi';
  if (/\b(bengali|bangla|kolkata)\b/i.test(lower)) return 'Bengali';
  if (/\b(marathi|pune|mumbai)\b/i.test(lower)) return 'Marathi';
  if (/\b(gujarati|garba|dandiya)\b/i.test(lower)) return 'Gujarati';
  if (/\b(urdu|ghazal|qawwali)\b/i.test(lower)) return 'Urdu';
  if (/\b(spanish|espanol|latino|flamenco)\b/i.test(lower)) return 'Spanish';
  if (/\b(french|francais|paris)\b/i.test(lower)) return 'French';
  if (/\b(korean|kpop|k-pop|seoul|hallyu)\b/i.test(lower)) return 'Korean';
  if (/\b(japanese|jpop|j-pop|tokyo|anime)\b/i.test(lower)) return 'Japanese';
  if (/\b(arabic|oud|arab)\b/i.test(lower)) return 'Arabic';
  if (/\b(english|western|us|uk)\b/i.test(lower)) return 'English';

  return null;
}

/**
 * Generic intent / stop tokens that describe music search intent
 * across English and native scripts.
 */
const INTENT_STOP_WORDS = [
  // English
  'songs', 'song', 'hits', 'hit', 'music', 'tracks', 'track', 'melody',
  'trending', 'latest', 'new', 'top', 'all', 'best', 'album', 'audio',
  // Tamil
  'பாடல்கள்', 'பாடல்', 'இசை', 'ஹிட்ஸ்', 'பாட்டு', 'பாடல்கள', 'மெலடி',
  // Hindi
  'गाने', 'गाना', 'गीत', 'संगीत', 'धुन', 'हिट्स',
  // Telugu
  'పాటలు', 'పాట', 'సంగీతం', 'హిట్స్',
  // Malayalam
  'ഗാനങ്ങൾ', 'പാട്ടുകൾ', 'സംഗീതം',
  // Kannada
  'ಹಾಡುಗಳು', 'ಗೀತೆಗಳು', 'ಸಂಗೀತ',
  // Punjabi
  'ਗੀਤ', 'ਗਾਣੇ', 'ਸੰਗੀਤ',
  // Spanish
  'canciones', 'cancion', 'musica', 'exitos',
  // Korean
  '노래', '음악', '히트',
  // Japanese
  '曲', '歌', '音楽',
  // Arabic
  'أغاني', 'اغاني', 'موسيقى',
];

/**
 * Strips generic intent tokens and returns core entity keywords + detected language.
 */
export function cleanSearchQuery(query: string): {
  cleaned: string;
  original: string;
  detectedLang: Language | null;
  isBroadLanguageSearch: boolean;
} {
  const original = query.trim();
  const detectedLang = detectLanguageFromQuery(original);
  let cleaned = original;

  // Remove intent words
  for (const word of INTENT_STOP_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, ' ');
    // Also direct unicode replacement without boundary for non-ascii
    if (/[^\x00-\x7F]/.test(word)) {
      cleaned = cleaned.replace(new RegExp(word, 'g'), ' ');
    }
  }

  // Remove language name words if user is searching for language music, e.g. "tamil" from "tamil songs"
  const langWords = [
    'tamil', 'தமிழ்', 'hindi', 'हिंदी', 'telugu', 'తెలుగు', 'malayalam', 'മലയാളം',
    'kannada', 'ಕನ್ನಡ', 'punjabi', 'ਪੰਜਾਬੀ', 'bengali', 'বাংলা', 'marathi', 'मराठी',
    'gujarati', 'ગુજરાતી', 'urdu', 'اردو', 'spanish', 'espanol', 'french', 'francais',
    'korean', '한국어', 'japanese', '日本語', 'arabic', 'العربية', 'english'
  ];

  let isBroadLanguageSearch = false;
  const cleanedLower = cleaned.toLowerCase().trim();

  // If the query was basically "tamil songs", "tamil hits", "தமிழ் பாடல்கள்"
  if (
    detectedLang &&
    (cleanedLower === '' ||
      cleanedLower === detectedLang.toLowerCase() ||
      langWords.some(lw => cleanedLower === lw))
  ) {
    isBroadLanguageSearch = true;
    cleaned = '';
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return {
    cleaned,
    original,
    detectedLang,
    isBroadLanguageSearch,
  };
}

/**
 * Multilingual transliteration dictionary and phonetic alias map.
 * Connects native script and English romanization for artists, songs, and movies.
 */
export const TRANSLITERATION_MAP: Record<string, string[]> = {
  // Tamil Artists
  'anirudh': ['அனிருத்', 'anirudh ravichander', 'அனிருத் ரவிச்சந்தர்', 'rockstar anirudh', 'ani'],
  'அனிருத்': ['anirudh', 'anirudh ravichander', 'அனிருத் ரவிச்சந்தர்'],
  'rahman': ['a.r. rahman', 'ar rahman', 'ஏ.ஆர். ரஹ்மான்', 'ரஹ்மான்', 'arr'],
  'ar rahman': ['rahman', 'a.r. rahman', 'ஏ.ஆர். ரஹ்மான்', 'ரஹ்மான்'],
  'ஏ.ஆர். ரஹ்மான்': ['ar rahman', 'a.r. rahman', 'rahman', 'arr'],
  'sid sriram': ['சித் ஸ்ரீராம்', 'சித்', 'సిద్ శ్రీరామ్', 'sid sriram'],
  'சித் ஸ்ரீராம்': ['sid sriram', 'sid'],
  'harris jayaraj': ['ஹாரிஸ் ஜெயராஜ்', 'harris'],
  'yuvan': ['யுவன்', 'யுவன் சங்கர் ராஜா', 'yuvan shankar raja', 'u1'],
  'ilayaraja': ['இளையராஜா', 'ilaiyaraaja', 'raaja', 'இசைஞானி'],
  'ilaiyaraaja': ['இளையராஜா', 'ilayaraja'],
  'dhanush': ['தனுஷ்', 'dhanush'],
  'vijay': ['விஜய்', 'thalapathy vijay', 'தளபதி விஜய்'],
  'rajini': ['ரஜினி', 'ரஜினிகாந்த்', 'superstar rajinikanth'],
  'kamal haasan': ['கமல் ஹாசன்', 'கமல்'],

  // Tamil Track & Album Names
  'vaanam tholainthatho': ['வானம் தொலைந்ததோ', 'vaanam tholainthatho'],
  'வானம் தொலைந்ததோ': ['vaanam tholainthatho', 'vaanam'],
  'theruvoram': ['தெருவோரம்', 'theruvoram'],
  'தெருவோரம்': ['theruvoram'],
  'neon monsoon': ['நியான் மான்சூன்', 'neon monsoon'],
  'hukum': ['ஹுகும்', 'hukum', 'jailer'],
  'naa ready': ['நா ரெடி', 'naa ready', 'leo'],
  'arabic kuthu': ['அரபிக் குத்து', 'arabic kuthu', 'beast'],
  'chellamma': ['செல்லம்மா', 'chellamma'],
  'kaavaalaa': ['காவாலா', 'kaavaalaa', 'jailer'],
  'vaathi': ['வாத்தி', 'vaathi coming'],
  'enjoy enjaami': ['என்ஜாய் எஞ்சாமி', 'enjoy enjaami'],

  // Hindi Artists & Tracks
  'arijit singh': ['अरिजीत सिंह', 'arijit', 'अरिजीत'],
  'अरिजीत सिंह': ['arijit singh', 'arijit'],
  'noor-e-khuda': ['नूर-ए-खुदा', 'noor e khuda', 'noor'],
  'नूर-ए-खुदा': ['noor-e-khuda', 'noor e khuda'],
  'ap dhillon': ['ਏ ਪੀ ਢਿੱਲੋਂ', 'ap dhillon', 'brown munde'],
  'brown munde': ['ਬ੍ਰਾਉਨ ਮੁੰਡੇ', 'brown munde'],

  // Telugu Artists & Tracks
  'pranama': ['ప్రాణమా', 'pranama'],
  'ప్రాణమా': ['pranama'],
  'anirudh telugu': ['అనిరుధ్', 'anirudh', 'anirudh telugu songs'],
  'అనిరుధ్': ['anirudh', 'anirudh ravichander'],

  // Malayalam
  'aaradhike': ['ആരാധികേ', 'aaradhike'],
  'ആരാധികേ': ['aaradhike'],

  // Kannada
  'belageddu': ['ಬೆಳಗೆದ್ದು', 'belageddu'],
  'ಬೆಳಗೆದ್ದು': ['belageddu'],

  // Korean
  'bts': ['방탄소년단', 'bts', 'jimin', '지민', 'bangtan'],
  'jimin': ['지민', 'jimin', 'bts'],
  '지민': ['jimin', 'bts'],
  '방탄소년단': ['bts', 'bangtan', 'jimin'],
  'ethereal seoul': ['달빛 속으로', 'ethereal seoul'],
  '달빛 속으로': ['ethereal seoul', 'midnight seoul'],

  // Japanese
  'yoasobi': ['ヨアソビ', 'yoasobi', 'ikura', 'ayase'],
  'shibuya signal lights': ['夜を駆ける', 'shibuya signal lights'],
  '夜を駆ける': ['shibuya signal lights', 'yoasobi'],

  // Spanish
  'rosalia': ['rosalía', 'rosalia', 'motomami'],
  'saeta del viento': ['saeta del viento', 'rosalia'],
};

/**
 * Returns all expanded synonyms, transliterations, and alternate spellings for a query.
 */
export function getExpandedSearchTerms(query: string): string[] {
  const norm = normalizeText(query);
  const terms = new Set<string>();
  if (norm) terms.add(norm);

  // Check exact map
  if (TRANSLITERATION_MAP[norm]) {
    TRANSLITERATION_MAP[norm].forEach(t => terms.add(normalizeText(t)));
  }

  // Check substrings & partial matches
  for (const [key, aliases] of Object.entries(TRANSLITERATION_MAP)) {
    const keyNorm = normalizeText(key);
    if (keyNorm.includes(norm) || norm.includes(keyNorm)) {
      terms.add(keyNorm);
      aliases.forEach(a => terms.add(normalizeText(a)));
    }
  }

  return Array.from(terms);
}
