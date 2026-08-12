"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark via-gold to-gold-light origin-left z-[100]"
    />
  );
}

export function ScrollIndicator() {
  const [visible, setVisible] = useState(false);
  const [section, setSection] = useState("01");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 2;
      let current = "01";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (y > el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          const id = el.id;
          const map: Record<string, string> = {
            collection: "02",
            showroom: "03",
            craft: "04",
            heritage: "05",
            contact: "06",
          };
          current = map[id] ?? "01";
        }
      });
      setSection(current);
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
      transition={{ duration: 0.4 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 pointer-events-none"
    >
      <div className="text-[10px] tracking-luxe text-gold/60 [writing-mode:vertical-rl]">
        SECTION {section} / 06
      </div>
      <div className="w-px h-32 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent relative">
        <motion.div
          className="absolute -left-[3px] w-2 h-2 rounded-full bg-gold"
          animate={{ top: `${(parseInt(section) / 6) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ boxShadow: "0 0 12px rgba(201,169,106,0.8)" }}
        />
      </div>
    </motion.div>
  );
}
