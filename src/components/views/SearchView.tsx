import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { musicProvider } from '../../services/musicProvider';
import { detectLanguageFromQuery } from '../../services/languageUtils';
import { LANGUAGES_LIST, MOODS_LIST } from '../../data/musicCatalog';
import { Song, Artist, Album, SearchSortOption, Language, Genre } from '../../types';
import {
  Search,
  X,
  History,
  TrendingUp,
  Play,
  Pause,
  SlidersHorizontal,
  Music,
  User,
  Disc,
  Clock,
  Heart,
  ListPlus,
  Loader2,
  Sparkles,
  Globe2,
  AlertCircle,
} from 'lucide-react';

interface SearchViewProps {
  setSelectedArtistId: (id: string) => void;
  setSelectedAlbumId: (id: string) => void;
  setActiveView: (view: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  setSelectedArtistId,
  setSelectedAlbumId,
  setActiveView,
}) => {
  const {
    songs: allCatalogSongs,
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    toggleFavoriteSong,
    isSongFavorite,
    addToQueue,
    accentColor,
    addNotification,
  } = useMusic();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');

  const [isLoading, setIsLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState<Language | null>(null);

  const [searchSongs, setSearchSongs] = useState<Song[]>([]);
  const [searchArtists, setSearchArtists] = useState<Artist[]>([]);
  const [searchAlbums, setSearchAlbums] = useState<Album[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Tamil songs',
    'Anirudh',
    'தமிழ் பாடல்கள்',
    'A.R. Rahman',
    'Hindi songs',
    'Hukum',
  ]);

  const trendingSearches = [
    'Tamil songs',
    'தமிழ் பாடல்கள்',
    'Anirudh',
    'Hukum - Jailer',
    'A.R. Rahman',
    'Naa Ready',
    'Sid Sriram',
    'Hindi songs',
    'Telugu hits',
    'BTS Jimin',
  ];

  // 350ms Debounce Query
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      const detected = detectLanguageFromQuery(query);
      setDetectedLang(detected);
    }, 350);

    return () => clearTimeout(handler);
  }, [query]);

  // Execute Search via MusicProvider
  useEffect(() => {
    let isCancelled = false;

    async function executeSearch() {
      if (!debouncedQuery.trim() && selectedLanguage === 'All' && selectedGenre === 'All' && selectedMood === 'All') {
        setIsLoading(false);
        setHasSearched(false);
        setSearchSongs([]);
        setSearchArtists([]);
        setSearchAlbums([]);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const filters = {
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          genre: selectedGenre !== 'All' ? selectedGenre : undefined,
          mood: selectedMood !== 'All' ? selectedMood : undefined,
          releaseYear: selectedYear !== 'All' ? parseInt(selectedYear) : undefined,
        };

        const result = await musicProvider.search(debouncedQuery, filters, sortBy);

        if (!isCancelled) {
          setSearchSongs(result.songs);
          setSearchArtists(result.artists);
          setSearchAlbums(result.albums);
          if (result.detectedLanguage) {
            setDetectedLang(result.detectedLanguage);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Search error', err);
          setIsLoading(false);
        }
      }
    }

    executeSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, selectedLanguage, selectedGenre, selectedMood, selectedYear, sortBy]);

  const handleSelectQuery = (text: string) => {
    setQuery(text);
    if (text.trim() && !recentSearches.includes(text.trim())) {
      setRecentSearches(prev => [text.trim(), ...prev].slice(0, 8));
    }
  };

  const handleClearQuery = () => {
    setQuery('');
    setDebouncedQuery('');
    setHasSearched(false);
  };

  const clearRecent = () => setRecentSearches([]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500 text-neutral-950 shadow-violet-500/20';
      case 'amber': return 'bg-amber-500 text-neutral-950 shadow-amber-500/20';
      case 'rose': return 'bg-rose-500 text-neutral-950 shadow-rose-500/20';
      case 'cyan': return 'bg-cyan-500 text-neutral-950 shadow-cyan-500/20';
      default: return 'bg-emerald-500 text-neutral-950 shadow-emerald-500/20';
    }
  };

  const getAccentText = () => {
    switch (accentColor) {
      case 'violet': return 'text-violet-400';
      case 'amber': return 'text-amber-400';
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-emerald-400';
    }
  };

  const loadingLanguageText = detectedLang
    ? `Searching for ${detectedLang} songs...`
    : debouncedQuery.toLowerCase().includes('tamil')
    ? 'Searching for Tamil songs...'
    : 'Searching authorized music catalog & providers...';

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Search Header & Input Box */}
      <div className="space-y-3">
        <div className="relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums in Tamil (தமிழ்), Hindi, English..."
              className="w-full pl-12 pr-28 py-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-lg"
              autoFocus
            />

            {/* Language Detection Pill / Clear button */}
            <div className="absolute right-3 flex items-center gap-2">
              {detectedLang && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold">
                  <Globe2 className="w-3 h-3" />
                  <span>{detectedLang}</span>
                </span>
              )}
              {query && (
                <button
                  onClick={handleClearQuery}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono py-1 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{loadingLanguageText}</span>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 border-b border-neutral-800/60 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Language dropdown */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Languages</option>
          {LANGUAGES_LIST.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Genre dropdown */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Genres</option>
          {['Electronic', 'Carnatic', 'Sufi', 'Soundtrack', 'Hip-Hop', 'Pop', 'Acoustic', 'Folk', 'K-Pop', 'J-Pop', 'Latin'].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Mood dropdown */}
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Moods</option>
          {MOODS_LIST.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Year dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        {/* Sort By */}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-neutral-400">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SearchSortOption)}
            className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="popularity">Popularity</option>
            <option value="latest">Latest Year</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
          </select>
        </div>
      </div>

      {/* Default State: Recent & Trending Searches (when user hasn't typed anything) */}
      {!hasSearched && !query.trim() && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Recent searches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Recent Searches
              </h3>
              {recentSearches.length > 0 && (
                <button onClick={clearRecent} className="text-xs text-neutral-400 hover:text-white">
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectQuery(term)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Trending searches */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Trending Multilingual Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectQuery(term)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 text-xs text-neutral-300 hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Area */}
      {hasSearched && (
        <div className="space-y-8 pt-2">
          {/* Artists Match */}
          {searchArtists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Artists ({searchArtists.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {searchArtists.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setSelectedArtistId(art.id);
                      setActiveView('artist');
                    }}
                    className="p-3 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-neutral-800">
                      <img
                        src={art.avatarUrl}
                        alt={art.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{art.name}</h4>
                      <p className="text-[10px] text-neutral-400">
                        {art.languages.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums Match */}
          {searchAlbums.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Disc className="w-4 h-4 text-emerald-400" />
                <span>Albums ({searchAlbums.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {searchAlbums.map((alb) => (
                  <div
                    key={alb.id}
                    onClick={() => {
                      setSelectedAlbumId(alb.id);
                      setActiveView('album');
                    }}
                    className="p-3 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                      <img
                        src={alb.coverUrl}
                        alt={alb.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{alb.title}</h4>
                      <p className="text-[10px] text-neutral-400 truncate">{alb.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Songs Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                <span>Songs ({searchSongs.length})</span>
              </h3>
            </div>

            {/* EMPTY STATE (Requirement 13) */}
            {!isLoading && searchSongs.length === 0 && searchArtists.length === 0 && (
              <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950/60 border border-neutral-800/80 text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-800">
                  <AlertCircle className="w-7 h-7 text-amber-400" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="text-lg font-bold text-white">No songs found</h4>
                  <p className="text-xs text-neutral-400">
                    We couldn't find a matching song for "<span className="text-neutral-200 font-semibold">{debouncedQuery || query}</span>".
                  </p>
                </div>

                {/* Guidance List */}
                <div className="bg-neutral-900/60 max-w-sm mx-auto p-4 rounded-2xl border border-neutral-800 text-left text-xs text-neutral-300 space-y-1.5">
                  <p className="font-semibold text-white pb-1">Search suggestions:</p>
                  <p className="text-neutral-400">• Check the spelling or try a shorter title</p>
                  <p className="text-neutral-400">• Search by artist name (e.g. Anirudh, A.R. Rahman)</p>
                  <p className="text-neutral-400">• Try native script (e.g. தமிழ் பாடல்கள், அனிருத்)</p>
                  <p className="text-neutral-400">• Clear active genre/year filters</p>
                </div>

                {/* Suggested Search Chips */}
                <div className="space-y-2">
                  <p className="text-xs text-neutral-400">Try these popular authorized searches:</p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                    {['Tamil songs', 'Anirudh', 'தமிழ் பாடல்கள்', 'Hukum', 'A.R. Rahman', 'Sid Sriram', 'Naa Ready'].map((suggested) => (
                      <button
                        key={suggested}
                        onClick={() => handleSelectQuery(suggested)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-white transition-colors"
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SONGS LIST UI (Requirement 5) */}
            {searchSongs.length > 0 && (
              <div className="space-y-2">
                {searchSongs.map((song) => {
                  const isCurrent = currentSong?.id === song.id;
                  const isPlayingThis = isCurrent && isPlaying;
                  const isFav = isSongFavorite(song.id);
                  const isPlayable = song.isPlayable !== false;

                  return (
                    <div
                      key={song.id}
                      className={`group flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-neutral-900/90 border-neutral-700 shadow-md'
                          : 'bg-neutral-950/60 border-neutral-900 hover:bg-neutral-900/70 hover:border-neutral-800'
                      }`}
                    >
                      {/* Left: Artwork & Details */}
                      <div
                        onClick={() => isPlayable && playSong(song, searchSongs)}
                        className={`flex items-center gap-3.5 min-w-0 flex-1 ${isPlayable ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {/* Album Art with Play Button Overlay */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-neutral-800">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isPlayable ? (
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              {isPlayingThis ? (
                                <Pause className="w-5 h-5 text-white fill-current" />
                              ) : (
                                <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                              )}
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-neutral-400 font-mono">
                              Offline
                            </div>
                          )}
                        </div>

                        {/* Title, Artist, Language • Album metadata */}
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? getAccentText() : 'text-white'}`}>
                              {song.title}
                            </h4>
                            {song.nativeTitle && (
                              <span className="text-[11px] text-neutral-400 font-medium truncate hidden md:inline">
                                ({song.nativeTitle})
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-neutral-300 truncate mt-0.5">
                            {song.artist}
                            {song.nativeArtist && <span className="opacity-70 ml-1">· {song.nativeArtist}</span>}
                          </p>

                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5 truncate">
                            <span className="font-semibold text-neutral-300">{song.language}</span>
                            <span>•</span>
                            <span className="truncate">{song.album}</span>
                            {song.genre && (
                              <>
                                <span>•</span>
                                <span>{song.genre}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions, Play Button / Preview Unavailable */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Duration */}
                        <span className="text-xs font-mono text-neutral-400 tabular-nums hidden sm:inline mr-2">
                          {formatDuration(song.duration)}
                        </span>

                        {/* Favorite button */}
                        <button
                          onClick={() => toggleFavoriteSong(song.id)}
                          className={`p-2 rounded-xl hover:bg-neutral-800 transition-colors ${
                            isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
                          }`}
                          title="Like Song"
                          aria-label="Favorite"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>

                        {/* Add to Queue */}
                        <button
                          onClick={() => addToQueue(song)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="Add to queue"
                          aria-label="Add to Queue"
                        >
                          <ListPlus className="w-4 h-4" />
                        </button>

                        {/* Availability check: Play (Full Track), Preview (30s), or Unavailable */}
                        {song.fullTrackAvailable ? (
                          <button
                            onClick={() => {
                              if (isCurrent) {
                                togglePlay();
                              } else {
                                playSong(song, searchSongs);
                              }
                            }}
                            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 ${
                              isCurrent && isPlaying
                                ? 'bg-neutral-800 text-white border border-neutral-700'
                                : `${getAccentBg()}`
                            }`}
                            aria-label={isPlayingThis ? 'Pause' : 'Play full track'}
                          >
                            {isPlayingThis ? (
                              <>
                                <Pause className="w-3.5 h-3.5 fill-current" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                                <span>Play</span>
                              </>
                            )}
                          </button>
                        ) : song.previewAvailable ? (
                          <button
                            onClick={() => {
                              if (isCurrent) {
                                togglePlay();
                              } else {
                                playSong(song, searchSongs);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 border ${
                              isCurrent && isPlaying
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border-neutral-700'
                            }`}
                            aria-label={isPlayingThis ? 'Pause preview' : 'Play preview'}
                            title="30-Second Preview"
                          >
                            {isPlayingThis ? (
                              <>
                                <Pause className="w-3.5 h-3.5 fill-current" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                                <span>Preview</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl text-[11px] font-mono text-neutral-500 bg-neutral-900 border border-neutral-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
