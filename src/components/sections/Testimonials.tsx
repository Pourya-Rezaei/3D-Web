"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "AURUM doesn't tell you the time. It tells you who you are.",
    fa: "آوروم به شما زمان را نمی‌گوید. به شما می‌گوید که هستید.",
    author: "Jean-Luc Moreau",
    role: "Editor-in-Chief, Revue Horlogère",
  },
  {
    quote:
      "The Tourbillon AR-007 is, quite simply, the most beautiful watch I have ever held.",
    fa: "توربیون AR-007، ساده‌ترین و زیباترین ساعتی است که تاکنون در دست گرفته‌ام.",
    author: "Sir Alfred Worthington",
    role: "Collector, London",
  },
  {
    quote:
      "Each piece feels alive. A symphony of gears and gold.",
    fa: "هر قطعه زنده به نظر می‌رسد. سمفونی از چرخ‌دنده‌ها و طلای ناب.",
    author: "Madame Claire Dubois",
    role: "Curator, Musée d'Horlogerie",
  },
  {
    quote:
      "Wearing an AURUM is wearing a piece of Genève itself.",
    fa: "پوشیدن آوروم، پوشیدن تکه‌ای از خود ژنو است.",
    author: "Hiroshi Tanaka",
    role: "Tokyo, Japan",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Marquee */}
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="font-display text-3xl italic text-gold/40">
                &ldquo;
              </span>
              <p className="font-display text-2xl md:text-4xl italic text-foreground/70 whitespace-nowrap">
                {t.quote}
              </p>
              <span className="font-display text-3xl italic text-gold/40">
                &rdquo;
              </span>
              <span className="text-gold">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient mask edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none" />

      {/* Testimonial cards */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className="w-16 h-px bg-gold/40" />
          <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
            نظر مجموعه‌داران
          </span>
          <span className="w-16 h-px bg-gold/40" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.2 }}
              className="glass-gold p-8 md:p-10 relative group"
            >
              <div className="font-display text-6xl text-gold/20 absolute top-4 right-6 group-hover:text-gold/40 transition-colors">
                &rdquo;
              </div>

              <p className="font-fa text-lg text-foreground/80 leading-relaxed mb-4">
                {t.fa}
              </p>
              <p className="font-display italic text-sm text-foreground/50 leading-relaxed">
                {t.quote}
              </p>

              <div className="mt-8 pt-6 border-t border-gold/10">
                <div className="font-display text-lg text-gold">{t.author}</div>
                <div className="font-fa text-xs text-foreground/40 mt-1">
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
