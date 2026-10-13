import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { VisualizerCanvas } from './VisualizerCanvas';
import { VisualizerMode } from '../../types';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Sliders,
  ListMusic,
  FileText,
  Download,
  Activity,
  Sparkles,
  Loader2,
} from 'lucide-react';

export const FullScreenPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    isSmartShuffle,
    isFullscreenPlayerOpen,
    setIsFullscreenPlayerOpen,
    setIsAudioSettingsOpen,
    setIsQueueOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    setRepeatMode,
    toggleShuffle,
    toggleSmartShuffle,
    toggleFavoriteSong,
    isSongFavorite,
    downloadedSongIds,
    toggleDownloadSong,
    accentColor,
    audioQuality,
    playerState,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'artwork' | 'lyrics' | 'visualizer'>('artwork');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');

  if (!isFullscreenPlayerOpen || !currentSong) return null;

  const isFav = isSongFavorite(currentSong.id);
  const isDownloaded = downloadedSongIds.includes(currentSong.id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = Math.max(0, duration - currentTime);

  const getAccentColorStyle = () => {
    switch (accentColor) {
      case 'violet': return 'text-violet-400 bg-violet-500';
      case 'amber': return 'text-amber-400 bg-amber-500';
      case 'rose': return 'text-rose-400 bg-rose-500';
      case 'cyan': return 'text-cyan-400 bg-cyan-500';
      default: return 'text-emerald-400 bg-emerald-500';
    }
  };

  const getAccentBtn = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500 text-neutral-950 shadow-violet-500/25';
      case 'amber': return 'bg-amber-500 text-neutral-950 shadow-amber-500/25';
      case 'rose': return 'bg-rose-500 text-neutral-950 shadow-rose-500/25';
      case 'cyan': return 'bg-cyan-500 text-neutral-950 shadow-cyan-500/25';
      default: return 'bg-emerald-500 text-neutral-950 shadow-emerald-500/25';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-label="Expanded Music Player"
    >
      {/* Blurred Ambient Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-125 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/90 to-neutral-950 pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-neutral-800/40">
        <button
          onClick={() => setIsFullscreenPlayerOpen(false)}
          className="p-2 -ml-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors flex items-center gap-1.5"
          aria-label="Minimize player"
        >
          <ChevronDown className="w-5 h-5" />
          <span className="text-xs font-medium">Minimize</span>
        </button>

        {/* View Switcher Tabs (Artwork | Lyrics | Visualizer) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900/80 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('artwork')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'artwork' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Artwork
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'lyrics' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3 h-3" />
            Lyrics
          </button>
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'visualizer' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            Visualizer
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioSettingsOpen(true)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
            title="Audio Quality & Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsQueueOpen(true)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
            title="Play Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-6 py-4 overflow-hidden">
        {activeTab === 'artwork' && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative group">
              <div
                className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-neutral-700/50 transition-transform duration-500 ${
                  isPlaying ? 'scale-100 shadow-emerald-500/10' : 'scale-95 opacity-90'
                }`}
              >
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quality, Playback Type & Synth Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {currentSong.playbackType === 'preview' ? (
                  <div className="bg-amber-500/90 text-neutral-950 font-bold px-2.5 py-1 rounded-full text-[10px] font-mono shadow-lg">
                    30s PREVIEW
                  </div>
                ) : (
                  <div className="bg-emerald-500/90 text-neutral-950 font-bold px-2.5 py-1 rounded-full text-[10px] font-mono shadow-lg">
                    FULL TRACK
                  </div>
                )}
                <div className="bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-700/60 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{audioQuality.toUpperCase()} 320k</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 max-w-lg">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white line-clamp-1">
                {currentSong.title}
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 font-medium">
                {currentSong.artist}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-1">
                <span>{currentSong.album}</span>
                <span>·</span>
                <span className="text-neutral-400">{currentSong.language}</span>
                <span>·</span>
                <span>{currentSong.keyNote}</span>
                <span>·</span>
                <span>{currentSong.bpm} BPM</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lyrics' && (
          <div className="w-full max-w-2xl h-[420px] overflow-y-auto px-4 py-6 space-y-6 text-center animate-in fade-in duration-300">
            {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
              <>
                <div className="text-xs text-neutral-400 font-mono pb-2 border-b border-neutral-800">
                  {currentSong.lyricsLanguage || 'Lyrics'} · Synchronized Playback
                </div>
                {currentSong.lyrics.map((line, idx) => {
                  const isActive =
                    currentTime >= line.time &&
                    (idx === currentSong.lyrics!.length - 1 || currentTime < currentSong.lyrics![idx + 1].time);

                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'scale-105 text-white font-bold text-lg sm:text-xl py-2 drop-shadow-md'
                          : 'text-neutral-500 hover:text-neutral-300 text-sm sm:text-base py-1'
                      }`}
                      onClick={() => seekTo(line.time)}
                    >
                      <p>{line.text}</p>
                      {line.translation && (
                        <p className={`text-xs mt-1 font-normal ${isActive ? 'text-emerald-400/90' : 'text-neutral-400'}`}>
                          {line.translation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
                <p className="text-base font-medium">Lyrics unavailable for this track.</p>
                <p className="text-xs">SONORA only presents verified and authorized lyrics.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
            <div className="w-full h-64 sm:h-72 bg-neutral-900/60 backdrop-blur-md rounded-2xl p-4 border border-neutral-800/80 shadow-2xl flex items-center justify-center">
              <VisualizerCanvas
                mode={visualizerMode}
                accentColor={accentColor}
                isPlaying={isPlaying}
              />
            </div>

            {/* Visualizer Mode selector */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-neutral-900/80 rounded-xl border border-neutral-800">
              {(['bars', 'waves', 'circular', 'spectrum', 'minimal'] as VisualizerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setVisualizerMode(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    visualizerMode === m ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Controls Area */}
      <footer className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-8 pt-2 space-y-4">
        {/* Progress bar & Timestamps */}
        <div className="space-y-1.5">
          <div
            className="relative w-full h-2 bg-neutral-800 rounded-full cursor-pointer group flex items-center"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seekTo(ratio * duration);
            }}
          >
            <div
              className={`h-full rounded-full transition-all duration-100 ${getAccentColorStyle().split(' ')[1]}`}
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs font-mono text-neutral-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Action buttons (Shuffle, Prev, Play/Pause, Next, Repeat) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Favorite */}
            <button
              onClick={() => toggleFavoriteSong(currentSong.id)}
              className={`p-2.5 rounded-xl hover:bg-neutral-800/60 transition-colors ${
                isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Offline download */}
            {currentSong.isAuthorizedDownload && (
              <button
                onClick={() => toggleDownloadSong(currentSong.id)}
                className={`p-2.5 rounded-xl hover:bg-neutral-800/60 transition-colors ${
                  isDownloaded ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
                }`}
                title="Download for offline"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Shuffle / Smart Shuffle */}
            <button
              onClick={toggleSmartShuffle}
              className={`p-2 rounded-xl transition-colors ${
                isSmartShuffle ? 'text-emerald-400 bg-neutral-800' : isShuffle ? 'text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title={isSmartShuffle ? 'Smart Shuffle: Active' : 'Smart Shuffle'}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Previous */}
            <button
              onClick={prevTrack}
              className="p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition-colors"
              title="Previous"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            {/* Play/Pause CTA */}
            <button
              onClick={togglePlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${getAccentBtn()}`}
              title={playerState === 'buffering' || playerState === 'loading' ? 'Buffering...' : isPlaying ? 'Pause' : 'Play'}
            >
              {playerState === 'buffering' || playerState === 'loading' ? (
                <Loader2 className="w-6 h-6 text-neutral-950 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-neutral-950" />
              ) : (
                <Play className="w-6 h-6 fill-neutral-950 translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              className="p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition-colors"
              title="Next"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => {
                if (repeatMode === 'off') setRepeatMode('all');
                else if (repeatMode === 'all') setRepeatMode('one');
                else setRepeatMode('off');
              }}
              className={`p-2 rounded-xl transition-colors ${
                repeatMode !== 'off' ? 'text-emerald-400 bg-neutral-800' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              aria-label="Volume slider"
            />
            <span className="text-[10px] font-mono text-neutral-400 w-7 tabular-nums">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
