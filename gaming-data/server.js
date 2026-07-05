#!/usr/bin/env node
/**
 * Gaming Data Local Server
 * Simple Express server to browse and interact with gaming data
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Load games data
const games = JSON.parse(fs.readFileSync(path.join(__dirname, 'games/organized/all-games.json'), 'utf-8'));

// API Routes
app.get('/api/games', (req, res) => {
  let filtered = [...games];

  // Filter by genre
  if (req.query.genre) {
    filtered = filtered.filter(g => g.genre === req.query.genre);
  }

  // Filter by platform
  if (req.query.platform) {
    filtered = filtered.filter(g => g.platform === req.query.platform);
  }

  // Filter by rating
  if (req.query.minRating) {
    const minRating = parseInt(req.query.minRating);
    filtered = filtered.filter(g => (g.ratings.metacritic || 0) >= minRating);
  }

  // Sort
  if (req.query.sort === 'rating') {
    filtered.sort((a, b) => (b.ratings.metacritic || 0) - (a.ratings.metacritic || 0));
  } else if (req.query.sort === 'year') {
    filtered.sort((a, b) => (b.releaseInfo.year || 0) - (a.releaseInfo.year || 0));
  } else if (req.query.sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const start = (page - 1) * limit;
  const paginatedGames = filtered.slice(start, start + limit);

  res.json({
    total: filtered.length,
    page,
    limit,
    pages: Math.ceil(filtered.length / limit),
    games: paginatedGames,
  });
});

// Get genres
app.get('/api/genres', (req, res) => {
  const genres = [...new Set(games.map(g => g.genre))].sort();
  res.json(genres);
});

// Get platforms
app.get('/api/platforms', (req, res) => {
  const platforms = [...new Set(games.map(g => g.platform))].sort();
  res.json(platforms);
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  const analytics = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'analytics/games-analytics.json'), 'utf-8')
  );
  res.json(analytics);
});

// Get single game
app.get('/api/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', games: games.length });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(70));
  console.log('🎮 Gaming Data Server Started');
  console.log('═'.repeat(70));
  console.log(`\n✅ Server running at: http://localhost:${PORT}`);
  console.log(`\n📊 Database: ${games.length} games loaded`);
  console.log('\n📡 API Endpoints:');
  console.log(`   GET /api/games                  - Browse games (paginated)`);
  console.log(`   GET /api/games/:id             - Get single game`);
  console.log(`   GET /api/genres                - Get all genres`);
  console.log(`   GET /api/platforms             - Get all platforms`);
  console.log(`   GET /api/analytics             - Get analytics`);
  console.log(`\n🔍 Query Parameters (for /api/games):`);
  console.log(`   ?genre=RPG                     - Filter by genre`);
  console.log(`   ?platform=pc                   - Filter by platform`);
  console.log(`   ?minRating=80                  - Filter by min rating`);
  console.log(`   ?sort=rating|year|name        - Sort results`);
  console.log(`   ?page=1&limit=20               - Pagination`);
  console.log('\n💾 Example Queries:');
  console.log(`   GET /api/games?genre=RPG&sort=rating&limit=10`);
  console.log(`   GET /api/games?platform=ps5&minRating=75`);
  console.log(`   GET /api/games?sort=year&page=1&limit=30`);
  console.log('\n' + '═'.repeat(70));
  console.log('Press Ctrl+C to stop the server\n');
});
