"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTypewriter } from "@/lib/useTypewriter";
import { useAudio } from "@/components/AudioProvider";

/**
 * Chapter I: The Invitation
 * - 3D envelope floating in space
 * - User hovers/clicks envelope to open
 * - Letter inside is typed out with typewriter effect
 * - "Enter Atelier" button to advance to Chapter II
 */

const invitationText = `ژنو، ۱۹۸۶

کاربر گرامی،

شما به عنوان شاگرد ساعت‌سازی به آتلیه‌ی AURUM دعوت شده‌اید. در طول این تجربه، شما می‌آموزید که چگونه یک شاهکار متولد می‌شود — از انتخاب اولین قطعه تا امضای نهایی.

آماده‌اید؟

— M. Reinhart`;

function EnvelopeModel({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    if (group.current) {
      // Float + slight rotation following pointer
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.6) * 0.1;
      // Subtle rotation toward pointer
      const targetRotY = pointer.x * 0.3;
      const targetRotX = -pointer.y * 0.2;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotY,
        delta * 3
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetRotX,
        delta * 3
      );
    }
    if (flap.current) {
      // Animate flap open
      const targetRotX = isOpen ? -Math.PI * 0.85 : 0;
      flap.current.rotation.x = THREE.MathUtils.lerp(
        flap.current.rotation.x,
        targetRotX,
        delta * 4
      );
    }
  });

  // Wax seal color (gold)
  const waxMat = (
    <meshStandardMaterial
      color="#c9a96a"
      metalness={0.7}
      roughness={0.3}
      emissive="#3a2e15"
      emissiveIntensity={0.4}
    />
  );

  const paperMat = (
    <meshStandardMaterial
      color="#f0e6d2"
      roughness={0.9}
      metalness={0}
      side={THREE.DoubleSide}
    />
  );

  const envelopeMat = (
    <meshStandardMaterial
      color="#1a2548"
      roughness={0.7}
      metalness={0.2}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        if (!isOpen) onOpen();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Envelope body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.6, 0.08]} />
        {envelopeMat}
      </mesh>

      {/* Front face (where address would be) */}
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[2.4, 1.6]} />
        <meshStandardMaterial
          color="#0f1530"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Gold border on envelope */}
      <mesh position={[0, 0, 0.042]}>
        <ringGeometry args={[1.05, 1.1, 4]} />
        <meshBasicMaterial color="#c9a96a" side={THREE.DoubleSide} />
      </mesh>

      {/* Wax seal (circle) on front */}
      <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
        {waxMat}
      </mesh>
      {/* AURUM "A" on seal */}
      <mesh position={[0, 0, 0.075]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.13, 0.015, 8, 32]} />
        <meshStandardMaterial color="#e6c98b" metalness={1} roughness={0.2} />
      </mesh>

      {/* Flap (back top) */}
      <group ref={flap} position={[0, 0.8, -0.04]}>
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.6]} />
          {envelopeMat}
        </mesh>
      </group>

      {/* Letter inside (visible when open) */}
      <group position={[0, isOpen ? 0.3 : 0, 0.05]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.0, 2.8]} />
          {paperMat}
        </mesh>
      </group>

      {/* Decorative gold lines on envelope */}
      <mesh position={[0, 0.65, 0.043]}>
        <planeGeometry args={[2.2, 0.012]} />
        <meshBasicMaterial color="#c9a96a" />
      </mesh>
      <mesh position={[0, -0.65, 0.043]}>
        <planeGeometry args={[2.2, 0.012]} />
        <meshBasicMaterial color="#c9a96a" />
      </mesh>
    </group>
  );
}

function EnvelopeScene({
  isOpen,
  onOpen,
}: {
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[3, 6, 4]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#fff5e0"
        castShadow
      />
      <spotLight
        position={[-4, 2, 3]}
        angle={0.5}
        penumbra={1}
        intensity={1.2}
        color="#c9a96a"
      />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#e6c98b" />
      <pointLight position={[2, -2, 1]} intensity={0.8} color="#5a78d8" />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <EnvelopeModel isOpen={isOpen} onOpen={onOpen} />
      </Float>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={8}
        blur={3}
        color="#000000"
      />
      <Environment preset="night" />
    </>
  );
}

export function ChapterI() {
  const [opened, setOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [enterAtelier, setEnterAtelier] = useState(false);
  const audio = useAudio();

  const { text, isDone } = useTypewriter(opened ? invitationText : "", {
    speed: 20,
    startDelay: 800,
    enabled: opened,
  });

  const handleOpen = () => {
    setOpened(true);
    audio.playSound("paperRustle", { volume: 0.5 });
    setTimeout(() => {
      setShowContent(true);
    }, 600);
    setTimeout(() => {
      audio.playSound("chime", { volume: 0.4 });
    }, 1000);
  };

  const handleEnter = () => {
    audio.playSound("whoosh", { volume: 0.4 });
    audio.startTickTock();
    setEnterAtelier(true);
    // Scroll to next chapter
    setTimeout(() => {
      document.querySelector("#chapter-2")?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  return (
    <section
      id="chapter-1"
      className="relative min-h-screen w-full bg-[#060a18] stars overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 169, 106, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Top chapter label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-32 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <div className="text-[10px] tracking-luxe text-gold/70 mb-3">
          CHAPTER I
        </div>
        <h1 className="chapter-title text-4xl md:text-6xl text-gold-gradient">
          The Invitation
        </h1>
        <p className="font-fa text-sm text-foreground/50 mt-2">
          دعوت‌نامه
        </p>
      </motion.div>

      {/* 3D Canvas - clicking anywhere on this layer opens the envelope */}
      <div
        className="absolute inset-0 cursor-pointer z-[5]"
        onClick={() => {
          if (!opened) handleOpen();
        }}
        style={{ pointerEvents: opened ? "none" : "auto" }}
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ pointerEvents: "none" }}
        >
          <Suspense fallback={null}>
            <EnvelopeScene isOpen={opened} onOpen={handleOpen} />
          </Suspense>
        </Canvas>
      </div>

      {/* Instruction */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center z-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gold text-2xl mb-2"
            >
              ↓
            </motion.div>
            <p className="font-fa text-sm text-foreground/60 tracking-wide-luxe">
              روی پاکت کلیک کنید تا باز شود
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter content overlay (typewriter) */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="glass-midnight max-w-md mx-4 p-8 md:p-12 pointer-events-auto">
              <div className="text-[9px] tracking-luxe text-gold/60 mb-4">
                MAISON AURUM — GENÈVE
              </div>
              <pre
                className="font-fa text-sm md:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed"
                style={{ fontFamily: "var(--font-vazir), monospace" }}
              >
                {text}
                {!isDone && (
                  <span className="inline-block w-2 h-4 bg-gold ml-1 animate-pulse" />
                )}
              </pre>

              {isDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-gold/20"
                >
                  <button
                    onClick={handleEnter}
                    className="group relative w-full font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold py-4 overflow-hidden"
                  >
                    <span className="relative z-10">
                      ورود به آتلیه ←
                    </span>
                    <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letterbox bars (cinematic) */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
    </section>
  );
}
