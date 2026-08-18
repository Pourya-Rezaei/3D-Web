"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTypewriter } from "@/lib/useTypewriter";
import { useAudio } from "@/components/AudioProvider";

/**
 * Chapter II: Atelier 1986
 * - 3 workbench tools floating in space
 * - Click each to learn about the craft step
 * - After all 3 explored, "continue" appears
 */

type Tool = "loupe" | "tweezers" | "screwdriver";

const toolInfo: Record<
  Tool,
  { title: string; titleFa: string; description: string; step: string }
> = {
  loupe: {
    title: "The Loupe",
    titleFa: "ذره‌بین",
    step: "STEP 01",
    description:
      "هر ساعت‌ساز ارشد با ذره‌بین شروع می‌کند. این ابزار، جهان را ۱۰ برابر بزرگ می‌کند تا چشم انسان بتواند قطعاتی به کوچکی نصف میلی‌متر را ببیند. بدون ذره‌بین، هنر ساعت‌سازی غیرممکن است.",
  },
  tweezers: {
    title: "The Tweezers",
    titleFa: "پنس",
    step: "STEP 02",
    description:
      "پنس، انگشتان دومِ ساعت‌ساز است. از فولاد ضدزنگ آلمان ساخته می‌شود و نوک آن‌ها آن‌قدر ظریف است که می‌تواند یک تار مو را بلند کند. هر ساعت حاوی بیش از ۳۰۰ قطعه است که هر یک با پنس در جای خود نشسته.",
  },
  screwdriver: {
    title: "The Screwdriver",
    titleFa: "پیچ‌گوشتی",
    step: "STEP 03",
    description:
      "پیچ‌گوشتی ساعت‌سازی، با قطر ۰.۸ میلی‌متر، ظریف‌ترین ابزار دستی جهان است. هر پیچ باید با گشتاور دقیق ۱.۵ سانتی‌متر-نیوتن بسته شود — بیشتر یا کمتر، و ساعت دقیق نخواهد بود.",
  },
};

function Loupe({ onClick, isActive }: { onClick: () => void; isActive: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = Math.sin(t * 0.6 + 1) * 0.1;
      ref.current.rotation.z = Math.sin(t * 0.3) * 0.05;
      if (isActive) {
        ref.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={ref}
      position={[-1.8, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Handle */}
      <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.6, 16]} />
        <meshStandardMaterial color="#1a1410" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Ring */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.32, 0.04, 16, 32]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 32]} />
        <meshPhysicalMaterial
          color="#a0c8e0"
          transmission={0.9}
          transparent
          opacity={0.4}
          roughness={0}
          metalness={0}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}

function Tweezers({ onClick, isActive }: { onClick: () => void; isActive: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = Math.sin(t * 0.6 + 2) * 0.1;
      ref.current.rotation.z = Math.sin(t * 0.3 + 1) * 0.05;
      if (isActive) {
        ref.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={ref}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Two prongs */}
      <mesh position={[-0.04, 0, 0]} rotation={[0, 0, 0.02]}>
        <boxGeometry args={[0.04, 1.4, 0.04]} />
        <meshStandardMaterial color="#9aa0a8" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.04, 0, 0]} rotation={[0, 0, -0.02]}>
        <boxGeometry args={[0.04, 1.4, 0.04]} />
        <meshStandardMaterial color="#9aa0a8" metalness={1} roughness={0.2} />
      </mesh>
      {/* Top grip */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color="#1a1410" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Screwdriver({
  onClick,
  isActive,
}: {
  onClick: () => void;
  isActive: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = Math.sin(t * 0.6 + 3) * 0.1;
      ref.current.rotation.z = Math.sin(t * 0.3 + 2) * 0.05;
      if (isActive) {
        ref.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={ref}
      position={[1.8, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Handle */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.6, 16]} />
        <meshStandardMaterial color="#8a3a2a" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 16]} />
        <meshStandardMaterial color="#9aa0a8" metalness={1} roughness={0.2} />
      </mesh>
      {/* Tip */}
      <mesh position={[0, -0.42, 0]}>
        <coneGeometry args={[0.025, 0.1, 16]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Workbench({ activeTool, onSelect }: { activeTool: Tool | null; onSelect: (t: Tool) => void }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={1}
        intensity={2.5}
        color="#fff5e0"
        castShadow
      />
      <pointLight position={[-3, 1, 2]} intensity={1} color="#c9a96a" />
      <pointLight position={[3, 1, 2]} intensity={0.8} color="#5a78d8" />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#e6c98b" />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Loupe onClick={() => onSelect("loupe")} isActive={activeTool === "loupe"} />
      </Float>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.3}>
        <Tweezers onClick={() => onSelect("tweezers")} isActive={activeTool === "tweezers"} />
      </Float>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.3}>
        <Screwdriver onClick={() => onSelect("screwdriver")} isActive={activeTool === "screwdriver"} />
      </Float>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={10}
        blur={3}
        color="#000000"
      />
      <Environment preset="night" />
    </>
  );
}

export function ChapterII() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [explored, setExplored] = useState<Set<Tool>>(new Set());
  const audio = useAudio();

  const handleSelect = (t: Tool) => {
    setActiveTool(t);
    audio.playSound("click", { volume: 0.4 });
    audio.playSound("gearWhir", { volume: 0.3, duration: 0.5 });
    setExplored((prev) => new Set(prev).add(t));
  };

  const allExplored = explored.size === 3;
  const currentInfo = activeTool ? toolInfo[activeTool] : null;

  const { text: description } = useTypewriter(currentInfo?.description ?? "", {
    speed: 30,
    enabled: !!currentInfo,
  });

  const handleContinue = () => {
    audio.playSound("whoosh", { volume: 0.4 });
    audio.playSound("chime", { volume: 0.3 });
    document.querySelector("#chapter-3")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="chapter-2"
      className="relative min-h-screen w-full bg-[#060a18] stars overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, rgba(90, 120, 216, 0.08) 0%, transparent 60%)",
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
          CHAPTER II
        </div>
        <h1 className="chapter-title text-4xl md:text-6xl text-gold-gradient">
          Atelier 1986
        </h1>
        <p className="font-fa text-sm text-foreground/50 mt-2">
          کارگاه ساعت‌سازی
        </p>
      </motion.div>

      {/* Instruction */}
      {!activeTool && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-40 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <p className="font-fa text-sm text-foreground/60">
            روی هر ابزار کلیک کنید تا با آن آشنا شوید
          </p>
          <div className="flex justify-center gap-8 mt-4">
            {(["loupe", "tweezers", "screwdriver"] as Tool[]).map((t) => (
              <div
                key={t}
                className={`w-2 h-2 rounded-full transition-colors ${
                  explored.has(t) ? "bg-gold" : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Workbench activeTool={activeTool} onSelect={handleSelect} />
          </Suspense>
        </Canvas>
      </div>

      {/* Info panel (slides in from side) */}
      <AnimatePresence>
        {currentInfo && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 max-w-sm glass-midnight p-8 pointer-events-auto"
          >
            <div className="text-[9px] tracking-luxe text-gold/60 mb-2">
              {currentInfo.step}
            </div>
            <h2 className="chapter-title text-3xl text-gold-gradient mb-1">
              {currentInfo.title}
            </h2>
            <p className="font-fa text-sm text-foreground/70 mb-4">
              {currentInfo.titleFa}
            </p>
            <div className="gold-hairline w-full mb-4" />
            <p className="font-fa text-sm text-foreground/80 leading-loose min-h-[8rem]">
              {description}
              <span className="inline-block w-2 h-4 bg-gold ml-1 animate-pulse" />
            </p>
            <button
              onClick={() => {
                setActiveTool(null);
                audio.playSound("click", { volume: 0.3 });
              }}
              className="mt-6 w-full text-xs text-gold border border-gold/30 hover:bg-gold/10 py-2.5 transition-colors font-fa"
            >
              بستن
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {allExplored && !activeTool && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={handleContinue}
              className="group relative font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold px-12 py-4 overflow-hidden"
            >
              <span className="relative z-10">
                انتخاب مکانیزم ←
              </span>
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
            <p className="text-center mt-3 text-[10px] tracking-luxe text-gold/60">
              ادامه به Chapter III
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
    </section>
  );
}
