"use client";

import { useClipStore } from "@/store/clipStore";
import { isToday } from "date-fns";
import { BarChart3 } from "lucide-react";

export default function Stats() {
  const clips = useClipStore((s) => s.clips);

  const totalClips = clips.length;
  const clipsToday = clips.filter((c) => isToday(new Date(c.createdAt))).length;

  const tagCounts: Record<string, number> = {};
  clips.forEach((c) => c.tags.forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1)));
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
      <span className="flex items-center gap-1.5">
        <BarChart3 size={13} className="text-cyan-400" />
        <strong className="text-white/70">{totalClips}</strong> clips
      </span>
      <span>
        <strong className="text-white/70">{clipsToday}</strong> today
      </span>
      {topTags.length > 0 && (
        <span>
          top:{" "}
          {topTags.map(([tag, count], i) => (
            <span key={tag}>
              {i > 0 && ", "}
              <span className="text-cyan-400">#{tag}</span>
              <span className="text-white/30"> ({count})</span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
