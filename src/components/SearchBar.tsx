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
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
        focused
          ? "border-cyan-500 bg-white/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <Search size={16} className="shrink-0 text-white/40" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search clips… ( / )"
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-white/40 hover:text-white">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
