"use client";

import { useState } from "react";
import { Keyboard, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SHORTCUTS = [
  { keys: ["/"], desc: "Focus search" },
  { keys: ["Esc"], desc: "Clear search & blur" },
  { keys: ["↑", "↓"], desc: "Navigate clips" },
  { keys: ["Enter"], desc: "Copy selected clip" },
  { keys: ["Delete"], desc: "Delete selected clip" },
  { keys: ["Ctrl", "V"], desc: "Capture clipboard" },
];

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
        title="Keyboard shortcuts"
      >
        <Keyboard size={14} />
        <span className="hidden sm:inline">Shortcuts</span>
        <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/50">?</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-80 rounded-xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Keyboard size={16} className="text-cyan-400" />
                  Keyboard Shortcuts
                </h3>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-2.5">
                {SHORTCUTS.map((s) => (
                  <div key={s.desc} className="flex items-center justify-between">
                    <span className="text-xs text-white/60">{s.desc}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key) => (
                        <kbd
                          key={key}
                          className="min-w-[24px] rounded bg-white/10 px-1.5 py-0.5 text-center text-[11px] font-mono text-white/70 border border-white/5"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-white/30 text-center">
                Press <kbd className="rounded bg-white/10 px-1 text-[10px]">?</kbd> to toggle this panel
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
