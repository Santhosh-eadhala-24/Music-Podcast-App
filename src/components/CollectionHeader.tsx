import Image from "next/image";
import type { Collection } from "@/lib/library";
import { PlayAllButton } from "./PlayAllButton";

interface CollectionHeaderProps {
  item: Collection;
  kind: "Album" | "Artist" | "Podcast";
  detail: string;
}

export function CollectionHeader({ item, kind, detail }: CollectionHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
      <Image
        src={item.cover}
        alt=""
        width={192}
        height={192}
        className={`size-48 object-cover shadow-lg ${kind === "Artist" ? "rounded-full" : "rounded-lg"}`}
      />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-white/60">{kind}</p>
        <h1 className="mt-1 text-4xl font-bold">{item.name}</h1>
        <p className="mt-2 text-sm text-white/60">{detail}</p>
        <div className="mt-4">
          <PlayAllButton tracks={item.tracks} />
        </div>
      </div>
    </header>
  );
}