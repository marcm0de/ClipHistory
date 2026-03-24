import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Clip {
  id: string;
  text: string;
  createdAt: string; // ISO string
  pinned: boolean;
  tags: string[];
  copyCount: number;
}

interface ClipState {
  clips: Clip[];
  darkMode: boolean;
  addClip: (text: string) => void;
  removeClip: (id: string) => void;
  clearAll: () => void;
  togglePin: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  incrementCopyCount: (id: string) => void;
  toggleDarkMode: () => void;
  exportJSON: () => string;
}

const MAX_CLIPS = 100;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useClipStore = create<ClipState>()(
  persist(
    (set, get) => ({
      clips: [],
      darkMode: true,

      addClip: (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        // Avoid duplicates of the most recent clip
        const { clips } = get();
        if (clips.length > 0 && clips[0].text === trimmed) return;

        const newClip: Clip = {
          id: generateId(),
          text: trimmed,
          createdAt: new Date().toISOString(),
          pinned: false,
          tags: [],
          copyCount: 0,
        };

        set((state) => ({
          clips: [newClip, ...state.clips].slice(0, MAX_CLIPS),
        }));
      },

      removeClip: (id: string) =>
        set((state) => ({
          clips: state.clips.filter((c) => c.id !== id),
        })),

      clearAll: () => set({ clips: [] }),

      togglePin: (id: string) =>
        set((state) => ({
          clips: state.clips.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        })),

      addTag: (id: string, tag: string) =>
        set((state) => ({
          clips: state.clips.map((c) =>
            c.id === id && !c.tags.includes(tag)
              ? { ...c, tags: [...c.tags, tag] }
              : c
          ),
        })),

      removeTag: (id: string, tag: string) =>
        set((state) => ({
          clips: state.clips.map((c) =>
            c.id === id
              ? { ...c, tags: c.tags.filter((t) => t !== tag) }
              : c
          ),
        })),

      incrementCopyCount: (id: string) =>
        set((state) => ({
          clips: state.clips.map((c) =>
            c.id === id ? { ...c, copyCount: c.copyCount + 1 } : c
          ),
        })),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      exportJSON: () => {
        const { clips } = get();
        return JSON.stringify(clips, null, 2);
      },
    }),
    {
      name: "clip-history-storage",
    }
  )
);
