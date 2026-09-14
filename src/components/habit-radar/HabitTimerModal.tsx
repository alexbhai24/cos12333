import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, Square, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import { Habit } from '../../types/habitRadar';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';
import { playSoftTickSound } from '../../utils/habitRadarStorage';

interface HabitTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onComplete: (habitId: string, elapsedMinutes: number) => void;
  soundEnabled?: boolean;
}

export const HabitTimerModal: React.FC<HabitTimerModalProps> = ({
  isOpen,
  onClose,
  habit,
  onComplete,
  soundEnabled = true,
}) => {
  const totalSeconds = (habit?.targetMinutes || 15) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<any>(null);

  // Sync when habit changes
  useEffect(() => {
    if (habit) {
      const secs = (habit.targetMinutes || 15) * 60;
      setSecondsLeft(secs);
      setIsRunning(false);
      setIsFinished(false);
    }
  }, [habit]);

  useEffect(() => {
    if (!isOpen) {
      clearInterval(timerRef.current);
      document.body.style.overflow = 'unset';
      return;
    }

    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';

    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            playSoftTickSound(soundEnabled);
            if (habit) {
              onComplete(habit.id, habit.targetMinutes || 15);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      document.body.style.overflow = 'unset';
    };
  }, [isRunning, secondsLeft, isOpen, habit, onComplete, soundEnabled]);

  if (!isOpen || !habit) return null;

  const IconComp = LUCIDE_ICONS_MAP[habit.icon];
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPct = totalSeconds > 0 ? (1 - secondsLeft / totalSeconds) : 0;
  const radius = 120; // Slightly smaller to ensure it fits on short screens
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPct);

  // Angle for indicator dot on the ring
  const angle = progressPct * 360 - 90;
  const dotX = 140 + radius * Math.cos((angle * Math.PI) / 180);
  const dotY = 140 + radius * Math.sin((angle * Math.PI) / 180);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#0A0C16] animate-in fade-in zoom-in-95 duration-300 select-none overflow-y-auto custom-scrollbar flex flex-col items-center justify-center p-4 sm:p-8 min-h-screen">
      
      {/* Absolute Global Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer z-50 shadow-lg"
        title="Close Timer"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Main Content Wrapper (Centered) */}
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-6 sm:gap-8 my-auto">
        
        {/* Habit Info */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] flex items-center justify-center shadow-xl border border-white/10"
            style={{ backgroundColor: `${habit.color}15`, borderColor: `${habit.color}30` }}
          >
            {IconComp ? (
              <IconComp className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: habit.color }} />
            ) : (
              <span className="text-4xl">{habit.icon}</span>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">{habit.name}</h2>
            {habit.description && (
              <p className="text-sm text-slate-400 max-w-[280px] mt-1.5 truncate">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Circular Progress & Time */}
        <div className="relative flex items-center justify-center group cursor-pointer" onClick={() => !isFinished && setIsRunning(!isRunning)}>
          <div className="w-[280px] h-[280px] relative flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 280 280">
              {/* Background Track */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-[#1A1C29]"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Active Progress */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                stroke={habit.color || '#60a5fa'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
                style={{ filter: `drop-shadow(0 0 10px ${habit.color}50)` }}
              />
            </svg>

            {/* Indicator Dot */}
            <div
              className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-300"
              style={{
                left: `${dotX - 8}px`,
                top: `${dotY - 8}px`,
              }}
            />

            {/* Time Display */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span 
                className="text-5xl font-mono font-bold tracking-tighter"
                style={{ color: habit.color || '#fff', textShadow: `0 0 30px ${habit.color}30` }}
              >
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-[0.25em] mt-2">
                {isFinished ? 'Completed' : isRunning ? 'Focusing' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 w-full px-4">
          {/* Reset */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsRunning(false); setSecondsLeft(totalSeconds); setIsFinished(false); }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer border border-transparent hover:border-white/10"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Play/Done */}
          {!isFinished ? (
            <button
              onClick={(e) => { e.stopPropagation(); setIsRunning(prev => !prev); }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] sm:rounded-[32px] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: habit.color || '#60a5fa',
                color: '#0A0C16',
                boxShadow: `0 8px 30px -8px ${habit.color}90`
              }}
            >
              {isRunning ? (
                <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              ) : (
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              )}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="px-8 py-5 sm:px-10 sm:py-6 rounded-[28px] bg-emerald-500 text-[#0A0C16] font-extrabold text-lg sm:text-xl shadow-[0_8px_30px_-8px_rgba(16,185,129,0.7)] flex items-center gap-3 cursor-pointer hover:bg-emerald-400 transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              <span>Done</span>
            </button>
          )}

          {/* Stop */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRunning(false);
              if (habit) onComplete(habit.id, Math.round((totalSeconds - secondsLeft) / 60));
              onClose();
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
            title="Stop & Save Progress"
          >
            <Square className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
