import { useState, useEffect, useCallback } from 'react';
import { ChapterPracticeProgress, QuestionPracticeSubjectStats } from '../types/questionPractice';
import { SyllabusChapter } from '../types/syllabus';
import { getChapterPracticeQuestions } from '../data/questionPracticeDatabase';

export function useQuestionPracticeStorage(exam: 'neet' | 'jee') {
  const storageKey = `cosmicbone_qp_progress_${exam}`;
  const bookmarkKey = `cosmicbone_qp_bookmarks_${exam}`;

  // Progress Map: chapterId -> ChapterPracticeProgress
  const [progressMap, setProgressMap] = useState<Record<string, ChapterPracticeProgress>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Bookmarked Question IDs
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(bookmarkKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progressMap));
    } catch (e) {
      console.error('Failed to save question practice progress', e);
    }
  }, [progressMap, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(bookmarkKey, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save question practice bookmarks', e);
    }
  }, [bookmarkedIds, bookmarkKey]);

  // Record an answer
  const recordAnswer = useCallback((
    chapterId: string,
    questionId: string,
    selectedOption: number,
    isCorrect: boolean,
    totalQuestions: number
  ) => {
    setProgressMap(prev => {
      const chapterProg = prev[chapterId] || {
        solvedCount: 0,
        correctCount: 0,
        isComplete: false,
        answers: {}
      };

      const existingAnswer = chapterProg.answers[questionId];
      const isNewAttempt = !existingAnswer;

      let newSolved = chapterProg.solvedCount + (isNewAttempt ? 1 : 0);
      let newCorrect = chapterProg.correctCount;

      if (isNewAttempt) {
        if (isCorrect) newCorrect++;
      } else if (existingAnswer.isCorrect !== isCorrect) {
        newCorrect += isCorrect ? 1 : -1;
      }

      const isComplete = totalQuestions > 0 && newSolved >= totalQuestions;

      return {
        ...prev,
        [chapterId]: {
          solvedCount: newSolved,
          correctCount: Math.max(0, newCorrect),
          isComplete,
          answers: {
            ...chapterProg.answers,
            [questionId]: {
              selectedOption,
              isCorrect,
              timestamp: Date.now()
            }
          }
        }
      };
    });
  }, []);

  // Toggle bookmark for a question
  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarkedIds(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      }
      return [...prev, questionId];
    });
  }, []);

  // Reset progress for a single chapter
  const resetChapter = useCallback((chapterId: string) => {
    setProgressMap(prev => {
      const next = { ...prev };
      delete next[chapterId];
      return next;
    });
  }, []);

  // Toggle all questions in a chapter as mastered/solved
  const toggleCompleteChapter = useCallback((
    chapter: SyllabusChapter,
    subjectName: string
  ) => {
    const questions = getChapterPracticeQuestions(
      chapter,
      subjectName,
      exam === 'neet' ? 'NEET' : 'JEE'
    );
    const existing = progressMap[chapter.id];
    const isAlreadyComplete = existing?.isComplete || (questions.length > 0 && (existing?.solvedCount || 0) >= questions.length);

    if (isAlreadyComplete) {
      resetChapter(chapter.id);
    } else {
      // Mark all as answered correctly
      const answers: Record<string, { selectedOption: number; isCorrect: boolean; timestamp: number }> = {};
      questions.forEach(q => {
        answers[q.id] = {
          selectedOption: q.correctOptionIndex,
          isCorrect: true,
          timestamp: Date.now()
        };
      });

      setProgressMap(prev => ({
        ...prev,
        [chapter.id]: {
          solvedCount: questions.length,
          correctCount: questions.length,
          isComplete: true,
          answers
        }
      }));
    }
  }, [exam, progressMap, resetChapter]);

  // Overall Subject Statistics
  const getSubjectOverallStats = useCallback((
    chapters: SyllabusChapter[],
    subjectName: string
  ): QuestionPracticeSubjectStats => {
    let totalQuestions = 0;
    let solvedQuestions = 0;
    let correctQuestions = 0;
    let completedChapters = 0;

    chapters.forEach(ch => {
      const qs = getChapterPracticeQuestions(
        ch,
        subjectName,
        exam === 'neet' ? 'NEET' : 'JEE'
      );
      totalQuestions += qs.length;

      const prog = progressMap[ch.id];
      if (prog) {
        solvedQuestions += prog.solvedCount || 0;
        correctQuestions += prog.correctCount || 0;
        if (prog.isComplete || (qs.length > 0 && prog.solvedCount >= qs.length)) {
          completedChapters++;
        }
      }
    });

    const accuracy = solvedQuestions > 0 ? Math.round((correctQuestions / solvedQuestions) * 100) : 0;
    const percentage = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      solvedQuestions,
      correctQuestions,
      completedChapters,
      totalChapters: chapters.length,
      accuracy,
      percentage
    };
  }, [exam, progressMap]);

  return {
    progressMap,
    bookmarkedIds,
    recordAnswer,
    toggleBookmark,
    resetChapter,
    toggleCompleteChapter,
    getSubjectOverallStats
  };
}
