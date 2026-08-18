"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgressV2() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const percentage = useTransform(scrollYProgress, (v) =>
    Math.round(v * 100)
  );

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark via-gold to-gold-light origin-left z-[100]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="fixed top-3 left-6 z-[100] hidden lg:flex items-center gap-2 text-[9px] tracking-luxe text-gold/60 pointer-events-none"
      >
        <motion.span>{useTransform(percentage, (v) => String(v).padStart(3, "0"))}</motion.span>
        <span>%</span>
      </motion.div>
    </>
  );
}

export function ScrollIndicatorV2() {
  const [visible, setVisible] = useState(false);
  const [section, setSection] = useState("01");
  const [sectionName, setSectionName] = useState("INTRO");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 2;
      let current = "01";
      let currentName = "INTRO";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (y > el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          const id = el.id;
          const map: Record<string, { num: string; name: string }> = {
            configurator: { num: "02", name: "STUDIO" },
            assembly: { num: "03", name: "ASSEMBLY" },
            collection: { num: "04", name: "COLLECTION" },
            showroom: { num: "05", name: "SHOWROOM" },
            heritage: { num: "06", name: "HERITAGE" },
            contact: { num: "07", name: "CONTACT" },
          };
          if (map[id]) {
            current = map[id].num;
            currentName = map[id].name;
          }
        }
      });
      setSection(current);
      setSectionName(currentName);
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
        {sectionName} — SECTION {section} / 07
      </div>
      <div className="w-px h-32 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent relative">
        <motion.div
          className="absolute -left-[3px] w-2 h-2 rounded-full bg-gold"
          animate={{ top: `${(parseInt(section) / 7) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ boxShadow: "0 0 12px rgba(201,169,106,0.8)" }}
        />
      </div>
    </motion.div>
  );
}
