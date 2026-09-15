import React from 'react';
import {
  Home,
  Video,
  MessageSquare,
  FileText,
  BookOpen,
  Gamepad2,
  Award,
  ChevronLeft,
  ChevronRight,
  Database,
  MessagesSquare,
  Briefcase,
  Cpu,
  Timer,
  Wrench,
  Layers,
  Bookmark,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { PageRoute } from '../types';
import { teacherRequestService } from '../services/teacherRequestService';

interface NavItem {
  id: PageRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  teacherOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    user,
    setIsSavedItemsOpen,
  } = useApp();
  const { userRole, currentUser } = useAuth();

  const isOwnerAdmin = currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com' || userRole === 'admin' || user?.role === 'admin';
  const userReq = teacherRequestService.getUserRequest(user?.name || currentUser?.displayName || '', user?.email || currentUser?.email || '');
  const isApprovedTeacher = userReq?.status === 'approved' || userRole === 'teacher' || user?.role === 'Teacher' || user?.role === 'teacher';
  const isTeacherOrAdmin = isOwnerAdmin || isApprovedTeacher;

  const learnItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'test-series', label: 'Test Series', icon: Award },
    { id: 'documents', label: 'Documents / Notes', icon: FileText },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'posts', label: 'Posts', icon: MessageSquare },
    { id: 'study-rooms', label: 'Active Study Rooms', icon: MessagesSquare },
    { id: 'games', label: 'Bone Games', icon: Gamepad2 },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'focus-clock', label: 'Focus Clock', icon: Timer },
    { id: 'tools', label: 'Tools', icon: Wrench },
  ];

  const adminItems: NavItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Admin Console',
      icon: Database,
      adminOnly: true,
    },
    {
      id: 'creator-studio',
      label: 'Creator Studio',
      icon: Cpu,
      adminOnly: true,
    },
  ];


  const handleNavClick = (route: PageRoute) => {
    setCurrentRoute(route);
    setMobileDrawerOpen(false);
  };

  const renderNavGroup = (title: string, items: NavItem[]) => {
    const visibleItems = items.filter((item) => {
      const isOwnerAdmin = currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';
      if (item.adminOnly) return isOwnerAdmin || userRole === 'admin';
      if (item.teacherOnly) return isOwnerAdmin || isTeacherOrAdmin;
      return true;
    });
    if (visibleItems.length === 0) return null;

    return (
      <div className="mb-6">
        {(!sidebarCollapsed && !mobileDrawerOpen) && (
          <div className="px-4 mb-2 text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">
            {title}
          </div>
        )}
        <div className="space-y-1.5 flex flex-col items-center">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            if (sidebarCollapsed || mobileDrawerOpen) {
              return (
                <a
                  key={item.id}
                  href={item.id === 'home' ? '/' : `/${item.id}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
                  title={item.label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden hover-shine-effect ${isActive
                      ? 'bg-[var(--bg-surface-secondary)] border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] shadow-[0_0_18px_var(--glow-primary)] scale-105'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-surface-solid)] border border-transparent'
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--color-cyan)] drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]' : ''}`} />
                </a>
              );
            }

            return (
              <a
                key={item.id}
                href={item.id === 'home' ? '/' : `/${item.id}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group text-left relative overflow-hidden hover-shine-effect ${isActive
                    ? 'bg-[var(--bg-surface-secondary)]/95 border border-[var(--color-cyan)]/85 text-white shadow-[0_0_20px_var(--glow-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-solid)]/70 border border-transparent'
                  }`}
              >
                {/* Left Active Glow bar */}
                {isActive && (
                  <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-[var(--color-cyan)] rounded-r shadow-[0_0_8px_var(--color-cyan)]" />
                )}
                <div className="flex items-center space-x-3 pl-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive
                      ? 'bg-[var(--color-cyan)]/25 border border-[var(--color-cyan)]/65 text-[var(--color-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.35)]'
                      : 'bg-[var(--bg-surface-secondary)]/40 text-[var(--text-muted)] group-hover:bg-[var(--bg-surface-secondary)] group-hover:text-white border border-white/5'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm tracking-wide truncate">{item.label}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-transparent z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] z-40 transition-all duration-300 flex flex-col ${
          mobileDrawerOpen
            ? 'translate-x-0 w-16 top-16'
            : '-translate-x-full lg:translate-x-0 top-16 lg:top-0 ' + (sidebarCollapsed ? 'w-16' : 'w-60')
        }`}
      >
        {/* Brand Logo & Title (Desktop View inside Sidebar) */}
        <div
          className={`hidden lg:flex items-center justify-between px-3.5 h-16 select-none group text-left shrink-0 ${
            sidebarCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <div
            onClick={() => setCurrentRoute('home')}
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg border border-white/20 flex-shrink-0">
              <img
                src="/logo.png"
                alt="CosmicBone Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-handwritten text-xl text-white tracking-wide block leading-none filter drop-shadow">
                  Cosmic<span className="text-[var(--color-cyan)]">Bone</span>
                </span>
                <span className="text-[8px] font-bold text-[var(--text-muted)] tracking-wider block uppercase mt-0.5">
                  NEXT-GEN EDTECH
                </span>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={() => setIsSavedItemsOpen(true)}
              className="p-2 bg-[var(--bg-surface-secondary)]/80 border border-[var(--border-color)] hover:border-[var(--color-cyan)] rounded-xl text-gray-400 hover:text-[var(--color-cyan)] transition-all shadow-md active:scale-95 flex items-center justify-center flex-shrink-0 ml-1"
              title="Open Learning Library (Saved Items) 🔖"
            >
              <Bookmark className="w-4 h-4 text-[var(--color-cyan)]" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none px-2 sm:px-3 py-4">
          {renderNavGroup('LEARN & COMMUNITY', learnItems)}
          {renderNavGroup('ADMIN', adminItems)}
        </div>

        <div className="hidden lg:flex items-center justify-end p-3 border-t border-white/5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-full bg-[var(--bg-surface-solid)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-surface-secondary)] border border-white/5 transition-colors focus:outline-none"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
