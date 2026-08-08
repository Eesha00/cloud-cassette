import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { STATIONS } from '../config/stations';

/**
 * AudioEngine — Pure HTML5 Audio player.
 *
 * Architecture:
 *   • One persistent HTMLAudioElement (created on mount, lives until unmount).
 *   • Station changes: fade-pause → swap src → fade-in play.
 *   • No YouTube API. No fallback loops. No auto-skip.
 *   • All 11 stations served from /public/audio/tracks/*.mp3.
 *
 * Sync model:
 *   stationIndex → loads new src + plays (if isPlaying)
 *   isPlaying    → play or pause existing src
 *   volume       → adjust gain in real time
 */
const AudioEngine = () => {
  const stationIndex = useStore((s) => s.stationIndex);
  const isPlaying    = useStore((s) => s.isPlaying);
  const volume       = useStore((s) => s.volume);
  const isEntered    = useStore((s) => s.isEntered);
  const setGlitching = useStore((s) => s.setGlitching);

  // Single persistent audio element
  const audioRef = useRef(null);

  // Snapshot refs — readable inside async callbacks without stale closures
  const isPlayingRef = useRef(isPlaying);
  const volumeRef    = useRef(volume);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { volumeRef.current    = volume;    }, [volume]);

  // ── Create audio element once on mount ─────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.loop        = true;
    audio.preload     = 'auto';
    audio.volume      = volumeRef.current / 100;
    audioRef.current  = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Station change → swap track + glitch animation ─────────
  useEffect(() => {
    if (!isEntered || !audioRef.current) return;

    const audio   = audioRef.current;
    const station = STATIONS[stationIndex];
    if (!station?.audioSrc) return;

    // Pause immediately, trigger visual glitch
    audio.pause();
    setGlitching(true);

    const timer = setTimeout(() => {
      audio.src    = station.audioSrc;
      audio.volume = volumeRef.current / 100;
      audio.load();
      setGlitching(false);

      if (isPlayingRef.current) {
        audio.play().catch((err) => {
          console.warn(`[AudioEngine] Could not play "${station.audioSrc}":`, err.message);
        });
      }
    }, 750); // matches the glitch overlay duration in Background.jsx

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationIndex, isEntered]);

  // ── Initial play when user first enters ────────────────────
  useEffect(() => {
    if (!isEntered || !audioRef.current) return;
    const audio   = audioRef.current;
    const station = STATIONS[stationIndex];
    if (!station?.audioSrc || audio.src) return; // already set by station-change effect

    audio.src    = station.audioSrc;
    audio.volume = volumeRef.current / 100;
    audio.load();

    if (isPlayingRef.current) {
      audio.play().catch((err) => {
        console.warn('[AudioEngine] Initial play blocked:', err.message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEntered]);

  // ── Play / Pause sync ──────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isEntered) return;

    if (isPlaying) {
      // Ensure src is loaded before playing
      if (!audio.src || audio.src === window.location.href) {
        const station = STATIONS[stationIndex];
        if (station?.audioSrc) {
          audio.src = station.audioSrc;
          audio.load();
        }
      }
      audio.play().catch((err) => {
        console.warn('[AudioEngine] Play blocked (user gesture required?):', err.message);
      });
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isEntered]);

  // ── Volume sync (real-time, no restart) ───────────────────
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }, [volume]);

  // No DOM output needed — audio element is held in JS memory
  return null;
};

export default AudioEngine;
