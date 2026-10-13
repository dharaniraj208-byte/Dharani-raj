import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { AlertCircle, RefreshCw, Disc, X } from 'lucide-react';

export const PlaybackErrorToast: React.FC = () => {
  const {
    playbackError,
    retryPlayback,
    playAlternativeVersion,
    dismissPlaybackError,
    accentColor,
  } = useMusic();

  if (!playbackError) return null;

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
    <aside
      className="fixed bottom-24 md:bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-50 bg-neutral-900 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200"
      aria-label="Playback error notification"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white tracking-tight">
              {playbackError.message || 'Unable to play this track right now.'}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
              "{playbackError.song.title}" · {playbackError.song.artist}
            </p>
          </div>
        </div>

        <button
          onClick={dismissPlaybackError}
          className="text-neutral-500 hover:text-white p-1 rounded-lg"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-800">
        <button
          onClick={retryPlayback}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${getAccentBg()}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>

        <button
          onClick={playAlternativeVersion}
          className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Play Another Version</span>
        </button>

        <button
          onClick={dismissPlaybackError}
          className="py-1.5 px-2.5 rounded-xl text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    </aside>
  );
};
