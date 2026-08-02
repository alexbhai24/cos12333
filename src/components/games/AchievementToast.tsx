import React, { useEffect, useState } from 'react';
import type { Achievement } from '../../games/types';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!achievement) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed bottom-20 right-6 z-[200] transition-all duration-400 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 bg-[#090C22] border border-yellow-400/40 rounded-2xl p-4 shadow-2xl shadow-yellow-500/20 min-w-[260px] max-w-xs">
        <div className="w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-2xl flex-shrink-0">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-0.5">
            Achievement Unlocked!
          </div>
          <div className="text-xs font-bold text-white">{achievement.title}</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-snug">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
};
