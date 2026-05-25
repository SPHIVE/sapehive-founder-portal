import { motion } from "framer-motion";
import { GlassCard } from "~/components/glass-card/glass-card";
import { ProgressBar } from "~/components/progress-bar/progress-bar";
import { TEAM_GOALS } from "~/data/portal-data";
import { containerVariants, itemVariants } from "~/utils/animation-variants";
import styles from "./goals-page.module.css";

const SECTIONS = [
  { key: "weekly" as const, label: "📅 Weekly Goals", goals: TEAM_GOALS.weekly, color: "primary" as const },
  { key: "monthly" as const, label: "📆 Monthly Goals", goals: TEAM_GOALS.monthly, color: "success" as const },
  { key: "longterm" as const, label: "🌌 Long-Term Mission", goals: TEAM_GOALS.longterm, color: "info" as const },
];

export function GoalsPage() {
  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className={styles.pageTitle}>🎯 Team Goals</h2>
        <p className={styles.pageSub}>Track our collective ambition — weekly, monthly, and into the future.</p>
      </motion.div>

      <div className={styles.grid}>
        {SECTIONS.map((section) => (
          <motion.div key={section.key} variants={itemVariants}>
            <GlassCard className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>{section.label}</h3>
              <div className={styles.goalsList}>
                {section.goals.map((goal) => (
                  <div key={goal.id} className={styles.goalItem}>
                    <ProgressBar
                      label={goal.text}
                      value={goal.progress}
                      color={section.color}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <GlassCard glow className={styles.missionCard}>
          <p className={styles.missionLabel}>THE NORTH STAR</p>
          <blockquote className={styles.missionText}>
            Build the intelligence layer that powers the next generation of legendary teams —
            and get there before anyone else does.
          </blockquote>
          <div className={styles.missionStats}>
            <div className={styles.missionStat}>
              <span className={styles.missionStatValue}>🦄 $1B+</span>
              <span className={styles.missionStatLabel}>Target Valuation</span>
            </div>
            <div className={styles.missionDivider} />
            <div className={styles.missionStat}>
              <span className={styles.missionStatValue}>🌎 10M+</span>
              <span className={styles.missionStatLabel}>Teams Empowered</span>
            </div>
            <div className={styles.missionDivider} />
            <div className={styles.missionStat}>
              <span className={styles.missionStatValue}>🚀 YC</span>
              <span className={styles.missionStatLabel}>Next Step</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
