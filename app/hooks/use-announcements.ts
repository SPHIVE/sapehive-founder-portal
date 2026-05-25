import { useState, useCallback } from "react";
import type { Announcement, AnnouncementType } from "~/data/types";
import { INITIAL_ANNOUNCEMENTS } from "~/data/portal-data";

const ANNOUNCEMENTS_KEY = "sapehive_announcements";

function load(): Announcement[] {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ANNOUNCEMENTS;
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
}

function persist(items: Announcement[]) {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    if (typeof window === "undefined") return INITIAL_ANNOUNCEMENTS;
    return load();
  });

  const addAnnouncement = useCallback(
    (title: string, body: string, author: string, type: AnnouncementType) => {
      const item: Announcement = {
        id: crypto.randomUUID(),
        title,
        body,
        author,
        date: new Date().toISOString(),
        pinned: false,
        type,
      };
      setAnnouncements((prev) => {
        const updated = [item, ...prev];
        persist(updated);
        return updated;
      });
    },
    []
  );

  const togglePin = useCallback((id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
      persist(updated);
      return updated;
    });
  }, []);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  return { announcements, addAnnouncement, togglePin, deleteAnnouncement };
}
