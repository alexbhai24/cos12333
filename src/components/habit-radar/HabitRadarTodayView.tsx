import React from 'react';
import {
  Check, Plus, Play, Flame, MoreVertical, Edit3
} from 'lucide-react';
import { Habit, HabitLogs, HabitSettings } from '../../types/habitRadar';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';
import { formatDateKey } from '../../utils/habitRadarStorage';

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
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 pb-24`}>
      {habits.map(habit => {
        const habitLog = logs[habit.id]?.[todayStr];
        const isCompleted = habitLog?.completed ?? false;
        const currentCount = habitLog?.count ?? 0;
        const targetAmount = habit.targetAmount || 1;
        const IconComp = LUCIDE_ICONS_MAP[habit.icon];

        // Format time for timer tasks (assuming currentCount is in seconds)
        const formatTime = (secs: number) => {
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };
        const currentFormattedTime = formatTime(currentCount);
        const targetFormattedTime = `${String(habit.targetMinutes || 15).padStart(2, '0')}:00`;

        // Calculate streak
        let streak = 0;
        const checkDate = new Date();
        const checkTodayStr = formatDateKey(checkDate);
        if (logs[habit.id]?.[checkTodayStr]?.completed) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          checkDate.setDate(checkDate.getDate() - 1);
          if (!logs[habit.id]?.[formatDateKey(checkDate)]?.completed) {
            streak = 0;
          }
        }
        while (streak > 0) {
          const dateStr = formatDateKey(checkDate);
          if (logs[habit.id]?.[dateStr]?.completed) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

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

                {settings.showStreakOn.today && (
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-amber-500">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 ml-4 w-[85px]">
              {/* Task Type: Simple Checkbox Circle */}
              {habit.trackType === 'task' && (
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
                  {isCompleted && <Check className="w-5 h-5 stroke-[2.5]" />}
                </button>
              )}

              {/* Amount Type: Counter Stepper (+ Button) */}
              {habit.trackType === 'amount' && (
                <>
                  <button
                    onClick={() => onToggleDay(habit.id, todayStr)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? 'shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105'
                        : 'border-[1px] border-white/20 hover:border-white/40 text-white/50 hover:text-white/80'
                    }`}
                    style={{
                      backgroundColor: isCompleted ? habit.color : 'transparent',
                      color: isCompleted ? '#111' : undefined,
                      borderColor: isCompleted ? habit.color : undefined,
                    }}
                    title="Tap to increment"
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[1.5]" />
                    )}
                  </button>
                  <span className="text-[9px] sm:text-[10px] font-medium text-white/40 whitespace-nowrap text-center">
                    {currentCount} / {targetAmount} times
                  </span>
                </>
              )}

              {/* Time Type: Timer Trigger Button */}
              {habit.trackType === 'time' && (
                <>
                  <button
                    onClick={() => onOpenTimer(habit)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? 'shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105'
                        : 'border-[1px] border-white/20 hover:border-white/40 text-white/50 hover:text-white/80'
                    }`}
                    style={{
                      backgroundColor: isCompleted ? habit.color : 'transparent',
                      color: isCompleted ? '#111' : undefined,
                      borderColor: isCompleted ? habit.color : undefined,
                    }}
                    title="Launch focus timer"
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <span className="text-[9px] sm:text-[10px] font-medium text-white/40 whitespace-nowrap text-center">
                    {currentFormattedTime} / {targetFormattedTime}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
