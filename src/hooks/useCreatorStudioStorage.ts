import { useState, useEffect, useCallback } from 'react';
import { CustomTest } from '../types/creatorStudio';

const TEST_STORAGE_KEY = 'cosmic_custom_tests_v1';

export const useCreatorStudioStorage = () => {
  const [tests, setTests] = useState<CustomTest[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEST_STORAGE_KEY);
      if (stored) {
        setTests(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load custom tests', e);
    }
  }, []);

  const saveTests = useCallback((newTests: CustomTest[]) => {
    try {
      localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(newTests));
      setTests(newTests);
    } catch (e) {
      console.error('Failed to save custom tests', e);
    }
  }, []);

  const addTest = useCallback((test: CustomTest) => {
    saveTests([...tests, test]);
  }, [tests, saveTests]);

  const updateTest = useCallback((id: string, updates: Partial<CustomTest>) => {
    saveTests(tests.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [tests, saveTests]);

  const deleteTest = useCallback((id: string) => {
    saveTests(tests.filter(t => t.id !== id));
  }, [tests, saveTests]);

  return { tests, addTest, updateTest, deleteTest };
};
