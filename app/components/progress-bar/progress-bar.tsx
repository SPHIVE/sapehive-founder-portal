import { motion } from "framer-motion";
import styles from "./progress-bar.module.css";

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "success" | "info";
}

export function ProgressBar({ value, label, showValue = true, color = "primary" }: ProgressBarProps) {
  return (
    <div className={styles.wrapper}>
      {(label || showValue) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{value}%</span>}
        </div>
      )}
      <div className={styles.track}>
        <motion.div
          className={`${styles.fill} ${styles[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
