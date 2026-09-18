import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const TestInstructionsPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [isChecked, setIsChecked] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleStart = () => {
    if (isChecked) {
      const segments = window.location.pathname.split('/');
      let testId = new URLSearchParams(window.location.search).get('testId');
      if (!testId && segments.includes('instructions')) {
         testId = segments[segments.indexOf('instructions') + 1];
      }
      if (!testId) testId = localStorage.getItem('active_test_id') || '';

      setCurrentRoute('nta-test', '', `/tools/mock-tests/active/${testId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1f2e] text-white/80 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-[#232736] rounded-xl border border-white/5 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2a2f42] p-4 text-center font-bold tracking-wider text-sm text-white uppercase border-b border-white/5">
          General Instructions
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 text-sm leading-relaxed">
          
          <div className="flex justify-end items-center gap-2">
            <span>View Instructions In:</span>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)}
              className="bg-[#1c1f2e] border border-white/10 rounded-md px-3 py-1.5 text-white text-sm outline-none"
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg">Test Details</h2>
            <p>
              The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.
            </p>
            <p>
              The Questions Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
            </p>

            <div className="space-y-3 bg-[#1c1f2e] p-6 rounded-lg border border-white/5 max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-gray-400 flex items-center justify-center font-bold text-white shadow-inner">1</div>
                <span>You have not visited the question yet.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center font-bold text-white shadow-inner">2</div>
                <span>You have not answered the question.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center font-bold text-white shadow-inner">3</div>
                <span>You have answered the question.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center font-bold text-white shadow-inner">4</div>
                <span>You have NOT answered the question, but have marked the question for review.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-purple-500 relative overflow-hidden flex items-center justify-center font-bold text-white shadow-inner">
                  5
                  <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <span>The question(s) "Answered and Marked for Review" will be considered for evaluation.</span>
              </div>
            </div>

            <p>
              You can click on the language dropdown on the top right corner of the question box to change the language during the exam for the entire question paper.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white">Navigating to a Question:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-white/70">
              <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
              <li>Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</li>
              <li>Click on <strong>Mark for Review & Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
            </ol>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="font-bold text-white">Declaration:</h3>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-white/70 group-hover:text-white/90 transition-colors">
                I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. / any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations.
              </span>
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-[#2a2f42] p-4 border-t border-white/5 flex justify-between items-center">
          <button 
            onClick={() => setCurrentRoute('mock-tests')}
            className="px-6 py-2.5 rounded text-sm font-medium bg-[#1c1f2e] text-white/70 hover:text-white transition-colors border border-white/10"
          >
            &lt; Previous
          </button>
          
          <button 
            onClick={handleStart}
            disabled={!isChecked}
            className="px-6 py-2.5 rounded text-sm font-bold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ 
              background: isChecked ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#1c1f2e',
              color: isChecked ? '#fff' : 'rgba(255,255,255,0.4)',
              boxShadow: isChecked ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
            }}
          >
            I am ready to begin
          </button>
        </div>

      </div>
    </div>
  );
};
