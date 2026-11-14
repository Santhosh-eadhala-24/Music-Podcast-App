"use client";

import { Check, ListMusic, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLibrary } from "@/store/library";

export function PlaylistsView() {
  const playlists = useLibrary((s) => s.playlists);
  const hydrated = useLibrary((s) => s.hydrated);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  function create(e: React.FormEvent) {
    e.preventDefault();
    useLibrary.getState().createPlaylist(name);
    setName("");
  }

  function saveRename(e: React.FormEvent, id: string) {
    e.preventDefault();
    useLibrary.getState().renamePlaylist(id, draft);
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Playlists</h1>

      <form onSubmit={create} className="mt-4 flex gap-2">
        <input
          value={name}
          maxLength={40}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name a new playlist"
          aria-label="New playlist name"
          className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black">
          Create
        </button>
      </form>

      {!hydrated ? (
        <p className="mt-8 text-sm text-white/60">Loading…</p>
      ) : playlists.length === 0 ? (
        <p className="mt-8 text-sm text-white/60">No playlists yet. Create one above, or use the ⋮ menu on any song.</p>
      ) : (
        <ul className="mt-6 divide-y divide-white/5">
          {playlists.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2">
              <div className="flex size-12 shrink-0 items-center justify-center rounded bg-white/10 text-white/60">
                <ListMusic size={20} />
              </div>

              {editing === p.id ? (
                <form onSubmit={(e) => saveRename(e, p.id)} className="flex min-w-0 flex-1 gap-2">
                  <input
                    autoFocus
                    value={draft}
                    maxLength={40}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                    aria-label="Playlist name"
                    className="min-w-0 flex-1 rounded-md bg-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    aria-label="Save name"
                    className="rounded-full p-2 text-emerald-400 hover:bg-white/10"
                  >
                    <Check size={16} />
                  </button>
                </form>
              ) : (
                <Link href={`/playlist/${p.id}`} className="min-w-0 flex-1 rounded-lg px-1 py-1 hover:bg-white/5">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block text-xs text-white/60">
                    {p.trackIds.length} {p.trackIds.length === 1 ? "song" : "songs"}
                  </span>
                </Link>
              )}

              {deleting === p.id ? (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-white/70">Delete?</span>
                  <button
                    type="button"
                    aria-label="Confirm delete"
                    onClick={() => {
                      useLibrary.getState().deletePlaylist(p.id);
                      setDeleting(null);
                    }}
                    className="rounded-full p-2 text-red-400 hover:bg-white/10"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel delete"
                    onClick={() => setDeleting(null)}
                    className="rounded-full p-2 text-white/60 hover:bg-white/10"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-label={`Rename ${p.name}`}
                    onClick={() => {
                      setDraft(p.name);
                      setEditing(p.id);
                    }}
                    className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${p.name}`}
                    onClick={() => setDeleting(p.id)}
                    className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}