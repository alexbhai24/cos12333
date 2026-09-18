import React, { useState } from 'react';
import { ComprehensionQuestion, ReadingPassage } from '../../data/biology/readingPassagesData';
import { Check, X, ArrowRight, BookOpen, Sparkles, Award, AlertCircle, HelpCircle } from 'lucide-react';

interface ReadingComprehensionViewProps {
  passage: ReadingPassage;
  readingTimeSeconds: number;
  readingWpm: number;
  onSubmitResults: (
    correctCount: number,
    totalCount: number,
    accuracyPercentage: number,
    overallScore: number
  ) => void;
}

export const ReadingComprehensionView: React.FC<ReadingComprehensionViewProps> = ({
  passage,
  readingTimeSeconds,
  readingWpm,
  onSubmitResults
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = passage.questions;
  const currentQuestion = questions[currentQIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (optIndex: number) => {
    if (submitted) return; // locked after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleFinishTest = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });

    const accuracyPct = Math.round((correct / totalQuestions) * 100);

    // Overall Score calculation:
    // Balances Speed (normalized 120-220 WPM to 0-100) and Comprehension Accuracy
    const normalizedSpeedScore = Math.min(Math.max(((readingWpm - 100) / 120) * 100, 20), 100);
    const overallScore = Math.round((accuracyPct * 0.7) + (normalizedSpeedScore * 0.3));

    setSubmitted(true);
    onSubmitResults(correct, totalQuestions, accuracyPct, overallScore);
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Test Banner Header */}
      <div className="rounded-2xl p-4 bg-[#0f1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
              Comprehension Check
            </span>
            <span className="text-xs text-gray-400">
              {passage.chapterTitle} › {passage.topicTitle}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Answer based on the passage you just read
          </h3>
        </div>

        {/* Recorded Reading Stats Reminder */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto text-xs font-mono">
          <span className="text-gray-400">Reading Speed:</span>
          <span className="font-bold text-cyan-400">{readingWpm} WPM</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">Time:</span>
          <span className="font-bold text-white">{Math.floor(readingTimeSeconds / 60)}m {readingTimeSeconds % 60}s</span>
        </div>
      </div>

      {/* Progress & Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">
            Question <strong className="text-white">{currentQIndex + 1}</strong> of {totalQuestions}
          </span>
          <span className="text-xs text-cyan-400 font-semibold uppercase">
            {currentQuestion.type === 'assertion' ? 'Assertion & Reason' : currentQuestion.type === 'statement' ? 'Statement Evaluation' : 'Multiple Choice'}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))` }}>
          {questions.map((_, i) => {
            const isAnswered = selectedAnswers[i] !== undefined;
            const isCurrent = i === currentQIndex;
            return (
              <div
                key={i}
                onClick={() => setCurrentQIndex(i)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                    : isAnswered
                    ? 'bg-emerald-400'
                    : 'bg-white/15 hover:bg-white/30'
                }`}
                title={`Question ${i + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0d1222] border border-white/15 shadow-2xl space-y-6">
        {/* Question Text */}
        <div>
          <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider block mb-1">
            Question {currentQIndex + 1}
          </span>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed whitespace-pre-wrap">
            {currentQuestion.question}
          </p>
        </div>

        {/* 4 Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((optionText, optIndex) => {
            const letter = ['A', 'B', 'C', 'D'][optIndex];
            const isSelected = selectedAnswers[currentQIndex] === optIndex;

            return (
              <button
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-cyan-400 text-black font-black'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {letter}
                </span>

                <span className="text-sm sm:text-base pt-0.5 leading-normal flex-1">
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentQIndex === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            currentQIndex > 0
              ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 cursor-pointer'
              : 'bg-transparent border-transparent text-white/20 cursor-not-allowed'
          }`}
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          {currentQIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-black bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-md"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={handleFinishTest}
              disabled={!isAllAnswered}
              className={`px-7 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-xl flex items-center gap-2 ${
                isAllAnswered
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:scale-[1.02] cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Submit & View Results</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
