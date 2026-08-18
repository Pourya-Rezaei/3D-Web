"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "@/components/CustomCursor";

const navItems = [
  { label: "استودیو", href: "#configurator", en: "Studio" },
  { label: "مونتاژ", href: "#assembly", en: "Assembly" },
  { label: "کالکشن", href: "#collection", en: "Collection" },
  { label: "نمایشگاه 3D", href: "#showroom", en: "Showroom" },
  { label: "میراث", href: "#heritage", en: "Heritage" },
  { label: "تماس", href: "#contact", en: "Contact" },
];

export function NavbarV2() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Live time display (Swiss time, UTC+1)
    const updateTime = () => {
      const now = new Date();
      const swiss = new Date(now.getTime() + (60 * 60 * 1000));
      const opts: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Zurich",
      };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(swiss));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 3.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-xl border-b border-gold/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo + Time */}
          <div className="flex items-center gap-6">
            <Magnetic strength={0.3}>
              <a href="#" className="flex items-center gap-3 group" data-cursor>
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 rounded-full border border-gold/60 group-hover:rotate-180 transition-transform duration-700" />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
                  <div className="absolute inset-[14px] rounded-full bg-black" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-xl font-bold text-gold-gradient">
                    AURUM
                  </span>
                  <span className="text-[8px] tracking-luxe text-foreground/50 mt-0.5">
                    GENÈVE — ۱۹۸۶
                  </span>
                </div>
              </a>
            </Magnetic>

            {/* Live time */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] tracking-luxe text-gold/60">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-mono">{time}</span>
              <span className="text-foreground/40">GENÈVE</span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, i) => (
              <Magnetic key={item.href} strength={0.25}>
                <motion.a
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.6 + i * 0.06 }}
                  data-cursor
                  className="group relative font-fa text-xs text-foreground/70 hover:text-gold transition-colors px-2 py-2"
                >
                  {item.label}
                  <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                </motion.a>
              </Magnetic>
            ))}
          </div>

          {/* CTA + burger */}
          <div className="flex items-center gap-3">
            <Magnetic strength={0.3}>
              <button
                data-cursor
                data-cursor-text="بزن بریم"
                className="hidden md:block font-fa text-xs tracking-wide-luxe text-gold border border-gold/30 hover:bg-gold/10 px-5 py-2.5 transition-colors"
              >
                قرار ملاقات
              </button>
            </Magnetic>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
              aria-label="menu"
            >
              <span className={`w-6 h-px bg-gold transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-6 h-px bg-gold transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-px bg-gold transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="text-[9px] tracking-luxe text-gold/40">
                  0{i + 1}
                </span>
                <span className="font-display text-4xl text-gold-gradient italic">
                  {item.en}
                </span>
                <span className="font-fa text-lg text-foreground/70">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
