"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/sections/Loader";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Collection } from "@/components/sections/Collection";
import { Craftsmanship } from "@/components/sections/Craftsmanship";
import { FeaturedTimepiece } from "@/components/sections/FeaturedTimepiece";
import { Heritage } from "@/components/sections/Heritage";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgress, ScrollIndicator } from "@/components/sections/ScrollProgress";

// Babylon.js is heavy — load only on client, after first paint
const BabylonShowroom = dynamic(
  () => import("@/components/sections/BabylonShowroom").then((m) => m.BabylonShowroom),
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
    <main className="relative bg-black min-h-screen overflow-x-hidden">
      <Loader />
      <Navbar />
      <ScrollProgress />
      <ScrollIndicator />

      {/* Hero — Three.js 3D watch */}
      <Hero />

      {/* Brand manifesto with cinematic text reveal (GSAP) */}
      <Manifesto />

      {/* Watch collection grid */}
      <Collection />

      {/* 3D interactive showroom (Babylon.js) */}
      <BabylonShowroom />

      {/* Craftsmanship with parallax (sticky scroll) */}
      <Craftsmanship />

      {/* Featured timepiece with hero watch image */}
      <FeaturedTimepiece />

      {/* Heritage timeline */}
      <Heritage />

      {/* Testimonials marquee + cards */}
      <Testimonials />

      {/* Contact / booking form */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
