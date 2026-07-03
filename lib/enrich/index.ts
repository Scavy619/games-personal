import type { EnrichmentProvider } from "@/lib/enrich/types";
import { RawgProvider } from "@/lib/enrich/rawg";
import { TmdbProvider } from "@/lib/enrich/tmdb";

export function getProvider(kind: "game" | "movie"): EnrichmentProvider {
  return kind === "game" ? RawgProvider : TmdbProvider;
}
