import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const event = await prisma.timelineEvent.update({
    where: { id },
    data: {
      year: body.year,
      eventText: body.eventText,
      orderIndex: body.orderIndex ?? 0,
      extra: body.extra ?? undefined,
    },
  });
  return NextResponse.json(event);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.timelineEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
