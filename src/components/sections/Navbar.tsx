"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "کالکشن", href: "#collection", en: "Collection" },
  { label: "نمایشگاه 3D", href: "#showroom", en: "Showroom" },
  { label: "صنعتگر", href: "#craft", en: "Craft" },
  { label: "میراث", href: "#heritage", en: "Heritage" },
  { label: "تماس", href: "#contact", en: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-xl border-b border-gold/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-gold/60 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="group relative font-fa text-sm text-foreground/70 hover:text-gold transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Right side - CTA + burger */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block font-fa text-xs tracking-wide-luxe text-gold border border-gold/30 hover:bg-gold/10 px-5 py-2.5 transition-colors">
              قرار ملاقات
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
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
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="font-display text-4xl text-gold-gradient"
              >
                {item.en}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
