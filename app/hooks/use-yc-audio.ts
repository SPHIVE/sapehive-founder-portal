import { useState, useRef, useCallback, useEffect } from "react";

const FADE_DURATION_MS = 1800;
const FADE_STEP_MS = 50;

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  volume: number;
  currentTrackId: string | null;
}

export interface AudioControls {
  play: (url: string | null, trackId: string) => void;
  pause: () => void;
  toggle: (url: string | null, trackId: string) => void;
  setVolume: (v: number) => void;
  stopAndDestroy: () => void;
}

/**
 * Manages a single HTML5 audio element with fade in/out, volume control,
 * and graceful handling of missing or unavailable audio files.
 */
export function useYcAudio(): AudioState & AudioControls {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetVolRef = useRef(0.6);

  const clearFade = useCallback(() => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(
    (audio: HTMLAudioElement) => {
      clearFade();
      audio.volume = 0;
      const target = targetVolRef.current;
      const steps = FADE_DURATION_MS / FADE_STEP_MS;
      const step = target / steps;
      fadeRef.current = setInterval(() => {
        const next = Math.min(audio.volume + step, target);
        audio.volume = next;
        if (next >= target) clearFade();
      }, FADE_STEP_MS);
    },
    [clearFade]
  );

  const fadeOut = useCallback(
    (audio: HTMLAudioElement, onComplete?: () => void) => {
      clearFade();
      const startVol = audio.volume;
      const steps = FADE_DURATION_MS / FADE_STEP_MS;
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

  const destroyAudio = useCallback(() => {
    clearFade();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, [clearFade]);

  const play = useCallback(
    (url: string | null, trackId: string) => {
      // If no URL configured yet, show error state gracefully
      if (!url) {
        setHasError(true);
        setIsPlaying(false);
        return;
      }

      // If same track already playing, do nothing
      if (isPlaying && currentTrackId === trackId && audioRef.current) return;

      // Destroy previous audio if switching tracks
      if (audioRef.current && currentTrackId !== trackId) {
        destroyAudio();
      }

      setHasError(false);
      setIsLoading(true);
      setCurrentTrackId(trackId);

      if (!audioRef.current) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;
      }

      const audio = audioRef.current;

      const onError = () => {
        // File not found or unavailable — fail gracefully
        setHasError(true);
        setIsLoading(false);
        setIsPlaying(false);
        setCurrentTrackId(null);
        destroyAudio();
      };

      audio.onerror = onError;

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          fadeIn(audio);
        })
        .catch(() => {
          // Browser blocked autoplay or file not found
          onError();
        });
    },
    [isPlaying, currentTrackId, destroyAudio, fadeIn]
  );

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      fadeOut(audioRef.current, () => setIsPlaying(false));
    }
  }, [fadeOut, isPlaying]);

  const toggle = useCallback(
    (url: string | null, trackId: string) => {
      if (isPlaying && currentTrackId === trackId) pause();
      else play(url, trackId);
    },
    [isPlaying, currentTrackId, pause, play]
  );

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      targetVolRef.current = clamped;
      setVolumeState(clamped);
      if (audioRef.current) {
        audioRef.current.volume = clamped;
      }
    },
    []
  );

  const stopAndDestroy = useCallback(() => {
    destroyAudio();
    setIsPlaying(false);
    setIsLoading(false);
    setHasError(false);
    setCurrentTrackId(null);
  }, [destroyAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearFade]);

  return {
    isPlaying,
    isLoading,
    hasError,
    volume,
    currentTrackId,
    play,
    pause,
    toggle,
    setVolume,
    stopAndDestroy,
  };
}
