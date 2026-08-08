import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import useStore from '../../store/useStore';

// Local track definitions with exact paths matching your /public/audio/ambient/ directory
const AMBIENT_TRACK_CONFIG = [
  { id: 'rain', label: 'Rain', emoji: '🌧️', src: '/audio/ambient/rain.mp3' },
  { id: 'crickets', label: 'Crickets', emoji: '🦗', src: '/audio/ambient/crickets.mp3' },
  { id: 'fire', label: 'Fireplace', emoji: '🔥', src: '/audio/ambient/fire.mp3' },
];

const TRACK_COLORS = {
  rain: '#A8D8EA',
  crickets: '#98B682',
  fire: '#F8B088',
};

const AmbientModal = () => {
  const activeModal    = useStore((s) => s.activeModal);
  const ambientVolumes = useStore((s) => s.ambientVolumes);
  const ambientMuted   = useStore((s) => s.ambientMuted);
  const setModal       = useStore((s) => s.setModal);
  const setAmbientVol  = useStore((s) => s.setAmbientVolume);
  const toggleMute     = useStore((s) => s.toggleAmbientMute);

  const isOpen    = activeModal === 'ambient';
  const audioRefs = useRef({});

  // Initialize persistent HTML5 Audio instances for each ambient channel
  useEffect(() => {
    AMBIENT_TRACK_CONFIG.forEach((track) => {
      if (!audioRefs.current[track.id]) {
        const audio = new Audio(track.src);
        audio.loop   = true;
        audio.volume = 0;
        audioRefs.current[track.id] = audio;
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach((a) => {
        a.pause();
      });
    };
  }, []);

  // Sync volume slider and mute state directly to local audio instances
  useEffect(() => {
    AMBIENT_TRACK_CONFIG.forEach((track) => {
      const audio = audioRefs.current[track.id];
      if (!audio) return;
      
      const rawVol = ambientVolumes[track.id] ?? 0;
      const isMuted = ambientMuted[track.id] ?? false;
      const vol = isMuted ? 0 : rawVol / 100;
      
      audio.volume = vol;

      if (vol > 0) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });
  }, [ambientVolumes, ambientMuted]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ambient-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(74,46,43,0.30)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModal(null)}
        >
          <motion.div
            key="ambient-card"
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="w-full max-h-[85vh] overflow-y-auto cozy-scroll"
            style={{
              maxWidth: 360,
              background: '#FFFDF5',
              border: '3px solid #4A2E2B',
              borderRadius: 24,
              boxShadow: '6px 6px 0px #4A2E2B',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-cute text-[#4A2E2B] text-xl font-bold">🎛️ Ambient Mix</h2>
                  <p className="font-comfy text-[#7A4E4A] text-xs mt-0.5">Layer background sounds</p>
                </div>
                <motion.button
                  onClick={() => setModal(null)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center rounded-full text-[#4A2E2B]"
                  style={{
                    width: 34,
                    height: 34,
                    background: '#F5EDD5',
                    border: '2.5px solid #4A2E2B',
                    boxShadow: '2px 2px 0px #4A2E2B',
                  }}
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Ambient Track Sliders */}
              <div className="space-y-5">
                {AMBIENT_TRACK_CONFIG.map((track) => {
                  const vol      = ambientVolumes[track.id] ?? 0;
                  const muted    = ambientMuted[track.id] ?? false;
                  const isActive = !muted && vol > 0;
                  const tColor   = TRACK_COLORS[track.id] ?? '#E9C46A';

                  return (
                    <div key={track.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-8 h-8 flex items-center justify-center text-lg rounded-full"
                            style={{
                              background: tColor,
                              border: '2px solid #4A2E2B',
                              boxShadow: '2px 2px 0px #4A2E2B',
                            }}
                          >
                            {track.emoji}
                          </span>
                          <span className="font-cute text-[#4A2E2B] text-sm font-bold">{track.label}</span>
                          {isActive && (
                            <motion.div
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                              className="w-2 h-2 rounded-full"
                              style={{ background: '#4A2E2B' }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-retro text-[#7A4E4A] text-[10px] w-7 text-right">
                            {muted ? '—' : vol}
                          </span>
                          <motion.button
                            id={`ambient-mute-${track.id}`}
                            onClick={() => toggleMute(track.id)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex items-center justify-center rounded-full text-[#4A2E2B]"
                            style={{
                              width: 30,
                              height: 30,
                              background: muted ? '#F5EDD5' : tColor,
                              border: '2px solid #4A2E2B',
                              boxShadow: '2px 2px 0px #4A2E2B',
                            }}
                          >
                            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          </motion.button>
                        </div>
                      </div>

                      {/* Clean Single Track Slider */}
                      <div className="relative flex items-center">
                        <input
                          id={`ambient-slider-${track.id}`}
                          type="range"
                          min={0}
                          max={100}
                          value={vol}
                          onChange={(e) => setAmbientVol(track.id, Number(e.target.value))}
                          disabled={muted}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#EFE3C3] border border-[#4A2E2B]"
                          style={{
                            accentColor: tColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Note */}
              <div
                className="mt-5 py-2 px-3 rounded-xl text-center"
                style={{ background: '#F5EDD5', border: '1.5px dashed #C5A882' }}
              >
                <p className="font-comfy text-[#7A4E4A] text-[10px]">
                  Layers independently over your music ✨
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AmbientModal;