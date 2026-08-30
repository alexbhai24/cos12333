import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface FlipPanelProps {
  hours?: string;
  minutes: string;
  seconds: string;
  accentColor?: string;
  brightness?: number; // 0 to 100
}

export const FlipPanel: React.FC<FlipPanelProps> = ({
  hours = "00",
  minutes,
  seconds,
  accentColor = "#EC4899",
  brightness = 100,
}) => {
  const [prevMins] = useState(minutes);
  const [prevSecs] = useState(seconds);

  // Brightness scaling: 100% -> 1.0, 50% -> 0.5, etc.
  const bScale = brightness / 100;
  // White light reflection base opacity is 0.25
  const topReflectionOpacity = 0.25 * bScale;
  // Text base opacity is 1.0
  const textOpacity = 0.4 + (0.6 * bScale); // Min opacity 40% so it's always readable

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-[90vw] mx-auto px-2">
      {/* Hours Panel (Only visible if > 0) */}
      {hours !== "00" && (
        <div 
          className={cn(
            "relative flex items-center justify-center bg-black rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3rem]",
            "w-full aspect-[4/3] max-h-[60vh]",
            "shadow-2xl overflow-hidden transition-all duration-300"
          )}
          style={{
            boxShadow: `0 35px 60px -15px rgba(0, 0, 0, 0.8), inset 0 2px 0 rgba(255,255,255,0.075), inset 0 -2px 10px rgba(0,0,0,0.5)`,
            border: '1px solid rgba(255,255,255,0.025)'
          }}
        >
          <span 
            className="text-white font-bold tracking-tighter z-10"
            style={{
              fontSize: hours !== "00" ? "clamp(4rem, 18vw, 20rem)" : "clamp(6rem, 25vw, 25rem)",
              lineHeight: 1,
              textShadow: "0 10px 40px rgba(0,0,0,1)",
              opacity: textOpacity
            }}
          >
            {hours.padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Minutes Panel */}
      <div 
        className={cn(
          "relative flex items-center justify-center bg-black rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3rem]",
          "w-full aspect-[4/3] max-h-[60vh]",
          "shadow-2xl overflow-hidden transition-all duration-300"
        )}
        style={{
          boxShadow: `0 35px 60px -15px rgba(0, 0, 0, 0.8), inset 0 2px 0 rgba(255,255,255,0.075), inset 0 -2px 10px rgba(0,0,0,0.5)`,
          border: '1px solid rgba(255,255,255,0.025)'
        }}
      >
        <span 
          className="text-white font-bold tracking-tighter z-10"
          style={{
            fontSize: hours !== "00" ? "clamp(4rem, 18vw, 20rem)" : "clamp(6rem, 25vw, 25rem)",
            lineHeight: 1,
            textShadow: "0 10px 40px rgba(0,0,0,1)",
            opacity: textOpacity
          }}
        >
          {minutes.padStart(2, '0')}
        </span>
      </div>

      {/* Seconds Panel */}
      <div 
        className={cn(
          "relative flex items-center justify-center bg-black rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3rem]",
          "w-full aspect-[4/3] max-h-[60vh]",
          "shadow-2xl overflow-hidden transition-all duration-300"
        )}
        style={{
          boxShadow: `0 35px 60px -15px rgba(0, 0, 0, 0.8), inset 0 2px 0 rgba(255,255,255,0.075), inset 0 -2px 10px rgba(0,0,0,0.5)`,
          border: '1px solid rgba(255,255,255,0.025)'
        }}
      >
        <span 
          className="text-white font-bold tracking-tighter z-10"
          style={{
            fontSize: hours !== "00" ? "clamp(4rem, 18vw, 20rem)" : "clamp(6rem, 25vw, 25rem)",
            lineHeight: 1,
            textShadow: "0 10px 40px rgba(0,0,0,1)",
            opacity: textOpacity
          }}
        >
          {seconds.padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default FlipPanel;
