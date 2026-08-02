import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { linkService } from '../../services/linkService';
import { useModalLock } from '../../hooks/useModalLock';

export const TestModal: React.FC = () => {
  const { activeTestModal, setActiveTestModal, completeTest } = useApp();

  const durationMins = activeTestModal?.durationMinutes || 60;
  const initialSeconds = durationMins * 60;
  useModalLock(!!activeTestModal);

  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [showExitWarning, setShowExitWarning] = useState<boolean>(false);
  const [attemptSaved, setAttemptSaved] = useState<boolean>(false);

  const startTimeRef = useRef<string>(new Date().toISOString());

  // Reset timer state when activeTestModal changes
  useEffect(() => {
    if (activeTestModal) {
      const secs = (activeTestModal.durationMinutes || 60) * 60;
      setTimeLeft(secs);
      setIsExpired(false);
      setShowExitWarning(false);
      setAttemptSaved(false);
      startTimeRef.current = new Date().toISOString();
    }
  }, [activeTestModal?.id, activeTestModal?.durationMinutes]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!activeTestModal || !activeTestModal.googleFormUrl || isExpired) return;

    if (timeLeft <= 0) {
      setIsExpired(true);
      handleSaveAttempt(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTestModal, timeLeft, isExpired]);

  if (!activeTestModal) return null;

  const embeddedUrl = activeTestModal.googleFormUrl
    ? linkService.formatGoogleFormUrl(activeTestModal.googleFormUrl)
    : '';

  const rawUrl = activeTestModal.googleFormUrl
    ? activeTestModal.googleFormUrl.replace('?embedded=true', '').replace('&embedded=true', '')
    : '';

  const handleSaveAttempt = (timerExpired: boolean) => {
    if (attemptSaved || !activeTestModal) return;
    setAttemptSaved(true);

    const totalSecs = (activeTestModal.durationMinutes || 60) * 60;
    const timeSpentSeconds = Math.max(0, totalSecs - timeLeft);

    const attemptRecord = {
      id: `attempt-${Date.now()}`,
      testId: activeTestModal.id,
      testTitle: activeTestModal.title,
      subject: activeTestModal.subject,
      startTime: startTimeRef.current,
      endTime: new Date().toISOString(),
      durationMinutes: activeTestModal.durationMinutes || 60,
      timeSpentSeconds,
      timerExpired,
      completedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('cosmicbone_test_attempts') || '[]');
      localStorage.setItem('cosmicbone_test_attempts', JSON.stringify([attemptRecord, ...existing]));
    } catch (e) {
      console.error('Failed to log test attempt', e);
    }

    completeTest(activeTestModal.id);
  };

  const handleCloseRequest = () => {
    if (!activeTestModal.googleFormUrl || isExpired) {
      handleSaveAttempt(false);
      setActiveTestModal(null);
    } else {
      setShowExitWarning(true);
    }
  };

  const confirmExit = () => {
    handleSaveAttempt(false);
    setShowExitWarning(false);
    setActiveTestModal(null);
  };

  const formatTimeLeft = (sec: number) => {
    if (sec <= 0) return '00:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#06101F] text-white animate-in fade-in duration-200 overflow-hidden">
      {/* Responsive Header */}
      <header className="bg-[#09182D] border-b border-[rgba(0,240,255,0.2)] px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between shadow-xl relative z-10">
        {/* Left Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <span className="hidden sm:inline-block px-2.5 py-1 bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-extrabold uppercase rounded-full tracking-wider flex-shrink-0">
            {activeTestModal.subject}
          </span>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-extrabold text-white font-heading truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {activeTestModal.title}
            </h2>
            <p className="text-[10px] text-gray-400 truncate hidden md:block">
              Duration: {durationMins} Mins • {activeTestModal.questionsCount || 30} Questions
            </p>
          </div>
        </div>

        {/* Center Countdown Timer */}
        {activeTestModal.googleFormUrl && (
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-lg transition-all ${
              isExpired
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : timeLeft < 60
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : timeLeft < 300
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]'
            }`}
          >
            <Clock className={`w-4 h-4 ${timeLeft < 60 && !isExpired ? 'animate-spin' : ''}`} />
            <span>{isExpired ? '00:00 Time Up' : `${formatTimeLeft(timeLeft)} remaining`}</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {rawUrl && (
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              title="Open Google Form in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Open in New Tab</span>
            </a>
          )}

          <button
            onClick={handleCloseRequest}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 transition-colors"
            title="Exit Test"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-[#06101F] flex flex-col">
        {!activeTestModal.googleFormUrl ? (
          /* Missing Google Form Fallback */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Test Form Not Available Yet</h3>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              The test creator has not attached an embedded Google Form link to this test. Please contact your instructor.
            </p>
            <button
              onClick={() => setActiveTestModal(null)}
              className="px-5 py-2.5 bg-[#00F0FF] text-black font-extrabold text-xs rounded-xl hover:bg-cyan-400 transition-all"
            >
              Return to Test Series
            </button>
          </div>
        ) : isExpired ? (
          /* Time Up Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-bounce">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white font-heading">
                Time is up. Your test session has ended.
              </h2>
              <p className="text-xs text-gray-400 max-w-md mt-1.5 leading-relaxed">
                Your allocated time of <span className="text-[#00F0FF] font-semibold">{durationMins} minutes</span> has expired. The embedded test viewer has been locked.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#09182D] border border-white/10 text-xs text-gray-300 max-w-md text-left space-y-1.5">
              <p className="font-semibold text-amber-400">💡 Google Form Submission Notice:</p>
              <p className="text-[11px] text-gray-400 leading-normal">
                Websites cannot force-submit Google Forms automatically through an iframe. If you haven't clicked <strong>Submit</strong> on your form yet, use the button below to open Google Forms in a new tab.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {rawUrl && (
                <a
                  href={rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] text-black font-extrabold text-xs rounded-xl hover:brightness-110 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Google Form</span>
                </a>
              )}
              <button
                onClick={() => setActiveTestModal(null)}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Active Google Form Embedded Iframe */
          <div className="flex-1 w-full h-full bg-white relative overflow-hidden">
            <iframe
              src={embeddedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full h-full border-none"
              title={activeTestModal.title}
            >
              Loading examination paper…
            </iframe>
          </div>
        )}
      </main>

      {/* Warning Modal on Early Exit */}
      {showExitWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#09182D] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Exit Test Session?</h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Are you sure you want to exit the test? Your timer will stop and test session progress will end.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowExitWarning(false)}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors"
              >
                Resume Test
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
