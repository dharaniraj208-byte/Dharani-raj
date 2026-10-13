import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Play, Trash2, BookmarkPlus, Music2, MoveUp, MoveDown } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    queueIndex,
    playSong,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    saveQueueAsPlaylist,
    accentColor,
  } = useMusic();

  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  if (!isQueueOpen) return null;

  const handleSavePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    saveQueueAsPlaylist(newPlaylistTitle.trim());
    setNewPlaylistTitle('');
    setShowSaveInput(false);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-neutral-400" />
          <h2 className="text-base font-bold text-white">Play Queue</h2>
          <span className="text-xs text-neutral-400 font-mono">({queue.length} tracks)</span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1"
              title="Clear queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Save Queue as Playlist toolbar */}
      <div className="px-4 py-2 bg-neutral-950/40 border-b border-neutral-800/60">
        {!showSaveInput ? (
          <button
            onClick={() => setShowSaveInput(true)}
            className="w-full text-xs text-neutral-300 hover:text-white flex items-center justify-center gap-2 py-1.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            Save current queue as playlist
          </button>
        ) : (
          <form onSubmit={handleSavePlaylist} className="flex gap-2">
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              autoFocus
              className="flex-1 bg-neutral-800 text-xs text-white px-3 py-1.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getAccentBg()} text-neutral-950`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowSaveInput(false)}
              className="px-2 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Queue Tracklist */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-neutral-800/30">
        {queue.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-xs">
            Queue is empty. Discover tracks and add them here!
          </div>
        ) : (
          queue.map((track, idx) => {
            const isCurrent = idx === queueIndex;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`group flex items-center gap-3 p-2 rounded-xl transition-colors ${
                  isCurrent
                    ? 'bg-neutral-800/80 border border-neutral-700/60'
                    : 'hover:bg-neutral-800/40'
                }`}
              >
                {/* Artwork */}
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0" onClick={() => playSong(track)}>
                  <p className={`text-xs font-semibold truncate cursor-pointer ${isCurrent ? 'text-emerald-400' : 'text-neutral-200'}`}>
                    {track.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate cursor-pointer">
                    {track.artist} · <span className="opacity-80">{track.language}</span>
                  </p>
                </div>

                {/* Duration & Reorder controls */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                    {formatDuration(track.duration)}
                  </span>

                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                    {idx > 0 && (
                      <button
                        onClick={() => reorderQueue(idx, idx - 1)}
                        className="p-1 hover:text-white text-neutral-400"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < queue.length - 1 && (
                      <button
                        onClick={() => reorderQueue(idx, idx + 1)}
                        className="p-1 hover:text-white text-neutral-400"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1 hover:text-rose-400 text-neutral-400"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
