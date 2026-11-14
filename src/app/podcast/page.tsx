import { CollectionGrid } from "@/components/CollectionCard";
import { getShows } from "@/lib/library";

export default function PodcastsPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Podcasts</h1>
      <div className="mt-4">
        <CollectionGrid items={getShows()} base="podcast" />
      </div>
    </div>
  );
}
