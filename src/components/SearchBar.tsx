"use client";

import { Search, X } from "lucide-react";
import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export default function SearchBar({
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 transition-all duration-200 ${
        focused
          ? "border-cyan-500/70 bg-white/10 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/20"
          : "border-white/10 bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.06]"
      }`}
    >
      <Search size={16} className={`shrink-0 transition-colors ${focused ? 'text-cyan-400' : 'text-white/30'}`} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search clips… ( / )"
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-white/40 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
