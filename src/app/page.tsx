"use client";

import dynamic from "next/dynamic";
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
