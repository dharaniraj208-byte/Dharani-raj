import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory cache for track resolution
const trackCache = new Map<string, { id: string; title?: string }>();

// Seed catalog mappings for guaranteed fast response
const KNOWN_TRACK_MAPPINGS: Record<string, string> = {
  // Tamil
  'hukum': 'DsjRNPrvq6U',
  'song_tm_hukum': 'DsjRNPrvq6U',
  'naa ready': 'szvt1vD0Uug',
  'song_tm_naaready': 'szvt1vD0Uug',
  'arabic kuthu': '8FAUEv_E_xQ',
  'song_tm_arabic_kuthu': '8FAUEv_E_xQ',
  'vaathi coming': 'fRD_3UOhQPU',
  'song_tm_vaathi_coming': 'fRD_3UOhQPU',
  'marakkuma nenjam': 'eYq7WapuDLU',
  'song_tm_marakkuma': 'eYq7WapuDLU',
  'kolaveri': 'YR12Z8f1Dh8',
  'song_tm_kolaveri': 'YR12Z8f1Dh8',
  'vikram title track': 'p2bUvBf4fOQ',
  'chilla chilla': 'h25c1Zk4Vz4',
  'oorum blood': 'V3t4L4Zk4Vs',

  // Hindi
  'kesariya': 'BddP6PYo2gs',
  'song_hi_kesariya': 'BddP6PYo2gs',
  'apna bana le': 'ElZfdU54Cp8',
  'song_hi_apna_bana_le': 'ElZfdU54Cp8',
  'tum hi ho': 'IJq0yyWUG1k',
  'channa mereya': 'bzSTpdcs-EI',

  // Telugu
  'butta bomma': '6DR5HU6kcbU',
  'song_te_butta_bomma': '6DR5HU6kcbU',
  'srivalli': '5IEbR79kBPY',
  'oo antava': '15j_b0nQYk8',

  // Malayalam
  'malare': '0G2VxhV_g10',
  'song_ml_malare': '0G2VxhV_g10',

  // Kannada
  'belageddu': 'Fmsq8q_0-1A',
  'song_kn_belageddu': 'Fmsq8q_0-1A',

  // Punjabi
  'brown munde': 'VNs_Cg_wCC8',
  'song_pa_brown_munde': 'VNs_Cg_wCC8',

  // English
  'shape of you': '_dK2tDK9grQ',
  'song_en_shape_of_you': '_dK2tDK9grQ',
  'blinding lights': '4NRXx6U8ABQ',
  'song_en_blinding_lights': '4NRXx6U8ABQ',
  'as it was': 'H5v3kku4y6Q',
  'song_en_as_it_was': 'H5v3kku4y6Q',
  'flowers': 'G7KNmW9a75Y',
  'song_en_flowers': 'G7KNmW9a75Y',
  'cruel summer': 'ic8j13piAhQ',

  // Korean
  'dynamite': 'gdZLi9oWNZg',
  'song_ko_dynamite': 'gdZLi9oWNZg',
  'seven': 'QU9c0053UAU',
  'song_ko_seven': 'QU9c0053UAU',

  // Japanese
  'idol': 'ZRtdQ81jPUQ',
  'song_ja_idol': 'ZRtdQ81jPUQ',

  // Spanish
  'despacito': 'kJQP7kiw5Fk',
  'song_es_despacito': 'kJQP7kiw5Fk',
};

for (const [k, v] of Object.entries(KNOWN_TRACK_MAPPINGS)) {
  trackCache.set(k.toLowerCase(), { id: v });
}

function resolveYouTubeTrack(query: string): Promise<{ id: string; title?: string } | null> {
  const norm = query.toLowerCase().trim();
  for (const [k, v] of trackCache.entries()) {
    if (norm.includes(k) || k.includes(norm)) {
      return Promise.resolve(v);
    }
  }

  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const idMatch = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
          const titleMatch = data.match(/"title":\{"runs":\[\{"text":"([^"]+)"/);
          if (idMatch && idMatch[1]) {
            const result = {
              id: idMatch[1],
              title: titleMatch ? titleMatch[1] : undefined,
            };
            trackCache.set(norm, result);
            resolve(result);
          } else {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
  });
}

// API endpoint for authorized full-track resolution
app.get('/api/resolve-track', async (req, res) => {
  const q = String(req.query.q || '');
  const artist = String(req.query.artist || '');
  const title = String(req.query.title || '');
  const songId = String(req.query.songId || '');

  if (songId && KNOWN_TRACK_MAPPINGS[songId]) {
    return res.json({
      success: true,
      trackId: KNOWN_TRACK_MAPPINGS[songId],
      provider: 'youtube',
    });
  }

  const cleanTerm = `${artist} ${title} ${q}`.replace(/\s+/g, ' ').trim();
  if (!cleanTerm) {
    return res.status(400).json({ success: false, error: 'Query parameters required' });
  }

  const result = await resolveYouTubeTrack(`${cleanTerm} official audio`);
  if (result && result.id) {
    return res.json({
      success: true,
      trackId: result.id,
      title: result.title,
      provider: 'youtube',
    });
  }

  return res.status(404).json({
    success: false,
    error: 'Full playback is not available for this track with the current music service.',
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SONORA Master Server] Ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
