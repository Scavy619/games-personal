import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const platform = searchParams.get("platform");
  const genre = searchParams.get("genre");

  const where: Prisma.GameWhereInput = {};

  if (platform && platform !== "all") {
    where.platform = platform;
  }
  if (genre && genre !== "all") {
    where.genre = genre;
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { genre: { contains: search } },
      { dev: { contains: search } },
      { synopsis: { contains: search } },
    ];
  }

  const games = await prisma.game.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ games, total: games.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.platform || !body.genre || !body.launcher || !body.synopsis) {
    return NextResponse.json(
      { error: "name, platform, genre, launcher, and synopsis are required" },
      { status: 400 },
    );
  }

  const game = await prisma.game.create({
    data: {
      name: body.name,
      platform: body.platform,
      genre: body.genre,
      launcher: body.launcher,
      synopsis: body.synopsis,
      metacritic: body.metacritic ?? null,
      steam: body.steam ?? null,
      steamLabel: body.steamLabel ?? null,
      year: body.year ?? null,
      dev: body.dev ?? null,
      pub: body.pub ?? null,
      esrb: body.esrb ?? null,
      coverUrl: body.coverUrl ?? null,
      wallpaperUrl: body.wallpaperUrl ?? null,
      metacriticUrl: body.metacriticUrl ?? null,
      steamUrl: body.steamUrl ?? null,
      youtubeUrl: body.youtubeUrl ?? null,
      hltbUrl: body.hltbUrl ?? null,
      opencriticUrl: body.opencriticUrl ?? null,
      source: body.source ?? "manual",
      enrichedAt: body.enrichedAt ?? null,
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(game, { status: 201 });
}
