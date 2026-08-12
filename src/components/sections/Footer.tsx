"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-gold/10 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Top: big logo + nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Brand */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-gold/60" />
                <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-gold-gradient">
                  AURUM
                </div>
                <div className="text-[8px] tracking-luxe text-foreground/40">
                  GENÈVE — EST. ۱۹۸۶
                </div>
              </div>
            </motion.div>

            <p className="font-fa text-sm text-foreground/50 leading-relaxed max-w-sm">
              برند لوکس ساعت‌سازی سوئیسی. هر قطعه، حکایت از هنر، دقت و میراث.
              ساخته‌شده در ژنو — برای دنیا.
            </p>

            <div className="flex gap-3 mt-6">
              {["IG", "X", "YT", "in"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 border border-gold/30 hover:bg-gold/10 hover:border-gold flex items-center justify-center text-[10px] text-gold transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            {
              title: "کالکشن",
              en: "COLLECTION",
              links: ["توربیون", "آبیس", "کرونو", "لونا", "آویاتور", "بسازید"],
            },
            {
              title: "آتلیه",
              en: "MAISON",
              links: ["داستان ما", "صنعتگری", "میراث", "شغل‌ها", "اخبار"],
            },
            {
              title: "خدمات",
              en: "SERVICES",
              links: ["گارانتی مادام‌العمر", "سرویس دوره‌ای", "بازسازی", "خرید اختصاصی"],
            },
            {
              title: "تماس",
              en: "CONTACT",
              links: ["ژنو", "دبی", "توکیو", "نیویورک", "قرار ملاقات"],
            },
          ].map((col, i) => (
            <div key={i} className="md:col-span-2">
              <div className="text-[9px] tracking-luxe text-gold/60 mb-4">
                {col.en} / {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="font-fa text-xs text-foreground/60 hover:text-gold transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant brand text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative border-t border-gold/10 pt-12"
        >
          <h2 className="font-display text-[18vw] md:text-[14vw] lg:text-[12rem] font-black text-center leading-none text-gold-gradient">
            AURUM
          </h2>
        </motion.div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-[10px] text-foreground/40">
            <span>© ۲۰۲۵ AURUM SA</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:text-gold transition-colors">
              حریم خصوصی
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              شرایط
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              کوکی‌ها
            </a>
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-luxe text-gold/40">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>SWISS MADE — GENÈVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
