import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { RepeatMode, Track } from "@/lib/types";

interface PlayerState {
  queue: Track[];
  currentIndex: number; // -1 means nothing is loaded
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  seekTo: number | null; // a seek request that the Player applies to the audio element

  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  next: (auto?: boolean) => void;
  previous: () => void;
  seek: (time: number) => void;
  clearSeek: () => void;
  setTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;

  playIndex: (index: number) => void;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  moveInQueue: (from: number, to: number) => void;
  removeFromQueue: (index: number) => void;
}

const REPEAT_ORDER: RepeatMode[] = ["off", "all", "one"];

// Picks a random index that is not the current one.
function randomOther(length: number, current: number): number {
  let index = Math.floor(Math.random() * (length - 1));
  if (index >= current) index += 1;
  return index;
}

// If the index stays the same, the audio element must be rewound by hand.
function jumpTo(index: number, current: number) {
  return {
    currentIndex: index,
    isPlaying: true,
    currentTime: 0,
    seekTo: index === current ? 0 : null,
  };
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      shuffle: false,
      repeat: "off",
      seekTo: null,

      playTrack: (track, queue) => {
        const state = get();
        const current = state.queue[state.currentIndex];
        if (current?.id === track.id) {
          set({ isPlaying: true, currentTime: 0, seekTo: 0 });
          return;
        }
        const list = queue ?? state.queue;
        const index = list.findIndex((t) => t.id === track.id);
        if (index === -1) {
          set({ queue: [...list, track], currentIndex: list.length, isPlaying: true, currentTime: 0 });
        } else {
          set({ queue: list, currentIndex: index, isPlaying: true, currentTime: 0 });
        }
      },

      togglePlay: () => set((s) => (s.currentIndex < 0 ? s : { isPlaying: !s.isPlaying })),

      setPlaying: (playing) => set({ isPlaying: playing }),

      next: (auto = false) => {
        const { queue, currentIndex, shuffle, repeat } = get();
        if (queue.length === 0) return;

        if (auto && repeat === "one") {
          set({ isPlaying: true, currentTime: 0, seekTo: 0 });
          return;
        }

        let index: number;
        if (shuffle && queue.length > 1) index = randomOther(queue.length, currentIndex);
        else if (currentIndex + 1 < queue.length) index = currentIndex + 1;
        else if (repeat === "all") index = 0;
        else {
          // End of the queue: stop when a track ends by itself, do nothing on a manual click.
          if (auto) set({ isPlaying: false, currentTime: 0, seekTo: 0 });
          return;
        }
        set(jumpTo(index, currentIndex));
      },

      previous: () => {
        const { queue, currentIndex, currentTime, repeat } = get();
        if (queue.length === 0) return;
        if (currentTime > 3 || (currentIndex === 0 && repeat !== "all")) {
          set({ currentTime: 0, seekTo: 0 });
          return;
        }
        const index = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        set(jumpTo(index, currentIndex));
      },

      seek: (time) => set({ currentTime: time, seekTo: time }),
      clearSeek: () => set({ seekTo: null }),
      setTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      cycleRepeat: () =>
        set((s) => ({ repeat: REPEAT_ORDER[(REPEAT_ORDER.indexOf(s.repeat) + 1) % REPEAT_ORDER.length] })),

      playIndex: (index) => set((s) => (index < 0 || index >= s.queue.length ? s : jumpTo(index, s.currentIndex))),

      // Adds to the end of the queue. A track that is already queued is left where it is.
      addToQueue: (track) =>
        set((s) => {
          if (s.currentIndex < 0) return { queue: [track], currentIndex: 0, currentTime: 0 };
          if (s.queue.some((t) => t.id === track.id)) return s;
          return { queue: [...s.queue, track] };
        }),

      // Puts the track right after the one that is playing.
      playNext: (track) =>
        set((s) => {
          if (s.currentIndex < 0) return { queue: [track], currentIndex: 0, currentTime: 0 };
          const current = s.queue[s.currentIndex];
          if (current.id === track.id) return s;
          const queue = s.queue.filter((t) => t.id !== track.id);
          const at = queue.findIndex((t) => t.id === current.id);
          queue.splice(at + 1, 0, track);
          return { queue, currentIndex: at };
        }),

      moveInQueue: (from, to) =>
        set((s) => {
          const last = s.queue.length - 1;
          if (from === to || from < 0 || to < 0 || from > last || to > last) return s;
          const queue = [...s.queue];
          const [moved] = queue.splice(from, 1);
          queue.splice(to, 0, moved);
          let current = s.currentIndex;
          if (current === from) current = to;
          else if (from < current && to >= current) current -= 1;
          else if (from > current && to <= current) current += 1;
          return { queue, currentIndex: current };
        }),

      removeFromQueue: (index) =>
        set((s) => {
          if (index < 0 || index >= s.queue.length) return s;
          const queue = s.queue.filter((_, i) => i !== index);
          if (queue.length === 0) {
            return { queue, currentIndex: -1, isPlaying: false, currentTime: 0, duration: 0 };
          }
          if (index < s.currentIndex) return { queue, currentIndex: s.currentIndex - 1 };
          if (index === s.currentIndex) {
            return { queue, currentIndex: Math.min(index, queue.length - 1), currentTime: 0, seekTo: null };
          }
          return { queue };
        }),
    }),
    {
      name: "music-player",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // rehydrated on the client in Player.tsx, which avoids a hydration mismatch
      partialize: (s) => ({
        queue: s.queue,
        currentIndex: s.currentIndex,
        volume: s.volume,
        shuffle: s.shuffle,
        repeat: s.repeat,
      }),
    },
  ),
);