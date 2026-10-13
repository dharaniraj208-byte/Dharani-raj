import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { ThemeMode, AccentColor, AudioQuality } from '../../types';
import {
  Settings,
  Palette,
  Volume2,
  Bell,
  HardDrive,
  Keyboard,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    audioQuality,
    setAudioQuality,
    gapless,
    setGapless,
    crossfade,
    setCrossfade,
    addNotification,
  } = useMusic();

  const [notifReleases, setNotifReleases] = useState(true);
  const [notifMixes, setNotifMixes] = useState(true);
  const [notifDownloads, setNotifDownloads] = useState(true);
  const [isCacheCleared, setIsCacheCleared] = useState(false);

  const accents: { id: AccentColor; label: string; bgClass: string }[] = [
    { id: 'emerald', label: 'Emerald Green', bgClass: 'bg-emerald-500' },
    { id: 'violet', label: 'Royal Violet', bgClass: 'bg-violet-500' },
    { id: 'amber', label: 'Sunset Amber', bgClass: 'bg-amber-500' },
    { id: 'rose', label: 'Rose Gold', bgClass: 'bg-rose-500' },
    { id: 'cyan', label: 'Electric Cyan', bgClass: 'bg-cyan-500' },
  ];

  const handleClearCache = () => {
    setIsCacheCleared(true);
    addNotification('Cache Cleared', 'Offline audio cache and temporary telemetry cleared.', 'system');
    setTimeout(() => setIsCacheCleared(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          App Settings
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Customize your visual experience, audio fidelity, and notifications.
        </p>
      </div>

      {/* Theme & Visuals */}
      <section className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>Appearance & Themes</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">Display Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark Slate', desc: 'Onyx background with soft contrast' },
                { id: 'amoled', label: 'Pure AMOLED', desc: 'Pitch black #000000 OLED saver' },
                { id: 'light', label: 'Light Studio', desc: 'Airy daylight mode' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as ThemeMode)}
                  className={`p-3 text-left rounded-2xl border transition-all ${
                    theme === t.id
                      ? 'bg-neutral-800 border-white text-white'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">Accent Color</label>
            <div className="flex flex-wrap gap-3">
              {accents.map((acc) => {
                const isSelected = accentColor === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setAccentColor(acc.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-white bg-neutral-800 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${acc.bgClass}`} />
                    <span>{acc.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Audio Playback Preferences */}
      <section className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Playback Dynamics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Default Audio Stream Quality</span>
              <span className="font-mono text-neutral-400 uppercase">{audioQuality}</span>
            </div>
            <select
              value={audioQuality}
              onChange={(e) => setAudioQuality(e.target.value as AudioQuality)}
              className="w-full bg-neutral-800 border border-neutral-700 text-xs text-white rounded-xl p-2.5 focus:outline-none"
            >
              <option value="auto">Auto Adaptive (Network Balanced)</option>
              <option value="low">Low (96 kbps Data Saver)</option>
              <option value="normal">Normal (160 kbps)</option>
              <option value="high">High Fidelity (320 kbps AAC)</option>
              <option value="lossless">Studio Master (FLAC Lossless)</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Crossfade Duration</span>
              <span className="font-mono text-neutral-400">{crossfade}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={crossfade}
              onChange={(e) => setCrossfade(parseInt(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <p className="text-[10px] text-neutral-400">Blends the end of one track into the next.</p>
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Notification Preferences</span>
        </h3>

        <div className="divide-y divide-neutral-800/80 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Artist Releases</p>
              <p className="text-[11px] text-neutral-400">Alerts when followed artists release tracks</p>
            </div>
            <input
              type="checkbox"
              checked={notifReleases}
              onChange={() => setNotifReleases(!notifReleases)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Personalized Mixes</p>
              <p className="text-[11px] text-neutral-400">Daily and weekly customized playlist drops</p>
            </div>
            <input
              type="checkbox"
              checked={notifMixes}
              onChange={() => setNotifMixes(!notifMixes)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Download Notifications</p>
              <p className="text-[11px] text-neutral-400">Status alerts on offline storage syncing</p>
            </div>
            <input
              type="checkbox"
              checked={notifDownloads}
              onChange={() => setNotifDownloads(!notifDownloads)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts Reference */}
      <section className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-rose-400" />
          <span>Keyboard Shortcuts</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {[
            { key: 'Space', desc: 'Play / Pause' },
            { key: 'Ctrl + →', desc: 'Next Track' },
            { key: 'Ctrl + ←', desc: 'Previous Track' },
            { key: 'M', desc: 'Mute / Unmute' },
            { key: 'F', desc: 'Toggle Fullscreen Player' },
            { key: 'Esc', desc: 'Close Modals' },
          ].map((sc) => (
            <div key={sc.key} className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 flex items-center justify-between">
              <span className="text-neutral-400">{sc.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[11px] font-mono text-white">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* Storage and Cache */}
      <section className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local Cache & Audio Storage</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Remove temporary streamed blocks and restore offline cache.
          </p>
        </div>

        <button
          onClick={handleClearCache}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
        >
          {isCacheCleared ? 'Cache Emptied ✓' : 'Clear Cache'}
        </button>
      </section>
    </div>
  );
};
