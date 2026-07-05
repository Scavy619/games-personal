# Gaming Data Repository

A structured, version-controlled gaming data directory designed for enhancement, maintenance, and deployment to multiple websites.

## Directory Structure

```
gaming-data/
├── games/
│   ├── raw-export.json              # Original unprocessed data (787 games)
│   ├── organized/
│   │   └── all-games.json           # Complete dataset, normalized
│   ├── by-genre/                    # Games organized by genre
│   │   ├── action-adventure.json
│   │   ├── action-rpg.json
│   │   ├── rpg.json
│   │   └── ... (16 genres total)
│   └── by-platform/                 # Games organized by platform
│       ├── pc.json
│       ├── ps4.json
│       └── ps5.json
│
├── analytics/
│   └── games-analytics.json         # Statistics and insights
│
├── metadata/
│   └── SCHEMA.json                  # Data schema and documentation
│
├── lib/
│   ├── gaming-data.ts               # TypeScript utilities
│   └── gaming-data.js               # Compiled JavaScript
│
├── scripts/
│   ├── process-games-data.js        # Data processor script
│   ├── export-to-csv.js             # CSV export utility
│   ├── sync-from-db.js              # Sync from Prisma DB
│   └── validate-data.js             # Data validation
│
└── README.md                         # This file

```

## Quick Stats

- **Total Games**: 787
- **Genres**: 16
- **Platforms**: 3 (PC, PS4, PS5)
- **Data Extracted**: 2026-07-05

### Genre Distribution

| Genre | Count | Avg Rating |
|-------|-------|------------|
| Action | 145 | 75.2 |
| RPG | 98 | 78.1 |
| Strategy | 67 | 79.8 |
| First-Person Shooter | 54 | 76.5 |
| Adventure | 49 | 77.3 |
| ... | ... | ... |

## Game Schema

Each game record follows this structure:

```typescript
interface Game {
  id: string;                    // Unique identifier (game-0001)
  name: string;                  // Game title
  platform: 'pc' | 'ps4' | 'ps5';
  genre: string;                 // Primary genre
  launcher: string;              // Distribution platform (Steam, Epic, etc.)
  synopsis: string;              // Game description
  
  ratings: {
    metacritic: number | null;   // Critic score (0-100)
    steam: number | null;        // Steam rating (0-100)
    steamLabel: string | null;   // Rating label (Very Positive, etc.)
  };
  
  releaseInfo: {
    year: number | null;
    developer: string | null;
    publisher: string | null;
    esrb: string | null;         // Age rating
  };
  
  status: 'imported' | 'manual' | 'enriched';
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  
  // Optional enrichment fields (added during enhancement)
  coverUrl?: string;
  wallpaperUrl?: string;
  youtubeUrl?: string;
  hltbUrl?: string;
  customFields?: Record<string, unknown>;
}
```

## Usage

### Working with Data in Node.js/TypeScript

```typescript
import { Game, sortByRating, filterByGenre, getGenreStats } from './lib/gaming-data';

// Load games
const games: Game[] = require('./games/organized/all-games.json');

// Filter
const actionGames = filterByGenre(games, 'Action');
const topRated = sortByRating(games).slice(0, 10);

// Analyze
const stats = getGenreStats(games);
console.log(stats);

// Export
import { exportAsCSV } from './lib/gaming-data';
const csv = exportAsCSV(topRated);
```

### Processing Data

Process and reorganize all data:
```bash
node scripts/process-games-data.js
```

### Validation

Validate data integrity:
```bash
node scripts/validate-data.js
```

### Export Formats

Export to CSV:
```bash
node scripts/export-to-csv.js --output gaming-data.csv
```

## Enhancement Workflow

### Adding New Games

1. Add entry to `games/organized/all-games.json`:
```json
{
  "id": "game-0788",
  "name": "New Game Title",
  "platform": "pc",
  "genre": "Action",
  ...
}
```

2. Re-run data processor:
```bash
node scripts/process-games-data.js
```

3. Data is automatically reorganized by genre and platform

### Enriching Games

Add metadata to individual game records:

```json
{
  "id": "game-0001",
  "name": "Game Title",
  ...
  "status": "enriched",
  "coverUrl": "https://...",
  "wallpaperUrl": "https://...",
  "youtubeUrl": "https://...",
  "customFields": {
    "playTime": "120 hours",
    "personalRating": 9,
    "recommendation": "Must play"
  }
}
```

### Syncing from Database

Sync latest data from the Prisma database:
```bash
node scripts/sync-from-db.js
```

## Deployment

This data folder is ready to be deployed to other websites:

1. **Static Export**: Use any JSON file directly as API response
2. **Database Import**: Use the normalized format to seed other databases
3. **Git Sync**: Push this folder to another git repo for multi-site sync
4. **API Server**: Serve files through a static file server

### For Another Website

```typescript
// Load gaming data
const games = await fetch('/gaming-data/games/organized/all-games.json')
  .then(r => r.json());

// Use utilities
import { filterByGenre, sortByRating } from '/gaming-data/lib/gaming-data';
const featured = sortByRating(filterByGenre(games, 'RPG')).slice(0, 5);
```

## Git Workflow

This folder is designed to be:

- **Versioned**: All data changes tracked in git
- **Shareable**: Push to another repo for multi-site use
- **Reviewable**: Easy to see what games/data changed
- **Mergeable**: Supports collaboration and updates

```bash
# Track changes
git add gaming-data/
git commit -m "feat: add 10 new games and enhance ratings"

# Share with another site
git push origin gaming-data-release
```

## Maintenance

### Regular Tasks

- [ ] Validate all games quarterly (`scripts/validate-data.js`)
- [ ] Update ratings from sources quarterly
- [ ] Archive old/deleted games to a separate folder
- [ ] Update metadata when schema changes

### Monitoring

Check analytics for data quality:
```bash
cat analytics/games-analytics.json | jq '.ratingDistribution'
```

## Contributing

When enhancing data:

1. Update in `games/organized/all-games.json`
2. Run data processor to reorganize
3. Run validation to ensure data integrity
4. Commit with clear message describing changes
5. Push to trigger deployment pipeline

## License & Attribution

- **Data Source**: Scavy B2 Portfolio (games-personal)
- **Format**: JSON (easily convertible to other formats)
- **Usage**: Ready for deployment to other websites and portfolios

---

**Last Updated**: 2026-07-05
**Version**: 1.0.0
**Maintainer**: Scavy (@Scavy619)
