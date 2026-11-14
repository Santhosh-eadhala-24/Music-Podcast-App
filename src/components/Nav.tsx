"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home", prefixes: [] as string[] },
  { href: "/playlists", label: "Playlists", prefixes: ["/playlist/"] },
  { href: "/podcasts", label: "Podcasts", prefixes: ["/podcast/"] },
  { href: "/about", label: "About", prefixes: [] as string[] },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
      <ul className="mx-auto flex max-w-4xl gap-1 px-4 py-2 text-sm">
        {LINKS.map((link) => {
          const active = pathname === link.href || link.prefixes.some((p) => pathname.startsWith(p));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  active ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}