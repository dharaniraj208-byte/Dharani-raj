export type Language = 
  | 'Tamil'
  | 'English'
  | 'Hindi'
  | 'Telugu'
  | 'Malayalam'
  | 'Kannada'
  | 'Bengali'
  | 'Marathi'
  | 'Punjabi'
  | 'Gujarati'
  | 'Urdu'
  | 'Spanish'
  | 'French'
  | 'Korean'
  | 'Japanese'
  | 'Arabic';

export type Mood =
  | 'Chill'
  | 'Workout'
  | 'Focus'
  | 'Party'
  | 'Travel'
  | 'Sleep'
  | 'Romantic'
  | 'Motivation'
  | 'Devotional'
  | 'Lo-Fi';

export type Genre =
  | 'Pop'
  | 'Classical'
  | 'Carnatic'
  | 'Hindustani'
  | 'Sufi'
  | 'Indie Rock'
  | 'Electronic'
  | 'Hip-Hop'
  | 'R&B'
  | 'Acoustic'
  | 'K-Pop'
  | 'J-Pop'
  | 'Latin'
  | 'Folk'
  | 'Ambient'
  | 'Soundtrack';

export type AudioQuality = 'auto' | 'low' | 'normal' | 'high' | 'lossless';

export type RepeatMode = 'off' | 'all' | 'one';

export type VisualizerMode = 'bars' | 'waves' | 'circular' | 'spectrum' | 'minimal';

export type ThemeMode = 'dark' | 'amoled' | 'light';

export type AccentColor = 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

export interface LyricLine {
  time: number; // in seconds
  text: string;
  translation?: string;
}

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error';
export type PlaybackType = 'preview' | 'full' | 'unavailable';

export interface PlaybackSourceResult {
  url?: string;
  youtubeId?: string;
  type: PlaybackType;
  canPlay: boolean;
  fullTrackAvailable?: boolean;
  previewAvailable?: boolean;
  requiresAuthentication?: boolean;
  requiresSubscription?: boolean;
  duration?: number;
  provider: string;
  error?: string;
}

export interface PlaybackDiagnostics {
  providerName: string;
  providerConnected: boolean;
  searchApiStatus: 'idle' | 'working' | 'failed';
  selectedSongId: string | null;
  selectedSongTitle: string | null;
  selectedSongArtist: string | null;
  playbackUrl: string | null;
  playbackUrlValid: boolean | null;
  playbackType: PlaybackType | null;
  audioLoadStatus: string;
  audioPlayStatus: string;
  playbackError: string | null;
  browserAutoplayAllowed: boolean | null;
  playerState: PlayerState;
  logs: string[];
}

export interface Song {
  id: string;
  title: string;
  nativeTitle?: string;
  artist: string;
  nativeArtist?: string;
  aliases?: string[];
  artistId: string;
  album: string;
  albumId: string;
  language: Language;
  genre: Genre;
  mood: Mood[];
  duration: number; // in seconds
  releaseYear: number;
  coverUrl: string;
  streamUrl?: string; // Optional external audio stream
  previewUrl?: string; // Authorized 30s preview stream
  youtubeId?: string; // Official authorized full track stream ID
  playbackType?: PlaybackType; // preview | full | unavailable
  provider?: 'itunes' | 'catalog' | 'youtube' | 'test';
  providerId?: string;
  synthPreset: 'carnatic_flute' | 'sitar_drone' | 'kpop_synth' | 'lofi_chill' | 'latin_guitar' | 'ambient_piano' | 'indie_groove' | 'electronic_pulse';
  playCount: number;
  bpm: number;
  keyNote: string;
  lyrics?: LyricLine[];
  lyricsLanguage?: string;
  isDemo: boolean;
  isAuthorizedDownload: boolean;
  fileSizeMb?: number;
  isPlayable?: boolean;
  fullTrackAvailable?: boolean;
  previewAvailable?: boolean;
  requiresAuthentication?: boolean;
  requiresSubscription?: boolean;
}

export interface SearchFilterOptions {
  language?: string;
  genre?: string;
  mood?: string;
  artist?: string;
  album?: string;
  releaseYear?: number;
}

export type SearchSortOption = 'relevance' | 'popularity' | 'latest' | 'artist' | 'album';

export interface SearchResult {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  detectedLanguage?: Language | null;
  fromCache?: boolean;
  totalCount: number;
}

export interface IMusicProvider {
  searchSongs(query: string, filters?: SearchFilterOptions, sort?: SearchSortOption): Promise<Song[]>;
  searchArtists(query: string): Promise<Artist[]>;
  searchAlbums(query: string): Promise<Album[]>;
  getSong(songId: string): Promise<Song | null>;
  getArtist(artistId: string): Promise<Artist | null>;
  getAlbum(albumId: string): Promise<Album | null>;
  getPlaybackSource(songId: string): Promise<PlaybackSourceResult>;
  playFullTrack(songId: string): Promise<PlaybackSourceResult>;
  getPlayableSource?(songId: string): Promise<{ url?: string; synthPreset?: Song['synthPreset']; canPlay: boolean }>;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  languages: Language[];
  genres: Genre[];
  monthlyListeners: number;
  topTrackIds: string[];
  albumIds: string[];
  verified: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  trackIds: string[];
  genre: Genre;
  language: Language;
  description?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  createdAt: string;
  isCustom: boolean;
  isDefault?: boolean;
}

export interface EqualizerBand {
  frequency: number; // Hz
  label: string;
  gain: number; // -12dB to +12dB
}

export type EqualizerPreset =
  | 'Flat'
  | 'Bass Boost'
  | 'Treble Boost'
  | 'Vocal'
  | 'Rock'
  | 'Pop'
  | 'Classical'
  | 'Jazz'
  | 'Electronic'
  | 'Hip-Hop'
  | 'Custom';

export interface ListeningStat {
  totalMinutes: number;
  songsPlayedCount: number;
  topArtistId: string;
  topLanguage: Language;
  topGenre: Genre;
  mostPlayedSongId: string;
  dailyMinutes: { [dateStr: string]: number };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'release' | 'recommendation' | 'download' | 'system';
}
