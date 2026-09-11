import React from 'react';
import { SyllabusChapter, TopicProgress, ChapterProgress } from '../../types/syllabus';
import { Flame, BookOpen, Check, Award } from 'lucide-react';
import { getChapterUnitTheme } from '../../utils/flashcardUnitTheme';

interface ChapterCardViewProps {
  chapter: SyllabusChapter;
  progress: ChapterProgress;
  topicState: TopicProgress;
  onToggleTopic: (topicId: string) => void;
  index: number;
  onSelectChapter?: (chapterId: string) => void;
  subjectName?: string;
  exam?: string;
  isSpecialExam?: boolean;
}

export const ChapterCardView: React.FC<ChapterCardViewProps> = ({
  chapter,
  progress,
  topicState,
  onToggleTopic,
  index,
  onSelectChapter,
  subjectName = '',
  exam = 'NEET',
  isSpecialExam = false
}) => {
  const formattedIndex = (index + 1).toString().padStart(2, '0');
  const allCompleted = progress.isCompleted;
  const percentRounded = Math.round(progress.percentage);

  // Unit theme for NEET & JEE Main (Special category)
  const unitTheme = getChapterUnitTheme(chapter.title, subjectName, exam);

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'HIGH YIELD';
      case 'MEDIUM': return 'MODERATE';
      case 'LOW': return 'FOUNDATION';
      default: return 'STANDARD';
    }
  };

  const handleTickFullChapter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isCompleted = progress.completedTopics === progress.totalTopics;
    chapter.topics.forEach(topic => {
      const isTopicCompleted = !!topicState[topic.id];
      if (isCompleted && isTopicCompleted) {
        onToggleTopic(topic.id);
      } else if (!isCompleted && !isTopicCompleted) {
        onToggleTopic(topic.id);
      }
    });
  };

  const getMarksDisplay = () => {
    if (chapter.id === 'acc1') return '12 MARKS';
    if (chapter.id === 'acc2') return '14 MARKS';
    if (chapter.id === 'acc3') return '10 MARKS';
    if (chapter.id === 'acc4') return '8 MARKS';

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

  // If this is NEET / JEE section, use the exact vibrant unit colors matching Flashcards
  if (isSpecialExam) {
    return (
      <div 
        onClick={() => onSelectChapter?.(chapter.id)}
        className="group relative rounded-2xl p-3 cursor-pointer transition-all duration-200 border flex flex-col justify-between overflow-hidden shadow-sm"
        style={{
          backgroundColor: unitTheme.cardBg,
          borderColor: allCompleted ? unitTheme.primaryColor : 'rgba(255, 255, 255, 0.15)',
          boxShadow: allCompleted ? unitTheme.glowShadow : 'none'
        }}
      >
        {/* Top Inner Artwork Banner with Unit Tint Gradient */}
        <div 
          className="relative h-36 sm:h-46 rounded-xl overflow-hidden p-2.5 sm:p-3.5 flex flex-col justify-between border"
          style={{
            borderColor: unitTheme.borderColor,
            background: unitTheme.bannerGradient
          }}
        >
          {/* Subtle Dot Matrix Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 1.2px, transparent 1.2px)',
              backgroundSize: '16px 16px',
              backgroundPosition: 'center'
            }}
          />

          {/* Centered Watermark Number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span 
              className="text-4xl sm:text-6xl font-black tracking-tight font-sans transition-transform group-hover:scale-105"
              style={{ color: unitTheme.watermarkColor }}
            >
              #{formattedIndex}
            </span>
          </div>

          {/* Top Row: CH # and MARKS Badge */}
          <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
            {/* Left: CH # Badge */}
            <span className="bg-black/35 border border-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-bold text-white tracking-wider shadow-sm backdrop-blur-md shrink-0">
              CH #{index + 1}
            </span>

            {/* Right: Solid White MARKS Badge */}
            <div className="bg-white text-gray-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-xs font-black tracking-wide flex items-center gap-1 sm:gap-1.5 shadow-sm shrink-0">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span>{getMarksDisplay()}</span>
            </div>
          </div>

          {/* Bottom Row: Priority and Topics Badges */}
          <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2 mt-auto">
            {/* Left: Priority Badge */}
            <span className="bg-black/35 border border-white/20 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10.5px] font-bold text-white tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm backdrop-blur-md truncate max-w-[48%]">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{getPriorityText(chapter.pyqPriority)}</span>
            </span>

            {/* Right: Topics Badge */}
            <span className="bg-black/35 border border-white/20 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10.5px] font-semibold text-white tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm backdrop-blur-md truncate max-w-[48%]">
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{progress.completedTopics}/{progress.totalTopics} Topics</span>
            </span>
          </div>
        </div>

        {/* Card Body Section */}
        <div className="pt-2 sm:pt-3 pb-1 px-0.5 sm:px-1 flex-1 flex flex-col justify-between">
          <div>
            {/* Chapter Title & Quick Complete Button */}
            <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1">
              <h3 
                className="font-bold text-xs sm:text-base text-white leading-snug line-clamp-1 flex-1 transition-colors"
                title={chapter.title}
              >
                {chapter.title}
              </h3>
              
              <button 
                onClick={handleTickFullChapter}
                title={allCompleted ? "Mark incomplete" : "Mark entire chapter completed"}
                className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center transition-all active:scale-95"
                style={{
                  borderColor: allCompleted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: allCompleted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
                  color: allCompleted ? '#000000' : 'transparent'
                }}
              >
                <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] ${allCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 text-white'}`} />
              </button>
            </div>

            {/* Subtopics Preview */}
            <p className="text-[10px] sm:text-xs text-white/70 line-clamp-2 leading-relaxed">
              {chapter.topics.map(t => t.title).join(', ')}
            </p>
          </div>

          {/* Micro Progress Bar (HIDDEN when progress is 0%) */}
          {percentRounded > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2.5">
              <div className="h-1.5 flex-1 bg-white/15 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${percentRounded}%`,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                  }}
                />
              </div>
              <span className="text-[11px] font-black font-mono shrink-0 text-white">
                {percentRounded}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback for regular School boards
  return (
    <div 
      onClick={() => onSelectChapter?.(chapter.id)}
      className={`group relative rounded-2xl p-3 cursor-pointer transition-all duration-200 border flex flex-col justify-between overflow-hidden bg-[#081F1B] ${
        allCompleted 
          ? 'border-[#8EB69B] shadow-sm' 
          : 'border-[#235347]/50 hover:border-[#8EB69B]/60 shadow-sm'
      }`}
    >
      {/* Top Inner Artwork Banner */}
      <div className="relative h-44 sm:h-46 rounded-xl overflow-hidden p-3.5 flex flex-col justify-between border border-[#235347]/60 bg-gradient-to-b from-[#163832] to-[#0B2B26]">
        {/* Subtle Sage Dot Matrix Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(142, 182, 155, 0.4) 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
            backgroundPosition: 'center'
          }}
        />

        {/* Centered Watermark Number */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-5xl sm:text-6xl font-black text-[#8EB69B]/15 tracking-tight font-sans">
            #{formattedIndex}
          </span>
        </div>

        {/* Top Row: CH # and MARKS Badge */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="bg-[#0B2B26]/90 border border-[#235347] px-3 py-1 rounded-full text-[11px] font-semibold text-[#8EB69B] tracking-wider shadow-sm">
            CH #{index + 1}
          </span>

          <div className="bg-[#8EB69B] text-[#0B2B26] px-3 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{getMarksDisplay()}</span>
          </div>
        </div>

        {/* Bottom Row: Priority and Topics Badges */}
        <div className="relative z-10 flex items-center justify-between gap-2 mt-auto">
          <span className="bg-[#235347]/70 border border-[#8EB69B]/30 text-[#8EB69B] px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#8EB69B]" />
            {getPriorityText(chapter.pyqPriority)}
          </span>

          <span className="bg-[#0B2B26]/90 border border-[#235347] text-[#8EB69B]/80 px-3 py-1 rounded-full text-[10.5px] font-medium flex items-center gap-1.5 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#8EB69B]/60" />
            <span>{progress.completedTopics}/{progress.totalTopics} Topics</span>
          </span>
        </div>
      </div>

      {/* Card Body Section */}
      <div className="pt-3 pb-1 px-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Chapter Title & Quick Complete Button */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base text-white leading-snug line-clamp-1 flex-1 group-hover:text-[#8EB69B] transition-colors">
              {chapter.title}
            </h3>
            
            <button 
              onClick={handleTickFullChapter}
              title={allCompleted ? "Mark incomplete" : "Mark entire chapter completed"}
              className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                allCompleted 
                ? 'bg-[#8EB69B] border-[#8EB69B] text-[#0B2B26]' 
                : 'border-[#235347] text-transparent hover:border-[#8EB69B] hover:text-[#8EB69B] hover:bg-[#235347]/30 active:scale-95'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Subtopics Preview */}
          <p className="text-xs text-[#8EB69B]/70 line-clamp-2 leading-relaxed">
            {chapter.topics.map(t => t.title).join(', ')}
          </p>
        </div>

        {/* Micro Progress Bar (HIDDEN when progress is 0%) */}
        {percentRounded > 0 && (
          <div className="mt-2.5 pt-2 border-t border-[#235347]/40 flex items-center justify-between gap-2">
            <div className="h-1 flex-1 bg-[#163832] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8EB69B] rounded-full transition-all duration-300"
                style={{ width: `${percentRounded}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-[#8EB69B] font-mono">
              {percentRounded}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
