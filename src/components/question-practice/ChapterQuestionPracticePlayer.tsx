import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SyllabusChapter } from '../../types/syllabus';
import { PracticeQuestion, ChapterPracticeProgress } from '../../types/questionPractice';
import { getChapterUnitTheme } from '../../utils/flashcardUnitTheme';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Check, X, RotateCcw,
  Sparkles, Bookmark, AlertCircle, Trophy, BookOpen, Flame, Award,
  CheckCircle2, XCircle, Home, Layers, HelpCircle, Eye, EyeOff
} from 'lucide-react';

interface ChapterQuestionPracticePlayerProps {
  chapter: SyllabusChapter;
  chapterIndex: number;
  subjectName: string;
  exam: 'NEET' | 'JEE';
  questions: PracticeQuestion[];
  progress?: ChapterPracticeProgress;
  bookmarkedIds: string[];
  onRecordAnswer: (questionId: string, selectedOption: number, isCorrect: boolean, totalQuestions: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onResetChapter: (chapterId: string) => void;
  onBack: () => void;
  nextChapter?: SyllabusChapter | null;
  onNextChapter?: () => void;
  onGoHome: () => void;
}

type FilterMode = 'all' | 'unsolved' | 'incorrect' | 'bookmarked';

export const ChapterQuestionPracticePlayer: React.FC<ChapterQuestionPracticePlayerProps> = ({
  chapter,
  chapterIndex,
  subjectName,
  exam,
  questions,
  progress,
  bookmarkedIds,
  onRecordAnswer,
  onToggleBookmark,
  onResetChapter,
  onBack,
  nextChapter,
  onNextChapter,
  onGoHome
}) => {
  const { showNotification } = useApp();
  const unitTheme = getChapterUnitTheme(chapter.title, subjectName, exam);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [showHint, setShowHint] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Active answer map from progress
  const answers = progress?.answers || {};

  // Filtered question set
  const filteredQuestions = useMemo(() => {
    switch (filterMode) {
      case 'unsolved':
        return questions.filter(q => !answers[q.id]);
      case 'incorrect':
        return questions.filter(q => answers[q.id] && !answers[q.id].isCorrect);
      case 'bookmarked':
        return questions.filter(q => bookmarkedIds.includes(q.id));
      default:
        return questions;
    }
  }, [questions, filterMode, answers, bookmarkedIds]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(Math.max(0, filteredQuestions.length - 1));
    }
  }, [filteredQuestions.length, currentIndex]);

  // Reset hint state on question change
  useEffect(() => {
    setShowHint(false);
  }, [currentIndex, filterMode]);

  const activeQuestion = filteredQuestions[currentIndex] || questions[0];
  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const isAnswered = activeAnswer !== undefined;
  const isBookmarked = activeQuestion ? bookmarkedIds.includes(activeQuestion.id) : false;

  // Handle Option Click
  const handleSelectOption = (optIndex: number) => {
    if (isAnswered || !activeQuestion) return;
    const isCorrect = optIndex === activeQuestion.correctOptionIndex;
    onRecordAnswer(activeQuestion.id, optIndex, isCorrect, questions.length);

    if (isCorrect) {
      // If last question, show summary modal
      if (currentIndex === filteredQuestions.length - 1 && progress?.solvedCount && progress.solvedCount + 1 >= questions.length) {
        setTimeout(() => setShowSummaryModal(true), 800);
      }
    }
  };

  // Add to Mistake Tracker
  const handleSaveToMistakeTracker = () => {
    if (!activeQuestion) return;
    try {
      const stored = localStorage.getItem('cosmicbone_mistakes');
      const list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `m_${Date.now()}`,
        topic: `${chapter.title} : ${activeQuestion.tag}`,
        subject: subjectName,
        errorType: 'Conceptual Error',
        notes: `Question: ${activeQuestion.questionText}\nCorrect: Option (${activeQuestion.correctOptionIndex + 1}) - ${activeQuestion.options[activeQuestion.correctOptionIndex]}`,
        date: new Date().toISOString().split('T')[0],
        resolved: false
      };
      localStorage.setItem('cosmicbone_mistakes', JSON.stringify([newEntry, ...list]));
      showNotification('Question logged to Mistake Tracker!');
    } catch {
      showNotification('Logged to Mistake Tracker!');
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    Object.values(answers).forEach(ans => {
      if (ans.isCorrect) correct++;
      else incorrect++;
    });
    const totalAttempted = correct + incorrect;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    return { correct, incorrect, totalAttempted, accuracy };
  }, [answers]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-2xl shadow-sm">
        {/* Breadcrumb Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Chapters</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
              {subjectName} · Chapter {(chapterIndex + 1).toString().padStart(2, '0')}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-md">
              {chapter.title}
            </h2>
          </div>
        </div>

        {/* Action Controls Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Accuracy Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>{stats.accuracy}% Accuracy</span>
          </div>

          {/* Next Chapter Button */}
          {nextChapter && onNextChapter && (
            <button
              onClick={onNextChapter}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-colors"
            >
              <span>Next Ch.</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Bar & Progress Strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
              filterMode === 'all'
                ? 'bg-[var(--color-primary)] text-black border-[var(--color-primary)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white'
            }`}
          >
            All ({questions.length})
          </button>

          <button
            onClick={() => setFilterMode('unsolved')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
              filterMode === 'unsolved'
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white'
            }`}
          >
            Unsolved ({Math.max(0, questions.length - stats.totalAttempted)})
          </button>

          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
              filterMode === 'incorrect'
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white'
            }`}
          >
            Incorrect ({stats.incorrect})
          </button>

          <button
            onClick={() => setFilterMode('bookmarked')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
              filterMode === 'bookmarked'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white'
            }`}
          >
            Bookmarked ({bookmarkedIds.filter(id => questions.some(q => q.id === id)).length})
          </button>
        </div>

        {/* Quick Palette Jump Drawer Trigger */}
        <button
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Question Grid</span>
        </button>
      </div>

      {/* ── Question Navigation Grid (Toggled) ── */}
      {isPaletteOpen && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-2xl shadow-md animate-in fade-in zoom-in-95 duration-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Jump to Question:</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Correct</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Incorrect</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span> Unsolved</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              let bg = 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30';
              if (ans?.isCorrect) bg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold';
              else if (ans && !ans.isCorrect) bg = 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold';

              const isCurrent = activeQuestion?.id === q.id;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    const matchIdx = filteredQuestions.findIndex(fq => fq.id === q.id);
                    if (matchIdx !== -1) {
                      setCurrentIndex(matchIdx);
                    } else {
                      setFilterMode('all');
                      setCurrentIndex(idx);
                    }
                    setIsPaletteOpen(false);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-mono border flex items-center justify-center transition-all ${bg} ${
                    isCurrent ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-black scale-110' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty Filter State ── */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No questions match this filter</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
            {filterMode === 'incorrect' ? 'Great work! You have no incorrect answers in this chapter.' : 'Select another filter above.'}
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--color-primary)] text-black"
          >
            View All Questions
          </button>
        </div>
      ) : (
        /* ── Main Interactive Question Card ── */
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xl">
          
          {/* Card Meta Bar */}
          <div className="bg-white/[0.02] border-b border-[var(--border-color)] px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-extrabold text-white text-sm">
                Q {currentIndex + 1} <span className="text-gray-500 font-normal">/ {filteredQuestions.length}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase">
                {activeQuestion.qType.replace('_', ' ')}
              </span>

              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full font-medium text-[10px] bg-white/5 text-gray-300 border border-white/10">
                {activeQuestion.tag}
              </span>
            </div>

            {/* Hint & Bookmark Icons */}
            <div className="flex items-center gap-2">
              {activeQuestion.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  title="Toggle Hint"
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    showHint ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hint</span>
                </button>
              )}

              <button
                onClick={() => onToggleBookmark(activeQuestion.id)}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Hint Dropdown */}
          {showHint && activeQuestion.hint && (
            <div className="bg-amber-950/30 border-b border-amber-500/20 px-5 sm:px-6 py-3 text-xs text-amber-200 flex items-start gap-2 animate-in slide-in-from-top-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Hint:</strong> {activeQuestion.hint}</span>
            </div>
          )}

          {/* Question Text Body */}
          <div className="p-5 sm:p-8 space-y-6">
            <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {activeQuestion.questionText}
            </div>

            {/* Special Type 1: Statements I & II */}
            {activeQuestion.qType === 'statement' && activeQuestion.statementA && activeQuestion.statementB && (
              <div className="space-y-3 max-w-3xl">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Statement I:</span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{activeQuestion.statementA}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Statement II:</span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{activeQuestion.statementB}</p>
                </div>
              </div>
            )}

            {/* Special Type 2: Assertion & Reason */}
            {activeQuestion.qType === 'assertion_reason' && activeQuestion.assertion && activeQuestion.reason && (
              <div className="space-y-3 max-w-3xl">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Assertion (A):</span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{activeQuestion.assertion}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Reason (R):</span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{activeQuestion.reason}</p>
                </div>
              </div>
            )}

            {/* Special Type 3: Match The Columns */}
            {activeQuestion.qType === 'match' && activeQuestion.matchLeft && activeQuestion.matchRight && (
              <div className="border border-white/10 rounded-xl overflow-hidden max-w-2xl bg-white/5">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 w-1/2">List - I</th>
                      <th className="p-3 w-1/2 border-l border-white/10">List - II</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeQuestion.matchLeft.map((leftItem, i) => (
                      <tr key={i}>
                        <td className="p-3 text-gray-200">
                          <strong className="text-indigo-400 font-mono mr-2">{['A', 'B', 'C', 'D'][i]}.</strong>
                          {leftItem}
                        </td>
                        <td className="p-3 text-gray-200 border-l border-white/10">
                          <strong className="text-emerald-400 font-mono mr-2">{['I', 'II', 'III', 'IV'][i]}.</strong>
                          {activeQuestion.matchRight?.[i]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Options Choices (A, B, C, D) */}
            <div className="space-y-3 pt-2 max-w-3xl">
              {activeQuestion.options.map((optionText, optIdx) => {
                const isSelected = activeAnswer?.selectedOption === optIdx;
                const isCorrectOption = optIdx === activeQuestion.correctOptionIndex;

                let borderStyle = 'border-white/10 hover:border-white/30 bg-white/[0.02]';
                let indicatorColor = 'border-white/30 text-gray-400';

                if (isAnswered) {
                  if (isCorrectOption) {
                    borderStyle = 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500';
                    indicatorColor = 'border-emerald-500 bg-emerald-500 text-black font-bold';
                  } else if (isSelected && !activeAnswer.isCorrect) {
                    borderStyle = 'border-rose-500 bg-rose-950/40 ring-1 ring-rose-500';
                    indicatorColor = 'border-rose-500 bg-rose-500 text-white font-bold';
                  } else {
                    borderStyle = 'opacity-50 border-white/5 bg-white/[0.01]';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`w-full text-left flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all ${borderStyle} ${
                      !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-mono transition-colors ${indicatorColor}`}>
                      {['A', 'B', 'C', 'D'][optIdx]}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm text-gray-200 leading-relaxed pt-0.5">
                      {optionText}
                    </div>
                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !activeAnswer.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Instant Explanation & Solution Card (Reveals Once Answered) ── */}
            {isAnswered && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeAnswer.isCorrect ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Correct (+4 Marks)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Incorrect (-1 Mark)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSaveToMistakeTracker}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1 cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Log to Mistake Tracker</span>
                  </button>
                </div>

                {/* Explanation Content */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    NCERT Detailed Explanation
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {activeQuestion.explanation}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* ── Bottom Controls ── */}
          <div className="bg-white/[0.02] border-t border-[var(--border-color)] p-4 sm:px-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 border border-white/10 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => onResetChapter(chapter.id)}
              title="Reset All Answers in this Chapter"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (currentIndex < filteredQuestions.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setShowSummaryModal(true);
                }
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--color-primary)] hover:opacity-90 text-black shadow-md transition-all flex items-center gap-1"
            >
              <span>{currentIndex === filteredQuestions.length - 1 ? 'Finish Practice' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ── Practice Completion Summary Modal ── */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface-solid)] border border-white/10 rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Chapter Practice Completed!</h3>
              <p className="text-xs text-gray-400">{chapter.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 text-xs font-mono">
              <div>
                <span className="text-gray-400 text-[10px] block">Attempted</span>
                <span className="text-lg font-bold text-white">{stats.totalAttempted}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Correct</span>
                <span className="text-lg font-bold text-emerald-400">{stats.correct}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Accuracy</span>
                <span className="text-lg font-bold text-[var(--color-primary)]">{stats.accuracy}%</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {nextChapter && onNextChapter && (
                <button
                  onClick={() => {
                    setShowSummaryModal(false);
                    onNextChapter();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-[var(--color-primary)] text-black shadow transition-all"
                >
                  Continue to Next Chapter &rarr;
                </button>
              )}

              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
              >
                Return to Chapters List
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
