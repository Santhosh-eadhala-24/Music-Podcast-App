"use client";

import Link from "next/link";
import { use } from "react";
import { getTrack } from "@/lib/library";
import type { Track } from "@/lib/types";
import { useLibrary } from "@/store/library";
import { PlayAllButton } from "./PlayAllButton";
import { TrackList } from "./TrackList";

export function PlaylistView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const playlist = useLibrary((s) => s.playlists.find((p) => p.id === id));
  const hydrated = useLibrary((s) => s.hydrated);

  if (!hydrated) return <p className="p-6 text-sm text-white/60">Loading…</p>;

  if (!playlist) {
    return (
      <div className="p-6">
        <p>This playlist doesn&apos;t exist.</p>
        <Link href="/playlists" className="mt-2 inline-block text-emerald-400 hover:underline">
          Back to playlists
        </Link>
      </div>
    );
  }

  const tracks = playlist.trackIds.map(getTrack).filter((t): t is Track => t !== undefined);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/playlists" className="text-sm text-white/60 hover:text-white">
        ← Playlists
      </Link>
      <h1 className="mt-4 text-4xl font-bold">{playlist.name}</h1>
      <p className="mt-2 text-sm text-white/60">
        {tracks.length} {tracks.length === 1 ? "song" : "songs"}
      </p>
      <div className="mt-4">
        <PlayAllButton tracks={tracks} />
      </div>
      <div className="mt-8">
        {tracks.length === 0 ? (
          <p className="text-sm text-white/60">
            Nothing here yet. Use the ⋮ menu on any song and choose &quot;Add to playlist&quot;.
          </p>
        ) : (
          <TrackList tracks={tracks} playlistId={playlist.id} />
        )}
      </div>
    </div>
  );
}