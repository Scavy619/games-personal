#!/usr/bin/env node
/**
 * Gaming Data Processor
 * Extracts and organizes games data from the raw export JSON
 * Creates separate organized files for easy enhancement and deployment
 */

const fs = require('fs');
const path = require('path');

const RAW_EXPORT = path.join(__dirname, '../games/raw-export.json');
const OUTPUT_DIR = path.join(__dirname, '../');

// Create output directories
const dirs = [
  path.join(OUTPUT_DIR, 'games/organized'),
  path.join(OUTPUT_DIR, 'games/by-genre'),
  path.join(OUTPUT_DIR, 'games/by-platform'),
  path.join(OUTPUT_DIR, 'games/by-rating'),
  path.join(OUTPUT_DIR, 'metadata'),
  path.join(OUTPUT_DIR, 'analytics'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Read raw data
const rawData = JSON.parse(fs.readFileSync(RAW_EXPORT, 'utf-8'));

// Process games
const games = rawData.map((game, index) => ({
  id: `game-${String(index + 1).padStart(4, '0')}`,
  name: game.name,
  platform: game.platform,
  genre: game.genre,
  launcher: game.launcher,
  synopsis: game.synopsis,
  ratings: {
    metacritic: game.metacritic,
    steam: game.steam,
    steamLabel: game.steam_label,
  },
  releaseInfo: {
    year: game.year,
    developer: game.dev,
    publisher: game.pub,
    esrb: game.esrb,
  },
  status: 'imported',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// Save organized all games
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'games/organized/all-games.json'),
  JSON.stringify(games, null, 2)
);

// Group by genre
const byGenre = {};
games.forEach(game => {
  if (!byGenre[game.genre]) byGenre[game.genre] = [];
  byGenre[game.genre].push(game);
});

Object.entries(byGenre).forEach(([genre, gamesInGenre]) => {
  const filename = genre.toLowerCase().replace(/\s+/g, '-') + '.json';
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `games/by-genre/${filename}`),
    JSON.stringify(gamesInGenre, null, 2)
  );
});

// Group by platform
const byPlatform = {};
games.forEach(game => {
  if (!byPlatform[game.platform]) byPlatform[game.platform] = [];
  byPlatform[game.platform].push(game);
});

Object.entries(byPlatform).forEach(([platform, gamesOnPlatform]) => {
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `games/by-platform/${platform}.json`),
    JSON.stringify(gamesOnPlatform, null, 2)
  );
});

// Calculate analytics
const analytics = {
  totalGames: games.length,
  byGenre: Object.entries(byGenre).map(([genre, gamesInGenre]) => ({
    genre,
    count: gamesInGenre.length,
    avgMetacritic: (gamesInGenre.reduce((sum, g) => sum + (g.ratings.metacritic || 0), 0) / gamesInGenre.length).toFixed(1),
    avgSteam: (gamesInGenre.reduce((sum, g) => sum + (g.ratings.steam || 0), 0) / gamesInGenre.length).toFixed(1),
  })),
  byPlatform: Object.entries(byPlatform).map(([platform, gamesOnPlatform]) => ({
    platform,
    count: gamesOnPlatform.length,
  })),
  ratingDistribution: {
    excellent: games.filter(g => g.ratings.metacritic >= 85).length,
    good: games.filter(g => g.ratings.metacritic >= 75 && g.ratings.metacritic < 85).length,
    average: games.filter(g => g.ratings.metacritic >= 65 && g.ratings.metacritic < 75).length,
    below: games.filter(g => g.ratings.metacritic < 65).length,
    unrated: games.filter(g => !g.ratings.metacritic).length,
  },
  releaseYears: {
    min: Math.min(...games.map(g => g.releaseInfo.year || Infinity)),
    max: Math.max(...games.map(g => g.releaseInfo.year || 0)),
  },
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'analytics/games-analytics.json'),
  JSON.stringify(analytics, null, 2)
);

// Create metadata
const metadata = {
  dataSource: 'games-personal repository',
  extractedAt: new Date().toISOString(),
  version: '1.0.0',
  schema: {
    game: {
      id: 'unique identifier',
      name: 'game title',
      platform: 'pc | ps4 | ps5',
      genre: 'game genre',
      launcher: 'distribution platform',
      synopsis: 'game description',
      ratings: {
        metacritic: 'critic rating 0-100',
        steam: 'steam rating 0-100',
        steamLabel: 'steam rating label',
      },
      releaseInfo: {
        year: 'release year',
        developer: 'developer name',
        publisher: 'publisher name',
        esrb: 'age rating',
      },
      status: 'imported | manual | enriched',
      timestamps: 'ISO 8601 format',
    },
  },
  directories: {
    'games/organized': 'Complete games dataset',
    'games/by-genre': 'Games organized by genre',
    'games/by-platform': 'Games organized by platform',
    'analytics': 'Analytics and statistics',
    'metadata': 'Schema and documentation',
  },
  stats: analytics,
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'metadata/SCHEMA.json'),
  JSON.stringify(metadata, null, 2)
);

console.log('✓ Gaming data processed successfully!');
console.log(`✓ Processed ${games.length} games`);
console.log(`✓ Organized into ${Object.keys(byGenre).length} genres`);
console.log(`✓ Organized into ${Object.keys(byPlatform).length} platforms`);
console.log('\nOutput structure:');
console.log('  gaming-data/');
console.log('  ├── games/');
console.log('  │   ├── organized/all-games.json');
console.log('  │   ├── by-genre/*.json');
console.log('  │   └── by-platform/*.json');
console.log('  ├── analytics/games-analytics.json');
console.log('  └── metadata/SCHEMA.json');
