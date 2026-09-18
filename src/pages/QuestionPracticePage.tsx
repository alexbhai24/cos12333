import React, { useState, useMemo, useEffect } from 'react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import { getChapterPracticeQuestions } from '../data/questionPracticeDatabase';
import { useQuestionPracticeStorage } from '../hooks/useQuestionPracticeStorage';
import { QuestionPracticeChapterCard } from '../components/question-practice/QuestionPracticeChapterCard';
import { ChapterQuestionPracticePlayer } from '../components/question-practice/ChapterQuestionPracticePlayer';
import { SyllabusChapter, SyllabusSubject } from '../types/syllabus';
import { useApp } from '../context/AppContext';
import { 
  Search, Flame, Atom, BookOpen, RotateCcw, Check, Sparkles, Layers, CheckCircle2
} from 'lucide-react';

type ExamType = 'neet' | 'jee';

export const QuestionPracticePage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  // Exam Selector: Exclusively NEET & JEE Main
  const [selectedExam, setSelectedExam] = useState<ExamType>('neet');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active syllabus dataset
  const currentSyllabus = selectedExam === 'neet' ? syllabusNEET : syllabusJEE;
  const validSubjects = useMemo(() => {
    return (currentSyllabus?.subjects || []).filter(Boolean);
  }, [currentSyllabus]);

  // Storage hook
  const {
    progressMap,
    bookmarkedIds,
    recordAnswer,
    toggleBookmark,
    resetChapter,
    toggleCompleteChapter,
    getSubjectOverallStats
  } = useQuestionPracticeStorage(selectedExam);

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

  // Overall Subject Stats
  const subjectStats = useMemo(() => {
    if (!activeSubject || !Array.isArray(activeSubject.chapters)) {
      return { totalQuestions: 0, solvedQuestions: 0, correctQuestions: 0, completedChapters: 0, totalChapters: 0, accuracy: 0, percentage: 0 };
    }
    return getSubjectOverallStats(activeSubject.chapters, cleanSubjectName);
  }, [activeSubject, cleanSubjectName, getSubjectOverallStats]);

  // Selected Chapter for interactive Player
  const selectedChapter = useMemo(() => {
    if (!selectedChapterId || !activeSubject) return null;
    return (activeSubject.chapters || []).find(c => c.id === selectedChapterId) || null;
  }, [selectedChapterId, activeSubject]);

  const selectedChapterIndex = useMemo(() => {
    if (!selectedChapter || !activeSubject) return 0;
    return (activeSubject.chapters || []).findIndex(c => c.id === selectedChapter.id);
  }, [selectedChapter, activeSubject]);

  const selectedChapterQuestions = useMemo(() => {
    if (!selectedChapter) return [];
    return getChapterPracticeQuestions(
      selectedChapter,
      cleanSubjectName,
      selectedExam === 'neet' ? 'NEET' : 'JEE'
    );
  }, [selectedChapter, cleanSubjectName, selectedExam]);

  const nextChapter = useMemo(() => {
    if (!activeSubject || !selectedChapterId) return null;
    const chapters = activeSubject.chapters || [];
    const idx = chapters.findIndex(c => c.id === selectedChapterId);
    if (idx >= 0 && idx + 1 < chapters.length) {
      return chapters[idx + 1];
    }
    return null;
  }, [activeSubject, selectedChapterId]);

  // If a chapter is selected, show the full Interactive Question Player View!
  if (selectedChapter) {
    return (
      <ChapterQuestionPracticePlayer
        chapter={selectedChapter}
        chapterIndex={selectedChapterIndex}
        subjectName={cleanSubjectName}
        exam={selectedExam === 'neet' ? 'NEET' : 'JEE'}
        questions={selectedChapterQuestions}
        progress={progressMap[selectedChapter.id]}
        bookmarkedIds={bookmarkedIds}
        onRecordAnswer={(qId, optIdx, isCorrect, total) => {
          recordAnswer(selectedChapter.id, qId, optIdx, isCorrect, total);
        }}
        onToggleBookmark={toggleBookmark}
        onResetChapter={resetChapter}
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
      
      {/* ── Top Control Bar: Search + Exam Selector (Matching Flashcards Page) ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Global Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, NCERT topics, assertion-reason questions..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
          />
        </div>

        {/* Exam Mode Toggle: Exclusively NEET & JEE Main */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedExam('neet')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer ${
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

      {/* ── Subject Pills Row ── */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 mb-6 border-b border-[var(--border-color)]">
        {validSubjects.map(subject => {
          const cleanName = subject.name.replace(/\s*\(Theory:.*?\)/gi, '').replace(/\s*\(.*Marks\)/gi, '').trim();
          const isActive = activeSubjectId === subject.id;
          return (
            <button
              key={subject.id}
              onClick={() => setActiveSubjectId(subject.id)}
              className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border cursor-pointer ${
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

      {/* ── Sticky Subject Mastery Progress Bar (Identical to Flashcards Page) ── */}
      {activeSubject && (
        <div className="sticky top-[72px] z-20 mb-5 pt-2">
          <div className="relative overflow-hidden bg-transparent border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-none">
            {/* Background glowing ambient light */}
            <div 
              className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500 rounded-full blur-[70px] pointer-events-none transition-opacity duration-1000 animate-pulse-slow"
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
                  {subjectStats.solvedQuestions} of {subjectStats.totalQuestions} questions solved in {cleanSubjectName}
                  {subjectStats.solvedQuestions > 0 && ` · ${subjectStats.accuracy}% Accuracy`}
                </span>
              </div>

              {/* Progress Percentage Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs sm:text-sm font-black font-mono text-white">
                    {subjectStats.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing animated progress bar */}
            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out relative"
                style={{
                  width: `${subjectStats.percentage}%`,
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)',
                  boxShadow: subjectStats.percentage > 0 ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none'
                }}
              >
                {subjectStats.percentage > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Chapters Grid with Flashcard-style Chapter Cards ── */}
      {filteredChapters.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8">
          No chapters match your search query "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20">
          {filteredChapters.map((chapter, idx) => {
            const qs = getChapterPracticeQuestions(
              chapter,
              cleanSubjectName,
              selectedExam === 'neet' ? 'NEET' : 'JEE'
            );
            const prog = progressMap[chapter.id];

            return (
              <QuestionPracticeChapterCard
                key={chapter.id}
                chapter={chapter}
                index={idx}
                totalQuestions={qs.length}
                progress={prog}
                subjectName={cleanSubjectName}
                exam={selectedExam}
                onStartPractice={() => setSelectedChapterId(chapter.id)}
                onToggleComplete={(e) => {
                  e.stopPropagation();
                  toggleCompleteChapter(chapter, cleanSubjectName);
                }}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
