import React, { useState, useEffect } from 'react';
import {
  X,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gift,
  Bell,
  Crown,
  TrendingUp,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Import official 3D logo assets
import gift3d from '../../assets/gift_3d.png';
import freeze3d from '../../assets/freeze_3d.png';
import streak3d from '../../assets/streak_3d.png';

export const StreakDrawer: React.FC = () => {
  const { user, buyStreakFreeze, isStreakDrawerOpen, setIsStreakDrawerOpen, showNotification, videoWatchProgress } = useApp();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [reminderActive, setReminderActive] = useState(() => localStorage.getItem('cosmicbone_streak_reminder') === 'true');

  const handleToggleReminder = () => {
    const nextState = !reminderActive;
    setReminderActive(nextState);
    localStorage.setItem('cosmicbone_streak_reminder', nextState ? 'true' : 'false');
    showNotification(nextState ? '🔔 Daily reminder set for 8:00 PM!' : '🔕 Daily reminder disabled.');
  };


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

  // -- Dynamic Calculations --
  const history = user.streakHistory || [];
  
  // Consistency (This Month)
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const daysInMonthSoFar = now.getDate();
  const activeDaysThisMonth = history.filter(d => d.startsWith(currentMonthPrefix)).length;
  const consistencyPercent = Math.min(100, Math.round((activeDaysThisMonth / daysInMonthSoFar) * 100)) || 0;

  // Longest Streak
  let longestStreak = 0;
  if (history.length > 0) {
    const sortedDates = [...history].sort();
    let currentLen = 1;
    longestStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
       const d1 = new Date(sortedDates[i-1]);
       const d2 = new Date(sortedDates[i]);
       const diffTime = Math.abs(d2.getTime() - d1.getTime());
       const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
       if (diffDays === 1) {
          currentLen++;
          longestStreak = Math.max(longestStreak, currentLen);
       } else if (diffDays > 1) {
          currentLen = 1;
       }
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  const nextMilestone = Math.ceil((currentStreak + 1) / 10) * 10;
  const progressPercent = Math.min(100, Math.round((currentStreak / nextMilestone) * 100));
  const daysNeeded = nextMilestone - currentStreak;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Immersive backdrop with light blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0 transition-opacity" />
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsStreakDrawerOpen(false)} />

      {/* Premium Glassmorphic Modal with Increased Width */}
      <div className="relative z-10 w-full max-w-[640px] bg-[#0b0e1b]/95 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-[0_24px_50px_rgba(0,0,0,0.85)] p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300 ease-out flex flex-col justify-between scrollbar-none">

        {/* Dynamic Background Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="space-y-6 relative z-10">

          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <img src={streak3d} className="w-8 h-8 object-contain drop-shadow-[0_2px_6px_rgba(249,115,22,0.5)]" alt="Streak" />
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight select-none font-heading">Your Streak</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Consistency today, success tomorrow.</p>
              </div>
            </div>
            <button
              onClick={() => setIsStreakDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Two-column streak section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Left Card: Current Streak */}
            <div className="relative overflow-hidden rounded-2xl p-5 border border-white/[0.06] bg-[#111322]/60 shadow-xl flex flex-col justify-between h-[230px]">
              {/* Flame overlay glow */}
              <div className="absolute top-4 right-4 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="text-xs">🔥</span> CURRENT STREAK
                  </span>

                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-5xl font-black text-white leading-none tracking-tight">
                      {currentStreak}
                    </span>
                    <span className="text-sm font-black text-orange-400 uppercase tracking-widest">
                      DAYS
                    </span>
                  </div>

                </div>

                <div className="relative flex-shrink-0 mt-1 mr-1">
                  <img src={streak3d} className="w-20 h-20 object-contain drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]" alt="Streak" />
                </div>
              </div>

              {/* Progress and Motivation */}
              <div className="space-y-2.5 pt-4 border-t border-white/5">
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Daily Streak Goal</span>
                    <span className="text-xs font-bold text-white">Watch 10 min of video</span>
                  </div>
                  <span className="text-xs font-black text-[#00F0FF]">
                    {Math.min(100, Math.floor((videoWatchProgress / 600) * 100))}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/5 relative p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-[#00F0FF] rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                    style={{ width: `${Math.min(100, (videoWatchProgress / 600) * 100)}%` }}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Streak Protection & Bonus */}
            <div className="flex flex-col gap-3 justify-between h-[230px]">

              {/* Streak Protection */}
              <div className="bg-[#111322]/60 border border-white/[0.06] rounded-2xl p-4 flex flex-row items-center justify-between flex-1 relative overflow-hidden">
                <div className="space-y-1.5 flex-1 pr-2">
                  <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="text-xs">❄️</span> STREAK FREEZES
                  </span>
                  <div className="text-base font-black text-white flex items-baseline gap-1">
                    <span className="text-cyan-400 font-sans text-xl">{user.streakFreezes || 0}</span>
                    <span className="text-xs text-gray-300 font-bold">Available</span>
                  </div>
                  <p className="text-[9px] text-gray-400 leading-snug">Freeze your streak when life gets in the way.</p>

                  <div className="flex gap-2 pt-1.5">
                    <button
                      onClick={buyStreakFreeze}
                      className="py-1.5 px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-[9px] font-black transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-0.5"
                    >
                      Buy 🍏100
                    </button>
                  </div>
                </div>

                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-full filter blur-xl scale-125" />
                  <img src={freeze3d} className="w-16 h-16 object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(34,211,238,0.3)]" alt="Freeze" />
                </div>
              </div>

              {/* Streak Bonus */}
              <div className="bg-[#111322]/60 border border-white/[0.06] rounded-2xl p-4 flex flex-row items-center justify-between shadow-md relative overflow-hidden h-[85px]">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="text-xs">🎁</span> STREAK BONUS
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                    <span className="text-[#eab308]">⭐</span>
                    <span className="text-purple-400 font-black">+15 XP</span>
                  </div>
                  <p className="text-[9px] text-gray-400 leading-none">Complete today to claim your bonus!</p>
                </div>

                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-full filter blur-xl scale-125" />
                  <img src={gift3d} className="w-14 h-14 object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(168,85,247,0.3)]" alt="Gift" />
                </div>
              </div>

            </div>
          </div>

          {/* Calendar and Sidebar grid row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Advanced Calendar Engine (UNTOUCHED CALENDAR) */}
            <div className="md:col-span-2 bg-[#111322]/60 border border-white/[0.06] rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.03] pb-3">
                <span className="text-[11px] font-black text-gray-400 tracking-widest uppercase font-heading">
                  {monthName} {year}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white cursor-pointer"
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
                        className={`w-7 h-7 flex items-center justify-center mx-auto rounded-full transition-all ${isToday
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
                        className={`flex items-center justify-center text-white ${prevVisited && nextVisited
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

            {/* Sidebar Stats Panel (from crop illustration) */}
            <div className="bg-[#111322]/60 border border-white/[0.06] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                {/* Current Streak */}
                <div className="flex items-center space-x-3.5 pb-3.5 border-b border-white/[0.04]">
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <img src={streak3d} className="w-6 h-6 object-contain" alt="Streak" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white leading-none">
                      {currentStreak}
                    </div>
                    <div className="text-[9px] font-bold text-gray-500 mt-1.5 uppercase tracking-wider">
                      Current Streak
                    </div>
                  </div>
                </div>

                {/* Longest Streak */}
                <div className="flex items-center space-x-3.5 pb-3.5 border-b border-white/[0.04]">
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white leading-none">
                      {longestStreak}
                    </div>
                    <div className="text-[9px] font-bold text-gray-500 mt-1.5 uppercase tracking-wider">
                      Longest Streak
                    </div>
                  </div>
                </div>

                {/* Consistency */}
                <div className="flex items-center space-x-3.5 pb-3.5 border-b border-white/[0.04]">
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white leading-none">
                      {consistencyPercent}%
                    </div>
                    <div className="text-[9px] font-bold text-gray-500 mt-1.5 uppercase tracking-wider">
                      Consistency (This Month)
                    </div>
                  </div>
                </div>

                {/* Monthly Goal */}
                <div className="flex items-center space-x-3.5">
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <Timer className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white leading-none">
                      {currentStreak}<span className="text-gray-500 font-normal">/10</span>
                    </div>
                    <div className="text-[9px] font-bold text-gray-500 mt-1.5 uppercase tracking-wider">
                      Monthly Goal
                    </div>
                  </div>
                </div>
              </div>

              {/* View Stats Action Button */}
              <button
                onClick={() => showNotification('📊 Detailed stats are updated dynamically as you study!')}
                className="w-full py-2 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-5"
              >
                <span>View Stats</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Streak Tools */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Streak Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Milestones */}
              <div className="bg-[#111322]/60 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between h-[65px]">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Streak Milestones</span>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-1 select-none">
                  <span>🔥</span>
                  <span className="font-mono">7 → 10 → 30 → 100 days</span>
                </div>
              </div>

              {/* Card 2: Protection Status */}
              <div className="bg-[#111322]/60 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between h-[65px]">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Streak Protection</span>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-1 select-none">
                  <span>🛡️</span>
                  <span>{user.streakFreezes || 0} freezes available</span>
                </div>
              </div>

              {/* Card 3: Daily Reminder Toggle */}
              <div className="bg-[#111322]/60 border border-white/[0.06] rounded-xl p-3 flex items-center justify-between h-[65px]">
                <div className="flex flex-col justify-between h-full">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Daily Reminder</span>
                  <div className="text-xs font-bold text-white flex items-center gap-1 mt-1 select-none">
                    <Bell className="w-3.5 h-3.5 text-yellow-500 animate-swing" />
                    <span>8:00 PM</span>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={handleToggleReminder}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${reminderActive ? 'bg-orange-500' : 'bg-white/10 border border-white/10'
                    }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 transform ${reminderActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="text-[10px] text-gray-500 text-center font-medium pt-3 border-t border-white/5 select-none">
            Keep the chain alive. Every day counts.
          </div>
        </div>
      </div>
    </div>
  );
};
