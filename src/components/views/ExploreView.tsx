import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { MOODS_LIST } from '../../data/musicCatalog';
import { Genre, Mood, Song } from '../../types';
import {
  Sparkles,
  Compass,
  Play,
  Shuffle,
  Music4,
  Flame,
  Radio,
} from 'lucide-react';

interface ExploreViewProps {
  setActiveView: (view: string) => void;
  setSelectedArtistId: (id: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ setActiveView, setSelectedArtistId }) => {
  const { songs, playSong, accentColor, toggleSmartShuffle } = useMusic();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const allGenres: Genre[] = [
    'Electronic',
    'Carnatic',
    'Sufi',
    'Hip-Hop',
    'K-Pop',
    'J-Pop',
    'Latin',
    'Folk',
    'Soundtrack',
    'Pop',
    'Acoustic',
  ];

  const filteredSongs = songs.filter((s) => {
    if (selectedMood && !s.mood.includes(selectedMood)) return false;
    if (selectedGenre && s.genre !== selectedGenre) return false;
    return true;
  });

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500 text-neutral-950';
      case 'amber': return 'bg-amber-500 text-neutral-950';
      case 'rose': return 'bg-rose-500 text-neutral-950';
      case 'cyan': return 'bg-cyan-500 text-neutral-950';
      default: return 'bg-emerald-500 text-neutral-950';
    }
  };

  const handlePlayDailyMix = () => {
    // Generate a diverse randomized mix
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    if (shuffled.length > 0) {
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Curated Sound Worlds</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Explore Sonic Landscapes
          </h2>
          <p className="text-sm text-neutral-400">
            Journey across 16 world languages, traditional acoustic masterworks, high-energy global dance rhythms, and meditative states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayDailyMix}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:opacity-95 transition-all ${getAccentBg()}`}
          >
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
            <span>Play Daily Mix</span>
          </button>
          <button
            onClick={toggleSmartShuffle}
            className="px-4 py-3 rounded-xl font-medium text-xs sm:text-sm bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Shuffle className="w-4 h-4" />
            <span>Smart Shuffle</span>
          </button>
        </div>
      </section>

      {/* Mood Mixes Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mood Explorer</span>
          </h3>
          {selectedMood && (
            <button
              onClick={() => setSelectedMood(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MOODS_LIST.map((mood) => {
            const isActive = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(isActive ? null : mood.id)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${mood.gradient} border text-left transition-all relative overflow-hidden h-32 flex flex-col justify-between ${
                  isActive ? 'border-white ring-2 ring-white/30 scale-102' : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{mood.name}</h4>
                  <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2">{mood.description}</p>
                </div>
                {isActive && (
                  <span className="text-[10px] bg-white text-neutral-950 font-bold px-2 py-0.5 rounded-full w-max">
                    Active Filter
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Genres Filter Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Music4 className="w-4 h-4 text-emerald-400" />
            <span>Genres & Traditions</span>
          </h3>
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Reset genre
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {allGenres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(isActive ? null : g)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-950 shadow-md font-bold'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </section>

      {/* Filtered Tracks Results */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-300">
            {selectedMood || selectedGenre ? 'Filtered Selections' : 'Featured Discoveries'}
            <span className="text-xs font-normal text-neutral-500 ml-2">({filteredSongs.length} songs)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => playSong(song, filteredSongs)}
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
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1">
                  <span>{song.language}</span>
                  <span>·</span>
                  <span>{song.genre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
