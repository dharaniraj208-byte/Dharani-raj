import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { LANGUAGES_LIST } from '../../data/musicCatalog';
import { Language } from '../../types';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Check,
  Globe2,
  X,
} from 'lucide-react';

interface TopHeaderProps {
  onSearchClick: () => void;
  setActiveView: (view: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSearchClick, setActiveView }) => {
  const {
    selectedLanguages,
    toggleLanguageFilter,
    selectAllLanguages,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    theme,
    setTheme,
    accentColor,
    stats,
  } = useMusic();

  const [greeting, setGreeting] = useState<string>('Good Evening');
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getAccentBg = () => {
    switch (accentColor) {
      case 'violet': return 'bg-violet-500 text-neutral-950';
      case 'amber': return 'bg-amber-500 text-neutral-950';
      case 'rose': return 'bg-rose-500 text-neutral-950';
      case 'cyan': return 'bg-cyan-500 text-neutral-950';
      default: return 'bg-emerald-500 text-neutral-950';
    }
  };

  const getAccentBorder = () => {
    switch (accentColor) {
      case 'violet': return 'border-violet-500 text-violet-400 bg-violet-500/10';
      case 'amber': return 'border-amber-500 text-amber-400 bg-amber-500/10';
      case 'rose': return 'border-rose-500 text-rose-400 bg-rose-500/10';
      case 'cyan': return 'border-cyan-500 text-cyan-400 bg-cyan-500/10';
      default: return 'border-emerald-500 text-emerald-400 bg-emerald-500/10';
    }
  };

  const isAllLanguagesSelected = selectedLanguages.length === 0;

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80 px-4 md:px-6 py-3">
      {/* Top Zone */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Greeting & Subtitle */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{greeting}</span>
              <span className="text-xs font-normal text-neutral-400 hidden sm:inline">
                · Ready to stream
              </span>
            </h1>
          </div>
        </div>

        {/* Center/Search Quick trigger */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs mx-4">
          <button
            onClick={onSearchClick}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span>Search songs, artists, genres...</span>
            </span>
            <kbd className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right Actions: Notifications, Theme, Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile search trigger */}
          <button
            onClick={onSearchClick}
            className="sm:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              if (theme === 'dark') setTheme('amoled');
              else if (theme === 'amoled') setTheme('light');
              else setTheme('dark');
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title={`Current theme: ${theme.toUpperCase()}`}
          >
            {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in duration-150 text-neutral-200">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-neutral-400 hover:text-white"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-neutral-800/60 my-2">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-neutral-500">No recent notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`py-2.5 px-1 flex flex-col gap-1 cursor-pointer transition-colors ${
                          !n.read ? 'bg-neutral-800/30' : 'opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                          <span className="text-[10px] text-neutral-400 font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-neutral-300 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Pill */}
          <button
            onClick={() => setActiveView('stats')}
            className="flex items-center gap-2 p-1 pl-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 transition-colors"
          >
            <span className="text-xs font-semibold text-neutral-300 hidden sm:inline pr-1">
              Dharani
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-neutral-950 font-bold text-xs shadow-sm">
              D
            </div>
          </button>
        </div>
      </div>

      {/* Multilingual Filter Chips Scroll Bar */}
      <div className="mt-3 pt-2.5 border-t border-neutral-800/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[10px] font-semibold text-neutral-400 shrink-0 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Globe2 className="w-3 h-3 text-neutral-400" />
          Filter:
        </span>

        {/* All Languages Tab */}
        <button
          onClick={selectAllLanguages}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
            isAllLanguagesSelected
              ? `${getAccentBg()} font-semibold shadow-sm`
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          All Languages
        </button>

        {LANGUAGES_LIST.map((lang) => {
          const isSelected = selectedLanguages.includes(lang);
          return (
            <button
              key={lang}
              onClick={() => toggleLanguageFilter(lang)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? `${getAccentBorder()} font-semibold border shadow-sm`
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {lang}
              {isSelected && <span className="ml-1 text-[10px]">✓</span>}
            </button>
          );
        })}
      </div>
    </header>
  );
};
