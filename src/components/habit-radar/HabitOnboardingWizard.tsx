import React, { useState } from 'react';
import {
  ChevronLeft, Check, Plus, Moon, Utensils, Droplets, Dumbbell,
  Footprints, Brain, ShieldAlert, Sparkles, Volume2, Calendar, ArrowRight, Zap, Target
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
  trackType: 'task' | 'amount' | 'time';
  targetAmount?: number;
  targetMinutes?: number;
  unit?: string;
}

const STARTER_PRESETS: StarterPreset[] = [
  { id: 'preset_sleep', name: 'Sleep over 8h', icon: 'moon', color: '#60a5fa', trackType: 'task' },
  { id: 'preset_meal', name: 'Have a healthy meal', icon: 'utensils', color: '#c4b5fd', trackType: 'task' },
  { id: 'preset_water', name: 'Drink 8 cups of water', icon: 'droplets', color: '#38bdf8', trackType: 'amount', targetAmount: 8, unit: 'cups' },
  { id: 'preset_workout', name: 'Workout', icon: 'dumbbell', color: '#38bdf8', trackType: 'task' },
  { id: 'preset_walking', name: 'Walking', icon: 'footprints', color: '#4ade80', trackType: 'amount', targetAmount: 5000, unit: 'steps' },
  { id: 'preset_meditation', name: 'Practice meditation', icon: 'brain', color: '#fb923c', trackType: 'task' },
  { id: 'preset_posture', name: 'Maintain good posture', icon: 'zap', color: '#2dd4bf', trackType: 'task' },
  { id: 'preset_screen', name: 'Block screen time', icon: 'shield-alert', color: '#f87171', trackType: 'task' },
];

export const HabitOnboardingWizard: React.FC<HabitOnboardingWizardProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [primaryGoal, setPrimaryGoal] = useState<string>('academic');

  // Step 2 state
  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>(['preset_water', 'preset_workout']);
  const [customHabitName, setCustomHabitName] = useState<string>('');
  const [customHabitsList, setCustomHabitsList] = useState<Habit[]>([]);

  // Step 3 state
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
    // Build final list of habits
    const selectedPresets = STARTER_PRESETS.filter(p => selectedPresetIds.includes(p.id));
    const convertedPresets: Habit[] = selectedPresets.map(p => ({
      id: `habit_${p.id}_${Date.now()}`,
      name: p.name,
      icon: p.icon,
      color: p.color,
      trackType: p.trackType,
      targetAmount: p.targetAmount,
      targetMinutes: p.targetMinutes,
      unit: p.unit,
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
    <div className="min-h-[85vh] w-full max-w-xl mx-auto flex flex-col justify-between p-4 sm:p-6 text-white font-sans select-none animate-in fade-in duration-300">
      
      {/* ── Top Header & Step Progress Bar ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((currentStep - 1) as 1 | 2)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}

          {/* 3 Step Segment Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'w-10 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : step < currentStep
                    ? 'w-6 bg-blue-500/50'
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

        {/* ── STEP 1: GOAL FOCUS ── */}
        {currentStep === 1 && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What’s your main focus right now?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Select your primary goal to help us structure your habit radar.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  id: 'academic',
                  title: 'Academic Discipline & Revision',
                  desc: 'Targeted study routines for NEET, JEE & Exams',
                  icon: Target,
                  color: '#38bdf8',
                },
                {
                  id: 'fitness',
                  title: 'Health, Fitness & Vitality',
                  desc: 'Regular workout, hydration & sleep schedules',
                  icon: Dumbbell,
                  color: '#4ade80',
                },
                {
                  id: 'focus',
                  title: 'Deep Focus & Mental Mindfulness',
                  desc: 'Meditation, reading & digital detox',
                  icon: Brain,
                  color: '#fb923c',
                },
                {
                  id: 'routine',
                  title: 'Daily Habit Consistency',
                  desc: 'Building continuous streaks and productive routines',
                  icon: Sparkles,
                  color: '#c4b5fd',
                },
              ].map(goal => {
                const isSelected = primaryGoal === goal.id;
                const IconComp = goal.icon;
                return (
                  <div
                    key={goal.id}
                    onClick={() => setPrimaryGoal(goal.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? 'bg-[#1b2238] border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.25)] scale-[1.01]'
                        : 'bg-[#131625] border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${goal.color}20`,
                        borderColor: `${goal.color}40`,
                      }}
                    >
                      <IconComp className="w-6 h-6" style={{ color: goal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{goal.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: CHOOSE STARTER HABITS (Matching User Screenshot UI) ── */}
        {currentStep === 2 && (
          <div className="space-y-5 pt-1 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Choose the first habit that you'd like to build
              </h2>
            </div>

            {/* List of preset cards */}
            <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1 custom-scrollbar">
              {STARTER_PRESETS.map(preset => {
                const isSelected = selectedPresetIds.includes(preset.id);
                return (
                  <div
                    key={preset.id}
                    onClick={() => togglePreset(preset.id)}
                    className={`w-full py-3.5 px-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-3 text-center ${
                      isSelected
                        ? 'bg-[#1a233b] border-blue-500/80 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-[#1a1d2c] border-white/5 hover:border-white/15 text-slate-200 font-semibold'
                    }`}
                  >
                    {/* Icon */}
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

                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider: Or type your own */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0e111d] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Or type your own
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Custom Input Box */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#1a1d2c] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-slate-500">✎</span>
                <input
                  type="text"
                  value={customHabitName}
                  onChange={e => setCustomHabitName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCustomHabit()}
                  placeholder="Your first habit is..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
                />
              </div>

              {customHabitName.trim() && (
                <button
                  onClick={handleAddCustomHabit}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shrink-0"
                >
                  Add
                </button>
              )}
            </div>

            {/* Added custom habits tags */}
            {customHabitsList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {customHabitsList.map((h, i) => (
                  <div key={i} className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5">
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

        {/* ── STEP 3: PREFERENCES & LAUNCH ── */}
        {currentStep === 3 && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                All Set & Ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Customize your audio feedback and weekly schedule preferences.
              </p>
            </div>

            <div className="bg-[#141726] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden p-1">
              {/* Sound Toggle */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Soft Audio Feedback</h4>
                    <p className="text-xs text-slate-400">Tactile completion ticks when keeping habits</p>
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

              {/* Week Start */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">First Day of Week</h4>
                    <p className="text-xs text-slate-400">Sets starting day for weekly grids</p>
                  </div>
                </div>

                <div className="flex items-center bg-[#0d0f1a] p-1 rounded-xl border border-white/5">
                  {(['Saturday', 'Sunday', 'Monday'] as const).map(day => (
                    <button
                      key={day}
                      onClick={() => setWeekStart(day)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        weekStart === day
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'text-slate-400 hover:text-white'
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
              <span className="text-blue-300 font-semibold">Starter Habits Configured</span>
              <span className="px-3 py-1 rounded-xl bg-blue-500 text-white font-bold">
                {selectedPresetIds.length + customHabitsList.length} Habits
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action Buttons Bar (Matching User Screenshot Layout) ── */}
      <div className="pt-6 grid grid-cols-2 gap-4">
        {/* SKIP Button */}
        <button
          onClick={handleSkip}
          className="py-3.5 px-6 rounded-2xl bg-[#252836] hover:bg-[#2d3142] text-slate-300 hover:text-white font-bold text-sm tracking-wider uppercase transition-all cursor-pointer text-center"
        >
          SKIP
        </button>

        {/* NEXT / FINISH Button */}
        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep((currentStep + 1) as 2 | 3)}
            className="py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>NEXT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteWizard}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>FINISH</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>

    </div>
  );
};
