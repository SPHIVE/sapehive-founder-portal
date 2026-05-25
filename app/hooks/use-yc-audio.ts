import { useState, useRef, useCallback, useEffect } from "react";

const FADE_DURATION = 1800;

export function useYcAudio(audioUrl: string | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearFade = useCallback(() => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(
    (audio: HTMLAudioElement, targetVol: number) => {
      clearFade();
      audio.volume = 0;
      const steps = FADE_DURATION / 50;
      const step = targetVol / steps;
      fadeRef.current = setInterval(() => {
        if (audio.volume + step >= targetVol) {
          audio.volume = targetVol;
          clearFade();
        } else {
          audio.volume = Math.min(audio.volume + step, targetVol);
        }
      }, 50);
    },
    [clearFade]
  );

  const fadeOut = useCallback(
    (audio: HTMLAudioElement, onComplete?: () => void) => {
      clearFade();
      const startVol = audio.volume;
      const steps = FADE_DURATION / 50;
      const step = startVol / steps;
      fadeRef.current = setInterval(() => {
        if (audio.volume - step <= 0) {
          audio.volume = 0;
          audio.pause();
          clearFade();
          onComplete?.();
        } else {
          audio.volume = Math.max(audio.volume - step, 0);
        }
      }, 50);
    },
    [clearFade]
  );

  const play = useCallback(() => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    }
    setIsLoading(true);
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
        fadeIn(audioRef.current!, 0.6);
      })
      .catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });
  }, [audioUrl, fadeIn]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      fadeOut(audioRef.current, () => setIsPlaying(false));
    }
  }, [fadeOut]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const stopAndDestroy = useCallback(() => {
    clearFade();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, [clearFade]);

  useEffect(() => {
    return () => {
      clearFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearFade]);

  return { isPlaying, isLoading, play, pause, toggle, stopAndDestroy };
}
