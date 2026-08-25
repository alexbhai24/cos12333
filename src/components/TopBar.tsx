import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Palette,
  Image as ImageIcon,
  Menu,
  X,
  User,
  Shield,
  Bell,
  LogOut,
  Check,
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AvatarDecoration } from './AvatarDecoration';
import { TransparentImage } from './TransparentImage';
import type { Theme, BackgroundType } from '../types';

import { teacherRequestService } from '../services/teacherRequestService';

export const TopBar: React.FC = () => {
  const {
    user,
    theme,
    setTheme,
    background,
    setBackground,
    setIsSearchOpen,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    setCurrentRoute,
    showNotification,
    setIsProfileSettingsOpen,
    setIsStreakDrawerOpen,
    setIsAppleShopOpen,
    setIsSavedItemsOpen,
    setIsAdminConsoleOpen
  } = useApp();
  const { userRole, currentUser, logout } = useAuth();

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    try {
      await logout();
    } catch {
      showNotification('Sign out failed — try again');
    }
  };

  const [themePopoverOpen, setThemePopoverOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemePopoverOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; label: string; desc: string; preview: string }[] = [
    { id: 'cosmic', label: 'Cosmic', desc: 'Deep space blue/purple with cyan accent', preview: 'bg-[#060919] border-[#00F0FF]' },
    { id: 'greenery', label: 'Greenery', desc: 'Forest emerald green with spring accent', preview: 'bg-[#04140E] border-[#34D399]' },
    { id: 'beaches', label: 'Beaches', desc: 'Sunset orange/deep violet with gold accent', preview: 'bg-[#180922] border-[#F59E0B]' },
    { id: 'rose-pink', label: 'Rose Pink', desc: 'Rose & neon magenta pink theme', preview: 'bg-[#1A0713] border-[#FF69B4]' },
    { id: 'dark-black', label: 'Dark Black', desc: 'Pure OLED black with white highlights', preview: 'bg-[#000000] border-[#FFFFFF]' },
    { id: 'purple-white', label: 'Purple White', desc: 'Royal purple with crisp white contrast', preview: 'bg-[#120826] border-[#C084FC]' }
  ];

  const bgSequence: BackgroundType[] = [
    'lighthouse',
    'snowy-tree',
    'canyon-castle',
    'canyon-deck',
    'castle-boats',
    'village-boat'
  ];

  const bgLabels: Record<BackgroundType, string> = {
    'lighthouse': 'Lighthouse',
    'snowy-tree': 'Snowy Tree',
    'canyon-castle': 'Canyon Castle',
    'canyon-deck': 'Canyon Deck',
    'castle-boats': 'Castle & Boats',
    'village-boat': 'Village & Boat',
  };

  const handleBgCycle = () => {
    const idx = bgSequence.indexOf(background);
    const next = bgSequence[(idx + 1) % bgSequence.length];
    setBackground(next);
  };

  const handleThemeCycle = () => {
    const idx = themes.findIndex(t => t.id === theme);
    const nextIdx = (idx + 1) % themes.length;
    setTheme(themes[nextIdx].id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-sidebar)]/90 backdrop-blur-xl border-b border-[var(--border-color)] shadow-[0_4px_30px_rgba(0,0,0,0.4)] z-40 pl-2.5 pr-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Logo & Mobile Toggle */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="lg:hidden text-[var(--text-secondary)] hover:text-white p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>

        {/* Brand Logo & Title */}
        <div
          onClick={() => setCurrentRoute('home')}
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none group text-left"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg border border-white/20 flex-shrink-0">
            <img
              src="/logo.png"
              alt="CosmicBone Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <span className="font-handwritten text-xl sm:text-2xl text-white tracking-wide block leading-none filter drop-shadow">
              Cosmic<span className="text-[var(--color-cyan)]">Bone</span>
            </span>
            <span className="text-[7.5px] sm:text-[9px] font-bold text-[var(--text-muted)] tracking-wider sm:tracking-widest block uppercase mt-0.5">
              NEXT-GEN EDTECH
            </span>
          </div>
        </div>

        {/* Desktop Search Bar & Bookmark */}
        <div className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-sm ml-4 gap-2.5">
          <button
            onClick={() => setIsSavedItemsOpen(true)}
            className="p-2 bg-[var(--bg-surface-secondary)]/80 border border-[var(--border-color)] hover:border-[var(--color-cyan)] rounded-xl text-gray-400 hover:text-[var(--color-cyan)] transition-all shadow-md active:scale-95 flex items-center justify-center flex-shrink-0"
            title="Open Learning Library (Saved Items) 🔖"
          >
            <Bookmark className="w-4 h-4 text-[var(--color-cyan)]" />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-[var(--bg-surface-secondary)]/80 border border-[var(--border-color)] hover:border-[var(--color-cyan)] rounded-xl text-xs text-gray-400 hover:text-white transition-all shadow-md cursor-pointer active:scale-98"
            title="Search courses, videos, notes (Ctrl + K)"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">Search courses, videos, notes…</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-[var(--bg-surface-solid)] text-gray-400 rounded border border-white/5">
              Ctrl K
            </kbd>
          </button>
        </div>
      </div>



      {/* Right side: Streak, Apples, Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">



        {/* Streak Button */}
        {(() => {
          const todayString = new Date().toISOString().split('T')[0];
          const isStreakCompletedToday = user?.streakHistory?.includes(todayString);
          return (
            <button
              onClick={() => setIsStreakDrawerOpen(true)}
              type="button"
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all active:scale-95 group focus:outline-none ${isStreakCompletedToday ? 'bg-[#1b120c]/90 hover:bg-[#28190e] border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)]' : 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-600/30'}`}
              title="Click to view Streak & Rewards"
            >
              <span className={`text-sm sm:text-base leading-none select-none ${isStreakCompletedToday ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse' : 'grayscale opacity-75'}`}>🔥</span>
              <span className={`${isStreakCompletedToday ? 'text-orange-400' : 'text-gray-400'} font-bold font-mono text-xs sm:text-sm`}>{user?.streak || 0}</span>
            </button>
          );
        })()}

        {/* Apples Button */}
        <button
          onClick={() => setIsAppleShopOpen(true)}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#0D213A]/90 hover:bg-[#132d4e] border border-[#37D996]/30 transition-all shadow-[0_0_12px_rgba(55,217,150,0.15)] active:scale-95 group"
          title="Click to view Apple Shop & Donations"
        >
          <span className="text-sm sm:text-base leading-none select-none drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]">
            {(user?.apples || 0) > 100 ? '🍎' : '🍏'}
          </span>
          <span className="text-[#37D996] font-bold font-mono text-xs sm:text-sm">{user?.apples || 0}</span>
        </button>

        {/* User Profile Button */}
        <div className="relative flex-shrink-0" ref={profileRef}>
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setThemePopoverOpen(false);
            }}
            className="flex items-center space-x-1.5 p-0.5 sm:pl-1 sm:pr-2 sm:py-1 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] hover:border-[var(--color-cyan)] rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] flex-shrink-0"
          >
            <AvatarDecoration decoration={user.decoration}>
              {(() => {
                const defaultGradient = 'from-[#58A6FF] to-[#8B5CF6]';
                if (user.photoUrl) {
                  if (user.photoUrl.startsWith('gradient:')) {
                    const id = user.photoUrl.replace('gradient:', '');
                    const gradMap: Record<string, string> = {
                      'astronaut': 'from-[#00F0FF] to-[#8B5CF6]',
                      'cyberpunk': 'from-[#FF007A] to-[#7928CA]',
                      'nebula': 'from-[#FF4D4D] to-[#F9CB28]',
                      'solar': 'from-[#10B981] to-[#059669]',
                    };
                    const grad = gradMap[id] || defaultGradient;
                    return (
                      <div className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-[10px] font-bold text-white shadow-inner`}>
                        {user.initials}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#37D996] border-2 border-[#06101F] rounded-full" />
                      </div>
                    );
                  } else {
                    return (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[rgba(115,178,255,0.25)] shadow-inner">
                        <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#37D996] border-2 border-[#06101F] rounded-full" />
                      </div>
                    );
                  }
                }
                return (
                  <div className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${defaultGradient} flex items-center justify-center text-[10px] font-bold text-white shadow-inner`}>
                    {user.initials}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#37D996] border-2 border-[#06101F] rounded-full" />
                  </div>
                );
              })()}
            </AvatarDecoration>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
              <div className="text-[10px] text-[var(--text-muted)] leading-tight">{user.email}</div>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-surface-solid)]/95 backdrop-blur-2xl border border-[var(--border-color)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{user.email}</div>
                <div className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${user.isAdmin || userRole === 'admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/25'}`}>
                  {user.isAdmin || userRole === 'admin' ? '👑 Owner Admin' : user.role || 'Student'}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsProfileSettingsOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-secondary)] rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Profile settings</span>
              </button>

              {/* Mobile Saved Items */}
              <button
                onClick={() => {
                  setIsSavedItemsOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="md:hidden w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-secondary)] rounded-xl transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[var(--color-cyan)]" />
                <span>Learning Library (Saved)</span>
              </button>

              {/* Theme Cycle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeCycle();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-secondary)] rounded-xl transition-colors"
              >
                <Palette className="w-4 h-4 text-[var(--color-cyan)]" />
                <span>Theme: <span className="capitalize text-[var(--color-cyan)]">{theme.replace('-', ' ')}</span></span>
              </button>

              {/* Background Cycle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBgCycle();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-secondary)] rounded-xl transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>Background: <span className="text-[var(--color-cyan)]">{bgLabels[background]}</span></span>
              </button>

              {(userRole === 'admin' || user.isAdmin) && (
                <button
                  onClick={() => {
                    setIsAdminConsoleOpen(true);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-secondary)] rounded-xl transition-colors font-bold"
                >
                  <Shield className="w-4 h-4 text-[var(--color-cyan)]" />
                  <span>Admin Console</span>
                </button>
              )}
              <button
                onClick={() => {
                  showNotification('Notification preferences saved');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-secondary)] rounded-xl transition-colors"
              >
                <Bell className="w-4 h-4 text-[var(--color-violet)]" />
                <span>Notification preferences</span>
              </button>

              {/* Divider */}
              <div className="border-t border-[rgba(115,178,255,0.12)] my-1" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
