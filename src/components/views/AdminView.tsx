import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Song, Language, Genre, Mood } from '../../types';
import { LANGUAGES_LIST } from '../../data/musicCatalog';
import {
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  Radio,
  FileCheck,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    songs,
    artists,
    albums,
    addCustomSong,
    deleteSongFromCatalog,
    accentColor,
    addNotification,
  } = useMusic();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newLanguage, setNewLanguage] = useState<Language>('Tamil');
  const [newGenre, setNewGenre] = useState<Genre>('Electronic');
  const [newMood, setNewMood] = useState<Mood>('Chill');
  const [newDuration, setNewDuration] = useState('210');
  const [newSynthPreset, setNewSynthPreset] = useState<Song['synthPreset']>('carnatic_flute');
  const [newBpm, setNewBpm] = useState('120');
  const [newKey, setNewKey] = useState('D Minor');
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newLyrics, setNewLyrics] = useState('');

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;

    // Optional parse lyrics
    const parsedLyrics = newLyrics.trim()
      ? newLyrics.split('\n').map((line, idx) => ({
          time: idx * 6,
          text: line.trim(),
        }))
      : undefined;

    const newSong: Song = {
      id: `song_admin_${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim(),
      artistId: 'art_admin',
      album: 'Admin Licensed Master',
      albumId: 'alb_admin',
      language: newLanguage,
      genre: newGenre,
      mood: [newMood],
      duration: parseInt(newDuration) || 200,
      releaseYear: 2026,
      coverUrl: '/src/assets/images/album_neon_monsoon_1791378078175.jpg',
      synthPreset: newSynthPreset,
      playCount: 1,
      bpm: parseInt(newBpm) || 120,
      keyNote: newKey || 'C Major',
      isDemo: false,
      isAuthorizedDownload: true,
      streamUrl: newStreamUrl.trim() || undefined,
      lyrics: parsedLyrics,
      lyricsLanguage: newLanguage,
    };

    addCustomSong(newSong);
    addNotification('Catalog Updated', `Added "${newSong.title}" to Sonora catalog.`, 'system');

    // Reset
    setNewTitle('');
    setNewArtist('');
    setNewStreamUrl('');
    setNewLyrics('');
    setIsAddModalOpen(false);
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
      {/* Top Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Authorized Content & Metadata Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Metadata Administration
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Register authorized tracks, edit musical keys, frequencies, and synchronized lyrics across 16 global languages.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${getAccentBg()}`}
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Song</span>
        </button>
      </section>

      {/* System Health & Catalog Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-400">Audio Pipeline</p>
            <p className="text-sm font-bold text-white">Web Audio Context Active</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-400">Total Catalog</p>
            <p className="text-sm font-bold text-white">{songs.length} Tracks Across 16 Languages</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-400">Compliance</p>
            <p className="text-sm font-bold text-white">Authorized & Synth Synthesis</p>
          </div>
        </div>
      </div>

      {/* Songs Table Management */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white">Manage Catalog Songs ({songs.length})</h3>

        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950/60">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 text-[11px] font-mono uppercase text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Track Title</th>
                <th className="py-3 px-4">Artist</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Genre</th>
                <th className="py-3 px-4">Synth Preset</th>
                <th className="py-3 px-4">Key / BPM</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white truncate max-w-[200px]">
                    {song.title}
                  </td>
                  <td className="py-3 px-4 truncate max-w-[150px]">{song.artist}</td>
                  <td className="py-3 px-4 font-mono">{song.language}</td>
                  <td className="py-3 px-4">{song.genre}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">{song.synthPreset}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">{song.keyNote} · {song.bpm}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteSongFromCatalog(song.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                      title="Delete song"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Song Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <form
            onSubmit={handleAddSong}
            className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 text-neutral-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Song to Sonora Catalog</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block mb-1 text-neutral-400">Song Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Celestial Mirage"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-neutral-400">Artist *</label>
                <input
                  type="text"
                  required
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="e.g. Sonora Ensemble"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-neutral-400">Language</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value as any)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {LANGUAGES_LIST.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-neutral-400">Genre</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value as any)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {['Electronic', 'Carnatic', 'Sufi', 'Pop', 'Acoustic', 'Hip-Hop', 'K-Pop', 'J-Pop', 'Latin', 'Folk'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-neutral-400">Audio Synth Preset</label>
                <select
                  value={newSynthPreset}
                  onChange={(e) => setNewSynthPreset(e.target.value as any)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value="carnatic_flute">Carnatic Flute & Tambura</option>
                  <option value="sitar_drone">Sitar & Modal Strings</option>
                  <option value="kpop_synth">K-Pop Dance Synth</option>
                  <option value="lofi_chill">Lo-Fi Rhodes Beats</option>
                  <option value="latin_guitar">Latin Acoustic Phrygian</option>
                  <option value="ambient_piano">Ambient Lydian Piano</option>
                  <option value="indie_groove">Indie Groove Bass</option>
                  <option value="electronic_pulse">Electronic Pulse 808</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-neutral-400">BPM / Musical Key</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newBpm}
                    onChange={(e) => setNewBpm(e.target.value)}
                    className="w-20 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Key (e.g. D Minor)"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs text-neutral-400">External Audio Stream URL (optional)</label>
              <input
                type="url"
                value={newStreamUrl}
                onChange={(e) => setNewStreamUrl(e.target.value)}
                placeholder="https://... (Leave empty for procedural synthesizer audio)"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs text-neutral-400">Lyrics (One line per timestamp step)</label>
              <textarea
                rows={3}
                value={newLyrics}
                onChange={(e) => setNewLyrics(e.target.value)}
                placeholder="Line 1&#10;Line 2&#10;Line 3"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-bold ${getAccentBg()}`}
              >
                Save & Publish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
