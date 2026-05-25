import { motion } from "framer-motion";
import {
  IconLayoutDashboard,
  IconNotes,
  IconRocket,
  IconSpeakerphone,
  IconTarget,
  IconBrain,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import type { AppPage } from "~/data/types";
import styles from "./sidebar.module.css";

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { page: AppPage; label: string; icon: React.ReactNode; badge?: string }[] = [
  { page: "dashboard", label: "Dashboard", icon: <IconLayoutDashboard size={18} stroke={1.5} /> },
  { page: "notes", label: "Secret Notes", icon: <IconNotes size={18} stroke={1.5} /> },
  { page: "yc", label: "YC Roadmap", icon: <IconRocket size={18} stroke={1.5} />, badge: "🚀" },
  { page: "announcements", label: "Announcements", icon: <IconSpeakerphone size={18} stroke={1.5} /> },
  { page: "goals", label: "Team Goals", icon: <IconTarget size={18} stroke={1.5} /> },
  { page: "mindset", label: "Founder Mindset", icon: <IconBrain size={18} stroke={1.5} /> },
];

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <div className={styles.logoWrap}>
          <div className={styles.logoGlow} />
          <img src="/sapehive-logo.svg" alt="Sapehive" className={styles.logoImg} draggable={false} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>SAPEHIVE</span>
          <span className={styles.logoTagline}>Internal Portal</span>
        </div>
      </div>

      <div className={styles.sectionLabel}>NAVIGATION</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`${styles.navItem} ${currentPage === item.page ? styles.navActive : ""}`}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            {currentPage === item.page && (
              <motion.div className={styles.navIndicator} layoutId="nav-indicator" />
            )}
            {currentPage === item.page && <IconChevronRight size={14} className={styles.navChevron} />}
          </motion.button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          <span>SYSTEM ACTIVE</span>
        </div>
        <button onClick={onLogout} className={styles.logoutBtn}>
          <IconLogout size={16} stroke={1.5} />
          <span>Secure Exit</span>
        </button>
      </div>
    </aside>
  );
}
