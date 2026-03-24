"use client";

import { useState } from "react";
import { useClipStore, DEFAULT_FOLDERS } from "@/store/clipStore";
import { Folder, Plus, X } from "lucide-react";

interface FolderBarProps {
  activeFolder: string;
  onSelect: (folder: string) => void;
}

export default function FolderBar({ activeFolder, onSelect }: FolderBarProps) {
  const { darkMode, customFolders, addCustomFolder, removeCustomFolder, clips } = useClipStore();
  const [adding, setAdding] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  const allFolders = [...DEFAULT_FOLDERS, ...customFolders];

  const handleAdd = () => {
    if (!newFolder.trim()) return;
    addCustomFolder(newFolder.trim());
    setNewFolder("");
    setAdding(false);
  };

  const getCount = (folder: string) => {
    if (folder === "All") return clips.length;
    return clips.filter((c) => c.folder === folder).length;
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3">
      {allFolders.map((f) => {
        const count = getCount(f);
        const isActive = activeFolder === f;
        return (
          <button
            key={f}
            onClick={() => onSelect(f)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? darkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
                : darkMode
                ? "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                : "bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Folder size={12} />
            {f}
            {count > 0 && (
              <span className={`text-[10px] ${isActive ? "opacity-70" : "opacity-50"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}

      {adding ? (
        <div className="flex items-center gap-1">
          <input
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Name"
            autoFocus
            className={`w-20 px-2 py-1 rounded text-xs ${
              darkMode
                ? "bg-white/10 text-white border border-white/10"
                : "bg-gray-50 text-gray-900 border border-gray-200"
            }`}
          />
          <button onClick={handleAdd} className="text-green-400 hover:text-green-300">
            <Plus size={14} />
          </button>
          <button onClick={() => setAdding(false)} className="text-red-400 hover:text-red-300">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className={`p-1 rounded ${darkMode ? "text-white/30 hover:text-white/60" : "text-gray-300 hover:text-gray-500"}`}
          title="Add folder"
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  );
}
