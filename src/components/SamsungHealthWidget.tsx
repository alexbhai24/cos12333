import React, { useState } from 'react';
import {
  LayoutGrid,
  Activity,
  Moon,
  HeartPulse,
  Headphones,
  Wrench,
  Flame,
  Clock,
  Target,
  AlertCircle,
  Play,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SamsungHealthWidget: React.FC = () => {
  const { setCurrentRoute, setIsStreakDrawerOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'activity' | 'focus' | 'mistakes' | 'zen' | 'tools'>('all');

  const tabs = [
    { id: 'all' as const, label: 'Overview', icon: LayoutGrid },
    { id: 'activity' as const, label: 'Activity & Practice', icon: Activity },
    { id: 'focus' as const, label: 'Focus & Rest', icon: Moon },
    { id: 'mistakes' as const, label: 'Mistake Health', icon: HeartPulse },
    { id: 'zen' as const, label: 'Zen Study Lounge', icon: Headphones },
    { id: 'tools' as const, label: 'Quick Tools', icon: Wrench },
  ];

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Top Title & Samsung Health Capsule Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white font-heading flex items-center gap-2">
            <span>Cosmic Health & Study Hub</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-mono">
              Live Stats
            </span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Track daily activity, focus sessions, and mistake health
          </p>
        </div>

        {/* Samsung Health Style Capsule Filter Bar (Exact Match to User Reference) */}
        <div className="bg-[#0b1626]/90 border border-white/10 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between space-x-1 shadow-lg shadow-black/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`p-2 sm:p-2.5 rounded-full transition-all flex items-center justify-center relative ${
                  isActive
                    ? 'bg-[#233549] text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] ring-1 ring-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Widget Content Body */}
      <div className="pt-2">
        {activeTab === 'all' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => setIsStreakDrawerOpen(true)}
              className="bg-[var(--bg-surface-solid)]/70 border border-amber-500/20 rounded-2xl p-4 cursor-pointer hover:border-amber-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <Flame className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500/80">
                  Streak
                </span>
              </div>
              <div className="text-xl font-black text-white">12 Days</div>
              <p className="text-[11px] text-[var(--text-muted)]">Active daily solver</p>
            </div>

            <div
              onClick={() => setCurrentRoute('focus-clock')}
              className="bg-[var(--bg-surface-solid)]/70 border border-purple-500/20 rounded-2xl p-4 cursor-pointer hover:border-purple-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-purple-400 mb-2">
                <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-500/80">
                  Focus
                </span>
              </div>
              <div className="text-xl font-black text-white">3.5 Hrs</div>
              <p className="text-[11px] text-[var(--text-muted)]">Today's study time</p>
            </div>

            <div
              onClick={() => setCurrentRoute('tests')}
              className="bg-[var(--bg-surface-solid)]/70 border border-cyan-500/20 rounded-2xl p-4 cursor-pointer hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-cyan-400 mb-2">
                <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-500/80">
                  Accuracy
                </span>
              </div>
              <div className="text-xl font-black text-white">88%</div>
              <p className="text-[11px] text-[var(--text-muted)]">NTA Qs accuracy</p>
            </div>

            <div
              onClick={() => setCurrentRoute('mistake-tracker')}
              className="bg-[var(--bg-surface-solid)]/70 border border-rose-500/20 rounded-2xl p-4 cursor-pointer hover:border-rose-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-rose-400 mb-2">
                <AlertCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500/80">
                  Mistakes
                </span>
              </div>
              <div className="text-xl font-black text-white">4 Logs</div>
              <p className="text-[11px] text-[var(--text-muted)]">Needs review</p>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-[var(--bg-surface-solid)]/80 border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-sm">
                90%
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Daily Target Progress</h4>
                <p className="text-xs text-[var(--text-muted)]">45 of 50 Questions solved today</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentRoute('tests')}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 transition-all shrink-0"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeTab === 'focus' && (
          <div className="bg-[var(--bg-surface-solid)]/80 border border-purple-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Focus Pomodoro Clock</h4>
                <p className="text-xs text-[var(--text-muted)]">Next 25-minute deep work session</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentRoute('focus-clock')}
              className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-purple-400 transition-all shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Focus Clock</span>
            </button>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="bg-[var(--bg-surface-solid)]/80 border border-rose-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-500/20 text-rose-300 rounded-2xl">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Mistake Health Tracker</h4>
                <p className="text-xs text-[var(--text-muted)]">3 Physics & 1 Bio question tagged for revision</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentRoute('mistake-tracker')}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-400 transition-all shrink-0"
            >
              <span>Review Mistakes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeTab === 'zen' && (
          <div className="bg-[var(--bg-surface-solid)]/80 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Live Zen Study Lounge</h4>
                <p className="text-xs text-[var(--text-muted)]">42 students studying with Lo-Fi cosmic beats</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentRoute('study-rooms')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Join Study Room</span>
            </button>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="bg-[var(--bg-surface-solid)]/80 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Quick Tools & PYQs</h4>
                <p className="text-xs text-[var(--text-muted)]">Formula sheets, calculators, and past papers</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentRoute('tools')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Tools Hub</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
