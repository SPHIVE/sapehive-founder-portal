import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolume3,
  IconAlertTriangle,
  IconMusic,
} from "@tabler/icons-react";
import type { DualAudioState, DualAudioControls } from "~/hooks/use-yc-dual-audio";
import styles from "./yc-dual-player.module.css";

const TRACK_NAMES = ["YC Theme", "Founder Mode"] as const;

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
          style={{ animationDelay: `${(i - 1) * 0.11}s` }}
        />
      ))}
    </div>
  );
}

interface YcDualPlayerProps {
  audio: DualAudioState & DualAudioControls;
  className?: string;
}

/**
 * Compact premium music controller for the YC section.
 * Shows current track, play/pause, equalizer, and volume.
 */
export function YcDualPlayer({ audio, className }: YcDualPlayerProps) {
  const trackName = TRACK_NAMES[audio.activeTrackIndex] ?? TRACK_NAMES[0];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.setVolume(parseFloat(e.target.value));
  };

  return (
    <div className={`${styles.player} ${className ?? ""}`}>
      {/* Left: icon + now playing */}
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          <IconMusic size={15} className={styles.musicIcon} />
        </div>
        <div className={styles.trackInfo}>
          {audio.hasError ? (
            <span className={styles.errorLabel}>
              <IconAlertTriangle size={12} />
              Add yc-track-1.mp3 &amp; yc-track-2.mp3 to public/assets/music/
            </span>
          ) : (
            <>
              <span className={styles.trackName}>
                {audio.isLoading ? "Loading\u2026" : trackName}
              </span>
              <span className={styles.trackSub}>
                {audio.isPlaying
                  ? `Track ${audio.activeTrackIndex + 1} of 2 — Alternating Loop`
                  : "Founder Soundtrack — Two Track System"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center: equalizer (only when playing) */}
      {audio.isPlaying && !audio.isLoading && (
        <div className={styles.center}>
          <Equalizer isPlaying={audio.isPlaying} />
        </div>
      )}

      {/* Right: play/pause + volume */}
      <div className={styles.right}>
        <div className={styles.volumeRow}>
          <IconVolume3 size={12} className={styles.volIcon} />
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
          <IconVolume size={12} className={styles.volIcon} />
        </div>

        <button
          className={`${styles.playBtn} ${
            audio.isPlaying ? styles.playBtnActive : ""
          }`}
          onClick={audio.toggle}
          disabled={audio.isLoading}
          aria-label={audio.isPlaying ? "Pause" : "Play"}
        >
          {audio.isLoading ? (
            <span className={styles.loadingDot} />
          ) : audio.isPlaying ? (
            <IconPlayerPause size={16} />
          ) : (
            <IconPlayerPlay size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
