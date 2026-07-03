import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { orderIndex: "asc" } });
  return NextResponse.json({ photos });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const photo = await prisma.galleryPhoto.create({
    data: {
      imageUrl: body.imageUrl,
      caption: body.caption ?? null,
      orderIndex: body.orderIndex ?? 0,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}
