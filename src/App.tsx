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
import { MobileBottomNav, BOTTOM_BAR_ROUTES } from './components/MobileBottomNav';

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
import { CreatorPage } from './pages/CreatorPage';
import { ToolsPage } from './pages/ToolsPage';
import { SyllabusTrackerPage } from './pages/SyllabusTrackerPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { MistakeTrackerPage } from './pages/MistakeTrackerPage';
import { PyqPage } from './pages/PyqPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { TestInstructionsPage } from './pages/TestInstructionsPage';
import { NtaTestPage } from './pages/NtaTestPage';
import { SleepCyclePage } from './pages/SleepCyclePage';
import { StudyTimeTrackerPage } from './pages/StudyTimeTrackerPage';
import { MarksCalculatorPage } from './pages/MarksCalculatorPage';
import { ExamCountdownPage } from './pages/ExamCountdownPage';
import { ScheduleDayPage } from './pages/ScheduleDayPage';
import { BiologyReadingPage } from './pages/BiologyReadingPage';
import { QuestionPracticePage } from './pages/QuestionPracticePage';
import { HabitRadarPage } from './pages/HabitRadarPage';
import { BoneAIPage } from './pages/BoneAIPage';



const SUB_TOOL_ROUTES = [
  'bone-ai',
  'syllabus-tracker',
  'mistake-tracker',
  'flashcards',
  'habit-radar',
  'pyq',
  'mock-tests',
  'test-instructions',
  'nta-test',
  'sleep-cycle',
  'study-time-tracker',
  'marks-calculator',
  'exam-countdown',
  'schedule-day',
  'reading-practice',
  'link',
  'question-practice'
];

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
  const { currentUser, authLoading, pendingVerificationEmail, userRole, userProfile } = useAuth();

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



  // 2. Waiting for email verification
  if (pendingVerificationEmail) {
    return <VerificationPage />;
  }

  // 3. Not signed in → auth screen
  if (!currentUser && !authLoading) {
    return <AuthPage />;
  }

  // 4. Signed in but profile setup not completed
  if (currentUser && !user.setupComplete && userProfile && userProfile.setupComplete === false) {
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
      case 'tools': return <ToolsPage />;
      case 'mistake-tracker': return <MistakeTrackerPage />;
      case 'flashcards': return <FlashcardsPage />;
      case 'syllabus-tracker': return <SyllabusTrackerPage />;
      case 'pyq': return <PyqPage />;
      case 'mock-tests': return <MockTestsPage />;
      case 'test-instructions': return <TestInstructionsPage />;
      case 'nta-test': return <NtaTestPage />;
      case 'sleep-cycle': return <SleepCyclePage />;
      case 'study-time-tracker': return <StudyTimeTrackerPage />;
      case 'marks-calculator': return <MarksCalculatorPage />;
      case 'exam-countdown': return <ExamCountdownPage />;
      case 'schedule-day': return <ScheduleDayPage />;
      case 'reading-room': return <BooksPage />;
      case 'reading-practice':
      case 'reading':
        return <BiologyReadingPage />;
      case 'question-practice':
        return <QuestionPracticePage />;
      case 'habit-radar':
        return <HabitRadarPage />;
      case 'bone-ai':
        return <BoneAIPage />;
      case 'creator-studio': return userRole === 'admin' ? <CreatorPage /> : <AccessDeniedPage />;
      case 'admin-dashboard':
      case 'admin-users':
        return userRole === 'admin' ? <FirestoreDashboardPage /> : <AccessDeniedPage />;
      default: return <HomePage />;
    }
  };

  const isFullScreenExamRoute = currentRoute === 'nta-test' || currentRoute === 'test-instructions';

  // Fullscreen distraction-free examination modes (NTA Test & Test Instructions)
  if (isFullScreenExamRoute) {
    return (
      <div
        className={`fixed inset-0 z-50 font-sans text-white select-none ${
          currentRoute === 'nta-test'
            ? 'h-screen overflow-hidden bg-[#0f111a]'
            : 'min-h-screen overflow-y-auto bg-[#1c1f2e]'
        }`}
      >
        {notificationMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] px-4 py-3 bg-[var(--bg-surface-solid)] border border-[var(--color-cyan)]/50 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center space-x-2.5 backdrop-blur-xl animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex-shrink-0">
              <Bell className="w-3.5 h-3.5 text-[var(--color-cyan)]" />
            </div>
            <span className="flex-1 max-w-[220px] leading-snug">{notificationMessage}</span>
          </div>
        )}

        <div key={currentRoute} className="w-full min-h-full animate-in fade-in duration-150 ease-out">
          {renderRoute()}
        </div>
      </div>
    );
  }

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
      <div className={currentRoute === 'bone-ai' ? 'hidden lg:block' : ''}>
        <TopBar />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`relative z-10 transition-[padding] duration-200 ease-out ${
          currentRoute === 'bone-ai'
            ? 'pt-0 lg:pt-20 pb-0 lg:pb-12 px-0 lg:px-8'
            : 'pt-20 pb-28 lg:pb-12 px-4 sm:px-8'
        } ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className={currentRoute === 'bone-ai' ? 'w-full h-full' : 'max-w-[1366px] mx-auto'}>
          {/* key triggers smooth hardware-accelerated fade transition */}
          <div key={currentRoute} className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out">
            {renderRoute()}
          </div>
        </div>
      </main>

      {/* Mobile floating bottom navigation (Only on selected routes: home, videos, tools) */}
      {BOTTOM_BAR_ROUTES.includes(currentRoute) && <MobileBottomNav />}

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

      {/* Bone AI Floating Assistant (Hidden inside specific tools and whenever ANY popup/modal is open) */}
      {isBoneAIEnabled && !SUB_TOOL_ROUTES.includes(currentRoute) && !(
        activeVideoModal || activeDocModal || activeBookModal || activeTestModal ||
        isProfileSettingsOpen || isAdminConsoleOpen || isSavedItemsOpen ||
        isStreakDrawerOpen || isAppleShopOpen
      ) && (
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
