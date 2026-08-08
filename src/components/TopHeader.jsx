import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { STATIONS, getBadgeEmoji } from '../config/stations';

const TopHeader = () => {
  const stationIndex = useStore((s) => s.stationIndex);
  const uiVisible    = useStore((s) => s.uiVisible);
  const station      = STATIONS[stationIndex] ?? STATIONS[0];
  const emoji        = getBadgeEmoji(station.badge);

  return (
    <AnimatePresence>
      {uiVisible && (
        <motion.header
          key="top-header"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed top-0 left-0 right-0 z-50 px-3 py-3
                     flex items-start justify-between gap-2"
        >

          {/* ── Left: Cloud Cassette logo + station name ── */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{
              background: 'rgba(255,253,245,0.90)',
              backdropFilter: 'blur(14px)',
              border: '2.5px solid #4A2E2B',
              boxShadow: '3px 3px 0px #4A2E2B',
              maxWidth: 'calc(100vw - 32px)', /* never clips on any screen */
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>☁️</span>
            <div style={{ minWidth: 0 }}>
              {/* App sub-label — always shown */}
              <div
                className="font-retro text-[#4A2E2B] tracking-widest leading-none opacity-60"
                style={{ fontSize: 8 }}
              >
                CLOUD CASSETTE
              </div>

              {/*
               * Station name — animates when station changes.
               * We let it truncate naturally; the genre line is
               * hidden on small screens via md: breakpoint.
               */}
              <motion.div
                key={station.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="font-cute text-[#4A2E2B] font-bold leading-tight mt-0.5"
                style={{
                  fontSize: 13,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'clamp(130px, 40vw, 260px)',
                }}
              >
                {emoji} {station.name}
              </motion.div>

              {/* Genre — desktop only */}
              <p
                className="hidden md:block font-comfy text-[#7A4E4A] leading-tight mt-0.5"
                style={{ fontSize: 10 }}
              >
                {station.genre}
              </p>
            </div>
          </div>

          {/* ── Right: keyboard shortcut pills + progress dots (desktop only) ── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">

            {/* Keyboard shortcut chips */}
            {[
              { key: '↑↓', label: 'Station' },
              { key: '␣',  label: 'Play'    },
              { key: 'H',  label: 'Hide'    },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{
                  background: 'rgba(255,253,245,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #4A2E2B',
                  boxShadow: '2px 2px 0px #4A2E2B',
                }}
              >
                <kbd className="font-retro text-[9px] text-[#4A2E2B] leading-none">{key}</kbd>
                <span className="font-sans text-[9px] text-[#7A4E4A]">{label}</span>
              </div>
            ))}

            {/* Station progress dots (11 stations) */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,253,245,0.85)',
                backdropFilter: 'blur(10px)',
                border: '2px solid #4A2E2B',
                boxShadow: '2px 2px 0px #4A2E2B',
              }}
            >
              {STATIONS.map((s, i) => (
                <div
                  key={s.id}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  i === stationIndex ? 14 : 5,
                    height: 5,
                    background: i === stationIndex ? '#4A2E2B' : '#C5A882',
                  }}
                />
              ))}
            </div>
          </div>

        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default TopHeader;
