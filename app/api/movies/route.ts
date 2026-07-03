import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const where: Prisma.MovieWhereInput = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { genre: { contains: search } },
      { review: { contains: search } },
    ];
  }

  const movies = await prisma.movie.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ movies });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const movie = await prisma.movie.create({
    data: {
      title: body.title,
      genre: body.genre ?? null,
      rating: body.rating ?? null,
      status: body.status ?? "watched",
      watchedDate: body.watchedDate ? new Date(body.watchedDate) : null,
      review: body.review ?? null,
      posterUrl: body.posterUrl ?? null,
      tmdbRating: body.tmdbRating ?? null,
      releaseYear: body.releaseYear ?? null,
      overview: body.overview ?? null,
      source: body.source ?? "manual",
      enrichedAt: body.enrichedAt ?? null,
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(movie, { status: 201 });
}
