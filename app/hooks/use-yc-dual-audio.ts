import { useState, useRef, useCallback, useEffect } from "react";

/**
 * TWO-TRACK YC AUDIO SYSTEM
 *
 * Alternates between exactly two tracks, looping forever.
 * 1-second gap between tracks.
 * Smooth fade in/out on play/pause and section enter/leave.
 *
 * To add your tracks:
 *   1. Drop .mp3 files into: public/assets/music/
 *   2. Files expected: yc-track-1.mp3  and  yc-track-2.mp3
 */

export const YC_TRACK_URLS = [
  "/assets/music/yc-track-1.mp3",
  "/assets/music/yc-track-2.mp3",
] as const;

const FADE_IN_MS = 2000;
const FADE_OUT_MS = 1400;
const FADE_STEP_MS = 40;
const GAP_BETWEEN_TRACKS_MS = 1000;
const TARGET_VOLUME = 0.72;

export interface DualAudioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  /** 0 or 1 — which track is currently playing */
  activeTrackIndex: number;
  volume: number;
}

export interface DualAudioControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
  /** Stop and destroy audio — call when leaving the YC section */
  destroy: () => void;
}

/**
 * Manages two HTML5 audio tracks that alternate in sequence.
 * Handles missing files, browser autoplay restrictions, and
 * smooth fade in / fade out transitions.
 */
export function useYcDualAudio(): DualAudioState & DualAudioControls {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(TARGET_VOLUME);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);
  const volumeRef = useRef(TARGET_VOLUME);
  const isDestroyedRef = useRef(false);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFade = useCallback(() => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const clearGap = useCallback(() => {
    if (gapTimerRef.current) {
      clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
  }, []);

  /** Fades audio in from 0 to current target volume */
  const fadeIn = useCallback(
    (audio: HTMLAudioElement, target: number) => {
      clearFade();
      audio.volume = 0;
      const steps = FADE_IN_MS / FADE_STEP_MS;
      const step = target / steps;
      fadeRef.current = setInterval(() => {
        if (!audioRef.current || isDestroyedRef.current) {
          clearFade();
          return;
        }
        const next = Math.min(audio.volume + step, target);
        audio.volume = next;
        if (next >= target) clearFade();
      }, FADE_STEP_MS);
    },
    [clearFade]
  );

  /** Fades audio out from current volume to 0, then calls onComplete */
  const fadeOut = useCallback(
    (audio: HTMLAudioElement, onComplete?: () => void) => {
      clearFade();
      const startVol = audio.volume;
      const steps = FADE_OUT_MS / FADE_STEP_MS;
      const step = startVol / steps;
      fadeRef.current = setInterval(() => {
        const next = Math.max(audio.volume - step, 0);
        audio.volume = next;
        if (next <= 0) {
          audio.pause();
          clearFade();
          onComplete?.();
        }
      }, FADE_STEP_MS);
    },
    [clearFade]
  );

  /** Loads and plays a specific track index */
  const loadAndPlay = useCallback(
    (index: number) => {
      if (isDestroyedRef.current) return;

      const url = YC_TRACK_URLS[index];
      currentIndexRef.current = index;
      setActiveTrackIndex(index);

      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }

      const audio = new Audio(url);
      audio.volume = 0;
      audio.preload = "auto";
      audioRef.current = audio;

      audio.onerror = () => {
        if (isDestroyedRef.current) return;
        setHasError(true);
        setIsLoading(false);
        setIsPlaying(false);
      };

      // When track ends, wait 1 second then play the other track
      audio.onended = () => {
        if (isDestroyedRef.current) return;
        const nextIndex = index === 0 ? 1 : 0;
        clearGap();
        gapTimerRef.current = setTimeout(() => {
          if (!isDestroyedRef.current) loadAndPlay(nextIndex);
        }, GAP_BETWEEN_TRACKS_MS);
      };

      setIsLoading(true);
      setHasError(false);

      audio
        .play()
        .then(() => {
          if (isDestroyedRef.current) {
            audio.pause();
            return;
          }
          setIsPlaying(true);
          setIsLoading(false);
          fadeIn(audio, volumeRef.current);
        })
        .catch(() => {
          if (isDestroyedRef.current) return;
          setHasError(true);
          setIsLoading(false);
          setIsPlaying(false);
        });
    },
    [clearGap, fadeIn]
  );

  const play = useCallback(() => {
    if (isDestroyedRef.current) {
      isDestroyedRef.current = false;
    }
    setHasError(false);
    loadAndPlay(currentIndexRef.current);
  }, [loadAndPlay]);

  const pause = useCallback(() => {
    clearGap();
    if (audioRef.current) {
      fadeOut(audioRef.current, () => {
        setIsPlaying(false);
      });
    }
  }, [clearGap, fadeOut]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const destroy = useCallback(() => {
    isDestroyedRef.current = true;
    clearFade();
    clearGap();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, [clearFade, clearGap]);

  // Cleanup on unmount
  useEffect(() => {
    isDestroyedRef.current = false;
    return () => {
      isDestroyedRef.current = true;
      clearFade();
      clearGap();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [clearFade, clearGap]);

  return {
    isPlaying,
    isLoading,
    hasError,
    activeTrackIndex,
    volume,
    play,
    pause,
    toggle,
    setVolume,
    destroy,
  };
}
