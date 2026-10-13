/**
 * SONORA — Master Music Streaming Application
 * Premium multilingual music streaming web/mobile platform
 */

import React, { useState } from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileNav } from './components/layout/MobileNav';
import { MiniPlayer } from './components/player/MiniPlayer';
import { FullScreenPlayer } from './components/player/FullScreenPlayer';
import { AudioSettingsModal } from './components/player/AudioSettingsModal';
import { QueueDrawer } from './components/player/QueueDrawer';
import { NewPlaylistModal } from './components/modals/NewPlaylistModal';
import { PlaybackErrorToast } from './components/player/PlaybackErrorToast';
import { PlaybackDiagnosticsModal } from './components/modals/PlaybackDiagnosticsModal';

// Views
import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { LanguagesView } from './components/views/LanguagesView';
import { SearchView } from './components/views/SearchView';
import { LibraryView } from './components/views/LibraryView';
import { ArtistView } from './components/views/ArtistView';
import { AlbumView } from './components/views/AlbumView';
import { StatsView } from './components/views/StatsView';
import { AdminView } from './components/views/AdminView';
import { SettingsView } from './components/views/SettingsView';
import { PlaylistDetailView } from './components/views/PlaylistDetailView';

const MainAppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedArtistId, setSelectedArtistId] = useState<string>('art_anirudh');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('alb_neon_monsoon');
  const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState<boolean>(false);

  const handleOpenArtist = (artistId: string) => {
    setSelectedArtistId(artistId);
    setActiveView('artist');
  };

  const handleOpenAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setActiveView('album');
  };

  // Render view router
  const renderActiveView = () => {
    if (activeView.startsWith('playlist_')) {
      const plId = activeView.replace('playlist_', '');
      return <PlaylistDetailView playlistId={plId} setActiveView={setActiveView} />;
    }

    switch (activeView) {
      case 'home':
        return (
          <HomeView
            setActiveView={setActiveView}
            setSelectedArtistId={handleOpenArtist}
            setSelectedAlbumId={handleOpenAlbum}
          />
        );
      case 'explore':
        return (
          <ExploreView
            setActiveView={setActiveView}
            setSelectedArtistId={handleOpenArtist}
          />
        );
      case 'languages':
        return (
          <LanguagesView
            setSelectedArtistId={handleOpenArtist}
            setSelectedAlbumId={handleOpenAlbum}
          />
        );
      case 'search':
        return (
          <SearchView
            setSelectedArtistId={handleOpenArtist}
            setSelectedAlbumId={handleOpenAlbum}
            setActiveView={setActiveView}
          />
        );
      case 'library':
      case 'playlists':
      case 'favorites':
      case 'history':
        return (
          <LibraryView
            onOpenNewPlaylistModal={() => setIsNewPlaylistModalOpen(true)}
            setActiveView={setActiveView}
            setSelectedArtistId={handleOpenArtist}
            setSelectedAlbumId={handleOpenAlbum}
          />
        );
      case 'artist':
        return (
          <ArtistView
            artistId={selectedArtistId}
            setSelectedAlbumId={handleOpenAlbum}
            setActiveView={setActiveView}
          />
        );
      case 'album':
        return (
          <AlbumView
            albumId={selectedAlbumId}
            setSelectedArtistId={handleOpenArtist}
            setActiveView={setActiveView}
          />
        );
      case 'stats':
        return <StatsView />;
      case 'admin':
        return <AdminView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <HomeView
            setActiveView={setActiveView}
            setSelectedArtistId={handleOpenArtist}
            setSelectedAlbumId={handleOpenAlbum}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 select-none">
      {/* Desktop Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNewPlaylistModal={() => setIsNewPlaylistModalOpen(true)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <TopHeader
          onSearchClick={() => setActiveView('search')}
          setActiveView={setActiveView}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-36 md:pb-28 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>

        {/* Persistent Bottom Music Player */}
        <MiniPlayer />

        {/* Mobile Fixed Bottom Nav */}
        <MobileNav activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Expanded & Overlay Modals */}
      <FullScreenPlayer />
      <AudioSettingsModal />
      <QueueDrawer />
      <PlaybackErrorToast />
      <PlaybackDiagnosticsModal />
      <NewPlaylistModal
        isOpen={isNewPlaylistModalOpen}
        onClose={() => setIsNewPlaylistModalOpen(false)}
        onPlaylistCreated={(id) => setActiveView(`playlist_${id}`)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainAppContent />
    </MusicProvider>
  );
}
