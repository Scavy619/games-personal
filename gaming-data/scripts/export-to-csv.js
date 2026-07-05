#!/usr/bin/env node
/**
 * Export gaming data to CSV format
 * Useful for spreadsheet analysis and data enrichment
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '../games/organized/all-games.json');
const OUTPUT = process.argv[3] || path.join(__dirname, '../exports/games.csv');

// Create output directory if it doesn't exist
const outputDir = path.dirname(OUTPUT);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read games
const games = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

// CSV headers and field extraction
const headers = [
  'ID',
  'Name',
  'Platform',
  'Genre',
  'Year',
  'Developer',
  'Publisher',
  'ESRB',
  'Metacritic',
  'Steam',
  'Steam Label',
  'Launcher',
  'Synopsis',
  'Status',
];

// Escape CSV field value
function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Build CSV rows
const rows = games.map(game => [
  game.id,
  game.name,
  game.platform,
  game.genre,
  game.releaseInfo.year || '',
  game.releaseInfo.developer || '',
  game.releaseInfo.publisher || '',
  game.releaseInfo.esrb || '',
  game.ratings.metacritic || '',
  game.ratings.steam || '',
  game.ratings.steamLabel || '',
  game.launcher,
  game.synopsis.substring(0, 100) + (game.synopsis.length > 100 ? '...' : ''),
  game.status,
].map(escapeCsv));

// Write CSV
const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
fs.writeFileSync(OUTPUT, csv);

console.log(`✓ Exported ${games.length} games to CSV`);
console.log(`✓ Output: ${OUTPUT}`);
