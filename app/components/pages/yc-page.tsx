import { motion } from "framer-motion";
import { IconCheck, IconArrowRight, IconTrophy, IconRocket } from "@tabler/icons-react";
import { GlassCard } from "~/components/glass-card/glass-card";
import { ProgressBar } from "~/components/progress-bar/progress-bar";
import { YC_MILESTONES, TEAM_GOALS } from "~/data/portal-data";
import { containerVariants, itemVariants } from "~/utils/animation-variants";
import styles from "./yc-page.module.css";

const MOTIVATION_WALL = [
  { emoji: "🔥", text: "We will get into YC." },
  { emoji: "🎯", text: "100 users before the application." },
  { emoji: "💰", text: "First revenue this month." },
  { emoji: "🚀", text: "Batch S25 or W26 — we're going in." },
  { emoji: "🥂", text: "Build something people love, deeply." },
  { emoji: "🌎", text: "Impact millions. Start with one." },
];

export function YcPage() {
  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>🚀 YC Dream Roadmap</h2>
        <p className={styles.pageSub}>From idea to the most prestigious startup accelerator on Earth.</p>
      </motion.div>

      {/* Milestone Road */}
      <motion.div variants={itemVariants}>
        <GlassCard glow className={styles.roadmapCard}>
          <div className={styles.roadmapTitle}>
            <IconRocket size={18} className={styles.roadmapIcon} />
            <span>The Journey to YC</span>
          </div>
          <div className={styles.milestones}>
            {YC_MILESTONES.map((m, i) => (
              <div key={m.id} className={styles.milestoneItem}>
                <div
                  className={`${styles.milestoneCircle} ${
                    m.completed ? styles.completed : m.current ? styles.current : styles.future
                  }`}
                >
                  {m.completed ? <IconCheck size={18} stroke={2.5} /> : <span>{m.icon}</span>}
                </div>
                <div className={styles.milestoneMeta}>
                  <p className={styles.milestoneLabel}>{m.label}</p>
                  <p className={styles.milestoneDesc}>{m.description}</p>
                </div>
                {i < YC_MILESTONES.length - 1 && (
                  <div className={`${styles.milestoneConnector} ${m.completed ? styles.connectorDone : ""}`}>
                    <IconArrowRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Progress Section */}
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

      {/* Motivation Wall */}
      <motion.div variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <IconTrophy size={16} className={styles.trophyIcon} />
          <span className={styles.sectionLabel}>MOTIVATION WALL</span>
        </div>
        <div className={styles.wallGrid}>
          {MOTIVATION_WALL.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ duration: 0.2 }}
            >
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
