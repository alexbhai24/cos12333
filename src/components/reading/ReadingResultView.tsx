import React, { useState } from 'react';
import { ReadingPassage } from '../../data/biology/readingPassagesData';
import { 
  CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen, 
  Zap, Award, TrendingUp, Sparkles, ChevronDown, Check, X
} from 'lucide-react';

interface ReadingResultViewProps {
  passage: ReadingPassage;
  readingTimeSeconds: number;
  readingWpm: number;
  correctCount: number;
  totalCount: number;
  accuracyPercentage: number;
  overallScore: number;
  onRetryLevel: () => void;
  onNextLevel: () => void;
  onBackToTopics: () => void;
}

export const ReadingResultView: React.FC<ReadingResultViewProps> = ({
  passage,
  readingTimeSeconds,
  readingWpm,
  correctCount,
  totalCount,
  accuracyPercentage,
  overallScore,
  onRetryLevel,
  onNextLevel,
  onBackToTopics
}) => {
  const [showReview, setShowReview] = useState(false);

  // Speed rating
  const getSpeedRating = (wpm: number) => {
    if (wpm >= 200) return { label: 'Excellent ⚡', color: 'text-cyan-300' };
    if (wpm >= 160) return { label: 'Good 🚀', color: 'text-emerald-300' };
    if (wpm >= 120) return { label: 'Moderate ⏱️', color: 'text-amber-300' };
    return { label: 'Developing 📈', color: 'text-rose-300' };
  };

  // Understanding rating
  const getUnderstandingRating = (acc: number) => {
    if (acc >= 90) return { label: 'Mastery 🧠', color: 'text-emerald-300' };
    if (acc >= 75) return { label: 'Strong ✨', color: 'text-cyan-300' };
    if (acc >= 60) return { label: 'Developing 📚', color: 'text-amber-300' };
    return { label: 'Needs Re-read ⚠️', color: 'text-rose-300' };
  };

  // Diagnostic feedback quote
  const getDiagnosticMessage = (wpm: number, acc: number) => {
    if (wpm >= 160 && acc >= 80) {
      return 'FAST + ACCURATE = OPTIMAL! Your comprehension stayed exceptionally strong while maintaining high reading velocity.';
    }
    if (wpm < 150 && acc >= 80) {
      return 'SLOW + ACCURATE = IMPROVING. Your understanding is rock solid! Now push your pacing slightly to save valuable minutes.';
    }
    if (wpm >= 170 && acc < 70) {
      return 'FAST + WRONG = CAUTION. You read quickly, but missed critical biological keywords and qualifying terms. Slow down to absorb detail.';
    }
    return 'Good practice effort! Review the question explanations below to anchor these NCERT concepts before attempting the next level.';
  };

  const speedRating = getSpeedRating(readingWpm);
  const understandingRating = getUnderstandingRating(accuracyPercentage);
  const diagMessage = getDiagnosticMessage(readingWpm, accuracyPercentage);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-16">
      {/* Session Complete Card */}
      <div 
        className="rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1226 0%, #080b16 100%)',
          borderColor: accuracyPercentage >= 70 ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Glow */}
        <div 
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-25 pointer-events-none"
          style={{ backgroundColor: accuracyPercentage >= 80 ? '#00f0ff' : '#f59e0b' }}
        />

        {/* Celebration Header */}
        <div className="text-center space-y-1 relative z-10 pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/10 text-cyan-300 border border-white/15 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SESSION COMPLETE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {passage.chapterTitle}
          </h2>
          <p className="text-sm font-semibold text-gray-400">
            {passage.topicTitle} · <span className="text-cyan-400">{passage.levelName}</span>
          </p>
        </div>

        {/* 3 Core Metric Dials */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 py-6 relative z-10">
          {/* Reading Speed */}
          <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Reading Speed
            </span>
            <p className="text-xl sm:text-3xl font-black text-cyan-300 font-mono">
              {readingWpm}
            </p>
            <span className="text-[10px] font-mono text-gray-400 block">WPM</span>
          </div>

          {/* Comprehension Accuracy */}
          <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Comprehension
            </span>
            <p className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">
              {accuracyPercentage}%
            </p>
            <span className="text-[10px] font-mono text-gray-400 block">
              {correctCount}/{totalCount} Correct
            </span>
          </div>

          {/* Overall Score */}
          <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-center space-y-1">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Overall Score
            </span>
            <p className="text-xl sm:text-3xl font-black text-amber-300 font-mono">
              {overallScore}%
            </p>
            <span className="text-[10px] font-mono text-gray-400 block">
              Time: {formatTime(readingTimeSeconds)}
            </span>
          </div>
        </div>

        {/* Diagnostic Assessment Panel */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white/[0.03] border border-white/10 relative z-10 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Performance Breakdown:
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-gray-400">Pacing:</span>
              <strong className={speedRating.color}>{speedRating.label}</strong>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-gray-400">Recall:</span>
              <strong className={understandingRating.color}>{understandingRating.label}</strong>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 italic pt-1 border-t border-white/5 leading-relaxed">
            "{diagMessage}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 relative z-10">
          <button
            onClick={onRetryLevel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Level</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBackToTopics}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer"
            >
              All Topics
            </button>

            {passage.level < 5 && (
              <button
                onClick={onNextLevel}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-black text-black transition-all cursor-pointer shadow-lg active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00f0ff, #0066ff)',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
                }}
              >
                <span>Next Level ({passage.level + 1})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Questions Accordion Toggle */}
      <div className="rounded-2xl bg-[#0f1424] border border-white/10 overflow-hidden">
        <button
          onClick={() => setShowReview(prev => !prev)}
          className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Review Questions & NCERT Explanations ({correctCount}/{totalCount} Correct)</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showReview ? 'rotate-180' : ''}`} />
        </button>

        {showReview && (
          <div className="p-4 sm:p-6 border-t border-white/10 space-y-6 animate-in fade-in duration-200">
            {passage.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-cyan-400 uppercase">
                    Q{idx + 1} · {q.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {q.ncertRef}
                  </span>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed whitespace-pre-wrap">
                  {q.question}
                </p>

                {/* Option list with correct answer highlighted */}
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                          isCorrect
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-white/[0.02] border-white/5 text-gray-400'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                          isCorrect ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400'
                        }`}>
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-cyan-400/5 border border-cyan-400/20 text-xs text-gray-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>NCERT Explanation</span>
                  </div>
                  <p className="leading-relaxed text-gray-200">
                    {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
