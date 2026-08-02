/**
 * focusClockService.ts
 * Offline-first state machine for Focus Clock.
 * Uses deadline-based timing (targetEpoch) so the countdown stays
 * accurate across tab switches, browser throttling, and page refreshes.
 */

export interface FocusTag {
  id: string;
  name: string;
  emoji: string;
  color: string;
  focusMins?: number;
  focusSecs?: number;
  breakMins?: number;
  loops?: number;
  mode?: "pomodoro" | "stopwatch";
}


export interface FocusSession {
  id: string;
  tagId: string | null;
  tagName: string;
  tagColor: string;
  tagEmoji: string;
  durationSeconds: number;
  elapsedSeconds: number;
  completedAt: string;
  mode: "pomodoro" | "stopwatch";
  isBreak: boolean;
}

export interface FocusClockState {
  mode: "pomodoro" | "stopwatch";
  phase: "focus" | "break";
  status: "idle" | "running" | "paused" | "complete";
  focusMins: number;
  focusSecs?: number;
  breakMins: number;
  loops: number;
  currentLoop: number;
  accentColor: string;
  selectedTagId: string | null;
  reminderEnabled: boolean;
  targetEpoch: number | null;
  pausedRemainingMs: number | null;
  stopwatchElapsedMs: number;
  stopwatchStartEpoch: number | null;
  clockBrightness: number;
  history: FocusSession[];
  tags: FocusTag[];
  awaitingPhaseStart: boolean; // true when paused between phases (not a manual pause)
}

let activeUserKey: string = 'guest';

const DEFAULT_NEW_ACCOUNT_TAGS: FocusTag[] = [
  {
    id: "reading-10m",
    name: "Reading",
    emoji: "📚",
    color: "#F59E0B",
    focusMins: 10,
    focusSecs: 0,
    breakMins: 2,
    loops: 1,
    mode: "pomodoro"
  }
];

const DEFAULT_STATE: FocusClockState = {
  mode: "pomodoro",
  phase: "focus",
  status: "idle",
  focusMins: 10,
  focusSecs: 0,
  breakMins: 2,
  loops: 1,
  currentLoop: 1,
  accentColor: "#F59E0B",
  selectedTagId: "reading-10m",
  reminderEnabled: false,
  targetEpoch: null,
  pausedRemainingMs: null,
  stopwatchElapsedMs: 0,
  stopwatchStartEpoch: null,
  clockBrightness: 100,
  history: [],
  tags: DEFAULT_NEW_ACCOUNT_TAGS,
  awaitingPhaseStart: false,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function getStorageKey(): string {
  return `cosmicbone_focus_clock_${activeUserKey}`;
}

function load(): FocusClockState {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return { ...DEFAULT_STATE, tags: [...DEFAULT_NEW_ACCOUNT_TAGS] };
    const saved = JSON.parse(raw) as Partial<FocusClockState>;
    const tags = Array.isArray(saved.tags) && saved.tags.length > 0 ? saved.tags : DEFAULT_NEW_ACCOUNT_TAGS;
    return {
      ...DEFAULT_STATE,
      ...saved,
      tags,
      history: saved.history || [],
    };
  } catch {
    return { ...DEFAULT_STATE, tags: [...DEFAULT_NEW_ACCOUNT_TAGS] };
  }
}

function save(state: FocusClockState): void {
  localStorage.setItem(getStorageKey(), JSON.stringify(state));
  listeners.forEach((cb) => cb());
}

function getRemainingMs(state: FocusClockState): number {
  if (state.status === "paused" && state.pausedRemainingMs !== null) {
    return Math.max(0, state.pausedRemainingMs);
  }
  if (state.status === "running" && state.targetEpoch !== null) {
    return Math.max(0, state.targetEpoch - Date.now());
  }
  const totalMs =
    state.phase === "focus"
      ? (state.focusMins * 60 + (state.focusSecs || 0)) * 1000
      : state.breakMins * 60 * 1000;
  return totalMs;
}

function getStopwatchMs(state: FocusClockState): number {
  if (state.status === "running" && state.stopwatchStartEpoch !== null) {
    return state.stopwatchElapsedMs + (Date.now() - state.stopwatchStartEpoch);
  }
  return state.stopwatchElapsedMs;
}

export const focusClockService = {
  setUserKey(key: string): void {
    const nextKey = key || 'guest';
    if (activeUserKey !== nextKey) {
      activeUserKey = nextKey;
      listeners.forEach((cb) => cb());
    }
  },

  subscribe(cb: Listener): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },

  getState(): FocusClockState {
    return load();
  },

  getDisplayTime(): [string, string, string] {
    const state = load();
    let totalMs: number;
    if (state.mode === "stopwatch") {
      totalMs = getStopwatchMs(state);
    } else {
      totalMs = getRemainingMs(state);
    }
    const totalSecs = Math.floor(totalMs / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return [String(h).padStart(2, "0"), String(m).padStart(2, "0"), String(s).padStart(2, "0")];
  },

  getRemainingMs(): number {
    return getRemainingMs(load());
  },

  getStopwatchMs(): number {
    return getStopwatchMs(load());
  },

  start(): void {
    const state = load();
    if (state.status === "running") return;
    if (state.mode === "stopwatch") {
      state.stopwatchStartEpoch = Date.now();
      state.status = "running";
    } else {
      const remainingMs =
        state.status === "paused" && state.pausedRemainingMs !== null
          ? state.pausedRemainingMs
          : (state.phase === "focus" ? (state.focusMins * 60 + (state.focusSecs || 0)) : state.breakMins * 60) * 1000;
      state.targetEpoch = Date.now() + remainingMs;
      state.pausedRemainingMs = null;
      state.status = "running";
      state.awaitingPhaseStart = false;
    }
    save(state);
  },

  pause(): void {
    const state = load();
    if (state.status !== "running") return;
    if (state.mode === "stopwatch") {
      state.stopwatchElapsedMs = getStopwatchMs(state);
      state.stopwatchStartEpoch = null;
    } else {
      state.pausedRemainingMs = getRemainingMs(state);
      state.targetEpoch = null;
    }
    state.status = "paused";
    state.awaitingPhaseStart = false; // manual pause, not phase transition
    save(state);
  },

  reset(): void {
    const state = load();
    state.status = "idle";
    state.phase = "focus";
    state.currentLoop = 1;
    state.targetEpoch = null;
    state.pausedRemainingMs = null;
    state.stopwatchElapsedMs = 0;
    state.stopwatchStartEpoch = null;
    state.awaitingPhaseStart = false;
    save(state);
  },

  completePhase(): void {
    const state = load();
    if (state.mode === "stopwatch") return;
    const selectedTag = state.tags.find((t) => t.id === state.selectedTagId);
    
    // Calculate actual elapsed seconds
    const totalMs = state.phase === "focus"
      ? (state.focusMins * 60 + (state.focusSecs || 0)) * 1000
      : state.breakMins * 60 * 1000;
    const remainingMs = getRemainingMs(state);
    const elapsedMs = totalMs - remainingMs;
    const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    const durationSeconds = Math.floor(totalMs / 1000);

    if (elapsedSeconds > 0) {
      const session: FocusSession = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        tagId: state.selectedTagId,
        tagName: selectedTag?.name ?? "General",
        tagColor: selectedTag?.color ?? state.accentColor,
        tagEmoji: selectedTag?.emoji ?? "⏱️",
        durationSeconds,
        elapsedSeconds,
        completedAt: new Date().toISOString(),
        mode: "pomodoro",
        isBreak: state.phase === "break",
      };
      state.history.push(session);
    }

    if (state.phase === "focus") {
      if (state.breakMins === 0) {
        // No break! Check if more loops remain
        const isInfinite = state.loops === -1;
        if (isInfinite || state.currentLoop < state.loops) {
          state.currentLoop += 1;
          state.phase = "focus";
          state.pausedRemainingMs = (state.focusMins * 60 + (state.focusSecs || 0)) * 1000;
          state.targetEpoch = null;
          state.status = "paused";
          state.awaitingPhaseStart = true;
        } else {
          state.status = "complete";
          state.targetEpoch = null;
          state.pausedRemainingMs = null;
          state.awaitingPhaseStart = false;
        }
      } else {
        // Focus done → queue break but DON'T auto-start; let user press Play
        state.phase = "break";
        state.pausedRemainingMs = state.breakMins * 60 * 1000;
        state.targetEpoch = null;
        state.status = "paused";
        state.awaitingPhaseStart = true;
      }
    } else {
      // Break done → check if more loops remain
      const isInfinite = state.loops === -1;
      if (isInfinite || state.currentLoop < state.loops) {
        state.currentLoop += 1;
        state.phase = "focus";
        state.pausedRemainingMs = (state.focusMins * 60 + (state.focusSecs || 0)) * 1000;
        state.targetEpoch = null;
        state.status = "paused"; // wait for user to press Play
        state.awaitingPhaseStart = true;
      } else {
        state.status = "complete";
        state.targetEpoch = null;
        state.pausedRemainingMs = null;
        state.awaitingPhaseStart = false;
      }
    }

    save(state);
  },

  completeStopwatch(): void {
    const state = load();
    if (state.mode !== "stopwatch") return;
    
    const elapsedMs = getStopwatchMs(state);
    const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    
    if (elapsedSeconds > 0) {
      const selectedTag = state.tags.find((t) => t.id === state.selectedTagId);
      const session: FocusSession = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        tagId: state.selectedTagId,
        tagName: selectedTag?.name ?? "General",
        tagColor: selectedTag?.color ?? state.accentColor,
        tagEmoji: selectedTag?.emoji ?? "⏱️",
        durationSeconds: elapsedSeconds,
        elapsedSeconds,
        completedAt: new Date().toISOString(),
        mode: "stopwatch",
        isBreak: false,
      };
      state.history.push(session);
    }
    
    // Reset stopwatch state
    state.status = "idle";
    state.stopwatchElapsedMs = 0;
    state.stopwatchStartEpoch = null;
    save(state);
  },



  updateSettings(
    patch: Partial<
      Pick<
        FocusClockState,
        | "mode"
        | "focusMins"
        | "focusSecs"
        | "breakMins"
        | "loops"
        | "accentColor"
        | "selectedTagId"
        | "reminderEnabled"
        | "clockBrightness"
      >
    >
  ): void {
    const state = load();
    const needsReset =
      (patch.mode !== undefined && patch.mode !== state.mode) ||
      (patch.focusMins !== undefined && patch.focusMins !== state.focusMins) ||
      (patch.breakMins !== undefined && patch.breakMins !== state.breakMins);
    if (needsReset && state.status !== "idle") {
      state.status = "idle";
      state.phase = "focus";
      state.currentLoop = 1;
      state.targetEpoch = null;
      state.pausedRemainingMs = null;
      state.stopwatchElapsedMs = 0;
      state.stopwatchStartEpoch = null;
    }
    Object.assign(state, patch);
    save(state);
  },

  getTags(): FocusTag[] {
    return load().tags;
  },

  addTag(tag: Omit<FocusTag, "id">): FocusTag {
    const state = load();
    const newTag: FocusTag = {
      ...tag,
      id: `tag-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    state.tags.push(newTag);
    save(state);
    return newTag;
  },

  updateTag(id: string, patch: Partial<Omit<FocusTag, "id">>): void {
    const state = load();
    const idx = state.tags.findIndex((t) => t.id === id);
    if (idx >= 0) {
      state.tags[idx] = { ...state.tags[idx], ...patch };
      save(state);
    }
  },

  deleteTag(id: string): void {
    const state = load();
    state.tags = state.tags.filter((t) => t.id !== id);
    if (state.selectedTagId === id)
      state.selectedTagId = state.tags[0]?.id ?? null;
    save(state);
  },

  selectTag(id: string | null): void {
    const state = load();
    state.selectedTagId = id;
    const tag = state.tags.find((t) => t.id === id);
    if (tag) {
      state.accentColor = tag.color;
      state.focusMins = tag.focusMins !== undefined ? tag.focusMins : 30;
      state.focusSecs = tag.focusSecs !== undefined ? tag.focusSecs : 0;
      state.breakMins = tag.breakMins !== undefined ? tag.breakMins : 5;
      state.loops = tag.loops !== undefined ? tag.loops : 2;
      state.mode = tag.mode !== undefined ? tag.mode : "pomodoro";
      
      // Reset clock to loaded tag's configurations
      state.status = "idle";
      state.phase = "focus";
      state.currentLoop = 1;
      state.targetEpoch = null;
      state.pausedRemainingMs = null;
      state.stopwatchElapsedMs = 0;
      state.stopwatchStartEpoch = null;
      state.awaitingPhaseStart = false;
    }
    save(state);
  },


  getHistory(): FocusSession[] {
    return load().history;
  },

  clearHistory(): void {
    const state = load();
    state.history = [];
    save(state);
  },
};

export default focusClockService;
