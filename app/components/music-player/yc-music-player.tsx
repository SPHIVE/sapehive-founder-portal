import { useCallback } from "react";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconMusic,
  IconVolume,
  IconVolume3,
  IconAlertTriangle,
} from "@tabler/icons-react";
import type { AudioState, AudioControls } from "~/hooks/use-yc-audio";
import type { MusicTrack } from "~/data/portal-data";
import styles from "./yc-music-player.module.css";

interface EqualizerProps {
  isPlaying: boolean;
}

function Equalizer({ isPlaying }: EqualizerProps) {
  return (
    <div className={styles.equalizer} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`${styles.eqBar} ${isPlaying ? styles.eqBarActive : ""}`}
          style={{ animationDelay: `${(i - 1) * 0.13}s` }}
        />
      ))}
    </div>
  );
}

interface MusicPlayerProps {
  tracks: MusicTrack[];
  audio: AudioState & AudioControls;
  /** Auto-play this track ID on mount if provided */
  autoPlayTrackId?: string;
  className?: string;
}

/**
 * Premium cinematic music player for the YC section.
 * Gracefully handles missing files, shows error states,
 * and supports track switching + volume control.
 */
export function MusicPlayer({ tracks, audio, className }: MusicPlayerProps) {
  const currentTrack = tracks.find((t) => t.id === audio.currentTrackId) ?? tracks[0];

  const handleToggle = useCallback(
    (track: MusicTrack) => {
      audio.toggle(track.url, track.id);
    },
    [audio]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      audio.setVolume(parseFloat(e.target.value));
    },
    [audio]
  );

  const isActiveTrack = (track: MusicTrack) =>
    audio.currentTrackId === track.id && (audio.isPlaying || audio.isLoading);

  return (
    <div className={`${styles.player} ${className ?? ""}`}>
      {/* Track list */}
      <div className={styles.trackList}>
        {tracks.map((track) => {
          const active = isActiveTrack(track);
          const unavailable = track.url === null;
          return (
            <button
              key={track.id}
              className={`${styles.trackBtn} ${active ? styles.trackBtnActive : ""} ${
                unavailable ? styles.trackBtnUnavailable : ""
              }`}
              onClick={() => handleToggle(track)}
              disabled={unavailable || audio.isLoading}
              title={unavailable ? "File not yet added — drop .mp3 in public/assets/music/" : undefined}
            >
              <div className={styles.trackInfo}>
                <span className={styles.trackTitle}>{track.title}</span>
                <span className={styles.trackMood}>
                  {unavailable ? "Coming Soon" : track.mood}
                </span>
              </div>
              <div className={styles.trackAction}>
                {active && audio.isLoading ? (
                  <span className={styles.loadingDot} aria-label="Loading" />
                ) : active ? (
                  <>
                    <Equalizer isPlaying={audio.isPlaying} />
                    <IconPlayerPause size={14} className={styles.trackIcon} />
                  </>
                ) : (
                  <IconPlayerPlay
                    size={14}
                    className={`${styles.trackIcon} ${unavailable ? styles.trackIconMuted : ""}`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Player bar */}
      <div className={styles.playerBar}>
        <div className={styles.nowPlaying}>
          <IconMusic size={13} className={styles.musicIcon} />
          <div className={styles.nowPlayingText}>
            {audio.hasError ? (
              <span className={styles.errorLabel}>
                <IconAlertTriangle size={11} />
                File not found — add .mp3 to public/assets/music/
              </span>
            ) : (
              <>
                <span className={styles.nowTitle}>
                  {audio.isLoading
                    ? "Loading\u2026"
                    : audio.isPlaying
                    ? currentTrack?.title ?? "Soundtrack"
                    : "Select a track"}
                </span>
                <span className={styles.nowMood}>
                  {audio.isPlaying && !audio.isLoading
                    ? currentTrack?.mood
                    : "Founder Soundtrack"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Volume control */}
        <div className={styles.volumeRow}>
          <IconVolume3 size={13} className={styles.volIcon} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audio.volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            aria-label="Volume"
          />
          <IconVolume size={13} className={styles.volIcon} />
        </div>
      </div>
    </div>
  );
}
