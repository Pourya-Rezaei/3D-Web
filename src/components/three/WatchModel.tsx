"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Stylized luxury wristwatch built entirely from Three.js primitives.
 * Features:
 *  - Gold case + bezel with metallic finish
 *  - Skeleton-style dial with rotating tourbillon
 *  - Visible rotating gears
 *  - Crown + pushers
 *  - Subtle floating animation
 */
export function WatchModel({
  scrollProgress = 0,
}: {
  scrollProgress?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const tourbillon = useRef<THREE.Group>(null);
  const gear1 = useRef<THREE.Group>(null);
  const gear2 = useRef<THREE.Group>(null);
  const secondHand = useRef<THREE.Group>(null);

  // Materials
  const goldMaterial = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: "#c9a96a",
      metalness: 1,
      roughness: 0.15,
      emissive: "#3a2e15",
      emissiveIntensity: 0.3,
    });
    return m;
  }, []);

  const goldDarkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#8a7445",
      metalness: 1,
      roughness: 0.3,
    });
  }, []);

  const blackMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      metalness: 0.8,
      roughness: 0.25,
    });
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0,
      roughness: 0,
      transmission: 0.95,
      transparent: true,
      opacity: 0.25,
      ior: 1.5,
      thickness: 0.5,
    });
  }, []);

  const dialMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1a1410",
      metalness: 0.6,
      roughness: 0.4,
    });
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      // Gentle float
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.6) * 0.08;
      // Rotate based on scroll + slow auto-rotate
      group.current.rotation.y +=
        delta * 0.3 + scrollProgress * 0.02;
      group.current.rotation.x = Math.sin(t * 0.3) * 0.05 - 0.1;
    }
    if (tourbillon.current) {
      tourbillon.current.rotation.z += delta * 2;
    }
    if (gear1.current) {
      gear1.current.rotation.z += delta * 0.8;
    }
    if (gear2.current) {
      gear2.current.rotation.z -= delta * 1.2;
    }
    if (secondHand.current) {
      secondHand.current.rotation.z -= delta * 0.5;
    }
  });

  // Hour markers
  const hourMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 0.95;
      const x = Math.sin(angle) * r;
      const y = -Math.cos(angle) * r;
      const isMain = i % 3 === 0;
      markers.push(
        <mesh
          key={i}
          position={[x, y, 0.06]}
          material={isMain ? goldMaterial : goldDarkMaterial}
        >
          <boxGeometry args={[0.04, isMain ? 0.14 : 0.08, 0.02]} />
        </mesh>
      );
    }
    return markers;
  }, [goldMaterial, goldDarkMaterial]);

  return (
    <group ref={group} rotation={[-0.1, 0, 0]} scale={1.1}>
      {/* Case (outer ring) */}
      <mesh material={goldMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.32, 64]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh material={goldMaterial} position={[0, 0, 0.16]} castShadow>
        <torusGeometry args={[1.28, 0.08, 32, 64]} />
      </mesh>
      <mesh material={goldDarkMaterial} position={[0, 0, -0.16]}>
        <torusGeometry args={[1.28, 0.06, 32, 64]} />
      </mesh>

      {/* Case middle (bezel) */}
      <mesh material={goldMaterial} position={[0, 0, 0.08]}>
        <torusGeometry args={[1.15, 0.06, 32, 64]} />
      </mesh>

      {/* Dial */}
      <mesh material={dialMaterial} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[1.12, 1.12, 0.04, 64]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Skeleton cutouts - decorative gears on dial */}
      <group ref={tourbillon} position={[0.45, -0.3, 0.08]}>
        <mesh material={goldMaterial}>
          <torusGeometry args={[0.22, 0.03, 16, 32]} />
        </mesh>
        <mesh material={goldDarkMaterial}>
          <cylinderGeometry args={[0.18, 0.18, 0.03, 12]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {/* Tourbillon cage spokes */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 3) * Math.PI * 2]}
            material={goldMaterial}
          >
            <boxGeometry args={[0.4, 0.02, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* Gears on dial */}
      <group ref={gear1} position={[-0.5, 0.35, 0.08]}>
        <mesh material={goldDarkMaterial}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 10]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 10) * Math.PI * 2]}
            position={[Math.cos((i / 10) * Math.PI * 2) * 0.15, Math.sin((i / 10) * Math.PI * 2) * 0.15, 0]}
            material={goldMaterial}
          >
            <boxGeometry args={[0.04, 0.04, 0.02]} />
          </mesh>
        ))}
      </group>

      <group ref={gear2} position={[-0.5, -0.4, 0.08]}>
        <mesh material={goldMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 8]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 8) * Math.PI * 2]}
            position={[Math.cos((i / 8) * Math.PI * 2) * 0.12, Math.sin((i / 8) * Math.PI * 2) * 0.12, 0]}
            material={goldDarkMaterial}
          >
            <boxGeometry args={[0.035, 0.035, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* Hour markers */}
      {hourMarkers}

      {/* Hands */}
      <group position={[0, 0, 0.1]}>
        {/* Hour hand */}
        <mesh material={goldMaterial} position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.025, 0.6, 0.015]} />
        </mesh>
        {/* Minute hand */}
        <mesh material={goldMaterial} position={[0, 0.5, 0.01]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.02, 1.0, 0.01]} />
        </mesh>
        {/* Second hand */}
        <group ref={secondHand}>
          <mesh material={goldDarkMaterial} position={[0, 0.5, 0.02]}>
            <boxGeometry args={[0.008, 1.0, 0.005]} />
          </mesh>
        </group>
        {/* Center cap */}
        <mesh material={goldMaterial} position={[0, 0, 0.03]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
      </group>

      {/* Crystal (glass) */}
      <mesh material={glassMaterial} position={[0, 0, 0.18]}>
        <cylinderGeometry args={[1.1, 1.1, 0.05, 64]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Crown */}
      <mesh material={goldMaterial} position={[1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 24]} />
      </mesh>
      <mesh material={goldDarkMaterial} position={[1.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
      </mesh>

      {/* Pushers (chronograph style) */}
      <mesh material={goldMaterial} position={[1.32, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
      </mesh>
      <mesh material={goldMaterial} position={[1.32, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
      </mesh>

      {/* Lugs (top + bottom) */}
      <mesh material={goldMaterial} position={[0.6, 1.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
      </mesh>
      <mesh material={goldMaterial} position={[-0.6, 1.2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
      </mesh>
      <mesh material={goldMaterial} position={[0.6, -1.2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
      </mesh>
      <mesh material={goldMaterial} position={[-0.6, -1.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
      </mesh>

      {/* Strap stubs (leather) - upper */}
      <mesh material={blackMaterial} position={[0, 1.6, -0.05]}>
        <boxGeometry args={[0.9, 0.8, 0.06]} />
      </mesh>
      <mesh material={blackMaterial} position={[0, -1.6, -0.05]}>
        <boxGeometry args={[0.9, 0.8, 0.06]} />
      </mesh>
    </group>
  );
}
