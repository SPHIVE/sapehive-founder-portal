import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconQuote, IconStar, IconFlame, IconTrendingUp, IconUsers, IconDiamond } from "@tabler/icons-react";
import { GlassCard } from "~/components/glass-card/glass-card";
import { MOTIVATIONAL_QUOTES, VISION_STATEMENT, MISSION_STATEMENT } from "~/data/portal-data";
import { containerVariants, itemVariants } from "~/utils/animation-variants";
import type { MusicMode } from "~/data/types";
import type { useMusicPlayer } from "~/hooks/use-music-player";
import styles from "./dashboard-page.module.css";

type PlayerHook = ReturnType<typeof useMusicPlayer>;

interface DashboardPageProps {
  onUnicornMode: () => void;
  player: PlayerHook;
}

const STATS = [
  { label: "Days Building", value: "127", icon: <IconFlame size={20} stroke={1.5} />, color: "#f5c518" },
  { label: "Beta Users", value: "48", icon: <IconUsers size={20} stroke={1.5} />, color: "#3b82f6" },
  { label: "YC Readiness", value: "71%", icon: <IconTrendingUp size={20} stroke={1.5} />, color: "#22c55e" },
  { label: "Conviction", value: "∞", icon: <IconDiamond size={20} stroke={1.5} />, color: "#a855f7" },
];

const MODES: { mode: MusicMode; label: string; icon: string; desc: string }[] = [
  { mode: "founder", label: "Founder Mode", icon: "🔥", desc: "Cinematic energy" },
  { mode: "deep-work", label: "Deep Work Mode", icon: "🧠", desc: "Pure focus" },
  { mode: "vision", label: "Vision Mode", icon: "✨", desc: "Emotional soundtrack" },
];

export function DashboardPage({ onUnicornMode, player }: DashboardPageProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className={styles.welcomeHeader}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, <span className={styles.accent}>Founder</span>
          </h1>
          <p className={styles.welcomeSub}>
            The mission continues. Every line of code, every decision, every day.
          </p>
        </div>
        <motion.button
          className={styles.easterEggBtn}
          onClick={onUnicornMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Future Unicorn Mode"
        >
          <IconStar size={14} />
          <span>Future Unicorn</span>
        </motion.button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className={styles.statsGrid}>
        {STATS.map((stat) => (
          <GlassCard key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Vision Statement */}
        <motion.div variants={itemVariants}>
          <GlassCard glow className={styles.visionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot} />
              <span className={styles.cardLabel}>COMPANY VISION</span>
            </div>
            <blockquote className={styles.visionText}>{VISION_STATEMENT}</blockquote>
          </GlassCard>
        </motion.div>

        {/* Mission */}
        <motion.div variants={itemVariants}>
          <GlassCard className={styles.missionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot} style={{ background: "#3b82f6" }} />
              <span className={styles.cardLabel}>MISSION</span>
            </div>
            <p className={styles.missionText}>{MISSION_STATEMENT}</p>
          </GlassCard>
        </motion.div>

        {/* Quote Rotator */}
        <motion.div variants={itemVariants}>
          <GlassCard className={styles.quoteCard}>
            <div className={styles.cardHeader}>
              <IconQuote size={16} className={styles.quoteIcon} />
              <span className={styles.cardLabel}>DAILY FUEL</span>
            </div>
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={styles.quoteContent}
            >
              <p className={styles.quoteText}>“{quote.text}”</p>
              <p className={styles.quoteAuthor}>— {quote.author}</p>
            </motion.div>
            <div className={styles.quoteDots}>
              {MOTIVATIONAL_QUOTES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.quoteDot} ${i === quoteIndex ? styles.quoteDotActive : ""}`}
                  onClick={() => setQuoteIndex(i)}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Mode Buttons */}
        <motion.div variants={itemVariants}>
          <GlassCard className={styles.modesCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDot} style={{ background: "#a855f7" }} />
              <span className={styles.cardLabel}>ACTIVATE MODE</span>
            </div>
            <div className={styles.modesList}>
              {MODES.map((m) => (
                <motion.button
                  key={m.mode}
                  className={`${styles.modeBtn} ${player.mode === m.mode ? styles.modeBtnActive : ""}`}
                  onClick={() => player.activateMode(m.mode)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className={styles.modeEmoji}>{m.icon}</span>
                  <div>
                    <div className={styles.modeName}>{m.label}</div>
                    <div className={styles.modeDesc}>{m.desc}</div>
                  </div>
                  {player.mode === m.mode && <div className={styles.modeActive} />}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
