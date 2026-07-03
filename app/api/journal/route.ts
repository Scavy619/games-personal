import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  const entries = await prisma.journalEntry.findMany({
    where: section ? { section } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.section || !body.title || !body.body) {
    return NextResponse.json(
      { error: "section, title, and body are required" },
      { status: 400 },
    );
  }

  const entry = await prisma.journalEntry.create({
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

  return NextResponse.json(entry, { status: 201 });
}
