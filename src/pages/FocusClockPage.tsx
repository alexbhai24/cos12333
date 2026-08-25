import React, { useCallback, useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, X, Check, ChevronDown, Plus, Sliders, BarChart2, Maximize2, Minimize2, Sun, Edit, MoreHorizontal, Trash2, SkipForward, RefreshCw, Music, Volume2, VolumeX } from "lucide-react";
import focusClockService, { FocusClockState, FocusTag } from "../services/focusClockService";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import _ReactPlayer from "react-player";
import ambientSoundService, { AmbientSoundUrls } from "../services/ambientSoundService";

const ReactPlayer = (_ReactPlayer as any).default || _ReactPlayer;

import { FlipPanel } from "../components/focus-clock/FlipPanel";

const PRESET_COLORS = ["#000000", "#EC4899", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

const getContrastColor = (hex: string) => {
  if (!hex) return "text-white";

  const color = hex.replace("#", "");
  if (color.length !== 6) return "text-white";
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "text-black" : "text-white";
};


const DrumScroll = ({ max, value, onChange }: { max: number; value: number; onChange: (v: number) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = value * 36;
    }
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollTop / 36);
    if (idx !== value) {
      onChange(Math.min(max, Math.max(0, idx)));
    }
  };

  return (
    <div 
      ref={scrollRef}
      className="h-[108px] overflow-y-auto snap-y snap-mandatory flex flex-col items-center"
      onScroll={handleScroll}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>
      <div className="h-[36px] flex-shrink-0" />
      {Array.from({ length: max + 1 }, (_, i) => (
        <div key={i} className="h-[36px] flex-shrink-0 snap-center flex items-center justify-center text-xl font-mono w-14">
          <span className={i === value ? "text-white font-bold" : "text-gray-500"}>{String(i).padStart(2, '0')}</span>
        </div>
      ))}
      <div className="h-[36px] flex-shrink-0" />
    </div>
  );
};

export const FocusClockPage: React.FC = () => {
  const { showNotification } = useApp();
  const { currentUser } = useAuth();
  const userKey = currentUser?.uid || currentUser?.email || 'guest';

  useEffect(() => {
    focusClockService.setUserKey(userKey);
    setClk(focusClockService.getState());
  }, [userKey]);

  const [clk, setClk] = useState<FocusClockState>(focusClockService.getState());
  const [hrs, setHrs] = useState("00");
  const [mins, setMins] = useState("30");
  const [secs, setSecs] = useState("00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync fullscreen state with document events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Idle detection for hiding UI when running
  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 3000); // 3 seconds of inactivity
    };

    // Only activate idle behavior if clock is running
    if (clk.status === "running") {
      resetIdle();
      window.addEventListener("mousemove", resetIdle);
      window.addEventListener("keydown", resetIdle);
      window.addEventListener("touchstart", resetIdle);
    } else {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [clk.status]);

  // Apply body class for global UI hiding (TopBar, BoneAI popup)
  useEffect(() => {
    if (isIdle && clk.status === "running") {
      document.body.classList.add("focus-idle");
    } else {
      document.body.classList.remove("focus-idle");
    }
    return () => document.body.classList.remove("focus-idle");
  }, [isIdle, clk.status]);

  const toggleFullscreen = () => {
    const el = document.getElementById("focus-clock-container");
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Dialog states
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);

  // Settings picker options
  const [showColor, setShowColor] = useState(false);
  const [showLoops, setShowLoops] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  // Temp settings states for picker overlay
  const [tmpMode, setTmpMode] = useState<"pomodoro"|"stopwatch">(clk.mode);
  const [tmpFocusHrs, setTmpFocusHrs] = useState(Math.floor(clk.focusMins / 60));
  const [tmpFocusMins, setTmpFocusMins] = useState(clk.focusMins % 60);
  const [tmpFocusSecs, setTmpFocusSecs] = useState(clk.focusSecs || 0);
  const [tmpBreak, setTmpBreak] = useState(clk.breakMins);
  const [tmpLoops, setTmpLoops] = useState(clk.loops);
  const [tmpAccent, setTmpAccent] = useState(clk.accentColor);
  const [tmpRemind, setTmpRemind] = useState(clk.reminderEnabled);
  const [tagNameInput, setTagNameInput] = useState("");
  const [statsPeriod, setStatsPeriod] = useState<"day"|"week"|"month"|"year">("day");
  const [statsDateOffset, setStatsDateOffset] = useState(0);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  // Ambient Sound State (YouTube music links)
  const [ambientUrls, setAmbientUrls] = useState<AmbientSoundUrls>(ambientSoundService.getUrls());
  const [selectedSound, setSelectedSound] = useState<string>("forest");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showMusicMenu, setShowMusicMenu] = useState<boolean>(false);

  // Subscribe to real-time ambient sound link changes (e.g. from Admin Console edits)
  useEffect(() => {
    const unsub = ambientSoundService.subscribe((updatedUrls) => {
      setAmbientUrls(updatedUrls);
    });
    return () => unsub();
  }, []);

  // Synchronize ambient playback strictly with focus timer state:
  // Sound plays ONLY when timer is actively RUNNING in FOCUS phase.
  // Sound STOPS immediately when paused, in break phase, idle, or completed!
  useEffect(() => {
    if (clk.status === "running" && clk.phase === "focus") {
      setIsAmbientPlaying(true);
    } else {
      setIsAmbientPlaying(false);
    }
  }, [clk.status, clk.phase]);

  const handleToggleAmbientSound = (soundId: string) => {
    if (selectedSound === soundId) {
      setIsAmbientPlaying(!isAmbientPlaying);
    } else {
      setSelectedSound(soundId);
      setIsAmbientPlaying(true);
    }
  };

  const currentAmbientUrl = selectedSound && ambientUrls[selectedSound as keyof AmbientSoundUrls]
    ? ambientUrls[selectedSound as keyof AmbientSoundUrls]
    : '';




  // Derived state for stats
  const targetDate = new Date();
  let startPeriodTime = 0;
  let endPeriodTime = 0;
  let dateRangeLabel = "";

  if (statsPeriod === "day") {
    targetDate.setDate(targetDate.getDate() + statsDateOffset);
    startPeriodTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
    endPeriodTime = startPeriodTime + 24 * 60 * 60 * 1000;
    dateRangeLabel = targetDate.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } else if (statsPeriod === "week") {
    targetDate.setDate(targetDate.getDate() + statsDateOffset * 7);
    const day = targetDate.getDay();
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1); // Monday is first day of week
    const startOfWeek = new Date(targetDate.setDate(diff));
    startPeriodTime = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()).getTime();
    endPeriodTime = startPeriodTime + 7 * 24 * 60 * 60 * 1000;
    const endDate = new Date(endPeriodTime - 1);
    dateRangeLabel = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('en-US',{month:'long'})} ${startOfWeek.getFullYear()} ~ ${endDate.getDate()} ${endDate.toLocaleString('en-US',{month:'long'})} ${endDate.getFullYear()}`;
  } else if (statsPeriod === "month") {
    targetDate.setMonth(targetDate.getMonth() + statsDateOffset);
    startPeriodTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).getTime();
    endPeriodTime = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1).getTime();
    const endDate = new Date(endPeriodTime - 1);
    dateRangeLabel = `1 ${targetDate.toLocaleString('en-US',{month:'long'})} ${targetDate.getFullYear()} ~ ${endDate.getDate()} ${endDate.toLocaleString('en-US',{month:'long'})}`;
  } else if (statsPeriod === "year") {
    targetDate.setFullYear(targetDate.getFullYear() + statsDateOffset);
    startPeriodTime = new Date(targetDate.getFullYear(), 0, 1).getTime();
    endPeriodTime = new Date(targetDate.getFullYear() + 1, 0, 1).getTime();
    dateRangeLabel = `1 January ${targetDate.getFullYear()} ~ 31 December ${targetDate.getFullYear()}`;
  }

  const periodHistory = clk.history.filter((s) => {
    const t = new Date(s.completedAt).getTime();
    return t >= startPeriodTime && t < endPeriodTime;
  });

  const periodFocusHistory = periodHistory.filter(s => !s.isBreak);
  const periodBreakHistory = periodHistory.filter(s => s.isBreak);

  let totalFocusSeconds = periodFocusHistory.reduce((acc, s) => acc + s.elapsedSeconds, 0);
  let totalBreakSeconds = periodBreakHistory.reduce((acc, s) => acc + s.elapsedSeconds, 0);

  // Real-time active session logic
  let activeFocusSeconds = 0;
  let activeBreakSeconds = 0;
  
  if (clk.status === "running" && !clk.awaitingPhaseStart) {
    if (clk.mode === "pomodoro") {
      const remainingMs = focusClockService.getRemainingMs();
      const totalMs = (clk.phase === "focus" ? ((clk.focusMins * 60) + (clk.focusSecs || 0)) : (clk.breakMins * 60)) * 1000;
      const elapsed = Math.floor((totalMs - remainingMs) / 1000);
      if (clk.phase === "focus") {
        activeFocusSeconds = Math.max(0, elapsed);
      } else {
        activeBreakSeconds = Math.max(0, elapsed);
      }
    } else if (clk.mode === "stopwatch") {
      let elapsedMs = clk.stopwatchElapsedMs;
      if (clk.stopwatchStartEpoch) {
        elapsedMs += (Date.now() - clk.stopwatchStartEpoch);
      }
      activeFocusSeconds = Math.floor(elapsedMs / 1000);
    }
  }

  // Also count paused break time (user paused during break)
  if (clk.status === "paused" && clk.phase === "break" && !clk.awaitingPhaseStart) {
    const totalBreakMs = clk.breakMins * 60 * 1000;
    const pausedRemaining = clk.pausedRemainingMs ?? totalBreakMs;
    const elapsed = Math.floor((totalBreakMs - pausedRemaining) / 1000);
    activeBreakSeconds = Math.max(0, elapsed);
  }

  const nowTime = Date.now();
  const includesToday = nowTime >= startPeriodTime && nowTime < endPeriodTime;
  
  if (includesToday) {
    totalFocusSeconds += activeFocusSeconds;
    totalBreakSeconds += activeBreakSeconds;
  }

  const focusByTag = periodFocusHistory.reduce((acc, s) => {
    const tagExists = s.tagId ? clk.tags.some(t => t.id === s.tagId) : false;
    if (tagExists) {
      const tagId = s.tagId!;
      if (!acc[tagId]) acc[tagId] = { seconds: 0, tag: clk.tags.find(t => t.id === tagId) };
      acc[tagId].seconds += s.elapsedSeconds;
    }
    return acc;
  }, {} as Record<string, { seconds: number; tag: any }>);

  // Add real-time tagged seconds
  if (includesToday && activeFocusSeconds > 0 && clk.selectedTagId && clk.phase === "focus") {
    const activeTag = clk.tags.find(t => t.id === clk.selectedTagId);
    if (activeTag) {
      if (!focusByTag[clk.selectedTagId]) focusByTag[clk.selectedTagId] = { seconds: 0, tag: activeTag };
      focusByTag[clk.selectedTagId].seconds += activeFocusSeconds;
    }
  }


  const formatDurationHM = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return (
      <div className="flex items-baseline">
        <span className="text-white text-[28px] font-black tracking-tight">{h}</span>
        <span className="text-gray-400 text-[10px] font-bold ml-[2px] mr-2 mb-1">H</span>
        <span className="text-white text-[28px] font-black tracking-tight">{String(m).padStart(2,'0')}</span>
        <span className="text-gray-400 text-[10px] font-bold ml-[2px] mb-1">M</span>
      </div>
    );
  };

  useEffect(() => {
    const playChime = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.value = freq;
          const startTime = ctx.currentTime + i * 0.18;
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.25, startTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
          osc.start(startTime);
          osc.stop(startTime + 0.55);
        });
      } catch (e) { /* silent fail */ }
    };

    const tick = () => {
      const st = focusClockService.getState();
      if (st.mode === "pomodoro" && st.status === "running") {
        const remainingMs = focusClockService.getRemainingMs();
        if (remainingMs <= 0) {
          const prevPhase = st.phase;
          const prevLoop = st.currentLoop;

          focusClockService.completePhase();
          const nextSt = focusClockService.getState();

          // ONLY trigger chime and notifications if Reminder is ON (reminderEnabled === true)
          if (st.reminderEnabled) {
            playChime();
            let msg = "";
            if (nextSt.status === "complete") {
              msg = "🏆 All Focus Loops Completed! Outstanding work!";
            } else if (prevPhase === "focus") {
              msg = `⏰ Focus Session #${prevLoop} Completed! Take a break.`;
            } else if (prevPhase === "break") {
              msg = `⚡ Break Time Finished! Ready for Focus Session #${nextSt.currentLoop}?`;
            }
            if (msg) {
              showNotification(msg);
              if ('Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification("CosmicBone Focus Clock", { body: msg });
                } catch (e) {}
              }
            }
          }
        }
      }

      const [h, m, s] = focusClockService.getDisplayTime();
      setHrs(h);
      setMins(m);
      setSecs(s);
      setClk({ ...focusClockService.getState() });
    };
    tick();
    const iv = setInterval(tick, 250);
    const unsub = focusClockService.subscribe(tick);
    return () => {
      clearInterval(iv);
      unsub();
    };
  }, [showNotification]);

  const selectedTag = clk.tags.find((t) => t.id === clk.selectedTagId);
  const accent = clk.accentColor;

  const handleOpenSettings = () => {
    const st = focusClockService.getState();
    setTmpMode(st.mode);
    setTmpFocusHrs(Math.floor(st.focusMins / 60));
    setTmpFocusMins(st.focusMins % 60);
    setTmpFocusSecs(st.focusSecs || 0);
    setTmpBreak(st.breakMins);
    setTmpLoops(st.loops);
    setTmpAccent(st.accentColor);
    setTmpRemind(st.reminderEnabled);
    setTagNameInput(selectedTag ? selectedTag.name : "");
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    let focusMins = tmpFocusHrs * 60 + tmpFocusMins;
    let focusSecs = tmpFocusSecs;
    if (focusMins === 0 && focusSecs === 0) {
      focusMins = 1; // Timer should never be zero
    }

    if (editingTagId) {
      // Update specific tag settings
      focusClockService.updateTag(editingTagId, {
        name: tagNameInput,
        color: tmpAccent,
        focusMins,
        focusSecs,
        breakMins: tmpBreak,
        loops: tmpLoops,
        mode: tmpMode,
      });
      // Automatically load the updated tag settings into focus clock
      focusClockService.selectTag(editingTagId);
      setEditingTagId(null);
    } else {
      // Standard active clock save settings
      focusClockService.updateSettings({
        mode: tmpMode,
        focusMins,
        focusSecs,
        breakMins: tmpBreak,
        loops: tmpLoops,
        accentColor: tmpAccent,
        reminderEnabled: tmpRemind,
      });

      if (tagNameInput.trim()) {
        const existing = clk.tags.find((t) => t.name.toLowerCase() === tagNameInput.toLowerCase());
        if (existing) {
          focusClockService.updateTag(existing.id, {
            name: tagNameInput,
            color: tmpAccent,
            focusMins,
            focusSecs,
            breakMins: tmpBreak,
            loops: tmpLoops,
            mode: tmpMode,
          });
          focusClockService.selectTag(existing.id);
        } else {
          const newTag = focusClockService.addTag({
            name: tagNameInput,
            emoji: "⏱️",
            color: tmpAccent,
            focusMins,
            focusSecs,
            breakMins: tmpBreak,
            loops: tmpLoops,
            mode: tmpMode,
          });
          focusClockService.selectTag(newTag.id);
        }
      }
    }
    setShowSettings(false);
  };




  return (
    <div 
      id="focus-clock-container" 
      data-fullscreen={isFullscreen}
      className="flex flex-col items-center justify-between min-h-screen lg:min-h-[calc(100vh-140px)] w-full p-6 bg-transparent text-white relative overflow-hidden data-[fullscreen=true]:bg-black data-[fullscreen=true]:z-50"
    >
      
      {/* Top Right Controls (Fullscreen and Focus/Loop indicator) */}
      <div className={`absolute top-4 right-4 flex items-center gap-4 z-20 transition-opacity duration-700 ${isIdle && clk.status === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {clk.mode === "pomodoro" && (
          <div className="flex flex-col items-end justify-center space-y-0.5">
            <div className="text-[10px] tracking-[0.2em] font-black uppercase text-right" style={{ color: accent }}>
              {clk.phase}
            </div>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider text-right">
              Loop {clk.currentLoop}/{clk.loops === -1 ? "∞" : clk.loops}
            </div>
          </div>
        )}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-2xl bg-[#121316]/80 border border-white/5 hover:border-white/10 hover:text-white text-gray-400 transition-all active:scale-95"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>


      {/* Phase transition banner (shown only when phase auto-completes, not on manual pause) */}
      {clk.mode === "pomodoro" && clk.awaitingPhaseStart && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
          <div className="flex flex-col items-center gap-6 p-8 bg-[#121316] rounded-[32px] border border-white/10 shadow-2xl max-w-xs w-full mx-4">
            <div className="text-5xl">{clk.phase === "break" ? "☕" : "🎯"}</div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-black text-xl tracking-tight">
                {clk.phase === "break" ? "Focus Complete!" : `Loop ${clk.currentLoop - 1} Done!`}
              </span>
              <span className="text-gray-400 text-sm font-semibold text-center">
                {clk.phase === "break"
                  ? `Time for a ${clk.breakMins} min break. Press ▶ when ready.`
                  : `Loop ${clk.currentLoop} of ${clk.loops === -1 ? '∞' : clk.loops}. Press ▶ to start focus.`
                }
              </span>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => focusClockService.reset()}
                className="flex-1 py-3 rounded-2xl bg-[#1E2025] text-gray-400 font-bold text-sm transition-all hover:bg-gray-800"
              >
                Reset
              </button>
              <button
                onClick={() => focusClockService.start()}
                className={`flex-1 py-3 rounded-2xl font-extrabold text-sm transition-all hover:opacity-90 ${getContrastColor(accent)}`}
                style={{ background: accent }}
              >
                {clk.phase === "break" ? "Start Break" : "Start Focus"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* All Done screen */}
      {clk.status === "complete" && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 p-8 bg-[#121316] rounded-[32px] border border-white/10 shadow-2xl max-w-xs w-full mx-4">
            <div className="text-6xl">🏆</div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-black text-2xl tracking-tight">All Done!</span>
              <span className="text-gray-400 text-sm font-semibold text-center">
                You completed {clk.loops === -1 ? "an infinite" : clk.loops} loop{(clk.loops !== 1 && clk.loops !== -1) ? "s" : ""} of focused work. Great job! 🎉
              </span>
            </div>
            <button
              onClick={() => focusClockService.reset()}
              className={`w-full py-3 rounded-2xl font-extrabold text-sm transition-all hover:opacity-90 ${getContrastColor(accent)}`}
              style={{ background: accent }}
            >
              Start Again
            </button>

          </div>
        </div>
      )}

      {/* Loop count placeholder removed (grouped at top) */}

      {/* Giant Clock Face */}
      <div className="flex-1 flex flex-col items-center justify-center w-full gap-5">
        {/* Enlarged Tag Display Pill */}
        <button
          onClick={() => setShowTagPicker(true)}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#121316] border border-white/5 hover:border-white/10 transition-all duration-700 text-sm font-bold shadow-lg ${isIdle && clk.status === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <span 
            className="w-3 h-3 rounded-full animate-pulse" 
            style={{ 
              background: accent, 
              boxShadow: `0 0 10px ${accent}` 
            }} 
          />
          <span className="text-gray-200">
            {selectedTag ? `${selectedTag.name}${selectedTag.emoji && selectedTag.emoji !== "⏱️" ? ` ${selectedTag.emoji}` : ""}` : "Chemistry ⚗️"}
          </span>
          <span className="text-gray-400 text-[10px] ml-1">›</span>
        </button>


        <FlipPanel hours={hrs} minutes={mins} seconds={secs} accentColor={accent} brightness={clk.clockBrightness ?? 100} />
      </div>





      {/* Bottom controls row */}
      <div className={`flex-shrink-0 flex items-center gap-4 pb-6 relative z-30 transition-opacity duration-700 ${isIdle && clk.status === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <style>{`
          .custom-thumb-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${accent};
            cursor: pointer;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
          }
          .custom-thumb-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${accent};
            cursor: pointer;
            border: none;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
          }
        `}</style>

        {/* Volume controller (Sound controller left side of music/reset icon) */}
        <div className="flex items-center gap-1.5 mr-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted || ambientVolume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : ambientVolume}
            onChange={(e) => {
              setAmbientVolume(Number(e.target.value));
              setIsMuted(false);
            }}
            className="custom-thumb-slider w-20 md:w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, ${accent} ${isMuted ? 0 : ambientVolume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : ambientVolume}%)`,
            }}
          />
        </div>

        {/* Left button: Ambient Music Popover OR Reset Button (swapped when running) */}
        {clk.status !== "idle" ? (
          <button
            onClick={() => focusClockService.reset()}
            className="w-12 h-12 rounded-2xl bg-[#121316] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
            title="Reset"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMusicMenu(!showMusicMenu)}
              className={`w-12 h-12 rounded-2xl bg-[#121316] border border-white/5 flex items-center justify-center transition-all active:scale-95 ${
                showMusicMenu ? 'text-[#FFB800] border-[#FFB800]/30 shadow-md' : 'text-gray-400 hover:text-white'
              }`}
              title="Ambient Soundscapes"
            >
              <Music className="w-5 h-5" />
            </button>

            {showMusicMenu && (
              <div className="absolute bottom-16 left-0 bg-[#121316] border border-white/5 rounded-3xl shadow-2xl p-4 flex flex-col gap-1 w-52 z-50 pointer-events-auto">
                <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider mb-1">Ambient Sound</span>
                {[
                  { id: "forest", name: "Forest", emoji: "🌲" },
                  { id: "space", name: "Space", emoji: "🚀" },
                  { id: "ocean", name: "Ocean", emoji: "🌊" },
                  { id: "desert", name: "Desert", emoji: "🏜️" }
                ].map((opt) => {
                  const isSelected = selectedSound === opt.id;
                  const isPlaying = isSelected && isAmbientPlaying;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleToggleAmbientSound(opt.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between ${
                        isPlaying 
                          ? 'bg-[#FFB800] text-black shadow-md' 
                          : isSelected
                          ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {opt.name}
                        {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                      </span>
                      <span className="text-[12px]">{opt.emoji}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Center: Play/Pause button */}
        <button
          onClick={() => (clk.status === "running" ? focusClockService.pause() : focusClockService.start())}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xl ${getContrastColor(accent)}`}
          style={{ background: accent }}
        >
          {clk.status === "running" ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>

        {/* Right button: Skip (pomodoro running), Save (stopwatch active), or Stats */}
        {clk.status === "running" && clk.mode === "pomodoro" ? (
          <button
            onClick={() => focusClockService.completePhase()}
            className="w-12 h-12 rounded-2xl bg-[#121316] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
            title={`Skip ${clk.phase}`}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        ) : clk.mode === "stopwatch" && clk.status !== "idle" ? (
          <button
            onClick={() => focusClockService.completeStopwatch()}
            className="w-12 h-12 rounded-2xl bg-[#121316] border border-white/5 flex items-center justify-center text-[#22C55E] hover:text-[#22C55E]/80 transition-all active:scale-95"
            title="Complete & Save Stopwatch Session"
          >
            <Check className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setShowStats(true)}
            className="w-12 h-12 rounded-2xl bg-[#121316] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
            title="Statistics"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        )}


        {/* Brightness controller (brightness on right side of statistic icon) */}
        <div className="flex items-center gap-2 ml-1">
          <Sun className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={clk.clockBrightness ?? 100}
            onChange={(e) => focusClockService.updateSettings({ clockBrightness: Number(e.target.value) })}
            className="custom-thumb-slider w-20 md:w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, ${accent} ${clk.clockBrightness ?? 100}%, rgba(255,255,255,0.1) ${clk.clockBrightness ?? 100}%)`,
            }}
          />
        </div>
      </div>



      {/* ────────────────────────────────────────────────────────
          SETTINGS POP OVER DIALOG (100% Mockup Match)
          ──────────────────────────────────────────────────────── */}
      {showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-transparent p-4 pointer-events-none">
          <div className="bg-[#121316] border border-white/5 rounded-[32px] w-full max-w-sm p-6 space-y-5 shadow-2xl pointer-events-auto">
            {/* Mode selection capsule */}
            <div className="flex justify-center bg-[#1E2025] p-1 rounded-2xl">
              {(["pomodoro", "stopwatch"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTmpMode(m)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    tmpMode === m ? "bg-[#2D3039] text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* Drum Pickers */}
            {tmpMode === "pomodoro" && (
              <div className="relative flex justify-center items-center h-[108px] mx-auto w-full max-w-[200px]">
                {/* Highlight bar in center */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[36px] bg-white/5 rounded-xl pointer-events-none" />
                
                <div className="flex items-center justify-between w-full z-10 px-2">
                  <DrumScroll max={23} value={tmpFocusHrs} onChange={setTmpFocusHrs} />
                  <span className="text-gray-600 font-bold mb-1">:</span>
                  <DrumScroll max={59} value={tmpFocusMins} onChange={setTmpFocusMins} />
                  <span className="text-gray-600 font-bold mb-1">:</span>
                  <DrumScroll max={59} value={tmpFocusSecs} onChange={setTmpFocusSecs} />
                </div>
              </div>
            )}

            {/* List options */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setShowColor(true)}
                className="w-full flex items-center justify-between p-3.5 bg-[#17181D]/60 hover:bg-[#17181D] rounded-2xl transition-all"
              >
                <span className="text-xs text-gray-400 font-semibold">Color</span>
                <div className="w-5 h-5 rounded-full border border-white/10" style={{ background: tmpAccent }} />
              </button>

              <div className="w-full flex items-center justify-between p-3.5 bg-[#17181D]/60 rounded-2xl">
                <span className="text-xs text-gray-400 font-semibold">Tag</span>
                <input
                  type="text"
                  value={tagNameInput}
                  onChange={(e) => setTagNameInput(e.target.value)}
                  placeholder="Input tag name"
                  className="bg-transparent text-right outline-none text-xs text-white placeholder-gray-600 max-w-[120px]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextVal = !tmpRemind;
                  setTmpRemind(nextVal);
                  if (nextVal && 'Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission();
                  }
                }}
                className="w-full flex items-center justify-between p-3.5 bg-[#17181D]/60 hover:bg-[#17181D] rounded-2xl transition-all"
              >
                <span className="text-xs text-gray-400 font-semibold">Reminder</span>
                <span className={`text-xs font-extrabold ${tmpRemind ? "text-[var(--color-cyan)]" : "text-gray-500"}`}>
                  {tmpRemind ? "On 🔔" : "Off"}
                </span>
              </button>

              {tmpMode === "pomodoro" && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowLoops(true)}
                    className="w-full flex items-center justify-between p-3.5 bg-[#17181D]/60 hover:bg-[#17181D] rounded-2xl transition-all"
                  >
                    <span className="text-xs text-gray-400 font-semibold">Loops</span>
                    <span className="text-xs font-bold text-gray-500">{tmpLoops === -1 ? "Infinite" : `${tmpLoops} times`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBreak(true)}
                    className="w-full flex items-center justify-between p-3.5 bg-[#17181D]/60 hover:bg-[#17181D] rounded-2xl transition-all"
                  >
                    <span className="text-xs text-gray-400 font-semibold">Break duration</span>
                    <span className="text-xs font-bold text-gray-500">{tmpBreak === 0 ? "No break" : `${tmpBreak} min`}</span>
                  </button>

                </>
              )}
            </div>

            {/* Cancel & Save buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowSettings(false); setEditingTagId(null); }}
                className="flex-1 py-3 rounded-2xl bg-[#1E2025] hover:bg-gray-800 text-gray-400 font-bold text-xs transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveSettings}
                className="flex-1 py-3 rounded-2xl text-black font-extrabold text-xs transition-all hover:opacity-90"
                style={{ background: "#FFB800" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nested custom picker modal */}
      {showColor && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-transparent p-4 pointer-events-none">
          <div className="bg-[#121316] border border-white/5 rounded-3xl w-full max-w-xs p-5 space-y-4 shadow-2xl pointer-events-auto">
            <span className="text-xs font-bold text-gray-400">Select accent color</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setTmpAccent(c)}
                  className="w-8 h-8 rounded-lg"
                  style={{ background: c, border: tmpAccent === c ? "2px solid white" : "none" }}
                />
              ))}
            </div>
            <button
              onClick={() => setShowColor(false)}
              className="w-full py-2.5 rounded-xl text-black font-bold text-xs"
              style={{ background: "#FFB800" }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Loops picker */}
      {showLoops && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-transparent p-4 pointer-events-none">
          <div className="bg-[#121316] border border-white/5 rounded-3xl w-full max-w-xs p-5 space-y-4 text-center shadow-2xl pointer-events-auto">
            <span className="text-xs font-bold text-gray-400">Loops count</span>
            <div className="flex flex-col gap-1 py-2 max-h-40 overflow-y-auto">
              {[{ label: "Infinite", value: -1 }, { label: "1 time", value: 1 }, { label: "2 times", value: 2 }, { label: "3 times", value: 3 }].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setTmpLoops(opt.value); setShowLoops(false); }}
                  className={`py-2 text-xs font-bold ${tmpLoops === opt.value ? "text-white" : "text-gray-600"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Break picker */}
      {showBreak && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-transparent p-4 pointer-events-none">
          <div className="bg-[#121316] border border-white/5 rounded-3xl w-full max-w-xs p-5 space-y-4 text-center shadow-2xl pointer-events-auto">
            <span className="text-xs font-bold text-gray-400">Break duration</span>
            <div className="flex flex-col gap-1 py-2 max-h-40 overflow-y-auto">
              {[0, 3, 5, 10, 15, 20, 30, 45, 60].map((minsOpt) => (
                <button
                  key={minsOpt}
                  onClick={() => { setTmpBreak(minsOpt); setShowBreak(false); }}
                  className={`py-2 text-xs font-bold ${tmpBreak === minsOpt ? "text-white" : "text-gray-600"}`}
                >
                  {minsOpt === 0 ? "No break" : `${minsOpt} min`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Tag Selector */}
      {showTagPicker && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-transparent p-4 pointer-events-none">
          <div className="bg-[#121316] border border-white/5 rounded-[32px] w-full max-w-sm p-6 pb-8 shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white">Select Tag</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsEditingTags(!isEditingTags)} 
                  className={`${isEditingTags ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowTagPicker(false)} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {clk.tags.map((t) => {
                const getTagConfiguredDuration = (tag: FocusTag) => {
                  const mins = tag.focusMins !== undefined ? tag.focusMins : 30;
                  const secs = tag.focusSecs !== undefined ? tag.focusSecs : 0;
                  const hrs = Math.floor(mins / 60);
                  const mVal = mins % 60;
                  
                  if (hrs > 0) {
                    return `${hrs}:${String(mVal).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                  }
                  return `${mVal}:${String(secs).padStart(2, '0')}`;
                };

                const isSelected = clk.selectedTagId === t.id;
                const displayEmoji = t.emoji && t.emoji !== "⏱️" ? ` ${t.emoji}` : "";
                return (
                  <div key={t.id} className="relative group">
                    <button
                      onClick={() => { 
                        if (!isEditingTags) {
                          focusClockService.selectTag(t.id); 
                          setShowTagPicker(false); 
                        }
                      }}
                      className={`w-full p-4 rounded-[20px] flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 text-center min-h-[90px] relative ${isEditingTags ? 'opacity-90' : ''} ${getContrastColor(t.color)}`}
                      style={{ background: t.color }}
                    >
                      <span className="text-lg font-black tracking-tight">{t.name}{displayEmoji}</span>
                      <span className="text-[13px] font-bold opacity-80">{getTagConfiguredDuration(t)}</span>


                      {!isEditingTags && isSelected && (
                        <Check className="absolute top-1/2 -translate-y-1/2 right-3 w-6 h-6 opacity-80" strokeWidth={3} />
                      )}
                    </button>

                    {isEditingTags && (
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/70 rounded-[20px] transition-all z-10 p-2">
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTagId(t.id);
                            setTmpMode(t.mode || "pomodoro");
                            setTmpFocusHrs(Math.floor((t.focusMins || 30) / 60));
                            setTmpFocusMins((t.focusMins || 30) % 60);
                            setTmpFocusSecs(t.focusSecs || 0);
                            setTmpBreak(t.breakMins !== undefined ? t.breakMins : 5);
                            setTmpLoops(t.loops !== undefined ? t.loops : 2);
                            setTmpAccent(t.color);
                            setTagNameInput(t.name);
                            setTmpRemind(clk.reminderEnabled);
                            
                            setShowSettings(true);
                            setShowTagPicker(false); // Switch to settings
                          }}
                          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
                          title="Edit Tag Timer Settings"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            focusClockService.deleteTag(t.id);
                            setClk({ ...focusClockService.getState() });
                          }}
                          className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 border border-red-500/30 transition-all active:scale-90"
                          title="Delete Tag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


            <div className="flex justify-center mt-6 pt-2">
              <button 
                onClick={() => { 
                  setShowTagPicker(false); 
                  setIsEditingTags(false); 
                  
                  const st = focusClockService.getState();
                  setTmpMode(st.mode);
                  setTmpFocusHrs(Math.floor(st.focusMins / 60));
                  setTmpFocusMins(st.focusMins % 60);
                  setTmpFocusSecs(st.focusSecs || 0);
                  setTmpBreak(st.breakMins);
                  setTmpLoops(st.loops);
                  setTmpRemind(st.reminderEnabled);
                  setTmpAccent("#EC4899"); // default color
                  setTagNameInput(""); // empty tag for new tag

                  setShowSettings(true); 
                }}
                className="w-[60px] h-[60px] bg-[#FFB800] rounded-3xl flex items-center justify-center hover:bg-[#E5A600] transition-colors active:scale-95 shadow-lg"
              >
                <Plus className="w-8 h-8 text-black" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          STATISTICS MODAL — Premium Apple-Style Design
          ──────────────────────────────────────────────────────── */}
      {showStats && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#0D0E12]/95 backdrop-blur-2xl border border-white/[0.06] rounded-[28px] w-full max-w-2xl p-5 space-y-3.5 max-h-[90vh] overflow-y-auto scrollbar-thin shadow-[0_32px_80px_rgba(0,0,0,0.8)] pointer-events-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FFB800]/20">
                  <BarChart2 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-white tracking-wide">Statistics</span>
                {clk.status === "running" && includesToday && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              <button 
                onClick={() => { setShowStats(false); setStatsDateOffset(0); }} 
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
              >
                <X className="w-3.5 h-3.5"/>
              </button>
            </div>

            {/* Period selector — Apple segmented control */}
            <div className="flex gap-0.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.04]">
              {(["day", "week", "month", "year"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setStatsPeriod(p); setStatsDateOffset(0); }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    statsPeriod === p 
                      ? "bg-white/10 text-white shadow-sm" 
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Date navigation */}
            <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-white/[0.02] border border-white/[0.04] rounded-xl">
              <button onClick={() => setStatsDateOffset(o => o - 1)} className="text-gray-500 hover:text-white transition-colors p-0.5 text-sm font-bold">‹</button>
              <span className="font-semibold text-white/80 text-[11px] tracking-wide">{dateRangeLabel}</span>
              <button onClick={() => setStatsDateOffset(o => o + 1)} className="text-gray-500 hover:text-white transition-colors p-0.5 text-sm font-bold">›</button>
            </div>

            {/* Duration Cards — Glass Morphism */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Focus Duration */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1B20] to-[#12131A] rounded-2xl p-3.5 border border-white/[0.04]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FFB800]/8 to-transparent rounded-bl-full" />
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest block mb-1">Focus</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-white text-2xl font-black tabular-nums">{Math.floor(totalFocusSeconds / 3600)}</span>
                  <span className="text-gray-500 text-[9px] font-bold mr-1">h</span>
                  <span className="text-white text-2xl font-black tabular-nums">{String(Math.floor((totalFocusSeconds % 3600) / 60)).padStart(2,'0')}</span>
                  <span className="text-gray-500 text-[9px] font-bold">m</span>
                </div>
              </div>
              
              {/* Break Duration */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1B20] to-[#12131A] rounded-2xl p-3.5 border border-white/[0.04]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#8B5CF6]/8 to-transparent rounded-bl-full" />
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest block mb-1">Break</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-white text-2xl font-black tabular-nums">{Math.floor(totalBreakSeconds / 3600)}</span>
                  <span className="text-gray-500 text-[9px] font-bold mr-1">h</span>
                  <span className="text-white text-2xl font-black tabular-nums">{String(Math.floor((totalBreakSeconds % 3600) / 60)).padStart(2,'0')}</span>
                  <span className="text-gray-500 text-[9px] font-bold">m</span>
                </div>
              </div>

              {/* Sessions Count */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1B20] to-[#12131A] rounded-2xl p-3.5 border border-white/[0.04]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/8 to-transparent rounded-bl-full" />
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest block mb-1">Sessions</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-white text-2xl font-black tabular-nums">{periodFocusHistory.length + (activeFocusSeconds > 0 && includesToday ? 1 : 0)}</span>
                  <span className="text-gray-500 text-[9px] font-bold ml-0.5">total</span>
                </div>
              </div>
            </div>


            {/* Focus vs Break Ratio Bar */}
            {(totalFocusSeconds > 0 || totalBreakSeconds > 0) && (() => {
              const total = totalFocusSeconds + totalBreakSeconds;
              const focusPct = Math.round((totalFocusSeconds / total) * 100);
              const breakPct = 100 - focusPct;
              return (
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">Focus vs Break Ratio</span>
                    <span className="text-gray-400 text-[9px] font-bold tabular-nums">{focusPct}% / {breakPct}%</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.03]">
                    <div
                      className="h-full rounded-l-full transition-all duration-700"
                      style={{
                        width: `${focusPct}%`,
                        background: 'linear-gradient(to right, #FFB800, #FF8C00)',
                        boxShadow: '0 0 8px rgba(255,184,0,0.25)',
                      }}
                    />
                    <div
                      className="h-full rounded-r-full transition-all duration-700"
                      style={{
                        width: `${breakPct}%`,
                        background: 'linear-gradient(to right, #7C3AED, #8B5CF6)',
                        boxShadow: '0 0 8px rgba(139,92,246,0.2)',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                      <span className="text-gray-500 text-[8px] font-bold">Focus</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span className="text-gray-500 text-[8px] font-bold">Break</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {totalFocusSeconds === 0 && totalBreakSeconds === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 bg-white/[0.015] rounded-2xl border border-white/[0.04]">
                <div className="text-3xl mb-2">📊</div>
                <span className="text-gray-500 text-xs font-semibold">No sessions for this period</span>
                <span className="text-gray-600 text-[10px] mt-0.5">Start a focus session to see your stats</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Ring Chart — Apple Activity Rings Style */}
                <div className="flex flex-col items-center justify-center bg-white/[0.015] border border-white/[0.04] p-4 rounded-2xl min-h-[200px]">
                  {(() => {
                    const chartItems = Object.values(focusByTag).filter(item => item.tag);
                    const totalChartSeconds = chartItems.reduce((acc, item) => acc + item.seconds, 0);

                    if (chartItems.length === 0) {
                      return (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <div className="text-2xl">🎯</div>
                          <span className="text-gray-500 text-[10px] font-bold">No tagged sessions yet</span>
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* Ring Chart */}
                        <div className="relative flex items-center justify-center w-full mb-3">
                          <svg width="140" height="140" className="-rotate-90" style={{ filter: 'drop-shadow(0 0 12px rgba(255,184,0,0.15))' }}>
                            {/* Background track */}
                            <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" />
                            {(() => {
                              let currentOffset = 0;
                              const circumference = 2 * Math.PI * 52;
                              const gap = chartItems.length > 1 ? 4 : 0;
                              return chartItems.map((item, i) => {
                                const proportion = item.seconds / totalChartSeconds;
                                const segLen = circumference * proportion - gap;
                                const dasharray = `${Math.max(0, segLen)} ${circumference}`;
                                const dashoffset = -(currentOffset + (i > 0 ? gap / 2 : 0));
                                currentOffset += circumference * proportion;
                                return (
                                  <circle
                                    key={i}
                                    cx="70"
                                    cy="70"
                                    r="52"
                                    fill="none"
                                    stroke={item.tag.color}
                                    strokeWidth="14"
                                    strokeDasharray={dasharray}
                                    strokeDashoffset={dashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700"
                                    style={{ filter: `drop-shadow(0 0 6px ${item.tag.color}40)` }}
                                  />
                                );
                              });
                            })()}
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-white font-black text-lg tabular-nums tracking-tight">
                              {totalChartSeconds >= 3600 ? `${Math.floor(totalChartSeconds/3600)}h ${Math.floor((totalChartSeconds%3600)/60)}m` : 
                               totalChartSeconds >= 60 ? `${Math.floor(totalChartSeconds/60)}m` : 
                               `${totalChartSeconds}s`}
                            </span>
                            <span className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">Tagged</span>
                          </div>
                        </div>

                        {/* Legend pills */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-[60px] overflow-y-auto">
                          {chartItems.map((item, i) => {
                            const pct = Math.round((item.seconds / totalChartSeconds) * 100);
                            return (
                              <div key={i} className="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-lg border border-white/[0.04]">
                                <div className="w-2 h-2 rounded-full shadow-sm" style={{ background: item.tag.color, boxShadow: `0 0 6px ${item.tag.color}50` }} />
                                <span className="text-gray-300 text-[9px] font-bold">{item.tag.name}</span>
                                <span className="text-gray-500 text-[8px] font-bold">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Activity Chart — Gradient Bars */}
                <div className="flex flex-col bg-white/[0.015] border border-white/[0.04] p-4 rounded-2xl justify-between min-h-[200px]">
                  <span className="text-gray-400 text-[9px] font-bold mb-2 uppercase tracking-widest px-0.5">Activity</span>
                  
                  {(() => {
                    let buckets: { label: string; seconds: number }[] = [];
                    if (statsPeriod === "day") {
                      buckets = Array.from({length: 24}, (_, i) => ({ label: `${i}h`, seconds: 0 }));
                      periodFocusHistory.forEach(s => {
                        const d = new Date(s.completedAt);
                        buckets[d.getHours()].seconds += s.elapsedSeconds;
                      });
                      // Add active session to current hour
                      if (includesToday && activeFocusSeconds > 0) {
                        buckets[new Date().getHours()].seconds += activeFocusSeconds;
                      }
                    } else if (statsPeriod === "week") {
                      buckets = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(l => ({ label: l, seconds: 0 }));
                      periodFocusHistory.forEach(s => {
                        const d = new Date(s.completedAt);
                        let day = d.getDay();
                        day = day === 0 ? 6 : day - 1;
                        buckets[day].seconds += s.elapsedSeconds;
                      });
                      if (includesToday && activeFocusSeconds > 0) {
                        let today = new Date().getDay();
                        today = today === 0 ? 6 : today - 1;
                        buckets[today].seconds += activeFocusSeconds;
                      }
                    } else if (statsPeriod === "month") {
                      const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
                      buckets = Array.from({length: daysInMonth}, (_, i) => ({ label: String(i + 1), seconds: 0 }));
                      periodFocusHistory.forEach(s => {
                        const d = new Date(s.completedAt);
                        buckets[d.getDate() - 1].seconds += s.elapsedSeconds;
                      });
                      if (includesToday && activeFocusSeconds > 0) {
                        buckets[new Date().getDate() - 1].seconds += activeFocusSeconds;
                      }
                    } else if (statsPeriod === "year") {
                      buckets = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(l => ({ label: l, seconds: 0 }));
                      periodFocusHistory.forEach(s => {
                        const d = new Date(s.completedAt);
                        buckets[d.getMonth()].seconds += s.elapsedSeconds;
                      });
                      if (includesToday && activeFocusSeconds > 0) {
                        buckets[new Date().getMonth()].seconds += activeFocusSeconds;
                      }
                    }
                    
                    const maxSecondsInBuckets = Math.max(...buckets.map(b => b.seconds), 1);
                    let chartMaxSecs = 3600;
                    if (maxSecondsInBuckets > 3600) {
                      chartMaxSecs = Math.ceil(maxSecondsInBuckets / 3600) * 3600;
                    }
                    const overallAvg = totalFocusSeconds / buckets.length;
 
                    return (
                      <div className="w-full flex-1 flex flex-col relative px-1 pb-1">
                        <div className="relative h-28 w-full flex items-end justify-between px-0.5 gap-[1px] border-b border-white/[0.04] pb-1 z-10">
                          {/* Gridlines */}
                          {[0.25, 0.5, 0.75].map((ratio) => {
                            const valSecs = chartMaxSecs * ratio;
                            const valLabel = valSecs >= 3600 
                              ? `${(valSecs/3600).toFixed(1).replace(/\.0$/, '')}h` 
                              : `${Math.round(valSecs/60)}m`;
                            return (
                              <div 
                                key={ratio} 
                                className="absolute left-0 right-0 border-t border-white/[0.03] pointer-events-none flex items-center justify-end"
                                style={{ bottom: `${ratio * 100}%` }}
                              >
                                <span className="text-[7px] text-gray-600/60 font-bold bg-[#0D0E12] px-1 -translate-y-1/2 z-20">
                                  {valLabel}
                                </span>
                              </div>
                            );
                          })}

                          {/* Average Line */}
                          {overallAvg > 0 && (
                            <div 
                              className="absolute left-0 right-0 border-t border-dashed border-[#FFB800]/25 flex items-center justify-end pointer-events-none z-10"
                              style={{ bottom: `${Math.min((overallAvg / chartMaxSecs) * 100, 100)}%` }}
                            >
                              <span className="text-[#FFB800]/70 text-[7px] font-bold bg-[#0D0E12] pl-1.5 -translate-y-1/2 z-20">
                                avg
                              </span>
                            </div>
                          )}

                          {/* Gradient Bars */}
                          {buckets.map((b, i) => {
                            const heightPct = (b.seconds / chartMaxSecs) * 100;
                            const isCurrentBucket = includesToday && (
                              (statsPeriod === "day" && i === new Date().getHours()) ||
                              (statsPeriod === "week" && i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)) ||
                              (statsPeriod === "month" && i === new Date().getDate() - 1) ||
                              (statsPeriod === "year" && i === new Date().getMonth())
                            );
                            return (
                              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-crosshair">
                                <div 
                                  className="w-full max-w-[10px] rounded-t-[3px] transition-all duration-300 relative"
                                  style={{ 
                                    height: `${b.seconds > 0 ? Math.max(heightPct, 3) : 0}%`,
                                    background: b.seconds > 0 
                                      ? isCurrentBucket && clk.status === "running"
                                        ? `linear-gradient(to top, #10B981, #34D399)`
                                        : `linear-gradient(to top, #2A2D38, #4A4E5C)`
                                      : 'transparent',
                                    boxShadow: isCurrentBucket && clk.status === "running" && b.seconds > 0
                                      ? '0 0 8px rgba(16,185,129,0.3)' : 'none',
                                  }}
                                >
                                  {b.seconds > 0 && (
                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1A1B22] text-white text-[7px] py-0.5 px-1.5 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-30 transition-opacity font-bold shadow-lg border border-white/5">
                                      {b.seconds >= 3600 
                                        ? `${(b.seconds/3600).toFixed(1).replace(/\.0$/, '')}h` 
                                        : b.seconds >= 60 ? `${Math.floor(b.seconds/60)}m ${b.seconds%60}s`
                                        : `${b.seconds}s`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between px-0.5 mt-1.5 w-full">
                          {buckets.map((b, i) => {
                            let showLabel = false;
                            if (statsPeriod === "day") {
                              showLabel = i % 6 === 0 || i === 23;
                            } else if (statsPeriod === "week") {
                              showLabel = true;
                            } else if (statsPeriod === "month") {
                              showLabel = i === 0 || i === 9 || i === 19 || i === buckets.length - 1;
                            } else if (statsPeriod === "year") {
                              showLabel = i % 2 === 0;
                            }
                            return (
                              <div key={i} className="flex-1 text-center">
                                <span className="text-[7px] text-gray-600 font-bold">{showLabel ? b.label : ''}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

          </div>
        </div>
      )}


      {/* Off-screen Ambient Sound YouTube Player */}
      <div
        id="cosmicbone-ambient-player-container"
        style={{
          position: 'fixed',
          bottom: '-200px',
          right: '-200px',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -9999
        }}
      >
        <ReactPlayer
          url={currentAmbientUrl}
          playing={isAmbientPlaying && !!currentAmbientUrl}
          volume={isMuted ? 0 : ambientVolume / 100}
          loop={true}
          width="1px"
          height="1px"
          config={{
            youtube: {
              playerVars: { showinfo: 1 } as any
            }
          } as any}
        />
      </div>
    </div>
  );
};

export default FocusClockPage;
