"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PersonalityQuiz, type Answers } from "@/components/sections/PersonalityQuiz";
import { ConciergeChat } from "@/components/sections/ConciergeChat";
import { useTypewriter } from "@/lib/useTypewriter";

type Stage = "intro" | "quiz" | "loading" | "result";

type Recommendation = {
  id: string;
  name: string;
  nameFa: string;
  ref: string;
  price: string;
  image: string;
  caliber: string;
  material: string;
  diameter: string;
  edition: string;
  description: string;
};

export default function ExperiencePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [alternative, setAlternative] = useState<Recommendation | null>(null);
  const [narrative, setNarrative] = useState<string>("");

  const handleQuizComplete = async (finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setStage("loading");

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (data.recommendation) {
        setRecommendation(data.recommendation);
        setAlternative(data.alternative);
        setNarrative(data.narrative || "");
        setTimeout(() => setStage("result"), 800);
      } else {
        throw new Error("No recommendation received");
      }
    } catch (e) {
      console.error("Concierge failed:", e);
      // Fallback: pick a random watch
      const fallback: Recommendation = {
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
      };
      setRecommendation(fallback);
      setNarrative(
        `${fallback.nameFa} برای شما انتخاب شده است. این قطعه با روح شما هم‌خوانی دارد. در آتلیه‌ی AURUM ژنو، هر جزئیات آن برای زندگی شما طراحی شده است.`
      );
      setStage("result");
    }
  };

  return (
    <main className="gallery-theme gallery-noise min-h-screen">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 gallery-glass border-b border-[#b8945a]/15 py-3">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-[#b8945a]/60 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#d4b074] to-[#8a6d3a]" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-gold-gradient">
                AURUM
              </div>
              <div className="text-[8px] tracking-luxe text-[#4a3f2a]/50">
                CONCIERGE — V4
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-[#4a3f2a]/70 hover:text-[#b8945a] transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">→</span>
            <span className="font-fa text-xs">بازگشت به سایت</span>
          </Link>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" onStart={() => setStage("quiz")} />}

        {stage === "quiz" && (
          <PersonalityQuiz key="quiz" onComplete={handleQuizComplete} />
        )}

        {stage === "loading" && <LoadingScreen key="loading" />}

        {stage === "result" && recommendation && (
          <ResultScreen
            key="result"
            recommendation={recommendation}
            alternative={alternative}
            narrative={narrative}
            onRestart={() => {
              setStage("intro");
              setAnswers({});
              setRecommendation(null);
              setAlternative(null);
              setNarrative("");
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ==================== INTRO SCREEN ==================== */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(212, 176, 116, 0.15), transparent 50%)",
        }}
      />

      <div className="relative max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="w-16 h-px bg-[#b8945a]/40" />
          <span className="text-[10px] tracking-luxe text-[#b8945a]">
            AURUM CONCIERGE — PERSONALIZED
          </span>
          <span className="w-16 h-px bg-[#b8945a]/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-tight text-[#1a1410] mb-6"
        >
          <span className="italic text-gold-gradient">Sommelier</span>
          <br />
          <span className="font-fa">زمان</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-fa text-base md:text-lg text-[#4a3f2a]/80 leading-loose max-w-2xl mx-auto mb-4"
        >
          همان‌طور که یک sommelier شراب برای شما انتخاب می‌کند،
          ما ساعتِ AURUM شما را انتخاب می‌کنیم.
          <br />
          <span className="text-[#b8945a]">پنج سؤال، یک پیشنهاد، یک گفت‌وگو.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-fa text-xs text-[#4a3f2a]/60 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          این تجربه از هوش مصنوعی Z-AI استفاده می‌کند تا توصیه‌ی شخصی شما را
          تولید کند. سپس می‌توانید با Conciergeِ ما درباره‌ی هر جنبه‌ای گفت‌وگو کنید.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          onClick={onStart}
          className="gallery-button px-12 py-5 font-fa text-sm tracking-wide-luxe"
        >
          <span>شروع کوئز شخصی‌سازی</span>
          <span className="mr-2">←</span>
        </motion.button>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="font-fa text-[10px] text-[#4a3f2a]/40 mt-6"
        >
          ۵ سؤال — حدود ۲ دقیقه
        </motion.p>

        {/* Decorative watch icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="flex items-center justify-center gap-8 mt-20 opacity-30"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="w-12 h-12 rounded-full border border-[#b8945a]/40 flex items-center justify-center"
            >
              <span className="font-display text-xs text-[#b8945a]">
                {["I", "II", "III", "IV", "V", "VI"][n - 1]}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ==================== LOADING SCREEN ==================== */
function LoadingScreen() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-[#b8945a]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#b8945a]" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#d4b074] to-[#8a6d3a] opacity-30" />
        </motion.div>
        <h2 className="font-display text-3xl text-[#1a1410] mb-2">
          <span className="italic text-gold-gradient">Consulting</span> the atelier…
        </h2>
        <p className="font-fa text-sm text-[#4a3f2a]/60">
          هوش مصنوعی در حال تحلیل پاسخ‌های شماست
        </p>
        <div className="flex justify-center gap-1.5 mt-6">
          <span className="w-2 h-2 rounded-full bg-[#b8945a] dot-1" />
          <span className="w-2 h-2 rounded-full bg-[#b8945a] dot-2" />
          <span className="w-2 h-2 rounded-full bg-[#b8945a] dot-3" />
        </div>
      </div>
    </motion.section>
  );
}

/* ==================== RESULT SCREEN ==================== */
function ResultScreen({
  recommendation,
  alternative,
  narrative,
  onRestart,
}: {
  recommendation: Recommendation;
  alternative: Recommendation | null;
  narrative: string;
  onRestart: () => void;
}) {
  const [showChat, setShowChat] = useState(false);
  const { text: narrativeText, isDone } = useTypewriter(narrative, {
    speed: 25,
    startDelay: 1000,
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-16 h-px bg-[#b8945a]/40" />
            <span className="text-[10px] tracking-luxe text-[#b8945a]">
              YOUR PERSONAL RECOMMENDATION
            </span>
            <span className="w-16 h-px bg-[#b8945a]/40" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-light text-[#1a1410]">
            <span className="italic text-gold-gradient">The Match</span>
          </h1>
          <p className="font-fa text-sm text-[#4a3f2a]/60 mt-2">
            پیشنهادِ شخصی شما
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Watch image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative aspect-square max-w-lg mx-auto w-full sweep-in"
          >
            {/* Decorative gold ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-[#b8945a]/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-dashed border-[#b8945a]/10"
            />
            {/* Glow */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#d4b074]/20 to-transparent blur-3xl" />

            <Image
              src={recommendation.image}
              alt={recommendation.nameFa}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Watch details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="text-[10px] tracking-luxe text-[#b8945a] mb-2">
                REF. {recommendation.ref}
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-light text-[#1a1410]">
                <span className="italic text-gold-gradient">
                  {recommendation.name}
                </span>
              </h2>
              <p className="font-fa text-lg text-[#4a3f2a] mt-1">
                {recommendation.nameFa}
              </p>
            </div>

            <div className="gallery-hairline w-full" />

            {/* Specs */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: "کالیبر", value: recommendation.caliber },
                { label: "متریال", value: recommendation.material },
                { label: "قطر", value: recommendation.diameter },
                { label: "تیراژ", value: recommendation.edition },
              ].map((s, i) => (
                <div key={i} className="flex justify-between border-b border-[#b8945a]/10 pb-2">
                  <span className="font-fa text-xs text-[#4a3f2a]/60">{s.label}</span>
                  <span className="font-fa text-xs text-[#1a1410] text-left">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end justify-between pt-2">
              <div>
                <div className="text-[9px] tracking-luxe text-[#4a3f2a]/50 mb-1">
                  PRICE / قیمت
                </div>
                <div className="font-display text-3xl text-gold-gradient">
                  {recommendation.price}
                </div>
              </div>
              <button className="gallery-button px-8 py-3 font-fa text-xs tracking-wide-luxe">
                <span>درخواست خرید</span>
              </button>
            </div>

            {/* AI narrative */}
            <div className="bg-gradient-to-br from-[#fff8e8] to-[#f5f1e8] border border-[#b8945a]/20 p-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4b074] to-[#8a6d3a]" />
                <span className="text-[10px] tracking-luxe text-[#b8945a]">
                  AURUM CONCIERGE
                </span>
              </div>
              <p className="font-fa text-sm text-[#1a1410]/90 leading-loose min-h-[6rem]">
                {narrativeText}
                {!isDone && (
                  <span className="inline-block w-2 h-4 bg-[#b8945a] ml-1 animate-pulse" />
                )}
              </p>
            </div>

            {/* Toggle chat button */}
            {isDone && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowChat(!showChat)}
                className="w-full border border-[#b8945a]/40 hover:bg-[#b8945a]/5 py-3 font-fa text-sm text-[#b8945a] transition-colors"
              >
                {showChat ? "✓ بستن گفت‌وگو" : "گفت‌وگو با Concierge ←"}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <ConciergeChat
                watchContext={{
                  name: recommendation.name,
                  ref: recommendation.ref,
                  description: recommendation.description,
                }}
                narrative="" // Already shown above
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alternative */}
        {alternative && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-20"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="w-12 h-px bg-[#b8945a]/30" />
                <span className="text-[10px] tracking-luxe text-[#4a3f2a]/60">
                  ALTERNATIVE CHOICE
                </span>
                <span className="w-12 h-px bg-[#b8945a]/30" />
              </div>
              <p className="font-fa text-sm text-[#4a3f2a]/60">
                یا شاید این قطعه هم شما را صدا زد
              </p>
            </div>

            <div className="gallery-card p-6 md:p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-6 items-center">
                <div className="aspect-square relative">
                  <Image
                    src={alternative.image}
                    alt={alternative.nameFa}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-[9px] tracking-luxe text-[#b8945a]/70 mb-1">
                    REF. {alternative.ref}
                  </div>
                  <h3 className="font-display text-3xl text-[#1a1410] mb-1">
                    <span className="italic text-gold-gradient">{alternative.name}</span>
                  </h3>
                  <p className="font-fa text-sm text-[#4a3f2a] mb-3">{alternative.nameFa}</p>
                  <p className="font-fa text-xs text-[#4a3f2a]/70 leading-relaxed mb-4">
                    {alternative.description}
                  </p>
                  <div className="font-display text-xl text-gold-gradient">
                    {alternative.price}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Restart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-16"
        >
          <button
            onClick={onRestart}
            className="font-fa text-xs text-[#4a3f2a]/60 hover:text-[#b8945a] transition-colors tracking-wide-luxe"
          >
            → شروع دوباره‌ی کوئز
          </button>
        </motion.div>

        {/* Footer */}
        <footer className="text-center mt-20 pt-8 border-t border-[#b8945a]/15">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-fa text-xs text-[#4a3f2a]/60 hover:text-[#b8945a] transition-colors"
          >
            <span>→</span>
            <span>بازگشت به وب‌سایت اصلی AURUM</span>
          </Link>
          <p className="font-fa text-[10px] text-[#4a3f2a]/40 mt-4">
            تجربه‌ی Concierge — © ۲۰۲۵ AURUM
          </p>
        </footer>
      </div>
    </motion.section>
  );
}
