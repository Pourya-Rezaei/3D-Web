"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

type Watch = {
  id: number;
  name: string;
  nameFa: string;
  ref: string;
  price: string;
  image: string;
  movement: string;
  material: string;
  description: string;
};

const watches: Watch[] = [
  {
    id: 1,
    name: "AURUM Rose",
    nameFa: "آوروم رُز",
    ref: "AR-024-RG",
    price: "₠ ۴۸٬۰۰۰",
    image: "/watches/watch-1.png",
    movement: "اتوماتیک — کالیبر AR-880",
    material: "رُز‌گلد ۱۸ قیراط",
    description:
      "سفتی از طلای رُز‌گلد ۱۸ قیراط با دیسک خورشیدی مشکی. کلاسیک، جاودانه.",
  },
  {
    id: 2,
    name: "AURUM Abyss",
    nameFa: "آوروم اَبیس",
    ref: "AR-031-BL",
    price: "₠ ۶۲٬۰۰۰",
    image: "/watches/watch-2.png",
    movement: "اتوماتیک — کالیبر AR-920",
    material: "فولاد ضدزنگ ۹۰۴L",
    description:
      "اعماق اقیانوس‌ها. مقاوم تا ۶۰۰ متر، با بیزل سرامیکی آبی عمیق.",
  },
  {
    id: 3,
    name: "AURUM Tourbillon",
    nameFa: "آوروم توربیون",
    ref: "AR-007-PT",
    price: "₠ ۲۴۰٬۰۰۰",
    image: "/watches/watch-3.png",
    movement: "دستی — توربیون پروانه‌ای",
    material: "پلاتین ۹۵۰",
    description:
      "شاهکار ساعت‌سازی. توربیون پروانه‌ای شناور در پلاتین ۹۵۰.",
  },
  {
    id: 4,
    name: "AURUM Chrono",
    nameFa: "آوروم کرونو",
    ref: "AR-014-CG",
    price: "₠ ۵۸٬۰۰۰",
    image: "/watches/watch-4.png",
    movement: "اتوماتیک — کرونوگراف",
    material: "گلد/فولاد دو رنگ",
    description:
      "کرنوگراف با کالیبر AR-770. دو رنگ، دو روح، یک ساعت.",
  },
  {
    id: 5,
    name: "AURUM Luna",
    nameFa: "آوروم لونا",
    ref: "AR-019-WH",
    price: "₠ ۴۲٬۰۰۰",
    image: "/watches/watch-5.png",
    movement: "کوارتز — کالیبر AR-Q1",
    material: "رُز‌گلد + مروارید",
    description:
      "صفحه‌ی مروارید مادر، نازک و ظریف. حاصل از همکاری با طراحان مایلان.",
  },
  {
    id: 6,
    name: "AURUM Aviator",
    nameFa: "آوروم اَویاتور",
    ref: "AR-022-AV",
    price: "₠ ۵۲٬۰۰۰",
    image: "/watches/watch-6.png",
    movement: "اتوماتیک — کالیبر AR-660",
    material: "فولاد + سرامیک",
    description:
      "اسباب خلبانان. بزرگ، خوانا، جسور. با شماره‌های لومینوسِ سوپر-لاوژا.",
  },
];

export function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative section-pad bg-gradient-to-b from-black via-[#080705] to-black overflow-hidden"
    >
      {/* Section header */}
      <motion.div
        style={{ y: headerY }}
        className="max-w-[1600px] mx-auto mb-20 md:mb-32 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-luxe text-gold/70">۰۲ / ۰۶</span>
            <span className="w-12 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">کالکشن</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground">
            <span className="italic text-gold-gradient">Pieces</span>{" "}
            <span className="font-fa">برگزیده</span>
          </h2>
        </div>
        <p className="font-fa text-sm text-foreground/50 max-w-md leading-relaxed">
          شش قطعه از مجموعه‌ی محدود ۲۰۲۵. هر یک حکایتِ ساعت‌سازی در نقطه‌ی اوج آن دارد.
        </p>
      </motion.div>

      {/* Watch grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/5">
        {watches.map((watch, i) => (
          <WatchCard
            key={watch.id}
            watch={watch}
            index={i}
            isActive={activeIndex === i}
            onHover={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {/* View all CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex justify-center mt-20"
      >
        <button className="group relative font-fa text-sm tracking-wide-luxe text-gold border border-gold/30 px-12 py-5 overflow-hidden hover:border-gold transition-colors">
          <span className="absolute inset-0 bg-gold/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative">مشاهده‌ی کالکشن کامل (۲۴ قطعه)</span>
        </button>
      </motion.div>
    </section>
  );
}

function WatchCard({
  watch,
  index,
  isActive,
  onHover,
}: {
  watch: Watch;
  index: number;
  isActive: boolean;
  onHover: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: -y * 20 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: (index % 3) * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onHover}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="group relative bg-black p-8 md:p-12 overflow-hidden cursor-pointer min-h-[640px] flex flex-col justify-between"
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: "transform 0.3s ease",
      }}
    >
      {/* Hover spotlight */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(201,169,106,0.12), transparent 60%)",
        }}
      />

      {/* Number + ref */}
      <div className="relative flex justify-between items-start mb-8 z-10">
        <span className="font-display text-7xl font-black text-gold/10 group-hover:text-gold/20 transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="text-right">
          <p className="text-[10px] tracking-luxe text-foreground/40">
            REF. {watch.ref}
          </p>
          <p className="font-fa text-xs text-gold mt-1">{watch.price}</p>
        </div>
      </div>

      {/* Watch image */}
      <div className="relative flex-1 flex items-center justify-center my-8 z-10">
        <div className="relative w-56 h-56 md:w-64 md:h-64 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
          <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Image
            src={watch.image}
            alt={watch.nameFa}
            fill
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10">
        <h3 className="font-display text-3xl md:text-4xl font-light text-foreground group-hover:text-gold-gradient transition-all duration-500">
          {watch.name}
        </h3>
        <p className="font-fa text-sm text-foreground/60 mt-1">{watch.nameFa}</p>

        <p className="font-fa text-xs text-foreground/50 mt-4 leading-relaxed min-h-[3rem]">
          {watch.description}
        </p>

        <div className="mt-6 pt-6 border-t border-gold/10 space-y-1">
          <div className="flex justify-between font-fa text-[11px]">
            <span className="text-foreground/40">مکانیزم</span>
            <span className="text-gold/80">{watch.movement}</span>
          </div>
          <div className="flex justify-between font-fa text-[11px]">
            <span className="text-foreground/40">جنس</span>
            <span className="text-gold/80">{watch.material}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="mt-6 flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <span className="font-fa text-xs tracking-wide-luxe">مشاهده‌ی جزئیات</span>
          <span className="text-lg">→</span>
        </div>
      </div>
    </motion.div>
  );
}
