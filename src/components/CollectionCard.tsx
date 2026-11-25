import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/library";

interface CollectionGridProps {
  items: Collection[];
  base: "album" | "artist" | "podcast";
}

export function CollectionGrid({ items, base }: CollectionGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <li key={item.slug}>
          <Link href={`/${base}/${item.slug}`} className="block rounded-lg p-2 transition-colors hover:bg-white/10">
            <Image
              src={item.cover}
              alt=""
              width={200}
              height={200}
              className={`aspect-square w-full object-cover ${base === "artist" ? "rounded-full" : "rounded-md"}`}
            />
            <p className="mt-2 truncate text-sm font-medium">{item.name}</p>
            <p className="truncate text-xs text-white/60">{item.subtitle}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}