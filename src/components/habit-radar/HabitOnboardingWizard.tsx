import React, { useState } from 'react';
import {
  ChevronLeft, Check, Plus, Moon, Utensils, Droplets, Dumbbell,
  Footprints, Brain, ShieldAlert, Sparkles, Volume2, Calendar, ArrowRight, Zap
} from 'lucide-react';
import { Habit, PASTEL_COLORS } from '../../types/habitRadar';
import { habitRadarStorage, playSoftTickSound } from '../../utils/habitRadarStorage';

interface HabitOnboardingWizardProps {
  onFinish: (selectedHabits: Habit[]) => void;
}

interface StarterPreset {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const STARTER_PRESETS: StarterPreset[] = [
  { id: 'preset_sleep', name: 'Sleep over 8h', icon: 'moon', color: '#60a5fa' },
  { id: 'preset_meal', name: 'Have a healthy meal', icon: 'utensils', color: '#c4b5fd' },
  { id: 'preset_water', name: 'Drink 8 cups of water', icon: 'droplets', color: '#38bdf8' },
  { id: 'preset_workout', name: 'Workout', icon: 'dumbbell', color: '#4ade80' },
  { id: 'preset_walking', name: 'Walking', icon: 'footprints', color: '#34d399' },
  { id: 'preset_meditation', name: 'Practice meditation', icon: 'brain', color: '#fb923c' },
  { id: 'preset_posture', name: 'Maintain good posture', icon: 'zap', color: '#2dd4bf' },
  { id: 'preset_screen', name: 'Block screen time', icon: 'shield-alert', color: '#f87171' },
];

export const HabitOnboardingWizard: React.FC<HabitOnboardingWizardProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1 state: Selected habit IDs
  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>(['preset_sleep', 'preset_water', 'preset_workout']);
  const [customHabitName, setCustomHabitName] = useState<string>('');
  const [customHabitsList, setCustomHabitsList] = useState<Habit[]>([]);

  // Step 2 state: Preferences
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [weekStart, setWeekStart] = useState<'Monday' | 'Sunday' | 'Saturday'>('Monday');

  const togglePreset = (id: string) => {
    if (selectedPresetIds.includes(id)) {
      setSelectedPresetIds(selectedPresetIds.filter(item => item !== id));
    } else {
      setSelectedPresetIds([...selectedPresetIds, id]);
    }
  };

  const handleAddCustomHabit = () => {
    if (!customHabitName.trim()) return;
    const newHabit: Habit = {
      id: `custom_${Date.now()}`,
      name: customHabitName.trim(),
      icon: 'sparkles',
      color: PASTEL_COLORS[customHabitsList.length % PASTEL_COLORS.length],
      trackType: 'task',
      repeatType: 'daily',
      repeatDays: [1, 2, 3, 4, 5, 6, 7],
      createdAt: new Date().toISOString(),
    };
    setCustomHabitsList([...customHabitsList, newHabit]);
    setCustomHabitName('');
  };

  const handleCompleteWizard = () => {
    // Convert selected presets to simple 1-tap Habits
    const selectedPresets = STARTER_PRESETS.filter(p => selectedPresetIds.includes(p.id));
    const convertedPresets: Habit[] = selectedPresets.map(p => ({
      id: `habit_${p.id}_${Date.now()}`,
      name: p.name,
      icon: p.icon,
      color: p.color,
      trackType: 'task',
      repeatType: 'daily',
      repeatDays: [1, 2, 3, 4, 5, 6, 7],
      createdAt: new Date().toISOString(),
    }));

    const finalHabits = [...convertedPresets, ...customHabitsList];
    habitRadarStorage.saveHabits(finalHabits);
    habitRadarStorage.saveSettings({
      ...habitRadarStorage.getSettings(),
      sounds: soundEnabled,
      weekStartOn: weekStart,
    });
    habitRadarStorage.setOnboardingCompleted(true);
    onFinish(finalHabits);
  };

  const handleSkip = () => {
    habitRadarStorage.saveHabits([]);
    habitRadarStorage.setOnboardingCompleted(true);
    onFinish([]);
  };

  return (
    <div className="min-h-[80vh] w-full max-w-lg mx-auto flex flex-col justify-between p-4 sm:p-6 pb-32 text-white font-sans select-none animate-in fade-in duration-300">
      
      {/* Top Navigation & Step Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}

          {/* 2 Step Segment Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2].map(step => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'w-10 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'w-6 bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* ── STEP 1: CHOOSE STARTER HABITS ── */}
        {currentStep === 1 && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Choose the first habit that you'd like to build
              </h2>
            </div>

            {/* List of preset cards */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              {STARTER_PRESETS.map(preset => {
                const isSelected = selectedPresetIds.includes(preset.id);
                return (
                  <div
                    key={preset.id}
                    onClick={() => togglePreset(preset.id)}
                    className={`w-full py-3 px-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#1a233b] border-blue-500/80 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                        : 'bg-[#151724] border-white/5 hover:border-white/15 text-slate-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${preset.color}25` }}
                      >
                        {preset.icon === 'moon' && <Moon className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'utensils' && <Utensils className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'droplets' && <Droplets className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'dumbbell' && <Dumbbell className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'footprints' && <Footprints className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'brain' && <Brain className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'zap' && <Zap className="w-4 h-4" style={{ color: preset.color }} />}
                        {preset.icon === 'shield-alert' && <ShieldAlert className="w-4 h-4" style={{ color: preset.color }} />}
                      </div>

                      <span className="text-sm">{preset.name}</span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider: Or type your own */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0e111d] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Or type your own
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Custom Input Box */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#151724] border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <span className="text-slate-500 text-xs">✎</span>
                <input
                  type="text"
                  value={customHabitName}
                  onChange={e => setCustomHabitName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCustomHabit()}
                  placeholder="Your first habit is..."
                  className="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder-slate-500 w-full"
                />
              </div>

              {customHabitName.trim() && (
                <button
                  onClick={handleAddCustomHabit}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shrink-0"
                >
                  Add
                </button>
              )}
            </div>

            {/* Custom Habit Tags */}
            {customHabitsList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {customHabitsList.map((h, i) => (
                  <div key={i} className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                    <span>{h.name}</span>
                    <button
                      onClick={() => setCustomHabitsList(customHabitsList.filter((_, idx) => idx !== i))}
                      className="text-purple-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: PREFERENCES & FINISH ── */}
        {currentStep === 2 && (
          <div className="space-y-5 pt-2 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Quick Preferences
              </h2>
              <p className="text-xs text-slate-400">
                Configure your completion audio and weekly start day.
              </p>
            </div>

            <div className="bg-[#141624] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {/* Sound Toggle */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Soft Completion Audio</h4>
                    <p className="text-xs text-slate-400">Play click sound on habit completion</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playSoftTickSound(true);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    soundEnabled ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* First Day of Week — Mobile Responsive 3-Col Grid */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">First Day of Week</h4>
                    <p className="text-xs text-slate-400">Weekly view calendar layout</p>
                  </div>
                </div>

                {/* Grid layout ensuring no text clipping on any mobile screen */}
                <div className="grid grid-cols-3 gap-2 w-full pt-1">
                  {(['Saturday', 'Sunday', 'Monday'] as const).map(day => (
                    <button
                      key={day}
                      onClick={() => setWeekStart(day)}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                        weekStart === day
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Summary Card */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs">
              <span className="text-blue-300 font-semibold">Starter Habits Selected</span>
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold">
                {selectedPresetIds.length + customHabitsList.length} Habits
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action Buttons Bar (Sits nicely above bottom navigation) ── */}
      <div className="pt-6 grid grid-cols-2 gap-3">
        <button
          onClick={handleSkip}
          className="py-3 px-5 rounded-2xl bg-[#222534] hover:bg-[#2b2f42] text-slate-300 hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer text-center"
        >
          SKIP
        </button>

        {currentStep === 1 ? (
          <button
            onClick={() => setCurrentStep(2)}
            className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>NEXT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteWizard}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>FINISH</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>

    </div>
  );
};
