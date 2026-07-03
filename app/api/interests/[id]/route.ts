import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const tag = await prisma.interestTag.update({
    where: { id },
    data: { label: body.label, icon: body.icon ?? null, orderIndex: body.orderIndex ?? 0 },
  });
  return NextResponse.json(tag);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.interestTag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
