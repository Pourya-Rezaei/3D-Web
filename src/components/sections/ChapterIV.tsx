"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useAudio } from "@/components/AudioProvider";

/**
 * Chapter IV: Assembly
 * - User clicks each part (in order) to install it
 * - Watch assembles progressively
 * - When all 4 parts installed, success sound + tick-tock starts
 */

type Part = "case" | "dial" | "hands" | "crown";

const partOrder: Part[] = ["case", "dial", "hands", "crown"];

const partInfo: Record<Part, { name: string; nameFa: string; step: string }> = {
  case: { name: "Case", nameFa: "قاب", step: "STEP 01" },
  dial: { name: "Dial", nameFa: "صفحه", step: "STEP 02" },
  hands: { name: "Hands", nameFa: "عقربه‌ها", step: "STEP 03" },
  crown: { name: "Crown", nameFa: "تاج", step: "STEP 04" },
};

function InstalledWatch({ installed }: { installed: Set<Part> }) {
  const group = useRef<THREE.Group>(null);
  const secondHand = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.4) * 0.05;
      group.current.rotation.y += delta * 0.3;
    }
    // Only tick if all installed
    if (secondHand.current && installed.size === 4) {
      secondHand.current.rotation.z -= delta * 0.6;
    }
  });

  const goldMat = (
    <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
  );

  return (
    <group ref={group} scale={1.2}>
      {/* Case */}
      {installed.has("case") && (
        <group>
          <mesh>
            <torusGeometry args={[1.1, 0.07, 32, 64]} />
            {goldMat}
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <torusGeometry args={[1.0, 0.04, 32, 64]} />
            {goldMat}
          </mesh>
        </group>
      )}

      {/* Dial */}
      {installed.has("dial") && (
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.04, 64]} />
          <meshStandardMaterial color="#0a0805" metalness={0.6} roughness={0.4} />
        </mesh>
      )}

      {/* Hour markers (with dial) */}
      {installed.has("dial") &&
        Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * 0.82, -Math.cos(angle) * 0.82, 0.08]}
            >
              <boxGeometry args={[0.04, 0.1, 0.02]} />
              {goldMat}
            </mesh>
          );
        })}

      {/* Hands */}
      {installed.has("hands") && (
        <group position={[0, 0, 0.14]}>
          {/* Hour */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.025, 0.5, 0.015]} />
            {goldMat}
          </mesh>
          {/* Minute */}
          <mesh position={[0, 0.4, 0.01]}>
            <boxGeometry args={[0.02, 0.8, 0.01]} />
            <meshStandardMaterial color="#e6c98b" metalness={1} roughness={0.15} />
          </mesh>
          {/* Second hand (animating) */}
          <group ref={secondHand}>
            <mesh position={[0, 0.35, 0.02]}>
              <boxGeometry args={[0.008, 0.7, 0.005]} />
              <meshStandardMaterial color="#8a7445" metalness={1} roughness={0.3} />
            </mesh>
          </group>
          {/* Center cap */}
          <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
            {goldMat}
          </mesh>
        </group>
      )}

      {/* Crown */}
      {installed.has("crown") && (
        <mesh position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 24]} />
          {goldMat}
        </mesh>
      )}
    </group>
  );
}

function AssemblyScene({ installed }: { installed: Set<Part> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[3, 5, 3]}
        angle={0.4}
        penumbra={1}
        intensity={2.5}
        color="#fff5e0"
        castShadow
      />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#e6c98b" />
      <pointLight position={[-3, 1, 2]} intensity={1} color="#c9a96a" />
      <pointLight position={[3, -1, 2]} intensity={0.8} color="#5a78d8" />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <InstalledWatch installed={installed} />
      </Float>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.6}
        scale={10}
        blur={3}
        color="#000000"
      />
      <Environment preset="night" />
    </>
  );
}

export function ChapterIV() {
  const [installed, setInstalled] = useState<Set<Part>>(new Set());
  const [activeStep, setActiveStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const audio = useAudio();

  const nextPart = partOrder[activeStep];
  const allInstalled = installed.size === 4;

  const handleInstall = (part: Part) => {
    if (part !== nextPart || installed.has(part)) return;
    audio.playSound("click", { volume: 0.4 });
    audio.playSound("gearWhir", { volume: 0.3, duration: 0.6 });

    setInstalled((prev) => new Set(prev).add(part));
    setActiveStep((s) => s + 1);

    if (installed.size + 1 === 4) {
      setTimeout(() => {
        audio.playSound("success", { volume: 0.5 });
        audio.startTickTock();
        setComplete(true);
      }, 800);
    }
  };

  const handleContinue = () => {
    audio.playSound("whoosh", { volume: 0.4 });
    document.querySelector("#chapter-5")?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset if user comes back to this chapter
  useEffect(() => {
    return () => {
      audio.stopTickTock();
    };
  }, [audio]);

  return (
    <section
      id="chapter-4"
      className="relative min-h-screen w-full bg-[#060a18] stars overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 169, 106, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Chapter title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-32 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <div className="text-[10px] tracking-luxe text-gold/70 mb-3">
          CHAPTER IV
        </div>
        <h1 className="chapter-title text-4xl md:text-6xl text-gold-gradient">
          Assembly
        </h1>
        <p className="font-fa text-sm text-foreground/50 mt-2">
          مونتاژ ساعت
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <AssemblyScene installed={installed} />
          </Suspense>
        </Canvas>
      </div>

      {/* Parts tray at bottom */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <div className="glass-midnight p-4 md:p-6">
          <div className="text-[9px] tracking-luxe text-gold/60 mb-3 text-center">
            {!allInstalled ? `INSTALL NEXT: ${partInfo[nextPart].step}` : "ASSEMBLY COMPLETE"}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {partOrder.map((part, i) => {
              const isInstalled = installed.has(part);
              const isNext = i === activeStep && !isInstalled;
              return (
                <motion.button
                  key={part}
                  onClick={() => handleInstall(part)}
                  disabled={!isNext}
                  whileHover={isNext ? { scale: 1.05 } : {}}
                  whileTap={isNext ? { scale: 0.95 } : {}}
                  className={`relative aspect-square rounded-sm flex flex-col items-center justify-center transition-all duration-300 ${
                    isInstalled
                      ? "bg-gold/10 ring-2 ring-gold cursor-default"
                      : isNext
                      ? "bg-gold/5 ring-1 ring-gold/60 hover:ring-gold cursor-pointer animate-pulse"
                      : "bg-black/40 ring-1 ring-foreground/10 opacity-40 cursor-not-allowed"
                  }`}
                >
                  {/* Part icon */}
                  <PartIcon part={part} installed={isInstalled} />
                  <div className="mt-2 text-[9px] tracking-luxe text-foreground/60">
                    {partInfo[part].step}
                  </div>
                  <div className="font-fa text-[10px] text-foreground/80 mt-0.5">
                    {partInfo[part].nameFa}
                  </div>
                  {isInstalled && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center text-[10px] text-black"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="chapter-title text-6xl md:text-8xl text-gold-gradient">
                It Lives
              </div>
              <p className="font-fa text-base text-foreground/70 mt-4">
                ساعت شما متولد شد
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="mx-auto mt-6 w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {allInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
          >
            <button
              onClick={handleContinue}
              className="group relative font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold px-12 py-4 overflow-hidden"
            >
              <span className="relative z-10">مشاهده‌ی ساعت نهایی ←</span>
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
    </section>
  );
}

function PartIcon({ part, installed }: { part: Part; installed: boolean }) {
  const color = installed ? "#c9a96a" : "#8a8175";
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
      {part === "case" && (
        <>
          <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="2" />
          <circle cx="20" cy="20" r="10" stroke={color} strokeWidth="1" opacity="0.5" />
        </>
      )}
      {part === "dial" && (
        <>
          <circle cx="20" cy="20" r="11" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => {
            const angle = (i / 4) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={20 + Math.cos(angle) * 8}
                y1={20 + Math.sin(angle) * 8}
                x2={20 + Math.cos(angle) * 11}
                y2={20 + Math.sin(angle) * 11}
                stroke={color}
                strokeWidth="2"
              />
            );
          })}
        </>
      )}
      {part === "hands" && (
        <>
          <line x1="20" y1="20" x2="20" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="20" x2="28" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="20" r="2" fill={color} />
        </>
      )}
      {part === "crown" && (
        <>
          <rect x="14" y="17" width="8" height="6" rx="1" stroke={color} strokeWidth="2" />
          <line x1="22" y1="20" x2="28" y2="20" stroke={color} strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={14 + i * 2}
              y1="15"
              x2={14 + i * 2}
              y2="17"
              stroke={color}
              strokeWidth="1"
            />
          ))}
        </>
      )}
    </svg>
  );
}
