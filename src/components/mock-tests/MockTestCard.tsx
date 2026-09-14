import React from 'react';
import { Award, Clock, Coins, Check, FileText, Play, Calendar, ShieldCheck, Flame, Layers } from 'lucide-react';

export interface MockTestSubjectBreakdown {
  subject: string;
  questions: number;
  marks: number;
}

export interface MockTestItem {
  id: string;
  testNumber: number;
  watermarkText?: string;
  title: string;
  exam: 'neet' | 'jee';
  category: 'all' | 'full_syllabus' | 'mission30' | 'replica' | 'sectional' | string;
  questions: number;
  marks: number;
  durationMins: number;
  attemptsCount: number;
  maxCoins: number;
  heldOn: string;
  isFree: boolean;
  difficulty: 'MODERATE' | 'HARD' | 'CHALLENGER' | 'STANDARD' | string;
  syllabusSummary: string;
  subjectBreakdown: MockTestSubjectBreakdown[];
  theme: {
    bannerGradient: string;
    cardBg: string;
    badgeBg: string;
    primaryColor: string;
    borderColor: string;
    watermarkColor: string;
    glowShadow?: string;
  };
}

export interface MockTestUserProgress {
  isCompleted: boolean;
  score?: number;
  accuracy?: number;
  attemptDate?: string;
}

interface MockTestCardProps {
  test: MockTestItem;
  index: number;
  progress?: MockTestUserProgress;
  onStartTest: () => void;
  onViewDetails: () => void;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

export const MockTestCard: React.FC<MockTestCardProps> = ({
  test,
  index,
  progress,
  onStartTest,
  onViewDetails,
  onToggleComplete
}) => {
  const formattedIndex = test.testNumber.toString().padStart(2, '0');
  const isComplete = !!progress?.isCompleted;
  const score = progress?.score;
  const scorePct = score !== undefined ? Math.round((score / test.marks) * 100) : null;

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'CHALLENGER':
        return { label: 'CHALLENGER', color: '#f43f5e' };
      case 'HARD':
        return { label: 'NTA HARD', color: '#f59e0b' };
      default:
        return { label: 'REAL NTA LEVEL', color: '#10b981' };
    }
  };

  const diffCfg = getDifficultyBadge(test.difficulty);

  return (
    <div
      onClick={onViewDetails}
      className="group relative rounded-2xl p-3 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-lg hover:translate-y-[-2px] select-none"
      style={{
        background: test.theme.cardBg,
        borderColor: isComplete ? test.theme.primaryColor : test.theme.borderColor,
        boxShadow: isComplete
          ? `0 8px 25px ${test.theme.primaryColor}50`
          : '0 4px 20px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* Top Artwork Banner — Flashcard aesthetic tailored for Mock Tests */}
      <div
        className="relative h-36 sm:h-46 rounded-xl overflow-hidden p-2.5 sm:p-3.5 flex flex-col justify-between border shadow-inner transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          background: test.theme.bannerGradient
        }}
      >
        {/* Subtle Dot Matrix Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
            backgroundPosition: 'center'
          }}
        />

        {/* Centered Large Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="text-4xl sm:text-7xl font-black tracking-tight font-sans transition-transform duration-300 group-hover:scale-105"
            style={{ color: test.theme.watermarkColor }}
          >
            {test.watermarkText || `#T${formattedIndex}`}
          </span>
        </div>

        {/* Top Row: Test Badge and Marks Badge */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
          {/* Left: Test # Badge */}
          <span
            className="border px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-black tracking-wider shadow-sm backdrop-blur-md text-white shrink-0"
            style={{
              backgroundColor: test.theme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.35)'
            }}
          >
            TEST #{test.testNumber}
          </span>

          {/* Right: Solid White MARKS Badge with Award Icon */}
          <div className="bg-white text-gray-950 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-xs font-black tracking-wide flex items-center gap-1 sm:gap-1.5 shadow-md shrink-0">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span>{test.marks} MARKS</span>
          </div>
        </div>

        {/* Bottom Row: Duration/Questions and Coins/Free Badge */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2 mt-auto">
          {/* Left: Questions & Duration */}
          <span
            className="border px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm backdrop-blur-md text-white truncate max-w-[55%]"
            style={{
              backgroundColor: test.theme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
            <span className="truncate">{test.questions} Qs · {test.durationMins}m</span>
          </span>

          {/* Right: Coins Reward or Free Badge */}
          <span
            className="border px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm backdrop-blur-md text-white truncate max-w-[45%]"
            style={{
              backgroundColor: test.theme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">+{test.maxCoins} 🪙</span>
          </span>
        </div>
      </div>

      {/* Card Body Section */}
      <div className="pt-2 sm:pt-3 pb-1 px-0.5 sm:px-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Quick Checkmark */}
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1">
            <h3
              className="font-extrabold text-xs sm:text-base text-white leading-snug line-clamp-1 flex-1 transition-colors group-hover:text-white/90"
              title={test.title}
            >
              {test.title}
            </h3>

            {onToggleComplete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(e);
                }}
                title={isComplete ? 'Mark as unattempted' : 'Mark test as completed'}
                className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer"
                style={{
                  backgroundColor: isComplete ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: isComplete ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  color: isComplete ? '#000000' : 'transparent'
                }}
              >
                <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] ${isComplete ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 text-white'}`} />
              </button>
            )}
          </div>

          {/* Syllabus Summary */}
          <p className="text-[10px] sm:text-xs text-white/70 line-clamp-2 leading-relaxed">
            {test.syllabusSummary}
          </p>

          {/* Date & Attempts Info */}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-white/50">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{test.heldOn}</span>
            </div>
            <span>•</span>
            <span>{test.attemptsCount.toLocaleString()} Attempts</span>
          </div>
        </div>

        {/* Score & Progress Bar (When Attempted) */}
        {isComplete && (
          <div className="mt-2.5 pt-2 border-t border-white/15">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {score !== undefined ? `Scored ${score}/${test.marks}` : 'Completed'}
              </span>
              {scorePct !== null && (
                <span className="text-white font-mono">{scorePct}%</span>
              )}
            </div>
            <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${scorePct !== null ? scorePct : 100}%`,
                  backgroundColor: test.theme.primaryColor,
                  boxShadow: `0 0 10px ${test.theme.primaryColor}`
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition-all shadow-sm active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Layers className="w-3 h-3" />
            <span>Syllabus</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartTest();
            }}
            title="Launch Full NTA Timed Mock Test"
            className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-[11px] font-extrabold transition-all shadow-sm active:scale-95 cursor-pointer"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000'
            }}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isComplete ? 'Reattempt' : 'Start Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
