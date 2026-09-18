import React from 'react';
import { READING_LEVELS, ReadingLevelInfo } from '../../data/biology/readingPassagesData';
import { TopicProgressRecord, LEVEL_UNLOCK_THRESHOLDS } from '../../hooks/useReadingPracticeStorage';
import { Lock, Check, Zap, Award, ArrowRight, ArrowLeft, Clock, FileText, Sparkles } from 'lucide-react';

interface ReadingLevelSelectorProps {
  chapterTitle: string;
  topicTitle: string;
  classNum: 11 | 12;
  progress: TopicProgressRecord | null;
  onSelectLevel: (level: 1 | 2 | 3 | 4 | 5) => void;
  onBackToTopics: () => void;
}

export const ReadingLevelSelector: React.FC<ReadingLevelSelectorProps> = ({
  chapterTitle,
  topicTitle,
  classNum,
  progress,
  onSelectLevel,
  onBackToTopics
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <button
            onClick={onBackToTopics}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Topics ({chapterTitle})</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full uppercase bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
              Class {classNum} Biology
            </span>
            <span className="text-xs text-gray-400">5-Tier Training Track</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {topicTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Select a reading comprehension level. Progress from Foundation to the NEET Challenge tier.
          </p>
        </div>

        {/* Topic Overall Badges */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="text-center px-3 border-r border-white/10">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Best Speed</p>
            <p className="text-base font-black text-cyan-400 font-mono">
              {progress?.bestWpm ? `${progress.bestWpm} WPM` : '—'}
            </p>
          </div>
          <div className="text-center px-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Accuracy</p>
            <p className="text-base font-black text-amber-400 font-mono">
              {progress?.avgAccuracy ? `${progress.avgAccuracy}%` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Levels Cards Grid */}
      <div className="space-y-3.5">
        {READING_LEVELS.map(lvl => {
          const isDone = progress?.completedLevels?.includes(lvl.level);
          const isUnlocked = lvl.level === 1 || (progress && progress.unlockedLevel >= lvl.level);
          const attempts = progress?.attemptsByLevel[lvl.level] || [];
          const bestAttempt = attempts.length > 0 
            ? attempts.reduce((prev, curr) => (curr.overallScore > prev.overallScore ? curr : prev), attempts[0])
            : null;

          const requiredAcc = LEVEL_UNLOCK_THRESHOLDS[lvl.level] || 0;

          return (
            <div
              key={lvl.level}
              onClick={() => isUnlocked && onSelectLevel(lvl.level)}
              className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isUnlocked
                  ? 'bg-[#0f1424]/90 hover:border-white/40 hover:scale-[1.005] cursor-pointer shadow-lg'
                  : 'bg-white/[0.02] border-white/5 opacity-60 cursor-not-allowed'
              }`}
              style={{
                borderColor: isDone 
                  ? '#10b981' 
                  : isUnlocked 
                  ? `${lvl.color}50` 
                  : 'rgba(255,255,255,0.06)',
                boxShadow: isUnlocked ? `0 4px 20px ${lvl.color}15` : 'none'
              }}
            >
              {/* Level Info Column */}
              <div className="flex items-start gap-4 flex-1">
                {/* Level Circle Badge */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border text-base font-black shadow-md ${
                    isDone 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : isUnlocked 
                      ? 'text-white border-white/20' 
                      : 'bg-white/5 text-white/30 border-white/5'
                  }`}
                  style={{
                    backgroundColor: isUnlocked ? `${lvl.color}20` : undefined,
                    color: isUnlocked ? lvl.color : undefined,
                    borderColor: isUnlocked ? `${lvl.color}40` : undefined
                  }}
                >
                  {isDone ? <Check className="w-6 h-6 stroke-[3] text-emerald-400" /> : lvl.level}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span 
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${lvl.color}15`,
                        color: lvl.color,
                        borderColor: `${lvl.color}35`
                      }}
                    >
                      {lvl.tag} · {lvl.name}
                    </span>

                    {isDone && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        COMPLETED
                      </span>
                    )}

                    {!isUnlocked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Requires Level {lvl.level - 1} ≥ {requiredAcc}% Acc
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white">
                    {lvl.name} Tier
                  </h3>

                  <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                    {lvl.subtitle}
                  </p>
                </div>
              </div>

              {/* Best Stats & Action Column */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                {bestAttempt ? (
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-sans">Speed</span>
                      <span className="font-black text-cyan-400">{bestAttempt.wpm} WPM</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-sans">Acc</span>
                      <span className="font-black text-amber-400">{bestAttempt.accuracyPercentage}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-sans">Score</span>
                      <span className="font-black text-emerald-400">{bestAttempt.overallScore}%</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {isUnlocked ? 'Not attempted yet' : 'Locked'}
                  </span>
                )}

                <button
                  disabled={!isUnlocked}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                    isUnlocked
                      ? 'bg-white text-black hover:bg-[var(--color-primary)] hover:text-black cursor-pointer active:scale-95'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span>{isDone ? 'Re-Read' : 'Start Level'}</span>
                  {isUnlocked ? <ArrowRight className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
