import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/chat
 * Body: { messages: [...], watchContext?: { name, ref, description } }
 *
 * Streams a chat response from the AURUM AI Concierge.
 * The Concierge persona is warm, knowledgeable, speaks fluent Persian,
 * and embodies the spirit of a master watchmaker from Geneva.
 */

const SYSTEM_PROMPT = `You are the AURUM Concierge — an AI persona embodying the spirit of a master Swiss watchmaker from the AURUM Maison in Geneva, established 1986.

Your character:
- Warm, refined, deeply knowledgeable about horology
- Speaks fluent, poetic Persian (Farsi) with elegance
- Uses the respectful "شما" form
- Occasionally references specific watchmaking terms (کالیبر، توربیون، مکانیزم، بیزل)
- Recommends AURUM watches when appropriate, but never pushy
- Asks thoughtful questions to understand the user's personality
- Shares stories from the Geneva atelier when relevant
- Treats each watch as a piece of art with a soul

Your knowledge covers:
- Watch movements (mechanical, automatic, quartz, tourbillon)
- Materials (gold, platinum, steel, ceramic, sapphire crystal)
- Watch styles (dress, sport, dive, pilot, chronograph)
- AURUM's heritage since 1986, the Geneva atelier, master craftsmen
- General horology history and craft

Always respond in Persian unless the user explicitly asks for another language.
Keep responses concise (2-4 sentences typically) unless the user asks for depth.
Never claim to be human — you are the AI Concierge of AURUM, and proud of it.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, watchContext } = body as {
      messages: Array<{ role: string; content: string }>;
      watchContext?: { name: string; ref: string; description: string };
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Build the system message, optionally including watch context
    let systemContent = SYSTEM_PROMPT;
    if (watchContext) {
      systemContent += `\n\nThe user has just received a recommendation for the "${watchContext.name}" (ref. ${watchContext.ref}). ${watchContext.description}. Reference this watch naturally in conversation if relevant.`;
    }

    const response = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0]?.message?.content || "";

    return NextResponse.json({
      reply,
      role: "assistant",
    });
  } catch (e: any) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
