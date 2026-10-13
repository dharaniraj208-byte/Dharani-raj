import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Shuffle, Heart, Plus, Share2, Check, Clock, Disc3 } from 'lucide-react';

interface AlbumViewProps {
  albumId: string;
  setSelectedArtistId: (id: string) => void;
  setActiveView: (view: string) => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  albumId,
  setSelectedArtistId,
  setActiveView,
}) => {
  const {
    albums,
    songs,
    playSong,
    favorites,
    toggleFavoriteAlbum,
    accentColor,
    toggleSmartShuffle,
    addNotification,
  } = useMusic();

  const [copied, setCopied] = useState(false);

  const album = albums.find((al) => al.id === albumId) || albums[0];
  const albumSongs = songs.filter((s) => s.albumId === album.id || album.trackIds.includes(s.id));
  const isFav = favorites.albumIds.includes(album.id);

  const totalDuration = albumSongs.reduce((acc, curr) => acc + curr.duration, 0);

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min ${seconds % 60} sec`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    addNotification('Link Copied', `Link to album "${album.title}" copied.`, 'system');
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
      {/* Album Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-2xl bg-neutral-800 border border-neutral-700/50">
          <img
            src={album.coverUrl}
            alt={album.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 flex-1 min-w-0">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Studio Master Album · {album.language}
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display truncate">
            {album.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-300">
            <span
              onClick={() => {
                setSelectedArtistId(album.artistId);
                setActiveView('artist');
              }}
              className="font-bold hover:underline cursor-pointer text-white"
            >
              {album.artist}
            </span>
            <span>·</span>
            <span>{album.releaseYear}</span>
            <span>·</span>
            <span>{albumSongs.length} songs</span>
            <span>·</span>
            <span className="font-mono text-neutral-400">{formatTotalTime(totalDuration)}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {albumSongs.length > 0 && (
              <button
                onClick={() => playSong(albumSongs[0], albumSongs)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${getAccentBg()}`}
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play Album</span>
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
              onClick={() => toggleFavoriteAlbum(album.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isFav ? 'border-rose-500 text-rose-500 bg-rose-500/10' : 'border-neutral-700 text-neutral-400 hover:text-white'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
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
            <span>PLAYS</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        {albumSongs.map((song, idx) => (
          <div
            key={song.id}
            onClick={() => playSong(song, albumSongs)}
            className="group flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="w-5 text-center text-xs font-mono text-neutral-500 group-hover:text-emerald-400">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{song.title}</h4>
                <p className="text-[11px] text-neutral-400 truncate">{song.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-neutral-400 font-mono">
              <span className="hidden sm:inline">{(song.playCount / 1000).toFixed(0)}k</span>
              <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
