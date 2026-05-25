import { useState, useRef, useCallback, useEffect } from "react";
import { MUSIC_TRACKS } from "~/data/portal-data";
import type { MusicMode } from "~/data/types";

const TRACK_DURATION = 180000; // 3 minutes
const FADE_DURATION = 1500; // 1.5s

export function useMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [mode, setMode] = useState<MusicMode>("default");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(
    (audio: HTMLAudioElement, targetVol: number) => {
      clearFade();
      audio.volume = 0;
      const step = targetVol / (FADE_DURATION / 50);
      fadeIntervalRef.current = setInterval(() => {
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
    (audio: HTMLAudioElement, onComplete: () => void) => {
      clearFade();
      const startVol = audio.volume;
      const step = startVol / (FADE_DURATION / 50);
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume - step <= 0) {
          audio.volume = 0;
          audio.pause();
          clearFade();
          onComplete();
        } else {
          audio.volume = Math.max(audio.volume - step, 0);
        }
      }, 50);
    },
    [clearFade]
  );

  const scheduleNextTrack = useCallback(() => {
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    trackTimerRef.current = setTimeout(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    }, TRACK_DURATION);
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.loop = false;
    }
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      fadeIn(audioRef.current!, volume);
      scheduleNextTrack();
    }).catch(() => {
      setIsPlaying(false);
    });
  }, [currentTrack.url, fadeIn, volume, scheduleNextTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      fadeOut(audioRef.current, () => {
        setIsPlaying(false);
      });
    }
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
  }, [fadeOut]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const nextTrack = useCallback(() => {
    if (audioRef.current) {
      fadeOut(audioRef.current, () => {
        setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
      });
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    }
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
  }, [fadeOut]);

  // When track index changes, reload audio and auto-play if was playing
  useEffect(() => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (wasPlaying) {
      const audio = new Audio(currentTrack.url);
      audioRef.current = audio;
      audio.play().then(() => {
        fadeIn(audio, volume);
        scheduleNextTrack();
      }).catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  const activateMode = useCallback((newMode: MusicMode) => {
    setMode(newMode);
    const modeMap: Record<MusicMode, number> = {
      default: 0,
      founder: 3,
      "deep-work": 2,
      vision: 1,
    };
    const targetIndex = modeMap[newMode];
    if (targetIndex !== currentTrackIndex) {
      if (audioRef.current && isPlaying) {
        fadeOut(audioRef.current, () => {
          setCurrentTrackIndex(targetIndex);
        });
      } else {
        setCurrentTrackIndex(targetIndex);
      }
    }
  }, [currentTrackIndex, isPlaying, fadeOut]);

  useEffect(() => {
    return () => {
      clearFade();
      if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearFade]);

  return {
    isPlaying,
    isMuted,
    volume,
    currentTrack,
    mode,
    togglePlay,
    toggleMute,
    changeVolume,
    nextTrack,
    activateMode,
  };
}
