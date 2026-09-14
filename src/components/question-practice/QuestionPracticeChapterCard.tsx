import React from 'react';
import { SyllabusChapter } from '../../types/syllabus';
import { ChapterPracticeProgress } from '../../types/questionPractice';
import { Flame, Award, BookOpen, Check, Play, CheckCircle2 } from 'lucide-react';
import { getChapterUnitTheme } from '../../utils/flashcardUnitTheme';

interface QuestionPracticeChapterCardProps {
  chapter: SyllabusChapter;
  index: number;
  totalQuestions: number;
  progress?: ChapterPracticeProgress;
  subjectName?: string;
  exam?: 'neet' | 'jee';
  onStartPractice: () => void;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

export const QuestionPracticeChapterCard: React.FC<QuestionPracticeChapterCardProps> = ({
  chapter,
  index,
  totalQuestions,
  progress,
  subjectName = 'Biology',
  exam = 'neet',
  onStartPractice,
  onToggleComplete
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
    const weights = [12, 16, 8, 14, 10, 12, 8, 10];
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
      {/* Top Artwork Banner — Flashcard aesthetic tailored for Question Practice */}
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
            className="text-5xl sm:text-7xl font-black tracking-tight font-sans transition-transform duration-300 group-hover:scale-105"
            style={{ color: unitTheme.watermarkColor }}
          >
            #{formattedIndex}
          </span>
        </div>

        {/* Top Badges Row */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
          {/* Priority Pill */}
          <div 
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider flex items-center gap-1 shadow-sm uppercase backdrop-blur-md"
            style={{
              background: unitTheme.badgeBg,
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
            <span className="truncate">{getPriorityText(chapter.pyqPriority)}</span>
          </div>

          {/* Marks Pill */}
          <div 
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider flex items-center gap-1 shadow-sm uppercase backdrop-blur-md"
            style={{
              background: unitTheme.badgeBg,
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Award className="w-3 h-3 text-emerald-300 shrink-0" />
            <span>{getMarksDisplay()}</span>
          </div>
        </div>

        {/* Bottom Banner Row: Unit Category and Question Count Pill */}
        <div className="relative z-10 flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 truncate drop-shadow-sm">
              {subjectName} · Core Practice
            </span>
            <span className="text-[11px] sm:text-xs font-extrabold text-white truncate drop-shadow-md">
              NCERT Question Bank
            </span>
          </div>

          <div 
            className="px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 flex items-center gap-1.5 shadow-sm backdrop-blur-md"
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
            <span>{totalQuestions} Qs</span>
          </div>
        </div>
      </div>

      {/* Chapter Information Body */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight line-clamp-2 leading-snug group-hover:text-amber-200 transition-colors">
            {chapter.title}
          </h4>

          {/* Key Topics Sub-bar */}
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="truncate">
              {chapter.topics && chapter.topics.length > 0
                ? `${chapter.topics.length} Key Subtopics · NCERT Exemplar`
                : 'Full Syllabus Practice Bank'}
            </span>
          </div>
        </div>

        {/* Progress & Accuracy Stats */}
        <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-medium">
              {solvedCount} of {totalQuestions} Solved
            </span>
            {accuracy !== null && (
              <span className="font-mono font-bold text-emerald-400">
                {accuracy}% Accuracy
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
                background: unitTheme.bannerGradient,
                boxShadow: percentage > 0 ? `0 0 8px ${unitTheme.primaryColor}` : 'none'
              }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartPractice();
            }}
            className="flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.25)'
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>Practice Questions</span>
          </button>

          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              title={isComplete ? "Mark as Incomplete" : "Mark as Completed"}
              className={`p-2 rounded-xl border transition-all active:scale-90 ${
                isComplete 
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/30' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
