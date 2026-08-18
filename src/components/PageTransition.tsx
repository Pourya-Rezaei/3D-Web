"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic page transition:
 * - On initial load: golden curtains slide apart to reveal content
 * - On scroll-into-view section transitions: subtle fade
 * - Triggers once per mount
 */
export function PageTransition() {
  const [stage, setStage] = useState<"loading" | "opening" | "done">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("opening"), 1800);
    const t2 = setTimeout(() => setStage("done"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[150] pointer-events-none"
      initial={{ pointerEvents: "auto" }}
      animate={{ pointerEvents: stage === "done" ? "none" : "auto" }}
    >
      {/* Top curtain */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 bg-black"
        initial={{ y: 0 }}
        animate={{ y: stage === "opening" ? "-100%" : 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Curtain bottom edge gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === "opening" ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="font-display text-5xl text-gold-gradient font-black">
            AURUM
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom curtain */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-black"
        initial={{ y: 0 }}
        animate={{ y: stage === "opening" ? "100%" : 0 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === "opening" ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <div className="text-[10px] tracking-luxe text-gold/60">
            MAISON HORLOGÈRE — GENÈVE
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Section reveal wrapper — animates children in when scrolled into view.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
