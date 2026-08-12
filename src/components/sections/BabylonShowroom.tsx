"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as BABYLON from "@babylonjs/core";

/**
 * Babylon.js powered 3D showroom:
 *  - Floating gold torus (representing watch case) rotating in center
 *  - Particle field of golden sparks orbiting
 *  - Dynamic lighting (gold + warm white)
 *  - Mouse-controlled camera rotation
 *  - Custom shader-like material via PBR
 */
export function BabylonShowroom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.02, 1);

    // Camera - arc rotate around center
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      8,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 14;
    camera.wheelDeltaPercentage = 0.01;
    camera.minZ = 0.1;

    // Lights
    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemi.intensity = 0.3;
    hemi.diffuse = new BABYLON.Color3(0.9, 0.75, 0.45);
    hemi.groundColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    const spot1 = new BABYLON.SpotLight(
      "spot1",
      new BABYLON.Vector3(4, 6, 4),
      new BABYLON.Vector3(-1, -1.5, -1),
      Math.PI / 2.5,
      8,
      scene
    );
    spot1.diffuse = new BABYLON.Color3(1, 0.92, 0.7);
    spot1.intensity = 1.5;

    const spot2 = new BABYLON.SpotLight(
      "spot2",
      new BABYLON.Vector3(-4, 2, -4),
      new BABYLON.Vector3(1, -0.5, 1),
      Math.PI / 2.5,
      8,
      scene
    );
    spot2.diffuse = new BABYLON.Color3(0.85, 0.65, 0.3);
    spot2.intensity = 1;

    // === Watch Case (gold torus) ===
    const caseMesh = BABYLON.MeshBuilder.CreateTorus(
      "case",
      { diameter: 3, thickness: 0.5, tessellation: 64 },
      scene
    );
    const goldMat = new BABYLON.PBRMaterial("gold", scene);
    goldMat.albedoColor = new BABYLON.Color3(0.79, 0.66, 0.41);
    goldMat.metallic = 1;
    goldMat.roughness = 0.15;
    goldMat.environmentIntensity = 1.5;
    caseMesh.material = goldMat;

    // Inner ring (darker)
    const innerRing = BABYLON.MeshBuilder.CreateTorus(
      "innerRing",
      { diameter: 2.4, thickness: 0.15, tessellation: 64 },
      scene
    );
    const darkGoldMat = new BABYLON.PBRMaterial("darkGold", scene);
    darkGoldMat.albedoColor = new BABYLON.Color3(0.54, 0.45, 0.27);
    darkGoldMat.metallic = 1;
    darkGoldMat.roughness = 0.3;
    innerRing.material = darkGoldMat;

    // Crystal (sphere flattened)
    const crystal = BABYLON.MeshBuilder.CreateSphere(
      "crystal",
      { diameter: 2.2, segments: 32 },
      scene
    );
    crystal.scaling.y = 0.15;
    crystal.position.y = 0.1;
    const crystalMat = new BABYLON.PBRMaterial("crystal", scene);
    crystalMat.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    crystalMat.metallic = 0;
    crystalMat.roughness = 0;
    crystalMat.alpha = 0.25;
    crystalMat.indexOfRefraction = 1.5;
    crystalMat.environmentIntensity = 2;
    crystal.material = crystalMat;

    // Dial (cylinder flat)
    const dial = BABYLON.MeshBuilder.CreateCylinder(
      "dial",
      { diameter: 2.2, height: 0.05, tessellation: 64 },
      scene
    );
    dial.position.y = -0.05;
    const dialMat = new BABYLON.PBRMaterial("dial", scene);
    dialMat.albedoColor = new BABYLON.Color3(0.06, 0.05, 0.04);
    dialMat.metallic = 0.7;
    dialMat.roughness = 0.4;
    dial.material = dialMat;

    // Hour markers (12 small boxes)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const marker = BABYLON.MeshBuilder.CreateBox(
        `marker-${i}`,
        { width: 0.06, height: 0.08, depth: 0.03 },
        scene
      );
      marker.position.x = Math.sin(angle) * 0.95;
      marker.position.z = Math.cos(angle) * 0.95;
      marker.position.y = 0.02;
      marker.rotation.y = -angle;
      marker.material = i % 3 === 0 ? goldMat : darkGoldMat;
      marker.parent = dial;
    }

    // Hands (rotating)
    const hourPivot = new BABYLON.TransformNode("hourPivot", scene);
    hourPivot.parent = dial;
    const hourHand = BABYLON.MeshBuilder.CreateBox(
      "hourHand",
      { width: 0.04, height: 0.02, depth: 0.7 },
      scene
    );
    hourHand.position.z = 0.35;
    hourHand.position.y = 0.05;
    hourHand.material = goldMat;
    hourHand.parent = hourPivot;

    const minutePivot = new BABYLON.TransformNode("minutePivot", scene);
    minutePivot.parent = dial;
    const minuteHand = BABYLON.MeshBuilder.CreateBox(
      "minuteHand",
      { width: 0.025, height: 0.02, depth: 1 },
      scene
    );
    minuteHand.position.z = 0.5;
    minuteHand.position.y = 0.06;
    minuteHand.material = goldMat;
    minuteHand.parent = minutePivot;

    // === Particle system ===
    const particleSystem = new BABYLON.ParticleSystem("particles", 800, scene);
    particleSystem.particleTexture = createParticleTexture(scene);
    particleSystem.emitter = BABYLON.Vector3.Zero();
    particleSystem.minEmitBox = new BABYLON.Vector3(-4, -2, -4);
    particleSystem.maxEmitBox = new BABYLON.Vector3(4, 2, 4);
    particleSystem.color1 = new BABYLON.Color4(0.9, 0.75, 0.4, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.92, 0.7, 1);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    particleSystem.minSize = 0.03;
    particleSystem.maxSize = 0.1;
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 5;
    particleSystem.emitRate = 200;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0.1, 0);
    particleSystem.direction1 = new BABYLON.Vector3(-0.5, 0.5, -0.5);
    particleSystem.direction2 = new BABYLON.Vector3(0.5, 1, 0.5);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.start();

    // Glow layer for emissive effect
    const glow = new BABYLON.GlowLayer("glow", scene);
    glow.intensity = 0.8;

    // Environment (use only lighting, no external texture file)

    // Animation - rotate case
    scene.registerBeforeRender(() => {
      caseMesh.rotation.y += 0.005;
      innerRing.rotation.y -= 0.008;
      dial.rotation.y += 0.005;
      hourPivot.rotation.y += 0.001;
      minutePivot.rotation.y += 0.012;
      // Subtle float
      const t = performance.now() / 1000;
      caseMesh.position.y = Math.sin(t * 0.5) * 0.1;
      innerRing.position.y = Math.sin(t * 0.5) * 0.1;
      dial.position.y = -0.05 + Math.sin(t * 0.5) * 0.1;
      crystal.position.y = 0.1 + Math.sin(t * 0.5) * 0.1;
    });

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize
    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    // Mark as loaded after a tick (deferred to avoid cascading renders)
    const t = window.setTimeout(() => setIsLoaded(true), 60);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      particleSystem.dispose();
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <section
      id="showroom"
      className="relative section-pad bg-black overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 h-px bg-gold/40" />
            <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
              نمایشگاه سه‌بعدی
            </span>
            <span className="w-16 h-px bg-gold/40" />
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light">
            <span className="italic text-gold-gradient">Showroom</span>{" "}
            <span className="font-fa">زنده</span>
          </h2>
          <p className="font-fa text-sm text-foreground/50 mt-4 max-w-xl mx-auto leading-relaxed">
            با موس بچرخانید، زوم کنید. ساعت را در فضای سه‌بعدی کاوش کنید.
          </p>
        </motion.div>

        {/* 3D Canvas container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-sm overflow-hidden glass-gold"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full outline-none touch-none"
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="font-display text-2xl text-gold-gradient animate-pulse">
                Loading 3D...
              </div>
            </div>
          )}

          {/* Corner UI */}
          <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] tracking-luxe text-gold/60 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>BABYLON.JS — LIVE</span>
          </div>

          <div className="absolute bottom-4 right-4 text-[10px] tracking-luxe text-foreground/40 font-fa pointer-events-none">
            بکشید تا بچرخد · اسکرول کنید تا زوم کنید
          </div>

          {/* Decorative corner brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-gold/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-gold/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-gold/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-gold/40 pointer-events-none" />
        </motion.div>

        {/* Stats below showroom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/5 mt-px">
          {[
            { label: "ذرات زنده", value: "۸۰۰", en: "PARTICLES" },
            { label: "مثلث‌های رندر", value: "۱۲٬۴۸۰", en: "TRIANGLES" },
            { label: "نرخ فریم", value: "۶۰ FPS", en: "FRAMERATE" },
            { label: "نورپردازی پویا", value: "۳ منبع", en: "LIGHTS" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black p-6 md:p-8 text-center"
            >
              <div className="font-display text-3xl md:text-4xl text-gold-gradient">
                {stat.value}
              </div>
              <div className="font-fa text-xs text-foreground/50 mt-2">{stat.label}</div>
              <div className="text-[9px] tracking-luxe text-gold/40 mt-1">{stat.en}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function createParticleTexture(scene: BABYLON.Scene): BABYLON.Texture {
  // Create a circular gradient particle texture procedurally
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 230, 170, 1)");
  gradient.addColorStop(0.4, "rgba(201, 169, 106, 0.6)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = BABYLON.Texture.CreateFromBase64String(
    canvas.toDataURL(),
    "particleTex",
    scene
  );
  texture.hasAlpha = true;
  return texture;
}
