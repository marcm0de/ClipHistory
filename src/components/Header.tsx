"use client";

import { useClipStore } from "@/store/clipStore";
import { Sun, Moon, Download, Trash2 } from "lucide-react";

export default function Header() {
  const { darkMode, toggleDarkMode, exportJSON, clearAll, clips } =
    useClipStore();

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clip-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          <span className="text-cyan-400">Clip</span>History
        </h1>
        <p className="text-xs text-white/40">
          Paste anywhere to capture • ↑↓ navigate • Enter copy • / search
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
          title="Toggle theme"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={handleExport}
          className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
          title="Export as JSON"
          disabled={clips.length === 0}
        >
          <Download size={16} />
        </button>
        <button
          onClick={() => {
            if (clips.length > 0 && confirm("Clear all clips?")) clearAll();
          }}
          className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-red-400"
          title="Clear all"
          disabled={clips.length === 0}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </header>
  );
}
