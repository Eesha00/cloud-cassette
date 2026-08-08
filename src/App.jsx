import React from 'react';
import { AnimatePresence } from 'framer-motion';
import useStore from './store/useStore';
import useKeyboard from './hooks/useKeyboard';

import Background    from './components/Background';
import AudioEngine   from './components/AudioEngine';
import Splash        from './components/Splash';
import TopHeader     from './components/TopHeader';
import BottomDock    from './components/BottomDock';
import StationsModal from './components/modals/StationsModal';
import AmbientModal  from './components/modals/AmbientModal';
import TimerModal    from './components/modals/TimerModal';

const App = () => {
  const isEntered = useStore((s) => s.isEntered);

  // Register global keyboard shortcuts
  useKeyboard();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* ── Full-screen video + CRT effects ── */}
      <Background />

      {/* ── Hidden YouTube audio engine ── */}
      <AudioEngine />

      {/* ── Splash overlay ── */}
      <AnimatePresence>
        {!isEntered && <Splash key="splash" />}
      </AnimatePresence>

      {/* ── Main UI (only after splash) ── */}
      <AnimatePresence>
        {isEntered && (
          <>
            <TopHeader />
            <BottomDock />

            {/* Modals */}
            <StationsModal />
            <AmbientModal />
            <TimerModal />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
