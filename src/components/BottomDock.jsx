import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward,
  Music2, Wind, Timer, Eye, EyeOff, Volume2,
} from 'lucide-react';
import useStore from '../store/useStore';
import { STATIONS, getBadgeEmoji } from '../config/stations';

const ACCENT_COLORS = [
  '#A8D8EA', '#C3B1E1', '#F8B088', '#E88D72', '#FFB7B2',
  '#98B682', '#C3B1E1', '#F4B5C6', '#E9C46A', '#B5EAD7', '#F8B088',
];

/* ── JS-based responsive hook ───────────────────────────────────
   We use window.innerWidth instead of Tailwind md:hidden because
   AnimatePresence needs to know at render-time whether to mount
   the mobile components, so CSS-only toggling causes duplicates.
   ──────────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [breakpoint]);
  return isMobile;
}

/* ── Spinning Vinyl ─────────────────────────────────────────── */
const VinylSticker = ({ isSpinning, color, size = 34 }) => (
  <motion.div
    animate={{ rotate: isSpinning ? 360 : 0 }}
    transition={isSpinning
      ? { duration: 3.5, repeat: Infinity, ease: 'linear' }
      : { duration: 0.5 }}
    style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}
  >
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4A2E2B' }} />
    <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: color ?? '#F4B5C6' }} />
    <div style={{ position: 'absolute', inset: Math.round(size * 0.26), borderRadius: '50%', background: '#4A2E2B' }} />
    <div style={{ position: 'absolute', inset: Math.round(size * 0.41), borderRadius: '50%', background: '#FFFDF5' }} />
  </motion.div>
);

/* ── Icon action button ─────────────────────────────────────── */
const IconBtn = ({ onClick, active, title, color, size = 32, children }) => (
  <motion.button
    onClick={onClick}
    title={title}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.88 }}
    style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
      background: active ? (color ?? '#F4B5C6') : '#F5EDD5',
      border: '2px solid #4A2E2B',
      boxShadow: '2px 2px 0px #4A2E2B',
      color: '#4A2E2B',
    }}
  >
    {children}
  </motion.button>
);

/* ── Skip button ────────────────────────────────────────────── */
const SkipBtn = ({ onClick, title, children, size = 30 }) => (
  <motion.button
    onClick={onClick} title={title}
    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
    style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
      background: '#F5EDD5',
      border: '2px solid #4A2E2B',
      boxShadow: '2px 2px 0px #4A2E2B',
      color: '#4A2E2B',
    }}
  >
    {children}
  </motion.button>
);

/* ── Play / Pause ───────────────────────────────────────────── */
const PlayPauseBtn = ({ isPlaying, togglePlay, color, iconSize = 18, size = 44 }) => (
  <motion.button
    onClick={togglePlay}
    whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.91 }}
    title={isPlaying ? 'Pause' : 'Play'}
    style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
      background: `linear-gradient(135deg, ${color} 0%, #F8B088 100%)`,
      border: '2.5px solid #4A2E2B',
      boxShadow: '3px 3px 0px #4A2E2B',
      color: '#4A2E2B',
    }}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isPlaying ? 'pa' : 'pl'}
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.1 }}
      >
        {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

/* ── Shared pill background style ───────────────────────────── */
const pill = {
  background: 'rgba(255,253,245,0.96)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '2.5px solid #4A2E2B',
  borderRadius: 9999,
  boxShadow: '4px 4px 0px #4A2E2B',
};

/* ════════════════════════════════════════════════════════════
   BOTTOM DOCK
   ════════════════════════════════════════════════════════════ */
const BottomDock = () => {
  const stationIndex = useStore((s) => s.stationIndex);
  const isPlaying    = useStore((s) => s.isPlaying);
  const uiVisible    = useStore((s) => s.uiVisible);
  const activeModal  = useStore((s) => s.activeModal);
  const volume       = useStore((s) => s.volume);
  const nextStation  = useStore((s) => s.nextStation);
  const prevStation  = useStore((s) => s.prevStation);
  const togglePlay   = useStore((s) => s.togglePlay);
  const toggleUI     = useStore((s) => s.toggleUI);
  const setModal     = useStore((s) => s.setModal);
  const setVolume    = useStore((s) => s.setVolume);

  const isMobile = useIsMobile(768); // true when < 768px
  const station  = STATIONS[stationIndex] ?? STATIONS[0];
  const emoji    = getBadgeEmoji(station.badge);
  const color    = ACCENT_COLORS[stationIndex % ACCENT_COLORS.length];

  /* Action buttons — rendered once in rail (mobile) or dock (desktop) */
  const actionButtons = [
    { id: 'stations', icon: <Music2 size={15} />, title: 'Stations',       active: activeModal === 'stations', onClick: () => setModal(activeModal === 'stations' ? null : 'stations') },
    { id: 'ambient',  icon: <Wind   size={15} />, title: 'Ambient Sounds', active: activeModal === 'ambient',  onClick: () => setModal(activeModal === 'ambient'  ? null : 'ambient')  },
    { id: 'timer',    icon: <Timer  size={15} />, title: 'Pomodoro Timer', active: activeModal === 'timer',    onClick: () => setModal(activeModal === 'timer'    ? null : 'timer')    },
    { id: 'hide',     icon: <EyeOff size={15} />, title: 'Hide UI (H)',    active: false,                      onClick: toggleUI },
  ];

  return (
    <>
      {/* ── Always-visible restore eye ───────────────────────── */}
      <AnimatePresence>
        {!uiVisible && (
          <motion.button
            key="restore-eye"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={toggleUI}
            title="Show UI"
            style={{
              position: 'fixed', top: 16, right: 16, zIndex: 200,
              width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', cursor: 'pointer',
              background: 'rgba(255,253,245,0.95)',
              border: '2.5px solid #4A2E2B',
              boxShadow: '3px 3px 0px #4A2E2B',
              color: '#4A2E2B',
            }}
          >
            <Eye size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════
          MOBILE LAYOUT  (isMobile = viewport < 768px)
          ════════════════════════════════════════════════════════ */}
      {isMobile && (
        <>
          {/* ── Right vertical action rail ─────────────────── */}
          <AnimatePresence>
            {uiVisible && (
              <motion.div
                key="mobile-rail"
                /*
                 * framer-motion owns ALL transforms.
                 * y:'-50%' composes with the x slide animation.
                 * NEVER put centering in CSS transform when FM is active.
                 */
                initial={{ x: 80,  y: '-50%', opacity: 0 }}
                animate={{ x: 0,   y: '-50%', opacity: 1 }}
                exit={{   x: 80,  y: '-50%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                style={{
                  position: 'fixed', right: 10, top: '50%', zIndex: 50,
                  display: 'flex', flexDirection: 'column', gap: 10, padding: 10,
                  background: 'rgba(255,253,245,0.96)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '2.5px solid #4A2E2B',
                  borderRadius: 20,
                  boxShadow: '4px 4px 0px #4A2E2B',
                }}
              >
                {actionButtons.map((btn) => (
                  <IconBtn key={btn.id} onClick={btn.onClick} active={btn.active}
                    title={btn.title} color={color} size={38}>
                    {btn.icon}
                  </IconBtn>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bottom compact playback dock ────────────────── */}
          <AnimatePresence>
            {uiVisible && (
              <motion.div
                key="mobile-dock"
                initial={{ x: '-50%', y: 90, opacity: 0 }}
                animate={{ x: '-50%', y: 0,  opacity: 1 }}
                exit={{   x: '-50%', y: 90, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  position: 'fixed', bottom: 14, left: '50%', zIndex: 50,
                  /*
                   * Leave 58px on the right for the action rail.
                   * Cap at 400px so it never becomes too wide.
                   */
                  width: 'min(calc(100vw - 62px), 400px)',
                }}
              >
                <div style={{
                  ...pill,
                  display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px',
                }}>
                  {/* Spinning vinyl */}
                  <VinylSticker isSpinning={isPlaying} color={color} size={28} />

                  {/* Transport controls */}
                  <SkipBtn onClick={prevStation} title="Previous" size={28}>
                    <SkipBack size={12} />
                  </SkipBtn>

                  <PlayPauseBtn
                    isPlaying={isPlaying} togglePlay={togglePlay}
                    color={color} iconSize={15} size={36}
                  />

                  <SkipBtn onClick={nextStation} title="Next" size={28}>
                    <SkipForward size={12} />
                  </SkipBtn>

                  {/*
                   * Volume slider — takes remaining space.
                   * On very narrow phones (< ~340px) the slider
                   * will compress but controls always stay visible.
                   */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    flex: '1 1 0%', minWidth: 0, overflow: 'hidden',
                  }}>
                    <Volume2 size={11} style={{ color: '#7A4E4A', flexShrink: 0 }} />
                    <input
                      type="range"
                      min={0} max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      style={{
                        width: '100%', minWidth: 0,
                        '--thumb-color': color,
                      }}
                      title="Volume"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ════════════════════════════════════════════════════════
          DESKTOP UNIFIED DOCK  (viewport ≥ 768px)
          Contains BOTH transport + action buttons in one pill.
          The right rail is NOT rendered at all on desktop.
          ════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <AnimatePresence>
          {uiVisible && (
            <motion.div
              key="desktop-dock"
              initial={{ x: '-50%', y: 100, opacity: 0 }}
              animate={{ x: '-50%', y: 0,   opacity: 1 }}
              exit={{   x: '-50%', y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{
                position: 'fixed', bottom: 24, left: '50%', zIndex: 50,
                width: 'min(760px, calc(100vw - 48px))',
              }}
            >
              <div style={{
                ...pill,
                border: '3px solid #4A2E2B',
                boxShadow: '5px 5px 0px #4A2E2B',
                display: 'flex', alignItems: 'center',
                gap: 8, padding: '10px 16px',
              }}>

                {/* Vinyl + Station info */}
                <VinylSticker isSpinning={isPlaying} color={color} size={34} />
                <div style={{ flex: '1 1 0%', minWidth: 0, marginRight: 4 }}>
                  <motion.p
                    key={station.id}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      color: '#4A2E2B', fontSize: 13, fontWeight: 700, lineHeight: 1.2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {emoji} {station.name}
                  </motion.p>
                  <p style={{
                    fontFamily: "'Comfortaa', cursive",
                    color: '#7A4E4A', fontSize: 10, marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {station.genre}
                  </p>
                </div>

                {/* Transport */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <SkipBtn onClick={prevStation} title="Previous station" size={30}>
                    <SkipBack size={13} />
                  </SkipBtn>
                  <PlayPauseBtn
                    isPlaying={isPlaying} togglePlay={togglePlay}
                    color={color} iconSize={19} size={46}
                  />
                  <SkipBtn onClick={nextStation} title="Next station" size={30}>
                    <SkipForward size={13} />
                  </SkipBtn>
                </div>

                {/* Volume */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Volume2 size={12} style={{ color: '#7A4E4A', flexShrink: 0 }} />
                  <input
                    id="master-volume"
                    type="range" min={0} max={100} value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    style={{ width: 72, '--thumb-color': color }}
                    title="Volume"
                  />
                </div>

                {/* Divider */}
                <div style={{
                  width: 1, alignSelf: 'stretch',
                  background: '#D6C9A8', margin: '0 4px', flexShrink: 0,
                }} />

                {/* Action buttons — ONLY here on desktop, not duplicated in a rail */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {actionButtons.map((btn) => (
                    <IconBtn key={btn.id} onClick={btn.onClick} active={btn.active}
                      title={btn.title} color={color} size={32}>
                      {btn.icon}
                    </IconBtn>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default BottomDock;
