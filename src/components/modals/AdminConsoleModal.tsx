import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Users,
  Bot,
  BarChart2,
  Sliders,
  FileText,
  CheckCircle2,
  UserCheck,
  UserX,
  Search,
  Sparkles,
  Zap,
  Activity,
  Trash2,
  Play,
  File,
  Book,
  CheckSquare,
  AlertTriangle,
  ExternalLink,
  Briefcase,
  Globe,
  Eye,
  Music,
  BookMarked,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { contentService } from '../../services/contentService';
import { postService } from '../../services/postService';
import { videoService, VideoDoc } from '../../services/videoService';
import { adminService } from '../../services/adminService';
import { portfolioService } from '../../services/portfolioService';
import ambientSoundService, { AmbientSoundUrls } from '../../services/ambientSoundService';
import linkService, { LinkConfig, DEFAULT_LINK_CONFIG } from '../../services/linkService';
import type { Post, ContentItem } from '../../types';
import type { PortfolioProfile } from '../../types/portfolio';

export const AdminConsoleModal: React.FC = () => {
  const {
    isAdminConsoleOpen,
    setIsAdminConsoleOpen,
    isBoneAIEnabled,
    setIsBoneAIEnabled,
    posts,
    contentItems,
    user,
    showNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'content' | 'portfolios' | 'ambient' | 'link'>('overview');
  const [ambientUrlsState, setAmbientUrlsState] = useState<AmbientSoundUrls>(() => ambientSoundService.getUrls());
  const [linkConfigState, setLinkConfigState] = useState<LinkConfig>(() => linkService.getConfig());
  const [contentSubTab, setContentSubTab] = useState<'posts' | 'academic'>('posts');
  const [academicFilter, setAcademicFilter] = useState<'all' | 'video' | 'document' | 'book' | 'test'>('all');
  
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(() => localStorage.getItem('cosmicbone_maintenance_mode') === 'true');
  const [systemAlerts, setSystemAlerts] = useState(() => localStorage.getItem('cosmicbone_system_alerts') !== 'false');
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioProfile[]>([]);
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState('');
  const [appleInputs, setAppleInputs] = useState<Record<string, string>>({});

  // Load videos
  useEffect(() => {
    if (isAdminConsoleOpen) {
      const unsub = videoService.subscribeAllVideos((updatedVideos) => {
        setVideos(updatedVideos);
      });
      // Load all portfolios (including drafts) for admin view
      const allPortfolios = (portfolioService as any).portfolios as PortfolioProfile[] || portfolioService.getAllPortfolios();
      setPortfolios(allPortfolios.length ? allPortfolios : portfolioService.getAllPortfolios());
      return () => unsub();
    }
  }, [isAdminConsoleOpen]);

  // Load users
  useEffect(() => {
    if (isAdminConsoleOpen) {
      const fetchUsers = async () => {
        try {
          const remoteUsers = await adminService.getAllUsers();
          if (remoteUsers && remoteUsers.length > 0) {
            setUsersList(remoteUsers);
            return;
          }
        } catch (e) {
          console.warn('[AdminConsoleModal] Failed to fetch remote users, using localStorage fallback.');
        }

        // Fallback
        const usersStr = localStorage.getItem('cosmicbone_users');
        if (usersStr) {
          try {
            setUsersList(JSON.parse(usersStr));
          } catch (e) {}
        }
      };
      fetchUsers();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdminConsoleOpen]);

  if (!isAdminConsoleOpen) return null;

  const handleRoleChange = async (email: string, currentRole: string) => {
    const newRole = currentRole.toLowerCase() === 'admin' ? 'student' : 'admin';
    try {
      await adminService.requestRoleUpdate(email, newRole);
      showNotification(`Role updated for ${email} to ${newRole}`);
    } catch (e) {
      console.warn('[AdminConsoleModal] Direct Firestore/API role update failed, updating local state.');
    }

    // Update local state instantly
    setUsersList(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, role: newRole.charAt(0).toUpperCase() + newRole.slice(1) } : u);
      localStorage.setItem('cosmicbone_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddApples = async (email: string) => {
    const amountStr = appleInputs[email];
    if (!amountStr || isNaN(Number(amountStr))) return;
    const amount = Number(amountStr);
    try {
      await adminService.addApplesToUser(email, amount);
      showNotification(`Successfully added ${amount} apples to ${email}`);
    } catch (e: any) {
      console.warn('[AdminConsoleModal] API addApplesToUser failed, updating local state fallback.');
      showNotification(`Added ${amount} apples to ${email} (Local)`);
    }

    setAppleInputs(prev => ({ ...prev, [email]: '' }));
    
    // Update local state to reflect new apples
    setUsersList(prev => {
      const updated = prev.map(u => {
        if (u.email === email) {
          return { ...u, apples: (u.apples || 0) + amount };
        }
        return u;
      });
      localStorage.setItem('cosmicbone_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete post "${title}"?`)) {
      await postService.deletePost(postId);
      showNotification(`Post deleted: ${title}`);
    }
  };

  const handleDeleteVideo = async (videoId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete video "${title}"?`)) {
      await videoService.deleteVideo(videoId);
      showNotification(`Video deleted: ${title}`);
    }
  };

  const handleDeleteContent = async (itemId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete item "${title}"?`)) {
      await contentService.deleteContentItem(itemId);
      showNotification(`Academic content deleted: ${title}`);
    }
  };

  const handleDeletePortfolio = (portfolioId: string, ownerName: string) => {
    if (window.confirm(`Delete portfolio by "${ownerName}"? This cannot be undone.`)) {
      const success = portfolioService.deletePortfolio(portfolioId);
      if (success) {
        setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        showNotification(`Portfolio deleted: ${ownerName}`);
      } else {
        showNotification('Failed to delete portfolio.');
      }
    }
  };

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    localStorage.setItem('cosmicbone_maintenance_mode', String(next));
    showNotification(`Maintenance status: ${next ? 'ON' : 'OFF'}`);
  };

  const handleToggleAlerts = () => {
    const next = !systemAlerts;
    setSystemAlerts(next);
    localStorage.setItem('cosmicbone_system_alerts', String(next));
    showNotification(`System notifications: ${next ? 'ENABLED' : 'DISABLED'}`);
  };

  // Filtered lists
  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAcademicContent = [
    ...videos.map(v => ({ id: v.id, title: v.title, contentType: 'video', subject: v.subject, targetGrades: v.targetGrades, embedUrl: v.embedUrl })),
    ...contentItems.map(c => ({ id: c.id, title: c.title, contentType: c.contentType, subject: c.subject, targetGrades: c.targetGrades, embedUrl: '' }))
  ].filter(item => {
    if (academicFilter === 'all') return true;
    return item.contentType === academicFilter;
  }).filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAdminConsoleOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-[0_25px_70px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-surface-solid)]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/35 rounded-xl text-[var(--color-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white font-heading tracking-wide flex items-center gap-2">
                Admin Command Center
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-cyan)]/20 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30 uppercase tracking-widest font-mono">
                  PRO
                </span>
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">Platform Governance & Global System Controls</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminConsoleOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-[var(--border-color)] bg-[var(--bg-surface-solid)]/60 overflow-x-auto scrollbar-none">
          {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'users', label: 'User Accounts', icon: Users },
            { id: 'settings', label: 'Platform Controls', icon: Sliders },
            { id: 'content', label: 'Content Moderation', icon: FileText },
            { id: 'portfolios', label: 'Portfolios', icon: Briefcase },
            { id: 'ambient', label: 'Ambient Sounds', icon: Music },
            { id: 'link', label: 'Link', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[var(--color-cyan)] text-[var(--color-cyan)] bg-[var(--color-cyan)]/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-premium">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl relative overflow-hidden">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Total Users</div>
                  <div className="text-2xl font-black text-white font-heading">{usersList.length || 1}</div>
                  <div className="text-[10px] text-[var(--color-cyan)] mt-1 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Registered Accounts
                  </div>
                  <Users className="absolute right-3 bottom-3 w-8 h-8 text-[var(--color-cyan)]/10" />
                </div>

                <div className="p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl relative overflow-hidden">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Bone AI Status</div>
                  <div className={`text-2xl font-black font-heading ${isBoneAIEnabled ? 'text-purple-400' : 'text-gray-500'}`}>
                    {isBoneAIEnabled ? 'Active' : 'Disabled'}
                  </div>
                  <div className="text-[10px] text-purple-300 mt-1 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> Floating Assistant
                  </div>
                  <Bot className="absolute right-3 bottom-3 w-8 h-8 text-purple-500/10" />
                </div>

                <div className="p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl relative overflow-hidden">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Academic Posts</div>
                  <div className="text-2xl font-black text-white font-heading">{posts.length}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Community Feeds
                  </div>
                  <FileText className="absolute right-3 bottom-3 w-8 h-8 text-emerald-500/10" />
                </div>
              </div>

              {/* System Health */}
              <div className="p-5 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">System Operational Status</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                    Healthy 100%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  All CosmicBone services including Auth Sync, Firestore Realtime Database, and Local Cache are running at peak performance with zero active outages.
                </p>
              </div>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-cyan)]/50"
                />
              </div>

              <div className="space-y-2.5">
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 space-y-2">
                    <UserX className="w-8 h-8 text-gray-600" />
                    <span className="text-xs font-semibold">No user accounts found</span>
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role?.toLowerCase() === 'admin';

                    return (
                      <div
                        key={u.email}
                        className="flex items-center justify-between p-3.5 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl hover:border-[var(--color-cyan)]/20 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                              isAdmin
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20'
                            }`}
                          >
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              {u.name}
                              <span
                                className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isAdmin
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/25'
                                }`}
                              >
                                {isAdmin ? 'Owner Admin 👑' : 'Student 🎒'}
                              </span>
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)]">{u.email}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                          {/* Apples Management */}
                          <div className="flex items-center space-x-2 bg-black/40 p-1 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold text-emerald-400 pl-2 pr-1">
                              🍎 {u.apples || 0}
                            </span>
                            <input
                              type="number"
                              placeholder="+Amt"
                              value={appleInputs[u.email] || ''}
                              onChange={(e) => setAppleInputs({ ...appleInputs, [u.email]: e.target.value })}
                              className="w-14 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white px-1.5 py-1 outline-none text-center focus:border-emerald-500/50"
                            />
                            <button
                              onClick={() => handleAddApples(u.email)}
                              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border border-emerald-500/30"
                            >
                              Add
                            </button>
                          </div>

                          {!isAdmin ? (
                            <button
                              onClick={() => handleRoleChange(u.email, u.role)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all active:scale-95"
                            >
                              Make Admin
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              {u.email !== user?.email && (
                                <button
                                  onClick={() => handleRoleChange(u.email, u.role)}
                                  className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all active:scale-95"
                                >
                                  Make Student
                                </button>
                              )}
                              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest px-2">
                                Owner
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* PLATFORM CONTROLS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Bone AI Control */}
              <div className="flex items-center justify-between p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Bone AI Assistant Widget</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Enable or disable the floating Bone AI assistant across the platform
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsBoneAIEnabled(!isBoneAIEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isBoneAIEnabled ? 'bg-purple-600' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isBoneAIEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Maintenance Status Mode</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Simulate platform maintenance banner for testing
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleMaintenance}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    maintenanceMode ? 'bg-amber-600' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* System Broadcast Alerts */}
              <div className="flex items-center justify-between p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 rounded-xl text-[var(--color-cyan)]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">System Broadcast Notifications</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Enable real-time toast alerts for platform updates
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleAlerts}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    systemAlerts ? 'bg-[var(--color-cyan)]' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      systemAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* CONTENT MODERATION TAB */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* Content Sub-Navigation */}
              <div className="flex items-center space-x-2.5 p-1 bg-[var(--bg-surface-solid)] rounded-2xl border border-[var(--border-color)]">
                <button
                  onClick={() => setContentSubTab('posts')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                    contentSubTab === 'posts'
                      ? 'bg-[var(--color-cyan)] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Community Feed Posts ({posts.length})
                </button>
                <button
                  onClick={() => setContentSubTab('academic')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                    contentSubTab === 'academic'
                      ? 'bg-[var(--color-cyan)] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Academic Learning Content ({filteredAcademicContent.length})
                </button>
              </div>

              {/* Search Moderation Field */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={contentSubTab === 'posts' ? "Search posts..." : "Search academic content..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-cyan)]/50"
                />
              </div>

              {/* Sub-tab 1: Community Posts */}
              {contentSubTab === 'posts' && (
                <div className="space-y-3">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-10 text-xs text-gray-500 bg-[var(--bg-surface-solid)]/40 border border-[var(--border-color)] rounded-2xl">
                      No community posts active in database.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 scrollbar-premium">
                      {filteredPosts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-4 hover:border-[var(--color-cyan)]/20 transition-all"
                        >
                          <div className="truncate flex-1">
                            <div className="text-xs font-bold text-white truncate">{p.title || 'Untitled Post'}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">
                              By {p.authorName} • {p.category} • {p.likes} Likes
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeletePost(p.id, p.title)}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all active:scale-95"
                            title="Delete Post permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Academic Content */}
              {contentSubTab === 'academic' && (
                <div className="space-y-4">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Types' },
                      { id: 'video', label: 'Videos 🎥' },
                      { id: 'document', label: 'Documents 📑' },
                      { id: 'book', label: 'Books 📖' },
                      { id: 'test', label: 'Tests 📝' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setAcademicFilter(pill.id as any)}
                        className={`text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${
                          academicFilter === pill.id
                            ? 'bg-[var(--color-cyan)]/25 text-[var(--color-cyan)] border border-[var(--color-cyan)]/40'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {filteredAcademicContent.length === 0 ? (
                    <div className="text-center py-10 text-xs text-gray-500 bg-[var(--bg-surface-solid)]/40 border border-[var(--border-color)] rounded-2xl">
                      No learning items found for selected filter.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1 scrollbar-premium">
                      {filteredAcademicContent.map((item) => {
                        const isVideo = item.contentType === 'video';
                        const isDoc = item.contentType === 'document';
                        const isBook = item.contentType === 'book';

                        return (
                          <div
                            key={item.id}
                            className="p-3 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-4 hover:border-[var(--color-cyan)]/20 transition-all"
                          >
                            <div className="flex items-center space-x-3 truncate flex-1">
                              <div className={`p-2 rounded-lg ${
                                isVideo
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : isDoc
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : isBook
                                  ? 'bg-cyan-500/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {isVideo ? <Play className="w-3.5 h-3.5 fill-purple-400/20" /> : isDoc ? <File className="w-3.5 h-3.5" /> : isBook ? <Book className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                              </div>

                              <div className="truncate">
                                <div className="text-xs font-bold text-white truncate">{item.title}</div>
                                <div className="text-[10px] text-[var(--text-muted)]">
                                  Type: <span className="capitalize">{item.contentType}</span> • Subject: {item.subject} • Grades: {item.targetGrades.join(', ')}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5 flex-shrink-0">
                              {isVideo && item.embedUrl && (
                                <a
                                  href={item.embedUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-white/5 border border-white/10 hover:border-[var(--color-cyan)] rounded-xl text-gray-400 hover:text-white transition-all active:scale-95"
                                  title="Open YouTube video preview"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  if (isVideo) {
                                    handleDeleteVideo(item.id, item.title);
                                  } else {
                                    handleDeleteContent(item.id, item.title);
                                  }
                                }}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all active:scale-95"
                                title="Delete Item permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* PORTFOLIOS TAB */}
          {activeTab === 'portfolios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-white">Portfolio Manager</div>
                  <div className="text-[11px] text-[var(--text-muted)]">View and permanently delete any user portfolio</div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/25 rounded-full">
                  {portfolios.length} Total
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by owner name, headline..."
                  value={portfolioSearchQuery}
                  onChange={(e) => setPortfolioSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-cyan)]/50"
                />
              </div>

              {/* Portfolio List */}
              {portfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 space-y-2">
                  <Briefcase className="w-8 h-8 text-gray-600" />
                  <span className="text-xs font-semibold">No portfolios found</span>
                  <span className="text-[10px] text-gray-600">Users who publish portfolios will appear here</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 scrollbar-premium">
                  {portfolios
                    .filter(p =>
                      p.fullName.toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                      (p.headline || '').toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                      (p.category || '').toLowerCase().includes(portfolioSearchQuery.toLowerCase())
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-4 hover:border-[var(--color-cyan)]/20 transition-all"
                      >
                        <div className="flex items-center space-x-3 truncate flex-1">
                          {/* Avatar / initials */}
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-cyan)]/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden">
                            {p.avatarUrl && !p.avatarUrl.startsWith('gradient:') ? (
                              <img src={p.avatarUrl} alt={p.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{p.fullName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                              {p.fullName}
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                {p.status || 'draft'}
                              </span>
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] truncate">
                              {p.category} • {p.projects?.length || 0} projects • {p.headline || 'No headline'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePortfolio(p.id, p.fullName)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all active:scale-95 flex-shrink-0"
                          title="Delete portfolio permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* AMBIENT SOUNDS TAB */}
          {activeTab === 'ambient' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-[var(--color-cyan)]" />
                    Ambient Soundscapes Management
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Configure real-time YouTube music links for Focus Clock ambient sounds (Forest, Space, Ocean, Desert).
                  </p>
                </div>
                <button
                  onClick={() => {
                    ambientSoundService.updateUrls(ambientUrlsState);
                    showNotification('Ambient sound YouTube URLs updated in real-time!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] text-[#030816] font-extrabold text-xs rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  Save Ambient Sound Links
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'forest', name: 'Forest Soundscape', emoji: '🌲', defaultUrl: 'https://youtu.be/xNN7iTA57jM?si=rygUkZ66KNeg9q9o' },
                  { key: 'space', name: 'Space Soundscape', emoji: '🚀', defaultUrl: 'https://youtu.be/yLOM8R6lbzg?si=vJtNJD6_-tazOnCK' },
                  { key: 'ocean', name: 'Ocean Soundscape', emoji: '🌊', defaultUrl: 'https://youtu.be/JekUNGo-RVk?si=ObU6awP2T0gzvuZH' },
                  { key: 'desert', name: 'Desert Soundscape', emoji: '🏜️', defaultUrl: 'https://youtu.be/JekUNGo-RVk?si=ObU6awP2T0gzvuZH' },
                ].map(({ key, name, emoji, defaultUrl }) => (
                  <div key={key} className="p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{emoji}</span>
                        <span>{name}</span>
                      </label>
                      <button
                        onClick={() => {
                          const updated = { ...ambientUrlsState, [key]: defaultUrl };
                          setAmbientUrlsState(updated);
                        }}
                        className="text-[10px] text-[var(--color-cyan)] hover:underline font-mono"
                      >
                        Reset Default
                      </button>
                    </div>
                    <input
                      type="text"
                      value={ambientUrlsState[key as keyof AmbientSoundUrls] || ''}
                      onChange={(e) => {
                        setAmbientUrlsState({
                          ...ambientUrlsState,
                          [key]: e.target.value
                        });
                      }}
                      placeholder="YouTube Music / Video URL..."
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)]/60 font-mono transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LINK EMBED MANAGEMENT TAB */}
          {activeTab === 'link' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--color-cyan)]" />
                    Link Manager
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Set any external web link or learning tool to embed live inside the platform.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLinkConfigState(DEFAULT_LINK_CONFIG);
                      linkService.updateConfig(DEFAULT_LINK_CONFIG);
                      showNotification('Reset Link to default (wpmcheck.com) 🌐');
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-white/10"
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={() => {
                      linkService.updateConfig(linkConfigState);
                      showNotification('🚀 Link updated live across the app!');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] text-[#030816] font-extrabold text-xs rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    Save & Apply Live Link
                  </button>
                </div>
              </div>

              {/* Main Website URL Config */}
              <div className="p-5 bg-[var(--bg-surface-solid)]/70 border border-[var(--border-color)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--color-cyan)]" />
                    Primary Embed URL
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Site / Link Name</span>
                    <input
                      type="text"
                      value={linkConfigState.siteName}
                      onChange={(e) => setLinkConfigState({ ...linkConfigState, siteName: e.target.value })}
                      placeholder="e.g. ReadCheck Speed Test"
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)] font-semibold transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Embed URL (https://...)</span>
                    <input
                      type="url"
                      value={linkConfigState.mainUrl}
                      onChange={(e) => setLinkConfigState({ ...linkConfigState, mainUrl: e.target.value })}
                      placeholder="https://wpmcheck.com/"
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)] font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Presets:</span>
                  {[
                    { label: 'ReadCheck (wpmcheck.com)', url: 'https://wpmcheck.com/' },
                    { label: 'Speed Benchmarks', url: 'https://wpmcheck.com/reading-speed-benchmarks' },
                    { label: 'Readability Checker', url: 'https://wpmcheck.com/readability-checker' },
                    { label: 'Wikipedia Encyclopedia', url: 'https://en.wikipedia.org/' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      onClick={() => setLinkConfigState({ ...linkConfigState, mainUrl: preset.url, siteName: preset.label })}
                      className="text-[10px] px-2.5 py-1 bg-white/5 hover:bg-[var(--color-cyan)]/20 hover:text-[var(--color-cyan)] border border-white/10 hover:border-[var(--color-cyan)]/30 rounded-lg text-slate-300 transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Tools / Pages List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Dropdown Links / Preset Sub-Pages ({linkConfigState.tools.length})
                  </span>
                  <button
                    onClick={() => {
                      const newId = `t-${Date.now()}`;
                      setLinkConfigState({
                        ...linkConfigState,
                        tools: [
                          ...linkConfigState.tools,
                          { id: newId, label: 'New Link', url: 'https://' }
                        ]
                      });
                    }}
                    className="text-[10px] text-[var(--color-cyan)] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-premium">
                  {linkConfigState.tools.map((t, idx) => (
                    <div key={t.id || idx} className="p-3 bg-[var(--bg-surface-solid)]/50 border border-white/5 rounded-xl flex items-center gap-2">
                      <input
                        type="text"
                        value={t.label}
                        onChange={(e) => {
                          const updated = [...linkConfigState.tools];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setLinkConfigState({ ...linkConfigState, tools: updated });
                        }}
                        placeholder="Link Label..."
                        className="w-1/3 bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="url"
                        value={t.url}
                        onChange={(e) => {
                          const updated = [...linkConfigState.tools];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setLinkConfigState({ ...linkConfigState, tools: updated });
                        }}
                        placeholder="https://..."
                        className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono"
                      />
                      <button
                        onClick={() => {
                          const updated = linkConfigState.tools.filter((_, i) => i !== idx);
                          setLinkConfigState({ ...linkConfigState, tools: updated });
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


        </div>{/* end tab content body */}

        {/* Footer */}
        <div className="px-6 py-3 bg-[var(--bg-surface-solid)]/90 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Connected as Owner Admin</span>
          </div>
          <span>CosmicBone Core v4.0</span>
        </div>

      </div>
    </div>
  );
};

