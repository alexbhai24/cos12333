import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import { SyllabusChapter, SyllabusSubject } from '../types/syllabus';
import { useApp } from '../context/AppContext';
import { PyqChapterCard, PyqChapterProgress } from '../components/pyq/PyqChapterCard';
import { ChapterPyqPracticeView } from '../components/pyq/ChapterPyqPracticeView';
import {
  Search, Flame, Atom, RotateCcw, Check, Plus
} from 'lucide-react';

type ExamType = 'neet' | 'jee';
type ClassFilter = 'all' | '11' | '12';

// ─── Real question counts per chapter (NEET & JEE based on past papers) ────────
const NEET_BIO_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  nb1:  { total: 21,  cls: '11' }, nb2:  { total: 76,  cls: '11' },
  nb3:  { total: 54,  cls: '11' }, nb4:  { total: 53,  cls: '11' },
  nb5:  { total: 59,  cls: '11' }, nb6:  { total: 24,  cls: '11' },
  nb7:  { total: 44,  cls: '11' }, nb8:  { total: 90,  cls: '11' },
  nb9:  { total: 58,  cls: '11' }, nb10: { total: 57,  cls: '11' },
  nb11: { total: 20,  cls: '11' }, nb12: { total: 18,  cls: '11' },
  nb13: { total: 40,  cls: '11' }, nb14: { total: 25,  cls: '11' },
  nb15: { total: 30,  cls: '11' }, nb16: { total: 36,  cls: '11' },
  nb17: { total: 28,  cls: '11' }, nb18: { total: 34,  cls: '11' },
  nb19: { total: 36,  cls: '11' }, nb20: { total: 21,  cls: '11' },
  nb21: { total: 21,  cls: '11' }, nb22: { total: 52,  cls: '11' },
  nb23: { total: 14,  cls: '12' }, nb24: { total: 44,  cls: '12' },
  nb25: { total: 69,  cls: '12' }, nb26: { total: 44,  cls: '12' },
  nb27: { total: 80,  cls: '12' }, nb28: { total: 78,  cls: '12' },
  nb29: { total: 46,  cls: '12' }, nb30: { total: 34,  cls: '12' },
  nb31: { total: 31,  cls: '12' }, nb32: { total: 61,  cls: '12' },
  nb33: { total: 39,  cls: '12' }, nb34: { total: 32,  cls: '12' },
  nb35: { total: 28,  cls: '12' }, nb36: { total: 17,  cls: '12' },
  nb37: { total: 14,  cls: '12' },
};

const NEET_PHY_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  np1:  { total: 14,  cls: '11' }, np2:  { total: 38,  cls: '11' },
  np3:  { total: 42,  cls: '11' }, np4:  { total: 36,  cls: '11' },
  np5:  { total: 48,  cls: '11' }, np6:  { total: 32,  cls: '11' },
  np7:  { total: 28,  cls: '11' }, np8:  { total: 44,  cls: '11' },
  np9:  { total: 30,  cls: '11' }, np10: { total: 46,  cls: '11' },
  np11: { total: 64,  cls: '12' }, np12: { total: 58,  cls: '12' },
  np13: { total: 60,  cls: '12' }, np14: { total: 54,  cls: '12' },
  np15: { total: 72,  cls: '12' }, np16: { total: 48,  cls: '12' },
  np17: { total: 52,  cls: '12' }, np18: { total: 45,  cls: '12' },
};

const NEET_CHE_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  nc1:  { total: 22,  cls: '11' }, nc2:  { total: 35,  cls: '11' },
  nc3:  { total: 28,  cls: '11' }, nc4:  { total: 52,  cls: '11' },
  nc5:  { total: 24,  cls: '11' }, nc6:  { total: 38,  cls: '11' },
  nc7:  { total: 46,  cls: '11' }, nc8:  { total: 20,  cls: '11' },
  nc9:  { total: 18,  cls: '11' }, nc10: { total: 26,  cls: '11' },
  nc11: { total: 32,  cls: '11' }, nc12: { total: 28,  cls: '11' },
  nc13: { total: 30,  cls: '11' }, nc14: { total: 24,  cls: '12' },
  nc15: { total: 36,  cls: '12' }, nc16: { total: 28,  cls: '12' },
  nc17: { total: 22,  cls: '12' }, nc18: { total: 40,  cls: '12' },
  nc19: { total: 45,  cls: '12' }, nc20: { total: 48,  cls: '12' },
  nc21: { total: 34,  cls: '12' }, nc22: { total: 42,  cls: '12' },
  nc23: { total: 36,  cls: '12' }, nc24: { total: 30,  cls: '12' },
  nc25: { total: 26,  cls: '12' },
};

const JEE_PHY_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  jp1:  { total: 18,  cls: '11' }, jp2:  { total: 44,  cls: '11' },
  jp3:  { total: 48,  cls: '11' }, jp4:  { total: 52,  cls: '11' },
  jp5:  { total: 58,  cls: '11' }, jp6:  { total: 36,  cls: '11' },
  jp7:  { total: 40,  cls: '11' }, jp8:  { total: 54,  cls: '11' },
  jp9:  { total: 38,  cls: '11' }, jp10: { total: 60,  cls: '11' },
  jp11: { total: 72,  cls: '12' }, jp12: { total: 68,  cls: '12' },
  jp13: { total: 74,  cls: '12' }, jp14: { total: 64,  cls: '12' },
  jp15: { total: 80,  cls: '12' }, jp16: { total: 56,  cls: '12' },
  jp17: { total: 58,  cls: '12' }, jp18: { total: 52,  cls: '12' },
};

const JEE_CHE_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  jc1:  { total: 22,  cls: '11' }, jc2:  { total: 38,  cls: '11' },
  jc3:  { total: 30,  cls: '11' }, jc4:  { total: 60,  cls: '11' },
  jc5:  { total: 26,  cls: '11' }, jc6:  { total: 44,  cls: '11' },
  jc7:  { total: 50,  cls: '11' }, jc8:  { total: 22,  cls: '11' },
  jc9:  { total: 20,  cls: '11' }, jc10: { total: 32,  cls: '11' },
  jc11: { total: 38,  cls: '11' }, jc12: { total: 34,  cls: '11' },
  jc13: { total: 36,  cls: '11' }, jc14: { total: 28,  cls: '12' },
  jc15: { total: 42,  cls: '12' }, jc16: { total: 32,  cls: '12' },
  jc17: { total: 26,  cls: '12' }, jc18: { total: 46,  cls: '12' },
  jc19: { total: 52,  cls: '12' }, jc20: { total: 56,  cls: '12' },
  jc21: { total: 40,  cls: '12' }, jc22: { total: 48,  cls: '12' },
  jc23: { total: 42,  cls: '12' }, jc24: { total: 34,  cls: '12' },
  jc25: { total: 30,  cls: '12' },
};

const JEE_MAT_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  jm1:  { total: 44,  cls: '11' }, jm2:  { total: 58,  cls: '11' },
  jm3:  { total: 38,  cls: '11' }, jm4:  { total: 48,  cls: '11' },
  jm5:  { total: 54,  cls: '11' }, jm6:  { total: 46,  cls: '11' },
  jm7:  { total: 42,  cls: '11' }, jm8:  { total: 52,  cls: '11' },
  jm9:  { total: 36,  cls: '11' }, jm10: { total: 40,  cls: '11' },
  jm11: { total: 68,  cls: '12' }, jm12: { total: 64,  cls: '12' },
  jm13: { total: 62,  cls: '12' }, jm14: { total: 58,  cls: '12' },
  jm15: { total: 70,  cls: '12' }, jm16: { total: 54,  cls: '12' },
  jm17: { total: 50,  cls: '12' }, jm18: { total: 60,  cls: '12' },
  jm19: { total: 48,  cls: '12' }, jm20: { total: 56,  cls: '12' },
};

function getChapterQInfo(chapterId: string, idx: number, totalChapters: number): { total: number; cls: '11' | '12' } {
  if (NEET_BIO_QS[chapterId]) return NEET_BIO_QS[chapterId];
  if (NEET_PHY_QS[chapterId]) return NEET_PHY_QS[chapterId];
  if (NEET_CHE_QS[chapterId]) return NEET_CHE_QS[chapterId];
  if (JEE_PHY_QS[chapterId]) return JEE_PHY_QS[chapterId];
  if (JEE_CHE_QS[chapterId]) return JEE_CHE_QS[chapterId];
  if (JEE_MAT_QS[chapterId]) return JEE_MAT_QS[chapterId];

  // Deterministic fallback
  let hash = 0;
  for (let i = 0; i < chapterId.length; i++) hash = (hash << 5) - hash + chapterId.charCodeAt(i);
  const total = 25 + Math.abs(hash % 35);
  const cls: '11' | '12' = idx < Math.ceil(totalChapters * 0.55) ? '11' : '12';
  return { total, cls };
}

// ─── Main PYQ Page ────────────────────────────────────────────────────────────
export const PyqPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const [selectedExam, setSelectedExam] = useState<ExamType>('neet');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<ClassFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active syllabus dataset
  const currentSyllabus = selectedExam === 'neet' ? syllabusNEET : syllabusJEE;
  const validSubjects = useMemo(() => {
    return (currentSyllabus?.subjects || []).filter(Boolean);
  }, [currentSyllabus]);

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
    return activeSubject.name
      .replace(/\s*\(Theory:.*?\)/gi, '')
      .replace(/\s*\(.*Marks\)/gi, '')
      .trim();
  }, [activeSubject]);

  // Persistent Progress Storage Key per exam & subject
  const storageKey = useMemo(() => {
    return `cosmic_pyq3_${selectedExam}_${activeSubjectId || 'default'}`;
  }, [selectedExam, activeSubjectId]);

  const [progressMap, setProgressMap] = useState<Record<string, PyqChapterProgress>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      /* noop */
    }
    return {};
  });

  // Reload progress on subject / exam change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProgressMap(JSON.parse(saved));
        return;
      }
    } catch {
      /* noop */
    }
    setProgressMap({});
  }, [storageKey]);

  const saveProgressMap = useCallback((next: Record<string, PyqChapterProgress>) => {
    setProgressMap(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }, [storageKey]);

  // Search & Class filter
  const filteredChapters = useMemo(() => {
    if (!activeSubject || !Array.isArray(activeSubject.chapters)) return [];

    const totalCh = activeSubject.chapters.length;
    return activeSubject.chapters.filter((ch, idx) => {
      const qInfo = getChapterQInfo(ch.id, idx, totalCh);
      if (classFilter !== 'all' && qInfo.cls !== classFilter) return false;

      if (!searchQuery.trim()) return true;
      const lower = searchQuery.toLowerCase();
      const matchTitle = (ch.title || '').toLowerCase().includes(lower);
      const matchTopics = (ch.topics || []).some(t => (t.title || '').toLowerCase().includes(lower));
      return matchTitle || matchTopics;
    });
  }, [activeSubject, classFilter, searchQuery]);

  // Overall Subject PYQ Stats for Sticky Progress Bar
  const subjectStats = useMemo(() => {
    if (!activeSubject || !Array.isArray(activeSubject.chapters)) {
      return {
        totalQs: 0,
        solvedQs: 0,
        correctQs: 0,
        completedChapters: 0,
        totalChapters: 0,
        percentage: 0,
        accuracy: 0
      };
    }

    const totalChapters = activeSubject.chapters.length;
    let totalQs = 0;
    let solvedQs = 0;
    let correctQs = 0;
    let completedChapters = 0;

    activeSubject.chapters.forEach((ch, idx) => {
      const qInfo = getChapterQInfo(ch.id, idx, totalChapters);
      totalQs += qInfo.total;

      const prog = progressMap[ch.id];
      if (prog) {
        solvedQs += prog.solvedCount || 0;
        correctQs += prog.correctCount || 0;
        if (prog.isComplete || (prog.solvedCount >= qInfo.total && qInfo.total > 0)) {
          completedChapters += 1;
        }
      }
    });

    const percentage = totalQs > 0 ? Math.min(100, Math.round((solvedQs / totalQs) * 100)) : 0;
    const accuracy = solvedQs > 0 ? Math.round((correctQs / solvedQs) * 100) : 0;

    return {
      totalQs,
      solvedQs,
      correctQs,
      completedChapters,
      totalChapters,
      percentage,
      accuracy
    };
  }, [activeSubject, progressMap]);

  // Toggle chapter complete
  const handleToggleComplete = (chapter: SyllabusChapter, totalQ: number) => {
    const prev = progressMap[chapter.id];
    const isCurrentlyComplete = prev?.isComplete || (prev?.solvedCount || 0) >= totalQ;

    const next = { ...progressMap };
    if (isCurrentlyComplete) {
      delete next[chapter.id];
    } else {
      next[chapter.id] = {
        solvedCount: totalQ,
        correctCount: totalQ,
        isComplete: true
      };
    }
    saveProgressMap(next);
  };

  // Reset entire subject progress
  const handleResetSubject = () => {
    saveProgressMap({});
  };

  // Record practice question result
  const handleSaveProgress = (chapterId: string, isCorrect: boolean) => {
    const prev = progressMap[chapterId] || { solvedCount: 0, correctCount: 0 };
    const nextSolved = prev.solvedCount + 1;
    const nextCorrect = isCorrect ? prev.correctCount + 1 : prev.correctCount;

    const next = {
      ...progressMap,
      [chapterId]: {
        solvedCount: nextSolved,
        correctCount: nextCorrect,
        isComplete: prev.isComplete
      }
    };
    saveProgressMap(next);
  };

  // Selected Chapter for Full Page Interactive PYQ Practice View
  const selectedChapter = useMemo(() => {
    if (!selectedChapterId || !activeSubject) return null;
    return (activeSubject.chapters || []).find(c => c.id === selectedChapterId) || null;
  }, [selectedChapterId, activeSubject]);

  const selectedChapterIndex = useMemo(() => {
    if (!selectedChapter || !activeSubject) return 0;
    return (activeSubject.chapters || []).findIndex(c => c.id === selectedChapter.id);
  }, [selectedChapter, activeSubject]);

  const nextChapter = useMemo(() => {
    if (!activeSubject || !selectedChapterId) return null;
    const chapters = activeSubject.chapters || [];
    const idx = chapters.findIndex(c => c.id === selectedChapterId);
    if (idx >= 0 && idx + 1 < chapters.length) {
      return chapters[idx + 1];
    }
    return null;
  }, [activeSubject, selectedChapterId]);

  // If a chapter is selected, show the Dedicated Full-Page Interactive Practice View!
  if (selectedChapter) {
    return (
      <ChapterPyqPracticeView
        chapter={selectedChapter}
        chapterIndex={selectedChapterIndex}
        subjectName={cleanSubjectName}
        exam={selectedExam}
        onBack={() => setSelectedChapterId(null)}
        nextChapter={nextChapter}
        onNextChapter={() => {
          if (nextChapter) setSelectedChapterId(nextChapter.id);
        }}
        onSaveProgress={handleSaveProgress}
        onGoHome={() => setCurrentRoute('home')}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Top Control Bar: Search + Exam Selector (Matching Flashcards Page) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Global Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past year questions, chapters, high-yield topics..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
          />
        </div>

        {/* Exam Mode Toggle: Exclusively NEET (UG) & JEE Main */}
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

      {/* Subject Pills Row */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 mb-4 border-b border-[var(--border-color)]">
        {validSubjects.map(subject => {
          const cleanName = subject.name
            .replace(/\s*\(Theory:.*?\)/gi, '')
            .replace(/\s*\(.*Marks\)/gi, '')
            .trim();
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

      {/* Class Filter Tabs (Sub-filter for PYQ chapters) */}
      <div className="flex items-center gap-2 mb-2">
        {(['all', '11', '12'] as ClassFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setClassFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
              classFilter === f
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-[var(--bg-surface)] text-white/50 border-[var(--border-color)] hover:text-white'
            }`}
          >
            {f === 'all' ? 'All Classes' : `Class ${f}`}
          </button>
        ))}
        <span className="ml-auto text-xs text-white/40 font-mono">
          {filteredChapters.length} Chapters Available
        </span>
      </div>

      {/* Sticky Progress Bar (Identical to Flashcard & Syllabus Trackers) */}
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
                  {subjectStats.solvedQs.toLocaleString()} of {subjectStats.totalQs.toLocaleString()} PYQs solved in {cleanSubjectName}
                  {subjectStats.accuracy > 0 ? ` · ${subjectStats.accuracy}% accuracy` : ''}
                </span>
              </div>

              <button
                onClick={handleResetSubject}
                title="Reset Subject Progress"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-white/70 bg-white/10 hover:bg-white/20 hover:text-white border border-white/15 transition-all active:scale-95 group shadow-sm shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500 ease-out" />
                Reset
              </button>
            </div>

            {/* Main Progress Row: Stepped Capsule Bar + Compact Radial Percentage Dial */}
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

                  {/* Chapter Milestone Circles along the Track */}
                  <div className="relative w-full h-full hidden sm:flex items-center justify-between px-2 sm:px-3 z-10">
                    {activeSubject.chapters.map((ch, idx) => {
                      const totalChapters = activeSubject.chapters.length;
                      const qInfo = getChapterQInfo(ch.id, idx, totalChapters);
                      const prog = progressMap[ch.id];
                      const isDone = prog?.isComplete || (prog?.solvedCount || 0) >= qInfo.total;
                      const isPartiallyDone = !isDone && (prog?.solvedCount || 0) > 0;
                      const isFirst = idx === 0;
                      const isLast = idx === totalChapters - 1;

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
                          onClick={() => {
                            setSelectedChapterId(ch.id);
                          }}
                          title={`Ch ${idx + 1}: ${ch.title} (${prog?.solvedCount || 0}/${qInfo.total} solved)`}
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

                {/* Chapter Numbers Under Capsule */}
                <div className="w-full hidden sm:flex items-center justify-between px-3 sm:px-4">
                  {activeSubject.chapters.map((ch, idx) => {
                    const totalChapters = activeSubject.chapters.length;
                    const qInfo = getChapterQInfo(ch.id, idx, totalChapters);
                    const prog = progressMap[ch.id];
                    const isDone = prog?.isComplete || (prog?.solvedCount || 0) >= qInfo.total;
                    const isFirst = idx === 0;

                    return (
                      <div key={`num-${ch.id}`} className="flex items-center justify-center w-5 sm:w-6">
                        {isFirst && isDone ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center shadow-[0_0_6px_rgba(16,185,129,0.5)]">
                            1
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold transition-colors ${
                              isDone ? 'text-emerald-400' : 'text-gray-500/60'
                            }`}
                          >
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
                      <linearGradient id="pyqCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#047857" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="22"
                      cy="22"
                      r="17"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="17"
                      fill="transparent"
                      stroke="url(#pyqCircleGradient)"
                      strokeWidth="3.5"
                      strokeDasharray={106.81}
                      strokeDashoffset={106.81 - (subjectStats.percentage / 100) * 106.81}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
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

      {/* Chapters Grid with Flashcard-styled PYQ Chapter Cards */}
      {filteredChapters.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No PYQ chapters match your search query "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20">
          {filteredChapters.map((chapter) => {
            const originalIndex = (activeSubject?.chapters || []).findIndex(c => c.id === chapter.id);
            const idx = originalIndex >= 0 ? originalIndex : 0;
            const totalChapters = activeSubject?.chapters?.length || 1;
            const qInfo = getChapterQInfo(chapter.id, idx, totalChapters);
            const prog = progressMap[chapter.id] || { solvedCount: 0, correctCount: 0 };

            return (
              <PyqChapterCard
                key={chapter.id}
                chapter={chapter}
                index={idx}
                totalQuestions={qInfo.total}
                progress={prog}
                subjectName={cleanSubjectName}
                exam={selectedExam}
                onStartPractice={() => setSelectedChapterId(chapter.id)}
                onToggleComplete={() => handleToggleComplete(chapter, qInfo.total)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
