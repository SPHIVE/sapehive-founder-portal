import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconVolume,
  IconVolumeOff,
  IconMusic,
} from "@tabler/icons-react";
import type { MusicMode } from "~/data/types";
import type { AmbientTrack } from "~/hooks/use-music-player";
import styles from "./music-player.module.css";

interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: AmbientTrack;
  mode: MusicMode;
  togglePlay: () => void;
  toggleMute: () => void;
  changeVolume: (v: number) => void;
  nextTrack: () => void;
  activateMode: (mode: MusicMode) => void;
}

interface MusicPlayerProps {
  player: PlayerState;
  className?: string;
}

/**
 * Ambient floating music player displayed in the portal layout.
 * Separate from the YC-section cinematic player.
 */
export function MusicPlayer({ player, className }: MusicPlayerProps) {
  return (
    <div className={`${styles.player} ${className ?? ""}`}>
      <div className={styles.trackInfo}>
        <IconMusic size={12} className={styles.musicIcon} />
        <span className={styles.trackName}>
          {player.isPlaying ? player.currentTrack.title : "Ambient Player"}
        </span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.controlBtn}
          onClick={player.togglePlay}
          aria-label={player.isPlaying ? "Pause" : "Play"}
        >
          {player.isPlaying ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
        </button>

        <button
          className={styles.controlBtn}
          onClick={player.nextTrack}
          aria-label="Next track"
        >
          <IconPlayerSkipForward size={14} />
        </button>

        <button
          className={styles.controlBtn}
          onClick={player.toggleMute}
          aria-label={player.isMuted ? "Unmute" : "Mute"}
        >
          {player.isMuted ? <IconVolumeOff size={14} /> : <IconVolume size={14} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={player.volume}
          onChange={(e) => player.changeVolume(parseFloat(e.target.value))}
          className={styles.volumeSlider}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
