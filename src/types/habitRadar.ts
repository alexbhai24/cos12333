export type HabitTrackType = 'task' | 'amount' | 'time';
export type HabitRepeatType = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string; // Lucide icon name or emoji
  color: string; // Hex color
  trackType: HabitTrackType;
  targetAmount?: number; // e.g., 4 times for water
  targetMinutes?: number; // e.g., 15 for 15min reading/study
  unit?: string; // e.g., 'times', 'pages', 'L', 'km'
  repeatType: HabitRepeatType;
  repeatDays?: number[]; // [1, 2, 3, 4, 5, 6, 7] for Mon-Sun
  repeatMonthlyDays?: number[]; // [13, 14] for specific days of month
  reminders?: string[]; // e.g. ['08:00', '20:00']
  createdAt: string;
}

export interface DayLog {
  completed: boolean;
  count?: number; // for 'amount'
  elapsedSeconds?: number; // for 'time'
}

export interface HabitLogs {
  // habitId -> dateStr (YYYY-MM-DD) -> DayLog
  [habitId: string]: {
    [dateStr: string]: DayLog;
  };
}

export interface HabitSettings {
  weekStartOn: 'Saturday' | 'Sunday' | 'Monday';
  sounds: boolean;
  dailyNudges: boolean;
  cardDensity: 'comfortable' | 'compact';
  showStreakOn: {
    today: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  showHijriDate: boolean;
  language: string;
  themeColor: string;
}

export const PASTEL_COLORS = [
  '#c4b5fd', // lavender
  '#86efac', // mint
  '#fdba74', // peach
  '#f472b6', // pink
  '#fde047', // butter yellow
  '#a7f3d0', // pastel emerald
  '#67e8f9', // cyan
  '#93c5fd', // soft blue
  '#d8b4fe', // lilac
  '#fbcfe8', // candy pink
  '#7dd3fc', // sky
  '#fed7aa', // apricot
  '#5eead4', // turquoise
  '#fca5a5', // coral
  '#fef08a', // light yellow
  '#bbf7d0', // light green
  '#60a5fa', // bright blue
  '#cbd5e1', // silver grey
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit_1',
    name: '100 push up',
    description: 'Upper body strength and endurance',
    icon: 'dumbbell',
    color: '#f472b6',
    trackType: 'task',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_2',
    name: '50 sit up',
    description: 'Core stability and abdominal strength',
    icon: 'flame',
    color: '#fdba74',
    trackType: 'task',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_3',
    name: 'Water 4L',
    description: 'Stay hydrated throughout the day',
    icon: 'droplets',
    color: '#67e8f9',
    trackType: 'amount',
    targetAmount: 4,
    unit: 'times',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_4',
    name: 'Physics',
    description: 'Problem solving and numerical practice',
    icon: 'clock',
    color: '#c4b5fd',
    trackType: 'task',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_5',
    name: 'Chem',
    description: 'Organic reactions and formula revisions',
    icon: 'star',
    color: '#c4b5fd',
    trackType: 'task',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_6',
    name: 'Biology',
    description: 'NCERT diagrams and concepts review',
    icon: 'star',
    color: '#fde047',
    trackType: 'task',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_7',
    name: 'Reading 10 pages',
    description: 'Academic and growth book reading',
    icon: 'book',
    color: '#86efac',
    trackType: 'amount',
    targetAmount: 10,
    unit: 'pages',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_8',
    name: 'Read',
    description: 'Focused deep reading session',
    icon: 'book-open',
    color: '#d8b4fe',
    trackType: 'time',
    targetMinutes: 15,
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_9',
    name: 'Walking 5km',
    description: 'Daily cardiovascular active recovery',
    icon: 'footprints',
    color: '#5eead4',
    trackType: 'amount',
    targetAmount: 5,
    unit: 'times',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_10',
    name: 'Wake up 6am',
    description: 'Consistent circadian rhythm start',
    icon: 'sunrise',
    color: '#fdba74',
    trackType: 'task',
    repeatType: 'daily',
    repeatDays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: HabitSettings = {
  weekStartOn: 'Monday',
  sounds: true,
  dailyNudges: true,
  cardDensity: 'comfortable',
  showStreakOn: {
    today: true,
    weekly: true,
    monthly: true,
  },
  showHijriDate: false,
  language: 'English',
  themeColor: 'dark',
};
