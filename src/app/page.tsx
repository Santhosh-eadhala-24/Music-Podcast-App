import { HomeBrowser } from "@/components/HomeBrowser";
import { getAlbums, getArtists, getShows } from "@/lib/library";
import { TRACKS } from "@/lib/tracks";

export default function Home() {
  return <HomeBrowser songs={TRACKS} albums={getAlbums()} artists={getArtists()} shows={getShows()} />;
}