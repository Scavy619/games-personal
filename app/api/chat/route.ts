import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  const messages = await prisma.chatMessage.findMany({
    where: since ? { createdAt: { gt: new Date(since) } } : undefined,
    orderBy: { createdAt: "asc" },
    take: 200,
  });
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      authorName: body.authorName?.trim() || "Anonymous",
      message: body.message.trim(),
    },
  });

  return NextResponse.json(message, { status: 201 });
}
