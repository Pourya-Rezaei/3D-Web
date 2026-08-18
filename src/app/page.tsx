"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { NavbarV2 } from "@/components/sections/NavbarV2";
import { HeroV2 } from "@/components/sections/HeroV2";
import { Manifesto } from "@/components/sections/Manifesto";
import { WatchConfigurator } from "@/components/sections/WatchConfigurator";
import { WatchAssembly } from "@/components/sections/WatchAssembly";
import { Collection } from "@/components/sections/Collection";
import { Craftsmanship } from "@/components/sections/Craftsmanship";
import { FeaturedTimepiece } from "@/components/sections/FeaturedTimepiece";
import { Heritage } from "@/components/sections/Heritage";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import {
  ScrollProgressV2,
  ScrollIndicatorV2,
} from "@/components/sections/ScrollProgressV2";

// Babylon.js is heavy — load only on client, after first paint
const BabylonShowroom = dynamic(
  () =>
    import("@/components/sections/BabylonShowroom").then((m) => m.BabylonShowroom),
  {
    ssr: false,
    loading: () => (
      <section id="showroom" className="section-pad bg-black flex items-center justify-center">
        <div className="font-display text-2xl text-gold-gradient animate-pulse">
          در حال بارگذاری نمایشگاه سه‌بعدی...
        </div>
      </section>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen">
      <CustomCursor />
      <PageTransition />
      <NavbarV2 />
      <ScrollProgressV2 />
      <ScrollIndicatorV2 />

      {/* Hero — Three.js 3D watch with postprocessing */}
      <HeroV2 />

      {/* Cinematic Experience banner — entry point to the interactive film */}
      <CinematicExperienceBanner />

      {/* Brand manifesto with cinematic text reveal (GSAP) */}
      <Manifesto />

      {/* Watch configurator — interactive 3D */}
      <WatchConfigurator />

      {/* Scroll-driven assembly animation */}
      <WatchAssembly />

      {/* Watch collection grid */}
      <Collection />

      {/* 3D interactive showroom (Babylon.js) */}
      <BabylonShowroom />

      {/* Craftsmanship with parallax (sticky scroll) */}
      <Craftsmanship />

      {/* Featured timepiece with hero watch image */}
      <FeaturedTimepiece />

      {/* AI Concierge banner — entry to the v4 personalized experience */}
      <ConciergeExperienceBanner />

      {/* Stats counter with animated numbers */}
      <StatsCounter />

      {/* Heritage timeline */}
      <Heritage />

      {/* Testimonials marquee + cards */}
      <Testimonials />

      {/* Newsletter / Private club */}
      <Newsletter />

      {/* Contact / booking form */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}

/**
 * Cinematic Experience banner — full-width CTA that invites users
 * into the interactive film experience at /cinematic.
 * Placed right after the hero.
 */
function CinematicExperienceBanner() {
  return (
    <section className="relative bg-black py-24 md:py-32 overflow-hidden">
      {/* Background starfield (using CSS only) */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(2px 2px at 20% 30%, rgba(201,169,106,0.6), transparent), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 80% 20%, rgba(201,169,106,0.4), transparent), radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.4), transparent), radial-gradient(2px 2px at 90% 60%, rgba(201,169,106,0.5), transparent)",
          backgroundSize: "600px 600px",
        }}
      />
      {/* Subtle navy gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(6,10,24,0.6), rgba(0,0,0,0.2), rgba(6,10,24,0.6))",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        {/* Label */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="w-16 h-px bg-gold/40" />
          <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
            تجربه‌ی ویژه
          </span>
          <span className="w-16 h-px bg-gold/40" />
        </div>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6">
          <span className="font-fa">یک</span>{" "}
          <span className="italic text-gold-gradient">سفر تعاملی</span>{" "}
          <span className="font-fa">داشته باشید</span>
        </h2>

        {/* Description */}
        <p className="font-fa text-base md:text-lg text-foreground/60 leading-loose max-w-2xl mx-auto mb-10">
          وارد آتلیه‌ی AURUM در ژنو شوید. در نقش یک شاگرد ساعت‌سازی،
          مکانیزم را انتخاب کنید، ساعت را با دست خود مونتا کنید،
          و در پایان گواهی اصالت شخصی دریافت کنید.
          <br />
          <span className="text-gold/80">یک فیلم ۶ فصلی تعاملی.</span>
        </p>

        {/* Chapter chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { num: "I", label: "دعوت‌نامه" },
            { num: "II", label: "کارگاه" },
            { num: "III", label: "انتخاب" },
            { num: "IV", label: "مونتاژ" },
            { num: "V", label: "تولد" },
            { num: "VI", label: "میراث" },
          ].map((ch, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 border border-gold/20 hover:border-gold/50 transition-colors group"
            >
              <span className="font-display text-sm text-gold/60 group-hover:text-gold transition-colors">
                {ch.num}
              </span>
              <span className="font-fa text-xs text-foreground/60 group-hover:text-foreground transition-colors">
                {ch.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/cinematic"
          data-cursor
          data-cursor-text="شروع"
          className="group relative inline-flex items-center gap-3 font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold px-12 py-5 overflow-hidden"
        >
          <span className="relative z-10">شروع تجربه‌ی سینمایی</span>
          <span className="relative z-10 text-lg group-hover:translate-x-1 transition-transform">
            ←
          </span>
          <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </Link>

        {/* Hint */}
        <p className="font-fa text-[10px] text-foreground/40 mt-6 tracking-wide-luxe">
          ✦ با صدا بهتر تجربه می‌شود — ۸ دقیقه
        </p>
      </div>

      {/* Decorative top + bottom hairlines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}

/**
 * Concierge Experience banner — entry point to the v4 AI-powered experience.
 * Light/gold contrast against the dark v2 backdrop to signal it's something different.
 */
function ConciergeExperienceBanner() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Light gallery background contrast (signal that this is something different) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1e8] via-[#ede5d2] to-[#e8e2d2]" />
      {/* Subtle gold particles */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 25% 30%, rgba(184,148,90,0.4), transparent), radial-gradient(1px 1px at 75% 60%, rgba(184,148,90,0.5), transparent), radial-gradient(2px 2px at 50% 80%, rgba(184,148,90,0.3), transparent), radial-gradient(1px 1px at 90% 20%, rgba(184,148,90,0.4), transparent)",
          backgroundSize: "500px 500px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        {/* Top label */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="w-16 h-px bg-[#b8945a]/50" />
          <span className="text-[10px] tracking-luxe text-[#b8945a]">
            NEW — AI-POWERED
          </span>
          <span className="w-16 h-px bg-[#b8945a]/50" />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-[#b8945a]/30 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] tracking-luxe text-[#b8945a]">
            Z-AI TECHNOLOGY
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 text-[#1a1410]"
        >
          <span className="italic text-gold-gradient">Sommelier</span>
          <br />
          <span className="font-fa">زمانِ شما</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-fa text-base md:text-lg text-[#4a3f2a]/80 leading-loose max-w-2xl mx-auto mb-8"
        >
          همان‌طور که یک sommelier شراب برای شما انتخاب می‌کند،
          <br />
          هوش مصنوعی AURUM ساعتِ متناسب با شخصیت شما را پیشنهاد می‌دهد.
          <br />
          <span className="text-[#b8945a]">
            ۵ سؤال — یک توصیه‌ی شخصی — یک گفت‌وگوی عمیق با Concierge
          </span>
        </motion.p>

        {/* Quiz preview chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {[
            { num: "۰۱", label: "سبک شخصی" },
            { num: "۰۲", label: "همراه روزانه" },
            { num: "۰۳", label: "روحِ متریال" },
            { num: "۰۴", label: "کارکردِ قلب" },
            { num: "۰۵", label: "دورانِ زمان" },
          ].map((q, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur border border-[#b8945a]/20"
            >
              <span className="font-display text-xs text-[#b8945a]">{q.num}</span>
              <span className="font-fa text-xs text-[#4a3f2a]">{q.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/experience"
            data-cursor
            data-cursor-text="شروع"
            className="group relative inline-flex items-center gap-3 px-12 py-5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a1410 0%, #3a2818 100%)",
              color: "#f5f1e8",
            }}
          >
            <span className="relative z-10 font-fa text-sm tracking-wide-luxe">
              شروع تجربه‌ی شخصی‌سازی
            </span>
            <span className="relative z-10 text-lg group-hover:translate-x-1 transition-transform">
              ←
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#d4b074] to-[#b8945a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="font-fa text-[10px] text-[#4a3f2a]/50 mt-6"
        >
          ✦ با هوش مصنوعی Z-AI — حدود ۳ دقیقه
        </motion.p>
      </div>

      {/* Decorative hairlines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#b8945a]/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#b8945a]/40 to-transparent" />
    </section>
  );
}
