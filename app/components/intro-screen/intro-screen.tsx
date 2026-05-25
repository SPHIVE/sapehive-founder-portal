import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "~/components/particles/particles";
import styles from "./intro-screen.module.css";

const INTRO_SEEN_KEY = "sapehive_intro_seen";

const LINES = [
  { text: "Congratulations.", delay: 0.2 },
  { text: "Welcome To The Insides Of Sapehive.", delay: 1.4 },
  { text: "Welcome To Our Future Goal.", delay: 2.8 },
  { text: "Authorized Members Only.", delay: 4.2 },
  { text: "Built With Obsession.", delay: 5.6, accent: true },
];

const TOTAL_DURATION_MS = 8200;

interface IntroScreenProps {
  onComplete: () => void;
}

/**
 * Cinematic one-time welcome intro shown before the login screen.
 * Skipped on subsequent sessions via sessionStorage.
 */
export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<"lines" | "exit">("lines");

  useEffect(() => {
    const exit = setTimeout(() => setPhase("exit"), TOTAL_DURATION_MS);
    const done = setTimeout(() => onComplete(), TOTAL_DURATION_MS + 900);
    return () => {
      clearTimeout(exit);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.div
      className={styles.container}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <Particles />

      {/* Ambient radial layers */}
      <div className={styles.glowCenter} />
      <div className={styles.glowBottom} />
      <div className={styles.scanLine} />

      {/* Logo */}
      <motion.div
        className={styles.logoWrap}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.logoGlow} />
        <motion.div
          className={styles.logoRing}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <img
          src="/sapehive-logo.png"
          alt="Sapehive"
          className={styles.logoImg}
          draggable={false}
        />
      </motion.div>

      {/* Text lines */}
      <div className={styles.textBlock}>
        {LINES.map((line, i) => (
          <motion.div
            key={i}
            className={`${styles.line} ${line.accent ? styles.lineAccent : ""}`}
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: line.delay,
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>

      {/* Skip button */}
      <motion.button
        className={styles.skipBtn}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        onClick={() => {
          setPhase("exit");
          setTimeout(onComplete, 900);
        }}
        whileHover={{ opacity: 1 }}
      >
        SKIP INTRO
      </motion.button>

      {/* System ID watermark */}
      <motion.div
        className={styles.systemId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        SYS.ID — SAPEHIVE.INTERNAL.v2 — RESTRICTED ACCESS
      </motion.div>
    </motion.div>
  );
}

/** Returns true if the intro has already been seen this session */
export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
}

/** Marks the intro as seen for the current session */
export function markIntroSeen(): void {
  sessionStorage.setItem(INTRO_SEEN_KEY, "1");
}
