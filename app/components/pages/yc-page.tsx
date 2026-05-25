import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  IconCheck,
  IconArrowRight,
  IconTrophy,
  IconRocket,
  IconPlayerPlay,
  IconPlayerPause,
  IconMusic,
} from "@tabler/icons-react";
import { GlassCard } from "~/components/glass-card/glass-card";
import { ProgressBar } from "~/components/progress-bar/progress-bar";
import { YC_MILESTONES } from "~/data/portal-data";
import { containerVariants, itemVariants } from "~/utils/animation-variants";
import { useYcAudio } from "~/hooks/use-yc-audio";
import styles from "./yc-page.module.css";

const YC_AUDIO_URL =
  "https://cdn.pixabay.com/download/audio/2022/01/27/audio_d0c6ff1bca.mp3";

const MOTIVATION_WALL = [
  { emoji: "\uD83D\uDD25", text: "We will get into YC." },
  { emoji: "\uD83C\uDFAF", text: "100 users before the application." },
  { emoji: "\uD83D\uDCB0", text: "First revenue this month." },
  { emoji: "\uD83D\uDE80", text: "Batch S25 or W26 — we're going in." },
  { emoji: "\uD83E\uDD42", text: "Build something people love, deeply." },
  { emoji: "\uD83C\uDF0E", text: "Impact millions. Start with one." },
];

function Equalizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={styles.equalizer} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`${styles.eqBar} ${isPlaying ? styles.eqBarActive : ""}`}
          style={{ animationDelay: `${(i - 1) * 0.12}s` }}
        />
      ))}
    </div>
  );
}

export function YcPage() {
  const audio = useYcAudio(YC_AUDIO_URL);
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    if (!hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      const t = setTimeout(() => audio.play(), 800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      audio.stopAndDestroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.cinematicGlow} />
      <div className={styles.cinematicGlow2} />

      {/* Hero */}
      <motion.div variants={itemVariants} className={styles.heroSection}>
        <div className={styles.heroLogoRow}>
          <motion.div
            className={styles.heroLogoWrap}
            animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={styles.heroLogoGlow} />
            <img
              src="/sapehive-logo.png"
              alt="Sapehive"
              className={styles.heroLogoImg}
              draggable={false}
            />
          </motion.div>
          <div className={styles.heroLogoText}>
            <span className={styles.heroLogoName}>SAPEHIVE</span>
            <span className={styles.heroLogoBadge}>YC DREAM SECTION</span>
          </div>
        </div>

        <motion.h2
          className={styles.pageTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          The Y Combinator
          <span className={styles.titleAccent}> Journey</span>
        </motion.h2>

        <motion.p
          className={styles.pageSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          From idea to the most prestigious startup accelerator on Earth.
          <br />
          <span className={styles.pageSubAccent}>Built With Obsession.</span>
        </motion.p>

        <motion.div
          className={styles.musicController}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className={styles.musicLeft}>
            <IconMusic size={14} className={styles.musicIcon} />
            <span className={styles.musicLabel}>
              {audio.isLoading ? "Loading soundtrack\u2026" : "Founder Soundtrack"}
            </span>
            <Equalizer isPlaying={audio.isPlaying} />
          </div>
          <button
            className={styles.musicToggle}
            onClick={audio.toggle}
            disabled={audio.isLoading}
            aria-label={audio.isPlaying ? "Pause soundtrack" : "Play soundtrack"}
          >
            {audio.isPlaying ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
          </button>
        </motion.div>
      </motion.div>

      {/* Roadmap */}
      <motion.div variants={itemVariants}>
        <GlassCard glow className={styles.roadmapCard}>
          <div className={styles.roadmapTitle}>
            <IconRocket size={18} className={styles.roadmapIcon} />
            <span>The Journey to YC</span>
          </div>
          <div className={styles.milestones}>
            {YC_MILESTONES.map((m, i) => (
              <div key={m.id} className={styles.milestoneItem}>
                <motion.div
                  className={`${styles.milestoneCircle} ${
                    m.completed ? styles.completed : m.current ? styles.current : styles.future
                  }`}
                  whileHover={{ scale: 1.08 }}
                >
                  {m.completed ? <IconCheck size={18} stroke={2.5} /> : <span>{m.icon}</span>}
                </motion.div>
                <div className={styles.milestoneMeta}>
                  <p className={styles.milestoneLabel}>{m.label}</p>
                  <p className={styles.milestoneDesc}>{m.description}</p>
                </div>
                {i < YC_MILESTONES.length - 1 && (
                  <div
                    className={`${styles.milestoneConnector} ${
                      m.completed ? styles.connectorDone : ""
                    }`}
                  >
                    <IconArrowRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Progress */}
      <motion.div variants={itemVariants}>
        <GlassCard className={styles.progressCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>STARTUP MILESTONES</span>
          </div>
          <div className={styles.progressList}>
            <ProgressBar label="YC Application Readiness" value={71} />
            <ProgressBar label="MVP Completeness" value={88} color="success" />
            <ProgressBar label="User Acquisition Progress" value={48} color="info" />
            <ProgressBar label="Revenue Generation" value={18} />
            <ProgressBar label="Product-Market Fit Signal" value={35} color="success" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Built With Obsession banner */}
      <motion.div variants={itemVariants} className={styles.builtDifferentBanner}>
        <div className={styles.builtGlow} />
        <span className={styles.builtText}>Built With Obsession.</span>
        <span className={styles.builtSub}>Two founders. One mission. Zero doubt.</span>
      </motion.div>

      {/* Motivation Wall */}
      <motion.div variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <IconTrophy size={16} className={styles.trophyIcon} />
          <span className={styles.sectionLabel}>MOTIVATION WALL</span>
        </div>
        <div className={styles.wallGrid}>
          {MOTIVATION_WALL.map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03, y: -4 }} transition={{ duration: 0.2 }}>
              <GlassCard className={styles.wallCard}>
                <span className={styles.wallEmoji}>{item.emoji}</span>
                <p className={styles.wallText}>{item.text}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
