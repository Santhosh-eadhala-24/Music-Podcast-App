import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Playlist } from "@/lib/types";

const MAX_RECENT = 20;

interface LibraryState {
  playlists: Playlist[];
  recent: string[]; // track ids, newest first
  plays: Record<string, number>;
  hydrated: boolean;

  recordPlay: (trackId: string) => void;
  createPlaylist: (name: string) => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (id: string, trackId: string) => void;
  removeFromPlaylist: (id: string, trackId: string) => void;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function cleanName(name: string): string {
  const trimmed = name.trim().slice(0, 40);
  return trimmed || "New playlist";
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      playlists: [],
      recent: [],
      plays: {},
      hydrated: false,

      recordPlay: (trackId) =>
        set((s) => ({
          recent: [trackId, ...s.recent.filter((id) => id !== trackId)].slice(0, MAX_RECENT),
          plays: { ...s.plays, [trackId]: (s.plays[trackId] ?? 0) + 1 },
        })),

      createPlaylist: (name) => {
        const playlist: Playlist = { id: newId(), name: cleanName(name), trackIds: [], createdAt: Date.now() };
        set((s) => ({ playlists: [playlist, ...s.playlists] }));
        return playlist.id;
      },

      renamePlaylist: (id, name) =>
        set((s) => ({ playlists: s.playlists.map((p) => (p.id === id ? { ...p, name: cleanName(name) } : p)) })),

      deletePlaylist: (id) => set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),

      addToPlaylist: (id, trackId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id && !p.trackIds.includes(trackId) ? { ...p, trackIds: [...p.trackIds, trackId] } : p,
          ),
        })),

      removeFromPlaylist: (id, trackId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, trackIds: p.trackIds.filter((t) => t !== trackId) } : p,
          ),
        })),
    }),
    {
      name: "music-library",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // rehydrated on the client in Player.tsx, which avoids a hydration mismatch
      partialize: (s) => ({ playlists: s.playlists, recent: s.recent, plays: s.plays }),
      onRehydrateStorage: () => () => useLibrary.setState({ hydrated: true }),
    },
  ),
);