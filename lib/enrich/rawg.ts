import type { EnrichmentProvider, EnrichmentResult } from "@/lib/enrich/types";

interface RawgSearchResult {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
  metacritic: number | null;
  genres: { name: string }[];
  esrb_rating: { name: string } | null;
}

interface RawgDetail extends RawgSearchResult {
  developers: { name: string }[];
  publishers: { name: string }[];
  description_raw: string;
}

const ESRB_MAP: Record<string, string> = {
  Everyone: "E",
  "Everyone 10+": "E10+",
  Teen: "T",
  Mature: "M",
  "Adults Only": "AO",
};

export const RawgProvider: EnrichmentProvider = {
  kind: "game",
  name: "rawg",

  async search(query: string): Promise<EnrichmentResult[]> {
    const apiKey = process.env.RAWG_API_KEY;
    if (!apiKey) throw new Error("RAWG_API_KEY is not configured");

    const searchRes = await fetch(
      `https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&page_size=6&key=${apiKey}`,
    );
    if (!searchRes.ok) throw new Error(`RAWG search failed: ${searchRes.status}`);
    const searchData = await searchRes.json();
    const results: RawgSearchResult[] = searchData.results ?? [];

    const details = await Promise.all(
      results.map(async (r) => {
        try {
          const detailRes = await fetch(`https://api.rawg.io/api/games/${r.id}?key=${apiKey}`);
          if (!detailRes.ok) return r as RawgDetail;
          return (await detailRes.json()) as RawgDetail;
        } catch {
          return r as RawgDetail;
        }
      }),
    );

    return details.map((d) => {
      const year = d.released ? new Date(d.released).getFullYear() : undefined;
      const genre = d.genres?.[0]?.name;
      return {
        candidate: {
          externalId: String(d.id),
          title: d.name,
          year,
          thumbnailUrl: d.background_image ?? undefined,
          subtitle: [year, genre].filter(Boolean).join(" · "),
          raw: d as unknown as Record<string, unknown>,
        },
        formFields: {
          name: d.name,
          genre,
          metacritic: d.metacritic ?? undefined,
          year,
          dev: d.developers?.[0]?.name,
          pub: d.publishers?.[0]?.name,
          esrb: d.esrb_rating ? ESRB_MAP[d.esrb_rating.name] ?? d.esrb_rating.name : undefined,
          coverUrl: d.background_image ?? undefined,
          synopsis: d.description_raw?.slice(0, 600),
        },
      };
    });
  },
};
