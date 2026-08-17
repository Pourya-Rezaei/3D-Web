"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Stat = {
  value: number;
  label: string;
  en: string;
  suffix?: string;
  prefix?: string;
};

const stats: Stat[] = [
  { value: 39, label: "سال تجربه", en: "YEARS", suffix: "+" },
  { value: 1986, label: "سال تأسیس", en: "FOUNDED" },
  { value: 32, label: "صنعتگر ارشد", en: "MASTERS" },
  { value: 1480, label: "قطعه در هر ساعت", en: "COMPONENTS" },
  { value: 18, label: "ماه ساخت", en: "MONTHS" },
  { value: 12, label: "قطعه‌ی محدود سالانه", en: "PIECES/YEAR" },
];

export function StatsCounter() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#0a0805] to-black overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,169,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,106,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
              به عدد
            </span>
            <span className="w-16 h-px bg-gold/40" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light">
            <span className="font-fa">در چند رقم</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-gold/10">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = stat.value;
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  // Format number with Persian thousands separator
  const formatNumber = (n: number) => {
    return n.toLocaleString("fa-IR");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
      className="bg-black p-6 md:p-8 text-center relative group"
    >
      {/* Number */}
      <div className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-gold-gradient leading-none">
        {stat.prefix}
        {formatNumber(displayValue)}
        {stat.suffix}
      </div>

      {/* Label */}
      <div className="font-fa text-xs text-foreground/60 mt-3">
        {stat.label}
      </div>
      <div className="text-[9px] tracking-luxe text-gold/40 mt-1">{stat.en}</div>

      {/* Hover bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-px bg-gold transition-all duration-500" />
    </motion.div>
  );
}
