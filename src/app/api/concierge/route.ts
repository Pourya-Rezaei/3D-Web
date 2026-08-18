import { NextRequest, NextResponse } from "next/server";
import { recommend } from "@/lib/concierge";
import type { QuizAnswers } from "@/lib/watches";

/**
 * POST /api/concierge
 * Body: { answers: { style, occasion, material, function, era } }
 * Returns: { recommendation, alternative, narrative, quizAnswers }
 *
 * Thin HTTP adapter — all scoring/narrative logic lives in src/lib/concierge.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { answers?: QuizAnswers };
    const result = recommend(body.answers ?? {});
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("Concierge API error:", e);
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
