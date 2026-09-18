import { useState, useEffect, useCallback, useMemo } from 'react';

export interface LevelAttemptRecord {
  timestamp: string;
  readingTimeSeconds: number;
  wordCount: number;
  wpm: number;
  totalQuestions: number;
  correctQuestions: number;
  accuracyPercentage: number;
  overallScore: number;
}

export interface TopicProgressRecord {
  topicId: string;
  chapterId: string;
  classNum: 11 | 12;
  unlockedLevel: number; // 1 to 5
  completedLevels: number[]; // e.g. [1, 2]
  bestWpm: number;
  avgWpm: number;
  bestAccuracy: number;
  avgAccuracy: number;
  totalAttempts: number;
  attemptsByLevel: Record<number, LevelAttemptRecord[]>;
}

export interface ReadingPracticeStorageState {
  version: string;
  streak: number;
  lastActiveDate: string;
  totalWordsRead: number;
  totalSessions: number;
  topicProgress: Record<string, TopicProgressRecord>; // key: `${chapterId}_${topicId}`
}

const STORAGE_KEY = 'readingPracticeProgress_v1';

const DEFAULT_STATE: ReadingPracticeStorageState = {
  version: '1.0',
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalWordsRead: 0,
  totalSessions: 0,
  topicProgress: {}
};

export const LEVEL_UNLOCK_THRESHOLDS: Record<number, number> = {
  1: 0,  // Level 1: Always unlocked
  2: 0,  // Level 2: Unlocks on completing Level 1 (any score)
  3: 70, // Level 3: Requires Level 2 >= 70%
  4: 80, // Level 4: Requires Level 3 >= 80%
  5: 85  // Level 5: Requires Level 4 >= 85%
};

export function useReadingPracticeStorage() {
  const [state, setState] = useState<ReadingPracticeStorageState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_STATE, ...parsed };
        }
      }
    } catch (err) {
      console.warn('Failed to load readingPracticeProgress_v1 from localStorage', err);
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save readingPracticeProgress_v1 to localStorage', err);
    }
  }, [state]);

  // Check if a specific level is unlocked for a given topic
  const isLevelUnlocked = useCallback((chapterId: string, topicId: string, level: number): boolean => {
    if (level === 1) return true;
    const key = `${chapterId}_${topicId}`;
    const prog = state.topicProgress[key];
    if (!prog) return false;

    // Previous level must be completed
    const prevLevel = level - 1;
    if (!prog.completedLevels.includes(prevLevel)) return false;

    // Check accuracy requirement on previous level
    const prevAttempts = prog.attemptsByLevel[prevLevel] || [];
    if (prevAttempts.length === 0) return false;

    const bestPrevAccuracy = Math.max(...prevAttempts.map(a => a.accuracyPercentage));
    const required = LEVEL_UNLOCK_THRESHOLDS[level] ?? 0;
    return bestPrevAccuracy >= required;
  }, [state.topicProgress]);

  // Get topic progress record
  const getTopicProgress = useCallback((chapterId: string, topicId: string): TopicProgressRecord | null => {
    const key = `${chapterId}_${topicId}`;
    return state.topicProgress[key] || null;
  }, [state.topicProgress]);

  // Get chapter overall stats
  const getChapterProgress = useCallback((chapterId: string, totalTopics: number) => {
    let completedTopicsCount = 0;
    let totalLevelsCompleted = 0;
    let maxWpm = 0;
    let sumAccuracy = 0;
    let accuracyCount = 0;

    Object.entries(state.topicProgress).forEach(([key, prog]) => {
      if (key.startsWith(`${chapterId}_`)) {
        if (prog.completedLevels.length >= 1) {
          completedTopicsCount += 1;
        }
        totalLevelsCompleted += prog.completedLevels.length;
        if (prog.bestWpm > maxWpm) maxWpm = prog.bestWpm;
        if (prog.avgAccuracy > 0) {
          sumAccuracy += prog.avgAccuracy;
          accuracyCount += 1;
        }
      }
    });

    const completionPercentage = totalTopics > 0 
      ? Math.round((completedTopicsCount / totalTopics) * 100) 
      : 0;

    const avgAccuracy = accuracyCount > 0 
      ? Math.round(sumAccuracy / accuracyCount) 
      : 0;

    return {
      completedTopicsCount,
      totalLevelsCompleted,
      completionPercentage,
      bestWpm: maxWpm,
      avgAccuracy
    };
  }, [state.topicProgress]);

  // Save a completed session attempt
  const saveSessionAttempt = useCallback((
    chapterId: string,
    topicId: string,
    classNum: 11 | 12,
    level: 1 | 2 | 3 | 4 | 5,
    attempt: LevelAttemptRecord
  ) => {
    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      if (prev.lastActiveDate !== today) {
        const last = new Date(prev.lastActiveDate);
        const cur = new Date(today);
        const diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 3600 * 24));
        newStreak = diffDays === 1 ? prev.streak + 1 : 1;
      }

      const key = `${chapterId}_${topicId}`;
      const existing = prev.topicProgress[key] || {
        topicId,
        chapterId,
        classNum,
        unlockedLevel: 1,
        completedLevels: [],
        bestWpm: 0,
        avgWpm: 0,
        bestAccuracy: 0,
        avgAccuracy: 0,
        totalAttempts: 0,
        attemptsByLevel: {}
      };

      const levelAttempts = existing.attemptsByLevel[level] || [];
      const updatedLevelAttempts = [...levelAttempts, attempt];

      // Mark level completed if accuracy is at least 50% or attempted
      const completedLevelsSet = new Set(existing.completedLevels);
      completedLevelsSet.add(level);

      // Determine new unlocked level
      let newUnlocked = Math.max(existing.unlockedLevel, level);
      const nextLevel = level + 1;
      if (nextLevel <= 5) {
        const required = LEVEL_UNLOCK_THRESHOLDS[nextLevel] ?? 0;
        if (attempt.accuracyPercentage >= required) {
          newUnlocked = Math.max(newUnlocked, nextLevel);
        }
      }

      // Calculate new aggregated WPM and Accuracy
      const allAttempts: LevelAttemptRecord[] = [];
      Object.entries({
        ...existing.attemptsByLevel,
        [level]: updatedLevelAttempts
      }).forEach(([, atts]) => allAttempts.push(...atts));

      const bestWpm = Math.max(...allAttempts.map(a => a.wpm), 0);
      const avgWpm = Math.round(allAttempts.reduce((acc, a) => acc + a.wpm, 0) / allAttempts.length);
      const bestAccuracy = Math.max(...allAttempts.map(a => a.accuracyPercentage), 0);
      const avgAccuracy = Math.round(allAttempts.reduce((acc, a) => acc + a.accuracyPercentage, 0) / allAttempts.length);

      const updatedTopicProgress: TopicProgressRecord = {
        ...existing,
        unlockedLevel: newUnlocked,
        completedLevels: Array.from(completedLevelsSet).sort((a, b) => a - b),
        bestWpm,
        avgWpm,
        bestAccuracy,
        avgAccuracy,
        totalAttempts: existing.totalAttempts + 1,
        attemptsByLevel: {
          ...existing.attemptsByLevel,
          [level]: updatedLevelAttempts
        }
      };

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
        totalWordsRead: prev.totalWordsRead + attempt.wordCount,
        totalSessions: prev.totalSessions + 1,
        topicProgress: {
          ...prev.topicProgress,
          [key]: updatedTopicProgress
        }
      };
    });
  }, []);

  // Overall Global Stats for Dashboard Cards
  const globalStats = useMemo(() => {
    let totalLevelsCompleted = 0;
    let bestGlobalWpm = 0;
    let sumAcc = 0;
    let accCount = 0;

    Object.values(state.topicProgress).forEach(prog => {
      totalLevelsCompleted += prog.completedLevels.length;
      if (prog.bestWpm > bestGlobalWpm) bestGlobalWpm = prog.bestWpm;
      if (prog.avgAccuracy > 0) {
        sumAcc += prog.avgAccuracy;
        accCount += 1;
      }
    });

    const averageAccuracy = accCount > 0 ? Math.round(sumAcc / accCount) : 0;

    return {
      streak: state.streak,
      totalWordsRead: state.totalWordsRead,
      bestWpm: bestGlobalWpm,
      averageAccuracy,
      totalLevelsCompleted,
      totalSessions: state.totalSessions
    };
  }, [state]);

  // Smart Recommendation based on student's performance
  const recommendation = useMemo(() => {
    if (state.totalSessions === 0) {
      return {
        title: 'Start with Foundation Reading',
        badge: 'Recommended for You',
        text: 'Kickstart your daily NEET Biology reading practice with Class 11 "The Living World" Level 1 to establish baseline reading speed and recall.',
        targetChapterId: 'nb1',
        targetTopicId: 'nb1t1',
        targetClass: 11 as const,
        targetLevel: 1 as const
      };
    }

    if (globalStats.bestWpm > 180 && globalStats.averageAccuracy < 75) {
      return {
        title: 'Focus on Comprehension Accuracy',
        badge: 'Accuracy Calibration',
        text: 'Your reading speed is impressive, but comprehension dropped below 75%. Try slowing down slightly on dense Level 3 NEET passages to catch subtle negative keywords.',
        targetChapterId: 'nb8',
        targetTopicId: 'nb8t1',
        targetClass: 11 as const,
        targetLevel: 3 as const
      };
    }

    if (globalStats.averageAccuracy >= 85 && globalStats.bestWpm < 160) {
      return {
        title: 'Train for Higher Reading Velocity',
        badge: 'Speed Accelerator',
        text: 'Your comprehension is stellar (85%+)! Push your reading velocity on Level 2 & 3 passages to save precious minutes for NEET physics and chemistry numericals.',
        targetChapterId: 'nb32',
        targetTopicId: 'nb32t1',
        targetClass: 12 as const,
        targetLevel: 2 as const
      };
    }

    return {
      title: 'Advance to NEET Challenge Level',
      badge: 'Next Milestone',
      text: 'You maintain strong equilibrium between speed and recall. Tackle Level 4 and Level 5 assertion-reason passages to solidify top-percentile readiness.',
      targetChapterId: 'nb1',
      targetTopicId: 'nb1t1',
      targetClass: 11 as const,
      targetLevel: 4 as const
    };
  }, [state.totalSessions, globalStats]);

  return {
    state,
    globalStats,
    recommendation,
    isLevelUnlocked,
    getTopicProgress,
    getChapterProgress,
    saveSessionAttempt
  };
}
