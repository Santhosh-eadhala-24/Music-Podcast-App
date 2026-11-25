import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/CollectionHeader";
import { TrackList } from "@/components/TrackList";
import { getAlbum, getAlbums, slugify } from "@/lib/library";

export function generateStaticParams() {
  return getAlbums().map((album) => ({ slug: album.slug }));
}

export default async function AlbumPage({ params }: PageProps<"/album/[slug]">) {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  const count = album.tracks.length;
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-white/60 hover:text-white">
        ← Home
      </Link>
      <div className="mt-4">
        <CollectionHeader
          item={album}
          kind="Album"
          detail={`${album.subtitle} · ${count} ${count === 1 ? "song" : "songs"}`}
        />
      </div>
      <div className="mt-8">
        <TrackList tracks={album.tracks} />
      </div>
      <p className="mt-6 text-sm">
        <Link href={`/artist/${slugify(album.subtitle)}`} className="text-emerald-400 hover:underline">
          More by {album.subtitle}
        </Link>
      </p>
    </div>
  );
}