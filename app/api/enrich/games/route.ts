import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/enrich";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ candidates: [] });

  try {
    const results = await getProvider("game").search(q);
    return NextResponse.json({ candidates: results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Enrichment search failed" },
      { status: 500 },
    );
  }
}
