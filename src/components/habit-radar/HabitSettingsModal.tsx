import React from 'react';
import {
  ArrowLeft, Palette, Volume2, Bell, LayoutGrid, ListFilter,
  Flame, Calendar, Globe, ShieldCheck, ChevronRight
} from 'lucide-react';
import { HabitSettings } from '../../types/habitRadar';
import { playSoftTickSound } from '../../utils/habitRadarStorage';

interface HabitSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HabitSettings;
  onUpdateSettings: (newSettings: HabitSettings) => void;
}

export const HabitSettingsModal: React.FC<HabitSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#0e111d] border-t sm:border border-white/10 rounded-t-[28px] sm:rounded-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out">
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1.5 bg-white/20 hover:bg-white/30 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0 cursor-pointer" onClick={onClose} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#121422]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white tracking-wide font-heading">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-7 custom-scrollbar">
          {/* Section: APPEARANCE */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              APPEARANCE
            </h3>
            <div className="bg-[#171926] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#1c1f2e] transition-colors cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Home Studio</h4>
                  <p className="text-xs text-slate-400">Theme, colors and home layout — all in one place.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Section: PREFERENCES */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              PREFERENCES
            </h3>
            <div className="bg-[#171926] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {/* Week start on */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Week start on</h4>
                  <p className="text-xs text-slate-400">Affects every grid and recap</p>
                </div>
                <div className="flex items-center bg-[#11131c] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
                  {(['Saturday', 'Sunday', 'Monday'] as const).map(day => (
                    <button
                      key={day}
                      onClick={() => update({ weekStartOn: day })}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        settings.weekStartOn === day
                          ? 'bg-[#292c3d] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sounds */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Sounds</h4>
                  <p className="text-xs text-slate-400">A soft tick when you keep a habit</p>
                </div>
                <button
                  onClick={() => {
                    const next = !settings.sounds;
                    update({ sounds: next });
                    if (next) playSoftTickSound(true);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.sounds ? 'bg-fuchsia-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.sounds ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Daily nudges */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Daily nudges</h4>
                  <p className="text-xs text-slate-400">A morning kickoff and one evening save — never more.</p>
                </div>
                <button
                  onClick={() => update({ dailyNudges: !settings.dailyNudges })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.dailyNudges ? 'bg-fuchsia-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.dailyNudges ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card density */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Card density</h4>
                </div>
                <div className="flex items-center bg-[#11131c] p-1 rounded-xl border border-white/5">
                  {(['comfortable', 'compact'] as const).map(density => (
                    <button
                      key={density}
                      onClick={() => update({ cardDensity: density })}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        settings.cardDensity === density
                          ? 'bg-[#292c3d] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show streak icon on toggles */}
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-bold text-white">Show streak icon on</h4>
                <div className="space-y-2.5 pl-1">
                  {[
                    { key: 'today', label: 'Today' },
                    { key: 'weekly', label: 'Weekly' },
                    { key: 'monthly', label: 'Monthly' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{label}</span>
                      <button
                        onClick={() =>
                          updateStreak(key as any, !settings.showStreakOn[key as keyof typeof settings.showStreakOn])
                        }
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          settings.showStreakOn[key as keyof typeof settings.showStreakOn]
                            ? 'bg-fuchsia-500'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.showStreakOn[key as keyof typeof settings.showStreakOn]
                              ? 'translate-x-4'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show Hijri date */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Show Hijri date</h4>
                </div>
                <button
                  onClick={() => update({ showHijriDate: !settings.showHijriDate })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.showHijriDate ? 'bg-fuchsia-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.showHijriDate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Change Language */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Change Language</h4>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>English</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#141622] border border-white/5 flex items-start gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Habit Radar works fully offline. Nothing leaves the phone unless you turn on backup or sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
