"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function Craftsmanship() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const numberRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative min-h-[180vh] bg-black"
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full items-center">
          {/* Image side */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative aspect-[4/5] lg:aspect-[5/6] w-full overflow-hidden rounded-sm"
          >
            <Image
              src="/watches/atelier.png"
              alt="آتلیه ساعت‌سازی"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Floating tag */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-8 left-8 glass-gold p-5 max-w-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] tracking-luxe text-gold">GENÈVE ATELIER</span>
              </div>
              <p className="font-fa text-xs text-foreground/80 leading-relaxed">
                هر ساعت توسط یک ساعت‌ساز ارشد در طول ۱۸ ماه ساخته می‌شود.
              </p>
            </motion.div>

            {/* Corner mark */}
            <div className="absolute top-4 right-4 font-display text-5xl font-black text-gold/30">
              III
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            style={{ y: textY }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] tracking-luxe text-gold/70">۰۳ / ۰۶</span>
              <span className="w-12 h-px bg-gold/40" />
              <span className="text-[10px] tracking-luxe text-gold/70 font-fa">صنعت‌گری</span>
            </div>

            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
              <span className="font-fa">هنرِ</span>{" "}
              <span className="italic text-gold-gradient">صبوری</span>
              <br />
              <span className="font-fa">در</span>{" "}
              <span className="italic">دو دست</span>
            </h2>

            <div className="mt-10 space-y-6 max-w-lg">
              <p className="font-fa text-base text-foreground/70 leading-loose">
                <span className="text-gold">آتلیه‌ی ما در ژنو</span> خانه‌ی ۳۲
                ساعت‌ساز ارشد است. هر یک حداقل ۲۵ سال تجربه در ساعت‌سازی سنتی
                سوئیسی دارند و با چشم‌های بسته‌ای که تنها با لرزشِ انگشتان می‌بینند،
                قطعات کوچک‌تر از مو را سر جای خود می‌نشینانند.
              </p>
              <p className="font-fa text-sm text-foreground/50 leading-loose">
                فرایند ساخت هر ساعت AURUM شامل ۱٬۴۸۰ مرحله است. از طراحی اولیه‌ی
                کالیبر تا مونتاژ نهایی، ۱۸ ماه زمان می‌برد. هیچ خط تولیدی وجود
                دارد — هر قطعه، یک تنه، با امضای ساعت‌ساز آن، نضج می‌گیرد.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gold/10">
              {[
                { value: "۳۲", label: "صنعتگر ارشد", en: "MASTERS" },
                { value: "۱۸", label: "ماه ساخت", en: "MONTHS" },
                { value: "۱٬۴۸۰", label: "قطعه", en: "COMPONENTS" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                >
                  <div className="font-display text-4xl md:text-5xl text-gold-gradient font-light">
                    {stat.value}
                  </div>
                  <div className="font-fa text-xs text-foreground/50 mt-2">{stat.label}</div>
                  <div className="text-[9px] tracking-luxe text-gold/40 mt-0.5">{stat.en}</div>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="mt-12 pl-6 border-l-2 border-gold/40"
            >
              <p className="font-display italic text-lg text-foreground/80 leading-relaxed">
                «زمان، تنها فلز گران‌بهایی است که نمی‌توان آن را دوباره ذوب کرد.»
              </p>
              <footer className="font-fa text-xs text-gold mt-3">
                — آقای دیدِه مارشان، ساعت‌ساز ارشد AURUM
              </footer>
            </motion.blockquote>
          </motion.div>
        </div>

        {/* Big background number */}
        <motion.div
          style={{ rotate: numberRotate }}
          className="absolute -right-32 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <span className="font-display text-[40rem] font-black text-gold/[0.02] leading-none">
            ۳
          </span>
        </motion.div>
      </div>
    </section>
  );
}
