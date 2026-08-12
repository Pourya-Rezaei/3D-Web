"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function FeaturedTimepiece() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const watchY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const watchRotate = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const watchScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-center"
    >
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 169, 106, 0.08), transparent 60%)",
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,169,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,106,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Watch image side */}
        <motion.div
          style={{ y: watchY, rotate: watchRotate, scale: watchScale }}
          className="relative aspect-square w-full max-w-2xl mx-auto"
        >
          {/* Glow */}
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute inset-10 rounded-full bg-gold/20 blur-[100px]"
          />

          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-gold/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-dashed border-gold/10"
          />

          <Image
            src="/watches/hero-watch.png"
            alt="ساعت AURUM Tourbillon — قطعه‌ی ویژه"
            fill
            className="object-contain drop-shadow-[0_20px_60px_rgba(201,169,106,0.3)]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* Info side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-luxe text-gold/70">۰۴ / ۰۶</span>
            <span className="w-12 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">قطعه‌ی برگزیده</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-none">
            <span className="block italic text-gold-gradient">AURUM</span>
            <span className="block font-light">Tourbillon</span>
          </h2>

          <p className="font-fa text-lg text-foreground/60 mt-3">
            آوروم توربیون — کالیبر AR-007
          </p>

          <div className="my-8 gold-hairline w-full" />

          <p className="font-fa text-base text-foreground/70 leading-loose max-w-xl">
            <span className="text-gold">شاهکار ساعت‌سازی AURUM.</span> یک
            توربیون پروانه‌ای شناور درون قاب پلاتین ۹۵۰، با کالیبر دستی AR-007
            که در طول ۹ ماه توسط یک ساعت‌ساز ارشد مونتاژ می‌شود. تنها ۱۲ قطعه در
            سال ساخته می‌شود — هر یک با شماره‌ی سریال منحصر به فرد.
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-px bg-gold/10 mt-10">
            {[
              { label: "کالیبر", value: "AR-007", en: "CALIBER" },
              { label: "جنس قاب", value: "پلاتین ۹۵۰", en: "CASE" },
              { label: "قطر", value: "۴۲ میلی‌متر", en: "DIAMETER" },
              { label: "مقاومت آب", value: "۳۰ متر", en: "WATER" },
              { label: "ذخیره انرژی", value: "۱۲۰ ساعت", en: "RESERVE" },
              { label: "تیراژ", value: "۱۲ قطعه", en: "EDITION" },
            ].map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="bg-black p-5"
              >
                <div className="text-[9px] tracking-luxe text-gold/50 mb-1.5">
                  {spec.en}
                </div>
                <div className="font-fa text-sm text-foreground">{spec.value}</div>
                <div className="font-fa text-[10px] text-foreground/40 mt-0.5">
                  {spec.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="text-[10px] tracking-luxe text-foreground/40 mb-2">
                PRICE / قیمت
              </div>
              <div className="font-display text-4xl text-gold-gradient">
                ₠ ۲۴۰٬۰۰۰
              </div>
              <div className="font-fa text-xs text-foreground/50 mt-1">
                شامل گارانتی مادام‌العمر AURUM
              </div>
            </div>

            <button className="group relative font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold px-10 py-5 overflow-hidden">
              <span className="relative z-10">درخواست خرید</span>
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
