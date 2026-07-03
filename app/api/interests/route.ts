import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const tags = await prisma.interestTag.findMany({ orderBy: { orderIndex: "asc" } });
  return NextResponse.json({ tags });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.label) {
    return NextResponse.json({ error: "label is required" }, { status: 400 });
  }
  const tag = await prisma.interestTag.create({
    data: { label: body.label, icon: body.icon ?? null, orderIndex: body.orderIndex ?? 0 },
  });
  return NextResponse.json(tag, { status: 201 });
}
