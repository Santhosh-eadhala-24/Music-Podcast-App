export type RepeatMode = "off" | "one" | "all";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string;
  cover: string;
  duration: number; // seconds
}