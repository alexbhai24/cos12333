import React, { useState } from 'react';
import { Keyboard } from 'lucide-react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTime: (timeStr: string) => void;
  initialTime?: string; // '10:00 AM' or '15:00'
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  onClose,
  onSaveTime,
  initialTime = '10:00 AM',
}) => {
  const [selectedHour, setSelectedHour] = useState(() => {
    const match = initialTime.match(/(\d+):(\d+)/);
    return match ? parseInt(match[1], 10) % 12 || 12 : 10;
  });

  const [selectedMinute, setSelectedMinute] = useState(() => {
    const match = initialTime.match(/:(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
    return initialTime.toUpperCase().includes('PM') ? 'PM' : 'AM';
  });

  const [mode, setMode] = useState<'hour' | 'minute'>('hour');

  if (!isOpen) return null;

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const handleConfirm = () => {
    const formatted = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')} ${period}`;
    onSaveTime(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#0e111d] border-t sm:border border-white/10 rounded-t-[28px] sm:rounded-3xl p-5 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-5 animate-in slide-in-from-bottom duration-300 ease-out">
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1.5 bg-white/20 hover:bg-white/30 rounded-full mx-auto my-1 sm:hidden flex-shrink-0 cursor-pointer" onClick={onClose} />
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Select time</h4>

        {/* Display Banner */}
        <div className="flex items-center justify-center gap-3">
          {/* Hour & Minute Display */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('hour')}
              className={`text-3xl font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
                mode === 'hour'
                  ? 'bg-[#5b387e] text-white shadow-md'
                  : 'bg-[#181922] text-slate-300 hover:text-white'
              }`}
            >
              {String(selectedHour).padStart(2, '0')}
            </button>
            <span className="text-2xl font-bold text-slate-400">:</span>
            <button
              onClick={() => setMode('minute')}
              className={`text-3xl font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
                mode === 'minute'
                  ? 'bg-[#5b387e] text-white shadow-md'
                  : 'bg-[#181922] text-slate-300 hover:text-white'
              }`}
            >
              {String(selectedMinute).padStart(2, '0')}
            </button>
          </div>

          {/* AM / PM Toggle */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#181922]">
            <button
              onClick={() => setPeriod('AM')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                period === 'AM'
                  ? 'bg-[#6d3e58] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod('PM')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                period === 'PM'
                  ? 'bg-[#6d3e58] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Circular Clock Dial */}
        <div className="relative w-56 h-56 mx-auto rounded-full bg-[#171822] border border-white/5 flex items-center justify-center">
          {/* Dial Center Pivot */}
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 z-10" />

          {/* Hand Indicator */}
          {mode === 'hour' ? (
            (() => {
              const idx = hours.indexOf(selectedHour);
              const deg = idx * 30 - 90;
              return (
                <div
                  className="absolute w-24 h-0.5 bg-purple-400 origin-left left-28 z-0 pointer-events-none"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-7 h-7 rounded-full bg-purple-400 absolute -right-3.5 -top-3 shadow-lg" />
                </div>
              );
            })()
          ) : (
            (() => {
              const idx = minutes.indexOf(selectedMinute);
              const deg = idx * 30 - 90;
              return (
                <div
                  className="absolute w-24 h-0.5 bg-purple-400 origin-left left-28 z-0 pointer-events-none"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-7 h-7 rounded-full bg-purple-400 absolute -right-3.5 -top-3 shadow-lg" />
                </div>
              );
            })()
          )}

          {/* Clock Numbers */}
          {(mode === 'hour' ? hours : minutes).map((val, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = 80;
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));
            const isSelected = mode === 'hour' ? selectedHour === val : selectedMinute === val;

            return (
              <button
                key={val}
                onClick={() => {
                  if (mode === 'hour') {
                    setSelectedHour(val);
                    setMode('minute');
                  } else {
                    setSelectedMinute(val);
                  }
                }}
                className={`absolute w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center cursor-pointer transition-colors z-10 ${
                  isSelected ? 'text-white font-black' : 'text-slate-300 hover:text-white'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {mode === 'minute' ? String(val).padStart(2, '0') : val}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setMode(prev => prev === 'hour' ? 'minute' : 'hour')}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle Hour/Minute"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl border border-purple-400/40 transition-all cursor-pointer shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
