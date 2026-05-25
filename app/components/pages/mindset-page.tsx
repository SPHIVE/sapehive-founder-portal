import { motion } from "framer-motion";
import { GlassCard } from "~/components/glass-card/glass-card";
import { MOTIVATIONAL_QUOTES, STARTUP_PHILOSOPHY, WHY_WE_STARTED } from "~/data/portal-data";
import { containerVariants, itemVariants } from "~/utils/animation-variants";
import styles from "./mindset-page.module.css";

export function MindsetPage() {
  return (
    <motion.div
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className={styles.pageTitle}>🧠 Founder Mindset</h2>
        <p className={styles.pageSub}>The philosophy, conviction, and raw belief that drive us forward.</p>
      </motion.div>

      {/* Why We Started */}
      <motion.div variants={itemVariants}>
        <GlassCard glow className={styles.whyCard}>
          <p className={styles.whyLabel}>WHY WE STARTED</p>
          <p className={styles.whyText}>{WHY_WE_STARTED}</p>
        </GlassCard>
      </motion.div>

      {/* Philosophy */}
      <motion.div variants={itemVariants}>
        <p className={styles.sectionLabel}>STARTUP PHILOSOPHY</p>
        <div className={styles.philosophyGrid}>
          {STARTUP_PHILOSOPHY.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: "rgba(245,197,24,0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className={styles.philosophyCard}>
                <span className={styles.philosophyIndex}>0{i + 1}</span>
                <h3 className={styles.philosophyTitle}>{p.title}</h3>
                <p className={styles.philosophyBody}>{p.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quote Wall */}
      <motion.div variants={itemVariants}>
        <p className={styles.sectionLabel}>WORDS THAT MOVE US</p>
        <div className={styles.quotesGrid}>
          {MOTIVATIONAL_QUOTES.slice(0, 6).map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <GlassCard className={styles.quoteCard}>
                <div className={styles.quoteBar} />
                <p className={styles.quoteText}>“{q.text}”</p>
                <p className={styles.quoteAuthor}>— {q.author}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
