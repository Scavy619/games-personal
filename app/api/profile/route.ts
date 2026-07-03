import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const existing = await prisma.profile.findFirst();

  const data = {
    displayName: body.displayName ?? "Scavy",
    handle: body.handle ?? null,
    bio: body.bio ?? null,
    avatarUrl: body.avatarUrl ?? null,
    location: body.location ?? null,
    occupation: body.occupation ?? null,
    gamingSince: body.gamingSince ?? null,
    favGenre: body.favGenre ?? null,
    nowPlaying: body.nowPlaying ?? null,
    extra: body.extra ?? undefined,
  };

  const profile = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data })
    : await prisma.profile.create({ data });

  return NextResponse.json(profile);
}
