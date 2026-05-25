import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconLock, IconEye, IconEyeOff, IconHexagon } from "@tabler/icons-react";
import { Particles } from "~/components/particles/particles";
import styles from "./login-screen.module.css";

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <Particles />
      <div className={styles.bgGlow} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className={styles.logoWrap}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={styles.logoIcon}>
            <IconHexagon size={40} stroke={1.5} />
            <span className={styles.logoLetter}>S</span>
          </div>
        </motion.div>

        <div className={styles.header}>
          <h1 className={styles.title}>SAPEHIVE</h1>
          <p className={styles.subtitle}>INTERNAL PORTAL</p>
          <div className={styles.badge}>
            <IconLock size={11} />
            <span>AUTHORIZED MEMBERS ONLY</span>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.form}
        >
          <div className={styles.inputWrap}>
            <div className={styles.inputIcon}>
              <IconLock size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              autoFocus
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={styles.eyeBtn}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className={styles.errorMsg}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Access denied. Invalid credentials.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>ENTER PORTAL</span>
            <div className={styles.btnGlow} />
          </motion.button>
        </motion.form>

        <p className={styles.hint}>Hint: sapehive2025</p>
      </motion.div>

      <p className={styles.footer}>
        &copy; {new Date().getFullYear()} Sapehive Inc. &mdash; Confidential &amp; Proprietary
      </p>
    </div>
  );
}
