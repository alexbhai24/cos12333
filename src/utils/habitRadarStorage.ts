import { Habit, HabitLogs, HabitSettings, DEFAULT_HABITS, DEFAULT_SETTINGS, DayLog } from '../types/habitRadar';

const STORAGE_KEYS = {
  HABITS: 'cosmic_habit_radar_habits_v1',
  LOGS: 'cosmic_habit_radar_logs_v1',
  SETTINGS: 'cosmic_habit_radar_settings_v1',
  ONBOARDING: 'cosmic_habit_radar_onboarding_v1',
};

// Date helper: returns 'YYYY-MM-DD'
export function formatDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Sound player (supports tick completion vs normal increment)
export function playSoftTickSound(enabled = true, isCompletion = false) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const soundFile = isCompletion 
      ? '/notevibes-timeline.mp3' 
      : '/universfield-click-button-140881.mp3';
      
    const audio = new Audio(soundFile);
    audio.volume = isCompletion ? 1.0 : 0.4;
    audio.play().catch(() => {});
  } catch (e) {
    console.error('Audio play error:', e);
  }
}

// Storage helpers
export const habitRadarStorage = {
  getHabits(): Habit[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    // Return empty array by default (no pre-existing dummy habits)
    return [];
  },

  hasCompletedOnboarding(): boolean {
    try {
      const habits = this.getHabits();
      if (habits.length > 0) return true;
      const val = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return val === 'true';
    } catch {
      return false;
    }
  },

  setOnboardingCompleted(completed = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, completed ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save onboarding status:', e);
    }
  },

  saveHabits(habits: Habit[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  },

  getLogs(): HabitLogs {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {};
  },

  saveLogs(logs: HabitLogs) {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save habit logs:', e);
    }
  },

  getSettings(): HabitSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: HabitSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save habit settings:', e);
    }
  },

  // Seed recent completions so the weekly and monthly grids look alive on first load
  seedInitialLogs() {
    const today = new Date();
    const logs: HabitLogs = {};

    const habitsToSeed = [
      { id: 'habit_1', daysBack: [0, 1] },
      { id: 'habit_2', daysBack: [0, 1] },
      { id: 'habit_4', daysBack: [0, 1, 3] },
      { id: 'habit_5', daysBack: [0, 2] },
      { id: 'habit_7', daysBack: [0, 1] },
    ];

    habitsToSeed.forEach(({ id, daysBack }) => {
      logs[id] = {};
      daysBack.forEach(offset => {
        const d = new Date(today);
        d.setDate(d.getDate() - offset);
        logs[id][formatDateKey(d)] = { completed: true, count: 1 };
      });
    });

    this.saveLogs(logs);
  },

  // Toggle habit for a given date
  toggleHabitDay(habitId: string, dateStr: string, soundEnabled = true): HabitLogs {
    const logs = this.getLogs();
    const habitLogs = logs[habitId] || {};
    const current = habitLogs[dateStr];

    const habits = this.getHabits();
    const habit = habits.find(h => h.id === habitId);

    let nextLog: DayLog;
    if (habit?.trackType === 'amount') {
      const target = habit.targetAmount || 1;
      const currentCount = current?.count || 0;
      if (current?.completed || currentCount >= target) {
        nextLog = { completed: false, count: 0 };
      } else {
        // Single click completion for targets > 10 (e.g., 5000 steps), step increment for smaller targets <= 10
        const newCount = target > 10 ? target : currentCount + 1;
        nextLog = { completed: newCount >= target, count: newCount };
      }
    } else {
      const isCompleted = !(current?.completed);
      nextLog = { completed: isCompleted };
    }

    if (nextLog.completed) {
      playSoftTickSound(soundEnabled, true);
    } else if (habit?.trackType === 'amount' && nextLog.count && nextLog.count > 0) {
      playSoftTickSound(soundEnabled, false);
    }

    logs[habitId] = {
      ...habitLogs,
      [dateStr]: nextLog,
    };

    this.saveLogs(logs);
    return logs;
  },

  // Calculate current streak in continuous days
  calculateStreak(habitId: string, logs: HabitLogs): number {
    const habitLogs = logs[habitId];
    if (!habitLogs) return 0;

    let streak = 0;
    const checkDate = new Date();
    const todayStr = formatDateKey(checkDate);

    // If completed today, count today and go backwards
    if (habitLogs[todayStr]?.completed) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If not completed today, check if completed yesterday to keep streak active
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = formatDateKey(checkDate);
      if (!habitLogs[yesterdayStr]?.completed) {
        return 0;
      }
    }

    // Continue checking previous days
    while (true) {
      const dateStr = formatDateKey(checkDate);
      if (habitLogs[dateStr]?.completed) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  // Get total days completed for a habit
  getTotalCompletions(habitId: string, logs: HabitLogs): number {
    const habitLogs = logs[habitId];
    if (!habitLogs) return 0;
    return Object.values(habitLogs).filter(l => l.completed).length;
  },

  // Export full backup as JSON
  exportBackup(): string {
    const backup = {
      habits: this.getHabits(),
      logs: this.getLogs(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import full backup JSON
  importBackup(jsonData: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.habits)) {
          this.saveHabits(parsed.habits);
        }
        if (parsed.logs && typeof parsed.logs === 'object') {
          this.saveLogs(parsed.logs);
        }
        if (parsed.settings && typeof parsed.settings === 'object') {
          this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        }
        return { success: true };
      }
      return { success: false, error: 'Invalid backup file format' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to parse JSON file' };
    }
  },

  // Clear all habits and progress
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HABITS);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify({}));
    } catch (e) {
      console.error('Failed to clear data:', e);
    }
  },

  // Restore default pre-existing sample habits
  restoreDefaultHabits() {
    this.saveHabits(DEFAULT_HABITS);
    this.seedInitialLogs();
    return DEFAULT_HABITS;
  },
};

