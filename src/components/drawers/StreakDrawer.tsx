import React, { useState, useEffect } from 'react';
import {
  X,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StreakDrawer: React.FC = () => {
  const { user, buyStreakFreeze, isStreakDrawerOpen, setIsStreakDrawerOpen } = useApp();
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Reset calendar to current month and lock body scroll when drawer opens
  useEffect(() => {
    if (isStreakDrawerOpen) {
      setCalendarDate(new Date());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isStreakDrawerOpen]);

  if (!isStreakDrawerOpen) return null;

  const year = calendarDate.getFullYear();
  const monthName = calendarDate.toLocaleString('default', { month: 'long' });

  const firstDay = new Date(year, calendarDate.getMonth(), 1).getDay();
  const firstDayIndex = firstDay;
  const totalDays = new Date(year, calendarDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setCalendarDate(new Date(year, calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(year, calendarDate.getMonth() + 1, 1));
  };

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);
  const todayStr = new Date().toLocaleDateString('en-CA');

  const getDayOfWeekIndex = (day: number) => {
    return new Date(year, calendarDate.getMonth(), day).getDay();
  };

  // Milestone logic
  const currentStreak = user.streak || 0;
  const nextMilestone = Math.ceil((currentStreak + 1) / 10) * 10;
  const progressPercent = Math.min(100, Math.round((currentStreak / nextMilestone) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Immersive backdrop with light blur */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[4px] z-0 transition-opacity" />
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsStreakDrawerOpen(false)} />

      {/* Ultra-Premium Glassmorphic Modal */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#050505]/75 backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.85)] p-4 sm:p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-400 ease-out flex flex-col justify-between scrollbar-none">
        
        {/* Dynamic Background Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black text-white font-heading tracking-tight flex items-center gap-2">
                Streak Society
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Stay consistent. Build the habit.</p>
            </div>
            <button
              onClick={() => setIsStreakDrawerOpen(false)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Epic Streak Showcase Card */}
          <div className="relative overflow-hidden rounded-[1.5rem] p-[1px] bg-gradient-to-b from-orange-500/30 to-orange-900/5 shadow-2xl group">
            <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-4 sm:p-6 flex flex-col min-[390px]:flex-row items-center justify-between gap-4 relative z-10">
              <div className="space-y-1 w-full min-[390px]:flex-1">
                <span className="text-[10px] font-bold text-orange-400/90 uppercase tracking-widest flex items-center gap-1.5">
                  <Target className="w-3 h-3" />
                  Active Streak
                </span>
                <div className="flex items-baseline space-x-1.5 pt-1">
                  <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-100 to-orange-500 font-heading leading-none drop-shadow-sm">
                    {currentStreak}
                  </span>
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Days</span>
                </div>
                
                {/* Milestone Progress */}
                <div className="mt-4 pt-4 border-t border-white/5 w-full">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1.5">
                    <span>Progress to {nextMilestone} Days</span>
                    <span className="text-orange-400 ml-2">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Glowing Flame Visual */}
              <div className="relative pl-0 min-[390px]:pl-4 flex-shrink-0">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full filter blur-2xl scale-120 min-[390px]:scale-150 animate-pulse" />
                <svg className="w-16 h-16 min-[390px]:w-[88px] min-[390px]:h-[88px] drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] relative z-10" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 6 6 9 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 9 16 6 12 2Z" fill="url(#epicFlameGrad)" />
                  <path d="M12 7L14 11L12 15L10 11Z" fill="#FFFFFF" opacity="0.9" />
                  <defs>
                    <linearGradient id="epicFlameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="30%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#9A3412" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Tactical Freeze Purchase Card */}
          <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-[calc(1rem-1px)] p-3 sm:p-4 flex flex-col min-[390px]:flex-row items-center justify-between gap-3 relative z-10">
              <div className="flex items-center space-x-3 w-full min-[390px]:w-auto">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] flex-shrink-0">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    Streak Freezes
                    <span className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded text-[10px] border border-cyan-500/20">
                      {user.streakFreezes || 0} Available
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    Miss a day? A freeze automatically saves your streak.
                  </p>
                </div>
              </div>

              <button
                onClick={buyStreakFreeze}
                className="w-full min-[390px]:w-auto flex min-[390px]:flex-col items-center justify-between min-[390px]:justify-center bg-cyan-500/10 hover:bg-cyan-400/20 border border-cyan-500/30 px-4 py-2 rounded-xl active:scale-95 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] group gap-1"
              >
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider group-hover:text-cyan-300">
                  Buy Freeze
                </span>
                <span className="text-[11px] font-bold text-white flex items-center gap-1 opacity-90">
                  100 🍏
                </span>
              </button>
            </div>
          </div>

          {/* Advanced Calendar Engine */}
          <div className="bg-[#0a0a0a]/60 border border-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.03] pb-3">
              <span className="text-[11px] font-black text-gray-400 tracking-widest uppercase font-heading">
                {monthName} {year}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1.5 text-center text-[10px] font-bold text-gray-600 mb-2">
              <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center text-xs items-center font-bold">
              {blanksArray.map((b) => (
                <div key={`blank-${b}`} className="w-full h-8" />
              ))}

              {daysArray.map((day) => {
                const monthStr = String(calendarDate.getMonth() + 1).padStart(2, '0');
                const dayStr = String(day).padStart(2, '0');
                const dateKey = `${year}-${monthStr}-${dayStr}`;

                const isToday = dateKey === todayStr;
                const isVisited = user.streakHistory?.includes(dateKey);
                const isFrozen = user.frozenDates?.includes(dateKey);
                const dayOfWeekIndex = getDayOfWeekIndex(day);

                const prevDateKey = `${year}-${monthStr}-${String(day - 1).padStart(2, '0')}`;
                const nextDateKey = `${year}-${monthStr}-${String(day + 1).padStart(2, '0')}`;
                
                const isStartOfWeek = dayOfWeekIndex === 0;
                const isEndOfWeek = dayOfWeekIndex === 6;

                const prevVisited = user.streakHistory?.includes(prevDateKey) && !isStartOfWeek;
                const nextVisited = user.streakHistory?.includes(nextDateKey) && !isEndOfWeek;

                if (!isVisited && !isFrozen) {
                  return (
                    <div
                      key={`day-${day}`}
                      className={`w-7 h-7 flex items-center justify-center mx-auto rounded-full transition-all ${
                        isToday
                          ? 'border border-gray-600 text-white bg-white/5'
                          : 'text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      {day}
                    </div>
                  );
                }

                if (isFrozen) {
                  return (
                    <div key={`day-${day}`} className="h-7 w-full flex items-center justify-center relative">
                      <div className="w-7 h-7 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center font-black relative shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                        <Snowflake className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={`day-${day}`} className="h-7 w-full flex items-center justify-center relative group">
                    <div
                      className={`flex items-center justify-center text-white ${
                        prevVisited && nextVisited
                          ? 'w-full h-7 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500'
                          : prevVisited
                          ? 'w-full h-7 bg-gradient-to-r from-orange-500 to-amber-500 rounded-r-full'
                          : nextVisited
                          ? 'w-full h-7 bg-gradient-to-r from-amber-500 to-orange-500 rounded-l-full'
                          : 'w-7 h-7 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                      }`}
                    >
                      {isToday ? <Flame className="w-3.5 h-3.5" /> : day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tactical Footer */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 text-center mt-6 pt-4 border-t border-white/5">
          <ShieldAlert className="w-3.5 h-3.5" />
          Streaks auto-update upon daily login. Protect your progress!
        </div>
      </div>
    </div>
  );
};

