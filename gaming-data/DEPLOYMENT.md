# Deployment Guide

This guide explains how to deploy the gaming data to other websites and applications.

## Quick Start

### Option 1: Direct JSON File Usage

Simply copy the JSON files and use them directly in your application:

```javascript
// In your Next.js or React app
import games from '@/data/games/organized/all-games.json';

export default function GamesPage() {
  return (
    <div>
      {games.map(game => (
        <div key={game.id}>
          <h3>{game.name}</h3>
          <p>{game.synopsis}</p>
          <p>Rating: {game.ratings.metacritic}</p>
        </div>
      ))}
    </div>
  );
}
```

### Option 2: Import Utilities

Use the TypeScript utilities for filtering and sorting:

```typescript
import { Game, sortByRating, filterByGenre, getGenreStats } from './lib/gaming-data';

const topGames = sortByRating(games).slice(0, 10);
const rpgGames = filterByGenre(games, 'RPG');
const stats = getGenreStats(games);
```

### Option 3: Database Seeding

Seed another database with normalized data:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const games = require('./games/organized/all-games.json');

async function seed() {
  for (const game of games) {
    await prisma.game.create({
      data: {
        name: game.name,
        platform: game.platform,
        genre: game.genre,
        launcher: game.launcher,
        synopsis: game.synopsis,
        metacritic: game.ratings.metacritic,
        steam: game.ratings.steam,
        year: game.releaseInfo.year,
        dev: game.releaseInfo.developer,
        pub: game.releaseInfo.publisher,
        esrb: game.releaseInfo.esrb,
        source: 'import',
        extra: game.customFields,
      },
    });
  }
}
```

## Deployment Scenarios

### Scenario 1: Another Portfolio Website

1. **Copy gaming-data folder** to your new project:
```bash
cp -r gaming-data /path/to/other-website/
```

2. **Import in your pages**:
```typescript
import { Game } from './gaming-data/lib/gaming-data';
import games from './gaming-data/games/organized/all-games.json';

export default function Games() {
  return games.map(game => <GameCard key={game.id} game={game} />);
}
```

### Scenario 2: Shared Git Submodule

Use this as a git submodule in multiple projects:

```bash
# In your new project
git submodule add https://github.com/Scavy619/games-personal gaming-data

# Update all submodules
git submodule update --remote
```

### Scenario 3: NPM Package

Publish as an npm package (optional):

```bash
# In gaming-data folder
npm login
npm publish
```

Then in other projects:
```bash
npm install @scavy/gaming-data
```

```typescript
import { games, getGenreStats, filterByGenre } from '@scavy/gaming-data';
```

### Scenario 4: Static File Server

Serve files through a CDN or static host:

```bash
# Build/prepare for deployment
npm run build
npm run validate

# Deploy gaming-data/ folder to any static hosting:
# - Vercel: Add to public/data/
# - AWS S3: Upload entire folder
# - GitHub Pages: Push to docs/
```

Access via URLs:
```
https://yourdomain.com/data/games/organized/all-games.json
https://yourdomain.com/data/games/by-genre/action.json
https://yourdomain.com/data/analytics/games-analytics.json
```

## Integration Examples

### Next.js 16 Static Generation

```typescript
// app/games/page.tsx
import games from '@/gaming-data/games/organized/all-games.json';
import { sortByRating } from '@/gaming-data/lib/gaming-data';

export default function GamesPage() {
  const featured = sortByRating(games).slice(0, 20);
  
  return (
    <section>
      <h1>Games Collection</h1>
      <div className="grid">
        {featured.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
```

### React App

```typescript
// src/hooks/useGames.ts
import { useState, useEffect } from 'react';
import type { Game } from '../data/gaming-data';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/games/organized/all-games.json')
      .then(r => r.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      });
  }, []);

  return { games, loading };
}
```

### REST API (Express/Node)

```typescript
// routes/api/games.ts
import express from 'express';
import games from '../../gaming-data/games/organized/all-games.json';
import { filterByGenre, sortByRating } from '../../gaming-data/lib/gaming-data';

const router = express.Router();

router.get('/all', (req, res) => {
  res.json(games);
});

router.get('/genre/:genre', (req, res) => {
  const filtered = filterByGenre(games, req.params.genre);
  res.json(filtered);
});

router.get('/top', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const top = sortByRating(games).slice(0, limit);
  res.json(top);
});

export default router;
```

## Data Sync Strategy

### Keep Multiple Sites in Sync

1. **Primary repo** (this one): games-personal
2. **Publishing**: Push gaming-data to shared branch or submodule
3. **Consuming sites**: Pull or update submodule

```bash
# In primary repo
git add gaming-data/
git commit -m "Update gaming data"
git push origin main

# In consuming repo with submodule
git pull origin main
git submodule update --remote
```

## Maintenance & Updates

### Regular Update Workflow

```bash
# 1. Make changes in primary repo
cd /path/to/games-personal
# ... add/enhance games ...

# 2. Validate data
npm run validate

# 3. Export if needed
npm run export:csv

# 4. Commit changes
git add gaming-data/
git commit -m "feat: add 5 new games and update ratings"
git push origin main

# 5. Update consuming sites (if using submodules)
cd /path/to/other-website
git submodule update --remote
git add .gitmodules
git commit -m "chore: update gaming-data submodule"
git push
```

## Automation

### GitHub Actions (Optional)

Create `.github/workflows/sync-gaming-data.yml`:

```yaml
name: Sync Gaming Data

on:
  push:
    paths:
      - 'gaming-data/**'
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate data
        run: |
          cd gaming-data
          npm install
          npm run validate
      
      - name: Deploy to other site
        run: |
          # Your deployment commands here
          # e.g., sync to S3, trigger rebuilds, etc.
```

## Performance Considerations

- **JSON files** are ready to use but best for <5MB datasets
- **For larger datasets**: Consider splitting by genre/platform (already done!)
- **Caching**: Cache JSON responses with appropriate headers
- **Compression**: Serve `.json.gz` from CDN for faster transfer

## Security & Privacy

- No sensitive data in gaming-data folder ✓
- Safe to publish publicly ✓
- Ready for open-source sharing ✓
- No authentication required ✓

---

For questions or deployment issues, refer to README.md or create an issue.
