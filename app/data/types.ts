export type NoteCategory = "Goals" | "YC" | "Product" | "Growth" | "Ideas" | "Team";

export interface Note {
  id: string;
  title: string;
  body: string;
  category: NoteCategory;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementType = "milestone" | "founder" | "update" | "alert";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  pinned: boolean;
  type: AnnouncementType;
}

export type AppPage = "dashboard" | "notes" | "yc" | "announcements" | "goals" | "mindset";

export type MusicMode = "default" | "founder" | "deep-work" | "vision";
