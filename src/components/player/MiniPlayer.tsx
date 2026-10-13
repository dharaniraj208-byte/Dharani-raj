import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
  Sliders,
  FileText,
  Loader2,
} from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    audioQuality,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    isSongFavorite,
    toggleFavoriteSong,
    setIsFullscreenPlayerOpen,
    setIsAudioSettingsOpen,
    setIsQueueOpen,
    accentColor,
    playerState,
  } = useMusic();

  const [isVolumeHovered, setIsVolumeHovered] = useState(false);

  if (!currentSong) return null;

  const isFav = isSongFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      case 'cyan': return 'bg-cyan-500';
      default: return 'bg-emerald-500';
    }
  };

  const getAccentColor = () => {
    switch (accentColor) {
      case 'violet': return 'text-violet-400';
      case 'amber': return 'text-amber-400';
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <aside
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-neutral-900/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 shadow-2xl transition-all"
      aria-label="Audio playback controls"
    >
      {/* Top Seek Progress Bar (interactive hairline) */}
      <div
        className="group relative w-full h-1 bg-neutral-800 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          seekTo(ratio * duration);
        }}
      >
        <div
          className={`h-full transition-all duration-100 ${getAccentBg()}`}
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3 min-w-0 max-w-[35%] sm:max-w-[280px]">
          <div
            onClick={() => setIsFullscreenPlayerOpen(true)}
            className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 cursor-pointer group bg-neutral-800 border border-neutral-700/50"
          >
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4
              onClick={() => setIsFullscreenPlayerOpen(true)}
              className="text-xs sm:text-sm font-bold text-white truncate cursor-pointer hover:underline"
            >
              {currentSong.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 truncate">
              <span className="truncate">{currentSong.artist}</span>
              <span>·</span>
              <span className="text-[10px] text-neutral-300 font-mono uppercase">{currentSong.language}</span>
              {currentSong.playbackType === 'preview' ? (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PREVIEW
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FULL TRACK
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleFavoriteSong(currentSong.id)}
            className={`p-2 hidden sm:flex rounded-lg hover:bg-neutral-800 transition-colors ${
              isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
            }`}
            title="Like song"
            aria-label="Favorite song"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Controls & Time */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1 max-w-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={prevTrack}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Previous Track"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md ${getAccentBg()} text-neutral-950 font-bold`}
              title={playerState === 'buffering' || playerState === 'loading' ? 'Buffering...' : isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {playerState === 'buffering' || playerState === 'loading' ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-neutral-950" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-neutral-950 translate-x-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Next Track"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Time display & Buffering indicator */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-400 tabular-nums">
            {playerState === 'buffering' ? (
              <span className="text-amber-400 font-semibold animate-pulse">Buffering...</span>
            ) : playerState === 'loading' ? (
              <span className="text-emerald-400 font-semibold animate-pulse">Loading...</span>
            ) : (
              <>
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Tools, Volume, Equalizer, Queue, Fullscreen */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
          {/* Quality badge */}
          <button
            onClick={() => setIsAudioSettingsOpen(true)}
            className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono text-neutral-300 transition-colors"
            title="Audio Quality"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="uppercase">{audioQuality}</span>
          </button>

          {/* Equalizer trigger */}
          <button
            onClick={() => setIsAudioSettingsOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Equalizer & Audio FX"
            aria-label="Equalizer settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Queue Drawer trigger */}
          <button
            onClick={() => setIsQueueOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Current Queue"
            aria-label="Open queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Control - Always accessible on desktop, click-toggle on mobile */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label="Volume toggle"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Desktop inline slider */}
            <div className="hidden lg:flex items-center gap-1.5 w-28">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                aria-label="Volume control slider"
              />
              <span className="text-[10px] font-mono text-neutral-400 w-7 text-right tabular-nums">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsFullscreenPlayerOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Expand Full-Screen Player"
            aria-label="Expand player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
