import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Bot, BarChart2, Sliders, FileText, CheckCircle2,
  UserCheck, UserX, Search, Sparkles, Zap, Activity, Trash2, Play,
  File, Book, CheckSquare, ExternalLink, Briefcase, Globe, Music,
  Plus, X, BookMarked, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { contentService } from '../services/contentService';
import { postService } from '../services/postService';
import { videoService, VideoDoc } from '../services/videoService';
import { adminService } from '../services/adminService';
import { portfolioService } from '../services/portfolioService';
import ambientSoundService, { AmbientSoundUrls } from '../services/ambientSoundService';
import linkService, { LinkConfig, DEFAULT_LINK_CONFIG } from '../services/linkService';
import type { Post, ContentItem } from '../types';
import type { PortfolioProfile } from '../types/portfolio';

type Tab = 'overview' | 'users' | 'settings' | 'content' | 'portfolios' | 'ambient' | 'link';

export const FirestoreDashboardPage: React.FC = () => {
  const {
    isBoneAIEnabled, setIsBoneAIEnabled,
    posts, contentItems, user, showNotification
  } = useApp();

  const [activeTab, setActiveTab]           = useState<Tab>('overview');
  const [contentSubTab, setContentSubTab]   = useState<'posts' | 'academic'>('posts');
  const [academicFilter, setAcademicFilter] = useState<'all' | 'video' | 'document' | 'book' | 'test'>('all');

  const [usersList,             setUsersList]             = useState<any[]>([]);
  const [searchQuery,           setSearchQuery]           = useState('');
  const [maintenanceMode,       setMaintenanceMode]       = useState(() => localStorage.getItem('cosmicbone_maintenance_mode') === 'true');
  const [systemAlerts,          setSystemAlerts]          = useState(() => localStorage.getItem('cosmicbone_system_alerts') !== 'false');
  const [videos,                setVideos]                = useState<VideoDoc[]>([]);
  const [portfolios,            setPortfolios]            = useState<PortfolioProfile[]>([]);
  const [portfolioSearchQuery,  setPortfolioSearchQuery]  = useState('');
  const [appleInputs,           setAppleInputs]           = useState<Record<string, string>>({});
  const [ambientUrlsState,      setAmbientUrlsState]      = useState<AmbientSoundUrls>(() => ambientSoundService.getUrls());
  const [linkConfigState,       setLinkConfigState]       = useState<LinkConfig>(() => linkService.getConfig());

  // Load data
  useEffect(() => {
    const unsub = videoService.subscribeAllVideos(setVideos);
    const allP  = portfolioService.getAllPortfolios();
    setPortfolios(allP);
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const remote = await adminService.getAllUsers();
        if (remote && remote.length > 0) { setUsersList(remote); return; }
      } catch {}
      try { setUsersList(JSON.parse(localStorage.getItem('cosmicbone_users') || '[]')); } catch {}
    };
    fetchUsers();
  }, []);

  // ─── Handlers ───────────────────────────────────────────
  const handleRoleChange = async (email: string, currentRole: string) => {
    const newRole = currentRole.toLowerCase() === 'admin' ? 'student' : 'admin';
    try { await adminService.requestRoleUpdate(email, newRole); } catch {}
    setUsersList(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, role: newRole.charAt(0).toUpperCase() + newRole.slice(1) } : u);
      localStorage.setItem('cosmicbone_users', JSON.stringify(updated));
      return updated;
    });
    showNotification(`Role updated: ${email} → ${newRole}`);
  };

  const handleAddApples = async (email: string) => {
    const amount = Number(appleInputs[email]);
    if (!amount || isNaN(amount)) return;
    try { await adminService.addApplesToUser(email, amount); } catch {}
    showNotification(`+${amount} apples → ${email}`);
    setAppleInputs(p => ({ ...p, [email]: '' }));
    setUsersList(prev => {
      const updated = prev.map(u => u.email === email ? { ...u, apples: (u.apples || 0) + amount } : u);
      localStorage.setItem('cosmicbone_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePost    = async (id: string, title: string) => { if (window.confirm(`Delete "${title}"?`)) { await postService.deletePost(id); showNotification(`Deleted: ${title}`); }};
  const handleDeleteVideo   = async (id: string, title: string) => { if (window.confirm(`Delete "${title}"?`)) { await videoService.deleteVideo(id); showNotification(`Deleted: ${title}`); }};
  const handleDeleteContent = async (id: string, title: string) => { if (window.confirm(`Delete "${title}"?`)) { await contentService.deleteContentItem(id); showNotification(`Deleted: ${title}`); }};

  const handleDeletePortfolio = (id: string, name: string) => {
    if (window.confirm(`Delete portfolio by "${name}"?`)) {
      if (portfolioService.deletePortfolio(id)) {
        setPortfolios(p => p.filter(x => x.id !== id));
        showNotification(`Portfolio deleted: ${name}`);
      }
    }
  };

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    localStorage.setItem('cosmicbone_maintenance_mode', String(next));
    showNotification(`Maintenance: ${next ? 'ON' : 'OFF'}`);
  };

  const handleToggleAlerts = () => {
    const next = !systemAlerts;
    setSystemAlerts(next);
    localStorage.setItem('cosmicbone_system_alerts', String(next));
    showNotification(`System Alerts: ${next ? 'ENABLED' : 'DISABLED'}`);
  };

  // ─── Filtered lists ──────────────────────────────────────
  const filteredUsers = usersList.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allAcademic = [
    ...videos.map(v => ({ id: v.id, title: v.title, contentType: 'video', subject: v.subject, targetGrades: v.targetGrades, embedUrl: v.embedUrl })),
    ...contentItems.map(c => ({ id: c.id, title: c.title, contentType: c.contentType, subject: c.subject, targetGrades: c.targetGrades, embedUrl: '' }))
  ];
  const filteredAcademic = allAcademic
    .filter(item => academicFilter === 'all' || item.contentType === academicFilter)
    .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview',   label: 'Overview',            icon: BarChart2  },
    { id: 'users',      label: 'User Accounts',       icon: Users      },
    { id: 'settings',   label: 'Platform Controls',   icon: Sliders    },
    { id: 'content',    label: 'Content Moderation',  icon: FileText   },
    { id: 'portfolios', label: 'Portfolios',          icon: Briefcase  },
    { id: 'ambient',    label: 'Ambient Sounds',      icon: Music      },
    { id: 'link',       label: 'Link Manager',        icon: Globe      },
  ];

  // Toggle component
  const Toggle = ({ on, onToggle, color = 'bg-[var(--color-cyan)]' }: { on: boolean; onToggle: () => void; color?: string }) => (
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? color : 'bg-white/10'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-[0_25px_70px_rgba(0,240,255,0.12)] overflow-hidden flex flex-col min-h-[80vh] animate-in fade-in duration-300">

      {/* ══ HEADER ══ */}
      <div className="px-6 py-5 border-b border-[var(--border-color)] bg-[var(--bg-surface-solid)]/90 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-[var(--color-cyan)]/20 to-purple-500/20 border border-[var(--color-cyan)]/35 rounded-2xl text-[var(--color-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white font-heading tracking-wide flex items-center gap-2">
              Admin Executive Console
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--color-cyan)]/20 to-purple-500/20 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30 uppercase tracking-widest font-mono">OWNER</span>
            </h2>
            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {user?.displayName || user?.email || 'Admin'} · Real-time Active Connection
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-emerald-400 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hidden sm:block">
          CosmicBone Core v5.0
        </div>
      </div>

      {/* ══ TAB NAV ══ */}
      <div className="flex items-center px-4 border-b border-[var(--border-color)] bg-[var(--bg-surface-solid)]/60 overflow-x-auto scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap relative ${
                isActive ? 'border-[var(--color-cyan)] text-[var(--color-cyan)] bg-[var(--color-cyan)]/5' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-cyan)]" />}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-premium">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* 5-card stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Total Users',   value: usersList.length || 1, icon: Users,     grad: 'from-cyan-500/20 to-blue-500/20',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    sub: 'Registered' },
                { label: 'Bone AI',       value: isBoneAIEnabled ? 'ON' : 'OFF', icon: Bot, grad: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/20', text: 'text-purple-400',  sub: 'Assistant' },
                { label: 'Posts',         value: posts.length,          icon: FileText,  grad: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/20', text: 'text-emerald-400', sub: 'Community' },
                { label: 'Videos',        value: videos.length,         icon: Play,      grad: 'from-rose-500/20 to-pink-500/20',    border: 'border-rose-500/20',   text: 'text-rose-400',   sub: 'Lectures' },
                { label: 'Content Items', value: contentItems.length,   icon: BookMarked,grad: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/20',  text: 'text-amber-400',  sub: 'Docs & Books' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`p-4 bg-gradient-to-br ${s.grad} border ${s.border} rounded-2xl relative overflow-hidden hover:scale-[1.02] transition-transform cursor-default`}>
                    <div className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${s.text}`}>{s.label}</div>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">{s.sub}</div>
                    <Icon className={`absolute right-2 bottom-2 w-8 h-8 opacity-10 ${s.text}`} />
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl">
              <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Quick Actions</div>
              <div className="flex flex-wrap gap-2">
                {TABS.slice(1).map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-white/5 hover:bg-[var(--color-cyan)]/15 text-gray-300 hover:text-[var(--color-cyan)] border border-white/10 hover:border-[var(--color-cyan)]/30 transition-all active:scale-95">
                      <Icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tools Status */}
            <div className="p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl">
              <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Platform Tools — All Active</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  ['🗓️','Schedule Day'],['🌙','Sleep Cycle'],['⏱️','Study Tracker'],['🏆','Marks Calculator'],
                  ['⏰','Exam Countdown'],['🃏','Flashcards'],['❌','Mistake Tracker'],['📚','Syllabus Tracker'],
                  ['📝','Mock Tests'],['🔬','PYQ Practice'],['📊','Progress Board'],['🎵','Ambient Focus'],
                ].map(([emoji, name]) => (
                  <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-sm">{emoji}</span>
                    <span className="text-[10px] font-semibold text-gray-400 flex-1 truncate">{name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* System Health bars */}
            <div className="p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">System Status</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full text-[9px] font-black uppercase tracking-wider">All Operational</span>
              </div>
              {[
                { label: 'Auth & Firestore',  pct: 100, color: 'bg-emerald-400' },
                { label: 'Content Delivery',  pct: 100, color: 'bg-emerald-400' },
                { label: 'Realtime Database', pct: 100, color: 'bg-emerald-400' },
                { label: 'LocalStorage Cache',pct: 100, color: 'bg-cyan-400'    },
              ].map(s => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span className="text-gray-500">{s.label}</span><span className="text-emerald-400">{s.pct}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USER ACCOUNTS ── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search by name or email..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)]/50" />
            </div>

            <div className="space-y-2.5">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-600 space-y-2">
                  <UserX className="w-8 h-8" /><span className="text-xs font-semibold">No users found</span>
                </div>
              ) : filteredUsers.map(u => {
                const isAdmin = u.role?.toLowerCase() === 'admin';
                return (
                  <div key={u.email} className="flex items-center justify-between p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl hover:border-[var(--color-cyan)]/20 transition-all gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${isAdmin ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' : 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20'}`}>
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {u.name}
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isAdmin ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' : 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20'}`}>
                            {isAdmin ? '👑 Admin' : '🎒 Student'}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">{u.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Apples */}
                      <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                        <span className="text-[10px] font-bold text-emerald-400 pl-2">🍎 {u.apples || 0}</span>
                        <input type="number" placeholder="+Amt" value={appleInputs[u.email] || ''}
                          onChange={e => setAppleInputs({ ...appleInputs, [u.email]: e.target.value })}
                          className="w-14 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white px-1.5 py-1 outline-none text-center focus:border-emerald-500/50" />
                        <button onClick={() => handleAddApples(u.email)}
                          className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border border-emerald-500/25">
                          Add
                        </button>
                      </div>
                      {/* Role toggle */}
                      {!isAdmin ? (
                        <button onClick={() => handleRoleChange(u.email, u.role)}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition-all active:scale-95">
                          Make Admin
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {u.email !== user?.email && (
                            <button onClick={() => handleRoleChange(u.email, u.role)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all active:scale-95">
                              Make Student
                            </button>
                          )}
                          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest px-2">Owner</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PLATFORM CONTROLS ── */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {[
              { icon: Bot, color: 'purple', label: 'Bone AI Assistant Widget', desc: 'Enable or disable the floating Bone AI assistant across the platform', on: isBoneAIEnabled, toggle: () => setIsBoneAIEnabled(!isBoneAIEnabled) },
              { icon: Zap, color: 'amber',  label: 'Maintenance Status Mode',  desc: 'Simulate platform maintenance banner for testing',                  on: maintenanceMode, toggle: handleToggleMaintenance },
              { icon: Sparkles, color: 'cyan', label: 'System Broadcast Notifications', desc: 'Enable real-time toast alerts for platform updates',         on: systemAlerts,    toggle: handleToggleAlerts },
            ].map(item => {
              const Icon = item.icon;
              const colors: Record<string, string> = { purple: 'bg-purple-600', amber: 'bg-amber-600', cyan: 'bg-[var(--color-cyan)]' };
              const iconColors: Record<string, string> = { purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400', amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400', cyan: 'bg-[var(--color-cyan)]/10 border-[var(--color-cyan)]/30 text-[var(--color-cyan)]' };
              return (
                <div key={item.label} className="flex items-center justify-between p-5 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 border rounded-xl ${iconColors[item.color]}`}><Icon className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                  <Toggle on={item.on} onToggle={item.toggle} color={colors[item.color]} />
                </div>
              );
            })}
          </div>
        )}

        {/* ── CONTENT MODERATION ── */}
        {activeTab === 'content' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 p-1 bg-[var(--bg-surface-solid)] rounded-2xl border border-[var(--border-color)]">
              {[{ id:'posts', label:`Posts (${posts.length})` }, { id:'academic', label:`Academic (${allAcademic.length})` }].map(st => (
                <button key={st.id} onClick={() => setContentSubTab(st.id as any)}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${contentSubTab === st.id ? 'bg-[var(--color-cyan)] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
                  {st.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)]/50" />
            </div>

            {contentSubTab === 'posts' && (
              <div className="space-y-2">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-600 border border-[var(--border-color)] rounded-2xl">No posts found.</div>
                ) : filteredPosts.map(p => (
                  <div key={p.id} className="p-3 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-4 hover:border-[var(--color-cyan)]/20 transition-all">
                    <div className="truncate flex-1">
                      <div className="text-xs font-bold text-white truncate">{p.title || 'Untitled'}</div>
                      <div className="text-[10px] text-gray-500">By {p.authorName} · {p.category} · {p.likes} Likes</div>
                    </div>
                    <button onClick={() => handleDeletePost(p.id, p.title)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-xl transition-all active:scale-95">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {contentSubTab === 'academic' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {['all','video','document','book','test'].map(f => (
                    <button key={f} onClick={() => setAcademicFilter(f as any)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-xl transition-all ${academicFilter === f ? 'bg-[var(--color-cyan)]/20 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                      {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {filteredAcademic.length === 0 ? (
                    <div className="text-center py-10 text-xs text-gray-600 border border-[var(--border-color)] rounded-2xl">No items found.</div>
                  ) : filteredAcademic.map(item => {
                    const isVideo = item.contentType === 'video';
                    const isDoc   = item.contentType === 'document';
                    const isBook  = item.contentType === 'book';
                    return (
                      <div key={item.id} className="p-3 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-4 hover:border-[var(--color-cyan)]/20 transition-all">
                        <div className="flex items-center gap-3 truncate flex-1">
                          <div className={`p-2 rounded-lg ${isVideo ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : isDoc ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : isBook ? 'bg-cyan-500/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {isVideo ? <Play className="w-3.5 h-3.5" /> : isDoc ? <File className="w-3.5 h-3.5" /> : isBook ? <Book className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">{item.title}</div>
                            <div className="text-[10px] text-gray-500">{item.contentType} · {item.subject} · {item.targetGrades.join(', ')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isVideo && item.embedUrl && (
                            <a href={item.embedUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/5 border border-white/10 hover:border-[var(--color-cyan)] rounded-xl text-gray-500 hover:text-white transition-all"><ExternalLink className="w-3.5 h-3.5" /></a>
                          )}
                          <button onClick={() => isVideo ? handleDeleteVideo(item.id, item.title) : handleDeleteContent(item.id, item.title)}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-xl transition-all active:scale-95">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PORTFOLIOS ── */}
        {activeTab === 'portfolios' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-white">Portfolio Manager</div>
                <div className="text-[11px] text-gray-500">View and delete any user portfolio</div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/20 rounded-full">{portfolios.length} Total</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search portfolios..." value={portfolioSearchQuery} onChange={e => setPortfolioSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)]/50" />
            </div>

            {portfolios.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-600 gap-2">
                <Briefcase className="w-8 h-8" /><span className="text-xs">No portfolios yet</span>
              </div>
            ) : (
              <div className="space-y-2">
                {portfolios.filter(p =>
                  p.fullName.toLowerCase().includes(portfolioSearchQuery.toLowerCase()) ||
                  (p.headline||'').toLowerCase().includes(portfolioSearchQuery.toLowerCase())
                ).map(p => (
                  <div key={p.id} className="p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-xl flex items-center justify-between gap-4 hover:border-[var(--color-cyan)]/20 transition-all">
                    <div className="flex items-center gap-3 truncate flex-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-cyan)]/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden">
                        {p.avatarUrl && !p.avatarUrl.startsWith('gradient:') ? <img src={p.avatarUrl} alt={p.fullName} className="w-full h-full object-cover" /> : p.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                          {p.fullName}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : 'bg-amber-500/20 text-amber-400 border border-amber-500/25'}`}>{p.status || 'draft'}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{p.category} · {p.projects?.length || 0} projects · {p.headline || 'No headline'}</div>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePortfolio(p.id, p.fullName)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-xl transition-all active:scale-95 flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AMBIENT SOUNDS ── */}
        {activeTab === 'ambient' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2"><Music className="w-4 h-4 text-[var(--color-cyan)]" /> Ambient Soundscapes</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Configure YouTube music links for Focus Clock ambient sounds.</p>
              </div>
              <button onClick={() => { ambientSoundService.updateUrls(ambientUrlsState); showNotification('Ambient URLs updated!'); }}
                className="px-4 py-2 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] text-[#030816] font-extrabold text-xs rounded-xl hover:brightness-110 active:scale-95">
                Save Links
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key:'forest', name:'Forest Soundscape',  emoji:'🌲', defaultUrl:'https://youtu.be/xNN7iTA57jM' },
                { key:'space',  name:'Space Soundscape',   emoji:'🚀', defaultUrl:'https://youtu.be/yLOM8R6lbzg' },
                { key:'ocean',  name:'Ocean Soundscape',   emoji:'🌊', defaultUrl:'https://youtu.be/JekUNGo-RVk' },
                { key:'desert', name:'Desert Soundscape',  emoji:'🏜️', defaultUrl:'https://youtu.be/JekUNGo-RVk' },
              ].map(({ key, name, emoji, defaultUrl }) => (
                <div key={key} className="p-4 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-2"><span>{emoji}</span><span>{name}</span></label>
                    <button onClick={() => setAmbientUrlsState({ ...ambientUrlsState, [key]: defaultUrl })} className="text-[10px] text-[var(--color-cyan)] hover:underline font-mono">Reset</button>
                  </div>
                  <input type="text" value={(ambientUrlsState as any)[key] || ''} onChange={e => setAmbientUrlsState({ ...ambientUrlsState, [key]: e.target.value })}
                    placeholder="YouTube URL..."
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)]/50 font-mono" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LINK MANAGER ── */}
        {activeTab === 'link' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-[var(--color-cyan)]" /> Link Manager</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Set any external web link to embed live inside the platform.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setLinkConfigState(DEFAULT_LINK_CONFIG); linkService.updateConfig(DEFAULT_LINK_CONFIG); showNotification('Reset to default link.'); }}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl border border-white/10 transition-all">
                  Reset
                </button>
                <button onClick={() => { linkService.updateConfig(linkConfigState); showNotification('🚀 Link updated!'); }}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] text-[#030816] font-extrabold text-xs rounded-xl hover:brightness-110 active:scale-95">
                  Save & Apply
                </button>
              </div>
            </div>

            <div className="p-5 bg-[var(--bg-surface-solid)]/60 border border-[var(--border-color)] rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Site Name</span>
                  <input type="text" value={linkConfigState.siteName} onChange={e => setLinkConfigState({ ...linkConfigState, siteName: e.target.value })} placeholder="e.g. ReadCheck"
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)] font-semibold" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Embed URL</span>
                  <input type="url" value={linkConfigState.mainUrl} onChange={e => setLinkConfigState({ ...linkConfigState, mainUrl: e.target.value })} placeholder="https://..."
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)] font-mono" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mr-1">Quick Presets:</span>
                {[
                  { label: 'wpmcheck.com', url: 'https://wpmcheck.com/' },
                  { label: 'Wikipedia', url: 'https://en.wikipedia.org/' },
                  { label: 'Khan Academy', url: 'https://www.khanacademy.org/' },
                ].map(p => (
                  <button key={p.url} onClick={() => setLinkConfigState({ ...linkConfigState, mainUrl: p.url, siteName: p.label })}
                    className="text-[10px] px-2.5 py-1 bg-white/5 hover:bg-[var(--color-cyan)]/15 hover:text-[var(--color-cyan)] border border-white/10 hover:border-[var(--color-cyan)]/25 rounded-lg text-gray-400 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">Sub-Links ({linkConfigState.tools.length})</span>
                <button onClick={() => setLinkConfigState({ ...linkConfigState, tools: [...linkConfigState.tools, { id: `t-${Date.now()}`, label: 'New Link', url: 'https://' }] })}
                  className="text-[10px] text-[var(--color-cyan)] hover:underline flex items-center gap-1 font-bold">
                  <Plus className="w-3 h-3" /> Add Link
                </button>
              </div>
              <div className="space-y-2">
                {linkConfigState.tools.map((t, idx) => (
                  <div key={t.id || idx} className="p-3 bg-[var(--bg-surface-solid)]/50 border border-white/5 rounded-xl flex items-center gap-2">
                    <input type="text" value={t.label} onChange={e => { const u = [...linkConfigState.tools]; u[idx] = { ...u[idx], label: e.target.value }; setLinkConfigState({ ...linkConfigState, tools: u }); }}
                      placeholder="Label..." className="w-1/3 bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none" />
                    <input type="url" value={t.url} onChange={e => { const u = [...linkConfigState.tools]; u[idx] = { ...u[idx], url: e.target.value }; setLinkConfigState({ ...linkConfigState, tools: u }); }}
                      placeholder="https://..." className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 font-mono focus:outline-none" />
                    <button onClick={() => setLinkConfigState({ ...linkConfigState, tools: linkConfigState.tools.filter((_, i) => i !== idx) })}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ══ FOOTER ══ */}
      <div className="px-6 py-3 bg-[var(--bg-surface-solid)]/90 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Connected as <span className="text-white font-bold">{user?.displayName || user?.email || 'Admin'}</span></span>
        </div>
        <span className="font-mono">CosmicBone Core v5.0 · {new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
      </div>
    </div>
  );
};
