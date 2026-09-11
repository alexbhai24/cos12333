import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react';

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface CalEvent {
  id: string;
  title: string;
  date: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  color: 'green' | 'violet' | 'blue' | 'rose' | 'amber';
}
interface Task {
  id: string;
  label: string;
  done: boolean;
}

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────
const EVENT_COLORS = {
  green:  { bg: '#7cb518', tile: '#a3d639', text: '#fff', name: 'Study' },
  violet: { bg: '#6d28d9', tile: '#8b5cf6', text: '#fff', name: 'Revision' },
  blue:   { bg: '#1d4ed8', tile: '#3b82f6', text: '#fff', name: 'Mock Test' },
  rose:   { bg: '#be123c', tile: '#fb7185', text: '#fff', name: 'Exercise' },
  amber:  { bg: '#b45309', tile: '#fbbf24', text: '#000', name: 'Break' },
} as const;

const COLOR_CYCLE: CalEvent['color'][] = ['green', 'violet', 'blue', 'rose', 'amber'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SH = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS   = Array.from({ length: 17 }, (_, i) => i + 6); // 6 am → 10 pm

const pad     = (n: number) => n.toString().padStart(2, '0');
const toMin   = (h: number, m: number) => h * 60 + m;
const isoDate = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const CAL_KEY  = 'cosmic_schedule_cal_v2';
const TASK_KEY = 'cosmic_schedule_tasks_v1';

function getWeekDays(anchor: Date): Date[] {
  const dow = anchor.getDay();
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - ((dow + 6) % 7)); // Mon-start
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function fmtHour(h: number) {
  return h === 0 ? '12 am' : h < 12 ? `${h} am` : h === 12 ? '12 pm' : `${h - 12} pm`;
}

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────
export const ScheduleDayPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const todayBase = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();
  const todayStr  = isoDate(todayBase.getFullYear(), todayBase.getMonth(), todayBase.getDate());

  const [anchor,   setAnchor]   = useState(new Date(todayBase));
  const weekDays = getWeekDays(anchor);

  // Mini-cal state — fully independent
  const [miniYear,  setMiniYear]  = useState(todayBase.getFullYear());
  const [miniMonth, setMiniMonth] = useState(todayBase.getMonth());
  const [selDate,   setSelDate]   = useState<string | null>(null);

  // Sync mini-cal header when week arrows navigate anchor to a different month
  useEffect(() => {
    setMiniYear(weekDays[0].getFullYear());
    setMiniMonth(weekDays[0].getMonth());
  }, [anchor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Events & tasks
  const [events, setEvents] = useState<CalEvent[]>(() => {
    try { return JSON.parse(localStorage.getItem(CAL_KEY) || '[]'); } catch { return []; }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    try { return JSON.parse(localStorage.getItem(TASK_KEY) || '[]'); } catch { return []; }
  });

  // Color filters
  const [hiddenColors, setHiddenColors] = useState<Set<CalEvent['color']>>(new Set());

  // Modal form
  const [modal, setModal] = useState<{ date: string; sh: number } | null>(null);
  const [mForm, setMForm] = useState({ title:'', sh:9, sm:0, eh:10, em:0, color:'green' as CalEvent['color'] });

  // Task input
  const [newTask, setNewTask] = useState('');
  const taskInputRef = useRef<HTMLInputElement>(null);

  // Current time — tick every 30 s
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  // Persist
  useEffect(() => { localStorage.setItem(CAL_KEY,  JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem(TASK_KEY, JSON.stringify(tasks));  }, [tasks]);

  // ── Mini-cal helpers ──
  const miniFirst    = new Date(miniYear, miniMonth, 1).getDay();
  const miniStartMon = (miniFirst + 6) % 7;
  const miniDays     = new Date(miniYear, miniMonth + 1, 0).getDate();

  const prevMini = () => {
    if (miniMonth === 0) { setMiniMonth(11); setMiniYear(y => y - 1); }
    else setMiniMonth(m => m - 1);
  };
  const nextMini = () => {
    if (miniMonth === 11) { setMiniMonth(0); setMiniYear(y => y + 1); }
    else setMiniMonth(m => m + 1);
  };

  // ── Events ──
  const eventsFor = (date: string) =>
    events.filter(e => e.date === date && !hiddenColors.has(e.color));

  const addEvent = () => {
    if (!mForm.title.trim() || !modal) return;
    if (toMin(mForm.eh, mForm.em) <= toMin(mForm.sh, mForm.sm)) return;
    setEvents(prev => [...prev, {
      id: Date.now().toString(), title: mForm.title, date: modal.date,
      startHour: mForm.sh, startMinute: mForm.sm, endHour: mForm.eh, endMinute: mForm.em, color: mForm.color,
    }].sort((a, b) => toMin(a.startHour, a.startMinute) - toMin(b.startHour, b.startMinute)));
    setModal(null);
  };
  const removeEvent = (id: string) => setEvents(p => p.filter(e => e.id !== id));

  const openModal = (date: string, sh = 9) => {
    const nextColor = COLOR_CYCLE[events.length % COLOR_CYCLE.length];
    setMForm({ title:'', sh, sm:0, eh: Math.min(sh + 1, 22), em:0, color: nextColor });
    setModal({ date, sh });
  };

  // ── Tasks ──
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(p => [...p, { id: Date.now().toString(), label: newTask.trim(), done: false }]);
    setNewTask('');
  };
  const toggleTask   = (id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask   = (id: string) => setTasks(p => p.filter(t => t.id !== id));

  // ── Week label ──
  const ws = weekDays[0], we = weekDays[6];
  const weekLabel = `${MONTHS[ws.getMonth()].slice(0,3)} ${ws.getDate()} – ${MONTHS[we.getMonth()].slice(0,3)} ${we.getDate()}, ${we.getFullYear()}`;

  // ── Color filter toggle ──
  const toggleColor = (c: CalEvent['color']) => setHiddenColors(prev => {
    const n = new Set(prev);
    n.has(c) ? n.delete(c) : n.add(c);
    return n;
  });

  // ── Current time ──
  const nowH = now.getHours(), nowM = now.getMinutes();
  const todayIsInWeek = weekDays.some(d => isoDate(d.getFullYear(), d.getMonth(), d.getDate()) === todayStr);

  // px from top of the 6 am row (each hour = 72px)
  const nowTopPx = (toMin(nowH, nowM) - toMin(6, 0)) / 60 * 72;

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────
  return (
    <div className="animate-in fade-in duration-300 -mt-2">

      {/* ══ TOP HEADER ══ */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={() => setCurrentRoute('tools')}
          className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-xl font-black text-white tracking-tight">Schedule Day</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400 mr-1 hidden md:block">{weekLabel}</span>
          <button onClick={() => setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() - 1); return n; })}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => { setAnchor(new Date(todayBase)); setSelDate(null); }}
            className="px-4 h-8 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
            Today
          </button>
          <button onClick={() => setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() + 1); return n; })}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* ══ TWO PANEL LAYOUT ══ */}
      <div className="flex gap-4 items-start">

        {/* ═ LEFT SIDEBAR ═ */}
        <div className="w-52 flex-shrink-0 hidden lg:flex flex-col gap-3">

          {/* New Event */}
          <button onClick={() => openModal(todayStr)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Plus className="w-4 h-4" /> New Event
          </button>

          {/* Mini Calendar */}
          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(109,40,217,0.15)' }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <span className="text-[11px] font-black text-white">{MONTHS[miniMonth]} {miniYear}</span>
              <div className="flex gap-0.5">
                <button onClick={prevMini} className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                  <ChevronLeft className="w-3 h-3 text-gray-400" />
                </button>
                <button onClick={nextMini} className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
            {/* Mon-start header */}
            <div className="grid grid-cols-7 px-3 pb-1">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="text-[9px] text-center font-bold text-violet-300/50">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
              {Array.from({ length: miniStartMon }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: miniDays }, (_, i) => {
                const day  = i + 1;
                const dStr = isoDate(miniYear, miniMonth, day);
                const isT  = dStr === todayStr;
                const isSel= selDate === dStr;
                const hasEv= events.some(e => e.date === dStr);
                return (
                  <button key={day}
                    onClick={() => {
                      setSelDate(dStr);
                      setAnchor(new Date(miniYear, miniMonth, day));
                    }}
                    className={`w-6 h-6 mx-auto rounded-full text-[10px] font-bold flex items-center justify-center transition-all relative ${
                      isT   ? 'text-white' :
                      isSel ? 'bg-violet-600 text-white' :
                              'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    style={isT ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' } : {}}
                  >
                    {day}
                    {hasEv && !isT && !isSel && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-xs font-black text-white">My Calendar</span>
              <button
                onClick={() => { setNewTask(' '); setTimeout(() => taskInputRef.current?.focus(), 50); }}
                className="flex items-center gap-1 text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Task
              </button>
            </div>
            {newTask !== '' && (
              <div className="px-4 py-2 border-b border-white/5">
                <input
                  ref={taskInputRef}
                  autoFocus
                  value={newTask.trim()}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addTask();
                    if (e.key === 'Escape') setNewTask('');
                  }}
                  placeholder="Task name…"
                  className="w-full bg-transparent text-white text-xs placeholder-gray-600 focus:outline-none"
                />
              </div>
            )}
            <div className="py-2 max-h-40 overflow-y-auto">
              {tasks.length === 0 && newTask === '' && (
                <div className="text-[10px] text-gray-700 text-center py-3">No tasks yet</div>
              )}
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 px-4 py-1.5 group hover:bg-white/5 transition-colors">
                  <button onClick={() => toggleTask(task.id)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.done ? 'border-violet-500 bg-violet-500' : 'border-gray-600'
                    }`}>
                    {task.done && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                  <span className={`text-[11px] flex-1 leading-snug ${task.done ? 'line-through text-gray-700' : 'text-gray-300'}`}>
                    {task.label}
                  </span>
                  <button onClick={() => removeTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Color filter toggles — FIX 4: now interactive */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3">Filter</div>
            <div className="space-y-2.5">
              {(Object.entries(EVENT_COLORS) as [CalEvent['color'], typeof EVENT_COLORS.green][]).map(([key, val]) => {
                const hidden = hiddenColors.has(key);
                return (
                  <button key={key} onClick={() => toggleColor(key)}
                    className="flex items-center gap-2.5 w-full group">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0 transition-all"
                      style={{ backgroundColor: val.tile, opacity: hidden ? 0.2 : 1 }} />
                    <span className={`text-[11px] transition-colors ${hidden ? 'line-through text-gray-700' : 'text-gray-300'}`}>
                      {val.name}
                    </span>
                    {!hidden && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: val.tile }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═ WEEK GRID ═ */}
        {/* FIX 1: Put headers INSIDE the scrollable container as sticky row
            so scrollbar width never causes header/body misalignment */}
        <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 220px)', minHeight: 400 }}>
          <div className="overflow-y-auto h-full">
            {/* Sticky day header row — same grid as body, always aligned */}
            <div className="sticky top-0 z-10 grid border-b border-white/5"
              style={{ gridTemplateColumns: '3.5rem repeat(7, 1fr)', background: 'rgba(14,14,14,0.95)', backdropFilter: 'blur(12px)' }}>
              <div className="py-3 flex items-end justify-end pr-2 pb-2">
                <span className="text-[8px] font-bold text-gray-700">GMT+5</span>
              </div>
              {weekDays.map((day, i) => {
                const dStr = isoDate(day.getFullYear(), day.getMonth(), day.getDate());
                const isT  = dStr === todayStr;
                const cnt  = eventsFor(dStr).length;
                return (
                  <div key={i}
                    onClick={() => openModal(dStr)}
                    className={`flex flex-col items-center py-2.5 border-l border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${isT ? 'bg-violet-500/10' : ''}`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: isT ? '#a78bfa' : '#4b5563' }}>
                      {DAYS_SH[(day.getDay() + 6) % 7]}
                    </span>
                    <div className={`text-2xl font-black mt-0.5 leading-none ${isT ? 'text-white' : 'text-gray-500'}`}>
                      {day.getDate()}
                    </div>
                    {isT && <div className="w-5 h-0.5 rounded-full mt-1" style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)' }} />}
                    {cnt > 0 && !isT && <div className="w-1 h-1 rounded-full mt-1 bg-gray-600" />}
                  </div>
                );
              })}
            </div>

            {/* Time rows */}
            <div className="relative">
              {HOURS.map(hour => (
                <div key={hour} className="grid" style={{ gridTemplateColumns: '3.5rem repeat(7, 1fr)', height: 72 }}>
                  {/* Hour label */}
                  <div className="flex items-start justify-end pr-2 pt-1 border-r border-white/5">
                    <span className="text-[9px] font-semibold text-gray-700">{fmtHour(hour)}</span>
                  </div>
                  {/* Day cells */}
                  {weekDays.map((day, colIdx) => {
                    const dStr   = isoDate(day.getFullYear(), day.getMonth(), day.getDate());
                    const isT    = dStr === todayStr;
                    const dayEvs = eventsFor(dStr).filter(e => e.startHour === hour);
                    // FIX 2: Current time — inside the cell of today's column
                    // nowH === hour means this row matches the current hour
                    const showTimeLine = isT && todayIsInWeek && nowH === hour;

                    return (
                      <div key={colIdx}
                        onClick={() => openModal(dStr, hour)}
                        className={`border-r border-b border-white/[0.04] last:border-r-0 relative cursor-pointer group transition-colors ${
                          isT ? 'bg-violet-500/[0.03]' : 'hover:bg-white/[0.025]'
                        }`}>
                        {/* Half-hour dashed line */}
                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/[0.04] pointer-events-none" />

                        {/* FIX 2: Current time indicator — positioned inside this cell */}
                        {showTimeLine && (
                          <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                            style={{ top: (nowM / 60) * 72 }}>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#4285f4] flex-shrink-0 shadow-md shadow-blue-500/60"
                              style={{ marginLeft: -5 }} />
                            <div className="flex-1 h-0.5 bg-[#4285f4]" />
                          </div>
                        )}

                        {/* Events */}
                        {dayEvs.map(ev => {
                          const col         = EVENT_COLORS[ev.color];
                          const topOffset   = (ev.startMinute / 60) * 72;
                          const durationMin = toMin(ev.endHour, ev.endMinute) - toMin(ev.startHour, ev.startMinute);
                          const heightPx    = Math.max((durationMin / 60) * 72 - 3, 26);
                          return (
                            <div key={ev.id}
                              onClick={e => e.stopPropagation()}
                              className="absolute left-0.5 right-0.5 rounded-xl px-2 pt-1.5 overflow-hidden group/ev cursor-default z-10 shadow-md"
                              style={{ top: topOffset + 2, height: heightPx, backgroundColor: col.tile }}>
                              <div className="text-[11px] font-black leading-tight truncate" style={{ color: col.text }}>
                                {ev.title}
                              </div>
                              {heightPx > 38 && (
                                <div className="text-[9px] mt-0.5 opacity-75" style={{ color: col.text }}>
                                  {pad(ev.startHour)}:{pad(ev.startMinute)} – {pad(ev.endHour)}:{pad(ev.endMinute)}
                                </div>
                              )}
                              <button
                                onClick={e => { e.stopPropagation(); removeEvent(ev.id); }}
                                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/25 items-center justify-center opacity-0 group-hover/ev:opacity-100 transition-opacity hidden sm:flex">
                                <X className="w-2.5 h-2.5 text-white" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MODAL ══ */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-white">New Event</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(modal.date + 'T12:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
                </p>
              </div>
              <button onClick={() => setModal(null)}
                className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <input autoFocus type="text" value={mForm.title}
                onChange={e => setMForm(f => ({ ...f, title: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addEvent()}
                placeholder="Event title…"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors text-sm font-medium"
              />

              {/* Color pills */}
              <div>
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {(Object.entries(EVENT_COLORS) as [CalEvent['color'], typeof EVENT_COLORS.green][]).map(([key, val]) => (
                    <button key={key}
                      onClick={() => setMForm(f => ({ ...f, color: key }))}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border-2 ${
                        mForm.color === key ? 'border-white/40 scale-105' : 'border-transparent opacity-50'
                      }`}
                      style={{ backgroundColor: val.tile + 'cc', color: val.text }}>
                      {val.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Date</label>
                <input type="date" value={modal.date}
                  onChange={e => setModal(m => m ? { ...m, date: e.target.value } : m)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Time range */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Start</label>
                  <input type="time" value={`${pad(mForm.sh)}:${pad(mForm.sm)}`}
                    onChange={e => { const [h,m] = e.target.value.split(':').map(Number); setMForm(f => ({ ...f, sh:h, sm:m })); }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">End</label>
                  <input type="time" value={`${pad(mForm.eh)}:${pad(mForm.em)}`}
                    onChange={e => { const [h,m] = e.target.value.split(':').map(Number); setMForm(f => ({ ...f, eh:h, em:m })); }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <button onClick={addEvent} disabled={!mForm.title.trim()}
                className="w-full py-3 rounded-2xl font-black text-sm text-white transition-all active:scale-95 disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
