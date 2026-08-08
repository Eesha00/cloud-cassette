import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';
import { STATIONS, getBadgeEmoji } from '../../config/stations';

/* Pastel accent cycling across 11 stations */
const CARD_ACCENTS = [
  '#A8D8EA', '#C3B1E1', '#F8B088', '#E88D72', '#FFB7B2',
  '#98B682', '#C3B1E1', '#F4B5C6', '#E9C46A', '#B5EAD7', '#F8B088',
];

const StationsModal = () => {
  const activeModal  = useStore((s) => s.activeModal);
  const stationIndex = useStore((s) => s.stationIndex);
  const setModal     = useStore((s) => s.setModal);
  const setStation   = useStore((s) => s.setStation);

  const isOpen = activeModal === 'stations';

  const handleSelect = (i) => {
    setStation(i);
    setModal(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="stations-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(74,46,43,0.28)', backdropFilter: 'blur(3px)' }}
          />

          {/* ── Right Sidebar Drawer ── */}
          <motion.aside
            key="stations-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 h-full z-[70] flex flex-col"
            style={{
              /* On mobile, leave 56px on the right for the vertical action rail.
                 On md+ the rail is gone so we can go full width. */
              width: 'min(340px, calc(100vw - 60px))',
              background: '#FFFDF5',
              borderLeft: '4px solid #4A2E2B',
              boxShadow: '-6px 0px 0px rgba(74,46,43,0.18)',
              overflowY: 'hidden',
            }}
          >
            {/* ── Sticky Header ── */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '3px solid #4A2E2B', background: '#FFF8EC' }}
            >
              <div>
                <h2 className="font-cute text-[#4A2E2B] text-xl font-bold leading-tight">
                  📻 Stations
                </h2>
                <p className="font-comfy text-[#7A4E4A] text-xs mt-0.5">Pick your vibe</p>
              </div>
              <motion.button
                onClick={() => setModal(null)}
                whileHover={{ y: -1, boxShadow: '3px 3px 0px #4A2E2B' }}
                whileTap={{ y: 1 }}
                className="flex items-center justify-center rounded-full shrink-0 text-[#4A2E2B]"
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

            {/* ── Scrollable Station List ── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 cozy-scroll">
              {STATIONS.map((station, i) => {
                const isActive = i === stationIndex;
                const accent   = CARD_ACCENTS[i % CARD_ACCENTS.length];
                const emoji    = getBadgeEmoji(station.badge);

                return (
                  <motion.button
                    key={station.id}
                    id={`station-card-${station.id}`}
                    onClick={() => handleSelect(i)}
                    whileHover={{
                      x: 3,
                      boxShadow: isActive ? '5px 5px 0px #4A2E2B' : '4px 4px 0px #C5A882',
                    }}
                    whileTap={{ x: 1 }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-150"
                    style={{
                      background: isActive ? accent : '#F5EDD5',
                      border: isActive ? '2.5px solid #4A2E2B' : '2px solid #D6C9A8',
                      boxShadow: isActive ? '4px 4px 0px #4A2E2B' : '2px 2px 0px #C5A882',
                    }}
                  >
                    {/* Emoji thumbnail */}
                    <div
                      className="flex items-center justify-center text-xl shrink-0"
                      style={{
                        width: 42, height: 42,
                        background: isActive ? 'rgba(255,253,245,0.6)' : accent,
                        border: '2px solid #4A2E2B',
                        borderRadius: 12,
                        boxShadow: '2px 2px 0px #4A2E2B',
                      }}
                    >
                      {emoji}
                    </div>

                    {/* Station info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-cute text-[#4A2E2B] text-sm font-bold leading-tight truncate">
                        {station.name}
                      </p>
                      {/* Badge full text (e.g. "🌧️ Rainy Beats") */}
                      <span
                        className="inline-block font-retro text-[8px] tracking-wider px-1.5 py-0.5 rounded-full mt-1"
                        style={{
                          background: isActive ? 'rgba(74,46,43,0.12)' : accent,
                          border: '1.5px solid #4A2E2B',
                          color: '#4A2E2B',
                        }}
                      >
                        {station.genre}
                      </span>
                    </div>

                    {/* Active pip */}
                    {isActive && (
                      <motion.div
                        layoutId="active-station-pip"
                        className="shrink-0 rounded-full"
                        style={{ width: 10, height: 10, background: '#4A2E2B' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div
              className="shrink-0 px-5 py-3 text-center"
              style={{ borderTop: '2px dashed #D6C9A8' }}
            >
              <p className="font-comfy text-[#C5A882] text-[10px]">
                {STATIONS.length} stations · lo-fi forever ✨
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default StationsModal;
