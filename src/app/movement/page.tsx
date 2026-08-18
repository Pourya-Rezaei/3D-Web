"use client";

import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MovementModel,
  LAYER_INFO,
  LAYER_ORDER,
  TUTORIAL_STEPS,
  type LayerKey,
  type LayerStates,
} from "@/components/three/MovementModel";

type Mode = "explore" | "tutorial";

export default function MovementPage() {
  const [layers, setLayers] = useState<LayerStates>({
    case: true,
    dial: true,
    mainspring: true,
    gearTrain: true,
    escapement: true,
    balanceWheel: true,
    hands: true,
  });
  const [exploded, setExploded] = useState(0);
  const [hoveredLayer, setHoveredLayer] = useState<LayerKey | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayerKey | null>(null);
  const [showEnergyFlow, setShowEnergyFlow] = useState(false);
  const [mode, setMode] = useState<Mode>("explore");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const toggleLayer = (key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLayerClick = (key: LayerKey) => {
    setSelectedLayer(key === selectedLayer ? null : key);
  };

  const startTutorial = () => {
    setMode("tutorial");
    setTutorialStep(0);
    // Show only the layer of the first step
    const firstLayer = TUTORIAL_STEPS[0].layer;
    setLayers({
      case: true,
      dial: false,
      mainspring: firstLayer === "mainspring",
      gearTrain: firstLayer === "gearTrain",
      escapement: firstLayer === "escapement",
      balanceWheel: firstLayer === "balanceWheel",
      hands: firstLayer === "hands",
    });
    setSelectedLayer(firstLayer);
    setShowEnergyFlow(false);
    setExploded(0.3);
  };

  const nextTutorialStep = () => {
    if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
      setMode("explore");
      setLayers({
        case: true,
        dial: true,
        mainspring: true,
        gearTrain: true,
        escapement: true,
        balanceWheel: true,
        hands: true,
      });
      setSelectedLayer(null);
      setExploded(0);
      return;
    }
    const next = tutorialStep + 1;
    setTutorialStep(next);
    const layer = TUTORIAL_STEPS[next].layer;
    setLayers((prev) => ({ ...prev, [layer]: true }));
    setSelectedLayer(layer);
    if (next === TUTORIAL_STEPS.length - 1) {
      setShowEnergyFlow(true);
    }
  };

  const currentInfo = selectedLayer ? LAYER_INFO[selectedLayer] : null;

  return (
    <main className="gallery-theme gallery-noise min-h-screen">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 gallery-glass border-b border-[#b8945a]/15 py-3">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-[#b8945a]/60 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#d4b074] to-[#8a6d3a]" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-gold-gradient">
                AURUM
              </div>
              <div className="text-[8px] tracking-luxe text-[#4a3f2a]/50">
                MOVEMENT EXPLORER
              </div>
            </div>
          </Link>

          {/* Mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("explore")}
              className={`px-4 py-2 text-[10px] tracking-luxe transition-colors ${
                mode === "explore"
                  ? "bg-[#1a1410] text-[#f5f1e8]"
                  : "text-[#4a3f2a]/60 hover:text-[#b8945a]"
              }`}
            >
              EXPLORE
            </button>
            <button
              onClick={startTutorial}
              className={`px-4 py-2 text-[10px] tracking-luxe transition-colors ${
                mode === "tutorial"
                  ? "bg-[#1a1410] text-[#f5f1e8]"
                  : "text-[#4a3f2a]/60 hover:text-[#b8945a]"
              }`}
            >
              TUTORIAL
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-[#4a3f2a]/70 hover:text-[#b8945a] transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">→</span>
            <span className="font-fa text-xs">بازگشت به سایت</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-20 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="w-16 h-px bg-[#b8945a]/40" />
            <span className="text-[10px] tracking-luxe text-[#b8945a]">
              MOVEMENT EXPLORER
            </span>
            <span className="w-16 h-px bg-[#b8945a]/40" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-light text-[#1a1410]">
            <span className="italic text-gold-gradient">Anatomy</span>{" "}
            <span className="font-fa">یک ساعت</span>
          </h1>
          <p className="font-fa text-sm text-[#4a3f2a]/60 mt-2">
            کالبدشکافی مکانیزم — لایه به لایه
          </p>
        </div>

        {/* Mode: Explore */}
        {mode === "explore" && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 pb-12">
            {/* 3D Canvas */}
            <div className="lg:col-span-8 relative aspect-square lg:aspect-auto lg:h-[700px] gallery-card rounded-sm overflow-hidden">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <spotLight
                    position={[3, 6, 3]}
                    angle={0.4}
                    penumbra={1}
                    intensity={2.5}
                    color="#fff5e0"
                    castShadow
                  />
                  <pointLight position={[-3, 1, 2]} intensity={1} color="#b8945a" />
                  <pointLight position={[3, -1, 2]} intensity={0.8} color="#5a78d8" />
                  <pointLight position={[0, 0, 3]} intensity={1.2} color="#d4b074" />

                  <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
                    <MovementModel
                      layers={layers}
                      exploded={exploded}
                      highlightLayer={hoveredLayer ?? selectedLayer}
                      showEnergyFlow={showEnergyFlow}
                    />
                  </Float>

                  <ContactShadows
                    position={[0, -2, 0]}
                    opacity={0.5}
                    scale={10}
                    blur={3}
                    color="#000000"
                  />
                  <Environment preset="night" />

                  {!autoRotate && (
                    <OrbitControls
                      enablePan={false}
                      minDistance={3.5}
                      maxDistance={8}
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI / 1.4}
                    />
                  )}
                </Suspense>
              </Canvas>

              {/* Canvas overlay controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="gallery-glass px-3 py-1.5 text-[10px] tracking-luxe text-[#b8945a] hover:text-[#1a1410] border border-[#b8945a]/30 hover:bg-[#b8945a]/10 transition-colors"
                >
                  {autoRotate ? "AUTO ●" : "MANUAL ○"}
                </button>
                <button
                  onClick={() => setShowEnergyFlow(!showEnergyFlow)}
                  className={`gallery-glass px-3 py-1.5 text-[10px] tracking-luxe transition-colors ${
                    showEnergyFlow
                      ? "bg-[#b8945a] text-white"
                      : "text-[#b8945a] hover:text-[#1a1410] border border-[#b8945a]/30 hover:bg-[#b8945a]/10"
                  }`}
                >
                  {showEnergyFlow ? "FLOW ●" : "FLOW ○"}
                </button>
              </div>

              <div className="absolute top-4 right-4 gallery-glass px-3 py-1.5 text-[10px] tracking-luxe text-[#4a3f2a]/60 z-10">
                {autoRotate ? "AUTO-ROTATE" : "DRAG TO ROTATE"}
              </div>

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#b8945a]/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#b8945a]/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#b8945a]/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#b8945a]/40 pointer-events-none" />

              {/* Exploded slider */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-md z-10">
                <div className="flex justify-between mb-2 text-[9px] tracking-luxe text-[#4a3f2a]/60">
                  <span>EXPLODED VIEW</span>
                  <span>{Math.round(exploded * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={exploded}
                  onChange={(e) => setExploded(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#b8945a]/20 appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#b8945a] [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#b8945a] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Layer list */}
              <div className="gallery-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] tracking-luxe text-[#b8945a]">
                    LAYERS / لایه‌ها
                  </span>
                  <span className="text-[9px] tracking-luxe text-[#4a3f2a]/40">
                    {Object.values(layers).filter(Boolean).length} / {LAYER_ORDER.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {LAYER_ORDER.map((key) => {
                    const info = LAYER_INFO[key];
                    const isOn = layers[key];
                    const isSelected = selectedLayer === key;
                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setHoveredLayer(key)}
                        onMouseLeave={() => setHoveredLayer(null)}
                        onClick={() => handleLayerClick(key)}
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all border-l-2 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#fff8e8] to-transparent border-[#b8945a]"
                            : "border-transparent hover:bg-[#b8945a]/5"
                        }`}
                      >
                        <span
                          className="text-lg w-5 text-center"
                          style={{ color: info.color }}
                        >
                          {info.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-fa text-sm text-[#1a1410]">
                            {info.nameFa}
                          </div>
                          <div className="text-[9px] tracking-luxe text-[#4a3f2a]/50">
                            {info.number} — {info.name.toUpperCase()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayer(key);
                          }}
                          className={`w-8 h-4 rounded-full transition-colors relative ${
                            isOn ? "bg-[#b8945a]" : "bg-[#4a3f2a]/20"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                              isOn ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Layer info */}
              <AnimatePresence mode="wait">
                {currentInfo && (
                  <motion.div
                    key={selectedLayer}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="gallery-card p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-2xl"
                        style={{ color: currentInfo.color }}
                      >
                        {currentInfo.icon}
                      </span>
                      <div>
                        <div className="font-display text-xl text-[#1a1410] italic">
                          {currentInfo.name}
                        </div>
                        <div className="font-fa text-sm text-[#4a3f2a]">
                          {currentInfo.nameFa}
                        </div>
                      </div>
                    </div>
                    <div className="gallery-hairline w-full mb-3" />
                    <p className="font-fa text-xs text-[#4a3f2a]/80 leading-relaxed">
                      {currentInfo.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mode: Tutorial */}
        {mode === "tutorial" && (
          <div className="flex-1 flex flex-col px-6 pb-12">
            {/* Tutorial 3D */}
            <div className="relative aspect-square md:aspect-[16/10] w-full gallery-card rounded-sm overflow-hidden mb-6">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <spotLight
                    position={[3, 6, 3]}
                    angle={0.4}
                    penumbra={1}
                    intensity={2.5}
                    color="#fff5e0"
                    castShadow
                  />
                  <pointLight position={[0, 0, 3]} intensity={1.2} color="#d4b074" />
                  <pointLight position={[-3, 1, 2]} intensity={1} color="#b8945a" />

                  <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
                    <MovementModel
                      layers={layers}
                      exploded={exploded}
                      highlightLayer={selectedLayer}
                      showEnergyFlow={showEnergyFlow}
                    />
                  </Float>

                  <ContactShadows
                    position={[0, -2, 0]}
                    opacity={0.5}
                    scale={10}
                    blur={3}
                    color="#000000"
                  />
                  <Environment preset="night" />
                </Suspense>
              </Canvas>
            </div>

            {/* Tutorial progress bar */}
            <div className="max-w-3xl mx-auto w-full mb-6">
              <div className="flex justify-between mb-2 text-[10px] tracking-luxe text-[#4a3f2a]/60">
                <span>
                  STEP {tutorialStep + 1} / {TUTORIAL_STEPS.length}
                </span>
                <span>
                  {Math.round(((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="h-px bg-[#b8945a]/15 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8a6d3a] via-[#b8945a] to-[#d4b074]"
                  animate={{
                    width: `${((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Tutorial content */}
            <div className="max-w-3xl mx-auto w-full text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tutorialStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-[10px] tracking-luxe text-[#b8945a] mb-2">
                    {TUTORIAL_STEPS[tutorialStep].title.toUpperCase()}
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl font-light text-[#1a1410] mb-4">
                    <span className="italic text-gold-gradient">
                      {TUTORIAL_STEPS[tutorialStep].title}
                    </span>
                  </h2>
                  <p className="font-fa text-base text-[#4a3f2a] mb-2">
                    {TUTORIAL_STEPS[tutorialStep].titleFa}
                  </p>
                  <p className="font-fa text-base md:text-lg text-[#4a3f2a]/80 leading-loose max-w-2xl mx-auto mb-8">
                    {TUTORIAL_STEPS[tutorialStep].explanation}
                  </p>

                  <button
                    onClick={nextTutorialStep}
                    className="gallery-button px-12 py-4 font-fa text-sm tracking-wide-luxe"
                  >
                    <span>
                      {tutorialStep >= TUTORIAL_STEPS.length - 1
                        ? "✓ پایان آموزش"
                        : "مرحله‌ی بعد ←"}
                    </span>
                  </button>

                  {tutorialStep < TUTORIAL_STEPS.length - 1 && (
                    <button
                      onClick={nextTutorialStep}
                      className="block mx-auto mt-4 font-fa text-xs text-[#4a3f2a]/50 hover:text-[#b8945a] transition-colors"
                    >
                      رد کردن ←
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[#b8945a]/15 mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-fa text-xs text-[#4a3f2a]/60 hover:text-[#b8945a] transition-colors"
          >
            <span>→</span>
            <span>بازگشت به وب‌سایت اصلی AURUM</span>
          </Link>
          <p className="font-fa text-[10px] text-[#4a3f2a]/40 mt-4">
            Movement Explorer — © ۲۰۲۵ AURUM
          </p>
        </footer>
      </div>
    </main>
  );
}
