import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Clip {
  id: string;
  text: string;
  createdAt: string; // ISO string
  pinned: boolean;
  tags: string[];
  copyCount: number;
  folder: string; // category/folder name
}

export interface SnippetTemplate {
  id: string;
  name: string;
  text: string;
  folder: string;
}

export const DEFAULT_FOLDERS = ['All', 'Work', 'Personal', 'Code', 'Links', 'Other'] as const;

interface ClipState {
  clips: Clip[];
  darkMode: boolean;
  templates: SnippetTemplate[];
  customFolders: string[];
  addClip: (text: string, folder?: string) => void;
  removeClip: (id: string) => void;
  clearAll: () => void;
  togglePin: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  setClipFolder: (id: string, folder: string) => void;
  incrementCopyCount: (id: string) => void;
  toggleDarkMode: () => void;
  exportJSON: () => string;
  addTemplate: (name: string, text: string, folder?: string) => void;
  removeTemplate: (id: string) => void;
  addCustomFolder: (name: string) => void;
  removeCustomFolder: (name: string) => void;
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
      templates: [],
      customFolders: [],

      addClip: (text: string, folder: string = 'All') => {
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
          folder,
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

      setClipFolder: (id: string, folder: string) =>
        set((state) => ({
          clips: state.clips.map((c) =>
            c.id === id ? { ...c, folder } : c
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

      addTemplate: (name: string, text: string, folder: string = 'All') => {
        set((state) => ({
          templates: [
            ...state.templates,
            { id: generateId(), name, text, folder },
          ],
        }));
      },

      removeTemplate: (id: string) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      addCustomFolder: (name: string) =>
        set((state) => ({
          customFolders: state.customFolders.includes(name)
            ? state.customFolders
            : [...state.customFolders, name],
        })),

      removeCustomFolder: (name: string) =>
        set((state) => ({
          customFolders: state.customFolders.filter((f) => f !== name),
        })),
    }),
    {
      name: "clip-history-storage",
    }
  )
);
