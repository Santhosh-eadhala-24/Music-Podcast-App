import Link from "next/link";
import { TrackList } from "@/components/Tracklist";
import { TRACKS } from "@/lib/tracks";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Home</h1>
      <Link href="/about" className="mt-2 inline-block text-blue-500 underline">
        Go to About
      </Link>
      <div className="mt-6">
        <TrackList tracks={TRACKS} />
      </div>
    </div>
  );
}