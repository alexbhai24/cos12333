import React from 'react';
import { Check, Flame, Star, Edit3 } from 'lucide-react';
import { Habit, HabitLogs, HabitSettings } from '../../types/habitRadar';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';
import { formatDateKey, habitRadarStorage } from '../../utils/habitRadarStorage';

interface HabitRadarWeeklyViewProps {
  habits: Habit[];
  logs: HabitLogs;
  settings: HabitSettings;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onEditHabit: (habit: Habit) => void;
}

const ALL_DAYS = [
  { dayIndex: 1, name: 'Mon' },
  { dayIndex: 2, name: 'Tue' },
  { dayIndex: 3, name: 'Wed' },
  { dayIndex: 4, name: 'Thu' },
  { dayIndex: 5, name: 'Fri' },
  { dayIndex: 6, name: 'Sat' },
  { dayIndex: 0, name: 'Sun' },
];

export const HabitRadarWeeklyView: React.FC<HabitRadarWeeklyViewProps> = ({
  habits,
  logs,
  settings,
  onToggleDay,
  onEditHabit,
}) => {
  // Compute current week's 7 dates based on weekStartOn
  const today = new Date();
  const todayDay = today.getDay(); // 0 is Sunday, 1 is Monday ...

  // Calculate start of week
  let startOffset = 0;
  if (settings.weekStartOn === 'Monday') {
    startOffset = todayDay === 0 ? -6 : 1 - todayDay;
  } else if (settings.weekStartOn === 'Sunday') {
    startOffset = -todayDay;
  } else if (settings.weekStartOn === 'Saturday') {
    startOffset = todayDay === 6 ? 0 : -(todayDay + 1);
  }

  const weekDays: { date: Date; dateStr: string; label: string; isToday: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + startOffset + i);
    const dayOfWeek = d.getDay();
    const found = ALL_DAYS.find(ad => ad.dayIndex === dayOfWeek);
    const dateStr = formatDateKey(d);
    weekDays.push({
      date: d,
      dateStr,
      label: found ? found.name : 'Day',
      isToday: dateStr === formatDateKey(today),
    });
  }

  return (
    <div className="space-y-4 pb-24">
      {habits.map(habit => {
        const IconComp = LUCIDE_ICONS_MAP[habit.icon];
        const streak = habitRadarStorage.calculateStreak(habit.id, logs);

        return (
          <div
            key={habit.id}
            className="rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-lg border relative group"
            style={{
              backgroundColor: `color-mix(in srgb, ${habit.color} 8%, #14151a)`,
              borderColor: `color-mix(in srgb, ${habit.color} 15%, #2a2b3d)`,
            }}
          >
            {/* Top Row: Habit info */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => onEditHabit(habit)}
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 cursor-pointer transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${habit.color} 20%, transparent)`,
                  }}
                >
                  {IconComp ? (
                    <IconComp className="w-5 h-5" style={{ color: habit.color }} />
                  ) : (
                    <span className="text-xl">{habit.icon}</span>
                  )}
                </div>

                <div>
                  <h3
                    onClick={() => onEditHabit(habit)}
                    className="font-bold text-sm text-white tracking-wide cursor-pointer hover:text-white/80 transition-colors"
                  >
                    {habit.name}
                  </h3>
                  {settings.showStreakOn.weekly && streak > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 mt-0.5">
                      <Flame className="w-3 h-3 fill-amber-500" />
                      <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-white/40">Everyday</span>
                <button
                  onClick={() => onEditHabit(habit)}
                  className="p-1.5 text-slate-600 hover:text-white rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 absolute right-2 top-2"
                  title="Edit habit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Row: 7 Days Horizontal Strip */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {weekDays.map(({ dateStr, label, isToday }) => {
                const habitLog = logs[habit.id]?.[dateStr];
                const isCompleted = habitLog?.completed ?? false;
                const count = habitLog?.count ?? 0;
                const isAmount = habit.trackType === 'amount';
                const targetAmount = habit.targetAmount || 1;

                return (
                  <div
                    key={dateStr}
                    className="flex flex-col items-center gap-2 py-2 rounded-[20px] transition-all"
                    style={{
                      backgroundColor: isToday ? `color-mix(in srgb, ${habit.color} 15%, transparent)` : 'transparent',
                    }}
                  >
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        isToday ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>

                    {/* Check / Status Circle */}
                    <button
                      onClick={() => onToggleDay(habit.id, dateStr)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'shadow-[0_2px_10px_rgba(0,0,0,0.3)] scale-105'
                          : 'border border-slate-600 hover:border-slate-400 text-slate-400'
                      }`}
                      style={{
                        backgroundColor: isCompleted ? habit.color : 'transparent',
                        color: isCompleted ? '#000' : undefined,
                        borderColor: isCompleted ? habit.color : undefined,
                      }}
                      title={`${label} (${dateStr}): ${isCompleted ? 'Completed' : 'Click to complete'}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                      ) : isAmount ? (
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold">
                          {count}/{targetAmount}
                        </span>
                      ) : null}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
