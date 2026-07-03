import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const events = await prisma.timelineEvent.findMany({ orderBy: { year: "asc" } });
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.year || !body.eventText) {
    return NextResponse.json({ error: "year and eventText are required" }, { status: 400 });
  }

  const event = await prisma.timelineEvent.create({
    data: {
      year: body.year,
      eventText: body.eventText,
      orderIndex: body.orderIndex ?? 0,
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
