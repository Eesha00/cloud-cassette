import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import useStore from '../../store/useStore';

/* ── SVG Countdown Ring ────────────────────────────────────── */
const CountdownRing = ({ progress }) => {
  // Using viewBox 0 0 100 100 makes this perfectly responsive and centered
  const radius = 42; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full -rotate-90 transform"
    >
      {/* Background Track Circle */}
      <circle 
        cx="50" cy="50" r={radius} 
        fill="none" 
        stroke="#E8DCCB" 
        strokeWidth="6" 
      />
      {/* Active Progress Circle */}
      <circle
        cx="50" cy="50" r={radius}
        fill="none"
        stroke="#4A2E2B"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
};

/* ── Timer Modal ─────────────────────────────────────────────── */
const TimerModal = () => {
  const activeModal    = useStore((s) => s.activeModal);
  const timerMode      = useStore((s) => s.timerMode);
  const timerMinutes   = useStore((s) => s.timerMinutes);
  const timerSeconds   = useStore((s) => s.timerSeconds);
  const timerRunning   = useStore((s) => s.timerRunning);
  const timerPreset    = useStore((s) => s.timerPreset);
  const focusDuration  = useStore((s) => s.focusDuration);
  const breakDuration  = useStore((s) => s.breakDuration);
  const setModal       = useStore((s) => s.setModal);
  const setTimerPreset = useStore((s) => s.setTimerPreset);
  const setCustomDurs  = useStore((s) => s.setCustomDurations);
  const toggleTimer    = useStore((s) => s.toggleTimer);
  const resetTimer     = useStore((s) => s.resetTimer);
  const tickTimer      = useStore((s) => s.tickTimer);

  const isOpen   = activeModal === 'timer';
  const chimeRef = useRef(null);
  const [customFocus, setCustomFocus] = useState(String(focusDuration));
  const [customBreak, setCustomBreak] = useState(String(breakDuration));

  // Tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      const done = tickTimer();
      if (done) {
        try {
          if (!chimeRef.current) chimeRef.current = new Audio('/audio/chime.mp3');
          chimeRef.current.play().catch(() => {});
        } catch (_) {}
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, tickTimer]);

  // Progress (0→1)
  const totalSecs  = (timerMode === 'focus' ? focusDuration : breakDuration) * 60;
  const elapsed    = totalSecs - (timerMinutes * 60 + timerSeconds);
  const progress   = totalSecs > 0 ? Math.min(1, Math.max(0, elapsed / totalSecs)) : 0;
  const isFocus    = timerMode === 'focus';

  const applyCustom = () => {
    const f = Math.max(1, Math.min(120, parseInt(customFocus) || 25));
    const b = Math.max(1, Math.min(60,  parseInt(customBreak) || 5));
    setCustomDurs(f, b);
    setCustomFocus(String(f));
    setCustomBreak(String(b));
  };

  // FIXED: Changed values to exactly match what useStore is looking for
  const PRESETS = [
    { label: '25 / 5',  value: '25/5',  desc: 'Classic Pomodoro' },
    { label: '50 / 10', value: '50/10', desc: 'Deep Work' },
    { label: 'Custom',  value: 'custom',  desc: 'Set your own' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Full-screen centred overlay ── */
        <motion.div
          key="timer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(74,46,43,0.30)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModal(null)}
        >
          {/* ── Modal card ── */}
          <motion.div
            key="timer-card"
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="w-full max-h-[90vh] overflow-y-auto cozy-scroll"
            style={{
              maxWidth: 320,
              background: '#FFFDF5',
              border: '3px solid #4A2E2B',
              borderRadius: 24,
              boxShadow: '6px 6px 0px #4A2E2B',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-cute text-[#4A2E2B] text-xl font-bold">
                    ⏱ {isFocus ? 'Focus Time' : 'Break Time'}
                  </h2>
                  <p className="font-comfy text-[#7A4E4A] text-xs mt-0.5">
                    {isFocus ? 'Stay in the zone 🍵' : 'Take a breather ☕'}
                  </p>
                </div>
                <motion.button
                  onClick={() => setModal(null)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center rounded-full text-[#4A2E2B]"
                  style={{
                    width: 34, height: 34,
                    background: '#F5EDD5',
                    border: '2.5px solid #4A2E2B',
                    boxShadow: '2px 2px 0px #4A2E2B',
                  }}
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Circular Timer — perfectly centred */}
              <div className="flex justify-center mb-5">
                <div
                  className="relative flex items-center justify-center mx-auto shrink-0"
                  style={{
                    width: 192, height: 192,
                    background: isFocus ? '#F4B5C6' : '#B5EAD7',
                    border: '3px solid #4A2E2B',
                    borderRadius: '50%',
                    boxShadow: '5px 5px 0px #4A2E2B',
                  }}
                >
                  <CountdownRing progress={progress} />
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ zIndex: 1 }}
                  >
                    <div
                      className="font-timer leading-none tracking-tight text-[#4A2E2B]"
                      style={{ fontSize: 56 }}
                    >
                      {String(timerMinutes).padStart(2, '0')}
                      <span style={{ opacity: timerRunning ? 1 : 0.4 }}>:</span>
                      {String(timerSeconds).padStart(2, '0')}
                    </div>
                    <div className="font-retro text-[#4A2E2B] text-[9px] tracking-widest mt-1 opacity-60 uppercase">
                      {timerMode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <motion.button
                  onClick={resetTimer}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title="Reset"
                  className="flex items-center justify-center rounded-full text-[#4A2E2B]"
                  style={{
                    width: 42, height: 42,
                    background: '#F5EDD5',
                    border: '2.5px solid #4A2E2B',
                    boxShadow: '2px 2px 0px #4A2E2B',
                  }}
                >
                  <RotateCcw size={16} />
                </motion.button>

                <motion.button
                  onClick={toggleTimer}
                  whileHover={{ y: -2, boxShadow: '5px 5px 0px #4A2E2B' }}
                  whileTap={{ y: 1, boxShadow: '2px 2px 0px #4A2E2B' }}
                  className="flex items-center justify-center rounded-full font-cute text-[#4A2E2B] text-sm font-bold px-8"
                  style={{
                    height: 42,
                    background: timerRunning
                      ? 'linear-gradient(135deg, #E9C46A 0%, #F8B088 100%)'
                      : 'linear-gradient(135deg, #F4B5C6 0%, #B5EAD7 100%)',
                    border: '2.5px solid #4A2E2B',
                    boxShadow: '3px 3px 0px #4A2E2B',
                  }}
                >
                  {timerRunning ? '⏸ Pause' : '▶ Start'}
                </motion.button>
              </div>

              {/* Preset selector */}
              <div
                className="mb-4 p-3 rounded-2xl"
                style={{ background: '#F5EDD5', border: '2px solid #D6C9A8' }}
              >
                <p className="font-retro text-[#7A4E4A] text-[9px] tracking-widest mb-2">PRESET</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {PRESETS.map((p) => (
                    <motion.button
                      key={p.value}
                      onClick={() => setTimerPreset(p.value)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex flex-col items-center py-1.5 px-1 rounded-xl transition-all"
                      style={{
                        background: timerPreset === p.value ? '#F4B5C6' : '#FFFDF5',
                        border: '2px solid #4A2E2B',
                        boxShadow: timerPreset === p.value ? '2px 2px 0px #4A2E2B' : '1px 1px 0px #C5A882',
                      }}
                    >
                      <span className="font-cute text-[#4A2E2B] text-xs font-bold">{p.label}</span>
                      <span className="font-comfy text-[#7A4E4A] text-[8px] leading-tight mt-0.5">{p.desc}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom duration inputs */}
              {timerPreset === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-2xl space-y-2"
                  style={{ background: '#F5EDD5', border: '2px solid #D6C9A8' }}
                >
                  {[
                    { label: '🍵 Focus (min)', value: customFocus, set: setCustomFocus },
                    { label: '☕ Break (min)', value: customBreak, set: setCustomBreak },
                  ].map(({ label, value, set }) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <span className="font-comfy text-[#4A2E2B] text-xs">{label}</span>
                      <input
                        type="number"
                        value={value}
                        min={1} max={120}
                        onChange={(e) => set(e.target.value)}
                        className="font-timer text-[#4A2E2B] text-center text-lg w-14 rounded-xl outline-none"
                        style={{
                          background: '#FFFDF5',
                          border: '2px solid #4A2E2B',
                          boxShadow: '2px 2px 0px #4A2E2B',
                          padding: '2px 4px',
                        }}
                      />
                    </div>
                  ))}
                  <motion.button
                    onClick={applyCustom}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-1 py-1.5 font-cute text-[#4A2E2B] text-sm font-bold rounded-xl"
                    style={{
                      background: '#E9C46A',
                      border: '2px solid #4A2E2B',
                      boxShadow: '2px 2px 0px #4A2E2B',
                    }}
                  >
                    Apply ✓
                  </motion.button>
                </motion.div>
              )}

              {/* Mode indicator */}
              <div
                className="py-2 px-3 rounded-xl text-center"
                style={{ background: isFocus ? '#F4B5C6' : '#B5EAD7', border: '2px solid #4A2E2B', boxShadow: '2px 2px 0px #4A2E2B' }}
              >
                <p className="font-retro text-[#4A2E2B] text-[9px] tracking-widest">
                  {isFocus ? '⏳ FOCUSING — NEXT: BREAK' : '🍃 BREAK — NEXT: FOCUS'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimerModal;