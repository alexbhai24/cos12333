import React from 'react';
import { Flame, Check, Trophy, Calendar, Target, Edit3 } from 'lucide-react';
import { Habit, HabitLogs, HabitSettings } from '../../types/habitRadar';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';
import { formatDateKey } from '../../utils/habitRadarStorage';

interface HabitRadarOverallViewProps {
  habits: Habit[];
  logs: HabitLogs;
  settings: HabitSettings;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onEditHabit: (habit: Habit) => void;
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const HabitRadarOverallView: React.FC<HabitRadarOverallViewProps> = ({
  habits,
  logs,
  settings,
  onToggleDay,
  onEditHabit,
}) => {
  const today = new Date();
  const todayStr = formatDateKey(today);

  // Generate 26 weeks (approx 6 months) of dates grouped into 7 rows (Mon-Sun)
  const WEEKS_COUNT = 32;
  const gridColumns: { dateStr: string; dayIndex: number; isToday: boolean }[][] = [];

  // Start from Sunday of current week and go backwards WEEKS_COUNT weeks
  const endDate = new Date(today);
  const currentDayOfWeek = endDate.getDay(); // 0 is Sun, 1 is Mon...
  const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
  endDate.setDate(endDate.getDate() + daysUntilSunday);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (WEEKS_COUNT * 7 - 1));

  // Build columns
  for (let w = 0; w < WEEKS_COUNT; w++) {
    const col: { dateStr: string; dayIndex: number; isToday: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (w * 7 + d));
      const dateStr = formatDateKey(date);
      col.push({
        dateStr,
        dayIndex: d,
        isToday: dateStr === todayStr,
      });
    }
    gridColumns.push(col);
  }

  return (
    <div className="space-y-4 pb-24">
      {habits.map(habit => {
        const IconComp = LUCIDE_ICONS_MAP[habit.icon];
        const todayLog = logs[habit.id]?.[todayStr];
        const isTodayCompleted = todayLog?.completed ?? false;

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

        // Total completions
        const totalCompleted = Object.values(logs[habit.id] || {}).filter(l => l.completed).length;

        return (
          <div
            key={habit.id}
            className="bg-[#121422]/70 hover:bg-[#15182a]/90 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 rounded-2xl p-5 space-y-4 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  onClick={() => onEditHabit(habit)}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 cursor-pointer shadow-inner"
                  style={{
                    backgroundColor: `${habit.color}20`,
                    borderColor: `${habit.color}40`,
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
                    className="font-bold text-sm sm:text-base text-white tracking-wide cursor-pointer hover:text-purple-300 transition-colors"
                  >
                    {habit.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {streak} {streak === 1 ? 'Day' : 'Days'}
                    </span>
                    <span>·</span>
                    <span>{totalCompleted} total check-ins</span>
                  </div>
                </div>
              </div>

              {/* Right Toggle */}
              <button
                onClick={() => onToggleDay(habit.id, todayStr)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isTodayCompleted
                    ? 'shadow-md scale-105 text-black'
                    : 'border border-white/15 text-transparent hover:border-white/30'
                }`}
                style={{
                  backgroundColor: isTodayCompleted ? habit.color : 'transparent',
                }}
                title="Toggle today"
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Horizontal GitHub-Style 7-Row Contribution Heatmap */}
            <div className="flex items-start gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {/* Row day labels */}
              <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-500 pr-1 select-none pt-0.5">
                {WEEK_DAYS.map((d, i) => (
                  <span key={i} className="h-3.5 flex items-center">
                    {d}
                  </span>
                ))}
              </div>

              {/* Matrix Columns */}
              <div className="flex items-center gap-1">
                {gridColumns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1">
                    {col.map(({ dateStr, isToday }) => {
                      const isCompleted = logs[habit.id]?.[dateStr]?.completed ?? false;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => onToggleDay(habit.id, dateStr)}
                          className={`w-3.5 h-3.5 rounded-[4px] transition-transform hover:scale-125 cursor-pointer ${
                            isCompleted
                              ? 'shadow-xs'
                              : isToday
                              ? 'bg-[#2b2e40] ring-1 ring-white/30'
                              : 'bg-[#1b1d28] hover:bg-[#282b3c]'
                          }`}
                          style={{
                            backgroundColor: isCompleted ? habit.color : undefined,
                          }}
                          title={`${dateStr}: ${isCompleted ? 'Completed' : 'Missed'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
