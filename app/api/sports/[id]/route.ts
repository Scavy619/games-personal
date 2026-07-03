import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  const log = await prisma.sportsLog.update({
    where: { id },
    data: {
      team: body.team,
      event: body.event ?? null,
      score: body.score ?? null,
      notes: body.notes ?? null,
      date: new Date(body.date),
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(log);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.sportsLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
