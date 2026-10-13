import React from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCw,
  Terminal,
  Volume2,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export const PlaybackDiagnosticsModal: React.FC = () => {
  const {
    diagnostics,
    isDiagnosticsOpen,
    setIsDiagnosticsOpen,
    playTestTrack,
    currentSong,
    playerState,
    isPlaying,
  } = useMusic();

  if (!isDiagnosticsOpen) return null;

  const isConnected = diagnostics.providerConnected;
  const isSearchWorking = diagnostics.searchApiStatus !== 'failed';
  const hasMetadata = Boolean(diagnostics.selectedSongTitle || currentSong);
  const hasPlaybackUrl = Boolean(diagnostics.playbackUrl);
  const isUrlValid = Boolean(diagnostics.playbackUrlValid);
  const isAudioReady = diagnostics.audioLoadStatus !== 'error' && diagnostics.audioLoadStatus !== 'failed';
  const isAutoplayAllowed = diagnostics.browserAutoplayAllowed !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Audio Playback Diagnostics</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  DEVELOPER / QA
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Inspect real-time audio pipeline, provider connectivity, and W3C media events
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDiagnosticsOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close diagnostics"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Quick Action: Step 15 Test Pipeline */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Test Known Authorized Audio File (Step 15)</span>
              </h4>
              <p className="text-xs text-neutral-400">
                Verifies browser audio hardware, speaker output, seeking, and volume with a guaranteed Creative Commons track.
              </p>
            </div>
            <button
              onClick={() => playTestTrack()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shrink-0 shadow-lg shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Pipeline Test</span>
            </button>
          </div>

          {/* Diagnostic Metrics Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Music Provider */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Music Provider</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white truncate">{diagnostics.providerName}</span>
                <span className="flex items-center gap-1 text-xs font-mono font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              </div>
            </div>

            {/* 2. Search API */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Search API Status</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Apple iTunes Search / Catalog</span>
                <span className={`flex items-center gap-1 text-xs font-mono font-medium ${isSearchWorking ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isSearchWorking ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{isSearchWorking ? 'Working' : 'Failed'}</span>
                </span>
              </div>
            </div>

            {/* 3. Song Metadata */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Song Metadata</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white truncate">
                  {diagnostics.selectedSongTitle || 'No song selected'}
                </span>
                <span className={`flex items-center gap-1 text-xs font-mono font-medium ${hasMetadata ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {hasMetadata ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{hasMetadata ? 'Available' : 'Missing'}</span>
                </span>
              </div>
            </div>

            {/* 4. Song ID */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Unique Song ID</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-200 truncate">
                  {diagnostics.selectedSongId || 'N/A'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {diagnostics.playbackType?.toUpperCase() || 'NONE'}
                </span>
              </div>
            </div>

            {/* 5. Playback Source */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Playback Source</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-300 truncate max-w-[200px]">
                  {diagnostics.playbackUrl ? diagnostics.playbackUrl.split('?')[0] : 'None'}
                </span>
                <span className={`flex items-center gap-1 text-xs font-mono font-medium ${hasPlaybackUrl ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {hasPlaybackUrl ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{hasPlaybackUrl ? 'Available' : 'Missing'}</span>
                </span>
              </div>
            </div>

            {/* 6. Playback Source Status */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Playback Source Status</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {diagnostics.playbackType === 'preview' ? 'Authorized Preview (30s)' : diagnostics.playbackType === 'full' ? 'Authorized Full Track' : 'Unavailable'}
                </span>
                <span className={`flex items-center gap-1 text-xs font-mono font-medium ${isUrlValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUrlValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{isUrlValid ? 'Valid' : 'Invalid'}</span>
                </span>
              </div>
            </div>

            {/* 7. HTML5 Audio Element */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Audio Element Lifecycle</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-300 uppercase">{diagnostics.audioLoadStatus}</span>
                <span className={`flex items-center gap-1 text-xs font-mono font-medium ${isAudioReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isAudioReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{isAudioReady ? 'Ready' : 'Error'}</span>
                </span>
              </div>
            </div>

            {/* 8. Browser Autoplay Permission */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 font-medium">Browser Autoplay Policy</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">User Gesture Binding</span>
                <span className={`flex items-center gap-1 text-xs font-mono font-medium ${isAutoplayAllowed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isAutoplayAllowed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{isAutoplayAllowed ? 'Allowed' : 'Requires User Click'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Current Player State Badge */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800 text-white">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-neutral-400">Current Player State</div>
                <div className="text-sm font-bold text-white capitalize flex items-center gap-2">
                  <span>{playerState}</span>
                  {playerState === 'playing' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
              </div>
            </div>
            {diagnostics.playbackError && (
              <div className="text-xs text-rose-400 max-w-sm text-right bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                {diagnostics.playbackError}
              </div>
            )}
          </div>

          {/* Event Stream Log Console (Step 12 & 14) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Media Lifecycle Events & Network Stream</span>
              </span>
              <span>{diagnostics.logs.length} events captured</span>
            </div>
            <div className="w-full h-44 bg-black/90 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] text-neutral-300 overflow-y-auto space-y-1">
              {diagnostics.logs.length === 0 ? (
                <div className="text-neutral-600 italic">No audio events logged yet. Click play on any song to inspect lifecycle.</div>
              ) : (
                diagnostics.logs.map((log, i) => (
                  <div key={i} className="leading-relaxed hover:text-white transition-colors">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
          <span>SONORA Audio Engine v2.0 • Zero Fake URLs • Real Apple Music CDN & Free Music Archive</span>
          <button
            onClick={() => setIsDiagnosticsOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
