import React, { useState } from 'react';
import {
  ChevronLeft, Plus, Settings, Flame, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  Habit, HabitLogs, HabitSettings
} from '../types/habitRadar';
import { habitRadarStorage, formatDateKey } from '../utils/habitRadarStorage';
import { HabitRadarTodayView } from '../components/habit-radar/HabitRadarTodayView';
import { HabitRadarWeeklyView } from '../components/habit-radar/HabitRadarWeeklyView';
import { HabitRadarMonthlyView } from '../components/habit-radar/HabitRadarMonthlyView';
import { HabitRadarOverallView } from '../components/habit-radar/HabitRadarOverallView';
import { CreateHabitModal } from '../components/habit-radar/CreateHabitModal';
import { HabitSettingsModal } from '../components/habit-radar/HabitSettingsModal';
import { HabitTimerModal } from '../components/habit-radar/HabitTimerModal';
import { HabitOnboardingWizard } from '../components/habit-radar/HabitOnboardingWizard';

type ActiveTab = 'today' | 'weekly' | 'monthly' | 'overall';

export const HabitRadarPage: React.FC = () => {
  const { setCurrentRoute, user, setIsAppleShopOpen } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [habits, setHabits] = useState<Habit[]>(() => habitRadarStorage.getHabits());
  const [logs, setLogs] = useState<HabitLogs>(() => habitRadarStorage.getLogs());
  const [settings, setSettings] = useState<HabitSettings>(() => habitRadarStorage.getSettings());
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !habitRadarStorage.hasCompletedOnboarding());

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTimerHabit, setActiveTimerHabit] = useState<Habit | null>(null);

  // Sync to storage
  const handleSaveHabit = (savedHabit: Habit) => {
    let updated: Habit[];
    const exists = habits.some(h => h.id === savedHabit.id);
    if (exists) {
      updated = habits.map(h => (h.id === savedHabit.id ? savedHabit : h));
    } else {
      updated = [savedHabit, ...habits];
    }
    setHabits(updated);
    habitRadarStorage.saveHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter(h => h.id !== habitId);
    setHabits(updated);
    habitRadarStorage.saveHabits(updated);
  };

  const handleToggleDay = (habitId: string, dateStr: string) => {
    const nextLogs = habitRadarStorage.toggleHabitDay(habitId, dateStr, settings.sounds);
    setLogs({ ...nextLogs });
  };

  const handleTimerComplete = (habitId: string, elapsedMinutes: number) => {
    const todayStr = formatDateKey(new Date());
    const habitLogs = logs[habitId] || {};
    const nextLogs = {
      ...logs,
      [habitId]: {
        ...habitLogs,
        [todayStr]: { completed: true, elapsedSeconds: elapsedMinutes * 60 },
      },
    };
    setLogs(nextLogs);
    habitRadarStorage.saveLogs(nextLogs);
  };

  const handleUpdateSettings = (newSettings: HabitSettings) => {
    setSettings(newSettings);
    habitRadarStorage.saveSettings(newSettings);
  };

  if (showOnboarding) {
    return (
      <div className="p-3 sm:p-6 max-w-5xl mx-auto font-sans select-none">
        <HabitOnboardingWizard
          onFinish={(newHabits) => {
            setHabits(newHabits);
            setLogs(habitRadarStorage.getLogs());
            setShowOnboarding(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans select-none">
      {/* ── Header Section ── */}
      <div className="flex flex-col gap-3 pb-1">
        
        {/* Top Row: Actions & Navigation */}
        <div className="flex items-center justify-between w-full">
          {/* Back Navigation */}
          <button
            onClick={() => setCurrentRoute('tools', '', '/tools')}
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-sm"
            title="Back to Tools"
          >
            <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Habit Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* New Habit Button */}
            <button
              onClick={() => {
                setEditingHabit(null);
                setIsCreateModalOpen(true);
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black rounded-[18px] shadow-lg shadow-emerald-500/20 flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
              title="Create New Habit"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Segmented Control Tab Bar */}
        <div className="flex items-center bg-[#101322]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl gap-1 shadow-lg shadow-black/20 overflow-x-auto scrollbar-none w-fit">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'overall', label: 'Overall' },
            ] as const
          ).map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-initial px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content View ── */}
      <div>
        {activeTab === 'today' && (
          <HabitRadarTodayView
            habits={habits}
            logs={logs}
            settings={settings}
            onToggleDay={handleToggleDay}
            onOpenTimer={habit => setActiveTimerHabit(habit)}
            onEditHabit={habit => {
              setEditingHabit(habit);
              setIsCreateModalOpen(true);
            }}
          />
        )}

        {activeTab === 'weekly' && (
          <HabitRadarWeeklyView
            habits={habits}
            logs={logs}
            settings={settings}
            onToggleDay={handleToggleDay}
            onEditHabit={habit => {
              setEditingHabit(habit);
              setIsCreateModalOpen(true);
            }}
          />
        )}

        {activeTab === 'monthly' && (
          <HabitRadarMonthlyView
            habits={habits}
            logs={logs}
            settings={settings}
            onToggleDay={handleToggleDay}
            onOpenTimer={habit => setActiveTimerHabit(habit)}
            onEditHabit={habit => {
              setEditingHabit(habit);
              setIsCreateModalOpen(true);
            }}
          />
        )}

        {activeTab === 'overall' && (
          <HabitRadarOverallView
            habits={habits}
            logs={logs}
            settings={settings}
            onToggleDay={handleToggleDay}
            onEditHabit={habit => {
              setEditingHabit(habit);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Floating '+' Action Button on Mobile (Offset above bottom nav) */}
      <button
        onClick={() => {
          setEditingHabit(null);
          setIsCreateModalOpen(true);
        }}
        className="fixed bottom-24 sm:bottom-8 right-6 z-30 w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black flex items-center justify-center shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer sm:hidden"
        title="Create New Habit"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* ── Modals ── */}
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingHabit(null);
        }}
        onSaveHabit={handleSaveHabit}
        initialHabit={editingHabit}
        onDeleteHabit={handleDeleteHabit}
      />

      <HabitSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        habits={habits}
        onEditHabit={habit => {
          setEditingHabit(habit);
          setIsCreateModalOpen(true);
        }}
        onDeleteHabit={handleDeleteHabit}
        onCreateHabit={() => {
          setEditingHabit(null);
          setIsCreateModalOpen(true);
        }}
        onDataRefresh={() => {
          setHabits(habitRadarStorage.getHabits());
          setLogs(habitRadarStorage.getLogs());
          setSettings(habitRadarStorage.getSettings());
        }}
        onReRunOnboarding={() => setShowOnboarding(true)}
      />

      <HabitTimerModal
        isOpen={!!activeTimerHabit}
        onClose={() => setActiveTimerHabit(null)}
        habit={activeTimerHabit}
        onComplete={handleTimerComplete}
        soundEnabled={settings.sounds}
      />
    </div>
  );
};
