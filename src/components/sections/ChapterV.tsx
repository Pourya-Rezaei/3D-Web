"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTypewriter } from "@/lib/useTypewriter";
import { useAudio } from "@/components/AudioProvider";

/**
 * Chapter V: The Birth
 * - Final watch displayed with showroom lighting
 * - Camera slowly orbits
 * - User can input name for personalization
 * - Generates certificate
 */

function FinalWatch() {
  const group = useRef<THREE.Group>(null);
  const secondHand = useRef<THREE.Group>(null);
  const tourbillon = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.4) * 0.05;
      group.current.rotation.y += delta * 0.15;
    }
    if (secondHand.current) secondHand.current.rotation.z -= delta * 0.6;
    if (tourbillon.current) tourbillon.current.rotation.z += delta * 2;
  });

  const goldMat = (
    <meshStandardMaterial color="#c9a96a" metalness={1} roughness={0.12} emissive="#3a2e15" emissiveIntensity={0.4} />
  );
  const goldDarkMat = (
    <meshStandardMaterial color="#8a7445" metalness={1} roughness={0.3} />
  );

  return (
    <group ref={group} scale={1.4}>
      {/* Case outer ring */}
      <mesh>
        <torusGeometry args={[1.2, 0.07, 32, 64]} />
        {goldMat}
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0, 0.16]}>
        <torusGeometry args={[1.1, 0.05, 32, 64]} />
        {goldMat}
      </mesh>
      {/* Case middle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.18, 1.18, 0.3, 64]} />
        {goldDarkMat}
      </mesh>

      {/* Dial */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.08, 1.08, 0.04, 64]} />
        <meshStandardMaterial color="#0a0805" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.92, -Math.cos(angle) * 0.92, 0.08]}
          >
            <boxGeometry args={[0.04, i % 3 === 0 ? 0.15 : 0.09, 0.025]} />
            {i % 3 === 0 ? goldMat : goldDarkMat}
          </mesh>
        );
      })}

      {/* Tourbillon at 6 */}
      <group ref={tourbillon} position={[0, -0.5, 0.1]}>
        <mesh>
          <torusGeometry args={[0.2, 0.025, 16, 32]} />
          {goldMat}
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]}>
            <boxGeometry args={[0.4, 0.015, 0.015]} />
            {goldMat}
          </mesh>
        ))}
      </group>

      {/* Hands */}
      <group position={[0, 0, 0.18]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.025, 0.6, 0.018]} />
          {goldMat}
        </mesh>
        <mesh position={[0, 0.45, 0.01]}>
          <boxGeometry args={[0.02, 0.9, 0.012]} />
          <meshStandardMaterial color="#e6c98b" metalness={1} roughness={0.15} />
        </mesh>
        <group ref={secondHand}>
          <mesh position={[0, 0.45, 0.02]}>
            <boxGeometry args={[0.008, 0.9, 0.005]} />
            {goldDarkMat}
          </mesh>
        </group>
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          {goldMat}
        </mesh>
      </group>

      {/* Crystal */}
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          transparent
          opacity={0.25}
          roughness={0}
          metalness={0}
          ior={1.5}
        />
      </mesh>

      {/* Crown */}
      <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.11, 0.12, 24]} />
        {goldMat}
      </mesh>

      {/* Lugs */}
      {[
        [0.5, 1.15, 0.3],
        [-0.5, 1.15, -0.3],
        [0.5, -1.15, -0.3],
        [-0.5, -1.15, 0.3],
      ].map(([x, y, rz], i) => (
        <mesh
          key={i}
          material={goldMat as any}
          position={[x, y, 0]}
          rotation={[0, 0, rz]}
        >
          <boxGeometry args={[0.18, 0.4, 0.25]} />
        </mesh>
      ))}
    </group>
  );
}

function FinalWatchScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Showroom spotlight from above */}
      <spotLight
        position={[0, 6, 2]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#fff5e0"
        castShadow
      />
      {/* Side warm light */}
      <spotLight
        position={[-4, 2, 3]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#c9a96a"
      />
      {/* Cool fill light */}
      <pointLight position={[3, -1, 2]} intensity={1} color="#5a78d8" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#e6c98b" />

      {/* Gold particles around watch */}
      <Sparkles
        count={80}
        scale={[5, 4, 3]}
        size={2}
        speed={0.3}
        opacity={0.6}
        color="#c9a96a"
      />
      <Sparkles
        count={40}
        scale={[6, 5, 4]}
        size={1}
        speed={0.2}
        opacity={0.3}
        color="#e6c98b"
      />

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <FinalWatch />
      </Float>

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.6}
        scale={10}
        blur={3}
        color="#000000"
      />
      <Environment preset="night" />
    </>
  );
}

export function ChapterV() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const audio = useAudio();

  const handleContinue = () => {
    if (!name.trim()) return;
    // Emit event so the parent (page) captures the name for Chapter VI
    window.dispatchEvent(
      new CustomEvent("aurum-name-set", { detail: name.trim() })
    );
    window.localStorage.setItem("aurum-user-name", name.trim());
    audio.playSound("chime", { volume: 0.5 });
    audio.playSound("success", { volume: 0.4 });
    setTimeout(() => {
      audio.playSound("whoosh", { volume: 0.4 });
    }, 800);
    setTimeout(() => {
      document.querySelector("#chapter-6")?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };

  return (
    <section
      id="chapter-5"
      className="relative min-h-screen w-full bg-[#060a18] stars overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 169, 106, 0.12) 0%, transparent 50%)",
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
          CHAPTER V
        </div>
        <h1 className="chapter-title text-4xl md:text-6xl text-gold-gradient">
          The Birth
        </h1>
        <p className="font-fa text-sm text-foreground/50 mt-2">
          تولد یک شاهکار
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <FinalWatchScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Personalization form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4"
      >
        <div className="glass-midnight p-6 md:p-8">
          <div className="text-[9px] tracking-luxe text-gold/60 mb-2 text-center">
            CERTIFICATE OF AUTHENTICITY
          </div>
          <p className="font-fa text-sm text-foreground/70 text-center mb-5 leading-relaxed">
            این ساعت اکنون به شما تعلق دارد. نام خود را وارد کنید تا گواهی اصالت صادر شود.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام شما..."
            maxLength={40}
            className="w-full bg-black/40 border border-gold/20 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors font-fa text-center"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
          />
          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="group relative w-full mt-4 font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold py-3.5 overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">صدور گواهی ←</span>
            <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#060a18] z-20 pointer-events-none" />
    </section>
  );
}
