import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Song,
  Artist,
  Album,
  Playlist,
  Language,
  AudioQuality,
  EqualizerPreset,
  ThemeMode,
  AccentColor,
  RepeatMode,
  NotificationItem,
  ListeningStat,
  PlayerState,
  PlaybackDiagnostics,
  PlaybackType,
  PlaybackSourceResult,
} from '../types';
import {
  SONGS_DATA,
  ARTISTS_DATA,
  ALBUMS_DATA,
  PLAYLISTS_DATA,
  LANGUAGES_LIST,
} from '../data/musicCatalog';
import { audioEngine, EQUALIZER_PRESETS } from '../services/audioEngine';
import { musicProvider } from '../services/musicProvider';

interface FavoritesState {
  songIds: string[];
  artistIds: string[];
  albumIds: string[];
  playlistIds: string[];
}

interface MusicContextType {
  // Current playback
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  isSmartShuffle: boolean;

  // Queue
  queue: Song[];
  queueIndex: number;

  // Catalog
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  recentlyPlayed: Song[];
  favorites: FavoritesState;

  // Language filter
  selectedLanguages: Language[];
  toggleLanguageFilter: (lang: Language) => void;
  selectAllLanguages: () => void;
  clearLanguageFilters: () => void;

  // Audio settings
  audioQuality: AudioQuality;
  setAudioQuality: (q: AudioQuality) => void;
  equalizerPreset: EqualizerPreset;
  setEqualizerPreset: (p: EqualizerPreset) => void;
  equalizerBands: number[];
  setEqualizerBandGain: (bandIdx: number, val: number) => void;
  bassBoost: number;
  setBassBoost: (val: number) => void;
  trebleBoost: number;
  setTrebleBoost: (val: number) => void;
  stereoBalance: number;
  setStereoBalance: (val: number) => void;
  crossfade: number;
  setCrossfade: (val: number) => void;
  gapless: boolean;
  setGapless: (val: boolean) => void;

  // Modals & Panels
  isFullscreenPlayerOpen: boolean;
  setIsFullscreenPlayerOpen: (open: boolean) => void;
  isAudioSettingsOpen: boolean;
  setIsAudioSettingsOpen: (open: boolean) => void;
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean) => void;
  isLyricsOpen: boolean;
  setIsLyricsOpen: (open: boolean) => void;
  isDiagnosticsOpen: boolean;
  setIsDiagnosticsOpen: (open: boolean) => void;

  // Diagnostics & Player state (Step 12 & 14)
  playerState: PlayerState;
  diagnostics: PlaybackDiagnostics;
  playTestTrack: () => Promise<void>;

  // Error state & retries
  playbackError: { song: Song; message: string } | null;
  retryPlayback: () => void;
  playAlternativeVersion: () => void;
  dismissPlaybackError: () => void;

  // Playback actions
  playSong: (song: Song, contextQueue?: Song[], openPlayerScreen?: boolean) => void;
  playFullTrack: (songId: string) => Promise<void>;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  toggleSmartShuffle: () => void;

  // Queue actions
  addToQueue: (song: Song) => void;
  playNextInQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  saveQueueAsPlaylist: (title: string) => void;

  // Favorites
  toggleFavoriteSong: (songId: string) => void;
  toggleFavoriteArtist: (artistId: string) => void;
  toggleFavoriteAlbum: (albumId: string) => void;
  toggleFavoritePlaylist: (playlistId: string) => void;
  isSongFavorite: (songId: string) => boolean;

  // Playlists
  createPlaylist: (title: string, description?: string, coverUrl?: string) => Playlist;
  renamePlaylist: (id: string, newTitle: string, newDesc?: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  duplicatePlaylist: (playlistId: string) => void;

  // Offline / Downloads
  downloadedSongIds: string[];
  downloadingSongIds: string[];
  toggleDownloadSong: (songId: string) => void;
  deleteDownload: (songId: string) => void;

  // Listening Stats & Analytics
  stats: ListeningStat;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;

  // Theme & Appearance
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (a: AccentColor) => void;

  // Admin Catalog actions
  addCustomSong: (song: Song) => void;
  deleteSongFromCatalog: (songId: string) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Catalog State
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('sonora_custom_songs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...SONGS_DATA, ...parsed];
      } catch {
        return SONGS_DATA;
      }
    }
    return SONGS_DATA;
  });

  const [artists] = useState<Artist[]>(ARTISTS_DATA);
  const [albums] = useState<Album[]>(ALBUMS_DATA);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('sonora_playlists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PLAYLISTS_DATA;
      }
    }
    return PLAYLISTS_DATA;
  });

  // Playback State
  const [currentSong, setCurrentSong] = useState<Song | null>(SONGS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SONGS_DATA[0].duration);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(0.85);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isSmartShuffle, setIsSmartShuffle] = useState<boolean>(false);

  // Queue State
  const [queue, setQueue] = useState<Song[]>(SONGS_DATA.slice(0, 10));
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => [SONGS_DATA[0], SONGS_DATA[1], SONGS_DATA[2]]);

  // Favorites
  const [favorites, setFavorites] = useState<FavoritesState>(() => {
    const saved = localStorage.getItem('sonora_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { songIds: ['song_1', 'song_2', 'song_14'], artistIds: ['art_anirudh', 'art_ar_rahman'], albumIds: ['alb_neon_monsoon'], playlistIds: ['pl_curated_south'] };
      }
    }
    return { songIds: ['song_1', 'song_2', 'song_14'], artistIds: ['art_anirudh', 'art_ar_rahman'], albumIds: ['alb_neon_monsoon'], playlistIds: ['pl_curated_south'] };
  });

  // Languages filter (empty = all languages selected)
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);

  // Audio settings
  const [audioQuality, setAudioQuality] = useState<AudioQuality>('high');
  const [equalizerPreset, setEqualizerPresetState] = useState<EqualizerPreset>('Flat');
  const [equalizerBands, setEqualizerBands] = useState<number[]>([0, 0, 0, 0, 0]);
  const [bassBoost, setBassBoostState] = useState<number>(0);
  const [trebleBoost, setTrebleBoostState] = useState<number>(0);
  const [stereoBalance, setStereoBalanceState] = useState<number>(0);
  const [crossfade, setCrossfade] = useState<number>(2); // seconds
  const [gapless, setGapless] = useState<boolean>(true);

  // Modals
  const [isFullscreenPlayerOpen, setIsFullscreenPlayerOpen] = useState<boolean>(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);

  // Offline / Downloads
  const [downloadedSongIds, setDownloadedSongIds] = useState<string[]>(['song_1', 'song_2', 'song_14']);
  const [downloadingSongIds, setDownloadingSongIds] = useState<string[]>([]);

  // Stats
  const [stats, setStats] = useState<ListeningStat>(() => {
    const saved = localStorage.getItem('sonora_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          totalMinutes: 342,
          songsPlayedCount: 88,
          topArtistId: 'art_anirudh',
          topLanguage: 'Tamil',
          topGenre: 'Electronic',
          mostPlayedSongId: 'song_1',
          dailyMinutes: {
            'Mon': 45,
            'Tue': 62,
            'Wed': 38,
            'Thu': 70,
            'Fri': 55,
            'Sat': 48,
            'Sun': 24,
          },
        };
      }
    }
    return {
      totalMinutes: 342,
      songsPlayedCount: 88,
      topArtistId: 'art_anirudh',
      topLanguage: 'Tamil',
      topGenre: 'Electronic',
      mostPlayedSongId: 'song_1',
      dailyMinutes: {
        'Mon': 45,
        'Tue': 62,
        'Wed': 38,
        'Thu': 70,
        'Fri': 55,
        'Sat': 48,
        'Sun': 24,
      },
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'New Release: Neon Monsoon',
      message: 'Anirudh Ravichander just released "Vaanam Tholainthatho" in Tamil with studio master audio.',
      timestamp: '10m ago',
      read: false,
      type: 'release',
    },
    {
      id: 'notif_2',
      title: 'Your Daily Mix is ready',
      message: 'Curated mix based on your love for South Asian indie and K-Pop grooves.',
      timestamp: '2h ago',
      read: false,
      type: 'recommendation',
    },
    {
      id: 'notif_3',
      title: 'Offline Sync Complete',
      message: '3 authorized tracks cached for high fidelity offline listening.',
      timestamp: '1d ago',
      read: true,
      type: 'download',
    },
  ]);

  // Theme & Appearance
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('emerald');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('sonora_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('sonora_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('sonora_stats', JSON.stringify(stats));
  }, [stats]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.remove('amoled');
    } else if (theme === 'amoled') {
      root.classList.add('dark');
      root.classList.add('amoled');
    } else {
      root.classList.add('dark');
      root.classList.remove('amoled');
    }
  }, [theme]);

  // Diagnostics & Player State (Step 12 & 14)
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [diagnostics, setDiagnostics] = useState<PlaybackDiagnostics>(() => audioEngine.getDiagnostics());
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);

  useEffect(() => {
    audioEngine.setDiagnosticsListener((diag) => {
      setDiagnostics(diag);
    });
  }, []);

  // Playback Error State
  const [playbackError, setPlaybackError] = useState<{ song: Song; message: string } | null>(null);

  const handleTrackEndRef = useRef<() => void>(() => {});

  // Time progress listener
  const handleTimeTick = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  // STEP 4: Play track with authorized source check, real player, and zero fake URLs
  const playSong = useCallback(async (song: Song, contextQueue?: Song[], openPlayerScreen: boolean = true) => {
    setPlaybackError(null);
    setCurrentSong(song);
    setCurrentTime(0);

    // Automatically display the player screen when song is played so user gets full Now Playing interface
    if (openPlayerScreen) {
      setIsFullscreenPlayerOpen(true);
    }

    // STEP 2 & 4: Obtain authorized playback source
    const playback = await musicProvider.getPlaybackSource(song.id);

    if (!playback || !playback.canPlay || (!playback.url && !playback.youtubeId)) {
      let errorMsg = playback?.error || 'This song is currently unavailable for playback.';
      if (playback?.requiresSubscription) {
        errorMsg = 'Full playback is not available for this track with the current music service.';
      }
      setPlaybackError({ song, message: errorMsg });
      setIsPlaying(false);
      setPlayerState('error');
      return;
    }

    // Determine initial duration from authorized playback session (full length vs preview length)
    const initialDuration = playback.duration || song.duration || 180;
    setDuration(initialDuration);

    if (contextQueue && contextQueue.length > 0) {
      setQueue(contextQueue);
      const idx = contextQueue.findIndex(s => s.id === song.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      const existingIdx = queue.findIndex(s => s.id === song.id);
      if (existingIdx !== -1) {
        setQueueIndex(existingIdx);
      } else {
        setQueue(prev => [song, ...prev]);
        setQueueIndex(0);
      }
    }

    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 30);
    });

    setStats(prev => ({
      ...prev,
      songsPlayedCount: prev.songsPlayedCount + 1,
      totalMinutes: prev.totalMinutes + Math.round(initialDuration / 60),
    }));

    const result = await audioEngine.playSong(song, playback, {
      onTimeUpdate: (t, d) => {
        setCurrentTime(t);
        if (d && !isNaN(d) && isFinite(d) && d > 0) {
          setDuration(d);
        }
      },
      onTrackEnd: () => {
        handleTrackEndRef.current();
      },
      onStateChange: (state) => {
        setPlayerState(state);
        setIsPlaying(state === 'playing');
      },
    });

    if (!result.success) {
      setPlaybackError({
        song,
        message: result.error || 'Playback error occurred.',
      });
      setIsPlaying(false);
      setPlayerState('error');
    }
  }, [queue]);

  const playFullTrack = useCallback(async (songId: string) => {
    let target = songs.find(s => s.id === songId);
    if (!target) {
      target = (await musicProvider.getSong(songId)) || undefined;
    }
    if (target) {
      await playSong(target);
    }
  }, [songs, playSong]);

  const playTestTrack = useCallback(async () => {
    setPlaybackError(null);
    const result = await audioEngine.playTestTrack();
    if (result.success) {
      const current = audioEngine.getCurrentSong();
      if (current) {
        setCurrentSong(current);
        setDuration(current.duration);
        setIsPlaying(true);
        setPlayerState('playing');
      }
    } else {
      setPlaybackError({
        song: audioEngine.getCurrentSong() || songs[0],
        message: result.error || 'Failed to play test audio file.',
      });
    }
  }, [songs]);

  const retryPlayback = useCallback(() => {
    if (playbackError?.song) {
      const s = playbackError.song;
      setPlaybackError(null);
      playSong(s);
    }
  }, [playbackError, playSong]);

  const playAlternativeVersion = useCallback(() => {
    if (playbackError?.song) {
      playSong(playbackError.song);
    }
  }, [playbackError, playSong]);

  const dismissPlaybackError = useCallback(() => {
    setPlaybackError(null);
  }, []);

  const togglePlay = useCallback(async () => {
    if (!currentSong) {
      if (songs.length > 0) playSong(songs[0]);
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
      setPlayerState('paused');
    } else {
      const resumed = await audioEngine.resume();
      if (resumed) {
        setIsPlaying(true);
        setPlayerState('playing');
      } else {
        playSong(currentSong);
      }
    }
  }, [currentSong, isPlaying, songs, playSong]);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    if (isShuffle || isSmartShuffle) {
      let candidateIndices = queue
        .map((_, i) => i)
        .filter(i => i !== queueIndex);

      if (isSmartShuffle) {
        const smartCandidates = candidateIndices.filter(i => {
          const s = queue[i];
          return favorites.songIds.includes(s.id) || (currentSong && s.language !== currentSong.language);
        });
        if (smartCandidates.length > 0) {
          candidateIndices = smartCandidates;
        }
      }

      const nextIdx = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
      setQueueIndex(nextIdx);
      playSong(queue[nextIdx]);
      return;
    }

    const nextIdx = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIdx);
    playSong(queue[nextIdx]);
  }, [queue, queueIndex, isShuffle, isSmartShuffle, favorites, currentSong, playSong]);

  const prevTrack = useCallback(() => {
    if (currentTime > 4) {
      seekTo(0);
      return;
    }
    if (queue.length === 0) return;
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    playSong(queue[prevIdx]);
  }, [currentTime, queue, queueIndex, playSong, seekTo]);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one' && currentSong) {
      seekTo(0);
      playSong(currentSong);
    } else if (repeatMode === 'all' || queueIndex < queue.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
      setPlayerState('idle');
      setCurrentTime(0);
    }
  }, [repeatMode, currentSong, queueIndex, queue.length, nextTrack, playSong, seekTo]);

  useEffect(() => {
    handleTrackEndRef.current = handleTrackEnd;
  }, [handleTrackEnd]);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    setIsMuted(val === 0);
    audioEngine.setVolume(val);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(prevVolume || 0.85);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, prevVolume, setVolume]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    audioEngine.setPlaybackRate(rate);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
    if (!isShuffle) setIsSmartShuffle(false);
  }, [isShuffle]);

  const toggleSmartShuffle = useCallback(() => {
    setIsSmartShuffle(prev => !prev);
    if (!isSmartShuffle) setIsShuffle(true);
  }, [isSmartShuffle]);

  // Queue actions
  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song]);
    addNotification('Added to Queue', `"${song.title}" is queued up.`, 'system');
  }, []);

  const playNextInQueue = useCallback((song: Song) => {
    setQueue(prev => {
      const nextArr = [...prev];
      nextArr.splice(queueIndex + 1, 0, song);
      return nextArr;
    });
  }, [queueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => Math.max(0, prev - 1));
    }
  }, [queueIndex]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  const saveQueueAsPlaylist = useCallback((title: string) => {
    const newPl: Playlist = {
      id: `pl_custom_${Date.now()}`,
      title,
      description: `Created from current queue containing ${queue.length} tracks.`,
      coverUrl: queue[0]?.coverUrl || '/src/assets/images/album_neon_monsoon_1791378078175.jpg',
      trackIds: queue.map(s => s.id),
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    setPlaylists(prev => [newPl, ...prev]);
  }, [queue]);

  // Favorites
  const toggleFavoriteSong = useCallback((songId: string) => {
    setFavorites(prev => {
      const exists = prev.songIds.includes(songId);
      const newIds = exists ? prev.songIds.filter(id => id !== songId) : [...prev.songIds, songId];
      // update Liked Songs playlist
      setPlaylists(pls => pls.map(p => p.id === 'pl_liked' ? { ...p, trackIds: newIds } : p));
      return { ...prev, songIds: newIds };
    });
  }, []);

  const toggleFavoriteArtist = useCallback((artistId: string) => {
    setFavorites(prev => ({
      ...prev,
      artistIds: prev.artistIds.includes(artistId)
        ? prev.artistIds.filter(id => id !== artistId)
        : [...prev.artistIds, artistId],
    }));
  }, []);

  const toggleFavoriteAlbum = useCallback((albumId: string) => {
    setFavorites(prev => ({
      ...prev,
      albumIds: prev.albumIds.includes(albumId)
        ? prev.albumIds.filter(id => id !== albumId)
        : [...prev.albumIds, albumId],
    }));
  }, []);

  const toggleFavoritePlaylist = useCallback((playlistId: string) => {
    setFavorites(prev => ({
      ...prev,
      playlistIds: prev.playlistIds.includes(playlistId)
        ? prev.playlistIds.filter(id => id !== playlistId)
        : [...prev.playlistIds, playlistId],
    }));
  }, []);

  const isSongFavorite = useCallback((songId: string) => {
    return favorites.songIds.includes(songId);
  }, [favorites.songIds]);

  // Language filters
  const toggleLanguageFilter = useCallback((lang: Language) => {
    setSelectedLanguages(prev => {
      if (prev.includes(lang)) {
        return prev.filter(l => l !== lang);
      } else {
        return [...prev, lang];
      }
    });
  }, []);

  const selectAllLanguages = useCallback(() => {
    setSelectedLanguages([]);
  }, []);

  const clearLanguageFilters = useCallback(() => {
    setSelectedLanguages([]);
  }, []);

  // Equalizer
  const setEqualizerPreset = useCallback((preset: EqualizerPreset) => {
    setEqualizerPresetState(preset);
    const gains = EQUALIZER_PRESETS[preset] || EQUALIZER_PRESETS.Flat;
    setEqualizerBands(gains);
    audioEngine.applyEqualizerPreset(preset);
  }, []);

  const setEqualizerBandGain = useCallback((bandIdx: number, val: number) => {
    setEqualizerBands(prev => {
      const copy = [...prev];
      copy[bandIdx] = val;
      return copy;
    });
    setEqualizerPresetState('Custom');
    audioEngine.setEqualizerBand(bandIdx, val);
  }, []);

  const setBassBoost = useCallback((val: number) => {
    setBassBoostState(val);
    audioEngine.setBassBoost(val);
  }, []);

  const setTrebleBoost = useCallback((val: number) => {
    setTrebleBoostState(val);
    audioEngine.setTrebleBoost(val);
  }, []);

  const setStereoBalance = useCallback((val: number) => {
    setStereoBalanceState(val);
    audioEngine.setBalance(val);
  }, []);

  // Playlists
  const createPlaylist = useCallback((title: string, description?: string, coverUrl?: string) => {
    const newPl: Playlist = {
      id: `pl_${Date.now()}`,
      title: title.trim() || 'Untitled Playlist',
      description: description || 'Personal playlist crafted in SONORA.',
      coverUrl: coverUrl || '/src/assets/images/album_neon_monsoon_1791378078175.jpg',
      trackIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    setPlaylists(prev => [newPl, ...prev]);
    return newPl;
  }, []);

  const renamePlaylist = useCallback((id: string, newTitle: string, newDesc?: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          title: newTitle.trim(),
          description: newDesc !== undefined ? newDesc : p.description,
        };
      }
      return p;
    }));
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.trackIds.includes(songId)) {
        return { ...p, trackIds: [...p.trackIds, songId] };
      }
      return p;
    }));
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, trackIds: p.trackIds.filter(id => id !== songId) };
      }
      return p;
    }));
  }, []);

  const duplicatePlaylist = useCallback((playlistId: string) => {
    const orig = playlists.find(p => p.id === playlistId);
    if (!orig) return;
    const dup: Playlist = {
      ...orig,
      id: `pl_dup_${Date.now()}`,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    setPlaylists(prev => [dup, ...prev]);
  }, [playlists]);

  // Downloads / Offline
  const toggleDownloadSong = useCallback((songId: string) => {
    if (downloadedSongIds.includes(songId)) {
      setDownloadedSongIds(prev => prev.filter(id => id !== songId));
      addNotification('Download Removed', 'Track removed from offline cache.', 'download');
    } else {
      setDownloadingSongIds(prev => [...prev, songId]);
      setTimeout(() => {
        setDownloadingSongIds(prev => prev.filter(id => id !== songId));
        setDownloadedSongIds(prev => [...prev, songId]);
        addNotification('Download Complete', 'Track is now available for lossless offline playback.', 'download');
      }, 1200);
    }
  }, [downloadedSongIds]);

  const deleteDownload = useCallback((songId: string) => {
    setDownloadedSongIds(prev => prev.filter(id => id !== songId));
  }, []);

  // Notifications
  const addNotification = useCallback((title: string, message: string, type: NotificationItem['type'] = 'system') => {
    const item: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    setNotifications(prev => [item, ...prev].slice(0, 20));
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Admin metadata actions
  const addCustomSong = useCallback((song: Song) => {
    setSongs(prev => [song, ...prev]);
    const stored = localStorage.getItem('sonora_custom_songs');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('sonora_custom_songs', JSON.stringify([song, ...existing]));
  }, []);

  const deleteSongFromCatalog = useCallback((songId: string) => {
    setSongs(prev => prev.filter(s => s.id !== songId));
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        nextTrack();
      } else if (e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        prevTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreenPlayerOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsFullscreenPlayerOpen(false);
        setIsAudioSettingsOpen(false);
        setIsQueueOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextTrack, prevTrack, toggleMute]);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        repeatMode,
        isShuffle,
        isSmartShuffle,
        queue,
        queueIndex,
        songs,
        artists,
        albums,
        playlists,
        recentlyPlayed,
        favorites,
        selectedLanguages,
        toggleLanguageFilter,
        selectAllLanguages,
        clearLanguageFilters,
        audioQuality,
        setAudioQuality,
        equalizerPreset,
        setEqualizerPreset,
        equalizerBands,
        setEqualizerBandGain,
        bassBoost,
        setBassBoost,
        trebleBoost,
        setTrebleBoost,
        stereoBalance,
        setStereoBalance,
        crossfade,
        setCrossfade,
        gapless,
        setGapless,
        isFullscreenPlayerOpen,
        setIsFullscreenPlayerOpen,
        isAudioSettingsOpen,
        setIsAudioSettingsOpen,
        isQueueOpen,
        setIsQueueOpen,
        isLyricsOpen,
        setIsLyricsOpen,
        isDiagnosticsOpen,
        setIsDiagnosticsOpen,
        playerState,
        diagnostics,
        playTestTrack,
        playbackError,
        retryPlayback,
        playAlternativeVersion,
        dismissPlaybackError,
        playSong,
        playFullTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleMute,
        setPlaybackRate,
        setRepeatMode,
        toggleShuffle,
        toggleSmartShuffle,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        saveQueueAsPlaylist,
        toggleFavoriteSong,
        toggleFavoriteArtist,
        toggleFavoriteAlbum,
        toggleFavoritePlaylist,
        isSongFavorite,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        duplicatePlaylist,
        downloadedSongIds,
        downloadingSongIds,
        toggleDownloadSong,
        deleteDownload,
        stats,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        theme,
        setTheme: setThemeState,
        accentColor,
        setAccentColor: setAccentColorState,
        addCustomSong,
        deleteSongFromCatalog,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
