import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { STATIONS } from '../config/stations';

// Warm gradient shown while video loads or if video fails
const BG_FALLBACKS = {
  'raining-on-street': 'linear-gradient(135deg, #B8CEDC 0%, #8AAFC0 100%)',
  'avatar-sky':        'linear-gradient(135deg, #C3B1E1 0%, #8090BC 100%)',
  'misty-church':      'linear-gradient(135deg, #D4B8B0 0%, #B08078 100%)',
  'cyber-city':        'linear-gradient(135deg, #C0B8DC 0%, #9080C0 100%)',
  'green-scenery':     'linear-gradient(135deg, #C4D4B0 0%, #98BC80 100%)',
  'char-gaming':       'linear-gradient(135deg, #F4C8D4 0%, #E8A0B8 100%)',
  'messy-room':        'linear-gradient(135deg, #F5EDD5 0%, #E9C46A 100%)',
  'snowy-temple':      'linear-gradient(135deg, #D8ECF0 0%, #A8C8D0 100%)',
  'lakeside-cabin':    'linear-gradient(135deg, #D4C4B0 0%, #C0A080 100%)',
};

const Background = () => {
  const stationIndex = useStore((s) => s.stationIndex);
  const isGlitching  = useStore((s) => s.isGlitching);
  const station      = STATIONS[stationIndex] ?? STATIONS[0];

  // Determine MIME type from extension
  const mimeType = station.videoBg?.endsWith('.webm') ? 'video/webm' : 'video/mp4';
  
  // Dynamically generate the poster path based on the video source
  // CORRECT (Matches your screenshot exactly)
  const posterPath = station.videoBg?.replace(/\.(webm|mp4)$/, '-poster.webp');

  return (
    <div
      className="fixed top-0 left-0 right-0 z-0 overflow-hidden"
      style={{ bottom: 'calc(-1 * env(safe-area-inset-bottom))' }}
    >

      {/* ── Warm gradient fallback (always visible beneath video) ── */}
      <div
        className="absolute inset-0 transition-all duration-[1200ms]"
        style={{ background: BG_FALLBACKS[station.id] ?? BG_FALLBACKS['raining-on-street'] }}
      />

      {/* ── Video background with cross-fade + mobileFocal ── */}
      <AnimatePresence mode="wait">
        <motion.video
          key={station.id}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterPath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 1,
            /**
             * objectPosition applies the station's mobileFocal everywhere.
             * For the rain station this frames the character at 20% left.
             * On wider screens the extra horizontal canvas is visible anyway.
             */
            objectPosition: station.mobileFocal ?? '50% 50%',
          }}
        >
          <source src={station.videoBg} type={mimeType} />
          {/* MP4 fallback (some older mobile browsers) */}
          {station.videoBg?.endsWith('.webm') && (
            <source src={station.videoBg.replace('.webm', '.mp4')} type="video/mp4" />
          )}
        </motion.video>
      </AnimatePresence>

      {/* ── Bottom gradient — dock readability ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background: 'linear-gradient(to top, rgba(74,46,43,0.62) 0%, rgba(74,46,43,0.20) 28%, transparent 55%)',
        }}
      />

      {/* ── Top gradient — header readability ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(74,46,43,0.52) 0%, transparent 32%)',
        }}
      />

      {/* ── Warm corner vignette ── */}
      <div
        className="absolute inset-0 warm-vignette pointer-events-none"
        style={{ zIndex: 11 }}
      />

      {/* ── Film grain ── */}
      <div className="film-grain" style={{ zIndex: 12 }} />

      {/* ── Tuning / Glitch overlay ── */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            key="cozy-glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none glitch-overlay"
            style={{ zIndex: 50 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(74,46,43,0.05) 4px, rgba(74,46,43,0.05) 5px)',
              }}
            />
            <div className="relative text-center space-y-3 px-8">
              <motion.div
                animate={{ x: [0, -3, 3, -2, 2, 0] }}
                transition={{ duration: 0.35, repeat: Infinity }}
                className="font-timer text-[#4A2E2B] text-4xl md:text-5xl tracking-widest"
                style={{ textShadow: '2px 0 #F4B5C6, -2px 0 #98B682' }}
              >
                [ TUNING... ]
              </motion.div>
              <div className="flex items-center justify-center gap-1.5 dot-loader">
                <span /><span /><span />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Background;