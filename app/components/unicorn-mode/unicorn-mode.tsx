import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import styles from "./unicorn-mode.module.css";

interface UnicornModeProps {
  onClose: () => void;
}

export function UnicornMode({ onClose }: UnicornModeProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handler = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handler();
    window.addEventListener("resize", handler);
    const timer = setTimeout(onClose, 7000);
    return () => {
      window.removeEventListener("resize", handler);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          colors={["#f5c518", "#ffd700", "#f59e0b", "#ffffff", "#3b82f6"]}
          numberOfPieces={200}
          gravity={0.15}
        />

        <motion.div
          className={styles.content}
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className={styles.unicornEmoji}
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🦄
          </motion.div>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Sapehive
          </motion.h1>

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Built Different.
          </motion.p>

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            The next unicorn is being built right now, right here.
          </motion.p>

          <motion.div
            className={styles.glowRing}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
