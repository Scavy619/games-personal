import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  const entry = await prisma.journalEntry.update({
    where: { id },
    data: {
      section: body.section,
      title: body.title,
      body: body.body,
      issue: body.issue ?? null,
      status: body.status ?? null,
      rating: body.rating ?? null,
      isPrivate: body.isPrivate ?? false,
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(entry);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.journalEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
