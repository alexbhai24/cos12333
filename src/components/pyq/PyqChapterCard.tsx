import React from 'react';
import { SyllabusChapter } from '../../types/syllabus';
import { Flame, Award, BookOpen, Check, Play } from 'lucide-react';
import { getChapterUnitTheme } from '../../utils/flashcardUnitTheme';

export interface PyqChapterProgress {
  solvedCount: number;
  correctCount: number;
  isComplete?: boolean;
}

interface PyqChapterCardProps {
  chapter: SyllabusChapter;
  index: number;
  totalQuestions: number;
  progress: PyqChapterProgress;
  subjectName?: string;
  exam?: 'neet' | 'jee';
  onStartPractice: () => void;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

export const PyqChapterCard: React.FC<PyqChapterCardProps> = ({
  chapter,
  index,
  totalQuestions,
  progress,
  subjectName = 'Biology',
  exam = 'neet',
  onStartPractice,
  onToggleComplete,
}) => {
  const formattedIndex = (index + 1).toString().padStart(2, '0');
  const unitTheme = getChapterUnitTheme(chapter.title, subjectName, exam === 'neet' ? 'NEET' : 'JEE');

  const solvedCount = progress?.solvedCount || 0;
  const correctCount = progress?.correctCount || 0;
  const isComplete = progress?.isComplete || (totalQuestions > 0 && solvedCount >= totalQuestions);
  const percentage = totalQuestions > 0 ? Math.min(100, Math.round((solvedCount / totalQuestions) * 100)) : 0;
  const accuracy = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : null;

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'HIGH': return 'HIGH YIELD';
      case 'MEDIUM': return 'MODERATE';
      case 'LOW': return 'FOUNDATION';
      default: return 'STANDARD';
    }
  };

  const getMarksDisplay = () => {
    if (chapter.officialWeightage) {
      const match = chapter.officialWeightage.match(/(\d+)\s*Marks?/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > 20) {
          const approx = Math.round(num / 3);
          return `${approx} MARKS`;
        }
        return `${num} MARKS`;
      }
      if (chapter.officialWeightage.length <= 12) {
        return chapter.officialWeightage.toUpperCase();
      }
    }
    const weights = [12, 14, 10, 8, 6, 8, 10, 12];
    return `${weights[index % weights.length]} MARKS`;
  };

  return (
    <div
      onClick={onStartPractice}
      className="group relative rounded-2xl p-3 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-lg hover:translate-y-[-2px] select-none"
      style={{
        background: unitTheme.cardBg,
        borderColor: isComplete ? unitTheme.primaryColor : unitTheme.borderColor,
        boxShadow: isComplete 
          ? `0 8px 25px ${unitTheme.primaryColor}50` 
          : '0 4px 20px rgba(0,0,0,0.35)'
      }}
    >
      {/* Top Artwork Banner — Matches Flashcard Chapter Card */}
      <div 
        className="relative h-36 sm:h-46 rounded-xl overflow-hidden p-2.5 sm:p-3.5 flex flex-col justify-between border shadow-inner transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          background: unitTheme.bannerGradient
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

        {/* Centered Watermark Number with Translucent Depth */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span 
            className="text-4xl sm:text-7xl font-black tracking-tight font-sans transition-transform duration-300 group-hover:scale-105"
            style={{ color: unitTheme.watermarkColor }}
          >
            #{formattedIndex}
          </span>
        </div>

        {/* Top Row: CH # Badge and Marks Badge */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
          <span 
            className="border px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-black tracking-wider shadow-sm backdrop-blur-md text-white shrink-0"
            style={{ 
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.35)'
            }}
          >
            CH #{index + 1}
          </span>

          {/* MARKS Badge with Ribbon Award */}
          <div className="bg-white text-gray-950 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-xs font-black tracking-wide flex items-center gap-1 sm:gap-1.5 shadow-md shrink-0">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span>{getMarksDisplay()}</span>
          </div>
        </div>

        {/* Bottom Row: Priority and PYQs Count Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2 mt-auto">
          <span 
            className="border px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10.5px] font-bold tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm backdrop-blur-md text-white truncate max-w-[50%]"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
            <span className="truncate">{getPriorityText(chapter.pyqPriority)}</span>
          </span>

          <span 
            className="border px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10.5px] font-semibold tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm backdrop-blur-md text-white truncate max-w-[50%]"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90 shrink-0" />
            <span className="truncate">
              {solvedCount > 0 ? `${solvedCount}/${totalQuestions} Solved` : `${totalQuestions} PYQs`}
            </span>
          </span>
        </div>
      </div>

      {/* Card Body Section */}
      <div className="pt-2 sm:pt-3 pb-1 px-0.5 sm:px-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Chapter Title & Quick Complete Button */}
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1">
            <h3 
              className="font-extrabold text-xs sm:text-base text-white leading-snug line-clamp-1 flex-1 transition-colors group-hover:text-white/90"
              title={chapter.title}
            >
              {chapter.title}
            </h3>

            {onToggleComplete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(e);
                }}
                title={isComplete ? "Reset chapter progress" : "Mark chapter PYQs solved"}
                className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-sm"
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

          {/* Subtopics Preview */}
          <p className="text-[10px] sm:text-xs text-white/70 line-clamp-2 leading-relaxed">
            {chapter.topics && chapter.topics.length > 0 
              ? chapter.topics.map(t => t.title).join(', ') 
              : 'Previous year questions & solutions'}
          </p>
        </div>

        {/* Micro Progress Bar (when solved > 0) */}
        {percentage > 0 && (
          <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between gap-2.5">
            <div className="h-1.5 flex-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                }}
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] sm:text-[11px] font-black font-mono text-white">
              <span>{percentage}%</span>
              {accuracy !== null && <span className="text-white/60">({accuracy}% acc)</span>}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartPractice();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] font-extrabold transition-all shadow-sm active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Practice PYQs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
