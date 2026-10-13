import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Home, Search, Compass, Library, Disc3 } from 'lucide-react';

interface MobileNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeView, setActiveView }) => {
  const { accentColor, currentSong, isPlaying, setIsFullscreenPlayerOpen } = useMusic();

  const getAccentText = () => {
    switch (accentColor) {
      case 'violet': return 'text-violet-400';
      case 'amber': return 'text-amber-400';
      case 'rose': return 'text-rose-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-emerald-400';
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'library', label: 'Library', icon: Library },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-2 h-16 flex items-center justify-around"
      aria-label="Mobile Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? getAccentText() : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* Now Playing Screen Launcher for mobile */}
      {currentSong && (
        <button
          onClick={() => setIsFullscreenPlayerOpen(true)}
          className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center py-1 text-emerald-400 transition-colors"
          title="Open Player Screen"
        >
          <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Player</span>
        </button>
      )}
    </nav>
  );
};
