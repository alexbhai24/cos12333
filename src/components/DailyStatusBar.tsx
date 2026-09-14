import React, { useState } from 'react';
import { Flame, Atom, FlaskConical, Dna, Calculator, Check } from 'lucide-react';
import { SubjectKey } from '../types/dailyStatus';
import { useDailyStatus } from '../hooks/useDailyStatus';
import { DailyStoryModal } from './DailyStoryModal';
import { useApp } from '../context/AppContext';

interface DailyStatusBarProps {
  onOpenStreakDrawer?: () => void;
}

export const DailyStatusBar: React.FC<DailyStatusBarProps> = ({ onOpenStreakDrawer }) => {
  const { user, setIsStreakDrawerOpen } = useApp();
  const { questionsMap, userAnswers, completedSubjects, answerQuestion } = useDailyStatus();

  const [activeSubject, setActiveSubject] = useState<SubjectKey | 'streak' | null>(null);

  const statusItems: {
    key: SubjectKey | 'streak';
    label: string;
    icon: React.ReactNode;
    ringColor: string;
    bgColor: string;
    textColor: string;
    streakValue?: number;
  }[] = [
    {
      key: 'streak',
      label: 'Streak',
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      ringColor: 'from-orange-500 via-amber-400 to-yellow-500',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
      textColor: 'text-orange-400',
      streakValue: user?.streak || 1
    },
    {
      key: 'physics',
      label: 'Physics',
      icon: <Atom className="w-6 h-6 text-rose-400" />,
      ringColor: 'from-rose-500 via-pink-400 to-red-500',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      textColor: 'text-rose-400'
    },
    {
      key: 'chemistry',
      label: 'Chemistry',
      icon: <FlaskConical className="w-6 h-6 text-cyan-400" />,
      ringColor: 'from-cyan-400 via-blue-400 to-indigo-500',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      textColor: 'text-cyan-400'
    },
    {
      key: 'biology',
      label: 'Biology',
      icon: <Dna className="w-6 h-6 text-emerald-400" />,
      ringColor: 'from-emerald-400 via-teal-400 to-green-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      textColor: 'text-emerald-400'
    },
    {
      key: 'mathematics',
      label: 'Mathematics',
      icon: <Calculator className="w-6 h-6 text-purple-400" />,
      ringColor: 'from-purple-400 via-violet-400 to-indigo-500',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      textColor: 'text-purple-400'
    }
  ];

  const handleOpenSubject = (key: SubjectKey | 'streak') => {
    setActiveSubject(key);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 relative overflow-hidden hover-shine-effect">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-heading">
          Question of the Day
        </h2>
        <span className="text-[10px] font-semibold text-[var(--color-cyan)] bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 px-2.5 py-0.5 rounded-full">
          Daily PCMB Stories
        </span>
      </div>

      {/* Stories Circle Row */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 pt-1 no-scrollbar justify-start sm:justify-around">
        {statusItems.map((item) => {
          const isCompleted = item.key !== 'streak' && completedSubjects.includes(item.key as string);

          return (
            <div
              key={item.key}
              onClick={() => handleOpenSubject(item.key)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              {/* Instagram Story Gradient Outer Ring */}
              <div
                className={`relative p-[2.5px] rounded-full bg-gradient-to-tr ${
                  isCompleted
                    ? 'from-gray-600 to-gray-500 opacity-60'
                    : item.ringColor
                } group-hover:scale-105 transition-transform duration-300 shadow-md`}
              >
                {/* Inner Circle Icon Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#121624] border border-white/10 flex flex-col items-center justify-center p-2 relative shadow-inner">
                  {item.key === 'streak' ? (
                    <>
                      {item.icon}
                      <span className="text-[11px] font-black text-orange-400 font-sans -mt-1">
                        {item.streakValue}
                      </span>
                    </>
                  ) : (
                    item.icon
                  )}

                  {/* Completed Checkmark Badge */}
                  {isCompleted && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#121624] flex items-center justify-center text-black shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title Label */}
              <span
                className={`text-xs font-extrabold tracking-tight transition-colors ${
                  isCompleted ? 'text-gray-500' : 'text-gray-200 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Question Modal */}
      {activeSubject && (
        <DailyStoryModal
          isOpen={!!activeSubject}
          onClose={() => setActiveSubject(null)}
          subject={activeSubject}
          questions={activeSubject !== 'streak' ? questionsMap[activeSubject] || [] : []}
          userAnswers={activeSubject !== 'streak' ? userAnswers[activeSubject] || {} : {}}
          onAnswer={answerQuestion}
          userStreak={user?.streak || 1}
          onOpenStreakDrawer={() => {
            if (onOpenStreakDrawer) onOpenStreakDrawer();
            else setIsStreakDrawerOpen(true);
          }}
        />
      )}
    </div>
  );
};
