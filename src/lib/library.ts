import { PODCASTS } from "./podcasts";
import { TRACKS } from "./tracks";
import type { Track } from "./types";

export interface Collection {
  slug: string;
  name: string;
  subtitle: string; // the artist for an album, the host for a show, "Artist" for an artist
  cover: string;
  tracks: Track[];
}

export const ALL_TRACKS: Track[] = [...TRACKS, ...PODCASTS];

export function getTrack(id: string): Track | undefined {
  return ALL_TRACKS.find((t) => t.id === id);
}

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function group(
  source: Track[],
  keyOf: (track: Track) => string,
  build: (first: Track) => Omit<Collection, "tracks" | "slug">,
): Collection[] {
  const map = new Map<string, Collection>();
  for (const track of source) {
    const slug = slugify(keyOf(track));
    const existing = map.get(slug);
    if (existing) existing.tracks.push(track);
    else map.set(slug, { slug, ...build(track), tracks: [track] });
  }
  return [...map.values()];
}

export function getAlbums(): Collection[] {
  return group(
    TRACKS,
    (t) => t.album,
    (t) => ({ name: t.album, subtitle: t.artist, cover: t.cover }),
  );
}

export function getArtists(): Collection[] {
  return group(
    TRACKS,
    (t) => t.artist,
    (t) => ({ name: t.artist, subtitle: "Artist", cover: t.cover }),
  );
}

export function getShows(): Collection[] {
  return group(
    PODCASTS,
    (t) => t.album,
    (t) => ({ name: t.album, subtitle: t.artist, cover: t.cover }),
  );
}

export const getAlbum = (slug: string) => getAlbums().find((a) => a.slug === slug);
export const getArtist = (slug: string) => getArtists().find((a) => a.slug === slug);
export const getShow = (slug: string) => getShows().find((s) => s.slug === slug);