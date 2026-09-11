import { useState, useEffect, useCallback } from 'react';
import type { SyllabusData, TopicProgress, ChapterProgress, SubjectProgress } from '../types/syllabus';

const STORAGE_KEY = 'cosmicbone_syllabus_progress';

export const useSyllabusStorage = (examId: string) => {
  const [topicState, setTopicState] = useState<TopicProgress>({});

  // Load from local storage on mount or when examId changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[examId] && parsed[examId].topicState) {
          setTopicState(parsed[examId].topicState);
        } else {
          setTopicState({});
        }
      } else {
        setTopicState({});
      }
    } catch (e) {
      console.error('Failed to load syllabus progress', e);
      setTopicState({});
    }
  }, [examId]);

  // Save to local storage whenever topicState changes
  const saveToStorage = useCallback((newState: TopicProgress) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let parsed = stored ? JSON.parse(stored) : {};
      
      parsed[examId] = {
        topicState: newState,
        lastUpdated: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save syllabus progress', e);
    }
  }, [examId]);

  const toggleTopic = useCallback((topicId: string, completed?: boolean) => {
    setTopicState(prev => {
      const isCompleted = completed !== undefined ? completed : !prev[topicId];
      const newState = { ...prev };
      
      if (isCompleted) {
        newState[topicId] = true;
      } else {
        delete newState[topicId];
      }
      
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  const resetSubjectProgress = useCallback((subject: any) => {
    setTopicState(prev => {
      const newState = { ...prev };
      if (subject && subject.chapters) {
        subject.chapters.forEach((c: any) => {
          if (c.topics) {
            c.topics.forEach((t: any) => {
              delete newState[t.id];
            });
          }
        });
      }
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  const getChapterProgress = useCallback((chapter: any): ChapterProgress => {
    if (!chapter.topics || chapter.topics.length === 0) {
      return { completedTopics: 0, totalTopics: 0, percentage: 0, isCompleted: false };
    }

    const totalTopics = chapter.topics.length;
    let completedTopics = 0;

    chapter.topics.forEach((t: any) => {
      if (topicState[t.id]) completedTopics++;
    });

    return {
      completedTopics,
      totalTopics,
      percentage: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
      isCompleted: totalTopics > 0 && completedTopics === totalTopics
    };
  }, [topicState]);

  const getSubjectProgress = useCallback((subject: any): SubjectProgress => {
    let totalTopics = 0;
    let completedTopics = 0;

    if (subject.chapters) {
      subject.chapters.forEach((c: any) => {
        if (c.topics) {
          totalTopics += c.topics.length;
          c.topics.forEach((t: any) => {
            if (topicState[t.id]) completedTopics++;
          });
        }
      });
    }

    return {
      completedTopics,
      totalTopics,
      percentage: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0
    };
  }, [topicState]);

  const getOverallProgress = useCallback((syllabus: SyllabusData) => {
    let totalTopics = 0;
    let completedTopics = 0;

    syllabus.subjects.forEach(s => {
      const p = getSubjectProgress(s);
      totalTopics += p.totalTopics;
      completedTopics += p.completedTopics;
    });

    return {
      completedTopics,
      totalTopics,
      percentage: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0
    };
  }, [getSubjectProgress]);

  return {
    topicState,
    toggleTopic,
    resetSubjectProgress,
    getChapterProgress,
    getSubjectProgress,
    getOverallProgress
  };
};
