"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Float,
  Sparkles,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { WatchModelV2, defaultWatchConfig } from "@/components/three/WatchModelV2";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

function GoldParticles() {
  return (
    <>
      <Sparkles
        count={120}
        scale={[10, 7, 5]}
        size={3}
        speed={0.4}
        opacity={0.7}
        color="#e6c98b"
      />
      <Sparkles
        count={60}
        scale={[12, 10, 8]}
        size={1.5}
        speed={0.2}
        opacity={0.4}
        color="#c9a96a"
      />
      {/* Floating gold spheres */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 3.5 + Math.sin(i) * 0.5;
        return (
          <Float
            key={i}
            speed={1 + (i % 3) * 0.3}
            rotationIntensity={0.5}
            floatIntensity={1.5}
            position={[Math.cos(angle) * r, Math.sin(i * 1.2) * 1.5, Math.sin(angle) * r]}
          >
            <mesh>
              <icosahedronGeometry args={[0.08, 1]} />
              <meshStandardMaterial
                color="#c9a96a"
                metalness={1}
                roughness={0.15}
                emissive="#3a2e15"
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

export function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const watchScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.6]);
  const watchRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{ minHeight: "100vh" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0805] via-black to-[#0a0805]" />
      {/* Animated spotlight follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 12}% ${
            50 + mousePos.y * 12
          }%, rgba(201, 169, 106, 0.22) 0%, rgba(201, 169, 106, 0.05) 30%, transparent 60%)`,
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,169,106,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,106,1) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 70%)",
        }}
      />

      {/* 3D Canvas */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: watchScale, rotate: watchRotate }}
      >
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 8, 18]} />

            {/* Lights */}
            <ambientLight intensity={0.3} />
            <spotLight
              position={[5, 8, 5]}
              angle={0.3}
              penumbra={1}
              intensity={3}
              color="#fff5e0"
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <spotLight
              position={[-5, -3, 3]}
              angle={0.4}
              penumbra={1}
              intensity={1.5}
              color="#c9a96a"
            />
            <pointLight position={[0, 0, 3]} intensity={2} color="#e6c98b" />
            <pointLight position={[3, 3, -3]} intensity={1} color="#ff8a3c" />

            {/* Watch model */}
            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
              <WatchModelV2 scrollProgress={scrollProgress} />
            </Float>

            <GoldParticles />

            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.6}
              scale={10}
              blur={3}
              color="#000000"
              far={5}
            />

            <Environment preset="night" />

            {/* Post-processing */}
            <EffectComposer multisampling={4}>
              <Bloom
                intensity={0.8}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <ChromaticAberration
                offset={new THREE.Vector2(0.0008, 0.0008)}
                radialModulation={false}
                modulationOffset={0}
              />
              <Vignette eskil={false} offset={0.2} darkness={0.9} />
              <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
            </EffectComposer>

            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black z-20 pointer-events-none" />

      {/* Overlay text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* Top brand bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.4 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] tracking-luxe text-gold/70"
        >
          <span className="w-12 h-px bg-gold/40" />
          <span>EST. ۱۹۸۶ — SWISS MADE</span>
          <span className="w-12 h-px bg-gold/40" />
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, scale: 1.15, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, scale: 1, letterSpacing: "0.02em" }}
          transition={{ duration: 2.5, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ duration: 1.4, delay: 3.2 }}
          className="font-fa text-base md:text-xl text-foreground/80 tracking-wide-luxe -mt-4"
        >
          هنرِ زمان‌سنجی در نهایتِ ظرافت
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.6 }}
          className="absolute bottom-28 flex flex-col items-center gap-3"
        >
          <div
            data-cursor
            data-cursor-text="اسکرول"
            className="pointer-events-auto group relative px-10 py-4 border border-gold/40 hover:border-gold transition-all duration-500 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 bg-gold/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative font-fa text-sm tracking-wide-luxe text-gold">
              کالکشن را کاوش کنید
            </span>
          </div>

          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-2 text-[10px] text-foreground/40 tracking-luxe mt-6">
            <span>اسکرول کنید</span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Side vertical text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block z-10"
      >
        <p className="vertical-text text-[10px] tracking-luxe text-foreground/40">
          MAISON AURUM — GENÈVE
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block z-10"
      >
        <p className="vertical-text text-[10px] tracking-luxe text-foreground/40">
          N° ۱۹۸۶ / کالکشن ۲۰۲۵
        </p>
      </motion.div>
    </section>
  );
}
