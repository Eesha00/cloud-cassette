import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

// Floating pixel decorations — positioned around the card
const PIXEL_DECORATIONS = [
  { char: '✦', top: '8%',  left: '6%',  size: 22, color: '#4A2E2B', delay: 0,    dur: 3.2 },
  { char: '☁',  top: '12%', right: '8%', size: 28, color: '#F4B5C6', delay: 0.5, dur: 4.0 },
  { char: '✨', top: '22%', left: '12%', size: 18, color: '#E9C46A', delay: 1.0, dur: 2.8 },
  { char: '✦', top: '18%', right: '14%',size: 14, color: '#98B682', delay: 0.3, dur: 3.5 },
  { char: '☁',  top: '72%', left: '8%',  size: 24, color: '#C3B1E1', delay: 0.7, dur: 4.2 },
  { char: '✨', top: '78%', right: '6%', size: 20, color: '#F8B088', delay: 0.2, dur: 3.0 },
  { char: '✦', top: '65%', left: '16%', size: 12, color: '#F4B5C6', delay: 1.2, dur: 2.6 },
  { char: '☁',  top: '82%', right: '18%',size: 16, color: '#4A2E2B', delay: 0.9, dur: 3.8 },
];

const Splash = () => {
  const setEntered = useStore((s) => s.setEntered);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #DCE5B2 0%, #FAF8ED 55%, #F4D4C4 100%)' }}
    >
      {/* ── Pixel Art Floating Decorations ── */}
      {PIXEL_DECORATIONS.map((d, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -8, 0], rotate: [0, d.char === '✦' ? 15 : 0, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none select-none"
          style={{
            top:   d.top,
            left:  d.left,
            right: d.right,
            fontSize: d.size,
            color: d.color,
            opacity: 0.55,
            fontFamily: 'system-ui',
          }}
        >
          {d.char}
        </motion.div>
      ))}

      {/* Corner dots */}
      {['top-5 left-5', 'top-5 right-5', 'bottom-5 left-5', 'bottom-5 right-5'].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} w-2.5 h-2.5 rounded-full`}
          style={{ background: '#4A2E2B', opacity: 0.18 }}
        />
      ))}

      {/* ── Main Card ── */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 flex flex-col items-center px-8 py-10 text-center mb-8"
        style={{
          background: '#FFFDF5',
          border: '4px solid #4A2E2B',
          borderRadius: 32,
          boxShadow: '8px 8px 0px #4A2E2B',
          maxWidth: 370,
          width: 'calc(100% - 3rem)',
        }}
      >
        {/* Badge */}
        <div
          className="mb-6 px-4 py-1 font-retro text-[10px] tracking-widest text-[#4A2E2B]"
          style={{
            background: '#E9C46A',
            border: '2px solid #4A2E2B',
            borderRadius: 9999,
            boxShadow: '2px 2px 0px #4A2E2B',
          }}
        >
          ☁️ CLOUD CASSETTE
        </div>

        {/* Cassette illustration */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6"
        >
          <div
            className="relative w-52 h-28 mx-auto"
            style={{
              background: 'linear-gradient(135deg, #FFFDF5 0%, #F5EDD5 100%)',
              border: '3px solid #4A2E2B',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #4A2E2B',
            }}
          >
            {/* Label */}
            <div
              className="absolute left-4 right-4 top-3 bottom-3 rounded-lg flex flex-col items-center justify-center gap-0.5"
              style={{ background: '#F4B5C6', border: '2px solid #4A2E2B' }}
            >
              <div className="font-cute text-[#4A2E2B] text-sm font-bold leading-tight">Lo-Fi Radio</div>
              <div className="font-retro text-[#4A2E2B] text-[7px] tracking-wider opacity-70">SIDE A ▶</div>
            </div>

            {/* Spools */}
            {[-1, 1].map((side) => (
              <motion.div
                key={side}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{
                  width: 22, height: 22,
                  bottom: 14,
                  [side === -1 ? 'left' : 'right']: 22,
                  border: '2px solid #4A2E2B',
                  borderRadius: '50%',
                  background: '#E9C46A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#4A2E2B]" />
              </motion.div>
            ))}

            {/* Corner holes */}
            {[-1, 1].map((side) => (
              <div
                key={side}
                className="absolute top-2.5"
                style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: '#4A2E2B',
                  [side === -1 ? 'left' : 'right']: 10,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="font-cute text-[#4A2E2B] text-3xl md:text-4xl font-bold mb-1 leading-tight">
          Cloud Cassette
        </h1>
        <p className="font-comfy text-[#7A4E4A] text-sm mb-8">
          Your cozy lo-fi radio station ✨
        </p>

        {/* CTA Button */}
        <motion.button
          id="splash-start-btn"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 250 }}
          whileHover={{ y: -2, boxShadow: '6px 6px 0px #4A2E2B' }}
          whileTap={{ y: 2, boxShadow: '2px 2px 0px #4A2E2B' }}
          onClick={setEntered}
          className="font-cute text-[#4A2E2B] text-lg font-bold px-10 py-3.5 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #F4B5C6 0%, #F8B088 100%)',
            border: '3px solid #4A2E2B',
            borderRadius: 9999,
            boxShadow: '4px 4px 0px #4A2E2B',
          }}
        >
          🎧 Press Start!
        </motion.button>

        {/* Keyboard hint */}
        <p className="font-sans text-[#7A4E4A] text-xs mt-5 opacity-55">
          ↑↓ switch stations · Space play/pause · H hide UI
        </p>
      </motion.div>

      {/* Bottom metadata strip — clear of card shadow thanks to mb-8 above */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-5 font-retro text-[#4A2E2B] text-[8px] tracking-widest opacity-28 text-center px-4"
      >
        ♪ 10 CURATED STATIONS · AMBIENT SOUNDS · POMODORO TIMER ♪
      </motion.div>
    </motion.div>
  );
};

export default Splash;
