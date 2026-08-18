"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/lib/useTypewriter";
import { useAudio } from "@/components/AudioProvider";

/**
 * Chapter VI: The Legacy
 * - Certificate of Authenticity with user's name
 * - Generated serial number
 * - Date stamp
 * - Download / share buttons
 */

// Generate a serial number from name (deterministic)
function generateSerial(name: string): string {
  if (!name) return "AR-000-000-000";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  const absHash = Math.abs(hash);
  const part1 = (absHash % 1000).toString().padStart(3, "0");
  const part2 = ((absHash >> 10) % 1000).toString().padStart(3, "0");
  const part3 = ((absHash >> 20) % 1000).toString().padStart(3, "0");
  return `AR-${part1}-${part2}-${part3}`;
}

// Persian date
function getPersianDate(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  } catch {
    return "۱۴۰۴";
  }
}

export function ChapterVI({ userName = "" }: { userName?: string }) {
  const [showCertificate, setShowCertificate] = useState(false);
  const audio = useAudio();
  const name = userName || "Guest";
  const serial = generateSerial(name);
  const date = getPersianDate();

  const certificateText = `این گواهی تأیید می‌کند که ساعت AURUM با شماره سریال ${serial} به ${name} تعلق دارد. این قطعه با کالیبر AR-007 و متریال طلای ۱۸ قیراط، در آتلیه‌ی ژنو مونتاژ شده و گارانتی مادام‌العمر دارد.`;

  const { text, isDone } = useTypewriter(showCertificate ? certificateText : "", {
    speed: 25,
    startDelay: 500,
    enabled: showCertificate,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCertificate(true);
      audio.playSound("paperRustle", { volume: 0.4 });
    }, 800);
    return () => clearTimeout(timer);
  }, [audio]);

  const handleDownload = () => {
    audio.playSound("click", { volume: 0.4 });
    // In a real app, this would generate a PDF. For now, just play sound.
  };

  const handleShare = () => {
    audio.playSound("click", { volume: 0.4 });
    // Copy share text to clipboard
    const shareText = `من ساعت AURUM خود را با شماره سریال ${serial} ساختم! در aurum-watch.com تجربه‌ی تعاملی را امتحان کنید.`;
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  const handleRestart = () => {
    audio.playSound("whoosh", { volume: 0.4 });
    audio.stopTickTock();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="chapter-6"
      className="relative min-h-screen w-full bg-[#060a18] stars overflow-hidden flex items-center justify-center py-32 px-4"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 169, 106, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Chapter title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-32 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <div className="text-[10px] tracking-luxe text-gold/70 mb-3">
          CHAPTER VI
        </div>
        <h1 className="chapter-title text-4xl md:text-6xl text-gold-gradient">
          The Legacy
        </h1>
        <p className="font-fa text-sm text-foreground/50 mt-2">
          میراث شما
        </p>
      </motion.div>

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="relative glass-midnight p-8 md:p-16 border-2 border-gold/20">
          {/* Corner ornaments */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-gold/40" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-gold/40" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-gold/40" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-gold/40" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="w-12 h-px bg-gold/40" />
              <span className="text-[10px] tracking-luxe text-gold/70">
                MAISON AURUM — GENÈVE
              </span>
              <span className="w-12 h-px bg-gold/40" />
            </div>
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-gold/60" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
              <div className="absolute inset-[26px] rounded-full bg-black" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gold-gradient">
              AURUM
            </h2>
            <div className="text-[10px] tracking-luxe text-foreground/50 mt-2">
              CERTIFICATE OF AUTHENTICITY
            </div>
            <div className="font-fa text-xs text-foreground/60 mt-1">
              گواهی اصالت
            </div>
          </div>

          <div className="gold-hairline w-full mb-8" />

          {/* Owner name */}
          <div className="text-center mb-8">
            <div className="text-[9px] tracking-luxe text-gold/60 mb-2">
              ISSUED TO
            </div>
            <div className="font-serif italic text-3xl md:text-5xl text-foreground mb-1">
              {name}
            </div>
            <div className="font-fa text-xs text-foreground/50">
              مالک ساعت
            </div>
          </div>

          {/* Serial + date */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 border border-gold/20">
              <div className="text-[9px] tracking-luxe text-gold/60 mb-2">
                SERIAL NUMBER
              </div>
              <div className="font-mono text-lg text-gold-gradient">
                {serial}
              </div>
              <div className="font-fa text-[10px] text-foreground/50 mt-1">
                شماره سریال
              </div>
            </div>
            <div className="text-center p-4 border border-gold/20">
              <div className="text-[9px] tracking-luxe text-gold/60 mb-2">
                ISSUE DATE
              </div>
              <div className="font-fa text-lg text-foreground">
                {date}
              </div>
              <div className="font-fa text-[10px] text-foreground/50 mt-1">
                تاریخ صدور
              </div>
            </div>
          </div>

          {/* Description (typewriter) */}
          <div className="mb-8 min-h-[6rem]">
            <p className="font-fa text-sm text-foreground/80 leading-loose text-center">
              {text}
              {!isDone && showCertificate && (
                <span className="inline-block w-2 h-4 bg-gold ml-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Signature */}
          <div className="flex justify-between items-end pt-8 border-t border-gold/20">
            <div>
              <div className="font-serif italic text-2xl text-gold-gradient">
                M. Reinhart
              </div>
              <div className="font-fa text-[10px] text-foreground/50 mt-1">
                بنیان‌گذار و ساعت‌ساز ارشد
              </div>
              <div className="text-[9px] tracking-luxe text-foreground/40">
                FOUNDER & MASTER WATCHMAKER
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-luxe text-gold/60 mb-1">
                OFFICIAL SEAL
              </div>
              <div className="w-20 h-20 rounded-full border-2 border-gold/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-xl text-gold-gradient">A</div>
                  <div className="text-[7px] tracking-luxe text-gold/60">EST. 1986</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={handleDownload}
              className="group relative font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold px-8 py-4 overflow-hidden"
            >
              <span className="relative z-10">دانلود گواهی (PDF)</span>
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
            <button
              onClick={handleShare}
              className="group relative font-fa text-sm tracking-wide-luxe text-gold border border-gold/30 hover:bg-gold/10 px-8 py-4 transition-colors"
            >
              اشتراک‌گذاری
            </button>
            <button
              onClick={handleRestart}
              className="group relative font-fa text-sm tracking-wide-luxe text-foreground/70 border border-foreground/20 hover:border-foreground/40 hover:text-foreground px-8 py-4 transition-colors"
            >
              شروع دوباره
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
    </section>
  );
}
