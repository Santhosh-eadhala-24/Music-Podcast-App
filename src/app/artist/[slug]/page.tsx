import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/CollectionHeader";
import { TrackList } from "@/components/TrackList";
import { getArtist, getArtists } from "@/lib/library";

export function generateStaticParams() {
  return getArtists().map((artist) => ({ slug: artist.slug }));
}

export default async function ArtistPage({ params }: PageProps<"/artist/[slug]">) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const count = artist.tracks.length;
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-white/60 hover:text-white">
        ← Home
      </Link>
      <div className="mt-4">
        <CollectionHeader item={artist} kind="Artist" detail={`${count} ${count === 1 ? "song" : "songs"}`} />
      </div>
      <div className="mt-8">
        <TrackList tracks={artist.tracks} />
      </div>
    </div>
  );
}