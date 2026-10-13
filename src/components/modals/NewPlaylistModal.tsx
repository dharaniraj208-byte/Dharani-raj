import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, ListMusic, Plus, Check } from 'lucide-react';

interface NewPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated?: (playlistId: string) => void;
}

export const NewPlaylistModal: React.FC<NewPlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
}) => {
  const { createPlaylist, songs, accentColor } = useMusic();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const coverOptions = [
    '/src/assets/images/album_neon_monsoon_1791378078175.jpg',
    '/src/assets/images/album_celestial_echoes_1791377969899.jpg',
    '/src/assets/images/album_velvet_sands_1791378099850.jpg',
    '/src/assets/images/hero_spotlight_banner_1791377958114.jpg',
  ];
  const [selectedCover, setSelectedCover] = useState(coverOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPl = createPlaylist(title.trim(), description.trim(), selectedCover);
    // Add any selected initial tracks
    selectedTrackIds.forEach((sId) => {
      newPl.trackIds.push(sId);
    });

    setTitle('');
    setDescription('');
    setSelectedTrackIds([]);
    onClose();
    if (onPlaylistCreated) {
      onPlaylistCreated(newPl.id);
    }
  };

  const toggleTrack = (id: string) => {
    setSelectedTrackIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-200 space-y-5"
        role="dialog"
        aria-label="Create New Playlist"
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Create New Playlist</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Playlist Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Monsoon Rhythms"
              autoFocus
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a mood or story..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Cover Art selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Select Cover Artwork
            </label>
            <div className="grid grid-cols-4 gap-2">
              {coverOptions.map((c) => (
                <div
                  key={c}
                  onClick={() => setSelectedCover(c)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedCover === c ? 'border-emerald-400 scale-102 ring-2 ring-emerald-400/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={c} alt="Cover option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  {selectedCover === c && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick initial track picker */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Add Initial Tracks ({selectedTrackIds.length} selected)
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1 bg-neutral-950/60 p-2 rounded-xl border border-neutral-800/80">
              {songs.slice(0, 10).map((song) => {
                const isSelected = selectedTrackIds.includes(song.id);
                return (
                  <div
                    key={song.id}
                    onClick={() => toggleTrack(song.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                      isSelected ? 'bg-neutral-800 text-white font-medium' : 'hover:bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <span className="truncate">{song.title} · {song.artist}</span>
                    <span className="text-[10px] font-mono">{isSelected ? '✓' : '+'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold ${getAccentBg()}`}
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
