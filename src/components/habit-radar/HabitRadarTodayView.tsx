import React from 'react';
import {
  Check, Play, Flame, MoreVertical, Edit3
} from 'lucide-react';
import { Habit, HabitLogs, HabitSettings } from '../../types/habitRadar';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';
import { formatDateKey, habitRadarStorage } from '../../utils/habitRadarStorage';

interface HabitRadarTodayViewProps {
  habits: Habit[];
  logs: HabitLogs;
  settings: HabitSettings;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onOpenTimer: (habit: Habit) => void;
  onEditHabit: (habit: Habit) => void;
}

export const HabitRadarTodayView: React.FC<HabitRadarTodayViewProps> = ({
  habits,
  logs,
  settings,
  onToggleDay,
  onOpenTimer,
  onEditHabit,
}) => {
  const todayStr = formatDateKey(new Date());

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
          <Flame className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No habits added yet</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Tap the + button to create your first daily habit and start building streaks!
        </p>
      </div>
    );
  }

  const isCompact = settings.cardDensity === 'compact';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 pb-28`}>
      {habits.map(habit => {
        const habitLog = logs[habit.id]?.[todayStr];
        const isCompleted = habitLog?.completed ?? false;
        const IconComp = LUCIDE_ICONS_MAP[habit.icon];
        const streak = habitRadarStorage.calculateStreak(habit.id, logs);

        return (
          <div
            key={habit.id}
            className={`group rounded-3xl transition-all duration-300 flex items-center justify-between border shadow-lg shadow-black/20 ${
              isCompact ? 'px-4 py-3' : 'px-4 sm:px-5 py-4'
            }`}
            style={{
              backgroundColor: `color-mix(in srgb, ${habit.color} 12%, #181925)`,
              borderColor: `color-mix(in srgb, ${habit.color} 25%, #2a2b3d)`,
            }}
          >
            {/* Left: Icon & Habit Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                onClick={() => onEditHabit(habit)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] flex items-center justify-center shrink-0 cursor-pointer transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${habit.color}20`,
                }}
              >
                {IconComp ? (
                  <IconComp className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: habit.color }} />
                ) : (
                  <span className="text-2xl sm:text-3xl">{habit.icon}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    onClick={() => onEditHabit(habit)}
                    className="font-bold text-sm sm:text-base text-white tracking-wide truncate cursor-pointer hover:text-white/80 transition-colors"
                  >
                    {habit.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {settings.showStreakOn.today && streak > 0 && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
                    </div>
                  )}

                  {habit.trackType === 'amount' && habit.targetAmount && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Target: {habit.targetAmount} {habit.unit || ''}
                    </span>
                  )}
                  {habit.trackType === 'time' && habit.targetMinutes && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Target: {habit.targetMinutes}m
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Single Tap Action Button */}
            <div className="flex flex-col items-center justify-center shrink-0 ml-4">
              <button
                onClick={() => onToggleDay(habit.id, todayStr)}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isCompleted
                    ? 'shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105'
                    : 'border-[1.5px] border-white/20 hover:border-white/40 text-transparent hover:text-white/20'
                }`}
                style={{
                  backgroundColor: isCompleted ? habit.color : 'transparent',
                  color: isCompleted ? '#111' : undefined,
                  borderColor: isCompleted ? habit.color : undefined,
                }}
                title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Check className="w-5 h-5 opacity-0 group-hover:opacity-40" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
