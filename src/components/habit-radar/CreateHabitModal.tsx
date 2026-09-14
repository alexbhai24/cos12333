import React, { useState } from 'react';
import {
  X, Check, Pencil, Plus, Clock, Star, Bell, Trash2
} from 'lucide-react';
import {
  Habit, HabitTrackType, HabitRepeatType, PASTEL_COLORS
} from '../../types/habitRadar';
import { IconPickerModal, LUCIDE_ICONS_MAP } from './IconPickerModal';
import { TimePickerModal } from './TimePickerModal';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHabit: (habit: Habit) => void;
  initialHabit?: Habit | null;
  onDeleteHabit?: (habitId: string) => void;
}

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  isOpen,
  onClose,
  onSaveHabit,
  initialHabit,
  onDeleteHabit,
}) => {
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [icon, setIcon] = useState(initialHabit?.icon || 'star');
  const [color, setColor] = useState(initialHabit?.color || PASTEL_COLORS[0]);
  const [trackType, setTrackType] = useState<HabitTrackType>(initialHabit?.trackType || 'task');
  const [targetAmount, setTargetAmount] = useState(initialHabit?.targetAmount || 1);
  const [targetMinutes, setTargetMinutes] = useState(initialHabit?.targetMinutes || 15);
  const [unit, setUnit] = useState(initialHabit?.unit || 'times');
  const [repeatType, setRepeatType] = useState<HabitRepeatType>(initialHabit?.repeatType || 'daily');
  const [repeatDays, setRepeatDays] = useState<number[]>(initialHabit?.repeatDays || [1, 2, 3, 4, 5, 6, 7]);
  const [repeatMonthlyDays, setRepeatMonthlyDays] = useState<number[]>(initialHabit?.repeatMonthlyDays || [13, 14]);
  const [reminders, setReminders] = useState<string[]>(initialHabit?.reminders || []);

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(initialHabit?.name || '');
      setDescription(initialHabit?.description || '');
      setIcon(initialHabit?.icon || 'star');
      setColor(initialHabit?.color || PASTEL_COLORS[0]);
      setTrackType(initialHabit?.trackType || 'task');
      setTargetAmount(initialHabit?.targetAmount || 1);
      setTargetMinutes(initialHabit?.targetMinutes || 15);
      setUnit(initialHabit?.unit || 'times');
      setRepeatType(initialHabit?.repeatType || 'daily');
      setRepeatDays(initialHabit?.repeatDays || [1, 2, 3, 4, 5, 6, 7]);
      setRepeatMonthlyDays(initialHabit?.repeatMonthlyDays || [13, 14]);
      setReminders(initialHabit?.reminders || []);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialHabit]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    const habit: Habit = {
      id: initialHabit?.id || `habit_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      trackType,
      targetAmount: trackType === 'amount' ? targetAmount : undefined,
      targetMinutes: trackType === 'time' ? targetMinutes : undefined,
      unit: trackType === 'amount' ? unit : undefined,
      repeatType,
      repeatDays: repeatType === 'daily' ? repeatDays : undefined,
      repeatMonthlyDays: repeatType === 'monthly' ? repeatMonthlyDays : undefined,
      reminders: reminders.length > 0 ? reminders : undefined,
      createdAt: initialHabit?.createdAt || new Date().toISOString(),
    };

    onSaveHabit(habit);
    onClose();
  };

  const toggleDay = (dayIdx: number) => {
    if (repeatDays.includes(dayIdx)) {
      if (repeatDays.length > 1) {
        setRepeatDays(repeatDays.filter(d => d !== dayIdx));
      }
    } else {
      setRepeatDays([...repeatDays, dayIdx].sort());
    }
  };

  const toggleMonthlyDay = (dayNum: number) => {
    if (repeatMonthlyDays.includes(dayNum)) {
      setRepeatMonthlyDays(repeatMonthlyDays.filter(d => d !== dayNum));
    } else {
      setRepeatMonthlyDays([...repeatMonthlyDays, dayNum].sort((a, b) => a - b));
    }
  };

  const IconComp = LUCIDE_ICONS_MAP[icon];

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 pt-16 sm:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
        {/* Backdrop click dismiss */}
        <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

        <div className="relative z-10 w-full max-w-xl bg-[#0e111d] border-t sm:border border-white/10 rounded-t-[28px] sm:rounded-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[82vh] sm:max-h-[80vh] my-auto flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out">
          {/* Top Handle on Mobile */}
          <div className="w-12 h-1.5 bg-white/20 hover:bg-white/30 rounded-full mx-auto my-2 sm:hidden flex-shrink-0 cursor-pointer" onClick={onClose} />

          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 bg-[#121422]">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Cancel
            </button>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-heading">
              {initialHabit ? 'EDIT HABIT' : 'NEW HABIT'}
            </h3>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Save
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar">
            {/* Top Icon & Name Header */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
              <div
                onClick={() => setIsIconPickerOpen(true)}
                className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl border-2 transition-transform hover:scale-105 cursor-pointer relative group"
                style={{
                  backgroundColor: `${color}25`,
                  borderColor: `${color}60`,
                }}
              >
                {IconComp ? (
                  <IconComp className="w-9 h-9" style={{ color }} />
                ) : (
                  <span className="text-4xl">{icon}</span>
                )}
              </div>

              <button
                onClick={() => setIsIconPickerOpen(true)}
                className="text-[11px] font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition-colors cursor-pointer"
              >
                Change icon
              </button>

              {/* Title Input */}
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name it plainly"
                className="w-full text-center text-xl sm:text-2xl font-serif text-white placeholder-slate-500 bg-transparent border-none outline-none focus:ring-0"
              />

              {/* Description Input */}
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add description"
                className="w-full text-center text-xs text-slate-300 placeholder-slate-600 bg-transparent border-none outline-none focus:ring-0"
              />
            </div>

            {/* Section 1: HABIT COLOR */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                HABIT COLOR
              </h4>
              <div className="grid grid-cols-9 gap-2 sm:gap-2.5">
                {PASTEL_COLORS.map(c => {
                  const isSelected = color === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#10121a] scale-110 shadow-lg'
                          : 'opacity-85 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: TRACK */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                TRACK
              </h4>
              {/* Segmented Control */}
              <div className="flex items-center bg-[#171926] p-1 rounded-2xl border border-white/5">
                {(['task', 'amount', 'time'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTrackType(t)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      trackType === t
                        ? 'bg-[#292c3d] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Amount Inputs */}
              {trackType === 'amount' && (
                <div className="flex items-center justify-between p-4 bg-[#171926] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{targetAmount}</span>
                    <span className="text-sm font-medium text-slate-400">{unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 4, 8, 10].map(val => (
                      <button
                        key={val}
                        onClick={() => setTargetAmount(val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          targetAmount === val
                            ? 'bg-purple-500 text-white shadow'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Inputs */}
              {trackType === 'time' && (
                <div className="flex items-center justify-between p-4 bg-[#171926] border border-white/5 rounded-2xl">
                  <div className="text-2xl font-bold text-white">{targetMinutes}min</div>
                  <div className="flex items-center gap-2">
                    {[10, 15, 25, 45, 60].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setTargetMinutes(mins)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          targetMinutes === mins
                            ? 'bg-purple-500 text-white shadow'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: REPEAT */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                REPEAT
              </h4>
              {/* Segmented Control */}
              <div className="flex items-center bg-[#171926] p-1 rounded-2xl border border-white/5">
                {(['daily', 'weekly', 'monthly'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRepeatType(r)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      repeatType === r
                        ? 'bg-[#292c3d] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Daily Mode */}
              {repeatType === 'daily' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">On these days</span>
                    <span className="text-slate-400 text-[11px]">
                      {repeatDays.length === 7
                        ? 'Everyday'
                        : repeatDays.length === 5 && !repeatDays.includes(6) && !repeatDays.includes(7)
                        ? 'Weekdays'
                        : `${repeatDays.length} days/week`}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {DAYS_SHORT.map((day, idx) => {
                      const dayNumber = idx + 1;
                      const isSelected = repeatDays.includes(dayNumber);
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(dayNumber)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'text-black shadow-md'
                              : 'bg-[#171926] text-slate-400 hover:text-white'
                          }`}
                          style={{
                            backgroundColor: isSelected ? color : undefined,
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Monthly Mode (Calendar Grid) */}
              {repeatType === 'monthly' && (
                <div className="space-y-3 pt-1">
                  <div className="text-xs font-medium text-slate-400">
                    {repeatMonthlyDays.length > 0
                      ? `Every month on ${repeatMonthlyDays.join(', ')}`
                      : 'Select target days'}
                  </div>

                  <div className="p-4 bg-[#171926] border border-white/5 rounded-2xl grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => {
                      const isSelected = repeatMonthlyDays.includes(dayNum);
                      return (
                        <button
                          key={dayNum}
                          onClick={() => toggleMonthlyDay(dayNum)}
                          className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer mx-auto ${
                            isSelected
                              ? 'text-black shadow-md scale-105'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                          style={{
                            backgroundColor: isSelected ? color : undefined,
                          }}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: REMINDERS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  REMINDERS
                </h4>
                <button
                  onClick={() => setIsTimePickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reminder</span>
                </button>
              </div>

              {reminders.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {reminders.map((timeStr, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#171926] border border-white/10 rounded-xl text-xs font-mono text-white"
                    >
                      <Bell className="w-3.5 h-3.5 text-purple-400" />
                      <span>{timeStr}</span>
                      <button
                        onClick={() => setReminders(reminders.filter((_, idx) => idx !== i))}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pl-1">No reminders set</p>
              )}
            </div>

            {/* Delete Option if editing */}
            {initialHabit && onDeleteHabit && (
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete habit "${initialHabit.name}"?`)) {
                      onDeleteHabit(initialHabit.id);
                      onClose();
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Habit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Icon Picker Sheet */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelectIcon={setIcon}
        currentIcon={icon}
      />

      {/* Time Picker Clock Dialog */}
      <TimePickerModal
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onSaveTime={newTime => setReminders([...reminders, newTime])}
      />
    </>
  );
};
