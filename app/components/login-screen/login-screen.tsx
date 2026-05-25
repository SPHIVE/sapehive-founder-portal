import { motion } from "framer-motion";
import { IconLock } from "@tabler/icons-react";
import { Particles } from "~/components/particles/particles";
import styles from "./login-screen.module.css";

interface LoginScreenProps {
  onLogin: (password: string) => void;
  loginState: "idle" | "loading" | "error";
  errorMessage?: string;
}

export function LoginScreen({}: LoginScreenProps) {
  return (
    <div className={styles.container}>
      <Particles />

      {/* Ambient glows */}
      <div className={styles.glowTop} />
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {/* Logo */}
        <motion.div
          className={styles.logoWrap}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={styles.logoGlow} />
          <img
            src="/sapehive-logo.png"
            alt="Sapehive"
            className={styles.logoImg}
            draggable={false}
          />
        </motion.div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>SAPEHIVE</h1>
          <p className={styles.subtitle}>INTERNAL OPERATIONS PORTAL</p>
          <div className={styles.badge}>
            <IconLock size={10} />
            <span>AUTHORIZED MEMBERS ONLY</span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        <div style={{ marginTop: 24, textAlign: "center", color: "#d8d8d8" }}>
          <p style={{ margin: 0 }}>Login form removed.</p>
          <p style={{ margin: "12px 0 0", opacity: 0.8 }}>This screen no longer requires an access code.</p>
        </div>
      </motion.div>

      <motion.p
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        &copy; Sapehive Inc. &mdash; Confidential &amp; Proprietary
      </motion.p>
    </div>
  );
}
