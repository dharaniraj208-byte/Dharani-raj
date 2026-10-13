import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Shuffle, Heart, Trash2, Edit3, Clock, Check, Share2, Disc3 } from 'lucide-react';

interface PlaylistDetailViewProps {
  playlistId: string;
  setActiveView: (view: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlistId,
  setActiveView,
}) => {
  const {
    playlists,
    songs,
    playSong,
    removeSongFromPlaylist,
    deletePlaylist,
    renamePlaylist,
    accentColor,
    toggleSmartShuffle,
    addNotification,
  } = useMusic();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [copied, setCopied] = useState(false);

  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="p-12 text-center text-neutral-500">
        <p>Playlist not found.</p>
        <button
          onClick={() => setActiveView('library')}
          className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const playlistSongs = songs.filter((s) => playlist.trackIds.includes(s.id));
  const totalDuration = playlistSongs.reduce((acc, curr) => acc + curr.duration, 0);

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min ${seconds % 60} sec`;
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renamePlaylist(playlist.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    addNotification('Link Copied', `Link to playlist "${playlist.title}" copied.`, 'system');
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-2xl bg-neutral-800 border border-neutral-700/50">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 flex-1 min-w-0">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            {playlist.isCustom ? 'Personal Playlist' : 'Curated Playlist'}
          </span>

          {!isEditing ? (
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display truncate">
                {playlist.title}
              </h1>
              {playlist.isCustom && (
                <button
                  onClick={() => {
                    setEditTitle(playlist.title);
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveTitle} className="flex gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="bg-neutral-800 text-xl font-bold text-white px-3 py-1 rounded-xl border border-neutral-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-500 text-neutral-950 rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </form>
          )}

          <p className="text-xs text-neutral-400 line-clamp-2">
            {playlist.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 font-mono">
            <span>{playlistSongs.length} songs</span>
            <span>·</span>
            <span>{formatTotalTime(totalDuration)}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {playlistSongs.length > 0 && (
              <button
                onClick={() => playSong(playlistSongs[0], playlistSongs)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${getAccentBg()}`}
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play Playlist</span>
              </button>
            )}

            <button
              onClick={toggleSmartShuffle}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors"
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
              title="Share Playlist"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {playlist.isCustom && (
              <button
                onClick={() => {
                  deletePlaylist(playlist.id);
                  setActiveView('library');
                }}
                className="p-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-rose-400 transition-colors"
                title="Delete Playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tracklist */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-3 pb-2 border-b border-neutral-800/60 font-mono">
          <div className="flex items-center gap-4">
            <span className="w-5 text-center">#</span>
            <span>TITLE</span>
          </div>
          <div className="flex items-center gap-6">
            <span>DURATION</span>
            {playlist.isCustom && <span>ACTION</span>}
          </div>
        </div>

        {playlistSongs.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            This playlist has no songs yet. Discover music and add tracks to build your mix!
          </div>
        ) : (
          playlistSongs.map((song, idx) => (
            <div
              key={`${song.id}-${idx}`}
              onClick={() => playSong(song, playlistSongs)}
              className="group flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-5 text-center text-xs font-mono text-neutral-500 group-hover:text-emerald-400">
                  {idx + 1}
                </span>
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                  <img src={song.coverUrl} alt={song.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[11px] text-neutral-400 truncate">{song.artist} · {song.language}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-neutral-400 font-mono">
                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>

                {playlist.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSongFromPlaylist(playlist.id, song.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
