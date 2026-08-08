import { useEffect } from 'react';
import useStore from '../store/useStore';

/**
 * useKeyboard — Global keyboard shortcut handler.
 * Ignores hotkeys when focus is inside an input/textarea/select.
 */
const useKeyboard = () => {
  const nextStation = useStore((s) => s.nextStation);
  const prevStation = useStore((s) => s.prevStation);
  const togglePlay  = useStore((s) => s.togglePlay);
  const toggleUI    = useStore((s) => s.toggleUI);
  const isEntered   = useStore((s) => s.isEntered);

  useEffect(() => {
    if (!isEntered) return; // only after Splash dismissed

    const handler = (e) => {
      // Ignore if typing inside an input field
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault();
          nextStation();
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault();
          prevStation();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'h':
        case 'H':
          toggleUI();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEntered, nextStation, prevStation, togglePlay, toggleUI]);
};

export default useKeyboard;
