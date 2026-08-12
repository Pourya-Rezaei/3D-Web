"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Sparkles, ContactShadows } from "@react-three/drei";
import { WatchModel } from "@/components/three/WatchModel";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef as useReactRef } from "react";

function GoldParticles() {
  return (
    <>
      <Sparkles
        count={80}
        scale={[8, 6, 4]}
        size={2}
        speed={0.4}
        opacity={0.6}
        color="#c9a96a"
      />
      <Sparkles
        count={40}
        scale={[10, 8, 6]}
        size={1}
        speed={0.2}
        opacity={0.3}
        color="#e6c98b"
      />
    </>
  );
}

export function Hero() {
  const sectionRef = useReactRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const watchScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.4]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    };
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{ minHeight: "100vh" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0805] via-black to-[#0a0805]" />
      {/* Radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 10}% ${50 + mousePos.y * 10}%, rgba(201, 169, 106, 0.18) 0%, transparent 50%)`,
          transition: "background 0.3s ease",
        }}
      />

      {/* 3D Canvas */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: watchScale }}
      >
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight
              position={[5, 8, 5]}
              angle={0.3}
              penumbra={1}
              intensity={2.5}
              color="#fff5e0"
              castShadow
            />
            <spotLight
              position={[-5, -3, 3]}
              angle={0.4}
              penumbra={1}
              intensity={1.2}
              color="#c9a96a"
            />
            <pointLight position={[0, 0, 3]} intensity={1.5} color="#e6c98b" />

            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
              <WatchModel scrollProgress={scrollProgress} />
            </Float>

            <GoldParticles />

            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.5}
              scale={8}
              blur={2.5}
              color="#000000"
            />

            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Overlay text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* Top brand bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] tracking-luxe text-gold/70"
        >
          <span className="w-12 h-px bg-gold/40" />
          <span>EST. ۱۹۸۶ — SWISS MADE</span>
          <span className="w-12 h-px bg-gold/40" />
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="font-display text-[18vw] md:text-[14vw] lg:text-[12rem] font-black leading-none text-gold-shimmer">
            AURUM
          </h1>
        </motion.div>

        {/* Persian tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.2 }}
          className="font-fa text-base md:text-xl text-foreground/80 tracking-wide-luxe -mt-4"
        >
          هنرِ زمان‌سنجی در نهایتِ ظرافت
        </motion.p>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="absolute bottom-32 flex flex-col items-center gap-3"
        >
          <button className="group relative px-10 py-4 border border-gold/40 hover:border-gold transition-all duration-500 pointer-events-auto overflow-hidden">
            <span className="absolute inset-0 bg-gold/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative font-fa text-sm tracking-wide-luxe text-gold">
              کالکشن را کاوش کنید
            </span>
          </button>
          <div className="flex items-center gap-2 text-[10px] text-foreground/40 tracking-luxe mt-6">
            <span>اسکرول کنید</span>
            <span className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
          </div>
        </motion.div>
      </motion.div>

      {/* Side vertical text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <p className="vertical-text text-[10px] tracking-luxe text-foreground/40">
          MAISON AURUM — GENÈVE
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <p className="vertical-text text-[10px] tracking-luxe text-foreground/40">
          N° ۱۹۸۶ / کالکشن ۲۰۲۵
        </p>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
