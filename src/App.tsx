import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { VideoModal } from './components/modals/VideoModal';
import { DocModal } from './components/modals/DocModal';
import { BookModal } from './components/modals/BookModal';
import { TestModal } from './components/modals/TestModal';
import { AuthPage } from './pages/AuthPage';
import { VerificationPage } from './pages/VerificationPage';
import { ProfileSetupModal } from './components/modals/ProfileSetupModal';
import { ProfileSettingsModal } from './components/modals/ProfileSettingsModal';
import { CommentsModal } from './components/modals/CommentsModal';
import { StreakDrawer } from './components/drawers/StreakDrawer';
import { AppleShopDrawer } from './components/drawers/AppleShopDrawer';
import { AdminConsoleModal } from './components/modals/AdminConsoleModal';
import { SavedItemsModal } from './components/modals/SavedItemsModal';
import { Bell, Loader2 } from 'lucide-react';

import { BoneAIFAB } from './components/bone-ai/BoneAIFAB';
import { BoneAIPopup } from './components/bone-ai/BoneAIPopup';

// Pages
import { HomePage } from './pages/HomePage';
import { VideosPage } from './pages/VideosPage';
import { PostsPage } from './pages/PostsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { BooksPage } from './pages/BooksPage';
import { TestsPage } from './pages/TestsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { GamesPage } from './pages/GamesPage';
import { StudyRoomsPage } from './pages/StudyRoomsPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { FocusClockPage } from './pages/FocusClockPage';
import { LinkPage } from './pages/LinkPage';
import { FirestoreDashboardPage } from './pages/FirestoreDashboardPage';

const ToolsPage: React.FC = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-wider font-heading">
      Tools & Utilities
    </h1>
    <div className="bg-[#09152B] border border-cyan-500/30 rounded-3xl p-8 text-center text-gray-400">
      Tools section is under construction. Coming soon!
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const {
    currentRoute,
    sidebarCollapsed,
    notificationMessage,
    user,
    updateUserProfile,
    isProfileSettingsOpen,
    isBoneAIOpen,
    setIsBoneAIOpen,
    isBoneAIEnabled,
    isSavedItemsOpen,
    setIsSavedItemsOpen,
    isStreakDrawerOpen,
    setIsStreakDrawerOpen,
    isAppleShopOpen,
    setIsAppleShopOpen,
    isAdminConsoleOpen,
    setIsAdminConsoleOpen,
    setIsProfileSettingsOpen,
    setIsSearchOpen,
    activeVideoModal,
    setActiveVideoModal,
    activeDocModal,
    setActiveDocModal,
    activeBookModal,
    setActiveBookModal,
    activeTestModal,
    setActiveTestModal,
  } = useApp();
  const { currentUser, authLoading, pendingVerificationEmail, userRole } = useAuth();

  // Global Escape key listener — closes the innermost open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeVideoModal) { setActiveVideoModal(null); return; }
        if (activeDocModal) { setActiveDocModal(null); return; }
        if (activeBookModal) { setActiveBookModal(null); return; }
        if (activeTestModal) { setActiveTestModal(null); return; }
        if (isProfileSettingsOpen) { setIsProfileSettingsOpen(false); return; }
        if (isAdminConsoleOpen) { setIsAdminConsoleOpen(false); return; }
        if (isSavedItemsOpen) { setIsSavedItemsOpen(false); return; }
        if (isStreakDrawerOpen) { setIsStreakDrawerOpen(false); return; }
        if (isAppleShopOpen) { setIsAppleShopOpen(false); return; }
        if (isBoneAIOpen) { setIsBoneAIOpen(false); return; }
      }
      // Ctrl+K opens search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeVideoModal, activeDocModal, activeBookModal, activeTestModal,
    isProfileSettingsOpen, isAdminConsoleOpen, isSavedItemsOpen,
    isStreakDrawerOpen, isAppleShopOpen, isBoneAIOpen,
    setActiveVideoModal, setActiveDocModal, setActiveBookModal, setActiveTestModal,
    setIsProfileSettingsOpen, setIsAdminConsoleOpen, setIsSavedItemsOpen,
    setIsStreakDrawerOpen, setIsAppleShopOpen, setIsBoneAIOpen,
    setIsSearchOpen,
  ]);

  // Lock body scroll whenever any modal/drawer is open
  useEffect(() => {
    const anyOpen = !!(
      activeVideoModal || activeDocModal || activeBookModal || activeTestModal ||
      isProfileSettingsOpen || isAdminConsoleOpen || isSavedItemsOpen ||
      isStreakDrawerOpen || isAppleShopOpen
    );
    document.body.classList.toggle('modal-open', anyOpen);
    return () => document.body.classList.remove('modal-open');
  }, [
    activeVideoModal, activeDocModal, activeBookModal, activeTestModal,
    isProfileSettingsOpen, isAdminConsoleOpen, isSavedItemsOpen,
    isStreakDrawerOpen, isAppleShopOpen,
  ]);

  // 1. Firebase is resolving auth state — show the real app shell to make it feel instantly loaded
  if (authLoading) {
    return (
      <div className="min-h-screen relative font-sans text-white select-none overflow-x-hidden">
        <BackgroundCanvas />
        <TopBar />
        <Sidebar />
        <main className={`relative z-10 pt-20 pb-12 px-4 sm:px-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <div className="max-w-[1366px] mx-auto">
            {/* Empty space during split-second loading */}
            <div className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  // 2. Waiting for email verification
  if (pendingVerificationEmail) {
    return <VerificationPage />;
  }

  // 3. Not signed in → auth screen
  if (!currentUser) {
    return <AuthPage />;
  }

  // 4. Signed in but profile setup not completed
  if (user && user.setupComplete === false) {
    return <ProfileSetupModal />;
  }

  // 5. Signed in + verified + setup complete → dashboard
  const renderRoute = () => {
    switch (currentRoute) {
      case 'home': return <HomePage />;
      case 'videos': return <VideosPage />;
      case 'posts': return <PostsPage />;
      case 'study-rooms': return <StudyRoomsPage />;
      case 'documents': return <DocumentsPage />;
      case 'books': return <BooksPage />;
      case 'games': return <GamesPage />;
      case 'tests':
      case 'test-series': return <TestsPage />;
      case 'portfolio': return <PortfolioPage />;
      case 'focus-clock': return <FocusClockPage />;
      case 'link': return <LinkPage />;
      case 'tools':
      case 'reading-room': return <ToolsPage />;
      case 'admin-dashboard':
      case 'admin-users':
        return userRole === 'admin' ? <FirestoreDashboardPage /> : <AccessDeniedPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-white select-none overflow-x-hidden">
      {/* Background Canvas */}
      <BackgroundCanvas />

      {/* Toast Notification — animated slide-in */}
      {notificationMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] px-4 py-3 bg-[var(--bg-surface-solid)] border border-[var(--color-cyan)]/50 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center space-x-2.5 backdrop-blur-xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex-shrink-0">
            <Bell className="w-3.5 h-3.5 text-[var(--color-cyan)]" />
          </div>
          <span className="flex-1 max-w-[220px] leading-snug">{notificationMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <TopBar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`relative z-10 pt-20 pb-12 px-4 sm:px-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
      >
        <div className="max-w-[1366px] mx-auto">
          {/* key triggers re-mount for smooth page transition */}
          <div key={currentRoute} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderRoute()}
          </div>
        </div>
      </main>

      {/* Modals */}
      <SearchModal />
      <VideoModal />
      <DocModal />
      <BookModal />
      <TestModal />
      <CommentsModal />
      <SavedItemsModal isOpen={isSavedItemsOpen} onClose={() => setIsSavedItemsOpen(false)} />
      {isProfileSettingsOpen && <ProfileSettingsModal />}
      <StreakDrawer />
      <AppleShopDrawer />
      <AdminConsoleModal />

      {/* Bone AI */}
      {isBoneAIEnabled && (
        <>
          <BoneAIFAB isOpen={isBoneAIOpen} onClick={() => setIsBoneAIOpen(!isBoneAIOpen)} />
          <BoneAIPopup isOpen={isBoneAIOpen} onClose={() => setIsBoneAIOpen(false)} />
        </>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MusicProvider>
          <AppContent />
        </MusicProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

