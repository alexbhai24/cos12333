import React from 'react';
import { SyllabusChapter, ChapterProgress, TopicProgress } from '../../types/syllabus';
import { getChapterIntelligence } from '../../data/chapterIntelligenceData';
import { 
  ArrowLeft, CheckCircle2, Circle, Flame, Target, BookOpen, 
  Check, Award, Lightbulb, Calculator, HelpCircle, Layers, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ChapterDetailViewProps {
  chapter: SyllabusChapter;
  subjectName?: string;
  examContext?: string;
  progress: ChapterProgress;
  topicState: TopicProgress;
  onToggleTopic: (topicId: string) => void;
  onBack: () => void;
  chapterIndex: number;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({
  chapter,
  subjectName,
  examContext,
  progress,
  topicState,
  onToggleTopic,
  onBack,
  chapterIndex
}) => {
  const intel = getChapterIntelligence(chapter, subjectName);
  const allCompleted = progress.isCompleted;
  const percentRounded = Math.round(progress.percentage);

  const handleToggleAll = () => {
    chapter.topics.forEach(t => {
      const isDone = !!topicState[t.id];
      if (allCompleted && isDone) {
        onToggleTopic(t.id);
      } else if (!allCompleted && !isDone) {
        onToggleTopic(t.id);
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-20 max-w-7xl mx-auto"
    >
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-semibold transition-all group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Chapters</span>
        </button>

        {examContext && (
          <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              {examContext}
            </span>
            {subjectName && (
              <>
                <span>•</span>
                <span className="text-cyan-400 font-semibold">{subjectName}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Chapter Header Banner — Minimalist Palette */}
      <div className="bg-[#081F1B] border border-[#235347]/50 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-[#0B2B26]/90 border border-[#235347] px-3 py-1 rounded-full text-xs font-semibold text-[#8EB69B] tracking-wider">
                CH #{chapterIndex + 1}
              </span>

              {chapter.pyqPriority === 'HIGH' && (
                <span className="bg-[#235347]/70 border border-[#8EB69B]/30 text-[#8EB69B] px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-[#8EB69B]" />
                  HIGH YIELD
                </span>
              )}

              <div className="bg-[#8EB69B] text-[#0B2B26] px-3.5 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{intel.markingScheme.totalMarksEstimate}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              {chapter.title}
            </h1>
          </div>

          {/* Quick Mark Complete Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <button
              onClick={handleToggleAll}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                allCompleted 
                ? 'bg-white/10 hover:bg-white/15 text-gray-200 border border-white/15' 
                : 'bg-[#8EB69B] hover:bg-[#8EB69B]/90 text-[#0B2B26] active:scale-95'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{allCompleted ? 'Unmark Entire Chapter' : 'Mark Entire Chapter Complete'}</span>
            </button>
          </div>
        </div>

        {/* Header Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#235347]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-[#8EB69B]" />
            <span>
              <strong className="text-white font-bold">{progress.completedTopics}</strong> of{' '}
              <strong className="text-white font-bold">{progress.totalTopics}</strong> topics completed
            </span>
          </div>

          <div className="flex items-center gap-3 sm:w-1/3">
            <div className="h-2 flex-1 bg-[#163832] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8EB69B] rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#8EB69B] font-mono">
              {percentRounded}%
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics Checklist (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#081F1B] border border-[#235347]/50 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#235347]/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#163832] border border-[#235347] flex items-center justify-center text-[#8EB69B]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Topics & Subtopics Checklist
                  </h2>
                  <p className="text-xs text-[#8EB69B]/70">
                    Click each topic as you finish learning or revising it.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#8EB69B] bg-[#163832] px-2.5 py-1 rounded-full border border-[#235347]">
                {chapter.topics.length} Topics
              </span>
            </div>

            {/* Topic Items */}
            <div className="space-y-2.5">
              {chapter.topics.map((topic, tIdx) => {
                const isChecked = !!topicState[topic.id];
                return (
                  <div
                    key={topic.id}
                    onClick={() => onToggleTopic(topic.id)}
                    className={`group flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all border ${
                      isChecked
                        ? 'bg-[#163832]/60 border-[#8EB69B]/40 shadow-sm'
                        : 'bg-[#0B2B26]/60 border-[#235347]/30 hover:border-[#8EB69B]/40'
                    }`}
                  >
                    <button 
                      className={`mt-0.5 shrink-0 transition-transform group-hover:scale-110 ${
                        isChecked ? 'text-[#8EB69B]' : 'text-[#235347] group-hover:text-[#8EB69B]/70'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle className="w-5 h-5 fill-[#8EB69B]/20 text-[#8EB69B]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#163832] text-[#8EB69B]/80">
                          #{tIdx + 1}
                        </span>
                        {isChecked && (
                          <span className="text-[10px] font-bold text-[#8EB69B] tracking-wider uppercase">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className={`text-sm sm:text-base leading-relaxed transition-all ${
                        isChecked ? 'text-[#8EB69B]/70 line-through' : 'text-gray-200 font-medium'
                      }`}>
                        {topic.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Marking Scheme, Summary & Formulas (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Marking Scheme & Weightage */}
          <div className="bg-[#081F1B] border border-[#235347]/50 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#235347]/40">
              <div className="w-8 h-8 rounded-lg bg-[#163832] border border-[#235347] flex items-center justify-center text-[#8EB69B]">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Marking Scheme & Exam Blueprint
                </h3>
                <p className="text-xs text-[#8EB69B]/70">
                  Targeted scoring breakdown & question pattern
                </p>
              </div>
            </div>

            {/* Total Marks Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#163832]/60 border border-[#235347]">
              <span className="text-xs font-semibold text-[#8EB69B]">Total Chapter Weightage</span>
              <span className="text-sm font-black text-[#8EB69B] font-mono">
                {intel.markingScheme.totalMarksEstimate}
              </span>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#8EB69B]/70 uppercase tracking-wider">
                Question Distribution Pattern
              </div>
              {intel.markingScheme.questionTypes.map((q, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B2B26]/70 border border-[#235347]/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EB69B]" />
                    <span className="font-semibold text-gray-200">{q.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-[11px] text-[#8EB69B]/70">{q.expectedCount}</span>
                    <span className="font-mono font-bold text-[#8EB69B] bg-[#163832] px-2 py-0.5 rounded border border-[#235347]">
                      {q.marks}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Exam Tip */}
            {intel.markingScheme.examTips && (
              <div className="p-3.5 rounded-xl bg-[#163832]/60 border border-[#235347] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#8EB69B]">
                  <Lightbulb className="w-3.5 h-3.5 text-[#8EB69B]" />
                  <span>Examiner's Insight / PYQ Note</span>
                </div>
                <p className="text-[#8EB69B]/80 leading-relaxed text-[11px]">
                  {intel.markingScheme.examTips}
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Chapter Summary */}
          <div className="bg-[#081F1B] border border-[#235347]/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#235347]/40">
              <div className="w-8 h-8 rounded-lg bg-[#163832] border border-[#235347] flex items-center justify-center text-[#8EB69B]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Chapter Summary
                </h3>
                <p className="text-xs text-[#8EB69B]/70">
                  Core overview and conceptual foundation
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {intel.summary}
            </p>

            {intel.keyHighlights && intel.keyHighlights.length > 0 && (
              <div className="pt-2 border-t border-[#235347]/30 space-y-1.5">
                <span className="text-[11px] font-bold text-[#8EB69B]/70 uppercase tracking-wider block">
                  Key Takeaways
                </span>
                <ul className="space-y-1.5">
                  {intel.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-[#8EB69B] font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Card 3: Formulas & Core Principles */}
          <div className="bg-[#081F1B] border border-[#235347]/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#235347]/40">
              <div className="w-8 h-8 rounded-lg bg-[#163832] border border-[#235347] flex items-center justify-center text-[#8EB69B]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Key Formulas & Rules
                </h3>
                <p className="text-xs text-[#8EB69B]/70">
                  {intel.hasFormulas ? 'Essential mathematical formulas' : 'Core principles & scoring guidelines'}
                </p>
              </div>
            </div>

            {intel.hasFormulas && intel.formulas && intel.formulas.length > 0 ? (
              <div className="space-y-3">
                {intel.formulas.map((item, fIdx) => (
                  <div key={fIdx} className="p-3 rounded-xl bg-[#0B2B26]/80 border border-[#235347]/60 space-y-1.5">
                    <div className="text-xs font-bold text-[#8EB69B]">
                      {item.name}
                    </div>
                    <div className="p-2 rounded bg-[#081F1B] border border-[#235347]/40 font-mono text-xs text-[#8EB69B] select-all overflow-x-auto">
                      {item.formula}
                    </div>
                    {item.explanation && (
                      <p className="text-[11px] text-[#8EB69B]/70 leading-snug">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0B2B26]/40 border border-[#235347]/40 text-xs text-[#8EB69B]/70 space-y-2">
                <p className="font-medium text-gray-200">
                  No numerical formulas apply to this chapter.
                </p>
                <p className="text-[11px] leading-relaxed text-[#8EB69B]/70">
                  Focus on conceptual clarity, proper terminology, structured point-wise answers, and case study applications.
                </p>
                {intel.corePrinciples && (
                  <ul className="pt-2 border-t border-[#235347]/30 space-y-1 text-[11px] text-gray-300">
                    {intel.corePrinciples.map((cp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#8EB69B] font-bold">✓</span>
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
