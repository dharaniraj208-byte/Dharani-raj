import React from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  Home,
  Compass,
  Globe2,
  Search,
  Library,
  ListMusic,
  Heart,
  History,
  BarChart3,
  Settings,
  ShieldAlert,
  Plus,
  Radio,
  Disc3,
  Sparkles,
  Maximize2,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenNewPlaylistModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenNewPlaylistModal,
}) => {
  const {
    playlists,
    favorites,
    audioQuality,
    accentColor,
    currentSong,
    isPlaying,
    setIsFullscreenPlayerOpen,
  } = useMusic();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore & Moods', icon: Compass },
    { id: 'languages', label: 'Languages', icon: Globe2 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'history', label: 'Recently Played', icon: History },
    { id: 'stats', label: 'Listening Stats', icon: BarChart3 },
    { id: 'admin', label: 'Metadata Admin', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getAccentColor = () => {
    switch (accentColor) {
      case 'violet': return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      case 'amber': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'rose': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'cyan': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getAccentDot = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-400';
      case 'amber': return 'bg-amber-400';
      case 'rose': return 'bg-rose-400';
      case 'cyan': return 'bg-cyan-400';
      default: return 'bg-emerald-400';
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-neutral-950/80 backdrop-blur-xl border-r border-neutral-800/80 h-full p-4 select-none">
      {/* Brand Zone */}
      <div className="flex items-center justify-between px-3 py-3 mb-4 border-b border-neutral-800/40">
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/80 flex items-center justify-center shadow-md group-hover:border-emerald-500/50 transition-colors">
            <Disc3 className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          </div>
          <div>
            <span className="font-display text-lg font-extrabold tracking-tight text-white block">
              SONORA
            </span>
          </div>
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="space-y-0.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {currentSong && (
          <button
            onClick={() => setIsFullscreenPlayerOpen(true)}
            className="w-full mb-3 flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800/90 border border-neutral-700/60 hover:border-emerald-500/50 shadow-md transition-all group"
            title="Open Now Playing Player Screen"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                )}
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">NOW PLAYING</span>
                </div>
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">{currentSong.title}</p>
              </div>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0 ml-1" />
          </button>
        )}

        <p className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 tracking-wider">
          DISCOVER
        </p>

        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? `${getAccentColor()} font-semibold border shadow-sm`
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4">
          <p className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 tracking-wider">
            YOUR COLLECTION
          </p>
        </div>

        {navItems.slice(4, 9).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? `${getAccentColor()} font-semibold border shadow-sm`
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.id === 'favorites' && favorites.songIds.length > 0 && (
                <span className="ml-auto text-[10px] font-mono text-neutral-400">
                  {favorites.songIds.length}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[10px] font-semibold text-neutral-400 tracking-wider">
              PLAYLISTS
            </span>
            <button
              onClick={onOpenNewPlaylistModal}
              className="p-1 hover:text-white text-neutral-400 hover:bg-neutral-800 rounded transition-colors"
              title="Create Playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 mt-1 max-h-36 overflow-y-auto pr-1">
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => setActiveView(`playlist_${pl.id}`)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs truncate transition-colors ${
                  activeView === `playlist_${pl.id}`
                    ? 'text-white bg-neutral-900 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0" />
                <span className="truncate">{pl.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800/40 mt-3">
          {navItems.slice(9).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? `${getAccentColor()} font-semibold border shadow-sm`
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer System Status / Quality Card */}
      <div className="pt-3 border-t border-neutral-800/50 mt-2">
        <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getAccentDot()} animate-pulse`} />
            <div className="text-left">
              <p className="text-[11px] font-semibold text-neutral-200">Lossless Core</p>
              <p className="text-[10px] text-neutral-400 uppercase font-mono">{audioQuality} 320k</p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('settings')}
            className="text-[10px] text-neutral-400 hover:text-white transition-colors"
          >
            Adjust
          </button>
        </div>
      </div>
    </aside>
  );
};
