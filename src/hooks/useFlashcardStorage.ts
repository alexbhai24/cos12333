import { useState, useEffect, useCallback } from 'react';
import { CardMasteryStatus, FlashcardProgressMap, FlashcardItem } from '../types/flashcard';
import { SyllabusChapter } from '../types/syllabus';
import { getChapterFlashcards } from '../data/flashcardsDatabase';

const FLASHCARD_STORAGE_KEY = 'cosmicbone_flashcards_progress_v1';

export const useFlashcardStorage = (examId: string) => {
  const [progressMap, setProgressMap] = useState<FlashcardProgressMap>({});

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[examId]) {
          setProgressMap(parsed[examId]);
        } else {
          setProgressMap({});
        }
      } else {
        setProgressMap({});
      }
    } catch (e) {
      console.error('Failed to load flashcard progress', e);
      setProgressMap({});
    }
  }, [examId]);

  // Save to local storage
  const saveStorage = useCallback((newMap: FlashcardProgressMap) => {
    try {
      const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
      let parsed = raw ? JSON.parse(raw) : {};
      parsed[examId] = newMap;
      localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save flashcard progress', e);
    }
  }, [examId]);

  const markMastered = useCallback((cardId: string) => {
    setProgressMap(prev => {
      const next = { ...prev, [cardId]: 'mastered' as CardMasteryStatus };
      saveStorage(next);
      return next;
    });
  }, [saveStorage]);

  const markReview = useCallback((cardId: string) => {
    setProgressMap(prev => {
      const next = { ...prev, [cardId]: 'review' as CardMasteryStatus };
      saveStorage(next);
      return next;
    });
  }, [saveStorage]);

  const toggleMastered = useCallback((cardId: string) => {
    setProgressMap(prev => {
      const current = prev[cardId];
      const next = { ...prev };
      if (current === 'mastered') {
        delete next[cardId];
      } else {
        next[cardId] = 'mastered';
      }
      saveStorage(next);
      return next;
    });
  }, [saveStorage]);

  const resetChapterMastery = useCallback((cardIds: string[]) => {
    setProgressMap(prev => {
      const next = { ...prev };
      cardIds.forEach(id => {
        delete next[id];
      });
      saveStorage(next);
      return next;
    });
  }, [saveStorage]);

  const resetSubjectMastery = useCallback((cardIds: string[]) => {
    setProgressMap(prev => {
      const next = { ...prev };
      cardIds.forEach(id => {
        delete next[id];
      });
      saveStorage(next);
      return next;
    });
  }, [saveStorage]);

  const getChapterCardStats = useCallback((cards: FlashcardItem[]) => {
    const total = cards.length;
    if (total === 0) return { total: 0, mastered: 0, review: 0, percentage: 0, isComplete: false };
    
    let mastered = 0;
    let review = 0;
    cards.forEach(c => {
      const status = progressMap[c.id];
      if (status === 'mastered') mastered++;
      else if (status === 'review') review++;
    });

    const percentage = Math.round((mastered / total) * 100);
    return {
      total,
      mastered,
      review,
      percentage,
      isComplete: mastered === total
    };
  }, [progressMap]);

  const getSubjectOverallStats = useCallback((
    chapters: SyllabusChapter[], 
    subjectName: string, 
    exam: 'NEET' | 'JEE'
  ) => {
    let totalCards = 0;
    let masteredCards = 0;
    let completedChapters = 0;
    const allCardIds: string[] = [];

    chapters.forEach(ch => {
      const cards = getChapterFlashcards(ch, subjectName, exam);
      totalCards += cards.length;
      let chMastered = 0;
      cards.forEach(c => {
        allCardIds.push(c.id);
        if (progressMap[c.id] === 'mastered') {
          masteredCards++;
          chMastered++;
        }
      });
      if (cards.length > 0 && chMastered === cards.length) {
        completedChapters++;
      }
    });

    const percentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

    return {
      totalCards,
      masteredCards,
      completedChapters,
      totalChapters: chapters.length,
      percentage,
      allCardIds
    };
  }, [progressMap]);

  return {
    progressMap,
    markMastered,
    markReview,
    toggleMastered,
    resetChapterMastery,
    resetSubjectMastery,
    getChapterCardStats,
    getSubjectOverallStats
  };
};
