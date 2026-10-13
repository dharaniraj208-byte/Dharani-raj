import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { EqualizerPreset, AudioQuality } from '../../types';
import { X, Sliders, Volume2, Sparkles, Gauge, Radio, ShieldCheck } from 'lucide-react';

export const AudioSettingsModal: React.FC = () => {
  const {
    isAudioSettingsOpen,
    setIsAudioSettingsOpen,
    audioQuality,
    setAudioQuality,
    equalizerPreset,
    setEqualizerPreset,
    equalizerBands,
    setEqualizerBandGain,
    bassBoost,
    setBassBoost,
    trebleBoost,
    setTrebleBoost,
    stereoBalance,
    setStereoBalance,
    playbackRate,
    setPlaybackRate,
    crossfade,
    setCrossfade,
    gapless,
    setGapless,
    accentColor,
  } = useMusic();

  if (!isAudioSettingsOpen) return null;

  const bandLabels = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz'];
  const presets: EqualizerPreset[] = [
    'Flat',
    'Bass Boost',
    'Treble Boost',
    'Vocal',
    'Rock',
    'Pop',
    'Classical',
    'Jazz',
    'Electronic',
    'Hip-Hop',
  ];

  const qualityOptions: { id: AudioQuality; title: string; desc: string; bitRate: string }[] = [
    { id: 'auto', title: 'Auto Adaptive', desc: 'Dynamically balances fidelity & network conditions', bitRate: '128 - 320 kbps' },
    { id: 'low', title: 'Data Saver', desc: 'Minimal cellular data usage for mobile roaming', bitRate: '96 kbps' },
    { id: 'normal', title: 'Normal Standard', desc: 'Balanced compression for casual listening', bitRate: '160 kbps' },
    { id: 'high', title: 'High Fidelity', desc: 'Crisp studio master stereo definition', bitRate: '320 kbps AAC' },
    { id: 'lossless', title: 'Authorized Studio Master', desc: 'Bit-perfect lossless stream where available', bitRate: 'FLAC 24-bit / 96kHz' },
  ];

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      case 'cyan': return 'bg-cyan-500';
      default: return 'bg-emerald-500';
    }
  };

  const getAccentBorder = () => {
    switch (accentColor) {
      case 'violet': return 'border-violet-500 text-violet-400';
      case 'amber': return 'border-amber-500 text-amber-400';
      case 'rose': return 'border-rose-500 text-rose-400';
      case 'cyan': return 'border-cyan-500 text-cyan-400';
      default: return 'border-emerald-500 text-emerald-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 space-y-6"
        role="dialog"
        aria-label="Audio Engine and Equalizer Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${getAccentBg()} text-neutral-950`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Audio Engineering & Equalizer</h2>
              <p className="text-xs text-neutral-400">Web Audio API 5-Band BiquadFilter Engine</p>
            </div>
          </div>
          <button
            onClick={() => setIsAudioSettingsOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Quality Selection */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Radio className="w-4 h-4 text-neutral-400" />
              Stream Quality & Bitrate
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Licensed authorized sources
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {qualityOptions.map((opt) => {
              const active = audioQuality === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAudioQuality(opt.id)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    active
                      ? `bg-neutral-800/90 ${getAccentBorder()} shadow-sm`
                      : 'border-neutral-800/80 bg-neutral-950/40 hover:bg-neutral-800/40 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{opt.title}</span>
                    <span className="text-[11px] font-mono opacity-80">{opt.bitRate}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Equalizer Presets */}
        <section className="space-y-4 pt-2 border-t border-neutral-800/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-400" />
              Frequency Presets
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Mode: <span className="text-neutral-200 font-semibold">{equalizerPreset}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => {
              const active = equalizerPreset === p;
              return (
                <button
                  key={p}
                  onClick={() => setEqualizerPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? `${getAccentBg()} text-neutral-950 font-semibold`
                      : 'bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* 5-Band Visual Sliders */}
          <div className="bg-neutral-950/60 rounded-xl p-4 border border-neutral-800/70 space-y-3">
            <div className="grid grid-cols-5 gap-3 h-40 pt-4 pb-2 items-center text-center">
              {bandLabels.map((label, idx) => {
                const gain = equalizerBands[idx] || 0;
                return (
                  <div key={label} className="flex flex-col items-center justify-between h-full">
                    <span className="text-[11px] font-mono text-neutral-400">
                      {gain > 0 ? `+${gain}dB` : `${gain}dB`}
                    </span>
                    <div className="h-24 flex items-center justify-center">
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="1"
                        value={gain}
                        onChange={(e) => setEqualizerBandGain(idx, parseFloat(e.target.value))}
                        className="h-20 w-1.5 appearance-none rounded-full bg-neutral-800 accent-emerald-400 cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                        aria-label={`Equalizer band ${label}`}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 px-2 pt-1 border-t border-neutral-800/50">
              <span>Sub-Bass</span>
              <span>Low-Mid</span>
              <span>Midrange</span>
              <span>Presence</span>
              <span>Brilliance</span>
            </div>
          </div>
        </section>

        {/* Tone & Acoustics */}
        <section className="space-y-4 pt-2 border-t border-neutral-800/60">
          <span className="text-sm font-semibold flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-neutral-400" />
            Acoustic Tone & Staging
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bass Boost */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/70 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Bass Boost</span>
                <span className="font-mono text-neutral-400">+{bassBoost} dB</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={bassBoost}
                onChange={(e) => setBassBoost(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Treble Boost */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/70 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Treble Boost</span>
                <span className="font-mono text-neutral-400">+{trebleBoost} dB</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={trebleBoost}
                onChange={(e) => setTrebleBoost(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Stereo Balance */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/70 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Stereo Balance</span>
                <span className="font-mono text-neutral-400">
                  {stereoBalance === 0 ? 'Center' : stereoBalance < 0 ? `L ${Math.abs(Math.round(stereoBalance * 100))}%` : `R ${Math.round(stereoBalance * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={stereoBalance}
                onChange={(e) => setStereoBalance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </section>

        {/* Playback Controls & Dynamics */}
        <section className="space-y-4 pt-2 border-t border-neutral-800/60">
          <span className="text-sm font-semibold flex items-center gap-2">
            <Gauge className="w-4 h-4 text-neutral-400" />
            Dynamics & Transitions
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Speed */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/70 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Playback Speed</span>
                <span className="font-mono text-neutral-400">{playbackRate}x</span>
              </div>
              <div className="flex gap-1 justify-between">
                {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-1 text-[11px] rounded ${playbackRate === rate ? `${getAccentBg()} text-neutral-950 font-bold` : 'bg-neutral-800 text-neutral-300'}`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Crossfade */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/70 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Crossfade</span>
                <span className="font-mono text-neutral-400">{crossfade}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={crossfade}
                onChange={(e) => setCrossfade(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Gapless Playback */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-200 font-medium">Gapless Playback</p>
                <p className="text-[11px] text-neutral-400">Seamless transitions</p>
              </div>
              <button
                onClick={() => setGapless(!gapless)}
                className={`w-11 h-6 rounded-full transition-colors relative ${gapless ? getAccentBg() : 'bg-neutral-800'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${gapless ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={() => setIsAudioSettingsOpen(false)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold ${getAccentBg()} text-neutral-950 hover:opacity-95 transition-opacity`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
