import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(game);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  const game = await prisma.game.update({
    where: { id },
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
      source: body.source,
      enrichedAt: body.enrichedAt ?? null,
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(game);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.game.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
