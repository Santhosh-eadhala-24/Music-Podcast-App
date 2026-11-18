import type { Track } from "./types";

// Add your own audio files in public/audio and cover images in public/covers,
// then change the file names below to match them.
export const PODCASTS: Track[] = [
  {
    id: "p1",
    kind: "podcast",
    title: "Episode 1: Getting Started",
    artist: "Raj Sharmani",
    album: "Code Talks",
    src: "/audio/podcast1.mp3",
    cover: "/covers/podcast1.webp",
    duration: 600,
  },
  {
    id: "p2",
    kind: "podcast",
    title: "Episode 2: Building Habits",
    artist: "Spotify Podcast",
    album: "Code Talks",
    src: "/audio/podcast2.mp3",
    cover: "/covers/podcast1.webp",
    duration: 540,
  },
  {
    id: "p3",
    kind: "podcast",
    title: "Episode 1: Slow Mornings",
    artist: "Host Two",
    album: "Daily Calm",
    src: "/audio/podcast3.mp3",
    cover: "/covers/podcast2.webp",
    duration: 480,
  },
  {
    id: "p4",
    kind: "podcast",
    title: "Episode 2: Evening Wind Down",
    artist: "Host Two",
    album: "Daily Calm",
    src: "/audio/podcast4.mp3",
    cover: "/covers/podcast2.webp",
    duration: 420,
  },
];