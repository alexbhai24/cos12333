import React from 'react';
import { ReadingChapter } from '../../data/biology/readingSyllabus';
import { Flame, Award, BookOpen, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { getChapterUnitTheme } from '../../utils/flashcardUnitTheme';

interface ReadingChapterCardProps {
  chapter: ReadingChapter;
  index: number;
  stats: {
    completedTopicsCount: number;
    totalLevelsCompleted: number;
    completionPercentage: number;
    bestWpm: number;
    avgAccuracy: number;
  };
  onSelectChapter: (chapterId: string) => void;
}

export const ReadingChapterCard: React.FC<ReadingChapterCardProps> = ({
  chapter,
  index,
  stats,
  onSelectChapter
}) => {
  const formattedIndex = (index + 1).toString().padStart(2, '0');
  const unitTheme = getChapterUnitTheme(chapter.title, 'Biology', 'NEET');
  const isComplete = stats.completionPercentage === 100 && stats.completedTopicsCount > 0;

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'HIGH YIELD';
      case 'MEDIUM': return 'MODERATE';
      case 'LOW': return 'FOUNDATION';
      default: return 'CORE NEET';
    }
  };

  return (
    <div
      onClick={() => onSelectChapter(chapter.id)}
      className="group relative rounded-2xl p-3 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-lg hover:translate-y-[-2px] select-none"
      style={{
        background: unitTheme.cardBg,
        borderColor: isComplete ? unitTheme.primaryColor : unitTheme.borderColor,
        boxShadow: isComplete 
          ? `0 8px 25px ${unitTheme.primaryColor}50` 
          : '0 4px 20px rgba(0,0,0,0.35)'
      }}
    >
      {/* Top Artwork Banner */}
      <div 
        className="relative h-36 sm:h-44 rounded-xl overflow-hidden p-2.5 sm:p-3.5 flex flex-col justify-between border shadow-inner transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          background: unitTheme.bannerGradient
        }}
      >
        {/* Dot Matrix Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
            backgroundPosition: 'center'
          }}
        />

        {/* Large Centered Watermark Number */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span 
            className="text-4xl sm:text-7xl font-black tracking-tight font-sans transition-transform duration-300 group-hover:scale-105"
            style={{ color: unitTheme.watermarkColor }}
          >
            #{formattedIndex}
          </span>
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
          <span 
            className="border px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-black tracking-wider shadow-sm backdrop-blur-md text-white shrink-0"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.35)'
            }}
          >
            CH #{formattedIndex}
          </span>

          <div 
            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-xs font-black tracking-wide flex items-center gap-1 shadow-md shrink-0 uppercase"
            style={{
              backgroundColor: '#FFFFFF',
              color: unitTheme.primaryColor
            }}
          >
            <Award className="w-3 h-3 stroke-[2.5]" />
            <span>{chapter.officialWeightage || '10 MARKS'}</span>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2 mt-auto">
          <span 
            className="border px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md text-white truncate max-w-[55%]"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <Flame className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{getPriorityText(chapter.pyqPriority)}</span>
          </span>

          <span 
            className="border px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-semibold tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md text-white truncate max-w-[45%]"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <BookOpen className="w-3 h-3 text-cyan-300 shrink-0" />
            <span className="truncate">{chapter.topics.length} Topics</span>
          </span>
        </div>
      </div>

      {/* Chapter Details Body */}
      <div className="pt-3 sm:pt-4 px-1 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[var(--color-primary)]">
              Class {chapter.classNum} Biology
            </span>
            {isComplete && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Mastered
              </span>
            )}
          </div>

          <h3 
            className="text-base sm:text-lg font-black text-white line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors duration-300"
            title={chapter.title}
          >
            {chapter.title}
          </h3>
        </div>

        {/* Reading Metrics Bar */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-white/10 space-y-2">
          {/* Progress row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)] text-[11px] font-medium">Reading Progress</span>
            <span className="font-extrabold text-white text-xs font-mono">
              {stats.completionPercentage}% ({stats.completedTopicsCount}/{chapter.topics.length} Topics)
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.completionPercentage}%`,
                background: stats.completionPercentage >= 100
                  ? '#10b981'
                  : 'linear-gradient(90deg, #00D7A0, #00F0FF)'
              }}
            />
          </div>

          {/* Stats summary row */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-muted)]">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Best: <strong className="text-white font-mono">{stats.bestWpm > 0 ? `${stats.bestWpm} WPM` : '—'}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Acc: <strong className="text-white font-mono">{stats.avgAccuracy > 0 ? `${stats.avgAccuracy}%` : '—'}</strong></span>
            </div>
          </div>

          {/* Continue button */}
          <div className="pt-2">
            <button
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black text-white bg-white/5 hover:bg-white/10 border border-white/10 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/15 group-hover:text-[var(--color-primary)] transition-all cursor-pointer"
            >
              <span>{stats.completionPercentage > 0 ? 'Continue Reading' : 'Start Reading'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
