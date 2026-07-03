import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const links = await prisma.socialLink.findMany({ orderBy: { orderIndex: "asc" } });
  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.platform || !body.url) {
    return NextResponse.json({ error: "platform and url are required" }, { status: 400 });
  }
  const link = await prisma.socialLink.create({
    data: { platform: body.platform, url: body.url, orderIndex: body.orderIndex ?? 0 },
  });
  return NextResponse.json(link, { status: 201 });
}
