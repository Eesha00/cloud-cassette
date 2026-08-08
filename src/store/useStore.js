import { create } from 'zustand';
import { STATIONS } from '../config/stations';

const useStore = create((set, get) => ({
  // ─── Playback ─────────────────────────────────────────────
  stationIndex: 0,
  isPlaying: false,
  isGlitching: false,
  volume: 80,          // master volume 0-100

  // ─── UI ──────────────────────────────────────────────────
  uiVisible: true,
  isEntered: false,    // set true after Splash click

  // ─── Modals ──────────────────────────────────────────────
  activeModal: null,   // 'stations' | 'ambient' | 'timer' | null

  // ─── Ambient Volumes ─────────────────────────────────────
  ambientVolumes: {
    rain: 0,
    crickets: 0,
    fire: 0,
  },
  ambientMuted: {
    rain: false,
    crickets: false,
    fire: false,
  },

  // ─── Pomodoro Timer ──────────────────────────────────────
  timerMode: 'focus',        // 'focus' | 'break'
  timerMinutes: 25,
  timerSeconds: 0,
  timerRunning: false,
  timerPreset: '25/5',       // '25/5' | '50/10' | 'custom'
  focusDuration: 25,
  breakDuration: 5,

  // ─── Actions ─────────────────────────────────────────────
  nextStation: () => {
    const { stationIndex } = get();
    const next = (stationIndex + 1) % STATIONS.length;
    set({ stationIndex: next, isGlitching: true, isPlaying: true });
    setTimeout(() => set({ isGlitching: false }), 900);
  },

  prevStation: () => {
    const { stationIndex } = get();
    const prev = (stationIndex - 1 + STATIONS.length) % STATIONS.length;
    set({ stationIndex: prev, isGlitching: true, isPlaying: true });
    setTimeout(() => set({ isGlitching: false }), 900);
  },

  setStation: (index) => {
    set({ stationIndex: index, isGlitching: true, isPlaying: true });
    setTimeout(() => set({ isGlitching: false }), 900);
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setGlitching: (val) => set({ isGlitching: val }),

  toggleUI: () => set((s) => ({ uiVisible: !s.uiVisible })),

  setEntered: () => set({ isEntered: true, isPlaying: true }),

  setModal: (modal) => set({ activeModal: modal }),

  setVolume: (vol) => set({ volume: vol }),

  setAmbientVolume: (id, val) =>
    set((s) => ({
      ambientVolumes: { ...s.ambientVolumes, [id]: val },
    })),

  toggleAmbientMute: (id) =>
    set((s) => ({
      ambientMuted: { ...s.ambientMuted, [id]: !s.ambientMuted[id] },
    })),

  // ─── Timer Actions ────────────────────────────────────────
  setTimerPreset: (preset) => {
    let focus = 25, brk = 5;
    if (preset === '50/10') { focus = 50; brk = 10; }
    set({
      timerPreset: preset,
      focusDuration: focus,
      breakDuration: brk,
      timerMode: 'focus',
      timerMinutes: focus,
      timerSeconds: 0,
      timerRunning: false,
    });
  },

  setCustomDurations: (focus, brk) => {
    set({
      timerPreset: 'custom',
      focusDuration: focus,
      breakDuration: brk,
      timerMode: 'focus',
      timerMinutes: focus,
      timerSeconds: 0,
      timerRunning: false,
    });
  },

  toggleTimer: () => set((s) => ({ timerRunning: !s.timerRunning })),

  resetTimer: () => {
    const { timerMode, focusDuration, breakDuration } = get();
    const mins = timerMode === 'focus' ? focusDuration : breakDuration;
    set({ timerMinutes: mins, timerSeconds: 0, timerRunning: false });
  },

  tickTimer: () => {
    const { timerMinutes, timerSeconds, timerMode, focusDuration, breakDuration } = get();
    if (timerSeconds > 0) {
      set({ timerSeconds: timerSeconds - 1 });
    } else if (timerMinutes > 0) {
      set({ timerMinutes: timerMinutes - 1, timerSeconds: 59 });
    } else {
      // Timer complete — switch mode
      const nextMode = timerMode === 'focus' ? 'break' : 'focus';
      const nextMins = nextMode === 'focus' ? focusDuration : breakDuration;
      set({
        timerMode: nextMode,
        timerMinutes: nextMins,
        timerSeconds: 0,
        timerRunning: false,
      });
      return true; // signals completion to the component
    }
    return false;
  },
}));

export default useStore;