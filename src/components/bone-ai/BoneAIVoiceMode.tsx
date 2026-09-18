import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Mic, MicOff } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface BoneAIVoiceModeProps {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
}

export const BoneAIVoiceMode: React.FC<BoneAIVoiceModeProps> = ({ isOpen, onClose, mode }) => {
  const [transcript, setTranscript] = useState('Say something...');
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('listening');
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const isMutedRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const statusRef = useRef<'idle' | 'listening' | 'thinking' | 'speaking'>('listening');
  const latestTranscriptRef = useRef('');
  const timeoutIdsRef = useRef<number[]>([]);

  isOpenRef.current = isOpen;

  const safeSetTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      if (isOpenRef.current && !isMutedRef.current) {
        fn();
      }
    }, delay);
    timeoutIdsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  };

  // Hard stop all audio & speech recognition immediately
  const hardStopAll = () => {
    clearAllTimeouts();

    // 1. Cancel speech synthesis immediately
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // 2. Abort & strip event handlers from SpeechRecognition to prevent resurrection
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const updateStatus = (newStatus: 'idle' | 'listening' | 'thinking' | 'speaking') => {
    statusRef.current = newStatus;
    setStatus(newStatus);
  };

  const startListening = () => {
    if (!isOpenRef.current || isMutedRef.current) return;

    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Voice input not supported in this browser');
      return;
    }

    try {
      hardStopAll();

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        if (!isOpenRef.current || isMutedRef.current) {
          try { rec.abort(); } catch (e) {}
          return;
        }
        updateStatus('listening');
        setTranscript('Listening...');
        latestTranscriptRef.current = '';
      };

      rec.onresult = (event: any) => {
        if (!isOpenRef.current || isMutedRef.current) return;
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript;
        }
        if (current.trim()) {
          latestTranscriptRef.current = current;
          setTranscript(current);
        }
      };

      rec.onerror = (e: any) => {
        if (!isOpenRef.current || isMutedRef.current) return;
        console.warn('[SpeechRec] Event:', e.error);
        if (e.error === 'not-allowed') {
          updateStatus('idle');
          setTranscript('Microphone permission denied');
        } else if (e.error === 'no-speech') {
          if (statusRef.current === 'listening' && !isMutedRef.current && isOpenRef.current) {
            safeSetTimeout(() => {
              if (statusRef.current === 'listening' && !isMutedRef.current && isOpenRef.current) {
                startListening();
              }
            }, 300);
          }
        }
      };

      rec.onend = () => {
        if (!isOpenRef.current || isMutedRef.current) return;
        const textToProcess = latestTranscriptRef.current.trim();
        if (statusRef.current === 'listening' && textToProcess && textToProcess !== 'Listening...' && textToProcess !== 'Say something...') {
          handleProcessSpeech(textToProcess);
        } else if (statusRef.current === 'listening' && !isMutedRef.current && isOpenRef.current) {
          safeSetTimeout(() => {
            if (statusRef.current === 'listening' && !isMutedRef.current && isOpenRef.current) {
              startListening();
            }
          }, 350);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('[SpeechRec] start error:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      hardStopAll();
      return;
    }

    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
    }

    isMutedRef.current = false;
    setIsMuted(false);
    updateStatus('listening');
    startListening();

    return () => {
      hardStopAll();
    };
  }, [isOpen]);

  const handleClose = () => {
    isOpenRef.current = false;
    isMutedRef.current = true;
    updateStatus('idle');
    hardStopAll();
    onClose();
  };

  const toggleMic = () => {
    if (isMuted) {
      // Unmute & start listening
      isMutedRef.current = false;
      setIsMuted(false);
      updateStatus('listening');
      setTranscript('Listening...');
      startListening();
    } else {
      // Mute immediately & halt all audio
      isMutedRef.current = true;
      setIsMuted(true);
      updateStatus('idle');
      setTranscript('Microphone muted');
      hardStopAll();
    }
  };

  const handleProcessSpeech = async (text: string) => {
    if (!isOpenRef.current || isMutedRef.current) return;

    updateStatus('thinking');
    setTranscript('Thinking...');
    latestTranscriptRef.current = '';

    try {
      const response = await aiService.sendVoiceMessage({
        message: text,
      });

      if (!isOpenRef.current || isMutedRef.current) return;

      const cleanSpeech = response.text || "Here is the verified information.";

      // Display response text cleanly on screen
      setTranscript(cleanSpeech);
      updateStatus('speaking');

      if (typeof window !== 'undefined' && window.speechSynthesis && !isMutedRef.current && isOpenRef.current) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanSpeech);
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));

        const naturalVoice =
          englishVoices.find((v) => v.name.includes('Natural') && (v.name.includes('US') || v.name.includes('UK') || v.name.includes('English') || v.name.includes('Aria') || v.name.includes('Guy') || v.name.includes('Jenny'))) ||
          englishVoices.find((v) => v.name.includes('Google UK English Female')) ||
          englishVoices.find((v) => v.name.includes('Google US English')) ||
          englishVoices.find((v) => v.name.includes('Natural')) ||
          englishVoices.find((v) => v.name.includes('Aria') || v.name.includes('Guy') || v.name.includes('Jenny')) ||
          englishVoices[0] ||
          null;

        if (naturalVoice) utterance.voice = naturalVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          if (!isMutedRef.current && isOpenRef.current) {
            updateStatus('listening');
            setTranscript('Listening...');
            safeSetTimeout(() => {
              if (!isMutedRef.current && isOpenRef.current) {
                startListening();
              }
            }, 300);
          } else {
            updateStatus('idle');
          }
        };

        utterance.onerror = () => {
          if (!isMutedRef.current && isOpenRef.current) {
            updateStatus('listening');
            setTranscript('Listening...');
            startListening();
          }
        };

        window.speechSynthesis.speak(utterance);
      } else {
        safeSetTimeout(() => {
          if (!isMutedRef.current && isOpenRef.current) {
            updateStatus('listening');
            setTranscript('Listening...');
            startListening();
          }
        }, 3500);
      }
    } catch (err) {
      console.warn('[VoiceMode] Processing error:', err);
      if (isOpenRef.current) {
        updateStatus('idle');
        setTranscript('Could not connect. Tap mic to retry.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="relative w-full rounded-[26px] p-3.5 sm:px-4 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.5)] border border-[#ff8800]/30 overflow-hidden flex items-center justify-between min-h-[130px] sm:min-h-[145px] select-none"
    >
      {/* Animated Moving Background Color Effect */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 18% 50%, #2e1608 0%, #180d06 50%, #0d0703 100%)',
            'radial-gradient(circle at 82% 50%, #351a09 0%, #1b0e06 50%, #0d0703 100%)',
            'radial-gradient(circle at 50% 25%, #2c1407 0%, #160c05 50%, #0d0703 100%)',
            'radial-gradient(circle at 50% 75%, #361b0a 0%, #190e06 50%, #0d0703 100%)',
            'radial-gradient(circle at 18% 50%, #2e1608 0%, #180d06 50%, #0d0703 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-[26px] pointer-events-none"
      />

      {/* Subtle moving warm ambient lighting */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-orange-500/20 to-amber-600/10 blur-xl pointer-events-none"
      />

      {/* 3 Icons Horizontal Layout */}
      <div className="relative z-10 w-full flex items-center justify-between gap-3">
        {/* Left: Close Button (X) */}
        <button
          type="button"
          onClick={handleClose}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#241a14]/90 hover:bg-[#33241b] border border-white/10 active:scale-95 text-[#d4c5bb] hover:text-white flex items-center justify-center transition-all flex-shrink-0 shadow-md"
          title="Close Voice Mode"
          aria-label="Close Voice Mode"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Center: Clean Expanded Transcript + Dynamic Audio Visualizer Soundwave */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2 min-w-0 py-1">
          {/* Expanded text box so AI answers fit without awkward truncation */}
          <div className="w-full max-h-[85px] sm:max-h-[96px] overflow-y-auto scrollbar-premium flex items-center justify-center mb-2 px-1">
            <motion.p
              key={transcript}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12.5px] sm:text-[13.5px] font-medium text-[#ffd499] drop-shadow-sm leading-relaxed text-center select-text"
            >
              {transcript}
            </motion.p>
          </div>

          {/* Dynamic Audio Equalizer Bars */}
          <div className="flex items-center justify-center space-x-1.5 h-6">
            {[0.4, 0.9, 0.6, 1.0, 0.7, 0.85, 0.5, 0.75, 0.35].map((baseHeight, idx) => (
              <motion.div
                key={idx}
                className="w-1 rounded-full bg-gradient-to-t from-[#ff4400] via-[#ff8800] to-[#ffcc00] shadow-[0_0_6px_rgba(255,140,0,0.6)]"
                animate={
                  status === 'listening' || status === 'speaking'
                    ? {
                        height: [
                          `${Math.max(6, baseHeight * 10)}px`,
                          `${Math.min(24, (baseHeight + 0.4) * 22)}px`,
                          `${Math.max(6, baseHeight * 9)}px`,
                        ],
                        opacity: [0.6, 1, 0.6],
                      }
                    : status === 'thinking'
                    ? {
                        height: ['7px', '16px', '7px'],
                        opacity: [0.4, 0.9, 0.4],
                      }
                    : {
                        height: '5px',
                        opacity: 0.25,
                      }
                }
                transition={{
                  duration: status === 'speaking' ? 0.45 + (idx % 3) * 0.15 : 0.7 + (idx % 3) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.06,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Solid Orange-Amber Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 active:scale-95 shadow-[0_0_18px_rgba(255,140,0,0.45)] hover:scale-105 ${
            isMuted
              ? 'bg-red-500/25 text-red-300 border border-red-500/50'
              : 'bg-gradient-to-b from-[#ffb300] via-[#ff8800] to-[#ff6600] text-[#120903]'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? (
            <MicOff className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#120903] stroke-[2.4]" />
          )}
        </button>
      </div>
    </motion.div>
  );
};


