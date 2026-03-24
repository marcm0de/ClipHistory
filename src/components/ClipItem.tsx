"use client";

import { useState, useRef } from "react";
import { Clip, useClipStore } from "@/store/clipStore";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pin,
  PinOff,
  Copy,
  Trash2,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

interface ClipItemProps {
  clip: Clip;
  isSelected: boolean;
}

export default function ClipItem({ clip, isSelected }: ClipItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagValue, setTagValue] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const { removeClip, togglePin, addTag, removeTag, incrementCopyCount } =
    useClipStore();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(clip.text);
    incrementCopyCount(clip.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddTag = () => {
    const t = tagValue.trim().toLowerCase();
    if (t) {
      addTag(clip.id, t);
      setTagValue("");
    }
    setShowTagInput(false);
  };

  const isLong = clip.text.length > 200;
  const displayText =
    !expanded && isLong ? clip.text.slice(0, 200) + "…" : clip.text;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group relative rounded-lg border p-3 transition-all ${
        isSelected
          ? "border-cyan-500 bg-cyan-500/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
      } ${clip.pinned ? "border-l-2 border-l-cyan-500" : ""}`}
    >
      {/* Header row */}
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/40">
        <span>
          {formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}
          {clip.copyCount > 0 && (
            <span className="ml-2 text-cyan-400/60">
              copied {clip.copyCount}×
            </span>
          )}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => togglePin(clip.id)}
            className="rounded p-1 hover:bg-white/10"
            title={clip.pinned ? "Unpin" : "Pin"}
          >
            {clip.pinned ? (
              <PinOff size={14} className="text-cyan-400" />
            ) : (
              <Pin size={14} />
            )}
          </button>
          <button
            onClick={() => {
              setShowTagInput(true);
              setTimeout(() => tagInputRef.current?.focus(), 50);
            }}
            className="rounded p-1 hover:bg-white/10"
            title="Add tag"
          >
            <Tag size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="rounded p-1 hover:bg-white/10"
            title="Copy"
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
          <button
            onClick={() => removeClip(clip.id)}
            className="rounded p-1 hover:bg-white/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Text content */}
      <pre
        className="cursor-pointer whitespace-pre-wrap break-words font-mono text-sm text-white/80"
        onClick={() => (isLong ? setExpanded(!expanded) : handleCopy())}
      >
        {displayText}
      </pre>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} /> Collapse
            </>
          ) : (
            <>
              <ChevronDown size={12} /> Expand
            </>
          )}
        </button>
      )}

      {/* Tags */}
      {(clip.tags.length > 0 || showTagInput) && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {clip.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-300"
            >
              #{tag}
              <button
                onClick={() => removeTag(clip.id, tag)}
                className="hover:text-red-400"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <AnimatePresence>
            {showTagInput && (
              <motion.input
                ref={tagInputRef}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag();
                  if (e.key === "Escape") setShowTagInput(false);
                }}
                onBlur={handleAddTag}
                className="rounded border border-white/20 bg-transparent px-1.5 py-0.5 text-xs text-white outline-none focus:border-cyan-500"
                placeholder="tag…"
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
