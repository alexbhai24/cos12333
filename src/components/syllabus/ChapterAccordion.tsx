import React, { useState } from 'react';
import { SyllabusChapter, ChapterProgress, TopicProgress } from '../../types/syllabus';
import { ChevronDown, ChevronRight, CheckCircle, Circle, Flame, Target, Info } from 'lucide-react';

interface ChapterAccordionProps {
  chapter: SyllabusChapter;
  progress: ChapterProgress;
  topicState: TopicProgress;
  onToggleTopic: (topicId: string) => void;
  onSelectChapter?: (chapterId: string) => void;
}

export const ChapterAccordion: React.FC<ChapterAccordionProps> = ({
  chapter,
  progress,
  topicState,
  onToggleTopic,
  onSelectChapter
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[var(--color-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.15)] bg-[var(--bg-surface)]' : 'border-[var(--border-color)] bg-[var(--bg-surface-solid)] hover:border-white/20'}`}>
      
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center space-x-3 flex-1">
          <button className="text-gray-400 hover:text-white transition-colors">
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <h3 className={`text-sm sm:text-base font-bold transition-colors ${progress.isCompleted ? 'text-emerald-400' : 'text-white'}`}>
              {chapter.title}
            </h3>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(chapter.pyqPriority)} flex items-center gap-1`}>
                <Flame className="w-3 h-3" />
                PYQ: {chapter.pyqPriority}
              </span>
              
              <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Weightage: {chapter.officialWeightage || 'Not officially published'}
              </span>
            </div>
          </div>
        </div>

        {/* Circular Progress (Minimal) */}
        <div className="flex items-center space-x-3 ml-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{Math.round(progress.percentage)}%</div>
            <div className="text-[10px] text-[var(--text-muted)]">{progress.completedTopics}/{progress.totalTopics} Topics</div>
          </div>
          <div className="relative w-10 h-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-700" />
              <circle 
                cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" 
                strokeDasharray="100" strokeDashoffset={100 - progress.percentage}
                className={`transition-all duration-500 ${progress.isCompleted ? 'text-emerald-400' : 'text-[var(--color-cyan)]'}`} 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-4 border-t border-white/5 bg-[var(--bg-surface-secondary)]/50 animate-in slide-in-from-top-2 duration-200 space-y-4">
          
          {/* AI Estimate Note if applicable */}
          {chapter.aiPriorityEstimate && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p><strong>AI/PYQ Priority Estimate:</strong> {chapter.aiPriorityEstimate}</p>
            </div>
          )}

          {/* Topics List */}
          <div className="space-y-2">
            {chapter.topics.map(topic => {
              const isChecked = !!topicState[topic.id];
              return (
                <div 
                  key={topic.id}
                  onClick={() => onToggleTopic(topic.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isChecked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <button className={`transition-colors ${isChecked ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {isChecked ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <span className={`text-sm ${isChecked ? 'text-emerald-200 line-through opacity-70' : 'text-gray-200'}`}>
                    {topic.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Open Full Chapter Detail View Button */}
          {onSelectChapter && (
            <div className="pt-2 border-t border-white/5 flex justify-end">
              <button
                onClick={() => onSelectChapter(chapter.id)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan-400 hover:text-cyan-300 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <span>Open Full Chapter Page & Summary</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
