import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Shuffle, Heart, Check, Disc, Users, ShieldCheck } from 'lucide-react';

interface ArtistViewProps {
  artistId: string;
  setSelectedAlbumId: (id: string) => void;
  setActiveView: (view: string) => void;
}

export const ArtistView: React.FC<ArtistViewProps> = ({
  artistId,
  setSelectedAlbumId,
  setActiveView,
}) => {
  const {
    artists,
    songs,
    albums,
    playSong,
    favorites,
    toggleFavoriteArtist,
    accentColor,
    toggleSmartShuffle,
  } = useMusic();

  const artist = artists.find((a) => a.id === artistId) || artists[0];
  const isFollowing = favorites.artistIds.includes(artist.id);

  // Artist tracks
  const artistSongs = songs.filter((s) => s.artistId === artist.id || s.artist.toLowerCase().includes(artist.name.toLowerCase()));
  const artistAlbums = albums.filter((al) => al.artistId === artist.id || al.artist.toLowerCase().includes(artist.name.toLowerCase()));

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
      {/* Artist Hero Header */}
      <section className="relative rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-neutral-950 min-h-[300px] flex flex-col justify-end p-6 sm:p-10">
        <div className="absolute inset-0">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top opacity-40 scale-105 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Sonora Artist
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            {artist.name}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
            {artist.bio}
          </p>

          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            <span>{(artist.monthlyListeners / 1000000).toFixed(1)}M Monthly Listeners</span>
            <span>·</span>
            <span>Languages: {artist.languages.join(', ')}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {artistSongs.length > 0 && (
              <button
                onClick={() => playSong(artistSongs[0], artistSongs)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${getAccentBg()}`}
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play Artist</span>
              </button>
            )}

            <button
              onClick={toggleSmartShuffle}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={() => toggleFavoriteArtist(artist.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isFollowing
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-neutral-700 text-neutral-300 hover:text-white bg-neutral-900/60'
              }`}
            >
              {isFollowing ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Top Songs */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-white tracking-tight">Top Popular Tracks</h3>

        <div className="space-y-1.5">
          {artistSongs.map((song, idx) => (
            <div
              key={song.id}
              onClick={() => playSong(song, artistSongs)}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-center text-xs font-mono text-neutral-500 group-hover:text-emerald-400">
                  {idx + 1}
                </span>
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                  <img src={song.coverUrl} alt={song.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[11px] text-neutral-400 truncate">{song.album} · {song.language}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
                <span>{(song.playCount / 1000).toFixed(0)}k</span>
                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discography / Albums */}
      {artistAlbums.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Disc className="w-4 h-4 text-emerald-400" />
            <span>Discography & Albums</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artistAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  setSelectedAlbumId(album.id);
                  setActiveView('album');
                }}
                className="group p-3.5 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                  <img src={album.coverUrl} alt={album.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{album.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{album.releaseYear} · Album</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
