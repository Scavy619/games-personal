import type { EnrichmentProvider, EnrichmentResult } from "@/lib/enrich/types";

interface TmdbSearchResult {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  overview: string | null;
  vote_average: number | null;
  genre_ids: number[];
}

const TMDB_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const TmdbProvider: EnrichmentProvider = {
  kind: "movie",
  name: "tmdb",

  async search(query: string): Promise<EnrichmentResult[]> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) throw new Error("TMDB_API_KEY is not configured");

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!res.ok) throw new Error(`TMDb search failed: ${res.status}`);
    const data = await res.json();
    const results: TmdbSearchResult[] = (data.results ?? []).slice(0, 6);

    return results.map((r) => {
      const year = r.release_date ? new Date(r.release_date).getFullYear() : undefined;
      const genre = r.genre_ids?.map((id) => TMDB_GENRES[id]).find(Boolean);
      const posterUrl = r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : undefined;

      return {
        candidate: {
          externalId: String(r.id),
          title: r.title,
          year,
          thumbnailUrl: posterUrl,
          subtitle: [year, genre].filter(Boolean).join(" · "),
          raw: r as unknown as Record<string, unknown>,
        },
        formFields: {
          title: r.title,
          genre,
          releaseYear: year,
          tmdbRating: r.vote_average ?? undefined,
          overview: r.overview ?? undefined,
          posterUrl,
        },
      };
    });
  },
};
