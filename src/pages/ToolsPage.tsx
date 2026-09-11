import React from 'react';
import {
  BookOpen,
  Keyboard,
  AlertCircle,
  CalendarClock,
  Calculator,
  ListTodo,
  Clock,
  CalendarDays,
  Hourglass,
  Sparkles,
  Wrench,
  Moon,
  FileQuestion,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isActive?: boolean;
  category?: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'mistake-tracker',
    title: 'Mistake Tracker (NEET & JEE)',
    description: 'Log exam slips, identify recurring traps (calculation, concept, rush), and review with spaced revision drills.',
    icon: AlertCircle,
    color: 'text-rose-400',
    isActive: true,
    category: 'Exam Strategy'
  },
  {
    id: 'syllabus-tracker',
    title: 'Syllabus Tracker',
    description: 'Monitor your completion across all subjects with chapter-by-chapter weightage and checklists.',
    icon: ListTodo,
    color: 'text-teal-400',
    isActive: true,
    category: 'Planning'
  },
  {
    id: 'flashcards',
    title: 'Smart Flashcards',
    description: 'Active recall and spaced repetition deck with 3D flip card animations for high-yield formulas.',
    icon: Layers,
    color: 'text-amber-400',
    isActive: true,
    category: 'Retention'
  },
  {
    id: 'reading',
    title: 'Reading Speed & Focus',
    description: 'Improve your reading comprehension, question parsing speed, and focus duration under pressure.',
    icon: BookOpen,
    color: 'text-blue-400',
    category: 'Focus'
  },
  {
    id: 'typing',
    title: 'Typing Practice',
    description: 'Enhance your typing speed, numerical keypad accuracy, and keyboard shortcuts for computer-based tests.',
    icon: Keyboard,
    color: 'text-purple-400',
    category: 'Speed'
  },
  {
    id: 'exam-countdown',
    title: 'Exam Countdown & Milestones',
    description: 'Track days, hours, and minutes left until NEET, JEE Main, and Advanced milestones with targets.',
    icon: CalendarClock,
    color: 'text-orange-400',
    category: 'Planning'
  },
  {
    id: 'marks-calculator',
    title: 'Marks & Rank Predictor',
    description: 'Predict your All India Rank and percentile based on expected scores and past year cutoffs.',
    icon: Calculator,
    color: 'text-green-400',
    category: 'Analytics'
  },
  {
    id: 'study-time-tracker',
    title: 'Study Time & Deep Work Tracker',
    description: 'Log daily deep study hours, track subject-wise time split, and optimize productive peaks.',
    icon: Clock,
    color: 'text-cyan-400',
    category: 'Productivity'
  },
  {
    id: 'time-table-maker',
    title: 'AI Time Table Maker',
    description: 'Design and customize your weekly schedule balancing coaching lectures, self-study, and sleep.',
    icon: CalendarDays,
    color: 'text-indigo-400',
    category: 'Planning'
  },
  {
    id: 'time-calculator',
    title: 'Exam Time Budget Calculator',
    description: 'Calculate average seconds per question, section-wise time distribution, and revision buffers.',
    icon: Hourglass,
    color: 'text-pink-400',
    category: 'Exam Strategy'
  },
  {
    id: 'motivation',
    title: 'Daily Motivation & Mindset',
    description: 'Find your core motivation, daily topper quotes, and mindset anchors when feeling overwhelmed.',
    icon: Sparkles,
    color: 'text-yellow-400',
    category: 'Mindset'
  },
  {
    id: 'sleep-cycle',
    title: 'Sleep Cycle & Circadian Optimizer',
    description: 'Align your 90-minute REM sleep cycles for maximum memory consolidation and peak morning alertness.',
    icon: Moon,
    color: 'text-indigo-300',
    category: 'Health'
  },
  {
    id: 'pyq',
    title: 'Previous Year Question Drill',
    description: 'Practice with past 10 years NEET and JEE questions organized by chapter and difficulty.',
    icon: FileQuestion,
    color: 'text-rose-400',
    category: 'Practice'
  },
];

export const ToolsPage: React.FC = () => {
  const { showNotification, setCurrentRoute } = useApp();

  const handleToolClick = (tool: ToolCard) => {
    if (tool.id === 'mistake-tracker') {
      setCurrentRoute('mistake-tracker');
      return;
    }
    if (tool.id === 'syllabus-tracker') {
      setCurrentRoute('syllabus-tracker');
      return;
    }
    if (tool.id === 'flashcards') {
      setCurrentRoute('flashcards');
      return;
    }
    // For now, show coming soon notification
    showNotification(`${tool.title} is coming soon!`);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto p-4 sm:p-8 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[var(--color-cyan)]/15 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30">
              <Wrench className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Student Tools Arsenal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl">
            High-impact study utilities engineered to boost your speed, test temperament, memory recall, and daily consistency.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
            <span className="text-[var(--color-cyan)] font-bold">3 Active Tools</span> • 10 in Lab
          </div>
        </div>
      </div>

      {/* Large Spacious Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.isActive;

          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`group relative bg-[var(--bg-surface-solid)]/60 backdrop-blur-xl border ${
                isActive
                  ? 'border-white/15 hover:border-[var(--color-cyan)]/60 hover:shadow-[0_12px_40px_rgba(0,240,255,0.2)]'
                  : 'border-white/5 hover:border-white/20'
              } rounded-3xl p-6 sm:p-7 min-h-[220px] cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between overflow-hidden`}
            >
              {/* Dynamic Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  isActive
                    ? 'from-[var(--color-cyan)]/10 via-transparent to-[var(--color-cyan)]/5'
                    : 'from-white/5 via-transparent to-transparent'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Top Section with Icon & Badges */}
              <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
                {/* Large Icon Container */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--bg-surface-secondary)]/90 border border-white/15 flex items-center justify-center shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] shrink-0 ${tool.color}`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {tool.category && (
                    <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider bg-white/5 rounded-full border border-white/5">
                      {tool.category}
                    </span>
                  )}
                  {isActive ? (
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[var(--color-cyan)]/20 border border-[var(--color-cyan)]/50 rounded-full text-[var(--color-cyan)] shadow-[0_0_12px_rgba(0,240,255,0.3)] shrink-0 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded-full text-[var(--text-muted)] group-hover:text-white/80 transition-colors shrink-0">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="relative z-10 space-y-2 mb-4">
                <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-[var(--color-cyan)] transition-colors font-heading leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* Bottom Action Row */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                {isActive ? (
                  <span className="font-bold text-[var(--color-cyan)] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-white/40 group-hover:text-white/60 transition-colors">
                    In Development
                  </span>
                )}

                <span className="text-[10px] text-white/30 font-medium">
                  {isActive ? 'Instant Access' : 'Planned'}
                </span>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[var(--color-cyan)]/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
