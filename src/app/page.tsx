"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useClipStore } from "@/store/clipStore";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ClipItem from "@/components/ClipItem";
import Stats from "@/components/Stats";
import SnippetTemplates from "@/components/SnippetTemplates";
import FolderBar from "@/components/FolderBar";
import { Clipboard } from "lucide-react";

export default function Home() {
  const { clips, addClip, removeClip, darkMode, incrementCopyCount } =
    useClipStore();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFolder, setActiveFolder] = useState("All");
  const listRef = useRef<HTMLDivElement>(null);

  // Sort: pinned first, then by date
  const sortedClips = [...clips].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const folderFiltered = activeFolder === "All"
    ? sortedClips
    : sortedClips.filter((c) => c.folder === activeFolder);

  const filtered = folderFiltered.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.text.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q))
    );
  });

  // Paste capture
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text/plain");
      if (text) addClip(text);
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [addClip]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture if we're in an input
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        setSearchFocused(true);
        return;
      }

      if (e.key === "Escape") {
        setSearchFocused(false);
        setSearch("");
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if (isInput) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        const clip = filtered[selectedIndex];
        navigator.clipboard.writeText(clip.text);
        incrementCopyCount(clip.id);
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        filtered[selectedIndex]
      ) {
        e.preventDefault();
        removeClip(filtered[selectedIndex].id);
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
    },
    [filtered, selectedIndex, removeClip, incrementCopyCount]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  // Reset selection on search
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "bg-[#0c0c0c]" : "bg-gray-100"
      }`}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
        <Header />
        <Stats />
        <SearchBar
          value={search}
          onChange={setSearch}
          focused={searchFocused}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <FolderBar activeFolder={activeFolder} onSelect={setActiveFolder} />
        <SnippetTemplates />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-white/30">
            <Clipboard size={48} strokeWidth={1} />
            <p className="text-sm">
              {clips.length === 0
                ? "Paste something to get started"
                : "No clips match your search"}
            </p>
          </div>
        ) : (
          <div ref={listRef} className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {filtered.map((clip, i) => (
                <ClipItem
                  key={clip.id}
                  clip={clip}
                  isSelected={i === selectedIndex}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
