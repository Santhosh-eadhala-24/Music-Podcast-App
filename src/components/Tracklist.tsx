"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { formatTime } from "@/lib/format";
import type { Track } from "@/lib/types";
import { usePlayer } from "@/store/player";

export function TrackList({ tracks }: { tracks: Track[] }) {
  const currentId = usePlayer((s) => (s.currentIndex >= 0 ? s.queue[s.currentIndex]?.id : undefined));
  const isPlaying = usePlayer((s) => s.isPlaying);
  const { playTrack, togglePlay } = usePlayer.getState();

  return (
    <ul className="divide-y divide-white/5">
      {tracks.map((track, i) => {
        const current = track.id === currentId;
        return (
          <li key={track.id}>
            <button
              type="button"
              onClick={() => (current ? togglePlay() : playTrack(track, tracks))}
              aria-current={current}
              aria-label={`${current && isPlaying ? "Pause" : "Play"} ${track.title} by ${track.artist}`}
              className={`group flex w-full items-center gap-4 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/10 ${
                current ? "bg-white/10" : ""
              }`}
            >
              <span className="flex w-6 justify-center text-sm tabular-nums text-white/50">
                {current ? (
                  isPlaying ? <Pause size={16} className="text-emerald-400" /> : <Play size={16} className="text-emerald-400" />
                ) : (
                  <>
                    <span className="group-hover:hidden">{i + 1}</span>
                    <Play size={16} className="hidden group-hover:block" />
                  </>
                )}
              </span>
              <Image src={track.cover} alt="" width={48} height={48} className="size-12 shrink-0 rounded object-cover" />
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-medium ${current ? "text-emerald-400" : ""}`}>
                  {track.title}
                </span>
                <span className="block truncate text-xs text-white/60">{track.artist}</span>
              </span>
              <span className="hidden w-40 truncate text-sm text-white/50 md:block">{track.album}</span>
              <span className="w-12 text-right text-sm tabular-nums text-white/50">{formatTime(track.duration)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}