import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const messages = await prisma.contactMessage.findMany({
    where: unreadOnly ? { isRead: false } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "name, email, and message are required" },
      { status: 400 },
    );
  }

  const message = await prisma.contactMessage.create({
    data: { name: body.name, email: body.email, message: body.message },
  });

  return NextResponse.json(message, { status: 201 });
}
