"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTypewriter } from "@/lib/useTypewriter";
import { useAudio } from "@/components/AudioProvider";

/**
 * Chapter III: The Choice
 * User chooses between mechanical (traditional) vs automatic (modern) movement.
 * Split screen shows both options.
 */

type Movement = "mechanical" | "automatic";

const movementInfo = {
  mechanical: {
    title: "Mechanical",
    titleFa: "مکانیکی دستی",
    description:
      "میراث ساعت‌سازی سنتی. باید هر روز صبح کوک کنید. صدای آرام چرخ‌دنده‌ها، شبیه قلبی که می‌تپد. برای کسانی که آیین صبحگاهی دارند.",
    pros: ["میراث ۲۰۰ ساله", "صدای گرم چرخ‌دنده‌ها", "حفظ سنتی ساعت‌سازی"],
    caliber: "AR-007",
    power: "۸۰ ساعت",
  },
  automatic: {
    title: "Automatic",
    titleFa: "اتوماتیک",
    description:
      "آینده‌ی ساعت‌سازی. روتور طلا با حرکت مچ شما ساعت را کوک می‌کند. هرگز متوقف نمی‌شود. برای کسانی که در حرکت‌اند.",
    pros: ["بدون نیاز به کوک", "ذخیره انرژی ۹ روز", "تکنولوژی پیشرفته"],
    caliber: "AR-920",
    power: "۲۱۶ ساعت",
  },
};

function MechanicalMovement({ isHighlighted }: { isHighlighted: boolean }) {
  const group = useRef<THREE.Group>(null);
  const balanceWheel = useRef<THREE.Group>(null);
  const gear1 = useRef<THREE.Group>(null);
  const gear2 = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.5) * 0.05;
      group.current.rotation.y += delta * (isHighlighted ? 0.8 : 0.2);
    }
    if (balanceWheel.current) {
      balanceWheel.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.3;
    }
    if (gear1.current) gear1.current.rotation.z += delta * 0.5;
    if (gear2.current) gear2.current.rotation.z -= delta * 0.7;
  });

  const goldMat = (
    <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
  );

  return (
    <group ref={group} scale={isHighlighted ? 1.1 : 1}>
      {/* Main plate */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[1.0, 1.0, 0.06, 32]} />
        <meshStandardMaterial color="#1a1410" metalness={0.6} roughness={0.4} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Main plate visible face */}
      <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.02, 32]} />
        <meshStandardMaterial color="#3a2818" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Main gear */}
      <group ref={gear1} position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 24]} />
          {goldMat}
        </mesh>
        {Array.from({ length: 24 }).map((_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 24) * Math.PI * 2]}
            position={[
              Math.cos((i / 24) * Math.PI * 2) * 0.35,
              Math.sin((i / 24) * Math.PI * 2) * 0.35,
              0,
            ]}
          >
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            {goldMat}
          </mesh>
        ))}
      </group>

      {/* Secondary gear */}
      <group ref={gear2} position={[0.5, 0.3, 0.05]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <meshStandardMaterial color="#8a7445" metalness={1} roughness={0.3} />
        </mesh>
      </group>

      {/* Balance wheel (oscillating) */}
      <group ref={balanceWheel} position={[-0.5, 0.3, 0.05]}>
        <mesh>
          <torusGeometry args={[0.2, 0.015, 8, 24]} />
          <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {[0, 1].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 2) * Math.PI]}>
            <boxGeometry args={[0.4, 0.01, 0.01]} />
            <meshStandardMaterial color="#8a7445" metalness={1} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Center jewel */}
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#ff4a4a"
          emissive="#aa0000"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function AutomaticMovement({ isHighlighted }: { isHighlighted: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.5 + 1) * 0.05;
      group.current.rotation.y += delta * (isHighlighted ? 0.8 : 0.2);
    }
    if (rotor.current) {
      // Rotor swings around the watch
      rotor.current.rotation.z += delta * 1.2;
    }
  });

  const goldMat = (
    <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
  );

  return (
    <group ref={group} scale={isHighlighted ? 1.1 : 1}>
      {/* Main plate */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[1.0, 1.0, 0.06, 32]} />
        <meshStandardMaterial color="#0a1428" metalness={0.7} roughness={0.3} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.02, 32]} />
        <meshStandardMaterial color="#1a2548" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Modern gear pattern (more geometric) */}
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[0.3, 0.04, 16, 32]} />
        {goldMat}
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
        <meshStandardMaterial color="#e6c98b" metalness={1} roughness={0.15} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Rotor (the automatic winding weight) */}
      <group ref={rotor} position={[0, 0, 0.1]}>
        <mesh position={[0.5, 0, 0]}>
          <torusGeometry args={[0.4, 0.15, 16, 32, Math.PI]} />
          {goldMat}
        </mesh>
      </group>

      {/* Modern accents (blue screws) */}
      {[
        [-0.4, -0.4, 0.05],
        [0.4, -0.4, 0.05],
        [-0.4, 0.4, 0.05],
        [0.4, 0.4, 0.05],
      ].map((pos, i) => (
        <mesh key={i} position={pos as any}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
          <meshStandardMaterial
            color="#4a78ff"
            metalness={0.8}
            roughness={0.4}
            emissive="#1a3aaa"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function MovementScene({
  movement,
  isHighlighted,
}: {
  movement: Movement;
  isHighlighted: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[3, 5, 3]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#fff5e0"
        castShadow
      />
      <pointLight position={[-2, 0, 2]} intensity={1.2} color="#c9a96a" />
      <pointLight position={[2, 0, 2]} intensity={0.8} color="#5a78d8" />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        {movement === "mechanical" ? (
          <MechanicalMovement isHighlighted={isHighlighted} />
        ) : (
          <AutomaticMovement isHighlighted={isHighlighted} />
        )}
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

export function ChapterIII() {
  const [hovered, setHovered] = useState<Movement | null>(null);
  const [selected, setSelected] = useState<Movement | null>(null);
  const audio = useAudio();

  const handleSelect = (m: Movement) => {
    if (selected) return;
    setSelected(m);
    audio.playSound("chime", { volume: 0.5 });
    audio.playSound("gearWhir", { volume: 0.4, duration: 1.5 });
    setTimeout(() => {
      audio.playSound("whoosh", { volume: 0.4 });
    }, 1500);
    setTimeout(() => {
      document.querySelector("#chapter-4")?.scrollIntoView({ behavior: "smooth" });
    }, 2400);
  };

  const currentInfo = selected ? movementInfo[selected] : null;
  const { text: description } = useTypewriter(currentInfo?.description ?? "", {
    speed: 30,
    enabled: !!currentInfo,
  });

  return (
    <section
      id="chapter-3"
      className="relative min-h-screen w-full bg-[#060a18] stars overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 169, 106, 0.06) 0%, transparent 60%)",
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
          CHAPTER III
        </div>
        <h1 className="chapter-title text-4xl md:text-6xl text-gold-gradient">
          The Choice
        </h1>
        <p className="font-fa text-sm text-foreground/50 mt-2">
          انتخاب مکانیزم
        </p>
      </motion.div>

      {/* Two options side-by-side */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-7xl px-6 md:px-12 w-full">
          {/* Mechanical */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={() => handleSelect("mechanical")}
            onMouseEnter={() => setHovered("mechanical")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 ${
              selected === "mechanical"
                ? "scale-105 ring-2 ring-gold"
                : selected
                ? "opacity-30 scale-95"
                : "ring-1 ring-gold/20 hover:ring-gold/60"
            }`}
          >
            <div className="absolute inset-0">
              <Canvas
                camera={{ position: [0, 0, 3.5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <MovementScene
                    movement="mechanical"
                    isHighlighted={hovered === "mechanical" || selected === "mechanical"}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Label */}
            <div className="absolute top-4 left-4 z-10">
              <div className="text-[9px] tracking-luxe text-gold/60 mb-1">
                OPTION A
              </div>
              <div className="chapter-title text-2xl text-gold-gradient">
                Mechanical
              </div>
              <div className="font-fa text-xs text-foreground/60">مکانیکی دستی</div>
            </div>

            {/* Pros */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
              {movementInfo.mechanical.pros.map((p, i) => (
                <div key={i} className="font-fa text-[10px] text-foreground/70 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  {p}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Automatic */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={() => handleSelect("automatic")}
            onMouseEnter={() => setHovered("automatic")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 ${
              selected === "automatic"
                ? "scale-105 ring-2 ring-gold"
                : selected
                ? "opacity-30 scale-95"
                : "ring-1 ring-gold/20 hover:ring-gold/60"
            }`}
          >
            <div className="absolute inset-0">
              <Canvas
                camera={{ position: [0, 0, 3.5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <MovementScene
                    movement="automatic"
                    isHighlighted={hovered === "automatic" || selected === "automatic"}
                  />
                </Suspense>
              </Canvas>
            </div>

            <div className="absolute top-4 left-4 z-10">
              <div className="text-[9px] tracking-luxe text-gold/60 mb-1">
                OPTION B
              </div>
              <div className="chapter-title text-2xl text-gold-gradient">
                Automatic
              </div>
              <div className="font-fa text-xs text-foreground/60">اتوماتیک</div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
              {movementInfo.automatic.pros.map((p, i) => (
                <div key={i} className="font-fa text-[10px] text-foreground/70 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  {p}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Selection confirmation overlay */}
      <AnimatePresence>
        {selected && currentInfo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 max-w-md w-full mx-4 glass-midnight p-8"
          >
            <div className="text-[9px] tracking-luxe text-gold/60 mb-2">
              YOUR CHOICE
            </div>
            <h2 className="chapter-title text-3xl text-gold-gradient mb-1">
              {currentInfo.title}
            </h2>
            <p className="font-fa text-sm text-foreground/70 mb-3">
              {currentInfo.titleFa}
            </p>
            <p className="font-fa text-sm text-foreground/80 leading-loose min-h-[5rem]">
              {description}
              <span className="inline-block w-2 h-4 bg-gold ml-1 animate-pulse" />
            </p>
            <div className="mt-4 pt-4 border-t border-gold/20 flex justify-between text-xs">
              <span className="font-fa text-foreground/50">کالیبر: {currentInfo.caliber}</span>
              <span className="font-fa text-foreground/50">ذخیره: {currentInfo.power}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction */}
      {!selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <p className="font-fa text-sm text-foreground/60">
            روی مکانیزم دلخواه خود کلیک کنید
          </p>
        </motion.div>
      )}

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
    </section>
  );
}
