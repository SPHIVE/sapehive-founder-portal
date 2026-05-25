import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconPin, IconPinFilled, IconTrash, IconPencil, IconCheck, IconX } from "@tabler/icons-react";
import { GlassCard } from "~/components/glass-card/glass-card";
import type { NoteCategory, Note } from "~/data/types";
import type { useNotes } from "~/hooks/use-notes";
import styles from "./notes-page.module.css";

type NotesHook = ReturnType<typeof useNotes>;

interface NotesPageProps {
  notes: NotesHook["notes"];
  addNote: NotesHook["addNote"];
  updateNote: NotesHook["updateNote"];
  deleteNote: NotesHook["deleteNote"];
  togglePin: NotesHook["togglePin"];
}

const CATEGORIES: NoteCategory[] = ["Goals", "YC", "Product", "Growth", "Ideas", "Team"];

const CATEGORY_COLORS: Record<NoteCategory, string> = {
  Goals: "#f5c518",
  YC: "#f59e0b",
  Product: "#3b82f6",
  Growth: "#22c55e",
  Ideas: "#a855f7",
  Team: "#ec4899",
};

function NoteCard({
  note,
  onTogglePin,
  onDelete,
  onUpdate,
}: {
  note: Note;
  onTogglePin: () => void;
  onDelete: () => void;
  onUpdate: (title: string, body: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);

  const saveEdit = () => {
    onUpdate(editTitle, editBody);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`${styles.noteCard} ${note.pinned ? styles.pinned : ""}`}>
        <div
          className={styles.noteCategoryBar}
          style={{ background: CATEGORY_COLORS[note.category] }}
        />
        <div className={styles.noteContent}>
          <div className={styles.noteHeader}>
            <span
              className={styles.categoryBadge}
              style={{ color: CATEGORY_COLORS[note.category], borderColor: CATEGORY_COLORS[note.category] + "33" }}
            >
              {note.category}
            </span>
            <div className={styles.noteActions}>
              {editing ? (
                <>
                  <button onClick={saveEdit} className={styles.actionBtn} title="Save">
                    <IconCheck size={14} />
                  </button>
                  <button onClick={cancelEdit} className={styles.actionBtn} title="Cancel">
                    <IconX size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className={styles.actionBtn} title="Edit">
                    <IconPencil size={14} />
                  </button>
                  <button onClick={onTogglePin} className={styles.actionBtn} title="Pin">
                    {note.pinned ? <IconPinFilled size={14} style={{ color: "var(--color-primary)" }} /> : <IconPin size={14} />}
                  </button>
                  <button onClick={onDelete} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete">
                    <IconTrash size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className={styles.editForm}>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={styles.editInput}
                placeholder="Note title"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className={styles.editTextarea}
                rows={4}
                placeholder="Note content"
              />
            </div>
          ) : (
            <>
              <h3 className={styles.noteTitle}>{note.title}</h3>
              <p className={styles.noteBody}>{note.body}</p>
            </>
          )}

          <p className={styles.noteDate}>
            {new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function NotesPage({ notes, addNote, updateNote, deleteNote, togglePin }: NotesPageProps) {
  const [activeCategory, setActiveCategory] = useState<NoteCategory | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState<NoteCategory>("Ideas");

  const filtered =
    activeCategory === "All" ? notes : notes.filter((n) => n.category === activeCategory);
  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addNote(newTitle, newBody, newCategory);
    setNewTitle("");
    setNewBody("");
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>🔐 Secret Notes</h2>
          <p className={styles.pageSub}>Internal thoughts, strategies, and ideas — for your eyes only.</p>
        </div>
        <motion.button
          className={styles.addBtn}
          onClick={() => setShowForm((v) => !v)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <IconPlus size={16} />
          <span>New Note</span>
        </motion.button>
      </div>

      {/* Add Note Form */}
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
                  placeholder="Note title"
                  className={styles.formInput}
                  autoFocus
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                  className={styles.formSelect}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Write your note here..."
                className={styles.formTextarea}
                rows={4}
              />
              <div className={styles.formActions}>
                <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
                <motion.button
                  onClick={handleAdd}
                  className={styles.saveBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Save Note
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className={styles.filters}>
        {(["All", ...CATEGORIES] as (NoteCategory | "All")[]).map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
            onClick={() => setActiveCategory(cat)}
            style={activeCategory === cat && cat !== "All" ? { borderColor: CATEGORY_COLORS[cat as NoteCategory] + "80" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <p className={styles.sectionLabel}>📌 PINNED</p>
          <div className={styles.notesGrid}>
            <AnimatePresence mode="popLayout">
              {pinned.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() => togglePin(note.id)}
                  onDelete={() => deleteNote(note.id)}
                  onUpdate={(title, body) => updateNote(note.id, { title, body })}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {unpinned.length > 0 ? (
        <div>
          {pinned.length > 0 && <p className={styles.sectionLabel}>ALL NOTES</p>}
          <div className={styles.notesGrid}>
            <AnimatePresence mode="popLayout">
              {unpinned.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() => togglePin(note.id)}
                  onDelete={() => deleteNote(note.id)}
                  onUpdate={(title, body) => updateNote(note.id, { title, body })}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : notes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyEmoji}>📝</p>
          <p className={styles.emptyText}>No notes yet. Start capturing your thoughts.</p>
        </div>
      ) : null}
    </div>
  );
}
