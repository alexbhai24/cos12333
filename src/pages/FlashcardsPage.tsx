import React, { useState, useMemo, useEffect } from 'react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import { getChapterFlashcards } from '../data/flashcardsDatabase';
import { useFlashcardStorage } from '../hooks/useFlashcardStorage';
import { FlashcardChapterCard } from '../components/flashcards/FlashcardChapterCard';
import { ChapterFlashcardDeckView } from '../components/flashcards/ChapterFlashcardDeckView';
import { SyllabusChapter, SyllabusSubject } from '../types/syllabus';
import { useApp } from '../context/AppContext';
import { 
  Search, Flame, Atom, BookOpen, RotateCcw, Check, Plus, Sparkles, Layers
} from 'lucide-react';
import { getChapterUnitTheme } from '../utils/flashcardUnitTheme';

type ExamType = 'neet' | 'jee';

export const FlashcardsPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  // Exam selector: Exclusively NEET & JEE Main (No school boards)
  const [selectedExam, setSelectedExam] = useState<ExamType>('neet');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active syllabus dataset
  const currentSyllabus = selectedExam === 'neet' ? syllabusNEET : syllabusJEE;
  const validSubjects = useMemo(() => {
    return (currentSyllabus?.subjects || []).filter(Boolean);
  }, [currentSyllabus]);

  // Flashcards storage hook
  const {
    progressMap,
    markMastered,
    markReview,
    toggleMastered,
    resetChapterMastery,
    resetSubjectMastery,
    getChapterCardStats,
    getSubjectOverallStats
  } = useFlashcardStorage(selectedExam);

  // Auto-select first subject on exam change
  useEffect(() => {
    if (validSubjects.length > 0) {
      setActiveSubjectId(validSubjects[0].id);
    } else {
      setActiveSubjectId(null);
    }
    setSelectedChapterId(null);
  }, [selectedExam, validSubjects]);

  // Reset selected chapter when subject changes
  useEffect(() => {
    setSelectedChapterId(null);
  }, [activeSubjectId]);

  const activeSubject: SyllabusSubject | undefined = useMemo(() => {
    return validSubjects.find(s => s.id === activeSubjectId) || validSubjects[0];
  }, [validSubjects, activeSubjectId]);

  const examLabel = selectedExam === 'neet' ? 'NEET (UG)' : 'JEE Main';
  const cleanSubjectName = useMemo(() => {
    if (!activeSubject) return '';
    return activeSubject.name.replace(/\s*\(Theory:.*?\)/gi, '').replace(/\s*\(.*Marks\)/gi, '').trim();
  }, [activeSubject]);

  // Search filter
  const filteredChapters = useMemo(() => {
    if (!activeSubject || !Array.isArray(activeSubject.chapters)) return [];
    if (!searchQuery.trim()) return activeSubject.chapters;

    const lowerQ = searchQuery.toLowerCase();
    return activeSubject.chapters.filter(ch => {
      const matchTitle = (ch.title || '').toLowerCase().includes(lowerQ);
      const matchTopic = (ch.topics || []).some(t => (t.title || '').toLowerCase().includes(lowerQ));
      return matchTitle || matchTopic;
    });
  }, [activeSubject, searchQuery]);

  // Subject overall flashcard stats
  const subjectStats = useMemo(() => {
    if (!activeSubject || !Array.isArray(activeSubject.chapters)) {
      return { totalCards: 0, masteredCards: 0, completedChapters: 0, totalChapters: 0, percentage: 0, allCardIds: [] };
    }
    return getSubjectOverallStats(
      activeSubject.chapters,
      cleanSubjectName,
      selectedExam === 'neet' ? 'NEET' : 'JEE'
    );
  }, [activeSubject, cleanSubjectName, selectedExam, getSubjectOverallStats]);

  // Selected Chapter for interactive Flashcard Player
  const selectedChapter = useMemo(() => {
    if (!selectedChapterId || !activeSubject) return null;
    return (activeSubject.chapters || []).find(c => c.id === selectedChapterId) || null;
  }, [selectedChapterId, activeSubject]);

  const selectedChapterIndex = useMemo(() => {
    if (!selectedChapter || !activeSubject) return 0;
    return (activeSubject.chapters || []).findIndex(c => c.id === selectedChapter.id);
  }, [selectedChapter, activeSubject]);

  const selectedChapterCards = useMemo(() => {
    if (!selectedChapter) return [];
    return getChapterFlashcards(
      selectedChapter,
      cleanSubjectName,
      selectedExam === 'neet' ? 'NEET' : 'JEE'
    );
  }, [selectedChapter, cleanSubjectName, selectedExam]);

  // Toggle all cards in a chapter
  const handleToggleChapterMastery = (chapter: SyllabusChapter) => {
    const cards = getChapterFlashcards(
      chapter,
      cleanSubjectName,
      selectedExam === 'neet' ? 'NEET' : 'JEE'
    );
    const stats = getChapterCardStats(cards);
    if (stats.isComplete) {
      resetChapterMastery(cards.map(c => c.id));
    } else {
      cards.forEach(c => markMastered(c.id));
    }
  };

  const nextChapter = useMemo(() => {
    if (!activeSubject || !selectedChapterId) return null;
    const chapters = activeSubject.chapters || [];
    const idx = chapters.findIndex(c => c.id === selectedChapterId);
    if (idx >= 0 && idx + 1 < chapters.length) {
      return chapters[idx + 1];
    }
    return null;
  }, [activeSubject, selectedChapterId]);

  // If a chapter is selected, show the full Interactive Flashcard Deck View!
  if (selectedChapter) {
    return (
      <ChapterFlashcardDeckView
        chapter={selectedChapter}
        chapterIndex={selectedChapterIndex}
        subjectName={cleanSubjectName}
        exam={selectedExam === 'neet' ? 'NEET' : 'JEE'}
        cards={selectedChapterCards}
        progressMap={progressMap}
        onMarkMastered={markMastered}
        onMarkReview={markReview}
        onResetChapter={resetChapterMastery}
        onBack={() => setSelectedChapterId(null)}
        nextChapter={nextChapter}
        onNextChapter={() => {
          if (nextChapter) setSelectedChapterId(nextChapter.id);
        }}
        onGoHome={() => setCurrentRoute('home')}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Control Bar: Search + Exam Selector (Exclusively NEET & JEE Main) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Global Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, formulas, concepts, or PYQ flashcards..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
          />
        </div>

        {/* Exam Mode Toggle: Exclusively NEET & JEE Main (No School Boards) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedExam('neet')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all ${
              selectedExam === 'neet'
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>NEET (UG)</span>
          </button>

          <button
            onClick={() => setSelectedExam('jee')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all ${
              selectedExam === 'jee'
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)]'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>JEE Main</span>
          </button>
        </div>
      </div>

      {/* Subject Pills Row */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 mb-6 border-b border-[var(--border-color)]">
        <div className="px-3 py-1.5 shrink-0 flex items-center justify-center bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-color)]">
          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
        {validSubjects.map(subject => {
          const cleanName = subject.name.replace(/\s*\(Theory:.*?\)/gi, '').replace(/\s*\(.*Marks\)/gi, '').trim();
          const isActive = activeSubjectId === subject.id;
          return (
            <button
              key={subject.id}
              onClick={() => setActiveSubjectId(subject.id)}
              className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                isActive
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cleanName}
            </button>
          );
        })}
      </div>

      {/* Sticky Progress Bar (Identical to Syllabus Tracker design) */}
      {activeSubject && (
        <div className="sticky top-[72px] z-20 mb-5 pt-2">
          <div className="relative overflow-hidden bg-transparent border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-none">
            {/* Background glowing ambient light */}
            <div 
              className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500 rounded-full blur-[70px] opacity-15 pointer-events-none transition-opacity duration-1000 animate-pulse-slow"
              style={{ opacity: subjectStats.percentage > 0 ? 0.25 : 0.05 }}
            />
            
            {/* Header info row */}
            <div className="flex items-center justify-between gap-3 mb-2.5 relative z-10">
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                    {subjectStats.completedChapters} of {activeSubject.chapters.length} chapters completed
                  </h3>
                  {subjectStats.percentage === 100 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      COMPLETED
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs text-gray-400">
                  {subjectStats.masteredCards} of {subjectStats.totalCards} flashcards mastered in {cleanSubjectName}
                </span>
              </div>
              
              <button 
                onClick={() => resetSubjectMastery(subjectStats.allCardIds)}
                title="Reset Subject Progress"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-white/70 bg-white/10 hover:bg-white/20 hover:text-white border border-white/15 transition-all active:scale-95 group shadow-sm shrink-0"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500 ease-out" />
                Reset
              </button>
            </div>
            
            {/* Main Progress Row: Compact Stepped Capsule Bar on Left + Compact Percentage Circle on Right */}
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              
              {/* Stepped Capsule Bar */}
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="relative h-3 sm:h-8 md:h-9 w-full bg-white/10 border border-white/15 rounded-full shadow-inner overflow-hidden p-0.5 sm:p-1 flex items-center">
                  
                  {/* Dynamic Gradient Fill */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#059669] via-[#10b981] via-[#34d399] to-[#6ee7b7]"
                    style={{ 
                      width: subjectStats.percentage <= 0 ? '0%' : `${Math.max(subjectStats.percentage, 4)}%`,
                      boxShadow: subjectStats.percentage > 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                    }}
                  />

                  {/* Chapter Milestone Circles along the Track (Hidden on mobile screens to prevent crowding) */}
                  <div className="relative w-full h-full hidden sm:flex items-center justify-between px-2 sm:px-3 z-10">
                    {activeSubject.chapters.map((ch, idx) => {
                      const chCards = getChapterFlashcards(ch, cleanSubjectName, selectedExam === 'neet' ? 'NEET' : 'JEE');
                      const chProg = getChapterCardStats(chCards);
                      const isDone = chProg.isComplete;
                      const isPartiallyDone = !isDone && chProg.mastered > 0;
                      const isFirst = idx === 0;
                      const isLast = idx === activeSubject.chapters.length - 1;
                      const totalChapters = activeSubject.chapters.length;

                      // Color progression for completed chapters
                      let completedBgClass = 'bg-[#10b981] text-white shadow-sm';
                      if (isFirst) {
                        completedBgClass = 'bg-white text-emerald-800 shadow-[0_1px_6px_rgba(0,0,0,0.35)]';
                      } else if (isLast) {
                        completedBgClass = 'bg-[#10b981] text-white shadow-[0_0_10px_rgba(16,185,129,0.7)]';
                      } else {
                        const ratio = idx / (totalChapters - 1);
                        if (ratio <= 0.3) completedBgClass = 'bg-[#0f764e] text-white';
                        else if (ratio <= 0.6) completedBgClass = 'bg-[#34d399] text-[#064e3b]';
                        else completedBgClass = 'bg-[#6ee7b7] text-[#064e3b]';
                      }

                      return (
                        <div 
                          key={ch.id} 
                          onClick={() => setSelectedChapterId(ch.id)}
                          title={`Ch ${idx + 1}: ${ch.title} (${chProg.mastered}/${chProg.total} cards)`}
                          className="flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                        >
                          <div 
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                              isDone 
                                ? completedBgClass
                                : isLast
                                ? 'bg-white/20 text-white/70 backdrop-blur-sm'
                                : isPartiallyDone
                                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 animate-pulse'
                                : 'bg-white/10 text-white/40 border border-white/15'
                            }`}
                          >
                            {isLast && !isDone ? (
                              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                            ) : (
                              <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3] ${!isDone && !isPartiallyDone ? 'opacity-30' : 'opacity-100'}`} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chapter Numbers Under Capsule (Hidden on mobile screens) */}
                <div className="w-full hidden sm:flex items-center justify-between px-3 sm:px-4">
                  {activeSubject.chapters.map((ch, idx) => {
                    const chCards = getChapterFlashcards(ch, cleanSubjectName, selectedExam === 'neet' ? 'NEET' : 'JEE');
                    const isDone = getChapterCardStats(chCards).isComplete;
                    const isFirst = idx === 0;
                    return (
                      <div key={`num-${ch.id}`} className="flex items-center justify-center w-5 sm:w-6">
                        {isFirst && isDone ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center shadow-[0_0_6px_rgba(16,185,129,0.5)]">
                            1
                          </span>
                        ) : (
                          <span className={`text-[10px] sm:text-[11px] font-bold transition-colors ${
                            isDone ? 'text-emerald-400' : 'text-gray-500/60'
                          }`}>
                            {idx + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Compact Radial Percentage Circle */}
              <div className="shrink-0 flex items-center justify-center">
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                    <defs>
                      <linearGradient id="flashcardCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#047857" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    {/* Background Track Circle */}
                    <circle
                      cx="22"
                      cy="22"
                      r="17"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="3.5"
                    />
                    {/* Progress Circle Fill */}
                    <circle
                      cx="22"
                      cy="22"
                      r="17"
                      fill="transparent"
                      stroke="url(#flashcardCircleGradient)"
                      strokeWidth="3.5"
                      strokeDasharray={106.81}
                      strokeDashoffset={106.81 - (subjectStats.percentage / 100) * 106.81}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  {/* Centered Percentage Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-black tracking-tight text-white font-mono">
                      {subjectStats.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters Grid with Flashcard decks */}
      {filteredChapters.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No chapters match your search query "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20">
          {filteredChapters.map((chapter, idx) => {
            const chCards = getChapterFlashcards(
              chapter,
              cleanSubjectName,
              selectedExam === 'neet' ? 'NEET' : 'JEE'
            );
            const stats = getChapterCardStats(chCards);

            return (
              <FlashcardChapterCard
                key={chapter.id}
                chapter={chapter}
                index={idx}
                cards={chCards}
                stats={stats}
                subjectName={cleanSubjectName}
                exam={selectedExam === 'neet' ? 'NEET' : 'JEE'}
                onSelectChapter={(id) => setSelectedChapterId(id)}
                onToggleAllMastered={() => handleToggleChapterMastery(chapter)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
