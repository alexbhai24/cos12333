import React, { useState, useRef } from 'react';
import {
  X, ArrowLeft, Volume2, Calendar, Flame, Trash2, Pencil, Plus,
  Download, Upload, ShieldCheck, RefreshCw, AlertTriangle, Check, Sliders
} from 'lucide-react';
import { Habit, HabitSettings } from '../../types/habitRadar';
import { habitRadarStorage, playSoftTickSound } from '../../utils/habitRadarStorage';
import { LUCIDE_ICONS_MAP } from './IconPickerModal';

interface HabitSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HabitSettings;
  onUpdateSettings: (newSettings: HabitSettings) => void;
  habits: Habit[];
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onCreateHabit: () => void;
  onDataRefresh: () => void;
}

export const HabitSettingsModal: React.FC<HabitSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  habits,
  onEditHabit,
  onDeleteHabit,
  onCreateHabit,
  onDataRefresh,
}) => {
  const [activeNav, setActiveNav] = useState<'habits' | 'preferences' | 'data'>('habits');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (partial: Partial<HabitSettings>) => {
    const next = { ...settings, ...partial };
    onUpdateSettings(next);
  };

  const updateStreak = (view: 'today' | 'weekly' | 'monthly', val: boolean) => {
    update({
      showStreakOn: {
        ...settings.showStreakOn,
        [view]: val,
      },
    });
  };

  const handleExport = () => {
    const backupJson = habitRadarStorage.exportBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit_radar_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = habitRadarStorage.importBackup(content);
        if (result.success) {
          setImportStatus({ type: 'success', message: 'Backup imported successfully!' });
          onDataRefresh();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus({ type: 'error', message: result.error || 'Import failed' });
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleClearAll = () => {
    habitRadarStorage.clearAllData();
    onDataRefresh();
    setIsResetConfirmOpen(false);
  };

  const handleRestoreDefaults = () => {
    habitRadarStorage.restoreDefaultHabits();
    onDataRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#0e111d] border-t sm:border border-white/10 rounded-t-[28px] sm:rounded-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[85vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out">
        
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1.5 bg-white/20 hover:bg-white/30 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0 cursor-pointer" onClick={onClose} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#121422]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white tracking-wide font-heading flex items-center gap-2">
              <span>Habit Settings</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Top Segmented Navigation Tabs */}
        <div className="px-5 pt-3 pb-1 border-b border-white/5 bg-[#10121f]">
          <div className="flex items-center bg-[#171927] p-1 rounded-xl border border-white/5 gap-1">
            {(
              [
                { id: 'habits', label: `Habits (${habits.length})` },
                { id: 'preferences', label: 'Preferences' },
                { id: 'data', label: 'Storage & Backup' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                  activeNav === tab.id
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">

          {/* ──── TAB 1: MANAGE HABITS ──── */}
          {activeNav === 'habits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    All Tracked Habits
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Edit details or delete habits anytime
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onCreateHabit();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>New Habit</span>
                </button>
              </div>

              {habits.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#141624] border border-white/5 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-300">No active habits</p>
                  <p className="text-xs text-slate-400">Create a custom habit or restore the default starter set.</p>
                  <button
                    onClick={handleRestoreDefaults}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-500/30 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Default Habits</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {habits.map((habit) => {
                    const IconComp = LUCIDE_ICONS_MAP[habit.icon];
                    const isDeleting = deleteConfirmId === habit.id;

                    return (
                      <div
                        key={habit.id}
                        className="bg-[#161826] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between hover:bg-[#1b1e2e] transition-colors"
                      >
                        {/* Left Habit details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
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

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{habit.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                                {habit.trackType}
                                {habit.trackType === 'amount' && ` (${habit.targetAmount} ${habit.unit || ''})`}
                                {habit.trackType === 'time' && ` (${habit.targetMinutes}m)`}
                              </span>
                              <span className="text-[10px] text-slate-500 capitalize">
                                {habit.repeatType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          {isDeleting ? (
                            <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 p-1 rounded-xl">
                              <span className="text-[10px] font-bold text-rose-400 px-1">Delete?</span>
                              <button
                                onClick={() => {
                                  onDeleteHabit(habit.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-rose-500 text-white font-bold text-[10px] rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-white/10 text-slate-300 font-semibold text-[10px] rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  onClose();
                                  onEditHabit(habit);
                                }}
                                className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-purple-300 transition-all cursor-pointer"
                                title="Edit Habit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmId(habit.id)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                                title="Delete Habit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ──── TAB 2: PREFERENCES ──── */}
          {activeNav === 'preferences' && (
            <div className="space-y-4">
              <div className="bg-[#161826] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
                {/* Sounds Toggle */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Completion Sounds</h4>
                      <p className="text-xs text-slate-400">Play a soft tactile click when completing habits</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = !settings.sounds;
                      update({ sounds: next });
                      if (next) playSoftTickSound(true);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.sounds ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.sounds ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* First Day of Week */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">First Day of Week</h4>
                      <p className="text-xs text-slate-400">Sets starting day for weekly grids & calendar</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-[#10121d] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
                    {(['Saturday', 'Sunday', 'Monday'] as const).map((day) => (
                      <button
                        key={day}
                        onClick={() => update({ weekStartOn: day })}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          settings.weekStartOn === day
                            ? 'bg-[#292c3d] text-white shadow-sm font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Flame Streaks */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Show Streak Counter</h4>
                      <p className="text-xs text-slate-400">Display continuous day streak flames</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 pl-12">
                    {[
                      { key: 'today', label: 'Today View' },
                      { key: 'weekly', label: 'Weekly View' },
                      { key: 'monthly', label: 'Monthly View' },
                    ].map(({ key, label }) => {
                      const isChecked = settings.showStreakOn[key as keyof typeof settings.showStreakOn];
                      return (
                        <button
                          key={key}
                          onClick={() => updateStreak(key as any, !isChecked)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{label}</span>
                          <span className="text-[10px] font-normal">{isChecked ? '✓ Visible' : 'Hidden'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──── TAB 3: STORAGE & BACKUP ──── */}
          {activeNav === 'data' && (
            <div className="space-y-4">
              {/* Local Storage Banner */}
              <div className="p-4 rounded-2xl bg-[#141624] border border-white/5 flex items-start gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">100% Local & Offline Storage</h4>
                  <p className="text-slate-400 leading-relaxed">
                    All your habits, streaks, and completion history are stored strictly on your device’s local browser storage. No cloud accounts or tracking required.
                  </p>
                </div>
              </div>

              {/* Import status alert */}
              {importStatus && (
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {importStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Export Data */}
                <button
                  onClick={handleExport}
                  className="p-4 rounded-2xl bg-[#161826] hover:bg-[#1c1f30] border border-white/5 flex flex-col items-start gap-2.5 text-left transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Export Backup (.json)</h4>
                    <p className="text-xs text-slate-400">Save all habits and logs to a JSON file</p>
                  </div>
                </button>

                {/* Import Data */}
                <button
                  onClick={handleImportClick}
                  className="p-4 rounded-2xl bg-[#161826] hover:bg-[#1c1f30] border border-white/5 flex flex-col items-start gap-2.5 text-left transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Import Backup (.json)</h4>
                    <p className="text-xs text-slate-400">Restore habits & progress from backup</p>
                  </div>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>

              {/* Reset / Clear Data */}
              <div className="pt-2">
                {isResetConfirmOpen ? (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Are you sure you want to clear all data?</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      This will delete all habit definitions and logged streak history from your local storage.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Yes, Clear Everything
                      </button>
                      <button
                        onClick={() => setIsResetConfirmOpen(false)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Habits & Local Data</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
