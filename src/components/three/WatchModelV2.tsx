"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface WatchConfig {
  caseColor: string;
  dialColor: string;
  strapColor: string;
  handColor: string;
  material: "gold" | "rose-gold" | "platinum" | "steel";
}

export const defaultWatchConfig: WatchConfig = {
  caseColor: "#c9a96a",
  dialColor: "#0a0805",
  strapColor: "#0a0805",
  handColor: "#c9a96a",
  material: "gold",
};

/**
 * Highly detailed luxury wristwatch model:
 * - Multi-layer case (case, bezel, crystal, dial, sub-dials)
 * - Skeleton tourbillon visible
 * - Animated gears (3 sets, different speeds/directions)
 * - Realistic hour markers (gold markers + luminous dots)
 * - Hour/minute/second hands
 * - Crown + chronograph pushers
 * - Lugs and strap stubs
 */
export function WatchModelV2({
  config = defaultWatchConfig,
  scrollProgress = 0,
  exploded = 0,
}: {
  config?: WatchConfig;
  scrollProgress?: number;
  exploded?: number; // 0-1, distance for exploded view
}) {
  const group = useRef<THREE.Group>(null);
  const tourbillon = useRef<THREE.Group>(null);
  const gear1 = useRef<THREE.Group>(null);
  const gear2 = useRef<THREE.Group>(null);
  const gear3 = useRef<THREE.Group>(null);
  const secondHand = useRef<THREE.Group>(null);
  const minuteHand = useRef<THREE.Group>(null);
  const hourHand = useRef<THREE.Group>(null);
  const balanceWheel = useRef<THREE.Group>(null);

  // Materials — memoized for performance
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.caseColor,
        metalness: 1,
        roughness: 0.12,
        emissive: new THREE.Color(config.caseColor).multiplyScalar(0.1),
        emissiveIntensity: 0.4,
      }),
    [config.caseColor]
  );

  const goldDarkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.caseColor).multiplyScalar(0.65),
        metalness: 1,
        roughness: 0.3,
      }),
    [config.caseColor]
  );

  const dialMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.dialColor,
        metalness: 0.7,
        roughness: 0.35,
      }),
    [config.dialColor]
  );

  const strapMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.strapColor,
        metalness: 0.3,
        roughness: 0.85,
      }),
    [config.strapColor]
  );

  const handMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.handColor,
        metalness: 1,
        roughness: 0.15,
        emissive: new THREE.Color(config.handColor).multiplyScalar(0.2),
        emissiveIntensity: 0.5,
      }),
    [config.handColor]
  );

  const crystalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0,
        roughness: 0,
        transmission: 0.95,
        transparent: true,
        opacity: 0.2,
        ior: 1.52,
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
      }),
    []
  );

  const lumenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8e8b8",
        emissive: "#8fd860",
        emissiveIntensity: 1.5,
        metalness: 0,
        roughness: 1,
      }),
    []
  );

  // Animated movement
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // Smooth float
      group.current.position.y = Math.sin(t * 0.5) * 0.06;
      // Rotate based on scroll + slow auto-rotate
      group.current.rotation.y += delta * 0.25 + scrollProgress * 0.015;
      // Subtle tilt
      group.current.rotation.x = Math.sin(t * 0.3) * 0.04 - 0.08;
    }
    if (tourbillon.current) tourbillon.current.rotation.z += delta * 2.2;
    if (gear1.current) gear1.current.rotation.z += delta * 0.7;
    if (gear2.current) gear2.current.rotation.z -= delta * 1.1;
    if (gear3.current) gear3.current.rotation.z += delta * 1.6;
    if (balanceWheel.current)
      balanceWheel.current.rotation.z = Math.sin(t * 8) * 0.15;
    if (secondHand.current) secondHand.current.rotation.z -= delta * 0.6;
    if (minuteHand.current) minuteHand.current.rotation.z += delta * 0.05;
    if (hourHand.current) hourHand.current.rotation.z += delta * 0.004;
  });

  // Hour markers (12)
  const hourMarkers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const r = 0.92;
      const x = Math.sin(angle) * r;
      const y = -Math.cos(angle) * r;
      const isCardinal = i % 3 === 0;
      return { x, y, isCardinal, i };
    });
  }, []);

  return (
    <group ref={group} rotation={[-0.08, 0, 0]} scale={1.05}>
      {/* Exploded offsets */}
      <group position={[0, 0, exploded * 1.5]}>
        {/* Crystal */}
        <mesh material={crystalMat} position={[0, 0, 0.22]}>
          <cylinderGeometry args={[1.05, 1.05, 0.05, 64]} />
          <group rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
      </group>

      {/* Hands group */}
      <group ref={hourHand} position={[0, 0, 0.14]}>
        <mesh material={handMat} position={[0, 0.28, 0]}>
          <boxGeometry args={[0.03, 0.6, 0.018]} />
        </mesh>
        <mesh material={handMat} position={[0, -0.1, 0]}>
          <boxGeometry args={[0.015, 0.2, 0.012]} />
        </mesh>
      </group>

      <group ref={minuteHand} position={[0, 0, 0.16]}>
        <mesh material={handMat} position={[0, 0.42, 0]}>
          <boxGeometry args={[0.025, 0.95, 0.015]} />
        </mesh>
      </group>

      <group ref={secondHand} position={[0, 0, 0.18]}>
        <mesh material={goldDarkMat} position={[0, 0.45, 0]}>
          <boxGeometry args={[0.008, 1.0, 0.005]} />
        </mesh>
        <mesh material={goldDarkMat} position={[0, -0.18, 0]}>
          <boxGeometry args={[0.008, 0.35, 0.005]} />
        </mesh>
      </group>

      {/* Center cap */}
      <mesh material={handMat} position={[0, 0, 0.19]}>
        <cylinderGeometry args={[0.055, 0.055, 0.05, 16]} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Dial */}
      <mesh material={dialMat} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[1.1, 1.1, 0.04, 64]} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Hour markers */}
      {hourMarkers.map((m) => (
        <group key={m.i} position={[m.x, m.y, 0.07]}>
          <mesh material={m.isCardinal ? goldMat : goldDarkMat}>
            <boxGeometry
              args={[0.045, m.isCardinal ? 0.15 : 0.09, 0.025]}
            />
          </mesh>
          {m.isCardinal && (
            <mesh material={lumenMat} position={[0, 0, 0.02]}>
              <boxGeometry args={[0.025, 0.08, 0.005]} />
            </mesh>
          )}
        </group>
      ))}

      {/* Minute markers (60 small dots) */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i / 60) * Math.PI * 2;
        const r = 1.0;
        return (
          <mesh
            key={`min-${i}`}
            position={[Math.sin(angle) * r, -Math.cos(angle) * r, 0.07]}
            material={goldDarkMat}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.012, 8]} />
            <group rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        );
      })}

      {/* Sub-dials (chronograph) */}
      <mesh material={dialMat} position={[-0.5, 0.35, 0.08]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 32]} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh material={goldMat} position={[-0.5, 0.35, 0.09]}>
        <torusGeometry args={[0.25, 0.015, 16, 32]} />
      </mesh>

      <mesh material={dialMat} position={[0.5, 0.35, 0.08]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh material={goldMat} position={[0.5, 0.35, 0.09]}>
        <torusGeometry args={[0.22, 0.015, 16, 32]} />
      </mesh>

      {/* Tourbillon at 6 o'clock */}
      <group ref={tourbillon} position={[0, -0.5, 0.08]}>
        <mesh material={goldMat}>
          <torusGeometry args={[0.2, 0.025, 16, 32]} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 3) * Math.PI * 2]}
            material={goldMat}
          >
            <boxGeometry args={[0.4, 0.015, 0.015]} />
          </mesh>
        ))}
        {/* Center wheel */}
        <mesh material={goldDarkMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <group rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {/* Balance wheel (oscillating) */}
        <group ref={balanceWheel}>
          <mesh material={goldMat}>
            <torusGeometry args={[0.13, 0.008, 8, 16]} />
          </mesh>
        </group>
      </group>

      {/* Gears — skeleton view */}
      <group ref={gear1} position={[0.5, -0.3, 0.08]}>
        <mesh material={goldDarkMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.025, 16]} />
          <group rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 12) * Math.PI * 2]}
            position={[
              Math.cos((i / 12) * Math.PI * 2) * 0.13,
              Math.sin((i / 12) * Math.PI * 2) * 0.13,
              0,
            ]}
            material={goldMat}
          >
            <boxGeometry args={[0.04, 0.04, 0.025]} />
          </mesh>
        ))}
      </group>

      <group ref={gear2} position={[-0.5, -0.3, 0.08]}>
        <mesh material={goldMat}>
          <cylinderGeometry args={[0.1, 0.1, 0.025, 12]} />
          <group rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 10) * Math.PI * 2]}
            position={[
              Math.cos((i / 10) * Math.PI * 2) * 0.1,
              Math.sin((i / 10) * Math.PI * 2) * 0.1,
              0,
            ]}
            material={goldDarkMat}
          >
            <boxGeometry args={[0.035, 0.035, 0.025]} />
          </mesh>
        ))}
      </group>

      <group ref={gear3} position={[0, 0.5, 0.08]}>
        <mesh material={goldDarkMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 10]} />
          <group rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
      </group>

      {/* Bezel */}
      <mesh material={goldMat} position={[0, 0, 0.08]}>
        <torusGeometry args={[1.1, 0.05, 32, 64]} />
      </mesh>

      {/* Case (outer ring) */}
      <mesh material={goldMat}>
        <cylinderGeometry args={[1.25, 1.25, 0.32, 64]} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh material={goldMat} position={[0, 0, 0.16]}>
        <torusGeometry args={[1.23, 0.07, 32, 64]} />
      </mesh>
      <mesh material={goldDarkMat} position={[0, 0, -0.16]}>
        <torusGeometry args={[1.23, 0.05, 32, 64]} />
      </mesh>

      {/* Case back (visible gear) */}
      <mesh material={dialMat} position={[0, 0, -0.14]}>
        <cylinderGeometry args={[1.18, 1.18, 0.04, 64]} />
        <group rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Crown */}
      <group position={[1.32, 0, 0]}>
        <mesh material={goldMat} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.13, 0.14, 24]} />
        </mesh>
        <mesh material={goldDarkMat} position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        </mesh>
        {/* Crown grip teeth */}
        {Array.from({ length: 12 }, (_, i) => (
          <mesh
            key={i}
            rotation={[(i / 12) * Math.PI * 2, 0, 0]}
            material={goldDarkMat}
          >
            <boxGeometry args={[0.005, 0.13, 0.025]} />
          </mesh>
        ))}
      </group>

      {/* Pushers (chronograph) */}
      <mesh material={goldMat} position={[1.28, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
      </mesh>
      <mesh material={goldMat} position={[1.28, -0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
      </mesh>

      {/* Lugs */}
      {[
        [0.55, 1.18, 0.3],
        [-0.55, 1.18, -0.3],
        [0.55, -1.18, -0.3],
        [-0.55, -1.18, 0.3],
      ].map(([x, y, rz], i) => (
        <mesh
          key={i}
          material={goldMat}
          position={[x, y, 0]}
          rotation={[0, 0, rz]}
        >
          <boxGeometry args={[0.22, 0.45, 0.28]} />
        </mesh>
      ))}

      {/* Strap (upper + lower stubs) */}
      <mesh material={strapMat} position={[0, 1.55, -0.05]}>
        <boxGeometry args={[0.92, 0.85, 0.07]} />
      </mesh>
      <mesh material={strapMat} position={[0, -1.55, -0.05]}>
        <boxGeometry args={[0.92, 0.85, 0.07]} />
      </mesh>

      {/* Stitching on strap (gold thread) */}
      {[1.3, 1.5, 1.7, 1.9].map((y, i) => (
        <mesh key={`s-up-${i}`} material={goldMat} position={[0.35, y, 0.01]}>
          <boxGeometry args={[0.02, 0.04, 0.005]} />
        </mesh>
      ))}
      {[1.3, 1.5, 1.7, 1.9].map((y, i) => (
        <mesh key={`s-up-l-${i}`} material={goldMat} position={[-0.35, y, 0.01]}>
          <boxGeometry args={[0.02, 0.04, 0.005]} />
        </mesh>
      ))}
      {[-1.3, -1.5, -1.7, -1.9].map((y, i) => (
        <mesh key={`s-dn-${i}`} material={goldMat} position={[0.35, y, 0.01]}>
          <boxGeometry args={[0.02, 0.04, 0.005]} />
        </mesh>
      ))}
      {[-1.3, -1.5, -1.7, -1.9].map((y, i) => (
        <mesh key={`s-dn-l-${i}`} material={goldMat} position={[-0.35, y, 0.01]}>
          <boxGeometry args={[0.02, 0.04, 0.005]} />
        </mesh>
      ))}
    </group>
  );
}
