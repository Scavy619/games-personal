import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const logs = await prisma.sportsLog.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.team || !body.date) {
    return NextResponse.json({ error: "team and date are required" }, { status: 400 });
  }

  const log = await prisma.sportsLog.create({
    data: {
      team: body.team,
      event: body.event ?? null,
      score: body.score ?? null,
      notes: body.notes ?? null,
      date: new Date(body.date),
      extra: body.extra ?? undefined,
    },
  });

  return NextResponse.json(log, { status: 201 });
}
