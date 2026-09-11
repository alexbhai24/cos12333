import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BarChart2, MoreVertical, Moon, Sun, Info, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationMinutes: number;
}

export const SleepCyclePage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [records, setRecords] = useState<SleepRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cosmic_sleep_data_v1');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveRecord = (record: SleepRecord) => {
    const existingIdx = records.findIndex(r => r.date === record.date);
    let newRecords = [...records];
    if (existingIdx >= 0) {
      newRecords[existingIdx] = record;
    } else {
      newRecords.push(record);
    }
    // Sort by date ascending
    newRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setRecords(newRecords);
    localStorage.setItem('cosmic_sleep_data_v1', JSON.stringify(newRecords));
  };

  const getTodayRecord = () => {
    const today = new Date().toISOString().split('T')[0];
    return records.find(r => r.date === today);
  };

  const todayRecord = getTodayRecord();
  const hours = todayRecord ? Math.floor(todayRecord.durationMinutes / 60) : '--';
  const minutes = todayRecord ? todayRecord.durationMinutes % 60 : '--';

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentRoute('tools')}
            className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Sleep Tracker
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Monitor your daily rest
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <BarChart2 className="w-5 h-5 text-[var(--color-cyan)]" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[var(--bg-surface-solid)]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--color-cyan)]/20 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-cyan)]/15 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-[var(--color-cyan)]" />
                  </div>
                  <h2 className="text-[var(--text-secondary)] font-medium text-sm tracking-wide uppercase">Today's Sleep</h2>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-white font-heading">{hours}</span>
                <span className="text-lg text-[var(--text-muted)] font-medium">hr</span>
                <span className="text-5xl font-bold text-white font-heading ml-2">{minutes}</span>
                <span className="text-lg text-[var(--text-muted)] font-medium">min</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-4">
                {todayRecord ? 'You logged your sleep for today.' : 'No data recorded for today yet.'}
              </p>
            </div>

            <div className="bg-[var(--bg-surface-solid)]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[var(--text-secondary)] font-medium text-sm tracking-wide uppercase">Last 7 Days</h2>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-white/60">Weekly avg</span>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-32">
                {[...Array(7)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const dateStr = d.toISOString().split('T')[0];
                  const rec = records.find(r => r.date === dateStr);
                  const maxMins = 12 * 60; 
                  const heightPct = rec ? Math.min(100, (rec.durationMinutes / maxMins) * 100) : 0;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                      {rec ? (
                        <div className="w-full flex justify-center h-full items-end relative">
                          <div 
                            className="w-full max-w-[20px] bg-gradient-to-t from-[var(--color-cyan)]/40 to-[var(--color-cyan)] rounded-xl transition-all duration-300 relative group-hover:shadow-[0_0_15px_var(--color-cyan)]"
                            style={{ height: `${heightPct}%` }}
                          />
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--bg-surface-secondary)] border border-white/10 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl pointer-events-none">
                            {Math.floor(rec.durationMinutes/60)}h {rec.durationMinutes%60}m
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex justify-center items-end h-full">
                          <div className="w-full max-w-[20px] h-[4px] bg-white/5 rounded-full" />
                        </div>
                      )}
                      <span className={`text-[10px] font-medium ${i === 6 ? 'text-[var(--color-cyan)]' : 'text-[var(--text-muted)]'}`}>
                        {['S','M','T','W','T','F','S'][d.getDay()]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <InlineSleepEntry onSave={saveRecord} />

          {/* Education Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-[var(--bg-surface-solid)]/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Sun className="w-6 h-6 text-indigo-400"/>
              </div>
              <h3 className="font-bold text-lg text-white">Memory Consolidation</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                While you sleep, your brain replays and stores the information you learned during the day. Skipping sleep is like typing an essay and never hitting save. Let your brain lock in what you've studied.
              </p>
            </div>
            <div className="bg-[var(--bg-surface-solid)]/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-400"/>
              </div>
              <h3 className="font-bold text-lg text-white">Emotional Regulation</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                The amygdala, your brain's emotional center, becomes 60% more reactive on low sleep. A consistent, high-quality night's rest keeps exam anxiety, stress, and burnout at bay.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[var(--color-cyan)]/10 to-blue-600/10 border border-[var(--color-cyan)]/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-cyan)]/10 blur-[80px] rounded-full pointer-events-none" />
            <h3 className="font-bold text-lg text-white mb-4">Fix Your Sleep Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[var(--color-cyan)] text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]"><strong className="text-white">Consistent Timing:</strong> Go to bed and wake up at the exact same time every day.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[var(--color-cyan)] text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]"><strong className="text-white">Light Exposure:</strong> Get 10-15 minutes of sunlight immediately after waking up.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[var(--color-cyan)] text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]"><strong className="text-white">Digital Sunset:</strong> Turn off screens or use heavy blue-light filters 60 mins before bed.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[var(--color-cyan)] text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]"><strong className="text-white">Cool Environment:</strong> Keep your room temperature around 18-20°C (65-68°F).</p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

const InlineSleepEntry: React.FC<{ onSave: (r: SleepRecord) => void }> = ({ onSave }) => {
  const [bedTime, setBedTime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [activeDays, setActiveDays] = useState<number[]>([1,2,3,4,5]); 
  
  const timeToMins = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const minsToTime = (m: number) => {
    const h = Math.floor(m / 60) % 24;
    const min = m % 60;
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  const calcDuration = () => {
    let b = timeToMins(bedTime);
    let w = timeToMins(wakeTime);
    if (w < b) w += 24 * 60;
    return w - b;
  };

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    onSave({
      id: Date.now().toString(),
      date: today,
      bedTime,
      wakeTime,
      durationMinutes: calcDuration()
    });
    // Visual feedback could be added here
  };

  const duration = calcDuration();
  const durH = Math.floor(duration/60);
  const durM = duration%60;

  return (
    <div className="bg-[var(--bg-surface-solid)]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8 relative">
      <h3 className="text-[var(--text-secondary)] font-medium text-sm tracking-wide uppercase mb-6">Log Today's Sleep</h3>
      
      <div className="space-y-8 mb-8">
        
        {/* Bed Time Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
              </svg>
              <span className="font-semibold">Bed Time</span>
            </div>
            <span className="text-2xl font-light text-white">{bedTime}</span>
          </div>
          <div className="relative pt-2 pb-2">
            <input 
              type="range" 
              min="0" 
              max="1440" 
              step="15" 
              value={timeToMins(bedTime)}
              onChange={(e) => setBedTime(minsToTime(Number(e.target.value)))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-cyan)]"
            />
            <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
              <span>00:00</span>
              <span>12:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Wake Time Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2 2" />
                <path d="M5 3 2 6M22 6l-3-3M6.38 18.7 4 21M17.64 18.67 20 21" />
              </svg>
              <span className="font-semibold">Wake Time</span>
            </div>
            <span className="text-2xl font-light text-white">{wakeTime}</span>
          </div>
          <div className="relative pt-2 pb-2">
            <input 
              type="range" 
              min="0" 
              max="1440" 
              step="15" 
              value={timeToMins(wakeTime)}
              onChange={(e) => setWakeTime(minsToTime(Number(e.target.value)))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-cyan)]"
            />
            <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
              <span>00:00</span>
              <span>12:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="text-[var(--color-cyan)] font-medium text-sm flex-1">
          Total Sleep: {durH} hr {durM > 0 ? `${durM} min` : ''}
        </div>
        <button 
          onClick={handleSave} 
          className="w-full sm:w-auto py-3 px-8 rounded-xl bg-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/90 text-black font-bold transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          Save Log
        </button>
      </div>
    </div>
  );
};
