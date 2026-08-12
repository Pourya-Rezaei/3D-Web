"use client";

import { motion } from "framer-motion";
import { useGsapTextReveal } from "@/lib/useGsap";

export function Manifesto() {
  const ref = useGsapTextReveal<HTMLDivElement>({
    stagger: 0.08,
    duration: 1.2,
    start: "top 70%",
    end: "bottom 30%",
  });

  return (
    <section
      ref={ref}
      className="relative section-pad bg-black overflow-hidden"
    >
      {/* Decorative background number */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="font-display text-[40vw] md:text-[30vw] font-black text-gold/[0.02] leading-none">
          I
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className="w-16 h-px bg-gold/40" />
          <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
            مانیفست برند
          </span>
          <span className="w-16 h-px bg-gold/40" />
        </motion.div>

        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-[1.4] text-foreground/90">
          <span data-reveal className="inline-block">
            ما ساعت نمی‌سازیم.
          </span>{" "}
          <span data-reveal className="inline-block text-gold-gradient italic">
            زمان را
          </span>{" "}
          <span data-reveal className="inline-block">
            {" "}هندسه می‌کنیم.
          </span>{" "}
          <span data-reveal className="inline-block">
            هر قطعه از
          </span>{" "}
          <span data-reveal className="inline-block">
            AURUM تلفیقی است
          </span>{" "}
          <span data-reveal className="inline-block">
            از ساعت‌سازی سنتی سوئیسی
          </span>{" "}
          <span data-reveal className="inline-block text-gold-gradient italic">
            و آینده‌ی تکنولوژی.
          </span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="gold-hairline w-32 mx-auto mt-16 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-fa text-sm md:text-base text-foreground/50 mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          از سال ۱۹۸۶، آزمایشگاه ما در ژنو، با وفاداری به سه اصل — دقت، زیبایی، میراث —
          قطعاتی خلق می‌کند که فراتر از یک وسیله‌ی سنجش زمان، تجلی‌گاهی برای هنر هستند.
        </motion.p>
      </div>
    </section>
  );
}
