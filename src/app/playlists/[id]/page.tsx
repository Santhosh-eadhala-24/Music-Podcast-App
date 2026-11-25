import { Suspense } from "react";
import { PlaylistView } from "@/components/PlaylistView";

export default function PlaylistPage({ params }: PageProps<"/playlist/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-white/60">Loading…</p>}>
      <PlaylistView params={params} />
    </Suspense>
  );
}
