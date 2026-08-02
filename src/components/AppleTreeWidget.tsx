import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CloudRain, Droplets, Trophy, Play, RotateCcw } from 'lucide-react';

const CYCLE_DURATION = 600; // 10 minutes = 600 seconds
const RAIN_INTERVAL = 120;   // Rain every 2 minutes = 120 seconds
const RAIN_DURATION = 15;    // Rain lasts 15 seconds

export const AppleTreeWidget: React.FC = () => {
  const { user, updateUserProfile, showNotification } = useApp();

  // Load remaining seconds from localStorage or default to 600
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('cosmicbone_appletree_seconds');
    return saved !== null ? Math.max(0, parseInt(saved, 10)) : CYCLE_DURATION;
  });

  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [harvestReady, setHarvestReady] = useState<boolean>(false);

  // Growth progress from 0% (seed) to 100% (mature tree)
  const elapsed = CYCLE_DURATION - secondsLeft;
  const progressPercent = Math.min(100, Math.max(0, Math.floor((elapsed / CYCLE_DURATION) * 100)));

  // Countdown timer & Rain scheduler effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      setHarvestReady(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = Math.max(0, prev - 1);
        localStorage.setItem('cosmicbone_appletree_seconds', next.toString());
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Rain trigger logic (every 2 minutes = 120s)
  useEffect(() => {
    const timeInCurrentInterval = elapsed % RAIN_INTERVAL;
    if (elapsed > 0 && timeInCurrentInterval < RAIN_DURATION) {
      setIsRaining(true);
    } else {
      setIsRaining(false);
    }
  }, [elapsed]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // Harvest apples handler
  const handleHarvest = () => {
    const currentApples = user?.apples || 0;
    updateUserProfile({ apples: currentApples + 10 });
    showNotification('🍎 Harvested 10 Fresh Apples! (+10 Added to Balance)');

    // Reset cycle
    setSecondsLeft(CYCLE_DURATION);
    setHarvestReady(false);
    localStorage.setItem('cosmicbone_appletree_seconds', CYCLE_DURATION.toString());
  };

  // Growth Stage Resolution
  let stageName = 'Glowing Seed';
  if (progressPercent >= 75) stageName = 'Mature Apple Tree (10 Apples Ready)';
  else if (progressPercent >= 50) stageName = 'Young Tree (Budding)';
  else if (progressPercent >= 25) stageName = 'Green Sapling';

  return (
    <div className="w-full bg-[#070B19]/95 border border-[rgba(0,240,255,0.25)] rounded-3xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.12)] relative overflow-hidden backdrop-blur-xl flex flex-col justify-between my-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between z-10 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center">
            <div className="w-full h-full bg-[#060913] rounded-[14px] flex items-center justify-center">
              <span className="text-base">🌳</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Cosmic Apple Orchard</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                10-Min Cycle
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Grows from Seed → Apple Tree • +10 Apples every 10 min</p>
          </div>
        </div>

        {/* Live Timer Badge */}
        <div className="flex items-center space-x-2 bg-[#0C1427] border border-white/10 px-3 py-1.5 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-black text-emerald-300">
            {secondsLeft > 0 ? formatTime(secondsLeft) : 'READY'}
          </span>
        </div>
      </div>

      {/* Main Interactive Tree Visual Frame */}
      <div className="relative w-full h-52 bg-gradient-to-b from-[#091124] to-[#040813] border border-white/10 rounded-2xl flex flex-col items-center justify-end overflow-hidden my-2 shadow-inner">
        {/* Rain Clouds & Raindrops Effect (Triggers every 2 min) */}
        {isRaining && (
          <div className="absolute top-2 left-0 right-0 z-20 flex flex-col items-center animate-fade-in">
            <div className="flex items-center space-x-3 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
              <CloudRain className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Nourishing Rain Shower (2-Min Rain Active) 🌧️</span>
            </div>

            {/* Falling Raindrops Animation */}
            <div className="w-full h-32 relative overflow-hidden pointer-events-none mt-1">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-4 bg-cyan-400/80 rounded-full animate-rain-drop"
                  style={{
                    left: `${(i * 6.25) + 3}%`,
                    animationDuration: `${0.6 + (i % 5) * 0.1}s`,
                    animationDelay: `${(i % 4) * 0.15}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Soil Ground */}
        <div className="w-full h-8 bg-gradient-to-r from-amber-950/80 via-[#26150b] to-amber-950/80 border-t border-amber-900/40 relative z-10 flex items-center justify-center">
          <div className="w-3/4 h-1 bg-amber-800/30 rounded-full blur-xs" />
        </div>

        {/* Dynamic Tree Graphics (Stage 1 to 4) */}
        <div className="absolute bottom-6 flex flex-col items-center justify-end transition-all duration-700 z-10">
          {/* Stage 1: Seed (0% - 24%) */}
          {progressPercent < 25 && (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-4 h-5 bg-gradient-to-b from-amber-400 to-amber-700 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <div className="w-1 h-3 bg-emerald-400 rounded-t-full -mt-1" />
              <span className="text-[10px] text-amber-300 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                🌱 Seed Planted
              </span>
            </div>
          )}

          {/* Stage 2: Sprout (25% - 49%) */}
          {progressPercent >= 25 && progressPercent < 50 && (
            <div className="flex flex-col items-center transition-all duration-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-emerald-400 rounded-tl-full rounded-br-full transform -rotate-45 shadow-[0_0_8px_#10B981]" />
                <div className="w-3 h-3 bg-emerald-400 rounded-tr-full rounded-bl-full transform rotate-45 shadow-[0_0_8px_#10B981]" />
              </div>
              <div className="w-1.5 h-10 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-t-full" />
              <span className="text-[10px] text-emerald-300 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                🌿 Green Sapling
              </span>
            </div>
          )}

          {/* Stage 3: Young Tree (50% - 74%) */}
          {progressPercent >= 50 && progressPercent < 75 && (
            <div className="flex flex-col items-center transition-all duration-500">
              <div className="relative w-24 h-20 bg-gradient-to-b from-emerald-400 via-emerald-600 to-teal-800 rounded-full border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center">
                <div className="w-16 h-12 bg-emerald-300/20 rounded-full blur-xs" />
              </div>
              <div className="w-3 h-14 bg-gradient-to-b from-amber-800 to-amber-950 rounded-t-lg -mt-3" />
              <span className="text-[10px] text-teal-300 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-teal-500/30">
                🌳 Growing Tree
              </span>
            </div>
          )}

          {/* Stage 4: Mature Apple Tree (75% - 100%) */}
          {progressPercent >= 75 && (
            <div className="flex flex-col items-center transition-all duration-500 relative">
              {/* Full Canopy */}
              <div className="relative w-36 h-28 bg-gradient-to-b from-emerald-400 via-emerald-600 to-teal-900 rounded-full border border-emerald-300/50 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center">
                {/* 10 Hanging Red Apples */}
                <div className="absolute inset-2 grid grid-cols-5 gap-2 items-center justify-items-center">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-gradient-to-tr from-rose-600 to-red-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] border border-rose-300 flex items-center justify-center animate-pulse"
                      title="Ripe Apple (+1 Apple)"
                    >
                      <span className="text-[8px] leading-none">🍎</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Trunk */}
              <div className="w-5 h-16 bg-gradient-to-b from-amber-800 via-amber-900 to-[#1c0e07] rounded-t-xl -mt-4 shadow-lg" />
              <span className="text-[10px] text-rose-300 font-extrabold mt-1 bg-black/70 px-2.5 py-0.5 rounded-full border border-rose-500/40 shadow-lg">
                🍎 10 Ripe Apples Ready!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Controls */}
      <div className="z-10 mt-2 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-300 font-bold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Growth Stage: <strong className="text-white">{stageName}</strong></span>
          </span>
          <span className="text-emerald-400 font-mono font-extrabold">{progressPercent}%</span>
        </div>

        {/* Growth Bar */}
        <div className="w-full h-2.5 bg-[#0C1427] border border-white/10 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Harvest Action Button */}
        {harvestReady || progressPercent >= 100 ? (
          <button
            onClick={handleHarvest}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-black text-xs rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center space-x-2 animate-bounce cursor-pointer uppercase tracking-wider"
          >
            <Trophy className="w-4 h-4" />
            <span>Harvest 10 Fresh Apples Now! 🍎 (+10 Apples)</span>
          </button>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 pt-1">
            <span>🌧️ Rain shower every 2 min</span>
            <span>⏳ Next harvest in {formatTime(secondsLeft)}</span>
          </div>
        )}
      </div>

      {/* Rain Drop Falling Animation CSS keyframes */}
      <style>{`
        @keyframes rainDrop {
          0% {
            transform: translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: translateY(110px);
            opacity: 0;
          }
        }
        .animate-rain-drop {
          animation: rainDrop linear infinite;
        }
      `}</style>
    </div>
  );
};
