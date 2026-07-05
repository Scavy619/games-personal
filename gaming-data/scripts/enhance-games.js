#!/usr/bin/env node
/**
 * Gaming Data Enhancement Script
 * Template for adding enrichment data to games
 *
 * Usage:
 *   node enhance-games.js --game-id <id> --add-field <key> <value>
 *   node enhance-games.js --batch <file> (batch enhancement from JSON)
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '../games/organized/all-games.json');
const OUTPUT = INPUT; // Overwrite original

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Gaming Data Enhancement Tool');
  console.log('');
  console.log('Usage:');
  console.log('  Add single field:');
  console.log('    node enhance-games.js --game-id <id> --add-field <key> <value>');
  console.log('');
  console.log('  Examples:');
  console.log('    node enhance-games.js --game-id game-0001 --add-field coverUrl https://example.com/cover.jpg');
  console.log('    node enhance-games.js --game-id game-0001 --add-field youtubeUrl https://youtube.com/watch?v=...');
  console.log('    node enhance-games.js --game-id game-0001 --set-status enriched');
  console.log('');
  console.log('  Batch enhancement:');
  console.log('    node enhance-games.js --batch enhancements.json');
  process.exit(0);
}

// Read games
let games = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

// Parse arguments
let gameId = null;
let fieldKey = null;
let fieldValue = null;
let newStatus = null;
let batchFile = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--game-id') gameId = args[++i];
  if (args[i] === '--add-field') {
    fieldKey = args[++i];
    fieldValue = args[++i];
  }
  if (args[i] === '--set-status') newStatus = args[++i];
  if (args[i] === '--batch') batchFile = args[++i];
}

// Batch enhancement
if (batchFile) {
  const batchData = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));
  let updated = 0;

  batchData.forEach(enhancement => {
    const game = games.find(g => g.id === enhancement.id);
    if (game) {
      Object.assign(game, enhancement.updates);
      game.updatedAt = new Date().toISOString();
      if (enhancement.status) game.status = enhancement.status;
      updated++;
    }
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(games, null, 2));
  console.log(`✓ Updated ${updated} games from batch file`);
  process.exit(0);
}

// Single enhancement
if (!gameId) {
  console.error('Error: --game-id is required');
  process.exit(1);
}

const gameIndex = games.findIndex(g => g.id === gameId);
if (gameIndex === -1) {
  console.error(`Error: Game with ID "${gameId}" not found`);
  process.exit(1);
}

const game = games[gameIndex];

if (fieldKey && fieldValue) {
  // Handle special fields
  if (fieldKey === 'customFields') {
    game.customFields = JSON.parse(fieldValue);
  } else {
    game[fieldKey] = fieldValue;
  }
}

if (newStatus) {
  game.status = newStatus;
}

game.updatedAt = new Date().toISOString();

fs.writeFileSync(OUTPUT, JSON.stringify(games, null, 2));
console.log(`✓ Enhanced game: ${game.name}`);
console.log(`  ID: ${gameId}`);
if (fieldKey) console.log(`  ${fieldKey}: ${fieldValue}`);
if (newStatus) console.log(`  Status: ${newStatus}`);
