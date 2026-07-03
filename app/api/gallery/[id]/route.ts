import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const photo = await prisma.galleryPhoto.update({
    where: { id },
    data: { caption: body.caption ?? null, orderIndex: body.orderIndex ?? 0 },
  });
  return NextResponse.json(photo);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.galleryPhoto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
