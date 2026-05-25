import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPin, IconPinFilled, IconTrash, IconPlus, IconBell } from "@tabler/icons-react";
import { GlassCard } from "~/components/glass-card/glass-card";
import type { Announcement, AnnouncementType } from "~/data/types";
import type { useAnnouncements } from "~/hooks/use-announcements";
import styles from "./announcements-page.module.css";

type AnnouncementsHook = ReturnType<typeof useAnnouncements>;

interface AnnouncementsPageProps {
  announcements: AnnouncementsHook["announcements"];
  addAnnouncement: AnnouncementsHook["addAnnouncement"];
  togglePin: AnnouncementsHook["togglePin"];
  deleteAnnouncement: AnnouncementsHook["deleteAnnouncement"];
}

const TYPE_CONFIG: Record<AnnouncementType, { color: string; label: string }> = {
  milestone: { color: "#f5c518", label: "MILESTONE" },
  founder: { color: "#a855f7", label: "FOUNDER MSG" },
  update: { color: "#3b82f6", label: "UPDATE" },
  alert: { color: "#ef4444", label: "ALERT" },
};

function AnnouncementCard({
  item,
  onTogglePin,
  onDelete,
}: {
  item: Announcement;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  const config = TYPE_CONFIG[item.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`${styles.card} ${item.pinned ? styles.pinnedCard : ""}`}>
        <div className={styles.cardLeft} style={{ background: config.color }} />
        <div className={styles.cardBody}>
          <div className={styles.cardMeta}>
            <span className={styles.typeTag} style={{ color: config.color, borderColor: config.color + "40" }}>
              {config.label}
            </span>
            <div className={styles.cardActions}>
              <button onClick={onTogglePin} className={styles.actionBtn} title="Pin">
                {item.pinned ? (
                  <IconPinFilled size={14} style={{ color: "var(--color-primary)" }} />
                ) : (
                  <IconPin size={14} />
                )}
              </button>
              <button onClick={onDelete} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete">
                <IconTrash size={14} />
              </button>
            </div>
          </div>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <p className={styles.cardText}>{item.body}</p>
          <div className={styles.cardFooter}>
            <span className={styles.cardAuthor}>By {item.author}</span>
            <span className={styles.cardDate}>
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function AnnouncementsPage({ announcements, addAnnouncement, togglePin, deleteAnnouncement }: AnnouncementsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newAuthor, setNewAuthor] = useState("Founder");
  const [newType, setNewType] = useState<AnnouncementType>("update");

  const handleAdd = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    addAnnouncement(newTitle, newBody, newAuthor, newType);
    setNewTitle("");
    setNewBody("");
    setShowForm(false);
  };

  const pinned = announcements.filter((a) => a.pinned);
  const rest = announcements.filter((a) => !a.pinned);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>
            <IconBell size={28} stroke={1.5} className={styles.titleIcon} />
            Announcements
          </h2>
          <p className={styles.pageSub}>Internal broadcast board — important updates and founder messages.</p>
        </div>
        <motion.button
          className={styles.addBtn}
          onClick={() => setShowForm((v) => !v)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <IconPlus size={16} />
          <span>Post</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <GlassCard glow className={styles.addForm}>
              <div className={styles.formRow}>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Announcement title"
                  className={styles.formInput}
                  autoFocus
                />
                <input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Author"
                  className={styles.formInputSm}
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as AnnouncementType)}
                  className={styles.formSelect}
                >
                  <option value="update">Update</option>
                  <option value="milestone">Milestone</option>
                  <option value="founder">Founder Msg</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Write the announcement..."
                className={styles.formTextarea}
                rows={4}
              />
              <div className={styles.formActions}>
                <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
                <motion.button onClick={handleAdd} className={styles.saveBtn} whileTap={{ scale: 0.97 }}>
                  Broadcast
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.announcements}>
        <AnimatePresence mode="popLayout">
          {pinned.map((a) => (
            <AnnouncementCard key={a.id} item={a} onTogglePin={() => togglePin(a.id)} onDelete={() => deleteAnnouncement(a.id)} />
          ))}
          {rest.map((a) => (
            <AnnouncementCard key={a.id} item={a} onTogglePin={() => togglePin(a.id)} onDelete={() => deleteAnnouncement(a.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
