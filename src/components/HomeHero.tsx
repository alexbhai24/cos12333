import React from 'react';
import { ArrowRight, Sparkles, MessageSquare, Play, Flame, Award, Cpu, BookOpen, Layers, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { normalizeGrade } from '../utils/gradeUtils';

export const HomeHero: React.FC = () => {
  const { user, setCurrentRoute, posts } = useApp();
  const normalizedGrade = normalizeGrade(user?.gradeLevel).toUpperCase();

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[var(--bg-sidebar)] via-[var(--bg-surface-solid)] to-[var(--bg-surface-secondary)] p-6 sm:p-10 mb-8 border border-[var(--border-color)] shadow-[0_20px_60px_var(--glow-primary)]">
      {/* Sci-Fi Background Glow & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-24 -top-24 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-24 -bottom-24 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-cyan) 1px, transparent 1px), linear-gradient(to bottom, var(--color-cyan) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-4xl">
        {/* Eyebrow badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-wider text-cyan-300 uppercase">
              NEXT-GEN EDTECH PLATFORM V4.0
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-[11px] font-bold">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Academic Level: {normalizedGrade}</span>
          </div>
        </div>

        {/* Dynamic Welcome Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 font-heading">
          Welcome Back,{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            {user?.name || 'Cosmic Student'}
          </span>{' '}
          🚀
        </h1>

        {/* Supporting Text */}
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 max-w-2xl">
          Dive into your personalized learning workspace — explore community discussions, join live study rooms, take timed test series, or harvest apples in your Cosmic Orchard!
        </p>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setCurrentRoute('posts')}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Academic Feed</span>
          </button>

          <button
            onClick={() => setCurrentRoute('study-rooms')}
            className="flex items-center space-x-2 px-5 py-3 bg-[var(--bg-surface-solid)] hover:bg-white/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm rounded-2xl transition-all active:scale-95"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Live Study Rooms</span>
          </button>

          <button
            onClick={() => setCurrentRoute('tests')}
            className="flex items-center space-x-2 px-5 py-3 bg-[var(--bg-surface-solid)] hover:bg-white/10 border border-purple-500/30 text-purple-300 font-bold text-xs sm:text-sm rounded-2xl transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Test Series</span>
          </button>

          <button
            onClick={() => setCurrentRoute('games')}
            className="flex items-center space-x-2 px-5 py-3 bg-[var(--bg-surface-solid)] hover:bg-white/10 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm rounded-2xl transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Bone Games</span>
          </button>
        </div>

        {/* Stats Summary Strip */}
        <div className="pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white font-heading">{user?.streak || 1} Days</div>
              <div className="text-[10px] text-gray-400">Active Daily Streak</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="text-base">🍎</span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white font-heading">{user?.apples || 0} Apples</div>
              <div className="text-[10px] text-gray-400">Harvest Balance</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white font-heading">{posts.length} Posts</div>
              <div className="text-[10px] text-gray-400">Community Posts</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white font-heading">Interactive</div>
              <div className="text-[10px] text-gray-400">Learning Engine</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
