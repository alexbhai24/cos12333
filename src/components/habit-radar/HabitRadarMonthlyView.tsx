import React, { useState } from 'react';
import { Check, Flame, ChevronLeft, ChevronRight, Play, Plus, Edit3 } from 'lucide-react';
import { Habit, HabitLogs, HabitSettings } from '../../types/habitRadar';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';
import { formatDateKey } from '../../utils/habitRadarStorage';

interface HabitRadarMonthlyViewProps {
  habits: Habit[];
  logs: HabitLogs;
  settings: HabitSettings;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onOpenTimer: (habit: Habit) => void;
  onEditHabit: (habit: Habit) => void;
}

export const HabitRadarMonthlyView: React.FC<HabitRadarMonthlyViewProps> = ({
  habits,
  logs,
  settings,
  onToggleDay,
  onOpenTimer,
  onEditHabit,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const todayStr = formatDateKey(new Date());

  return (
    <div className="space-y-6 pb-24">
      {/* Month Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
            {monthName} {year}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide italic">
            A month with <span className="not-italic font-normal">returns.</span>
          </h2>
        </div>

        {/* Month Paging */}
        <div className="flex items-center gap-1 bg-[#151722] p-1 rounded-xl border border-white/5">
          <button
            onClick={prevMonth}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          // Generate day dots for the month (e.g. 30/31 days)
          const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(year, month, i + 1);
            const dateStr = formatDateKey(d);
            const isCompleted = logs[habit.id]?.[dateStr]?.completed ?? false;
            return {
              dayNum: i + 1,
              dateStr,
              isCompleted,
            };
          });

          return (
            <div
              key={habit.id}
              className="bg-[#121422]/70 hover:bg-[#15182a]/90 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                      className="font-bold text-sm text-white tracking-wide cursor-pointer hover:text-purple-300 transition-colors truncate max-w-[140px]"
                    >
                      {habit.name}
                    </h3>
                    {settings.showStreakOn.monthly && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                        <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Quick Action for Today */}
                {habit.trackType === 'task' && (
                  <button
                    onClick={() => onToggleDay(habit.id, todayStr)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTodayCompleted
                        ? 'shadow-md scale-105'
                        : 'border border-white/15 text-transparent hover:border-white/30'
                    }`}
                    style={{
                      backgroundColor: isTodayCompleted ? habit.color : 'transparent',
                      color: isTodayCompleted ? '#000000' : undefined,
                    }}
                    title="Toggle today"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

                {habit.trackType === 'amount' && (
                  <button
                    onClick={() => onToggleDay(habit.id, todayStr)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTodayCompleted
                        ? 'shadow-md scale-105 text-black'
                        : 'border border-white/15 text-slate-300 hover:border-white/30'
                    }`}
                    style={{
                      backgroundColor: isTodayCompleted ? habit.color : 'transparent',
                    }}
                    title="Increment today"
                  >
                    {isTodayCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
                  </button>
                )}

                {habit.trackType === 'time' && (
                  <button
                    onClick={() => onOpenTimer(habit)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTodayCompleted
                        ? 'shadow-md scale-105 text-black'
                        : 'border border-white/15 text-purple-300 bg-purple-500/10'
                    }`}
                    style={{
                      backgroundColor: isTodayCompleted ? habit.color : undefined,
                    }}
                    title="Focus timer"
                  >
                    {isTodayCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                )}
              </div>

              {/* Monthly Dot Matrix Heatmap */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
                {daysArray.map(({ dayNum, dateStr, isCompleted }) => (
                  <button
                    key={dateStr}
                    onClick={() => onToggleDay(habit.id, dateStr)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted
                        ? 'shadow-sm scale-102'
                        : 'bg-[#222432]/70 hover:bg-[#2c2f42] border border-white/5'
                    }`}
                    style={{
                      backgroundColor: isCompleted ? habit.color : undefined,
                    }}
                    title={`Day ${dayNum} (${dateStr}): ${isCompleted ? 'Completed' : 'Click to complete'}`}
                  >
                    <span
                      className={`text-[10px] font-bold ${
                        isCompleted ? 'text-black font-black' : 'text-slate-500'
                      }`}
                    >
                      {dayNum}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
