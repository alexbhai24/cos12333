import React, { useState } from 'react';
import {
  X, Search, Droplets, Moon, Heart, Activity, Flame, Dumbbell,
  Footprints, Bike, Trophy, Award, Book, BookOpen, GraduationCap,
  Pencil, Clock, Sunrise, Star, Coffee, Bed, Sparkles, Smile,
  Briefcase, Laptop, Target, CheckCircle2, Apple, Zap, Music
} from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconNameOrEmoji: string) => void;
  currentIcon: string;
}

export const LUCIDE_ICONS_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  // Health
  droplets: Droplets,
  moon: Moon,
  heart: Heart,
  activity: Activity,
  bed: Bed,
  coffee: Coffee,
  sunrise: Sunrise,
  // Fitness
  dumbbell: Dumbbell,
  footprints: Footprints,
  bike: Bike,
  flame: Flame,
  zap: Zap,
  // Sports
  trophy: Trophy,
  award: Award,
  target: Target,
  // Study
  book: Book,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  pencil: Pencil,
  clock: Clock,
  star: Star,
  // Work
  briefcase: Briefcase,
  laptop: Laptop,
  sparkles: Sparkles,
  apple: Apple,
  music: Music,
};

const ICON_CATEGORIES = [
  {
    name: 'Health',
    icons: ['droplets', 'moon', 'heart', 'activity', 'bed', 'coffee', 'sunrise'],
  },
  {
    name: 'Fitness',
    icons: ['dumbbell', 'footprints', 'bike', 'flame', 'zap'],
  },
  {
    name: 'Sports & Goals',
    icons: ['trophy', 'award', 'target'],
  },
  {
    name: 'Study',
    icons: ['book', 'book-open', 'graduation-cap', 'pencil', 'clock', 'star'],
  },
  {
    name: 'Work & Daily',
    icons: ['briefcase', 'laptop', 'sparkles', 'apple', 'music'],
  },
];

const EMOJI_CATEGORIES = [
  {
    name: 'Food & Health',
    emojis: ['🍎', '🍊', '🍇', '🍓', '🫐', '🍌', '🍉', '🥦', '🍕', '🍔', '🌮', '🍜', '🍣', '🥗', '☕', '🎂', '🧁', '🍦', '💧', '🍵'],
  },
  {
    name: 'Travel & Outdoors',
    emojis: ['✈️', '🚀', '🚂', '🚢', '🗺️', '🧭', '🏛️', '🏰', '⛩️', '🗽', '🗼', '🏝️', '🌆', '🌐', '⛺', '🏔️', '🌲', '🌅'],
  },
  {
    name: 'Feelings & Faces',
    emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '🤩', '😇', '🥳', '💪', '🧘', '🏋️'],
  },
  {
    name: 'Symbols & Motivation',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🔥', '⭐', '✨', '⚡', '🎯', '🏆', '🥇', '📚', '💡', '⏰', '🛡️', '🪴'],
  },
];

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  currentIcon,
}) => {
  const [tab, setTab] = useState<'icon' | 'emoji'>('icon');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

      {/* Slide-from-bottom drawer sheet */}
      <div className="relative z-10 w-full max-w-lg bg-[#0e111d] border-t sm:border border-white/10 rounded-t-[28px] sm:rounded-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out">
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1.5 bg-white/20 hover:bg-white/30 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0 cursor-pointer" onClick={onClose} />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-white/5">
          {/* Segmented Control */}
          <div className="flex items-center bg-[#181a27] p-1 rounded-xl w-full max-w-xs mx-auto border border-white/5">
            <button
              onClick={() => setTab('icon')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'icon'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Icons
            </button>
            <button
              onClick={() => setTab('emoji')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'emoji'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Emojis
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 border-b border-white/5 bg-[#121422]/50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tab === 'icon' ? 'Search icons...' : 'Search emojis...'}
              className="w-full bg-[#181b28] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {tab === 'icon' ? (
            ICON_CATEGORIES.map(cat => {
              const filtered = cat.icons.filter(name =>
                name.toLowerCase().includes(search.toLowerCase())
              );
              if (filtered.length === 0) return null;

              return (
                <div key={cat.name} className="space-y-2.5">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-6 sm:grid-cols-7 gap-2.5">
                    {filtered.map(name => {
                      const IconComp = LUCIDE_ICONS_MAP[name] || Star;
                      const isSelected = currentIcon === name;
                      return (
                        <button
                          key={name}
                          onClick={() => {
                            onSelectIcon(name);
                            onClose();
                          }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-500/20 border-2 border-purple-400 text-purple-300 shadow-md scale-105'
                              : 'bg-[#1b1d28] hover:bg-[#242736] border border-white/5 text-slate-300 hover:text-white'
                          }`}
                          title={name}
                        >
                          <IconComp className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            EMOJI_CATEGORIES.map(cat => {
              const filtered = cat.emojis.filter(emoji =>
                emoji.includes(search)
              );
              if (filtered.length === 0) return null;

              return (
                <div key={cat.name} className="space-y-2.5">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-6 sm:grid-cols-7 gap-2.5">
                    {filtered.map(emoji => {
                      const isSelected = currentIcon === emoji;
                      return (
                        <button
                          key={emoji}
                          onClick={() => {
                            onSelectIcon(emoji);
                            onClose();
                          }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-500/20 border-2 border-purple-400 shadow-md scale-105'
                              : 'bg-[#1b1d28] hover:bg-[#242736] border border-white/5'
                          }`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
