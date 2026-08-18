"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
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
