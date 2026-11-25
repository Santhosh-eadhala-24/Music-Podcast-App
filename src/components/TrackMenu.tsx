"use client";

import { ChevronLeft, Check, EllipsisVertical, ListEnd, ListPlus, SkipForward, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import type { Track } from "@/lib/types";
import { useLibrary } from "@/store/library";
import { usePlayer } from "@/store/player";

const WIDTH = 224;
const MARGIN = 8;

interface Position {
  left: number;
  top: number;
  above: boolean;
}

interface TrackMenuProps {
  track: Track;
  playlistId?: string; // set on a playlist page to show "Remove from playlist"
}

function Item({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10"
    >
      {children}
    </button>
  );
}

export function TrackMenu({ track, playlistId }: TrackMenuProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [view, setView] = useState<"main" | "playlists">("main");
  const [name, setName] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const playlists = useLibrary((s) => s.playlists);
  const open = position !== null;

  useEffect(() => {
    if (!open) return;
    const close = () => setPosition(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPosition(null);
        trigger.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menu.current?.contains(target) && !trigger.current?.contains(target)) close();
    };
    // Scrolling the page closes the menu, scrolling the menu's own list does not.
    const onScroll = (e: Event) => {
      if (!menu.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  function toggle() {
    if (open) {
      setPosition(null);
      return;
    }
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const above = window.innerHeight - rect.bottom < 300 && rect.top > 300;
    setView("main");
    setName("");
    setPosition({
      left: Math.max(MARGIN, Math.min(rect.right - WIDTH, window.innerWidth - WIDTH - MARGIN)),
      top: above ? rect.top - 4 : rect.bottom + 4,
      above,
    });
  }

  const close = () => setPosition(null);

  function createAndAdd(e: React.FormEvent) {
    e.preventDefault();
    const library = useLibrary.getState();
    const id = library.createPlaylist(name);
    library.addToPlaylist(id, track.id);
    close();
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={toggle}
        aria-label={`More options for ${track.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-white/60 transition-opacity hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <EllipsisVertical size={18} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            aria-label={`Options for ${track.title}`}
            style={{
              position: "fixed",
              left: position.left,
              top: position.top,
              width: WIDTH,
              transform: position.above ? "translateY(-100%)" : undefined,
            }}
            className="z-[60] rounded-xl border border-white/10 bg-neutral-900 p-1 text-white shadow-xl"
          >
            {view === "main" ? (
              <>
                <Item
                  onClick={() => {
                    usePlayer.getState().playNext(track);
                    close();
                  }}
                >
                  <SkipForward size={16} /> Play next
                </Item>
                <Item
                  onClick={() => {
                    usePlayer.getState().addToQueue(track);
                    close();
                  }}
                >
                  <ListEnd size={16} /> Add to queue
                </Item>
                <Item onClick={() => setView("playlists")}>
                  <ListPlus size={16} /> Add to playlist
                </Item>
                {playlistId && (
                  <Item
                    onClick={() => {
                      useLibrary.getState().removeFromPlaylist(playlistId, track.id);
                      close();
                    }}
                  >
                    <Trash2 size={16} /> Remove from playlist
                  </Item>
                )}
              </>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setView("main")}
                  className="flex w-full items-center gap-1 rounded-lg px-2 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  <ChevronLeft size={16} /> Add to playlist
                </button>
                <div className="max-h-48 overflow-y-auto">
                  {playlists.length === 0 && <p className="px-3 py-2 text-xs text-white/50">No playlists yet.</p>}
                  {playlists.map((p) => {
                    const included = p.trackIds.includes(track.id);
                    return (
                      <Item
                        key={p.id}
                        onClick={() => {
                          useLibrary.getState().addToPlaylist(p.id, track.id);
                          close();
                        }}
                      >
                        <span className="min-w-0 flex-1 truncate">{p.name}</span>
                        {included && <Check size={14} className="text-emerald-400" />}
                      </Item>
                    );
                  })}
                </div>
                <form onSubmit={createAndAdd} className="mt-1 flex gap-1 border-t border-white/10 p-2">
                  <input
                    value={name}
                    maxLength={40}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New playlist"
                    aria-label="New playlist name"
                    className="min-w-0 flex-1 rounded-md bg-white/10 px-2 py-1 text-sm outline-none placeholder:text-white/40"
                  />
                  <button type="submit" className="rounded-md bg-emerald-500 px-2 text-sm font-medium text-black">
                    Add
                  </button>
                </form>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}