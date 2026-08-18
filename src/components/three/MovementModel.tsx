/* eslint-disable react-hooks/immutability */
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Detailed watch movement model with 7 layers.
 * Each layer can be toggled on/off by parent.
 * The whole movement can be "exploded" (parts separate) via exploded value 0..1.
 * Energy flow particles travel from mainspring -> gears -> escapement -> balance wheel -> hands.
 */

export type LayerKey =
  | "case"
  | "dial"
  | "mainspring"
  | "gearTrain"
  | "escapement"
  | "balanceWheel"
  | "hands";

type LayerProps = {
  visible: boolean;
  exploded: number; // 0..1
  highlight: boolean;
};

/* =============== INDIVIDUAL LAYERS =============== */

function CaseLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#b8945a",
        metalness: 1,
        roughness: 0.18,
        emissive: "#3a2e15",
        emissiveIntensity: 0.3,
      }), []);
  const goldDarkMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#8a6d3a",
        metalness: 1,
        roughness: 0.3,
      }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = exploded * 1.2;
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      goldMat.emissiveIntensity = 0.3 + pulse * 0.6;
      // Subtle scale when highlighted
      const targetScale = highlight ? 1.05 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  if (!visible) return null;
  return (
    <group ref={ref}>
      <mesh material={goldMat}>
        <torusGeometry args={[1.4, 0.08, 32, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.18]} material={goldMat}>
        <torusGeometry args={[1.3, 0.04, 32, 64]} />
      </mesh>
      <mesh position={[0, 0, -0.18]} material={goldDarkMat}>
        <torusGeometry args={[1.3, 0.05, 32, 64]} />
      </mesh>
    </group>
  );
}

function DialLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const darkSteelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#3a3a3a",
        metalness: 0.8,
        roughness: 0.4,
      }), []);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#b8945a",
        metalness: 1,
        roughness: 0.2,
        emissive: "#3a2e15",
        emissiveIntensity: 0.2,
      }), []);
  const goldDarkMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#8a6d3a",
        metalness: 1,
        roughness: 0.3,
        emissive: "#3a2e15",
        emissiveIntensity: 0.2,
      }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = exploded * 0.7;
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      darkSteelMat.emissiveIntensity = pulse * 0.4;
      const targetScale = highlight ? 1.05 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  if (!visible) return null;
  return (
    <group ref={ref}>
      <mesh material={darkSteelMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.04, 64]} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.98, -Math.cos(angle) * 0.98, 0.04]}
            material={i % 3 === 0 ? goldMat : goldDarkMat}
          >
            <boxGeometry args={[0.04, i % 3 === 0 ? 0.14 : 0.09, 0.025]} />
          </mesh>
        );
      })}
    </group>
  );
}

function MainspringLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const spiralRef = useRef<THREE.Mesh>(null);
  const brassMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#c8a06a",
        metalness: 0.9,
        roughness: 0.3,
        emissive: "#3a2818",
        emissiveIntensity: 0.2,
      }), []);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#b8945a",
        metalness: 1,
        roughness: 0.2,
      }), []);
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#9aa0a8",
        metalness: 1,
        roughness: 0.25,
      }), []);
  const jewelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff3a3a",
        metalness: 0.3,
        roughness: 0.1,
        emissive: "#aa0000",
        emissiveIntensity: 0.4,
      }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.set(-0.6, -0.6, -0.3 - exploded * 0.8);
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      brassMat.emissiveIntensity = 0.2 + pulse * 0.5;
      const targetScale = highlight ? 1.1 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (spiralRef.current) {
      spiralRef.current.rotation.z += 0.005;
    }
  });

  if (!visible) return null;
  return (
    <group ref={ref}>
      <mesh ref={spiralRef} material={brassMat}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh position={[0, 0, 0.04]} material={goldMat}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      {[0.22, 0.18, 0.14, 0.1].map((r, i) => (
        <mesh key={i} position={[0, 0, 0.05]} material={steelMat}>
          <torusGeometry args={[r, 0.005, 8, 64, Math.PI * 1.5]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.06]} material={jewelMat}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>
    </group>
  );
}

function GearTrainLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const gear1 = useRef<THREE.Group>(null);
  const gear2 = useRef<THREE.Group>(null);
  const gear3 = useRef<THREE.Group>(null);
  const goldLightMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#d4b074",
        metalness: 1,
        roughness: 0.2,
        emissive: "#3a2818",
        emissiveIntensity: 0.2,
      }), []);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#b8945a",
        metalness: 1,
        roughness: 0.18,
      }), []);
  const goldDarkMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#8a6d3a",
        metalness: 1,
        roughness: 0.3,
      }), []);
  const jewelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff3a3a",
        metalness: 0.3,
        roughness: 0.1,
        emissive: "#aa0000",
        emissiveIntensity: 0.4,
      }), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z = -0.15 - exploded * 0.5;
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      goldLightMat.emissiveIntensity = 0.2 + pulse * 0.5;
      const targetScale = highlight ? 1.1 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (gear1.current) gear1.current.rotation.z += delta * 0.6;
    if (gear2.current) gear2.current.rotation.z -= delta * 0.9;
    if (gear3.current) gear3.current.rotation.z += delta * 1.2;
  });

  if (!visible) return null;

  const Gear = ({
    position,
    radius,
    teeth,
    mat,
    refObj,
  }: {
    position: [number, number, number];
    radius: number;
    teeth: number;
    mat: THREE.Material;
    refObj: React.RefObject<THREE.Group>;
  }) => (
    <group position={position} ref={refObj}>
      <mesh material={mat}>
        <cylinderGeometry args={[radius, radius, 0.05, teeth]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      {Array.from({ length: teeth }, (_, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i / teeth) * Math.PI * 2]}
          position={[
            Math.cos((i / teeth) * Math.PI * 2) * radius,
            Math.sin((i / teeth) * Math.PI * 2) * radius,
            0,
          ]}
          material={mat}
        >
          <boxGeometry args={[0.04, 0.04, 0.05]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.04]} material={jewelMat}>
        <sphereGeometry args={[0.04, 12, 12]} />
      </mesh>
    </group>
  );

  return (
    <group ref={ref}>
      <Gear position={[0.3, -0.3, 0]} radius={0.18} teeth={20} mat={goldLightMat} refObj={gear1} />
      <Gear position={[0.55, 0.1, 0]} radius={0.14} teeth={16} mat={goldMat} refObj={gear2} />
      <Gear position={[0.15, 0.45, 0]} radius={0.11} teeth={12} mat={goldDarkMat} refObj={gear3} />
    </group>
  );
}

function EscapementLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const escapeWheel = useRef<THREE.Group>(null);
  const palletFork = useRef<THREE.Group>(null);
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#9aa0a8",
        metalness: 1,
        roughness: 0.25,
        emissive: "#3a3a3a",
        emissiveIntensity: 0.2,
      }), []);
  const jewelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff3a3a",
        metalness: 0.3,
        roughness: 0.1,
        emissive: "#aa0000",
        emissiveIntensity: 0.4,
      }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.set(0.7, 0.5, -0.05 - exploded * 0.3);
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      steelMat.emissiveIntensity = 0.2 + pulse * 0.5;
      const targetScale = highlight ? 1.1 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (escapeWheel.current) {
      const t = state.clock.elapsedTime;
      const step = Math.floor(t * 5) / 5;
      escapeWheel.current.rotation.z = step * (Math.PI / 10);
    }
    if (palletFork.current) {
      const t = state.clock.elapsedTime;
      palletFork.current.rotation.z = Math.sin(t * 5) * 0.25;
    }
  });

  if (!visible) return null;
  return (
    <group ref={ref}>
      <group ref={escapeWheel} position={[0, 0, 0]}>
        <mesh material={steelMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 20]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {Array.from({ length: 20 }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / 20) * Math.PI * 2]}
            position={[Math.cos((i / 20) * Math.PI * 2) * 0.13, Math.sin((i / 20) * Math.PI * 2) * 0.13, 0]}
            material={steelMat}
          >
            <boxGeometry args={[0.04, 0.04, 0.04]} />
          </mesh>
        ))}
      </group>
      <group ref={palletFork} position={[-0.15, 0.18, 0.05]}>
        <mesh material={steelMat}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
        </mesh>
        <mesh position={[0.12, 0, 0]} material={jewelMat}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
        </mesh>
        <mesh position={[-0.12, 0, 0]} material={jewelMat}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
        </mesh>
      </group>
    </group>
  );
}

function BalanceWheelLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const wheel = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#b8945a",
        metalness: 1,
        roughness: 0.18,
        emissive: "#3a2e15",
        emissiveIntensity: 0.3,
      }), []);
  const goldDarkMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#8a6d3a",
        metalness: 1,
        roughness: 0.3,
      }), []);
  const goldLightMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#d4b074",
        metalness: 1,
        roughness: 0.2,
      }), []);
  const jewelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff3a3a",
        metalness: 0.3,
        roughness: 0.1,
        emissive: "#aa0000",
        emissiveIntensity: 0.4,
      }), []);
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#9aa0a8",
        metalness: 1,
        roughness: 0.25,
      }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.set(0.2, 0.65, 0.05 + exploded * 0.3);
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      goldMat.emissiveIntensity = 0.3 + pulse * 0.5;
      const targetScale = highlight ? 1.1 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (wheel.current) {
      const t = state.clock.elapsedTime;
      wheel.current.rotation.z = Math.sin(t * 6) * 0.6;
    }
  });

  if (!visible) return null;
  return (
    <group ref={ref}>
      <group ref={wheel}>
        <mesh material={goldMat}>
          <torusGeometry args={[0.16, 0.015, 8, 32]} />
        </mesh>
        <mesh material={goldDarkMat} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.32, 0.01, 0.01]} />
        </mesh>
        <mesh material={goldDarkMat} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.32, 0.01, 0.01]} />
        </mesh>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.16, Math.sin(angle) * 0.16, 0]}
              material={goldLightMat}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
            </mesh>
          );
        })}
        <mesh material={jewelMat}>
          <sphereGeometry args={[0.025, 12, 12]} />
        </mesh>
      </group>
      {[0.08, 0.06, 0.04].map((r, i) => (
        <mesh key={i} position={[0, 0, -0.02]} material={steelMat}>
          <torusGeometry args={[r, 0.003, 6, 32]} />
        </mesh>
      ))}
    </group>
  );
}

function HandsLayer({ visible, exploded, highlight }: LayerProps) {
  const ref = useRef<THREE.Group>(null);
  const secondHand = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#b8945a",
        metalness: 1,
        roughness: 0.18,
        emissive: "#3a2e15",
        emissiveIntensity: 0.3,
      }), []);
  const goldLightMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#d4b074",
        metalness: 1,
        roughness: 0.2,
        emissive: "#3a2818",
        emissiveIntensity: 0.2,
      }), []);
  const goldDarkMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#8a6d3a",
        metalness: 1,
        roughness: 0.3,
      }), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z = 0.15 + exploded * 0.8;
      const t = state.clock.elapsedTime;
      const pulse = highlight ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
      goldLightMat.emissiveIntensity = 0.2 + pulse * 0.5;
      const targetScale = highlight ? 1.1 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (secondHand.current) {
      secondHand.current.rotation.z -= delta * 0.4;
    }
  });

  if (!visible) return null;
  return (
    <group ref={ref}>
      <mesh position={[0, 0.28, 0]} material={goldMat}>
        <boxGeometry args={[0.03, 0.55, 0.015]} />
      </mesh>
      <mesh position={[0, 0.45, 0.02]} material={goldLightMat}>
        <boxGeometry args={[0.022, 0.9, 0.012]} />
      </mesh>
      <group ref={secondHand} position={[0, 0, 0.04]}>
        <mesh position={[0, 0.42, 0]} material={goldDarkMat}>
          <boxGeometry args={[0.008, 0.85, 0.005]} />
        </mesh>
        <mesh position={[0, -0.18, 0]} material={goldDarkMat}>
          <boxGeometry args={[0.008, 0.36, 0.005]} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.04]} material={goldMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
      </mesh>
    </group>
  );
}

/* =============== ENERGY FLOW PARTICLES =============== */

function EnergyParticles({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<
    Array<{
      progress: number;
      speed: number;
    }>
  >([]);

  const path = useMemo(() => {
    return [
      new THREE.Vector3(-0.6, -0.6, -0.3),
      new THREE.Vector3(0.3, -0.3, -0.15),
      new THREE.Vector3(0.55, 0.1, -0.15),
      new THREE.Vector3(0.15, 0.45, -0.15),
      new THREE.Vector3(0.7, 0.5, -0.05),
      new THREE.Vector3(0.2, 0.65, 0.05),
      new THREE.Vector3(0, 0, 0.15),
    ];
  }, []);

  const particleMeshes = useMemo(() => {
    if (!visible) return [];
    const count = 12;
    const meshes = Array.from({ length: count }, () => {
      const geo = new THREE.SphereGeometry(0.025, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: "#ffe6a8",
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      return mesh;
    });
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      progress: i / count,
      speed: 0.2 + Math.random() * 0.1,
    }));
    return meshes;
  }, [visible]);

  useFrame((_, delta) => {
    if (!groupRef.current || !visible) return;
    particleMeshes.forEach((mesh, i) => {
      const p = particlesRef.current[i];
      if (!p) return;
      p.progress += delta * p.speed;
      if (p.progress > 1) p.progress = 0;
      const seg = p.progress * (path.length - 1);
      const idx = Math.floor(seg);
      const t = seg - idx;
      const a = path[idx];
      const b = path[Math.min(idx + 1, path.length - 1)];
      mesh.position.lerpVectors(a, b, t);
      const fade = Math.sin(p.progress * Math.PI);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.3 + fade * 0.7;
    });
  });

  if (!visible) return null;
  return (
    <group ref={groupRef}>
      {particleMeshes.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  );
}

/* =============== MAIN COMPONENT =============== */

export type LayerStates = Record<LayerKey, boolean>;

export function MovementModel({
  layers,
  exploded,
  highlightLayer,
  showEnergyFlow,
}: {
  layers: LayerStates;
  exploded: number;
  highlightLayer: LayerKey | null;
  showEnergyFlow: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.04;
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0]} scale={1.4}>
      <CaseLayer
        visible={layers.case}
        exploded={exploded}
        highlight={highlightLayer === "case"}
      />
      <DialLayer
        visible={layers.dial}
        exploded={exploded}
        highlight={highlightLayer === "dial"}
      />
      <MainspringLayer
        visible={layers.mainspring}
        exploded={exploded}
        highlight={highlightLayer === "mainspring"}
      />
      <GearTrainLayer
        visible={layers.gearTrain}
        exploded={exploded}
        highlight={highlightLayer === "gearTrain"}
      />
      <EscapementLayer
        visible={layers.escapement}
        exploded={exploded}
        highlight={highlightLayer === "escapement"}
      />
      <BalanceWheelLayer
        visible={layers.balanceWheel}
        exploded={exploded}
        highlight={highlightLayer === "balanceWheel"}
      />
      <HandsLayer
        visible={layers.hands}
        exploded={exploded}
        highlight={highlightLayer === "hands"}
      />
      <EnergyParticles visible={showEnergyFlow} />
    </group>
  );
}

/* =============== LAYER METADATA =============== */

export const LAYER_INFO: Record<
  LayerKey,
  {
    name: string;
    nameFa: string;
    number: string;
    description: string;
    color: string;
    icon: string;
  }
> = {
  case: {
    name: "Case",
    nameFa: "قاب",
    number: "01",
    description:
      "قاب طلایی بیرونی — محافظِ همه‌ی قطعات. از طلای ۱۸ قیراط ساخته می‌شود و در برابر ضربه و رطوبت مقاوم است.",
    color: "#b8945a",
    icon: "◯",
  },
  dial: {
    name: "Dial",
    nameFa: "صفحه",
    number: "02",
    description:
      "صفحه‌ی نمایش — جایی که ساعت خوانده می‌شود. با تکنیک گیلوشِ دستی حکاکی می‌شود و ۱۲ نشانگر ساعت روی آن قرار دارد.",
    color: "#3a3a3a",
    icon: "◈",
  },
  mainspring: {
    name: "Mainspring",
    nameFa: "فنرِ اصلی",
    number: "03",
    description:
      "منبعِ انرژیِ ساعت. یک فنرِ مارپیچی که با کوک کردن (تنظیم تاج) بسته می‌شود و در طول ۸۰ ساعت به‌آرامی انرژی آزاد می‌کند.",
    color: "#c8a06a",
    icon: "◎",
  },
  gearTrain: {
    name: "Gear Train",
    nameFa: "چرخ‌دنده‌ها",
    number: "04",
    description:
      "سه چرخ‌دنده که انرژی فنر را به عقربه‌ها منتقل می‌کنند. هرکدام با سرعت متفاوتی می‌چرخند و نسبت دنده‌ای دقیق دارند.",
    color: "#d4b074",
    icon: "✦",
  },
  escapement: {
    name: "Escapement",
    nameFa: "گره‌گیر",
    number: "05",
    description:
      "قلبِ تپنده‌ی ساعت. چرخِ گره‌گیر و پالِت، انرژی را به‌صورت ضربان‌های دقیق آزاد می‌کند — ۸ ضربه در ثانیه.",
    color: "#9aa0a8",
    icon: "⊙",
  },
  balanceWheel: {
    name: "Balance Wheel",
    nameFa: "چرخِ تعادل",
    number: "06",
    description:
      "نوسانگرِ اصلی ساعت. با فرکانس ۵ هرتز (۱۰ نوسان در ثانیه) نوسان می‌کند و زمان را دقیق نگه می‌دارد.",
    color: "#b8945a",
    icon: "❖",
  },
  hands: {
    name: "Hands",
    nameFa: "عقربه‌ها",
    number: "07",
    description:
      "عقربه‌های طلایی — ساعت، دقیقه، ثانیه. آخرین مرحله‌ی انتقال انرژی، نمایش زمان به چشم شما.",
    color: "#d4b074",
    icon: "↻",
  },
};

export const LAYER_ORDER: LayerKey[] = [
  "case",
  "dial",
  "mainspring",
  "gearTrain",
  "escapement",
  "balanceWheel",
  "hands",
];

export const TUTORIAL_STEPS: Array<{
  layer: LayerKey;
  title: string;
  titleFa: string;
  explanation: string;
}> = [
  {
    layer: "mainspring",
    title: "Power Source",
    titleFa: "منبع انرژی",
    explanation:
      "وقتی شما تاج ساعت را می‌چرخانید، فنرِ اصلی درون بشکه بسته می‌شود. این فنر انرژی را در خود ذخیره می‌کند — مانند کشیدنِ کمان. انرژی ذخیره‌شده می‌تواند ساعت تا ۸۰ ساعت کار کند.",
  },
  {
    layer: "gearTrain",
    title: "Power Transmission",
    titleFa: "انتقالِ انرژی",
    explanation:
      "انرژی فنر از سه چرخ‌دنده عبور می‌کند. هر چرخ با سرعت متفاوتی می‌چرخد. این نسبتِ دنده‌ای است که ساعت، دقیقه، و ثانیه را از یک منبع واحد تولید می‌کند.",
  },
  {
    layer: "escapement",
    title: "The Heartbeat",
    titleFa: "ضربانِ قلب",
    explanation:
      "گره‌گیر — مهم‌ترین اختراع ساعت‌سازی. چرخِ گره‌گیر و پالِت، جریانِ انرژی را به‌صورت ضربان‌های دقیق می‌شکنند. هر ثانیه، ۸ ضربه. این صدای تیک‌تاک ساعت است.",
  },
  {
    layer: "balanceWheel",
    title: "Time Keeper",
    titleFa: "نگهبانِ زمان",
    explanation:
      "چرخِ تعادل با فرکانس ۵ هرتز نوسان می‌کند. هر نوسان، یک لحظه‌ی دقیق است. این نوسانگر است که دقت ساعت را تعیین می‌کند — مانند آونگِ یک ساعتِ قدیمی.",
  },
  {
    layer: "hands",
    title: "Time Displayed",
    titleFa: "نمایشِ زمان",
    explanation:
      "در نهایت، انرژی به عقربه‌ها می‌رسد. عقربه‌ی ساعت، دقیقه، و ثانیه — هرکدام با سرعتِ متناسب با مکانیزم می‌چرخند. زمان، به شما نمایش داده می‌شود.",
  },
];
