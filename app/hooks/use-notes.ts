import { useState, useCallback } from "react";
import type { Note, NoteCategory } from "~/data/types";

const NOTES_KEY = "sapehive_notes";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window === "undefined") return [];
    return loadNotes();
  });

  const addNote = useCallback((title: string, body: string, category: NoteCategory) => {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      body,
      category,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => {
      const updated = [note, ...prev];
      saveNotes(updated);
      return updated;
    });
  }, []);

  const updateNote = useCallback((id: string, changes: Partial<Pick<Note, "title" | "body" | "category">>) => {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
      );
      saveNotes(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
      );
      saveNotes(updated);
      return updated;
    });
  }, []);

  return { notes, addNote, updateNote, deleteNote, togglePin };
}
