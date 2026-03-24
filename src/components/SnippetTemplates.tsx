"use client";

import { useState } from "react";
import { useClipStore, SnippetTemplate } from "@/store/clipStore";
import { FileText, Plus, Trash2, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SnippetTemplates() {
  const { templates, addTemplate, removeTemplate, darkMode } = useClipStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !text.trim()) return;
    addTemplate(name.trim(), text.trim());
    setName("");
    setText("");
    setShowForm(false);
  };

  const handleUse = (template: SnippetTemplate) => {
    navigator.clipboard.writeText(template.text);
  };

  if (templates.length === 0 && !showForm) {
    return (
      <div className={`rounded-xl border p-4 ${darkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className={darkMode ? "text-purple-400" : "text-purple-600"} />
            <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Snippet Templates</span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className={`p-1 rounded ${darkMode ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Plus size={16} />
          </button>
        </div>
        <p className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>
          Save frequently used text as reusable templates.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${darkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={16} className={darkMode ? "text-purple-400" : "text-purple-600"} />
          <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            Snippet Templates ({templates.length})
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-1 rounded ${darkMode ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="space-y-2 pb-3 border-b border-white/10">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                className={`w-full px-3 py-1.5 rounded-lg text-sm ${
                  darkMode
                    ? "bg-white/10 text-white placeholder:text-white/30 border border-white/10"
                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200"
                }`}
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Template content"
                rows={3}
                className={`w-full px-3 py-1.5 rounded-lg text-sm resize-none ${
                  darkMode
                    ? "bg-white/10 text-white placeholder:text-white/30 border border-white/10"
                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200"
                }`}
              />
              <button
                onClick={handleAdd}
                disabled={!name.trim() || !text.trim()}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 disabled:opacity-40"
              >
                Save Template
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {templates.map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              darkMode ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
            } transition-colors group`}
          >
            <div className="flex-1 min-w-0 mr-2">
              <div className={`text-xs font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                {t.name}
              </div>
              <div className={`text-[10px] truncate ${darkMode ? "text-white/40" : "text-gray-400"}`}>
                {t.text.slice(0, 50)}{t.text.length > 50 ? "..." : ""}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleUse(t)}
                className="p-1 text-green-400 hover:text-green-300"
                title="Copy to clipboard"
              >
                <Copy size={12} />
              </button>
              <button
                onClick={() => removeTemplate(t.id)}
                className="p-1 text-red-400 hover:text-red-300"
                title="Delete template"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
