/**
 * Gaming Data Utilities
 * Type-safe utilities for working with gaming data
 */

export interface GameRatings {
  metacritic: number | null;
  steam: number | null;
  steamLabel: string | null;
}

export interface ReleaseInfo {
  year: number | null;
  developer: string | null;
  publisher: string | null;
  esrb: string | null;
}

export interface Game {
  id: string;
  name: string;
  platform: 'pc' | 'ps4' | 'ps5' | string;
  genre: string;
  launcher: string;
  synopsis: string;
  ratings: GameRatings;
  releaseInfo: ReleaseInfo;
  status: 'imported' | 'manual' | 'enriched';
  createdAt: string;
  updatedAt: string;
  // Optional enrichment fields
  coverUrl?: string;
  wallpaperUrl?: string;
  youtubeUrl?: string;
  hltbUrl?: string;
  customFields?: Record<string, unknown>;
}

export interface GameAnalytics {
  totalGames: number;
  byGenre: Array<{
    genre: string;
    count: number;
    avgMetacritic: string;
    avgSteam: string;
  }>;
  byPlatform: Array<{
    platform: string;
    count: number;
  }>;
  ratingDistribution: {
    excellent: number;
    good: number;
    average: number;
    below: number;
    unrated: number;
  };
  releaseYears: {
    min: number;
    max: number;
  };
}

/**
 * Filter games by genre
 */
export function filterByGenre(games: Game[], genre: string): Game[] {
  return games.filter(g => g.genre.toLowerCase() === genre.toLowerCase());
}

/**
 * Filter games by platform
 */
export function filterByPlatform(games: Game[], platform: string): Game[] {
  return games.filter(g => g.platform.toLowerCase() === platform.toLowerCase());
}

/**
 * Filter games by minimum rating
 */
export function filterByMinRating(games: Game[], minRating: number): Game[] {
  return games.filter(g => (g.ratings.metacritic ?? 0) >= minRating);
}

/**
 * Filter games by release year range
 */
export function filterByYearRange(games: Game[], minYear: number, maxYear: number): Game[] {
  return games.filter(g => {
    const year = g.releaseInfo.year ?? 0;
    return year >= minYear && year <= maxYear;
  });
}

/**
 * Sort games by rating (descending)
 */
export function sortByRating(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    const aRating = a.ratings.metacritic ?? 0;
    const bRating = b.ratings.metacritic ?? 0;
    return bRating - aRating;
  });
}

/**
 * Sort games by release year (descending)
 */
export function sortByYear(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    const aYear = a.releaseInfo.year ?? 0;
    const bYear = b.releaseInfo.year ?? 0;
    return bYear - aYear;
  });
}

/**
 * Sort games alphabetically
 */
export function sortByName(games: Game[]): Game[] {
  return [...games].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Group games by genre
 */
export function groupByGenre(games: Game[]): Record<string, Game[]> {
  return games.reduce((acc, game) => {
    if (!acc[game.genre]) {
      acc[game.genre] = [];
    }
    acc[game.genre].push(game);
    return acc;
  }, {} as Record<string, Game[]>);
}

/**
 * Group games by platform
 */
export function groupByPlatform(games: Game[]): Record<string, Game[]> {
  return games.reduce((acc, game) => {
    if (!acc[game.platform]) {
      acc[game.platform] = [];
    }
    acc[game.platform].push(game);
    return acc;
  }, {} as Record<string, Game[]>);
}

/**
 * Get unique genres
 */
export function getGenres(games: Game[]): string[] {
  return [...new Set(games.map(g => g.genre))].sort();
}

/**
 * Get unique platforms
 */
export function getPlatforms(games: Game[]): string[] {
  return [...new Set(games.map(g => g.platform))].sort();
}

/**
 * Calculate genre statistics
 */
export function getGenreStats(games: Game[]): Record<string, { count: number; avgRating: number }> {
  const grouped = groupByGenre(games);
  return Object.entries(grouped).reduce((acc, [genre, gamesInGenre]) => {
    const ratings = gamesInGenre
      .map(g => g.ratings.metacritic)
      .filter((r): r is number => r !== null);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
    acc[genre] = {
      count: gamesInGenre.length,
      avgRating: Math.round(avgRating * 10) / 10,
    };
    return acc;
  }, {} as Record<string, { count: number; avgRating: number }>);
}

/**
 * Export games as CSV
 */
export function exportAsCSV(games: Game[]): string {
  const headers = ['ID', 'Name', 'Platform', 'Genre', 'Year', 'Developer', 'Metacritic', 'Steam'];
  const rows = games.map(g => [
    g.id,
    `"${g.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
    g.platform,
    g.genre,
    g.releaseInfo.year ?? '',
    `"${(g.releaseInfo.developer || '').replace(/"/g, '""')}"`,
    g.ratings.metacritic ?? '',
    g.ratings.steam ?? '',
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

/**
 * Create a summary report
 */
export function generateReport(games: Game[]): string {
  const stats = {
    total: games.length,
    genres: getGenres(games).length,
    platforms: getPlatforms(games).length,
    avgRating: games
      .map(g => g.ratings.metacritic)
      .filter((r): r is number => r !== null)
      .reduce((a, b) => a + b, 0) / games.filter(g => g.ratings.metacritic).length,
  };

  return `
Gaming Data Report
==================
Total Games: ${stats.total}
Genres: ${stats.genres}
Platforms: ${stats.platforms}
Average Metacritic Rating: ${stats.avgRating.toFixed(1)}

Top Genres by Count:
${Object.entries(getGenreStats(games))
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 5)
  .map(([genre, stats]) => `  ${genre}: ${stats.count} games (avg: ${stats.avgRating})`)
  .join('\n')}
  `;
}
