#!/usr/bin/env node
/**
 * Data validation script
 * Checks for data integrity and consistency issues
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '../games/organized/all-games.json');

const games = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

const issues = {
  warnings: [],
  errors: [],
  stats: {
    total: games.length,
    valid: 0,
    withIssues: 0,
  },
};

// Validation rules
const validPlatforms = ['pc', 'ps4', 'ps5'];
const minSynopsisLength = 10;

games.forEach((game, index) => {
  let hasIssue = false;

  // Check required fields
  if (!game.id) {
    issues.errors.push(`Game #${index}: Missing ID`);
    hasIssue = true;
  }

  if (!game.name || game.name.trim().length === 0) {
    issues.errors.push(`Game #${index}: Missing name`);
    hasIssue = true;
  }

  if (!game.platform || !validPlatforms.includes(game.platform)) {
    issues.warnings.push(`Game "${game.name}": Invalid platform "${game.platform}"`);
    hasIssue = true;
  }

  if (!game.genre || game.genre.trim().length === 0) {
    issues.warnings.push(`Game "${game.name}": Missing genre`);
    hasIssue = true;
  }

  if (!game.synopsis || game.synopsis.length < minSynopsisLength) {
    issues.warnings.push(`Game "${game.name}": Synopsis too short`);
    hasIssue = true;
  }

  // Check optional but recommended fields
  if (!game.releaseInfo.year) {
    issues.warnings.push(`Game "${game.name}": Missing release year`);
  }

  if (!game.ratings.metacritic) {
    issues.warnings.push(`Game "${game.name}": No Metacritic rating`);
  }

  // Check invalid ratings
  if (game.ratings.metacritic && (game.ratings.metacritic < 0 || game.ratings.metacritic > 100)) {
    issues.errors.push(`Game "${game.name}": Invalid Metacritic rating (${game.ratings.metacritic})`);
    hasIssue = true;
  }

  if (game.ratings.steam && (game.ratings.steam < 0 || game.ratings.steam > 100)) {
    issues.errors.push(`Game "${game.name}": Invalid Steam rating (${game.ratings.steam})`);
    hasIssue = true;
  }

  // Check timestamps
  if (game.createdAt && isNaN(Date.parse(game.createdAt))) {
    issues.errors.push(`Game "${game.name}": Invalid createdAt timestamp`);
    hasIssue = true;
  }

  if (!hasIssue) {
    issues.stats.valid++;
  } else {
    issues.stats.withIssues++;
  }
});

// Print report
console.log('\n📊 Data Validation Report');
console.log('═'.repeat(50));
console.log(`Total Games: ${issues.stats.total}`);
console.log(`Valid Games: ${issues.stats.valid} (${((issues.stats.valid / issues.stats.total) * 100).toFixed(1)}%)`);
console.log(`Games with Issues: ${issues.stats.withIssues}`);
console.log(`Total Errors: ${issues.errors.length}`);
console.log(`Total Warnings: ${issues.warnings.length}`);

if (issues.errors.length > 0) {
  console.log('\n❌ ERRORS:');
  issues.errors.slice(0, 10).forEach(err => console.log(`   ${err}`));
  if (issues.errors.length > 10) {
    console.log(`   ... and ${issues.errors.length - 10} more errors`);
  }
}

if (issues.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  issues.warnings.slice(0, 10).forEach(warn => console.log(`   ${warn}`));
  if (issues.warnings.length > 10) {
    console.log(`   ... and ${issues.warnings.length - 10} more warnings`);
  }
}

// Additional statistics
console.log('\n📈 Dataset Statistics:');
const ratedGames = games.filter(g => g.ratings.metacritic);
const avgMetacritic = ratedGames.length > 0
  ? (ratedGames.reduce((sum, g) => sum + g.ratings.metacritic, 0) / ratedGames.length).toFixed(1)
  : 'N/A';

console.log(`   Games with Metacritic rating: ${ratedGames.length}/${games.length}`);
console.log(`   Average Metacritic rating: ${avgMetacritic}`);
console.log(`   Highest rated: ${games.reduce((max, g) => {
  if (!max || (g.ratings.metacritic || 0) > (max.ratings.metacritic || 0)) return g;
  return max;
}).name || 'Unknown'}`);

console.log('\n' + '═'.repeat(50));
if (issues.errors.length === 0) {
  console.log('✅ Data validation passed!');
} else {
  console.log('⚠️  Please fix the errors above before deployment.');
}
