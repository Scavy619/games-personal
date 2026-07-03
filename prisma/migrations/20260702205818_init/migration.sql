-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "launcher" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "metacritic" INTEGER,
    "steam" INTEGER,
    "steamLabel" TEXT,
    "year" INTEGER,
    "dev" TEXT,
    "pub" TEXT,
    "esrb" TEXT,
    "coverUrl" TEXT,
    "wallpaperUrl" TEXT,
    "metacriticUrl" TEXT,
    "steamUrl" TEXT,
    "youtubeUrl" TEXT,
    "hltbUrl" TEXT,
    "opencriticUrl" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "enrichedAt" DATETIME,
    "extra" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "genre" TEXT,
    "rating" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'watched',
    "watchedDate" DATETIME,
    "review" TEXT,
    "posterUrl" TEXT,
    "tmdbRating" REAL,
    "releaseYear" INTEGER,
    "overview" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "enrichedAt" DATETIME,
    "extra" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "issue" TEXT,
    "status" TEXT,
    "rating" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "extra" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SportsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team" TEXT NOT NULL,
    "event" TEXT,
    "score" TEXT,
    "notes" TEXT,
    "date" DATETIME NOT NULL,
    "extra" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL DEFAULT 'Anonymous',
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "handle" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "location" TEXT,
    "occupation" TEXT,
    "gamingSince" INTEGER,
    "favGenre" TEXT,
    "nowPlaying" TEXT,
    "extra" JSONB,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "eventText" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "extra" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GalleryPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "InterestTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE INDEX "Game_platform_idx" ON "Game"("platform");

-- CreateIndex
CREATE INDEX "Game_genre_idx" ON "Game"("genre");

-- CreateIndex
CREATE INDEX "JournalEntry_section_idx" ON "JournalEntry"("section");
