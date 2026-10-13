import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { LANGUAGES_LIST } from '../../data/musicCatalog';
import { Language } from '../../types';
import { Globe2, Play, Sparkles, Disc3, Mic2, Radio } from 'lucide-react';

interface LanguagesViewProps {
  setSelectedArtistId: (id: string) => void;
  setSelectedAlbumId: (id: string) => void;
}

export const LanguagesView: React.FC<LanguagesViewProps> = ({
  setSelectedArtistId,
  setSelectedAlbumId,
}) => {
  const { songs, artists, albums, playSong, accentColor } = useMusic();
  const [activeLang, setActiveLang] = useState<Language>('Tamil');

  const langMetadata: Record<Language, { script: string; region: string; description: string; gradient: string }> = {
    Tamil: {
      script: 'தமிழ்',
      region: 'Tamil Nadu & Global Diaspora',
      description: 'Energetic modern kuthu rhythms, cinematic orchestral grandeur, and ancient Carnatic classical heritage.',
      gradient: 'from-amber-600/30 via-red-950/40 to-neutral-950',
    },
    Hindi: {
      script: 'हिन्दी',
      region: 'North & Central India',
      description: 'Bollywood chartbusters, Sufi devotionals, acoustic indie pop, and soulful playback poetry.',
      gradient: 'from-orange-600/30 via-amber-950/40 to-neutral-950',
    },
    Telugu: {
      script: 'తెలుగు',
      region: 'Andhra Pradesh & Telangana',
      description: 'Grand symphonic epics, lilting romantic melodies, and hard-hitting mass beats.',
      gradient: 'from-rose-600/30 via-pink-950/40 to-neutral-950',
    },
    Malayalam: {
      script: 'മലയാളം',
      region: 'Kerala & Coastal South',
      description: 'Subtle acoustic realism, lush organic strings, and poetic rain-drenched indie expressions.',
      gradient: 'from-emerald-600/30 via-teal-950/40 to-neutral-950',
    },
    Kannada: {
      script: 'ಕನ್ನಡ',
      region: 'Karnataka',
      description: 'Lush Bengaluru indie rock, classical fusion, and high-octane sandalwood cinema tracks.',
      gradient: 'from-yellow-600/30 via-amber-950/40 to-neutral-950',
    },
    Bengali: {
      script: 'বাংলা',
      region: 'Bengal & Kolkata',
      description: 'Rabindrasangeet soul, baul folk transcendence, and poetic monsoonal ballads.',
      gradient: 'from-blue-600/30 via-indigo-950/40 to-neutral-950',
    },
    Marathi: {
      script: 'मराठी',
      region: 'Maharashtra',
      description: 'Thunderous dhol-tasha festival energy, lavani folk grooves, and expressive theatrical melodies.',
      gradient: 'from-amber-600/30 via-orange-950/40 to-neutral-950',
    },
    Punjabi: {
      script: 'ਪੰਜਾਬੀ',
      region: 'Punjab & Indo-Canadian Diaspora',
      description: 'Heavy trap beats, infectious bhangra energy, 80s synth-basslines, and folk riffs.',
      gradient: 'from-cyan-600/30 via-blue-950/40 to-neutral-950',
    },
    Gujarati: {
      script: 'ગુજરાતી',
      region: 'Gujarat',
      description: 'Vibrant garba rhythms, festive dandiya celebration, and acoustic folk devotion.',
      gradient: 'from-pink-600/30 via-rose-950/40 to-neutral-950',
    },
    Urdu: {
      script: 'اردو',
      region: 'South Asia & Global',
      description: 'Exquisite ghazals, qawwali spiritual ecstasy, and modern acoustic indie interpretations.',
      gradient: 'from-violet-600/30 via-purple-950/40 to-neutral-950',
    },
    Spanish: {
      script: 'Español',
      region: 'Iberia & Latin America',
      description: 'Nuevo flamenco, infectious reggaeton basslines, and passionate acoustic nylon guitar.',
      gradient: 'from-red-600/30 via-rose-950/40 to-neutral-950',
    },
    French: {
      script: 'Français',
      region: 'France & Francophone World',
      description: 'Sensuous Parisian chanson, jazz manouche, and chic electronic dream pop.',
      gradient: 'from-sky-600/30 via-blue-950/40 to-neutral-950',
    },
    Korean: {
      script: '한국어',
      region: 'South Korea & Global Hallyu',
      description: 'Precision electropop, multi-layered harmonies, R&B grooves, and emotional K-drama ballads.',
      gradient: 'from-fuchsia-600/30 via-violet-950/40 to-neutral-950',
    },
    Japanese: {
      script: '日本語',
      region: 'Japan',
      description: 'High-speed melodic city pop, J-Rock guitars, vocaloid-influenced hooks, and anime masterpieces.',
      gradient: 'from-rose-600/30 via-indigo-950/40 to-neutral-950',
    },
    Arabic: {
      script: 'العربية',
      region: 'Middle East & North Africa',
      description: 'Soulful maqam modal scales, warm oud resonance, and contemporary Gulf pop rhythms.',
      gradient: 'from-amber-700/30 via-yellow-950/40 to-neutral-950',
    },
    English: {
      script: 'English',
      region: 'Global International',
      description: 'Contemporary pop, electronic club anthems, and boundary-pushing studio production.',
      gradient: 'from-teal-600/30 via-slate-900/40 to-neutral-950',
    },
  };

  const currentMeta = langMetadata[activeLang] || langMetadata.Tamil;
  const langSongs = songs.filter((s) => s.language === activeLang);
  const langArtists = artists.filter((a) => a.languages.includes(activeLang));

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500 text-neutral-950';
      case 'amber': return 'bg-amber-500 text-neutral-950';
      case 'rose': return 'bg-rose-500 text-neutral-950';
      case 'cyan': return 'bg-cyan-500 text-neutral-950';
      default: return 'bg-emerald-500 text-neutral-950';
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Globe2 className="w-4 h-4" />
          <span>Multilingual Music Ecosystem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          Languages & Regions
        </h2>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Dive deep into any of 16 supported languages. Explore authentic regional instruments, top local composers, and chart-topping songs.
        </p>
      </div>

      {/* Horizontal Language Cards Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
        {LANGUAGES_LIST.map((lang) => {
          const meta = langMetadata[lang];
          const isSelected = activeLang === lang;
          return (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-neutral-800 border-white ring-2 ring-white/20 shadow-lg scale-102'
                  : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-base font-bold text-white">{lang}</span>
                <span className="text-xs font-bold text-neutral-400 font-mono opacity-80">
                  {meta?.script}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 truncate">
                {songs.filter((s) => s.language === lang).length} tracks
              </span>
            </button>
          );
        })}
      </div>

      {/* Regional Spotlight Banner for the Selected Language */}
      <section className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${currentMeta.gradient} border border-neutral-800/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{activeLang}</span>
            <span className="text-lg text-emerald-400 font-mono font-bold">({currentMeta.script})</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
            {currentMeta.region}
          </p>
          <p className="text-sm text-neutral-200">
            {currentMeta.description}
          </p>
        </div>

        {langSongs.length > 0 && (
          <button
            onClick={() => playSong(langSongs[0], langSongs)}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:opacity-95 transition-all shrink-0 ${getAccentBg()}`}
          >
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
            <span>Play All {activeLang} Hits</span>
          </button>
        )}
      </section>

      {/* Selected Language Top Songs */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-emerald-400" />
          <span>Trending in {activeLang}</span>
        </h3>

        {langSongs.length === 0 ? (
          <div className="p-8 text-center bg-neutral-950/40 rounded-2xl border border-neutral-900 text-neutral-500 text-xs">
            No tracks in catalog currently for {activeLang}. Use the Admin panel to add songs!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {langSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, langSongs)}
                className="group p-3 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1 font-mono">
                    <span>{song.genre}</span>
                    <span>·</span>
                    <span>{(song.playCount / 1000).toFixed(0)}k plays</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Artists in this language */}
      {langArtists.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-amber-400" />
            <span>Notable Artists</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {langArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => setSelectedArtistId(artist.id)}
                className="group p-4 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 text-center transition-all cursor-pointer"
              >
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border border-neutral-800 group-hover:border-emerald-500/50 transition-colors">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{artist.name}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                  {(artist.monthlyListeners / 1000000).toFixed(1)}M listeners
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
