import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
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
    /* fixed inset-0 anchors to hardware screen corners on mobile —
       most reliable full-bleed strategy regardless of URL-bar state */
    <div className="fixed top-0 left-0 w-full overflow-hidden bg-[#4A2E2B] font-sans h-[calc(100dvh+env(safe-area-inset-bottom))]">
      {/* ── Full-screen video + CRT effects ── */}
      <Background />

      {/* ── Hidden Local Audio Engine ── */}
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

      {/* ── Vercel Analytics (Invisible) ── */}
      <Analytics />
    </div>
  );
};

export default App;