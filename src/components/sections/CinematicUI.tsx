"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";

const chapters = [
  { id: "chapter-1", label: "I", title: "Invitation", titleFa: "دعوت‌نامه" },
  { id: "chapter-2", label: "II", title: "Atelier", titleFa: "کارگاه" },
  { id: "chapter-3", label: "III", title: "Choice", titleFa: "انتخاب" },
  { id: "chapter-4", label: "IV", title: "Assembly", titleFa: "مونتاژ" },
  { id: "chapter-5", label: "V", title: "Birth", titleFa: "تولد" },
  { id: "chapter-6", label: "VI", title: "Legacy", titleFa: "میراث" },
];

export function CinematicUI() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const audio = useAudio();

  useEffect(() => {
    const sections = document.querySelectorAll("section[id^='chapter-']");
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const y = window.scrollY + window.innerHeight / 2;
      sections.forEach((s, i) => {
        const el = s as HTMLElement;
        if (y > el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setCurrentChapter(i);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToChapter = (i: number) => {
    const ch = chapters[i];
    if (!ch) return;
    audio.playSound("click", { volume: 0.3 });
    document.querySelector(`#${ch.id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top bar with chapter dots */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#060a18]/70 backdrop-blur-xl border-b border-gold/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-gold/60" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-bold text-gold-gradient">
                AURUM
              </div>
              <div className="text-[8px] tracking-luxe text-foreground/50">
                CH. {currentChapter + 1} / VI
              </div>
            </div>
          </div>

          {/* Chapter dots */}
          <div className="hidden md:flex items-center gap-2">
            {chapters.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(i)}
                className="group relative flex items-center"
                title={`${ch.title} — ${ch.titleFa}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentChapter
                      ? "bg-gold scale-150"
                      : i < currentChapter
                      ? "bg-gold/60"
                      : "bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  style={
                    i === currentChapter
                      ? { boxShadow: "0 0 12px rgba(201,169,106,0.8)" }
                      : {}
                  }
                />
                {/* Hover tooltip */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="glass-midnight px-2 py-1 text-[9px] tracking-luxe text-gold">
                    {ch.label} — {ch.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <AudioToggle />
          </div>
        </div>
      </motion.nav>

      {/* Side chapter indicator (right) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 pointer-events-none"
      >
        <div className="text-[10px] tracking-luxe text-gold/60 [writing-mode:vertical-rl]">
          {chapters[currentChapter].title.toUpperCase()} — CH {currentChapter + 1} / VI
        </div>
        <div className="w-px h-32 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent relative">
          <motion.div
            className="absolute -left-[3px] w-2 h-2 rounded-full bg-gold"
            animate={{ top: `${(currentChapter / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ boxShadow: "0 0 12px rgba(201,169,106,0.8)" }}
          />
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={{ transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark via-gold to-gold-light z-[100]"
      />
    </>
  );
}

function AudioToggle() {
  const audio = useAudio();
  const [enabled, setEnabled] = useState(audio.isEnabled);

  const toggle = () => {
    if (audio.isEnabled) {
      audio.stopTickTock();
      setEnabled(false);
    } else {
      audio.enableAudio();
      audio.startTickTock();
      setEnabled(true);
      audio.playSound("click", { volume: 0.4 });
    }
  };

  return (
    <button
      onClick={toggle}
      className="glass-midnight px-3 py-2 text-[10px] tracking-luxe text-gold/80 hover:text-gold border border-gold/20 hover:border-gold/60 transition-colors flex items-center gap-2"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          audio.isEnabled ? "bg-gold animate-pulse" : "bg-foreground/30"
        }`}
      />
      <span>{audio.isEnabled ? "AUDIO ON" : "AUDIO OFF"}</span>
    </button>
  );
}
