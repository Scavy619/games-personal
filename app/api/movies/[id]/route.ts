import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(movie);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  const movie = await prisma.movie.update({
    where: { id },
    data: {
      title: body.title,
      genre: body.genre ?? null,
      rating: body.rating ?? null,
      status: body.status,
      watchedDate: body.watchedDate ? new Date(body.watchedDate) : null,
      review: body.review ?? null,
      posterUrl: body.posterUrl ?? null,
      tmdbRating: body.tmdbRating ?? null,
      releaseYear: body.releaseYear ?? null,
      overview: body.overview ?? null,
      source: body.source,
      enrichedAt: body.enrichedAt ?? null,
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(movie);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.movie.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
