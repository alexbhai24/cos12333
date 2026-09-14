import React from 'react';
import { ReadingTopic } from '../../data/biology/readingSyllabus';
import { TopicProgressRecord, LEVEL_UNLOCK_THRESHOLDS } from '../../hooks/useReadingPracticeStorage';
import { BookOpen, Zap, Award, ChevronRight, Lock, Check } from 'lucide-react';

interface ReadingTopicCardProps {
  topic: ReadingTopic;
  chapterTitle: string;
  index: number;
  progress: TopicProgressRecord | null;
  onSelectTopic: (topicId: string) => void;
}

// Visual accent palettes for topic cards
const TOPIC_ACCENTS = [
  { border: 'rgba(0, 240, 255, 0.3)', glow: 'rgba(0, 240, 255, 0.15)', badge: '#00f0ff' },
  { border: 'rgba(0, 215, 160, 0.3)', glow: 'rgba(0, 215, 160, 0.15)', badge: '#00d7a0' },
  { border: 'rgba(168, 85, 247, 0.3)', glow: 'rgba(168, 85, 247, 0.15)', badge: '#a855f7' },
  { border: 'rgba(245, 158, 11, 0.3)', glow: 'rgba(245, 158, 11, 0.15)', badge: '#f59e0b' },
  { border: 'rgba(239, 68, 68, 0.3)',  glow: 'rgba(239, 68, 68, 0.15)',  badge: '#ef4444' },
];

export const ReadingTopicCard: React.FC<ReadingTopicCardProps> = ({
  topic,
  chapterTitle,
  index,
  progress,
  onSelectTopic
}) => {
  const accent = TOPIC_ACCENTS[index % TOPIC_ACCENTS.length];
  const completedCount = progress?.completedLevels?.length || 0;
  const bestWpm = progress?.bestWpm || 0;
  const accuracy = progress?.avgAccuracy || 0;
  const isAllComplete = completedCount === 5;

  return (
    <div
      onClick={() => onSelectTopic(topic.id)}
      className="group relative rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-lg hover:translate-y-[-2px] bg-[#0c1020]/90 backdrop-blur-md select-none"
      style={{
        borderColor: isAllComplete ? '#10b981' : accent.border,
        boxShadow: `0 4px 20px ${accent.glow}`
      }}
    >
      {/* Glow orb */}
      <div 
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-35 transition-opacity"
        style={{ backgroundColor: accent.badge }}
      />

      <div className="relative z-10">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span 
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm"
            style={{ 
              backgroundColor: `${accent.badge}15`, 
              color: accent.badge,
              borderColor: `${accent.badge}40`
            }}
          >
            Topic {index + 1}
          </span>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(lvl => {
              const isDone = progress?.completedLevels?.includes(lvl);
              const isUnlocked = lvl === 1 || (progress && progress.unlockedLevel >= lvl);
              return (
                <div
                  key={lvl}
                  title={`Level ${lvl} (${isDone ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'})`}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : isUnlocked
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/20'
                  }`}
                >
                  {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : lvl}
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Title */}
        <h4 
          className="text-base sm:text-lg font-black text-white line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors"
          title={topic.title}
        >
          {topic.title}
        </h4>

        <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
          {chapterTitle}
        </p>
      </div>

      {/* Stats Block */}
      <div className="relative z-10 mt-4 pt-3 border-t border-white/10 space-y-3">
        {/* Progress indicators */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] text-[11px] font-medium">Progress</span>
          <span className="font-extrabold text-white font-mono">
            {completedCount} / 5 Levels
          </span>
        </div>

        {/* Mini 5-level segmented bar */}
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map(lvl => {
            const isDone = progress?.completedLevels?.includes(lvl);
            return (
              <div 
                key={lvl}
                className={`h-1.5 rounded-full transition-all ${
                  isDone ? 'bg-emerald-400 shadow-sm' : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>

        {/* Speed & Accuracy Row */}
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-0.5">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Best WPM: <strong className="text-white font-mono">{bestWpm > 0 ? bestWpm : '—'}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Accuracy: <strong className="text-white font-mono">{accuracy > 0 ? `${accuracy}%` : '—'}</strong></span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black text-white bg-white/5 hover:bg-white/10 border border-white/10 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/15 group-hover:text-[var(--color-primary)] transition-all cursor-pointer"
        >
          <span>{completedCount > 0 ? 'Continue Levels' : 'Start Level 1'}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
