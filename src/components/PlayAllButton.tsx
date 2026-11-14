"use client";

import { Play } from "lucide-react";
import type { Track } from "@/lib/types";
import { usePlayer } from "@/store/player";

export function PlayAllButton({ tracks }: { tracks: Track[] }) {
  const playTrack = usePlayer((s) => s.playTrack);

  return (
    <button
      type="button"
      onClick={() => playTrack(tracks[0], tracks)}
      disabled={tracks.length === 0}
      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 disabled:opacity-40"
    >
      <Play size={16} fill="currentColor" />
      Play
    </button>
  );
}