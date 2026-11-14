export type RepeatMode = "off" | "one" | "all";

export interface Track {
  id: string;
  title: string;
  artist: string; // the host for a podcast episode
  album: string; // the show name for a podcast episode
  src: string;
  cover: string;
  duration: number; // seconds
  kind?: "song" | "podcast"; // songs are the default
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}