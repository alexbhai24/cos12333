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

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-sidebar)]/90 backdrop-blur-xl border-b border-[var(--border-color)] shadow-[0_4px_30px_rgba(0,0,0,0.4)] z-40 px-4 flex items-center justify-between">
      {/* Left side: Logo & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="lg:hidden text-[var(--text-secondary)] hover:text-white p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo & Title */}
        <div
          onClick={() => setCurrentRoute('home')}
          className="flex items-center space-x-3 cursor-pointer select-none group text-left"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20">
            <img
              src="/logo.png"
              alt="CosmicBone Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <span className="font-handwritten text-2xl text-white tracking-wide block leading-none filter drop-shadow">
              Cosmic<span className="text-[var(--color-cyan)]">Bone</span>
            </span>
            <span className="text-[9px] font-bold text-[var(--text-muted)] tracking-widest block uppercase mt-0.5">
              NEXT-GEN EDTECH
            </span>
          </div>
        </div>

      </div>

      {/* Center-left: Search Bar Trigger Button */}
      <div className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4 gap-2.5">
        <button
          onClick={() => setIsSavedItemsOpen(true)}
          className="p-2 bg-[var(--bg-surface-secondary)]/80 border border-[var(--border-color)] hover:border-[var(--color-cyan)] rounded-xl text-gray-400 hover:text-[var(--color-cyan)] transition-all shadow-md active:scale-95 flex items-center justify-center flex-shrink-0"
          title="Open Learning Library (Saved Items) 🔖"
        >
          <Bookmark className="w-4 h-4" />
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

      {/* Center: Separate Reward Buttons */}
      <div className="hidden sm:flex items-center space-x-2.5">
        {/* Streak Button */}
        <button
          onClick={() => setIsStreakDrawerOpen(true)}
          type="button"
          className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--bg-surface-solid)]/85 border border-[rgba(255,101,101,0.25)] rounded-2xl text-xs font-semibold text-white select-none transition-colors duration-150 active:bg-[var(--bg-surface-secondary)] focus:outline-none animate-pulse-slow"
          title="Click to view Streak & Rewards"
        >
          <div className="w-5.5 h-5.5 flex items-center justify-center overflow-hidden">
            <TransparentImage
              src="/user_flame.jpg"
              alt="Streak"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="text-[#FF7BAC] font-bold font-mono text-sm">{user.streak}</span>
          <span className="text-[#A5C0E6] text-[9px] tracking-wider font-heading uppercase">STREAK</span>
        </button>

        {/* Apples Button */}
        <button
          onClick={() => setIsAppleShopOpen(true)}
          type="button"
          className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--bg-surface-solid)]/85 border border-[rgba(55,217,150,0.25)] rounded-2xl text-xs font-semibold text-white select-none transition-colors duration-150 active:bg-[var(--bg-surface-secondary)] focus:outline-none"
          title="Click to view Apple Shop & Donations"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 drop-shadow-[0_0_2px_rgba(144,238,144,0.4)]">
            <defs>
              <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ADF044" />
                <stop offset="50%" stopColor="#7CD917" />
                <stop offset="100%" stopColor="#4A8C0B" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#87E024" />
                <stop offset="100%" stopColor="#3C730A" />
              </linearGradient>
            </defs>
            <path d="M12 21.5c-2.3 0-5.8-1.5-5.8-6.2c0-3.3 2.1-5.3 4.8-5.3c.6 0 1 .1 1 .1s.4-.1 1-.1c2.7 0 4.8 2 4.8 5.3c0 4.7-3.5 6.2-5.8 6.2z" fill="url(#appleGrad)" />
            <path d="M12 10c0-1.8-.8-3.2-1.3-3.7" stroke="#7A5228" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12.5 6.3c1.8-.9 4.1-.4 4.5.9c.4 1.3-1.3 2.3-3.1 2.3c-.4 0-1.4-1.3-1.4-3.2z" fill="url(#leafGrad)" />
          </svg>
          <span className="text-[#37D996] font-bold font-mono text-sm">{user.apples}</span>
          <span className="text-[#A5C0E6] text-[9px] tracking-wider font-heading uppercase">APPLES</span>
        </button>
      </div>

      {/* Right side: Theme Logo Button, Background, Profile */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-full text-[var(--text-secondary)] hover:bg-[#0D213A] focus:outline-none"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme Changer Popover */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemePopoverOpen(!themePopoverOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface-solid)] border border-[var(--border-color)] hover:border-[var(--color-cyan)] text-[var(--text-secondary)] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] active:scale-95"
            title={`Theme: ${theme} — click to change`}
            aria-label="Change theme"
          >
            <Palette className="w-4 h-4 text-[var(--color-cyan)]" />
            <span className="hidden lg:inline text-[10px] font-semibold capitalize text-[var(--color-cyan)] max-w-[60px] truncate">
              {theme.replace('-', ' ')}
            </span>
          </button>

          {themePopoverOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[var(--bg-surface-solid)]/95 backdrop-blur-2xl border border-[var(--border-color)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto scrollbar-none">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
                Select Theme ({themes.length} Presets)
              </div>
              <div className="space-y-1.5">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemePopoverOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${theme === t.id
                        ? 'border-[var(--color-cyan)] bg-[var(--bg-surface-secondary)] text-white font-medium shadow-sm'
                        : 'border-transparent hover:bg-[var(--bg-surface-secondary)]/60 text-[var(--text-secondary)]'
                      }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-3.5 h-3.5 rounded-full border ${t.preview}`} />
                      <div>
                        <div className="font-semibold capitalize">{t.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{t.desc}</div>
                      </div>
                    </div>
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-[var(--color-cyan)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background Cycle Button */}
        <button
          onClick={handleBgCycle}
          className="flex items-center space-x-1.5 p-2 rounded-full bg-[var(--bg-surface-solid)] border border-[var(--border-color)] hover:border-[var(--color-cyan)] text-[var(--text-secondary)] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] active:scale-95"
          title={`Current: ${bgLabels[background]} — click to change`}
          aria-label="Cycle background"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden lg:inline text-[10px] font-semibold text-[var(--color-cyan)] max-w-[80px] truncate">
            {bgLabels[background]}
          </span>
        </button>

        {/* User Profile Button */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setThemePopoverOpen(false);
            }}
            className="flex items-center space-x-2 pl-1 pr-2 py-1 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] hover:border-[var(--color-cyan)] rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
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
