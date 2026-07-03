import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const link = await prisma.socialLink.update({
    where: { id },
    data: { platform: body.platform, url: body.url, orderIndex: body.orderIndex ?? 0 },
  });
  return NextResponse.json(link);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.socialLink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
