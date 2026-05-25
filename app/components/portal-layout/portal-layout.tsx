import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "~/components/sidebar/sidebar";
import { Particles } from "~/components/particles/particles";
import { MusicPlayer } from "~/components/music-player/music-player";
import { UnicornMode } from "~/components/unicorn-mode/unicorn-mode";
import { DashboardPage } from "~/components/pages/dashboard-page";
import { NotesPage } from "~/components/pages/notes-page";
import { YcPage } from "~/components/pages/yc-page";
import { AnnouncementsPage } from "~/components/pages/announcements-page";
import { GoalsPage } from "~/components/pages/goals-page";
import { MindsetPage } from "~/components/pages/mindset-page";
import { useNotes } from "~/hooks/use-notes";
import { useAnnouncements } from "~/hooks/use-announcements";
import { useMusicPlayer } from "~/hooks/use-music-player";
import { pageTransition } from "~/utils/animation-variants";
import type { AppPage } from "~/data/types";
import styles from "./portal-layout.module.css";

interface PortalLayoutProps {
  onLogout: () => void;
}

export function PortalLayout({ onLogout }: PortalLayoutProps) {
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");
  const [showUnicorn, setShowUnicorn] = useState(false);

  const notes = useNotes();
  const announcements = useAnnouncements();
  const player = useMusicPlayer();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onUnicornMode={() => setShowUnicorn(true)} player={player} />;
      case "notes":
        return (
          <NotesPage
            notes={notes.notes}
            addNote={notes.addNote}
            updateNote={notes.updateNote}
            deleteNote={notes.deleteNote}
            togglePin={notes.togglePin}
          />
        );
      case "yc":
        return <YcPage />;
      case "announcements":
        return (
          <AnnouncementsPage
            announcements={announcements.announcements}
            addAnnouncement={announcements.addAnnouncement}
            togglePin={announcements.togglePin}
            deleteAnnouncement={announcements.deleteAnnouncement}
          />
        );
      case "goals":
        return <GoalsPage />;
      case "mindset":
        return <MindsetPage />;
    }
  };

  return (
    <div className={`${styles.layout} ${player.mode === "deep-work" ? styles.deepWork : ""}`}>
      <Particles />

      <div className={styles.bgGlows}>
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />
      </div>

      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={onLogout} />

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            {...pageTransition}
            className={styles.pageWrapper}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MusicPlayer player={player} />

      <AnimatePresence>
        {showUnicorn && <UnicornMode onClose={() => setShowUnicorn(false)} />}
      </AnimatePresence>
    </div>
  );
}
