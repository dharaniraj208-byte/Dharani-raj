import React from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  BarChart3,
  Clock,
  Music,
  User,
  Globe2,
  Headphones,
  Award,
  Calendar,
} from 'lucide-react';

export const StatsView: React.FC = () => {
  const { stats, artists, songs, accentColor } = useMusic();

  const topArtist = artists.find((a) => a.id === stats.topArtistId) || artists[0];
  const topSong = songs.find((s) => s.id === stats.mostPlayedSongId) || songs[0];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxDayVal = Math.max(...days.map((d) => stats.dailyMinutes[d] || 20));

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
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Profile Overview Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-xl shrink-0">
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-3xl font-bold text-emerald-400">
            D
          </div>
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-extrabold text-white font-display">
              Dharani Raj
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              Sonora Hi-Fi Member
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            dharaniraj208@gmail.com · Multilingual Audiophile Explorer
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-300 pt-1 font-mono">
            <span>{stats.totalMinutes} Listening Minutes</span>
            <span>·</span>
            <span>{stats.songsPlayedCount} Tracks Streamed</span>
          </div>
        </div>
      </section>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Listening Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {stats.totalMinutes} <span className="text-xs text-neutral-400 font-sans">mins</span>
          </p>
          <p className="text-[10px] text-neutral-500">Across 16 languages</p>
        </div>

        {/* Top Artist */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Top Artist</span>
            <User className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-base sm:text-lg font-bold text-white truncate">
            {topArtist?.name}
          </p>
          <p className="text-[10px] text-neutral-500">Most frequent streams</p>
        </div>

        {/* Top Language */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Top Language</span>
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {stats.topLanguage}
          </p>
          <p className="text-[10px] text-neutral-500">Preferred region</p>
        </div>

        {/* Top Genre */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Top Genre</span>
            <Music className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {stats.topGenre}
          </p>
          <p className="text-[10px] text-neutral-500">Dominant frequency</p>
        </div>
      </div>

      {/* Weekly Listening Activity Bar Chart */}
      <section className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Weekly Listening Activity</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Daily minutes streamed over the past 7 days
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Avg. 49 mins / day</span>
        </div>

        {/* Interactive SVG / CSS Chart */}
        <div className="h-48 pt-6 flex items-end justify-between gap-2 sm:gap-6 border-b border-neutral-800 pb-2">
          {days.map((day) => {
            const val = stats.dailyMinutes[day] || 30;
            const heightPercent = Math.max(12, Math.round((val / maxDayVal) * 100));

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}m
                </span>
                <div className="w-full max-w-[48px] bg-neutral-800/60 rounded-t-xl overflow-hidden h-36 flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-125 ${getAccentBg()}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-neutral-400 font-medium">{day}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Track Spotlight */}
      <section className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
            <img src={topSong.coverUrl} alt={topSong.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald-400">#1 Heavy Rotation Track</span>
            <h4 className="text-sm font-bold text-white">{topSong.title}</h4>
            <p className="text-xs text-neutral-400">{topSong.artist} · {topSong.language}</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-neutral-400">
          <span>{topSong.playCount.toLocaleString()} plays</span>
        </div>
      </section>
    </div>
  );
};
