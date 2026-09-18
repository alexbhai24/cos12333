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
  Cpu,
  CheckCircle2,
  Flame,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'bone-ai',
    title: 'Bone AI Assistant',
    description: 'Interactive AI tutor for learning, study planning, and problem solving.',
    icon: Cpu,
    color: 'text-cyan-400',
  },
  {
    id: 'habit-radar',
    title: 'Habit Radar',
    description: 'Track daily habits, streaks, weekly grids, and monthly heatmaps.',
    icon: Flame,
    color: 'text-emerald-400',
  },
  {
    id: 'reading',
    title: 'Reading Speed & Focus',
    description: 'Improve your reading comprehension and speed.',
    icon: BookOpen,
    color: 'text-blue-400',
  },
  {
    id: 'typing',
    title: 'Typing Practice',
    description: 'Enhance your typing speed and accuracy.',
    icon: Keyboard,
    color: 'text-purple-400',
  },
  {
    id: 'mistake-tracker',
    title: 'Error Book',
    description: 'Log and analyze your recurring errors with Google Lens scanner.',
    icon: AlertCircle,
    color: 'text-red-400',
  },
  {
    id: 'exam-countdown',
    title: 'Exam Countdown',
    description: 'Track days left until your important exams.',
    icon: CalendarClock,
    color: 'text-orange-400',
  },
  {
    id: 'marks-calculator',
    title: 'Marks & Rank Calculator',
    description: 'Predict your rank based on expected marks.',
    icon: Calculator,
    color: 'text-green-400',
  },
  {
    id: 'syllabus-tracker',
    title: 'Syllabus Tracker',
    description: 'Monitor your completion across all subjects.',
    icon: ListTodo,
    color: 'text-teal-400',
  },
  {
    id: 'study-time-tracker',
    title: 'Study Time Tracker',
    description: 'Log your daily study hours and breaks.',
    icon: Clock,
    color: 'text-cyan-400',
  },
  {
    id: 'schedule-day',
    title: 'Schedule Day',
    description: 'Plan your day with study blocks, breaks and more.',
    icon: CalendarDays,
    color: 'text-indigo-400',
  },

  {
    id: 'sleep-cycle',
    title: 'Sleep Cycle',
    description: 'Optimize your sleep for maximum retention.',
    icon: Moon,
    color: 'text-indigo-300',
  },
  {
    id: 'mock-tests',
    title: 'Mock Tests',
    description: 'Full length test simulator for NEET/JEE.',
    icon: FileQuestion,
    color: 'text-indigo-400',
  },
  {
    id: 'pyq',
    title: 'Previous Year Questions',
    description: 'Practice with real past exam papers.',
    icon: FileQuestion,
    color: 'text-rose-400',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Active recall and spaced repetition.',
    icon: Layers,
    color: 'text-amber-400',
  },
  {
    id: 'question-practice',
    title: 'Question Practice',
    description: 'Chapter-wise NCERT question bank with detailed solutions.',
    icon: CheckCircle2,
    color: 'text-emerald-400',
  },
  {
    id: 'link',
    title: 'Link',
    description: 'Embedded web portal with speed tests, calculators, and online tools.',
    icon: Globe,
    color: 'text-cyan-400',
  },
];

export const ToolsPage: React.FC = () => {
  const { showNotification, setCurrentRoute } = useApp();
  const { currentUser, userRole } = useAuth();
  
  const isOwnerAdmin = currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';
  const isAdmin = isOwnerAdmin || userRole === 'admin';

  const displayTools = TOOLS;

  const handleToolClick = (tool: ToolCard) => {
    if (tool.id === 'question-practice') {
      setCurrentRoute('question-practice'); // Top level
      return;
    }
    if (tool.id === 'creator-studio') {
      setCurrentRoute('creator-studio'); // Top level
      return;
    }
    
    // Tools that go under /tools/...
    const toolsUnderToolsRoute = [
      'bone-ai', 'habit-radar', 'mistake-tracker', 'syllabus-tracker', 'flashcards', 'sleep-cycle',
      'mock-tests', 'pyq', 'study-time-tracker', 'marks-calculator',
      'exam-countdown', 'reading-practice', 'schedule-day', 'link'
    ];
    
    if (tool.id === 'reading') {
      setCurrentRoute('reading-practice', '', '/tools/reading-practice');
      return;
    }
    
    if (toolsUnderToolsRoute.includes(tool.id)) {
      setCurrentRoute(tool.id as any, '', `/tools/${tool.id}`);
      return;
    }
    
    // For now, we just show a coming soon toast
    showNotification(`${tool.title} is coming soon!`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pt-4">
        {displayTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = ['bone-ai', 'habit-radar', 'reading', 'creator-studio', 'syllabus-tracker', 'flashcards', 'mistake-tracker', 'pyq', 'mock-tests', 'sleep-cycle', 'study-time-tracker', 'marks-calculator', 'exam-countdown', 'schedule-day', 'link'].includes(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="group relative bg-[var(--bg-surface-solid)]/40 backdrop-blur-md border border-white/5 hover:border-[var(--color-cyan)]/50 rounded-2xl sm:rounded-3xl p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col justify-between hover-shine-effect"
            >
              {/* Dynamic Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cyan)]/0 via-[var(--color-cyan)]/5 to-[var(--color-cyan)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Top Section with Icon */}
              <div className="relative z-10 flex items-start justify-between gap-1.5 mb-2.5 sm:mb-4">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[var(--bg-surface-secondary)]/80 border border-white/10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] shrink-0 ${tool.color}`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                
                {/* Status Badge */}
                {!isActive && (
                  <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded-full text-[var(--text-muted)] group-hover:text-[var(--color-cyan)] group-hover:border-[var(--color-cyan)]/30 transition-colors shrink-0">
                    Coming Soon
                  </span>
                )}
                {isActive && (
                  <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/40 rounded-full text-[var(--color-cyan)] shadow-sm shrink-0">
                    Active
                  </span>
                )}
              </div>

              {/* Content Section */}
              <div className="relative z-10 space-y-1 sm:space-y-2">
                <h3 className="text-xs sm:text-lg font-bold text-white group-hover:text-[var(--color-cyan)] transition-colors line-clamp-1 font-heading">
                  {tool.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-snug sm:leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Decorative corner glow */}
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[var(--color-cyan)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
