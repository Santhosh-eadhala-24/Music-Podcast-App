import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/CollectionHeader";
import { TrackList } from "@/components/TrackList";
import { getShow, getShows } from "@/lib/library";

export function generateStaticParams() {
  return getShows().map((show) => ({ slug: show.slug }));
}

export default async function PodcastPage({ params }: PageProps<"/podcast/[slug]">) {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) notFound();

  const count = show.tracks.length;
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/podcasts" className="text-sm text-white/60 hover:text-white">
        ← Podcasts
      </Link>
      <div className="mt-4">
        <CollectionHeader
          item={show}
          kind="Podcast"
          detail={`${show.subtitle} · ${count} ${count === 1 ? "episode" : "episodes"}`}
        />
      </div>
      <div className="mt-8">
        <TrackList tracks={show.tracks} />
      </div>
    </div>
  );
}