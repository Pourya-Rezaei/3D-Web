"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2200;
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.floor(pct));
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLoading(false), 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        >
          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-gold/20 relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_20px_rgba(201,169,106,0.8)]" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 md:w-28 md:h-28 rounded-full border border-gold/30"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-light" />
            </motion.div>

            {/* Brand */}
            <div className="mt-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="font-display text-5xl md:text-6xl font-black text-gold-gradient"
              >
                AURUM
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[9px] tracking-luxe text-foreground/50 mt-3"
              >
                MAISON HORLOGÈRE — GENÈVE ۱۹۸۶
              </motion.p>
            </div>

            {/* Progress */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64">
              <div className="flex justify-between mb-2 text-[10px] tracking-luxe text-gold/60">
                <span>LOADING</span>
                <span>{String(progress).padStart(3, "0")}%</span>
              </div>
              <div className="h-px bg-gold/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold-dark to-gold-light"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
