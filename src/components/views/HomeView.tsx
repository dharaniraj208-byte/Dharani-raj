import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Song, Mood } from '../../types';
import { MOODS_LIST } from '../../data/musicCatalog';
import {
  Play,
  Pause,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  Radio,
  Flame,
  Globe2,
  Disc,
  Compass,
} from 'lucide-react';

interface HomeViewProps {
  setActiveView: (view: string) => void;
  setSelectedArtistId: (id: string) => void;
  setSelectedAlbumId: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveView,
  setSelectedArtistId,
  setSelectedAlbumId,
}) => {
  const {
    songs,
    artists,
    albums,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    toggleFavoriteSong,
    isSongFavorite,
    selectedLanguages,
    recentlyPlayed,
    accentColor,
  } = useMusic();

  // Filter songs based on user-selected languages (if any)
  const filteredSongs = selectedLanguages.length > 0
    ? songs.filter((s) => selectedLanguages.includes(s.language))
    : songs;

  // Personalized Quick Picks
  const quickPicks = filteredSongs.slice(0, 6);

  // Trending Now (sorted by play count)
  const trendingNow = [...filteredSongs].sort((a, b) => b.playCount - a.playCount).slice(0, 8);

  // New Releases (year 2026 first)
  const newReleases = [...filteredSongs].filter((s) => s.releaseYear >= 2025).slice(0, 8);

  // Regional Language groups
  const regionalGroups = [
    { name: 'Tamil Hits', lang: 'Tamil' as const },
    { name: 'Hindi Hits', lang: 'Hindi' as const },
    { name: 'Telugu & Malayalam Hits', lang: 'Telugu' as const },
    { name: 'Global Hits (K-Pop & English)', lang: 'Korean' as const },
  ];

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500 text-neutral-950 shadow-violet-500/20';
      case 'amber': return 'bg-amber-500 text-neutral-950 shadow-amber-500/20';
      case 'rose': return 'bg-rose-500 text-neutral-950 shadow-rose-500/20';
      case 'cyan': return 'bg-cyan-500 text-neutral-950 shadow-cyan-500/20';
      default: return 'bg-emerald-500 text-neutral-950 shadow-emerald-500/20';
    }
  };

  const heroSong = songs.find((s) => s.id === 'song_1') || songs[0];

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Featured Spotlight Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl group">
        <div className="absolute inset-0 bg-neutral-950">
          <img
            src="/src/assets/images/hero_spotlight_banner_1791377958114.jpg"
            alt="Hero Spotlight"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-65 group-hover:scale-102 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-end min-h-[320px] sm:min-h-[380px] max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Featured Spotlight · Global Multilingual Premiere</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            {heroSong.title}
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 line-clamp-2">
            Experience studio master acoustics by {heroSong.artist}. Fusing cinematic Tamil synth-grooves with modern club aesthetics.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => playSong(heroSong, songs)}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${getAccentBg()}`}
            >
              {currentSong?.id === heroSong.id && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Track</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  <span>Play Master Stream</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedAlbumId(heroSong.albumId);
                setActiveView('album');
              }}
              className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700/60 backdrop-blur-md transition-colors"
            >
              View Album
            </button>
          </div>
        </div>
      </section>

      {/* Quick Picks 6-Card Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Quick Picks</span>
              <span className="text-xs font-normal text-neutral-400">· Based on your taste</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPicks.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            const isPlayingThis = isCurrent && isPlaying;

            return (
              <div
                key={song.id}
                onClick={() => playSong(song, quickPicks)}
                className={`group flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-neutral-900 border-neutral-700 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-900 hover:bg-neutral-900/60 hover:border-neutral-800'
                }`}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isPlayingThis ? (
                      <Pause className="w-5 h-5 text-white fill-current" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {song.artist} · <span className="opacity-80">{song.language}</span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteSong(song.id);
                  }}
                  className={`p-2 rounded-lg text-neutral-500 hover:text-white transition-colors ${
                    isSongFavorite(song.id) ? 'text-rose-500' : ''
                  }`}
                  aria-label="Favorite"
                >
                  <Heart className={`w-4 h-4 ${isSongFavorite(song.id) ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Continue Listening (Recently Played) */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>Continue Listening</span>
            </h3>
            <button
              onClick={() => setActiveView('history')}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyPlayed.slice(0, 6).map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, recentlyPlayed)}
                className="group p-3 rounded-2xl bg-neutral-950/40 hover:bg-neutral-900/60 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Now */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Trending Now</h3>
          </div>
          <span className="text-xs text-neutral-400">High engagement this week</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingNow.map((song, idx) => (
            <div
              key={song.id}
              onClick={() => playSong(song, trendingNow)}
              className="group p-3 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900/80 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 font-bold">
                    #{idx + 1}
                  </span>
                  <button
                    className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2 border-t border-neutral-900 mt-2 font-mono">
                <span>{song.language}</span>
                <span>{(song.playCount / 1000).toFixed(0)}k plays</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mood Mixes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Mood Mixes</h3>
          </div>
          <button
            onClick={() => setActiveView('explore')}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Explore all moods
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MOODS_LIST.slice(0, 5).map((mood) => {
            const moodSongs = songs.filter((s) => s.mood.includes(mood.id));
            return (
              <div
                key={mood.id}
                onClick={() => {
                  if (moodSongs.length > 0) playSong(moodSongs[0], moodSongs);
                }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${mood.gradient} border border-neutral-800/60 hover:border-neutral-700/80 transition-all cursor-pointer group flex flex-col justify-between h-36`}
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:underline">{mood.name}</h4>
                  <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2">{mood.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-neutral-400">{moodSongs.length} tracks</span>
                  <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Across Languages Regional Showcase */}
      {regionalGroups.map((group) => {
        const regionalSongs = songs.filter((s) => s.language === group.lang);
        if (regionalSongs.length === 0) return null;

        return (
          <section key={group.name} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>{group.name}</span>
              </h3>
              <button
                onClick={() => setActiveView('languages')}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                View region
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {regionalSongs.slice(0, 4).map((song) => (
                <div
                  key={song.id}
                  onClick={() => playSong(song, regionalSongs)}
                  className="group p-3 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{song.artist}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
