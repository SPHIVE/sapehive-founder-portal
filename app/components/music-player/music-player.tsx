import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconVolume,
  IconVolumeOff,
  IconMusic,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import type { useMusicPlayer } from "~/hooks/use-music-player";
import styles from "./music-player.module.css";

type MusicPlayerHook = ReturnType<typeof useMusicPlayer>;

interface MusicPlayerProps {
  player: MusicPlayerHook;
}

function EqualizerBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={styles.equalizer}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={styles.eqBar}
          style={{
            animationDelay: `${i * 0.12}s`,
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}

export function MusicPlayer({ player }: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const { isPlaying, isMuted, volume, currentTrack, togglePlay, toggleMute, changeVolume, nextTrack } = player;

  return (
    <div className={styles.floatingPlayer}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.expandedPanel}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.trackInfo}>
              <EqualizerBars isPlaying={isPlaying} />
              <div>
                <p className={styles.trackName}>{currentTrack.title}</p>
                <p className={styles.trackMood}>{currentTrack.mood}</p>
              </div>
            </div>

            <div className={styles.volumeRow}>
              <button onClick={toggleMute} className={styles.iconBtn} aria-label="Toggle mute">
                {isMuted ? <IconVolumeOff size={14} /> : <IconVolume size={14} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className={styles.volumeSlider}
                aria-label="Volume"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.miniPlayer}>
        <button onClick={() => setExpanded((v) => !v)} className={styles.expandBtn} aria-label="Expand player">
          <IconMusic size={14} />
          {expanded ? <IconChevronDown size={12} /> : <IconChevronUp size={12} />}
        </button>
        <button onClick={togglePlay} className={styles.playBtn} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <IconPlayerPause size={16} stroke={1.5} /> : <IconPlayerPlay size={16} stroke={1.5} />}
        </button>
        <button onClick={nextTrack} className={styles.iconBtn} aria-label="Next track">
          <IconPlayerSkipForward size={14} stroke={1.5} />
        </button>
        {isPlaying && <EqualizerBars isPlaying={isPlaying} />}
      </div>
    </div>
  );
}
