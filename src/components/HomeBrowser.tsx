"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { getTrack } from "@/lib/library";
import type { Collection } from "@/lib/library";
import { madeForYou } from "@/lib/recommend";
import type { Track } from "@/lib/types";
import { useLibrary } from "@/store/library";
import { CollectionGrid } from "./CollectionCard";
import { TrackList } from "./TrackList";

type Filter = "all" | "songs" | "albums" | "artists" | "podcasts";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "songs", label: "Songs" },
  { id: "albums", label: "Albums" },
  { id: "artists", label: "Artists" },
  { id: "podcasts", label: "Podcasts" },
];

const matches = (query: string, ...fields: string[]) => fields.some((f) => f.toLowerCase().includes(query));

interface HomeBrowserProps {
  songs: Track[];
  albums: Collection[];
  artists: Collection[];
  shows: Collection[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function HomeBrowser({ songs, albums, artists, shows }: HomeBrowserProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const recent = useLibrary((s) => s.recent);
  const plays = useLibrary((s) => s.plays);

  const q = query.trim().toLowerCase();
  const wants = (f: Filter) => filter === "all" || filter === f;

  const songList = q ? songs.filter((t) => matches(q, t.title, t.artist, t.album)) : songs;
  const albumList = q ? albums.filter((a) => matches(q, a.name, a.subtitle)) : albums;
  const artistList = q ? artists.filter((a) => matches(q, a.name)) : artists;
  const showList = q ? shows.filter((s) => matches(q, s.name, s.subtitle)) : shows;

  const browsing = q === "" && filter === "all";
  const recentTracks = recent
    .map(getTrack)
    .filter((t): t is Track => t !== undefined)
    .slice(0, 5);
  const picks = madeForYou(plays, songs);

  const showSongs = wants("songs") && songList.length > 0;
  const showAlbums = wants("albums") && albumList.length > 0;
  const showArtists = wants("artists") && artistList.length > 0;
  const showPodcasts = wants("podcasts") && showList.length > 0;
  const empty = !showSongs && !showAlbums && !showArtists && !showPodcasts;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Home</h1>
        <label className="relative block">
          <span className="sr-only">Search songs, albums, artists and podcasts</span>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, albums, artists and podcasts"
            className="w-full rounded-full bg-white/10 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                filter === f.id ? "bg-white text-black" : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {browsing && recentTracks.length > 0 && (
        <Section title="Recently played">
          <TrackList tracks={recentTracks} />
        </Section>
      )}

      {browsing && (
        <Section title="Made for you">
          {picks.length > 0 ? (
            <TrackList tracks={picks} />
          ) : (
            <p className="text-sm text-white/60">Play a few songs and your picks will show up here.</p>
          )}
        </Section>
      )}

      {showSongs && (
        <Section title="Songs">
          <TrackList tracks={songList} />
        </Section>
      )}
      {showAlbums && (
        <Section title="Albums">
          <CollectionGrid items={albumList} base="album" />
        </Section>
      )}
      {showArtists && (
        <Section title="Artists">
          <CollectionGrid items={artistList} base="artist" />
        </Section>
      )}
      {showPodcasts && (
        <Section title="Podcasts">
          <CollectionGrid items={showList} base="podcast" />
        </Section>
      )}

      {empty && (
        <div className="py-12 text-center">
          <p className="text-lg font-medium">No results{q ? ` for "${query.trim()}"` : ""}</p>
          <p className="mt-1 text-sm text-white/60">Try a different word or change the filter.</p>
        </div>
      )}
    </div>
  );
}