import type { Track } from "./types";

/**
 * Mock "Made for you" logic: find the artist with the most plays, list their songs first,
 * then fill the rest with the most played songs. Returns nothing until something was played.
 */
export function madeForYou(plays: Record<string, number>, songs: Track[], limit = 6): Track[] {
  const byArtist = new Map<string, number>();
  for (const song of songs) {
    byArtist.set(song.artist, (byArtist.get(song.artist) ?? 0) + (plays[song.id] ?? 0));
  }
  const ranked = [...byArtist.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0 || ranked[0][1] === 0) return [];

  const top = ranked[0][0];
  const sameArtist = songs.filter((s) => s.artist === top);
  const others = songs.filter((s) => s.artist !== top).sort((a, b) => (plays[b.id] ?? 0) - (plays[a.id] ?? 0));
  return [...sameArtist, ...others].slice(0, limit);
}