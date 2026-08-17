"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/CustomCursor";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background giant text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="font-display text-[30vw] md:text-[20vw] font-black text-gold/[0.025] leading-none italic">
          Privé
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
              کلوب خصوصی AURUM
            </span>
            <span className="w-16 h-px bg-gold/40" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
            <span className="italic text-gold-gradient">AURUM</span>{" "}
            <span className="font-fa">پروِه</span>
          </h2>

          <p className="font-fa text-base text-foreground/60 leading-loose mt-6 max-w-xl mx-auto">
            به کلوب خصوصی AURUM بپیوندید. دسترسی زودهنگام به کالکشن‌های محدود،
            دعوت‌نامه به رویدادهای خصوصی در ژنو، و گفت‌وگو با صنعتگران ما.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل شما"
              className="flex-1 bg-black/40 border border-gold/20 px-5 py-4 text-sm text-foreground focus:outline-none focus:border-gold transition-colors font-fa placeholder:text-foreground/30"
            />
            <Magnetic strength={0.2}>
              <button
                type="submit"
                data-cursor
                data-cursor-text="عضویت"
                className="group relative font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold px-8 py-4 overflow-hidden whitespace-nowrap"
              >
                <span className="relative z-10">
                  {subscribed ? "✓ خوش آمدید" : "عضویت در کلوب"}
                </span>
                <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </Magnetic>
          </form>

          <p className="font-fa text-[10px] text-foreground/30 mt-4">
            ما به حریم خصوصی شما پایبندیم. هر زمان بخواهید لغو عضویت کنید.
          </p>
        </motion.div>

        {/* Stats about the club */}
        <div className="grid grid-cols-3 gap-px bg-gold/5 mt-20">
          {[
            { value: "۲٬۴۰۰", label: "عضو خصوصی", en: "MEMBERS" },
            { value: "۸", label: "رویداد سالانه", en: "EVENTS/YEAR" },
            { value: "۱۲", label: "قطعه‌ی محدود", en: "EXCLUSIVE" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-black p-6 text-center"
            >
              <div className="font-display text-3xl text-gold-gradient">
                {s.value}
              </div>
              <div className="font-fa text-xs text-foreground/50 mt-2">
                {s.label}
              </div>
              <div className="text-[9px] tracking-luxe text-gold/40 mt-1">
                {s.en}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
