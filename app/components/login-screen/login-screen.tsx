import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconLock, IconEye, IconEyeOff, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { Particles } from "~/components/particles/particles";
import styles from "./login-screen.module.css";

interface LoginScreenProps {
  onLogin: (password: string) => void;
  loginState: "idle" | "loading" | "error";
}

export function LoginScreen({ onLogin, loginState }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = loginState === "loading";
  const isError = loginState === "error";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;
    onLogin(password);
  };

  return (
    <div className={styles.container}>
      <Particles />

      {/* Ambient glows */}
      <div className={styles.glowTop} />
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <motion.div
        className={`${styles.card} ${isError ? styles.cardError : ""}`}
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: isError ? [-10, 10, -8, 8, -4, 4, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          x: isError ? { duration: 0.5, ease: "easeInOut" } : {},
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
            src="/sapehive-logo.svg"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.inputWrap} ${isError ? styles.inputWrapError : ""}`}>
            <div className={styles.inputIcon}>
              <IconLock size={15} />
            </div>
            <input
              ref={inputRef}
              type={showPassword ? "text" : "password"}
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              autoFocus
              autoComplete="new-password"
              disabled={isLoading}
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={styles.eyeBtn}
              aria-label="Toggle visibility"
              tabIndex={-1}
            >
              {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isError && (
              <motion.div
                className={styles.errorBanner}
                key="error"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
              >
                <IconAlertTriangle size={13} />
                <span>Access Restricted. Invalid credentials.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className={`${styles.submitBtn} ${isLoading ? styles.submitBtnLoading : ""}`}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.97 } : {}}
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <span className={styles.loadingRow}>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "flex" }}
                >
                  <IconLoader2 size={16} />
                </motion.span>
                <span>VERIFYING ACCESS…</span>
              </span>
            ) : (
              <span>ENTER PORTAL</span>
            )}
            <div className={styles.btnSheen} />
          </motion.button>
        </form>
      </motion.div>

      <motion.p
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        &copy; {new Date().getFullYear()} Sapehive Inc. &mdash; Confidential &amp; Proprietary
      </motion.p>
    </div>
  );
}
