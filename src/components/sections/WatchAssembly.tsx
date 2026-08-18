"use client";

import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

/**
 * Scroll-driven assembly:
 * As user scrolls through this section, watch parts fly in from outside the frame
 * and assemble into the final watch.
 *
 * Fix notes:
 * - Use shared ref for progress to avoid re-rendering Canvas on every scroll tick
 * - Each part rotates cylinders to face camera correctly (Z axis)
 * - Parts have a minimum visibility so something is always shown
 */

// Shared progress ref — updated by parent, read by children inside Canvas
type ProgressRef = React.MutableRefObject<number>;

function Case({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // Case animates in from progress 0 to 0.2
    const localP = Math.max(0, Math.min(1, p / 0.2));
    const eased = easeInOutCubic(localP);
    // Comes from left, position x: -5 -> 0
    ref.current.position.x = THREE.MathUtils.lerp(-5, 0, eased);
    ref.current.position.y = THREE.MathUtils.lerp(2, 0, eased);
    ref.current.rotation.z = THREE.MathUtils.lerp(Math.PI * 0.5, 0, eased);
    ref.current.rotation.y = THREE.MathUtils.lerp(Math.PI / 2, 0, eased);
  });

  return (
    <group ref={ref}>
      {/* Outer case ring */}
      <mesh>
        <torusGeometry args={[1.25, 0.08, 32, 64]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
      {/* Case middle (cylinder rotated to face camera) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.3, 64]} />
        <meshStandardMaterial color="#8a7445" metalness={1} roughness={0.3} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0, 0.16]}>
        <torusGeometry args={[1.1, 0.05, 32, 64]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Dial({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // Dial animates in from progress 0.2 to 0.4
    const localP = Math.max(0, Math.min(1, (p - 0.2) / 0.2));
    const eased = easeInOutCubic(localP);
    // Comes from right
    ref.current.position.x = THREE.MathUtils.lerp(5, 0, eased);
    ref.current.position.y = THREE.MathUtils.lerp(-2, 0, eased);
  });

  return (
    <group ref={ref}>
      {/* Dial cylinder (rotated to face camera) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.08, 1.08, 0.04, 64]} />
        <meshStandardMaterial color="#0a0805" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Hour markers (12 dots on the dial face) */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 0.92;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * r, Math.cos(angle) * r, 0.025]}
          >
            <boxGeometry args={[0.04, 0.04, 0.02]} />
            <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function Hands({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // Hands animate in from progress 0.4 to 0.6
    const localP = Math.max(0, Math.min(1, (p - 0.4) / 0.2));
    const eased = easeInOutCubic(localP);
    // Comes from top
    ref.current.position.y = THREE.MathUtils.lerp(4, 0.15, eased);
    ref.current.position.z = THREE.MathUtils.lerp(2, 0.16, eased);
    ref.current.rotation.x = THREE.MathUtils.lerp(Math.PI, 0, eased);
  });

  return (
    <group ref={ref}>
      {/* Hour hand */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.03, 0.5, 0.015]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
      {/* Minute hand */}
      <mesh position={[0, 0.4, 0.01]}>
        <boxGeometry args={[0.022, 0.8, 0.01]} />
        <meshStandardMaterial color="#e6c98b" metalness={1} roughness={0.15} />
      </mesh>
      {/* Center cap */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Crystal({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // Crystal animates in from progress 0.6 to 0.8
    const localP = Math.max(0, Math.min(1, (p - 0.6) / 0.2));
    const eased = easeInOutCubic(localP);
    // Comes from bottom
    ref.current.position.y = THREE.MathUtils.lerp(-4, 0.22, eased);
  });

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={0.95}
          transparent
          opacity={0.25}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}

function Crown({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // Crown animates in from progress 0.8 to 1.0
    const localP = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
    const eased = easeInOutCubic(localP);
    // Comes from front, slides to side
    ref.current.position.z = THREE.MathUtils.lerp(5, 0, eased);
    ref.current.position.x = THREE.MathUtils.lerp(0, 1.32, eased);
  });

  return (
    <group ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 24]} />
        <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function AssemblyScene({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        color="#fff5e0"
      />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#e6c98b" />
      <pointLight position={[-3, -3, -2]} intensity={0.8} color="#c9a96a" />
      <pointLight position={[3, 3, 2]} intensity={0.6} color="#fff5e0" />

      <Case progressRef={progressRef} />
      <Dial progressRef={progressRef} />
      <Hands progressRef={progressRef} />
      <Crystal progressRef={progressRef} />
      <Crown progressRef={progressRef} />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={10}
        blur={3}
        color="#000000"
      />
      <Environment preset="night" />
    </>
  );
}

// Cubic ease-in-out for smoother animations
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const stages = [
  { progress: 0, label: "شروع", en: "START" },
  { progress: 0.25, label: "قاب", en: "CASE" },
  { progress: 0.5, label: "صفحه", en: "DIAL" },
  { progress: 0.75, label: "عقربه‌ها", en: "HANDS" },
  { progress: 1, label: "تکمیل", en: "COMPLETE" },
];

const stageDescriptions = [
  "هر ساعت AURUM از یک صفحه‌ی خالی آغاز می‌شود. صفر. این لحظه‌ی تولد یک شاهکار است.",
  "قاب طلایی از یک شمش طلای ۱۸ قیراط تراش می‌خورد. ۴۸ ساعت کارِ دقیق برای رسیدن به این فرم.",
  "صفحه‌ی ساعت با تکنیک گیلوشِ دستی حکاکی می‌شود. هر خط، با یک حرکت ارابه، در جای خود نشسته.",
  "عقربه‌های طلایی با لایه‌ی لومینوس سوپر-لاوژا پوشانده می‌شوند تا در تاریکی نیز بدرخشند.",
  "شیشه‌ی یاقوتی противخش و تاج ساعت سر جای خود می‌نشینند. ساعت متولد می‌شود.",
];

export function WatchAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  // Ref to share with Canvas children without triggering React re-renders
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Update both the state (for UI) and the ref (for Canvas)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    // Throttle state update to reduce re-renders
    setProgress(v);
  });

  // Active stage based on progress
  const activeStage = Math.min(
    stages.length - 1,
    Math.max(0, Math.floor(progress * (stages.length - 0.001)))
  );

  // Background text opacity
  const bgTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.04, 0.12, 0.04]
  );

  return (
    <section
      ref={sectionRef}
      id="assembly"
      className="relative h-[300vh] bg-black"
    >
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background radial gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(201, 169, 106, 0.08), transparent 70%)",
          }}
        />

        {/* Background giant text */}
        <motion.div
          style={{ opacity: bgTextOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        >
          <span className="font-display text-[30vw] font-black text-gold/[0.04] leading-none">
            ASSEMBLE
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-12 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
              فرآیند مونتاژ
            </span>
            <span className="w-12 h-px bg-gold/40" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light">
            <span className="italic text-gold-gradient">Assemble</span>{" "}
            <span className="font-fa">زنده</span>
          </h2>
          <p className="font-fa text-xs text-foreground/40 mt-3 max-w-md mx-auto">
            با اسکرول، شاهد تجمیع قطعات ساعت باشید
          </p>
        </motion.div>

        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <AssemblyScene progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl z-10">
          <div className="flex justify-between mb-3">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: i <= activeStage ? 1 : 0.3,
                  scale: i === activeStage ? 1.1 : 1,
                }}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= activeStage ? "bg-gold" : "bg-foreground/30"
                  }`}
                  style={
                    i <= activeStage
                      ? { boxShadow: "0 0 12px rgba(201,169,106,0.8)" }
                      : {}
                  }
                />
                <span
                  className={`text-[9px] tracking-luxe transition-colors ${
                    i <= activeStage ? "text-gold" : "text-foreground/30"
                  }`}
                >
                  {stage.en}
                </span>
                <span
                  className={`font-fa text-[10px] transition-colors ${
                    i <= activeStage ? "text-foreground/70" : "text-foreground/30"
                  }`}
                >
                  {stage.label}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="h-px bg-gold/10 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Side counter */}
        <div className="absolute top-1/2 -translate-y-1/2 left-8 hidden lg:flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] tracking-luxe text-gold/60 [writing-mode:vertical-rl]">
            STEP {String(activeStage + 1).padStart(2, "0")} / 0{stages.length}
          </span>
        </div>

        {/* Right info card */}
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-1/2 -translate-y-1/2 right-8 hidden lg:block max-w-xs glass-gold p-6 z-10"
        >
          <div className="text-[9px] tracking-luxe text-gold/60 mb-2">
            STAGE 0{activeStage + 1} / 0{stages.length}
          </div>
          <h3 className="font-display text-2xl italic text-gold-gradient mb-3">
            {stages[activeStage].en}
          </h3>
          <p className="font-fa text-xs text-foreground/70 leading-relaxed">
            {stageDescriptions[activeStage]}
          </p>
        </motion.div>

        {/* Scroll hint at top of section */}
        {progress < 0.05 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-32 text-center pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gold/60 text-xl"
            >
              ↓
            </motion.div>
            <p className="font-fa text-[10px] text-foreground/40 mt-2 tracking-wide-luxe">
              اسکرول کنید تا مونتاژ شروع شود
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
