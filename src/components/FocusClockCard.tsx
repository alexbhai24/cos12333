import React, { useEffect, useState } from "react";
import { Play, Pause, ExternalLink } from "lucide-react";
import focusClockService, { FocusClockState } from "../services/focusClockService";


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

interface FocusClockCardProps {
  onNavigate: () => void;
}

export const FocusClockCard: React.FC<FocusClockCardProps> = ({ onNavigate }) => {
  const [clk, setClk] = useState<FocusClockState>(focusClockService.getState());
  const [hrs, setHrs] = useState("00");
  const [mins, setMins] = useState("30");
  const [secs, setSecs] = useState("00");

  useEffect(() => {
    const tick = () => {
      const [h, m, s] = focusClockService.getDisplayTime();
      setHrs(h);
      setMins(m);
      setSecs(s);
      setClk({ ...focusClockService.getState() });
    };
    tick();
    // Subscribe for state-change events (start, pause, reset, etc.)
    const unsub = focusClockService.subscribe(tick);
    // Also poll every second so the countdown updates in real-time
    const intervalId = setInterval(tick, 1000);
    return () => {
      unsub();
      clearInterval(intervalId);
    };
  }, []);

  const tag = clk.tags.find((t) => t.id === clk.selectedTagId);
  const accent = clk.accentColor;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clk.status === "running") {
      focusClockService.pause();
    } else {
      focusClockService.start();
    }
  };

  const statusLabel =
    clk.status === "complete"
      ? "Done! 🎉"
      : clk.status === "running"
      ? clk.phase === "focus"
        ? "Focusing"
        : "Break"
      : clk.status === "paused"
      ? "Paused"
      : "Ready";

  return (
    <div
      onClick={onNavigate}
      className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl hover:border-[var(--color-cyan)]/30 transition-all cursor-pointer group space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse" 
            style={{ 
              background: accent,
              boxShadow: `0 0 8px ${accent}`
            }} 
          />
          <span>
            {tag ? `${tag.name}${tag.emoji && tag.emoji !== "⏱️" ? ` ${tag.emoji}` : ""}` : "Focus Clock"}
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] border border-white/5 uppercase">
          {statusLabel}
        </span>
      </div>


      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-1.5">
          {/* Hours — only visible when ≥ 1 hr (stopwatch or long sessions) */}
          {hrs !== "00" && (
            <>
              <div className="bg-[#111111] border border-white/5 rounded-lg px-2 py-1 shadow-inner text-white font-mono text-xl font-bold">
                {hrs}
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <div className="w-1 h-1 rounded-full bg-gray-600" />
              </div>
            </>
          )}
          <div className="bg-[#111111] border border-white/5 rounded-lg px-2 py-1 shadow-inner text-white font-mono text-xl font-bold">
            {mins.padStart(2, '0')}
          </div>
          <div className="flex flex-col gap-1 pb-1">
            <div className="w-1 h-1 rounded-full bg-gray-600" />
            <div className="w-1 h-1 rounded-full bg-gray-600" />
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-lg px-2 py-1 shadow-inner text-white font-mono text-xl font-bold">
            {secs.padStart(2, '0')}
          </div>
        </div>

        <button
          onClick={handlePlayPause}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md ${clk.status === "running" ? "text-white" : getContrastColor(accent)}`}
          style={{ background: clk.status === "running" ? "#1E2028" : accent }}
        >
          {clk.status === "running" ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 text-[var(--text-muted)]">
        <span>Open Focus Clock</span>
        <ExternalLink className="w-3.5 h-3.5 group-hover:text-[var(--color-cyan)] transition-colors" />
      </div>
    </div>
  );
};

export default FocusClockCard;
