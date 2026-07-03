import type { Game } from "@/lib/generated/prisma/client";
import { platformLabel } from "@/lib/utils";

function countBy<T>(items: T[], key: (item: T) => string | null | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

export function platformSplit(games: Game[]) {
  const counts = countBy(games, (g) => g.platform);
  const labels = [...counts.keys()];
  return { labels: labels.map(platformLabel), data: labels.map((l) => counts.get(l) ?? 0) };
}

export function genreBreakdown(games: Game[], top = 10) {
  const counts = countBy(games, (g) => g.genre);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
  return { labels: sorted.map(([g]) => g), data: sorted.map(([, c]) => c) };
}

export function scoreDistribution(games: Game[]) {
  const bands = [
    { label: "90-100", min: 90, max: 100 },
    { label: "80-89", min: 80, max: 89 },
    { label: "70-79", min: 70, max: 79 },
    { label: "60-69", min: 60, max: 69 },
    { label: "<60", min: 0, max: 59 },
  ];
  const data = bands.map(
    (b) => games.filter((g) => g.metacritic != null && g.metacritic >= b.min && g.metacritic <= b.max).length,
  );
  return { labels: bands.map((b) => b.label), data };
}

export function steamSentiment(games: Game[]) {
  const order = [
    "Overwhelmingly Positive",
    "Very Positive",
    "Mostly Positive",
    "Mixed",
    "Mostly Negative",
  ];
  const counts = countBy(games, (g) => g.steamLabel);
  return { labels: order, data: order.map((l) => counts.get(l) ?? 0) };
}

export function top15Metacritic(games: Game[]) {
  const ranked = games
    .filter((g) => g.metacritic != null)
    .sort((a, b) => (b.metacritic ?? 0) - (a.metacritic ?? 0))
    .slice(0, 15);
  return { labels: ranked.map((g) => g.name), data: ranked.map((g) => g.metacritic ?? 0) };
}

export function gamesByYear(games: Game[]) {
  const counts = countBy(games, (g) => (g.year ? String(g.year) : null));
  const years = [...counts.keys()].sort();
  return { labels: years, data: years.map((y) => counts.get(y) ?? 0) };
}

export function launcherSplit(games: Game[]) {
  const counts = countBy(games, (g) => g.launcher);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return { labels: sorted.map(([l]) => l), data: sorted.map(([, c]) => c) };
}

export function avgMetacriticPerGenre(games: Game[]) {
  const byGenre = new Map<string, number[]>();
  for (const g of games) {
    if (g.metacritic == null) continue;
    const list = byGenre.get(g.genre) ?? [];
    list.push(g.metacritic);
    byGenre.set(g.genre, list);
  }
  const rows = [...byGenre.entries()]
    .map(([genre, scores]) => ({
      genre,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .sort((a, b) => b.avg - a.avg);
  return { labels: rows.map((r) => r.genre), data: rows.map((r) => r.avg) };
}
