"use client";

import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { formatTime } from "@/lib/format";
import { usePlayer } from "@/store/player";

interface ControlProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

function Control({ label, onClick, active, disabled, children }: ControlProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`flex size-9 items-center justify-center rounded-full transition-colors hover:text-white disabled:opacity-40 ${
        active ? "text-emerald-400 hover:text-emerald-300" : "text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = usePlayer((s) => (s.currentIndex >= 0 ? s.queue[s.currentIndex] : undefined));
  const isPlaying = usePlayer((s) => s.isPlaying);
  const volume = usePlayer((s) => s.volume);
  const seekTo = usePlayer((s) => s.seekTo);
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const { togglePlay, setPlaying, setTime, setDuration, next, previous, seek, setVolume, toggleShuffle, cycleRepeat, clearSeek } =
    usePlayer.getState();

  const src = track?.src;
  const total = duration || track?.duration || 0;

  // Play or pause the audio element whenever the state or the track changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [isPlaying, src, setPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Apply seek requests from the store.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekTo === null) return;
    audio.currentTime = seekTo;
    if (isPlaying) audio.play().catch(() => setPlaying(false));
    clearSeek();
  }, [seekTo, isPlaying, setPlaying, clearSeek]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-neutral-900 px-4 py-3 text-white">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration);
        }}
        onEnded={() => next(true)}
      />

      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[1fr_2fr_1fr]">
        {/* Track info */}
        <div className="flex min-w-0 items-center gap-3">
          {track && (
            <Image src={track.cover} alt="" width={48} height={48} className="size-12 shrink-0 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{track ? track.title : "Nothing playing"}</p>
            <p className="truncate text-xs text-white/60">{track?.artist}</p>
          </div>
        </div>

        {/* Controls and seek bar */}
        <div className="flex flex-col items-center gap-1 sm:col-start-2 sm:row-start-1">
          <div className="flex items-center gap-1">
            <Control label="Shuffle" active={shuffle} onClick={toggleShuffle}>
              <Shuffle size={16} />
            </Control>
            <Control label="Previous" onClick={previous} disabled={!track}>
              <SkipBack size={18} />
            </Control>
            <button
              type="button"
              onClick={togglePlay}
              disabled={!track}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="mx-1 flex size-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 disabled:opacity-40"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <Control label="Next" onClick={() => next()} disabled={!track}>
              <SkipForward size={18} />
            </Control>
            <Control
              label={repeat === "off" ? "Repeat off" : repeat === "all" ? "Repeat all" : "Repeat one"}
              active={repeat !== "off"}
              onClick={cycleRepeat}
            >
              {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </Control>
          </div>
          <div className="hidden w-full items-center gap-2 text-xs tabular-nums text-white/60 sm:flex">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={total}
              step={0.1}
              value={Math.min(currentTime, total)}
              disabled={!track}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer accent-white disabled:cursor-default"
            />
            <span className="w-10">{formatTime(total)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden items-center justify-end gap-2 sm:flex">
          <Control label={volume === 0 ? "Unmute" : "Mute"} onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Control>
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-white"
          />
        </div>

        {/* Seek bar on small screens */}
        <div className="col-span-2 flex items-center gap-2 text-xs tabular-nums text-white/60 sm:hidden">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            aria-label="Seek"
            min={0}
            max={total}
            step={0.1}
            value={Math.min(currentTime, total)}
            disabled={!track}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 flex-1 accent-white"
          />
          <span>{formatTime(total)}</span>
        </div>
      </div>
    </div>
  );
}