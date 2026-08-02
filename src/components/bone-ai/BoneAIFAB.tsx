import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

// Web Audio API Synthesizer for Storm Effects (no audio file dependencies)
class StormAudioSynth {
  private ctx: AudioContext | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  constructor() {}

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const bufferSize = this.ctx.sampleRate * 2; // 2s loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playRain() {
    try {
      this.init();
      if (!this.ctx) return;
      this.stopRain();

      const noiseBuffer = this.createNoiseBuffer();
      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = noiseBuffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400; // soft rain sound

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.5); // fade in 0.5s

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      this.rainSource.start();
    } catch (e) {
      console.warn("Rain audio synthesis failed:", e);
    }
  }

  stopRain() {
    try {
      if (this.rainGain && this.ctx) {
        const curGain = this.rainGain.gain.value;
        this.rainGain.gain.setValueAtTime(curGain, this.ctx.currentTime);
        this.rainGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8); // fade out 0.8s
        const source = this.rainSource;
        setTimeout(() => {
          try {
            source?.stop();
          } catch(e){}
        }, 900);
      } else {
        this.rainSource?.stop();
      }
    } catch(e) {}
    this.rainSource = null;
    this.rainGain = null;
  }

  playThunder() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Low frequency rumble
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 2.0);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 120;

      osc.connect(rumbleFilter);
      rumbleFilter.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      // 2. High frequency sharp lightning crackle
      const noiseBuffer = this.createNoiseBuffer();
      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.setValueAtTime(0.45, now + 0.03); // peak crackle
      noiseGain.gain.exponentialRampToValueAtTime(0.02, now + 0.35); // crack decay
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8); // trail decay

      const crackFilter = this.ctx.createBiquadFilter();
      crackFilter.type = 'bandpass';
      crackFilter.frequency.value = 400;
      crackFilter.Q.value = 2.0;

      noiseNode.connect(crackFilter);
      crackFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      osc.start(now);
      noiseNode.start(now);
      osc.stop(now + 2.6);
      noiseNode.stop(now + 2.0);
    } catch (e) {
      console.warn("Thunder audio synthesis failed:", e);
    }
  }
}

const stormAudio = new StormAudioSynth();

const generateLightningPath = (startX: number, startY: number, targetHeight: number) => {
  let path = `M ${startX} ${startY}`;
  let currX = startX;
  let currY = startY;
  const segments = 6 + Math.floor(Math.random() * 4);
  const segmentHeight = targetHeight / segments;
  for (let i = 0; i < segments; i++) {
    currY += segmentHeight;
    const isLast = i === segments - 1;
    const deviation = isLast ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 22;
    currX += deviation;
    path += ` L ${currX} ${currY}`;
  }
  return path;
};


interface BoneAIFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export const BoneAIFAB: React.FC<BoneAIFABProps> = ({ onClick, isOpen }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  // Elemental States: 'idle' | 'white-cloud' | 'emergence' | 'dark-cloud' | 'lightning-cloud'
  const [elementalState, setElementalState] = useState<'idle' | 'white-cloud' | 'emergence' | 'dark-cloud' | 'lightning-cloud'>('idle');

  // Ref to block the idle/dark-cloud loop during drag-released lightning storm
  const isCustomStateRef = useRef(false);

  // Staggered rain drops state
  const [rainDrops, setRainDrops] = useState<{
    id: number;
    x: number;
    yStart: number;
    yEnd: number;
    delay: number;
    duration: number;
    width: number;
    height: number;
    opacity: number;
  }[]>([]);

  // Dynamic realistic lightning path state
  const [currentLightning, setCurrentLightning] = useState<{ path: string; branchPath?: string; key: number } | null>(null);

  // Generate random lightning strikes and trigger sound effects
  useEffect(() => {
    if (elementalState !== 'lightning-cloud') {
      setCurrentLightning(null);
      return;
    }

    // Play synthesized rain loop
    stormAudio.playRain();

    const triggerStrike = () => {
      const startX = 30 + (Math.random() - 0.5) * 12;
      const mainPath = generateLightningPath(startX, 0, 95 + Math.random() * 15);
      
      let branchPath = '';
      if (Math.random() > 0.45) {
        const branchStartX = startX + (Math.random() - 0.5) * 8;
        branchPath = generateLightningPath(branchStartX, 35, 50 + Math.random() * 15);
      }

      setCurrentLightning({
        path: mainPath,
        branchPath,
        key: Date.now()
      });

      // Play synthesized thunder sound effect!
      stormAudio.playThunder();

      // Clear lightning after animation (flicker duration is ~400ms)
      setTimeout(() => {
        setCurrentLightning(null);
      }, 430);
    };

    // First strike
    triggerStrike();

    // Loop strikes at random intervals
    const interval = setInterval(() => {
      triggerStrike();
    }, 1500 + Math.random() * 1800);

    return () => {
      clearInterval(interval);
      stormAudio.stopRain();
    };
  }, [elementalState]);

  // Multi-phase timeline loops for Antigravity & Cloud Transformation
  useEffect(() => {
    if (isOpen) {
      setElementalState('idle');
      return;
    }

    const interval = setInterval(async () => {
      // If we are currently showing the lightning/rain storm, skip the idle cloud cycle
      if (isCustomStateRef.current) return;

      // 1. Transition to White Cloud Dissolve
      setElementalState('white-cloud');
      await new Promise((r) => setTimeout(r, 2200));

      // Check again after delay
      if (isCustomStateRef.current) return;

      // 2. Emergence & Snap bounce
      setElementalState('emergence');
      await new Promise((r) => setTimeout(r, 1800));

      if (isCustomStateRef.current) return;

      // 3. Transition to Dark Storm Cloud (turns black)
      setElementalState('dark-cloud');
      await new Promise((r) => setTimeout(r, 2800));

      if (isCustomStateRef.current) return;

      // 4. Return to normal Antigravity Idle
      setElementalState('idle');
    }, 11000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const moveThreshold = 8;
    if (Math.abs(info.offset.x) < moveThreshold && Math.abs(info.offset.y) < moveThreshold) {
      setIsDragging(false);
      x.set(0);
      y.set(0);
      onClick();
      return;
    }
    setIsDragging(false);

    // Animate back to resting coordinates (0, 0)
    const animX = animate(x, 0, { type: 'spring', stiffness: 220, damping: 14 });
    const animY = animate(y, 0, { type: 'spring', stiffness: 220, damping: 14 });

    // Once snap-back finishes, trigger the lightning + rain storm
    Promise.all([animX, animY]).then(() => {
      isCustomStateRef.current = true;
      setElementalState('lightning-cloud');

      // Generate realistic storm-angled rain drops
      const newDrops = Array.from({ length: 40 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 105, // spread across cloud width
        yStart: 18,
        yEnd: 170 + Math.random() * 90, // fall distance
        delay: Math.random() * 2.0, // staggered start times
        duration: 0.32 + Math.random() * 0.28, // high-speed fall
        width: Math.random() * 1.3 + 0.8, // line thickness
        height: Math.random() * 20 + 12, // line length
        opacity: Math.random() * 0.65 + 0.3, // depth layers
      }));
      setRainDrops(newDrops);

      // Storm duration 6.8 seconds
      setTimeout(() => {
        isCustomStateRef.current = false;
        setElementalState('idle');
        setRainDrops([]);
      }, 6800);
    });
  };


  const getScaleStyle = () => {
    switch (elementalState) {
      case 'white-cloud':
        return 0.9;
      case 'emergence':
        return 1.12;
      case 'dark-cloud':
        return 0.95;
      default:
        return 1;
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        x,
        y,
        zIndex: 9999,
        cursor: 'grab',
        touchAction: 'none',
      }}
      aria-label="Ask Bone AI"
      title="Ask Bone AI"
    >
      <div className="relative group antigravity-float-effect">
        {/* Glow Ring */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
            isOpen
              ? 'shadow-[0_0_35px_10px_rgba(0,240,255,0.6)] animate-pulse'
              : elementalState === 'lightning-cloud'
              ? 'opacity-0' // Favor cloud's own drop-shadow
              : elementalState === 'dark-cloud'
              ? 'shadow-[0_0_25px_6px_rgba(139,92,246,0.45)]'
              : 'shadow-[0_0_20px_5px_rgba(255,0,255,0.35)]'
          }`}
        />

        {/* Dynamic Elemental Cloud Particles */}
        <AnimatePresence>
          {elementalState === 'white-cloud' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.85, scale: 1.35 }}
              exit={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-[-14px] rounded-full bg-radial from-white/60 via-white/20 to-transparent blur-md pointer-events-none mix-blend-screen"
            />
          )}

          {elementalState === 'dark-cloud' && (
            <>
              {/* Storm Cloud Wrapper */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.9, scale: 1.45 }}
                exit={{ opacity: 0, scale: 1.7 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-[-16px] rounded-full bg-radial from-[#12072B]/85 via-[#3B1652]/30 to-transparent blur-lg pointer-events-none mix-blend-color-dodge"
              />
              {/* Tiny Lightning Spikes Indicator */}
              <div className="absolute inset-0 rounded-full lightning-flash-effect pointer-events-none bg-cyan-400/10 mix-blend-screen" />
            </>
          )}
        </AnimatePresence>

        {/* Morphing Storm Cloud Image overlay (Using updated transparent cloud asset) */}
        <AnimatePresence>
          {elementalState === 'lightning-cloud' && (
            <motion.img
              initial={{ scale: 0, opacity: 0, rotate: -20, x: '-50%', y: '-50%' }}
              animate={{ scale: 2.2, opacity: 1, rotate: 0, x: '-50%', y: '-50%' }}
              exit={{ scale: 0, opacity: 0, rotate: 20, x: '-50%', y: '-50%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 15 }}
              src="/lightning-cloud.png"
              alt="Lightning Storm Cloud"
              className="absolute w-40 h-40 md:w-48 md:h-48 object-contain select-none pointer-events-none z-20"
              style={{
                left: '50%',
                top: '50%',
                filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.45)) contrast(1.1) brightness(1.05)'
              }}
            />
          )}
        </AnimatePresence>

        {/* Realistic White Lightning Strike Flash & Angled Rain Shower */}
        <AnimatePresence>
          {elementalState === 'lightning-cloud' && (
            <>
              {/* High-fidelity electric-white/blue lightning flash overlay */}
              <motion.div
                animate={{
                  opacity: [0, 0.95, 0.1, 0.95, 0.15, 1, 0.05, 0.75, 0],
                  scale: [1, 1.45, 1.25, 1.45, 1.35, 1.5, 1.25, 1.35, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.9,
                  ease: 'linear'
                }}
                className="absolute inset-[-55px] rounded-full bg-radial from-[rgba(235,248,255,0.4)] via-transparent to-transparent blur-xl pointer-events-none mix-blend-screen z-10"
              />

              {/* Dynamic Realistic Lightning Bolt */}
              {currentLightning && (
                <motion.svg
                  key={currentLightning.key}
                  width="80"
                  height="120"
                  viewBox="0 0 80 120"
                  className="absolute left-1/2 top-[48px] z-15 overflow-visible pointer-events-none"
                  style={{ x: '-50%' }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.95, 0.15, 1, 0.05, 0.85, 0],
                  }}
                  transition={{
                    duration: 0.42,
                    ease: 'linear',
                  }}
                >
                  {/* Outer neon cyber-cyan plasma glow */}
                  <path
                    d={currentLightning.path}
                    stroke="#00E5FF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 6px #00E5FF) drop-shadow(0 0 15px #00F0FF)' }}
                  />
                  {currentLightning.branchPath && (
                    <path
                      d={currentLightning.branchPath}
                      stroke="#8B5CF6"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 4px #8B5CF6)' }}
                    />
                  )}

                  {/* Inner pure-white hot plasma core */}
                  <path
                    d={currentLightning.path}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {currentLightning.branchPath && (
                    <path
                      d={currentLightning.branchPath}
                      stroke="#FFFFFF"
                      strokeWidth="1.0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </motion.svg>
              )}

              {/* Storm-Angled Rain Shower */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-visible">
                {rainDrops.map((drop) => (
                  <motion.div
                    key={drop.id}
                    initial={{ x: drop.x, y: drop.yStart, opacity: 0, scaleY: 0.4 }}
                    animate={{
                      y: drop.yEnd,
                      opacity: [0, drop.opacity, drop.opacity, 0],
                      scaleY: 1,
                    }}
                    transition={{
                      duration: drop.duration,
                      delay: drop.delay,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute left-1/2 rounded-full"
                    style={{
                      width: drop.width,
                      height: drop.height,
                      backgroundColor: 'rgba(0, 240, 255, 0.72)',
                      boxShadow: '0 0 4px rgba(0, 240, 255, 0.35)',
                      originY: 0,
                      marginLeft: -drop.width / 2,
                      rotate: -12,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Avatar Frame */}
        <motion.div
          onClick={(e) => {
            if (!isDragging) {
              e.stopPropagation();
              onClick();
            }
          }}
          animate={
            elementalState === 'lightning-cloud'
              ? { scale: 0, opacity: 0, rotate: -30 }
              : { scale: getScaleStyle(), opacity: 1, rotate: 0 }
          }
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 14,
            duration: 0.6
          }}
          className="relative w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden bg-[#0D213A] flex items-center justify-center cursor-pointer border-[2.5px] transition-colors duration-500"
          style={{
            borderColor: isOpen
              ? '#00F0FF'
              : elementalState === 'dark-cloud'
              ? '#8B5CF6'
              : '#FF00FF',
            boxShadow: isOpen
              ? '0 0 0 3px rgba(0,240,255,0.25)'
              : '0 0 0 3px rgba(255,0,255,0.18)',
          }}
        >
          <img
            src="/bone-ai-avatar.png"
            alt="Bone AI Avatar"
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://ui-avatars.com/api/?name=Bone+AI&background=0D213A&color=00F0FF&rounded=true&size=128';
            }}
          />

          {/* Status Indicator */}
          <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0D213A] shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </motion.div>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0D213A] border border-white/10 px-3.5 py-1.5 rounded-2xl text-xs text-[#00F0FF] shadow-2xl whitespace-nowrap">
            Ask Bone AI
          </div>
        )}
      </div>
    </motion.div>
  );
};
