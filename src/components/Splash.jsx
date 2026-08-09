import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import useStore from '../store/useStore';

const Splash = () => {
  const isEntered = useStore((s) => s.isEntered);
  const setEntered = useStore((s) => s.setEntered);

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ bottom: 'calc(-1 * env(safe-area-inset-bottom))' }}
        >
{/* ── Image Background ── */}
<div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
  <img
    src="/splash-bg.webp"
    alt="City Sunset Background"
    className="w-full h-full object-cover scale-[1.02]"
  />
</div>

          {/* ── Main Card (Extremely Compact) ── */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative z-10 w-[90%] max-w-[280px] flex flex-col items-center text-center py-5 px-4 rounded-[28px]"
            style={{
              background: '#FFFDF5',
              border: '3.5px solid #4A2E2B',
              boxShadow: '6px 6px 0px #4A2E2B',
            }}
          >
            {/* Top Badge */}
            <div
              className="mb-4 px-3 py-1 rounded-full flex items-center gap-2"
              style={{
                background: '#E9C46A',
                border: '2px solid #4A2E2B',
                boxShadow: '2px 2px 0px #4A2E2B',
              }}
            >
              
              <span className="font-cute text-[#4A2E2B] text-[9px] font-bold tracking-widest uppercase mt-0.5">
                Cloud Cassette
              </span>
            </div>

            {/* Mascot (Massive relative to the small box) */}
            <motion.img
              src="/favicon.webp"
              alt="Cloud Cassette Mascot"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[190px] h-auto mb-1.5 drop-shadow-sm"
              draggable={false}
            />
            <p className="font-retro text-[#4A2E2B] text-[9px] font-bold tracking-[0.25em] mb-3">
              LO-FI RADIO
            </p>

            {/* Titles */}
            <h1 className="font-cute text-[#4A2E2B] text-[26px] leading-none font-bold mb-1">
              Cloud Cassette
            </h1>
            <p className="font-comfy text-[#7A4E4A] text-[11px] mb-4">
              your cozy lo-fi radio station ✨
            </p>

            {/* Start Button */}
            <motion.button
              onClick={setEntered}
              whileHover={{ scale: 1.05, y: -2, boxShadow: '5px 5px 0px #4A2E2B' }}
              whileTap={{ scale: 0.95, y: 2, boxShadow: '1px 1px 0px #4A2E2B' }}
              className="w-full py-2.5 px-6 rounded-full flex justify-center items-center font-cute text-[#4A2E2B] text-xl font-bold transition-all mb-4"
              style={{
                background: 'linear-gradient(135deg, #F4B5C6 0%, #F8B088 100%)',
                border: '3px solid #4A2E2B',
                boxShadow: '4px 4px 0px #4A2E2B',
              }}
            >
              Press Start!
            </motion.button>

            {/* ── Bottom Info Section ── */}
            <div className="w-full flex flex-col items-center gap-2.5">
              
              {/* Keyboard Shortcuts (Dashed Box) */}
              <div 
                className="w-full py-2 px-1 flex flex-col items-center justify-center gap-1.5 rounded-2xl"
                style={{ border: '1.5px dashed #D6C9A8' }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-comfy text-[#A3857F] text-[9px] flex items-center gap-1">
                    <span className="font-sans font-bold text-[10px]">↑↓</span> switch stations
                  </span>
                  <span className="text-[#C5A882] text-[5px]">•</span>
                  <span className="font-comfy text-[#A3857F] text-[9px] flex items-center gap-1">
                    <span className="bg-[#F4B5C6] text-white rounded flex items-center justify-center" style={{ padding: '2px' }}>
                      <Play size={6} fill="currentColor" strokeWidth={1} />
                    </span>
                    Space play/pause
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-comfy text-[#A3857F] text-[9px] flex items-center gap-1">
                    <span className="border border-[#A3857F] rounded-[3px] px-[4px] py-[1px] font-sans font-bold text-[8px] leading-none">
                      H
                    </span>
                    hide UI
                  </span>
                </div>
              </div>

              {/* Soundwave Graphic */}
              <div className="flex items-center justify-center gap-[2px]">
                {[2, 3, 5, 3, 7, 10, 4, 8, 5, 3, 2].map((height, i) => (
                  <div
                    key={i}
                    className="w-[1.5px] rounded-full bg-[#F4B5C6] opacity-80"
                    style={{ height: `${height * 1.2}px` }}
                  />
                ))}
              </div>

              {/* Feature List */}
              <p className="font-comfy text-[#A3857F] text-[8.5px] tracking-wide">
                9 curated stations <span className="opacity-50 mx-0.5">•</span> ambient sounds <span className="opacity-50 mx-0.5">•</span> pomodoro timer
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splash;
