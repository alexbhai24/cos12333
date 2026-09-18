import { useState, useEffect, useCallback } from 'react';
import { DailyQuestion, SubjectKey } from '../types/dailyStatus';
import { DEFAULT_DAILY_QUESTIONS } from '../data/defaultDailyStatusQuestions';

const DAILY_QUESTIONS_KEY = 'cosmic_daily_questions_v1';
const USER_ANSWERS_KEY = 'cosmic_user_daily_answers_v1';

export const useDailyStatus = () => {
  const [questionsMap, setQuestionsMap] = useState<Record<SubjectKey, DailyQuestion[]>>(DEFAULT_DAILY_QUESTIONS);
  const [userAnswers, setUserAnswers] = useState<Record<string, Record<string, number>>>({}); // subject -> { qId: selectedIndex }
  const [completedSubjects, setCompletedSubjects] = useState<string[]>([]);

  // Load daily questions & user progress
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem(DAILY_QUESTIONS_KEY);
      if (storedQuestions) {
        setQuestionsMap(JSON.parse(storedQuestions));
      } else {
        localStorage.setItem(DAILY_QUESTIONS_KEY, JSON.stringify(DEFAULT_DAILY_QUESTIONS));
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const storedAnswers = localStorage.getItem(USER_ANSWERS_KEY);
      if (storedAnswers) {
        const parsed = JSON.parse(storedAnswers);
        if (parsed.date === todayStr) {
          setUserAnswers(parsed.answers || {});
          setCompletedSubjects(parsed.completedSubjects || []);
        } else {
          // Reset answers for new date
          localStorage.setItem(USER_ANSWERS_KEY, JSON.stringify({ date: todayStr, answers: {}, completedSubjects: [] }));
        }
      }
    } catch (e) {
      console.error('Failed to load daily status data:', e);
    }
  }, []);

  // Save questions map (for Creator Studio updates)
  const saveQuestionsMap = useCallback((newMap: Record<SubjectKey, DailyQuestion[]>) => {
    try {
      localStorage.setItem(DAILY_QUESTIONS_KEY, JSON.stringify(newMap));
      setQuestionsMap(newMap);
    } catch (e) {
      console.error('Failed to save daily questions:', e);
    }
  }, []);

  // Record an answer
  const answerQuestion = useCallback((subject: SubjectKey, questionId: string, optionIndex: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setUserAnswers(prev => {
      const subjectAnswers = { ...(prev[subject] || {}), [questionId]: optionIndex };
      const updated = { ...prev, [subject]: subjectAnswers };
      
      // Check if all questions for this subject are answered
      const subjectQs = questionsMap[subject] || [];
      const isAllAnswered = subjectQs.length > 0 && subjectQs.every(q => subjectAnswers[q.id] !== undefined);
      
      let nextCompleted = completedSubjects;
      if (isAllAnswered && !completedSubjects.includes(subject)) {
        nextCompleted = [...completedSubjects, subject];
        setCompletedSubjects(nextCompleted);
      }

      localStorage.setItem(USER_ANSWERS_KEY, JSON.stringify({
        date: todayStr,
        answers: updated,
        completedSubjects: nextCompleted
      }));

      return updated;
    });
  }, [questionsMap, completedSubjects]);

  return {
    questionsMap,
    saveQuestionsMap,
    userAnswers,
    completedSubjects,
    answerQuestion
  };
};
