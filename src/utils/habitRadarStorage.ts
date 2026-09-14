import { Habit, HabitLogs, HabitSettings, DEFAULT_HABITS, DEFAULT_SETTINGS, DayLog } from '../types/habitRadar';
import { auth } from '../firebase';

const STORAGE_KEYS = {
  HABITS: 'cosmic_habit_radar_habits_v1',
  LOGS: 'cosmic_habit_radar_logs_v1',
  SETTINGS: 'cosmic_habit_radar_settings_v1',
  ONBOARDING: 'cosmic_habit_radar_onboarding_v1',
};

// Returns user-scoped storage key so logging out / switching accounts isolates habits cleanly
function getScopedKey(baseKey: string): string {
  try {
    const user = auth.currentUser;
    const identifier = user?.uid || user?.email || 'guest';
    const sanitized = identifier.replace(/[^a-zA-Z0-9_-]/g, '_');
    const scopedKey = `${baseKey}_${sanitized}`;

    // If scoped key has no data yet, but un-scoped legacy baseKey exists, migrate it once
    if (user && typeof window !== 'undefined' && localStorage.getItem(scopedKey) === null) {
      const legacyVal = localStorage.getItem(baseKey);
      if (legacyVal !== null) {
        localStorage.setItem(scopedKey, legacyVal);
      }
    }
    return scopedKey;
  } catch {
    return baseKey;
  }
}

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
      const key = getScopedKey(STORAGE_KEYS.HABITS);
      const stored = localStorage.getItem(key);
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
      const key = getScopedKey(STORAGE_KEYS.ONBOARDING);
      const val = localStorage.getItem(key);
      return val === 'true';
    } catch {
      return false;
    }
  },

  setOnboardingCompleted(completed = true) {
    try {
      const key = getScopedKey(STORAGE_KEYS.ONBOARDING);
      localStorage.setItem(key, completed ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save onboarding status:', e);
    }
  },

  saveHabits(habits: Habit[]) {
    try {
      const key = getScopedKey(STORAGE_KEYS.HABITS);
      localStorage.setItem(key, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  },

  getLogs(): HabitLogs {
    try {
      const key = getScopedKey(STORAGE_KEYS.LOGS);
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {};
  },

  saveLogs(logs: HabitLogs) {
    try {
      const key = getScopedKey(STORAGE_KEYS.LOGS);
      localStorage.setItem(key, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save habit logs:', e);
    }
  },

  getSettings(): HabitSettings {
    try {
      const key = getScopedKey(STORAGE_KEYS.SETTINGS);
      const stored = localStorage.getItem(key);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: HabitSettings) {
    try {
      const key = getScopedKey(STORAGE_KEYS.SETTINGS);
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save habit settings:', e);
    }
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
      if (Array.isArray(parsed)) {
        this.saveHabits(parsed);
        this.saveLogs({});
        return { success: true };
      }
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.habits)) {
          this.saveHabits(parsed.habits);
        }
        if (parsed.logs && typeof parsed.logs === 'object') {
          this.saveLogs(parsed.logs);
        } else {
          this.saveLogs({});
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
      const hKey = getScopedKey(STORAGE_KEYS.HABITS);
      const lKey = getScopedKey(STORAGE_KEYS.LOGS);
      localStorage.removeItem(hKey);
      localStorage.removeItem(lKey);
      localStorage.setItem(hKey, JSON.stringify([]));
      localStorage.setItem(lKey, JSON.stringify({}));
    } catch (e) {
      console.error('Failed to clear data:', e);
    }
  },

  // Restore default starter habits with zero unticked streaks
  restoreDefaultHabits() {
    this.saveHabits(DEFAULT_HABITS);
    this.saveLogs({});
    return DEFAULT_HABITS;
  },
};

