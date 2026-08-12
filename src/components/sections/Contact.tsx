"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="contact"
      className="relative section-pad bg-black overflow-hidden"
    >
      {/* Background giant text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="font-display text-[35vw] md:text-[25vw] font-black text-gold/[0.025] leading-none tracking-tighter">
          AURUM
        </span>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left side - copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-luxe text-gold/70">۰۶ / ۰۶</span>
            <span className="w-12 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">تماس</span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
            <span className="font-fa">به دنیای</span>
            <br />
            <span className="italic text-gold-gradient">AURUM</span>
            <br />
            <span className="font-fa">بپیوندید.</span>
          </h2>

          <p className="font-fa text-base text-foreground/60 leading-loose mt-8 max-w-lg">
            برای مشاهده‌ی خصوصی کالکشن، قرار ملاقات در سالن ژنو، یا سفارش
            اختصاصی قطعات محدود، فرم کنار را تکمیل کنید. تیم پشتیبانی ما در کمتر
            از ۲۴ ساعت پاسخ می‌دهد.
          </p>

          {/* Contact info */}
          <div className="mt-12 space-y-6">
            {[
              {
                label: "آتلیه",
                en: "ATELIER",
                value: " Rue du Rhône 42, Genève, Switzerland",
                fa: "ژنو، سوئیس",
              },
              {
                label: "تلفن",
                en: "TELEPHONE",
                value: "+41 22 888 1986",
                fa: "روزهای هفته ۹ تا ۱۸",
              },
              {
                label: "ایمیل",
                en: "EMAIL",
                value: "private@aurum-watch.ch",
                fa: "پاسخ در کمتر از ۲۴ ساعت",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 pb-6 border-b border-gold/10"
              >
                <div className="flex-1">
                  <div className="text-[9px] tracking-luxe text-gold/60 mb-1.5">
                    {c.en} / {c.label}
                  </div>
                  <div className="font-display text-lg text-foreground">
                    {c.value}
                  </div>
                  <div className="font-fa text-xs text-foreground/40 mt-1">{c.fa}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass-gold p-8 md:p-12 relative"
        >
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold/40" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold/40" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold/40" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold/40" />

          <div className="text-[10px] tracking-luxe text-gold/70 mb-2">
            PRIVATE BOOKING / قرار ملاقات
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-foreground mb-8">
            <span className="italic text-gold-gradient">Request</span>{" "}
            <span className="font-fa">خصوصی</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="نام" en="FIRST NAME" name="firstName" />
              <Field label="نام خانوادگی" en="LAST NAME" name="lastName" />
            </div>
            <Field label="ایمیل" en="EMAIL" name="email" type="email" />
            <Field label="شماره تماس" en="PHONE" name="phone" type="tel" />

            <div>
              <label className="block text-[9px] tracking-luxe text-gold/60 mb-2">
                قطعه‌ی مورد نظر / WATCH OF INTEREST
              </label>
              <select className="w-full bg-black/40 border border-gold/20 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors font-fa">
                <option value="">انتخاب کنید...</option>
                <option>AURUM Tourbillon AR-007</option>
                <option>AURUM Rose AR-024</option>
                <option>AURUM Abyss AR-031</option>
                <option>AURUM Chrono AR-014</option>
                <option>سفارش اختصاصی / Bespoke</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] tracking-luxe text-gold/60 mb-2">
                پیام / MESSAGE
              </label>
              <textarea
                rows={4}
                className="w-full bg-black/40 border border-gold/20 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors font-fa resize-none"
                placeholder="پیام خود را اینجا بنویسید..."
              />
            </div>

            <button
              type="submit"
              className="group relative w-full font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold py-4 overflow-hidden"
            >
              <span className="relative z-10">
                {submitted ? "✓ ارسال شد — در انتظار پاسخ" : "ارسال درخواست"}
              </span>
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>

            <p className="font-fa text-[10px] text-foreground/40 text-center leading-relaxed">
              اطلاعات شما محرمانه باقی می‌ماند و هرگز با شخص ثالثی به اشتراک گذاشته نمی‌شود.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  en,
  name,
  type = "text",
}: {
  label: string;
  en: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[9px] tracking-luxe text-gold/60 mb-2">
        {en} / {label}
      </label>
      <input
        type={type}
        name={name}
        className="w-full bg-black/40 border border-gold/20 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors font-fa"
      />
    </div>
  );
}
