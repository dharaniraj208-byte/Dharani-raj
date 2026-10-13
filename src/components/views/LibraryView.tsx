import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Song, Playlist } from '../../types';
import {
  Library,
  Heart,
  ListMusic,
  Disc,
  User,
  Download,
  History,
  Plus,
  Trash2,
  Copy,
  Share2,
  Upload,
  HardDrive,
  Play,
  Check,
} from 'lucide-react';

interface LibraryViewProps {
  onOpenNewPlaylistModal: () => void;
  setActiveView: (view: string) => void;
  setSelectedArtistId: (id: string) => void;
  setSelectedAlbumId: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onOpenNewPlaylistModal,
  setActiveView,
  setSelectedArtistId,
  setSelectedAlbumId,
}) => {
  const {
    songs,
    artists,
    albums,
    playlists,
    favorites,
    recentlyPlayed,
    downloadedSongIds,
    deleteDownload,
    playSong,
    deletePlaylist,
    duplicatePlaylist,
    addCustomSong,
    accentColor,
    addNotification,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'downloaded' | 'artists' | 'albums' | 'history'>('playlists');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const downloadedSongs = songs.filter((s) => downloadedSongIds.includes(s.id));
  const likedSongs = songs.filter((s) => favorites.songIds.includes(s.id));
  const favoriteArtists = artists.filter((a) => favorites.artistIds.includes(a.id));
  const favoriteAlbums = albums.filter((al) => favorites.albumIds.includes(al.id));

  // Compute offline storage used
  const totalStorageMb = downloadedSongs.reduce((acc, curr) => acc + (curr.fileSizeMb || 10.5), 0);

  const handleSharePlaylist = (playlist: Playlist) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(playlist.id);
    addNotification('Link Copied', `Share link for "${playlist.title}" copied to clipboard.`, 'system');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLocalAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newSong: Song = {
      id: `local_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Local Import',
      artistId: 'art_local',
      album: 'Imported Library',
      albumId: 'alb_local',
      language: 'English',
      genre: 'Acoustic',
      mood: ['Chill'],
      duration: 180,
      releaseYear: 2026,
      coverUrl: '/src/assets/images/album_celestial_echoes_1791377969899.jpg',
      synthPreset: 'lofi_chill',
      playCount: 1,
      bpm: 100,
      keyNote: 'C Major',
      isDemo: false,
      isAuthorizedDownload: true,
      fileSizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(1)),
      streamUrl: url,
    };

    addCustomSong(newSong);
    addNotification('File Imported', `"${newSong.title}" is ready to stream in SONORA.`, 'system');
  };

  const tabs = [
    { id: 'playlists', label: 'Playlists', count: playlists.length, icon: ListMusic },
    { id: 'liked', label: 'Liked Songs', count: likedSongs.length, icon: Heart },
    { id: 'downloaded', label: 'Offline Vault', count: downloadedSongs.length, icon: Download },
    { id: 'artists', label: 'Artists', count: favoriteArtists.length, icon: User },
    { id: 'albums', label: 'Albums', count: favoriteAlbums.length, icon: Disc },
    { id: 'history', label: 'Recently Played', count: recentlyPlayed.length, icon: History },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Banner & Local Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Your Sonic Vault
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Personal playlists, saved artists, and authorized offline downloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Local file import */}
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Audio</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleLocalAudioUpload}
            />
          </label>

          <button
            onClick={onOpenNewPlaylistModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-emerald-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-neutral-800/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono text-neutral-400">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* TAB: PLAYLISTS */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((pl) => {
            const trackCount = pl.trackIds.length;
            return (
              <div
                key={pl.id}
                className="group p-3.5 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900/80 border border-neutral-900 hover:border-neutral-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setActiveView(`playlist_${pl.id}`)}
                    className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900 cursor-pointer"
                  >
                    <img
                      src={pl.coverUrl}
                      alt={pl.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                    </div>
                  </div>

                  <h4
                    onClick={() => setActiveView(`playlist_${pl.id}`)}
                    className="text-sm font-bold text-white truncate cursor-pointer hover:underline"
                  >
                    {pl.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{pl.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-900 mt-2 text-xs text-neutral-400">
                  <span className="font-mono text-[11px]">{trackCount} tracks</span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleSharePlaylist(pl)}
                      className="p-1 hover:text-white"
                      title="Share Playlist"
                    >
                      {copiedId === pl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    {pl.isCustom && (
                      <>
                        <button
                          onClick={() => duplicatePlaylist(pl.id)}
                          className="p-1 hover:text-white"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePlaylist(pl.id)}
                          className="p-1 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: LIKED SONGS */}
      {activeTab === 'liked' && (
        <div className="space-y-2">
          {likedSongs.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-xs">
              No liked songs yet. Tap the heart icon on any track to save it here!
            </div>
          ) : (
            likedSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, likedSongs)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                    <img src={song.coverUrl} alt={song.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{song.artist} · {song.language}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                  <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: DOWNLOADED / OFFLINE VAULT */}
      {activeTab === 'downloaded' && (
        <div className="space-y-6">
          {/* Storage telemetry bar */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Local Authorized Storage</h4>
                <p className="text-xs text-neutral-400">
                  {downloadedSongs.length} tracks cached · {totalStorageMb.toFixed(1)} MB allocated
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono">Lossless Audio Buffer</span>
            </div>
          </div>

          <div className="space-y-2">
            {downloadedSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, downloadedSongs)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                    <img src={song.coverUrl} alt={song.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{song.artist} · {song.language}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-400 font-mono">{song.fileSizeMb || 11.2} MB</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDownload(song.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                    title="Delete download"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ARTISTS */}
      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {favoriteArtists.length === 0 ? (
            <div className="col-span-full p-12 text-center text-neutral-500 text-xs">
              No followed artists yet. Visit artist pages to follow your favorite musicians!
            </div>
          ) : (
            favoriteArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => {
                  setSelectedArtistId(artist.id);
                  setActiveView('artist');
                }}
                className="group p-4 rounded-2xl bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 text-center transition-all cursor-pointer"
              >
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 border border-neutral-800 group-hover:border-emerald-500/50 transition-colors">
                  <img src={artist.avatarUrl} alt={artist.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{artist.name}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                  {(artist.monthlyListeners / 1000000).toFixed(1)}M listeners
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: ALBUMS */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {favoriteAlbums.length === 0 ? (
            <div className="col-span-full p-12 text-center text-neutral-500 text-xs">
              No saved albums yet.
            </div>
          ) : (
            favoriteAlbums.map((album) => (
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
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{album.artist} · {album.releaseYear}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: RECENTLY PLAYED */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {recentlyPlayed.map((song, idx) => (
            <div
              key={`${song.id}-${idx}`}
              onClick={() => playSong(song, recentlyPlayed)}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                  <img src={song.coverUrl} alt={song.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                  <p className="text-[11px] text-neutral-400 truncate">{song.artist} · {song.language}</p>
                </div>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
