import React, { useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  BookOpen,
  FileText,
  Cpu,
  Trophy,
  Users,
  Flame,
  ArrowRight,
  Shield,
  Bot,
  Layers,
  Search,
  Book
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HomeHero } from '../components/HomeHero';
import { AppleTreeWidget } from '../components/AppleTreeWidget';
import { FocusClockCard } from '../components/FocusClockCard';
import { MusicPlayerWidget } from '../components/MusicPlayerWidget';

export const HomePage: React.FC = () => {
  const {
    user,
    setCurrentRoute,
    posts,
    savedItemIds,
    setIsBoneAIOpen,
    setIsSavedItemsOpen
  } = useApp();

  // Inject CommonNinja SDK script once
  useEffect(() => {
    if (!document.getElementById('commonninja-sdk')) {
      const script = document.createElement('script');
      script.id = 'commonninja-sdk';
      script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Hero Welcome & Command Center Banner */}
      <HomeHero />

      {/* 2-Column Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* COSMIC APPLE ORCHARD WIDGET (Preserved & Featured) */}
          <AppleTreeWidget />

          {/* ACADEMIC COMMUNITY FEED PREVIEWS */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-xl text-[var(--color-primary)]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white font-heading">
                    Academic Community Feed
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Latest student discussions, study tips, and questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentRoute('posts')}
                className="text-xs font-bold text-[var(--color-cyan)] hover:text-white flex items-center gap-1 transition-all"
              >
                <span>View All Posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Post Cards list preview */}
            <div className="space-y-3">
              {posts.length === 0 ? (
                <div className="p-8 text-center bg-[var(--bg-surface-solid)]/60 border border-white/5 rounded-2xl space-y-2">
                  <Sparkles className="w-8 h-8 text-[var(--color-cyan)]/40 mx-auto animate-pulse" />
                  <div className="text-xs font-bold text-gray-300">No community posts yet</div>
                  <p className="text-[11px] text-[var(--text-muted)]">Be the first to publish a study tip or question!</p>
                  <button
                    onClick={() => setCurrentRoute('posts')}
                    className="mt-2 px-4 py-2 bg-[var(--color-cyan)]/25 hover:bg-[var(--color-cyan)]/45 border border-[var(--color-cyan)]/45 text-[var(--color-cyan)] font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    Publish Post 📢
                  </button>
                </div>
              ) : (
                posts.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setCurrentRoute('posts')}
                    className="p-4 bg-[var(--bg-surface-solid)]/60 border border-white/5 rounded-2xl hover:border-[var(--color-cyan)]/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-cyan)]">
                          {p.authorName ? p.authorName[0] : 'S'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{p.authorName}</div>
                          <div className="text-[9px] text-[var(--text-muted)]">{p.authorRole}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-violet)]/10 text-[var(--color-violet)] border border-[var(--color-violet)]/20">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-[var(--color-cyan)] transition-colors mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {p.content}
                    </p>

                    <div className="mt-3 flex items-center space-x-4 text-[10px] text-[var(--text-muted)] pt-2 border-t border-white/5">
                      <span>👍 {p.likes} Likes</span>
                      <span>💬 {p.commentsCount || 0} Comments</span>
                      <span className="ml-auto text-[var(--color-cyan)] group-hover:underline">Read full post →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LEARNING MODULES GRID */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white font-extrabold text-sm uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[var(--color-cyan)]" />
              <span>Explore Learning Modules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Test Series Card */}
              <div
                onClick={() => setCurrentRoute('tests')}
                className="p-5 bg-gradient-to-br from-[var(--bg-surface-solid)] to-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--color-cyan)]/50 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-[var(--color-violet)]/10 border border-[var(--color-violet)]/30 rounded-2xl text-[var(--color-violet)]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-violet)]/20 text-[var(--color-violet)] border border-[var(--color-violet)]/30">
                    All-India Series
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[var(--color-cyan)] transition-colors mb-1 font-heading">
                  Test Series & Quizzes
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Full-length JEE, NEET & Board mock exams with instant scoring and detailed step-by-step solutions.
                </p>
                <div className="flex items-center text-xs font-bold text-[var(--color-cyan)] group-hover:underline">
                  <span>Start Practice Exam</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Study Rooms Card */}
              <div
                onClick={() => setCurrentRoute('study-rooms')}
                className="p-5 bg-gradient-to-br from-[var(--bg-surface-solid)] to-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--color-cyan)]/50 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 rounded-2xl text-[var(--color-cyan)]">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-cyan)]/25 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30">
                    Live Active
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[var(--color-cyan)] transition-colors mb-1 font-heading">
                  Active Study Rooms
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Join real-time peer study lounges with timers, live chat, and collaborative problem solving.
                </p>
                <div className="flex items-center text-xs font-bold text-[var(--color-cyan)] group-hover:underline">
                  <span>Enter Rooms Radar</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Documents Card */}
              <div
                onClick={() => setCurrentRoute('documents')}
                className="p-5 bg-gradient-to-br from-[var(--bg-surface-solid)] to-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--color-cyan)]/50 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 rounded-2xl text-[var(--color-success)]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-success)]/25 text-[var(--color-success)] border border-[var(--color-success)]/30">
                    Formula Cheat Sheets
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[var(--color-cyan)] transition-colors mb-1 font-heading">
                  Documents & Solved PDFs
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Download revision PDFs, NCERT exemplar solutions, and physics formula cheat sheets.
                </p>
                <div className="flex items-center text-xs font-bold text-[var(--color-cyan)] group-hover:underline">
                  <span>Browse Documents</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Games Hub Card */}
              <div
                onClick={() => setCurrentRoute('games')}
                className="p-5 bg-gradient-to-br from-[var(--bg-surface-solid)] to-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--color-cyan)]/50 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-2xl text-[var(--color-warning)]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] border border-[var(--color-warning)]/30">
                    Speed Drills
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[var(--color-cyan)] transition-colors mb-1 font-heading">
                  Bone Interactive Games
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Play math grid speed battles, memory matrix challenges, and science puzzle games.
                </p>
                <div className="flex items-center text-xs font-bold text-[var(--color-cyan)] group-hover:underline">
                  <span>Launch Arcade Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN / UTILITY RAIL (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Bone AI Companion Launcher Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-[var(--color-violet)]/15 border border-[var(--color-violet)]/35 rounded-xl text-[var(--color-violet)]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white font-heading">Bone AI Assistant</h3>
                <p className="text-[10px] text-[var(--text-muted)]">Ask any physics formula or concept</p>
              </div>
            </div>

            <div
              onClick={() => setIsBoneAIOpen(true)}
              className="p-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl text-xs text-[var(--text-secondary)] hover:text-white hover:border-[var(--color-cyan)] transition-all cursor-pointer flex items-center justify-between"
            >
              <span>Ask Bone AI a question...</span>
              <Sparkles className="w-4 h-4 text-[var(--color-cyan)] animate-pulse" />
            </div>
          </div>

          {/* User Rewards & Streak Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Rewards Overview</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Synced</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl text-center">
                <div className="text-[10px] text-[var(--text-muted)] font-semibold mb-0.5">Daily Streak</div>
                <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span>{user?.streak || 0} Days</span>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-2xl text-center">
                <div className="text-[10px] text-[var(--text-muted)] font-semibold mb-0.5">Apples Balance</div>
                <div className="text-lg font-black text-emerald-450 flex items-center justify-center gap-1">
                  <span>🍎</span>
                  <span>{user?.apples || 0}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSavedItemsOpen(true)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Book className="w-4 h-4 text-[var(--color-cyan)]" />
              <span>Saved Items Library ({savedItemIds.length})</span>
            </button>
          </div>

          {/* Focus Clock Live Preview Card */}
          <FocusClockCard onNavigate={() => setCurrentRoute('focus-clock')} />

          {/* Live Study Rooms Radar */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4 text-[var(--color-cyan)]" />
                <span>Study Rooms Radar</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Connect with peer students online in silent study lounges or topic discussion rooms.
            </p>

            <button
              onClick={() => setCurrentRoute('study-rooms')}
              className="w-full py-2.5 bg-[var(--color-cyan)]/10 hover:bg-[var(--color-cyan)]/20 border border-[var(--color-cyan)]/35 text-[var(--color-cyan)] font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <span>Join Active Lounges 🎧</span>
            </button>
          </div>

          {/* Custom Music Player Widget */}
          <MusicPlayerWidget />

        </div>

      </div>
    </div>
  );
};
