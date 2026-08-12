"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

type TimelineItem = {
  year: string;
  yearFa: string;
  title: string;
  titleFa: string;
  text: string;
};

const timeline: TimelineItem[] = [
  {
    year: "1986",
    yearFa: "۱۹۸۶",
    title: "Foundation",
    titleFa: "بنیان‌گذاری",
    text: "مارکوس راینهارت در یک کارگاه کوچک در ژنو، اولین کالیبر خود را با نام AR-001 ساخت.",
  },
  {
    year: "1994",
    yearFa: "۱۹۹۴",
    title: "Tourbillon",
    titleFa: "اولین توربیون",
    text: "AURUM اولین توربیون پروانه‌ای سوئیسی را با موفقیت در نمایشگاه بازل عرضه کرد.",
  },
  {
    year: "2003",
    yearFa: "۲۰۰۳",
    title: "Atelier",
    titleFa: "گسترش آتلیه",
    text: "افتتاح ساختمان مرکزی AURUM در کنار دریاچه‌ی ژنو — یک بنا تاریخی از قرن نوزدهم.",
  },
  {
    year: "2014",
    yearFa: "۲۰۱۴",
    title: "Perpetual",
    titleFa: "کالیبر جاودان",
    text: "کالیبر AR-920 با ۹ روز ذخیره‌ی انرژی معرفی شد — رکوردی در صنعت.",
  },
  {
    year: "2025",
    yearFa: "۲۰۲۵",
    title: "Future",
    titleFa: "آینده",
    text: "تلفیق تکنولوژی‌ی نیمه‌هادی و ساعت‌سازی سنتی. کالکشن AURUM NOVA متولد شد.",
  },
];

export function Heritage() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="relative section-pad bg-gradient-to-b from-black via-[#080705] to-black overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-[1600px] mx-auto text-center mb-20 md:mb-32"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="w-16 h-px bg-gold/40" />
          <span className="text-[10px] tracking-luxe text-gold/70 font-fa">میراث</span>
          <span className="w-16 h-px bg-gold/40" />
        </div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light">
          <span className="font-fa">یک</span>{" "}
          <span className="italic text-gold-gradient">قرن</span>{" "}
          <span className="font-fa">از زمان</span>
        </h2>
        <p className="font-fa text-sm text-foreground/50 mt-4 max-w-xl mx-auto leading-relaxed">
          از یک کارگاه کوچک تا یک میراث جهانی. داستان ما در ۵ نقطه‌ی عطف.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent -translate-x-1/2" />

        {timeline.map((item, i) => (
          <TimelineRow key={item.year} item={item} index={i} />
        ))}
      </div>

      {/* Bottom signature */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="text-center mt-32"
      >
        <div className="font-display text-2xl italic text-gold-gradient mb-3">
          — Marcus Reinhart
        </div>
        <p className="font-fa text-xs text-foreground/40 tracking-wide-luxe">
          بنیان‌گذار AURUM — ژنو، ۱۹۸۶
        </p>
      </motion.div>
    </section>
  );
}

function TimelineRow({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex items-center mb-20 md:mb-32 ${
        isLeft ? "md:justify-start" : "md:justify-end"
      } justify-end`}
    >
      {/* Center dot */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: "backOut" }}
          className="relative"
        >
          <div className="w-4 h-4 rounded-full bg-gold" />
          <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-40" />
          <div className="absolute -inset-3 rounded-full border border-gold/30" />
        </motion.div>
      </div>

      {/* Card */}
      <div
        className={`w-full md:w-[44%] glass-gold p-8 md:p-10 ${
          isLeft ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
        }`}
      >
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-display text-5xl md:text-6xl font-black text-gold-gradient">
            {item.year}
          </span>
          <span className="font-fa text-sm text-foreground/40">{item.yearFa}</span>
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-2">
          <span className="italic">{item.title}</span>
          <span className="text-foreground/40 mx-2">·</span>
          <span className="font-fa text-xl">{item.titleFa}</span>
        </h3>

        <p className="font-fa text-sm text-foreground/60 leading-relaxed mt-4">
          {item.text}
        </p>

        {/* Decorative number */}
        <div className="absolute top-4 right-6 font-display text-xs tracking-luxe text-gold/40">
          {String(index + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
        </div>
      </div>
    </motion.div>
  );
}
