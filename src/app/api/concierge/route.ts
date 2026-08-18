import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/concierge
 * Body: { answers: { style, occasion, material, function, era } }
 * Returns: { recommendation, narrative, alternative }
 *
 * Uses z-ai-web-dev-sdk to generate a personalized watch recommendation
 * based on the user's 5 quiz answers.
 */

const WATCH_DATABASE = [
  {
    id: "tourbillon",
    name: "AURUM Tourbillon",
    nameFa: "آوروم توربیون",
    ref: "AR-007-PT",
    price: "₠ ۲۴۰٬۰۰۰",
    image: "/watches/watch-3.png",
    caliber: "دستی — توربیون پروانه‌ای",
    material: "پلاتین ۹۵۰",
    diameter: "۴۲ میلی‌متر",
    edition: "۱۲ قطعه در سال",
    description:
      "شاهکار ساعت‌سازی. توربیون پروانه‌ای شناور درون قاب پلاتین ۹۵۰.",
    tags: ["formal", "art", "rare", "heritage", "manual"],
  },
  {
    id: "rose",
    name: "AURUM Rose",
    nameFa: "آوروم رُز",
    ref: "AR-024-RG",
    price: "₠ ۴۸٬۰۰۰",
    image: "/watches/watch-1.png",
    caliber: "اتوماتیک — کالیبر AR-880",
    material: "رُز‌گلد ۱۸ قیراط",
    diameter: "۴۰ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "سفتی از طلای رُز‌گلد ۱۸ قیراط با دیسک خورشیدی مشکی.",
    tags: ["casual", "warm", "modern", "automatic"],
  },
  {
    id: "abyss",
    name: "AURUM Abyss",
    nameFa: "آوروم اَبیس",
    ref: "AR-031-BL",
    price: "₠ ۶۲٬۰۰۰",
    image: "/watches/watch-2.png",
    caliber: "اتوماتیک — کالیبر AR-920",
    material: "فولاد ضدزنگ ۹۰۴L",
    diameter: "۴۴ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "اعماق اقیانوس‌ها. مقاوم تا ۶۰۰ متر با بیزل سرامیکی.",
    tags: ["sport", "adventure", "modern", "automatic", "rugged"],
  },
  {
    id: "chrono",
    name: "AURUM Chrono",
    nameFa: "آوروم کرونو",
    ref: "AR-014-CG",
    price: "₠ ۵۸٬۰۰۰",
    image: "/watches/watch-4.png",
    caliber: "اتوماتیک — کرونوگراف",
    material: "گلد/فولاد دو رنگ",
    diameter: "۴۲ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "کرنوگراف با کالیبر AR-770. دو رنگ، دو روح، یک ساعت.",
    tags: ["sport", "function", "modern", "automatic"],
  },
  {
    id: "luna",
    name: "AURUM Luna",
    nameFa: "آوروم لونا",
    ref: "AR-019-WH",
    price: "₠ ۴۲٬۰۰۰",
    image: "/watches/watch-5.png",
    caliber: "کوارتز — کالیبر AR-Q1",
    material: "رُز‌گلد + مروارید",
    diameter: "۳۶ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "صفحه‌ی مروارید مادر، نازک و ظریف. حاصل از همکاری با طراحان مایلان.",
    tags: ["casual", "minimal", "elegant", "modern"],
  },
  {
    id: "aviator",
    name: "AURUM Aviator",
    nameFa: "آوروم اَویاتور",
    ref: "AR-022-AV",
    price: "₠ ۵۲٬۰۰۰",
    image: "/watches/watch-6.png",
    caliber: "اتوماتیک — کالیبر AR-660",
    material: "فولاد + سرامیک",
    diameter: "۴۴ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "اسباب خلبانان. بزرگ، خوانا، جسور با شماره‌های لومینوس.",
    tags: ["sport", "vintage", "function", "automatic"],
  },
];

type Answers = {
  style?: string; // casual | formal | sport
  occasion?: string; // daily | special | adventure
  material?: string; // gold | steel | platinum
  function?: string; // simple | chronograph | art
  era?: string; // vintage | modern | timeless
};

function scoreWatch(watch: (typeof WATCH_DATABASE)[0], answers: Answers): number {
  let score = 0;
  if (answers.style && watch.tags.includes(answers.style)) score += 3;
  if (answers.occasion) {
    if (answers.occasion === "daily" && watch.tags.includes("casual")) score += 2;
    if (answers.occasion === "special" && watch.tags.includes("formal")) score += 2;
    if (answers.occasion === "adventure" && watch.tags.includes("sport")) score += 2;
  }
  if (answers.material && watch.tags.includes(answers.material)) score += 2;
  if (answers.function && watch.tags.includes(answers.function)) score += 2;
  if (answers.era && watch.tags.includes(answers.era)) score += 2;
  return score;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { answers: Answers };
    const answers = body.answers || {};

    // Score all watches
    const scored = WATCH_DATABASE.map((w) => ({
      watch: w,
      score: scoreWatch(w, answers),
    })).sort((a, b) => b.score - a.score);

    const recommended = scored[0].watch;
    const alternative = scored[1].watch;

    // Generate personalized narrative using Z-AI
    let narrative = "";
    try {
      const zai = await ZAI.create();
      const prompt = `You are the AI Concierge of AURUM, a luxury Swiss watchmaker in Geneva since 1986.

A user has completed a personality quiz with these answers:
- Style preference: ${answers.style || "unspecified"}
- Primary occasion: ${answers.occasion || "unspecified"}
- Material preference: ${answers.material || "unspecified"}
- Function preference: ${answers.function || "unspecified"}
- Era preference: ${answers.era || "unspecified"}

Based on these answers, you have recommended the "${recommended.name}" (${recommended.ref}).

Write a personalized, evocative recommendation narrative in PERSIAN (Farsi) language. The narrative should:
1. Address the user warmly as if speaking in person at the AURUM atelier
2. Explain why this specific watch matches their personality
3. Reference 1-2 specific features of the watch
4. End with an invitation to discuss further

Keep it between 80-120 Persian words. Be poetic but precise. Use the informal "شما" form.

Output ONLY the Persian narrative text, no English, no markdown formatting.`;

      const response = await zai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are the AI Concierge of AURUM luxury watchmakers. You speak fluent, poetic Persian.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      narrative = response.choices[0]?.message?.content || "";
    } catch (e) {
      console.error("AI generation failed:", e);
      // Fallback narrative
      narrative = `${recommended.nameFa} برای شما انتخاب شده است. این قطعه با روح شما هم‌خوانی دارد — ${recommended.description} در آتلیه‌ی AURUM ژنو، هر جزئیات آن برای زندگی شما طراحی شده است. خوش آمدید.`;
    }

    return NextResponse.json({
      recommendation: recommended,
      alternative,
      narrative,
      quizAnswers: answers,
    });
  } catch (e: any) {
    console.error("Concierge API error:", e);
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
