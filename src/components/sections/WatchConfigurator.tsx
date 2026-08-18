"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { WatchModelV2, WatchConfig } from "@/components/three/WatchModelV2";
import { Magnetic } from "@/components/CustomCursor";

const presets: {
  id: string;
  name: string;
  nameFa: string;
  config: WatchConfig;
  price: string;
}[] = [
  {
    id: "gold",
    name: "Classic Gold",
    nameFa: "طلای کلاسیک",
    config: {
      caseColor: "#c9a96a",
      dialColor: "#0a0805",
      strapColor: "#1a1410",
      handColor: "#c9a96a",
      material: "gold",
    },
    price: "₠ ۸۸٬۰۰۰",
  },
  {
    id: "rose",
    name: "Rose Gold",
    nameFa: "رُز‌گلد",
    config: {
      caseColor: "#e8a08a",
      dialColor: "#2a1a14",
      strapColor: "#3a1a14",
      handColor: "#e8a08a",
      material: "rose-gold",
    },
    price: "₠ ۹۴٬۰۰۰",
  },
  {
    id: "platinum",
    name: "Platinum",
    nameFa: "پلاتین",
    config: {
      caseColor: "#d8d8d2",
      dialColor: "#0a0a0a",
      strapColor: "#0a0a0a",
      handColor: "#d8d8d2",
      material: "platinum",
    },
    price: "₠ ۱۴۲٬۰۰۰",
  },
  {
    id: "steel",
    name: "Steel Sport",
    nameFa: "استیل ورزشی",
    config: {
      caseColor: "#9aa0a8",
      dialColor: "#0a1428",
      strapColor: "#0a0a0a",
      handColor: "#9aa0a8",
      material: "steel",
    },
    price: "₠ ۷۲٬۰۰۰",
  },
  {
    id: "midnight",
    name: "Midnight",
    nameFa: "نیمه‌شب",
    config: {
      caseColor: "#2a2a3a",
      dialColor: "#0a0a14",
      strapColor: "#0a0a14",
      handColor: "#c9a96a",
      material: "steel",
    },
    price: "₠ ۹۸٬۰۰۰",
  },
];

const strapOptions = [
  { id: "leather-black", color: "#0a0805", label: "چرم مشکی" },
  { id: "leather-brown", color: "#3a2418", label: "چرم قهوه‌ای" },
  { id: "leather-tan", color: "#7a4f25", label: "چرم برنزه" },
  { id: "rubber", color: "#1a1a1a", label: "لاستیک" },
  { id: "steel", color: "#9aa0a8", label: "استیل" },
];

const dialOptions = [
  { id: "black", color: "#0a0805", label: "مشکی" },
  { id: "blue", color: "#0a1428", label: "آبی" },
  { id: "green", color: "#0a2418", label: "سبز" },
  { id: "white", color: "#e8e2d2", label: "سفید" },
  { id: "champagne", color: "#c8b888", label: "شامپاینی" },
];

export function WatchConfigurator() {
  const [preset, setPreset] = useState(0);
  const [strapIdx, setStrapIdx] = useState(0);
  const [dialIdx, setDialIdx] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showSpecs, setShowSpecs] = useState(false);

  const config: WatchConfig = {
    ...presets[preset].config,
    strapColor: strapOptions[strapIdx].color,
    dialColor: dialOptions[dialIdx].color,
  };

  return (
    <section
      id="configurator"
      className="relative section-pad bg-gradient-to-b from-black via-[#0a0805] to-black overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-16 md:mb-20"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="w-16 h-px bg-gold/40" />
          <span className="text-[10px] tracking-luxe text-gold/70 font-fa">
            استودیوی طراحی
          </span>
          <span className="w-16 h-px bg-gold/40" />
        </div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light">
          <span className="italic text-gold-gradient">Bespoke</span>{" "}
          <span className="font-fa">ساز</span>
        </h2>
        <p className="font-fa text-sm text-foreground/50 mt-4 max-w-xl mx-auto leading-relaxed">
          ساعت خود را طراحی کنید. رنگ قاب، صفحه و بند را انتخاب کنید — در ۳D زنده ببینید.
        </p>
      </motion.div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3D Viewer */}
        <div className="lg:col-span-7 glass-gold relative aspect-square lg:aspect-[5/6] rounded-sm overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <spotLight
                position={[4, 6, 4]}
                angle={0.3}
                penumbra={1}
                intensity={2.5}
                color="#fff5e0"
              />
              <spotLight
                position={[-4, -2, 2]}
                angle={0.4}
                penumbra={1}
                intensity={1.2}
                color="#c9a96a"
              />
              <pointLight position={[0, 0, 3]} intensity={1.5} color="#e6c98b" />

              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
                <WatchModelV2 config={config} />
              </Float>

              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.5}
                scale={8}
                blur={2.5}
                color="#000000"
              />
              <Environment preset="night" />

              {!autoRotate && (
                <OrbitControls
                  enablePan={false}
                  minDistance={3.5}
                  maxDistance={8}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                />
              )}
            </Suspense>
          </Canvas>

          {/* Controls overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              data-cursor
              data-cursor-text={autoRotate ? "متوقف" : "چرخش"}
              className="glass px-3 py-1.5 text-[10px] tracking-luxe text-gold/80 hover:text-gold border border-gold/20 hover:border-gold/60 transition-colors"
            >
              {autoRotate ? "AUTO ●" : "MANUAL ○"}
            </button>
          </div>

          <div className="absolute top-4 right-4 glass px-3 py-1.5 text-[10px] tracking-luxe text-gold/60">
            {autoRotate ? "AUTO-ROTATE" : "DRAG TO ROTATE"}
          </div>

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/40 pointer-events-none" />

          {/* Price display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={preset + strapIdx + dialIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-6 left-6"
            >
              <div className="text-[10px] tracking-luxe text-gold/50 mb-1">
                YOUR CONFIG / پیکربندی شما
              </div>
              <div className="font-display text-3xl text-gold-gradient">
                {presets[preset].price}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Configurator sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Material presets */}
          <ConfigBlock title="متریال" en="MATERIAL">
            <div className="grid grid-cols-5 gap-2">
              {presets.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(i)}
                  data-cursor
                  className={`group relative aspect-square rounded-full overflow-hidden border-2 transition-all ${
                    preset === i
                      ? "border-gold scale-110"
                      : "border-gold/20 hover:border-gold/50"
                  }`}
                  style={{ background: p.config.caseColor }}
                  title={p.name}
                >
                  <div
                    className={`absolute inset-0 ${
                      preset === i ? "ring-2 ring-gold ring-offset-2 ring-offset-black" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-fa text-sm text-foreground">
                {presets[preset].nameFa}
              </span>
              <span className="text-[10px] tracking-luxe text-gold/60">
                {presets[preset].name.toUpperCase()}
              </span>
            </div>
          </ConfigBlock>

          {/* Dial */}
          <ConfigBlock title="صفحه" en="DIAL">
            <div className="grid grid-cols-5 gap-2">
              {dialOptions.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setDialIdx(i)}
                  data-cursor
                  className={`group relative aspect-square rounded-full border-2 transition-all ${
                    dialIdx === i
                      ? "border-gold scale-110"
                      : "border-gold/20 hover:border-gold/50"
                  }`}
                  style={{ background: d.color }}
                />
              ))}
            </div>
            <div className="mt-3 font-fa text-sm text-foreground">
              {dialOptions[dialIdx].label}
            </div>
          </ConfigBlock>

          {/* Strap */}
          <ConfigBlock title="بند" en="STRAP">
            <div className="grid grid-cols-5 gap-2">
              {strapOptions.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setStrapIdx(i)}
                  data-cursor
                  className={`group relative aspect-square rounded-md border-2 transition-all ${
                    strapIdx === i
                      ? "border-gold scale-110"
                      : "border-gold/20 hover:border-gold/50"
                  }`}
                  style={{ background: s.color }}
                />
              ))}
            </div>
            <div className="mt-3 font-fa text-sm text-foreground">
              {strapOptions[strapIdx].label}
            </div>
          </ConfigBlock>

          {/* Action buttons */}
          <div className="space-y-3 mt-4">
            <Magnetic strength={0.3}>
              <button
                data-cursor
                data-cursor-text="سفارش"
                className="group relative w-full font-fa text-sm tracking-wide-luxe text-black bg-gradient-to-r from-gold-light to-gold py-4 overflow-hidden"
              >
                <span className="relative z-10">سفارش این پیکربندی</span>
                <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </Magnetic>

            <Magnetic strength={0.2}>
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                data-cursor
                className="w-full font-fa text-xs tracking-wide-luxe text-gold border border-gold/30 hover:bg-gold/10 py-3 transition-colors"
              >
                {showSpecs ? "بستن جزئیات" : "مشاهده‌ی جزئیات فنی"}
              </button>
            </Magnetic>
          </div>

          {/* Specs drawer */}
          <AnimatePresence>
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-gold p-6 space-y-3 text-xs">
                  {[
                    { label: "قطر قاب", value: "۴۲ میلی‌متر" },
                    { label: "ضخامت", value: "۱۲ میلی‌متر" },
                    { label: "وزن", value: "۸۵ گرم" },
                    { label: "مکانیزم", value: "اتوماتیک AR-920" },
                    { label: "مقاومت آب", value: "۱۰۰ متر" },
                    { label: "گارانتی", value: "مادام‌العمر" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between font-fa text-foreground/70 pb-3 border-b border-gold/10 last:border-0"
                    >
                      <span>{s.label}</span>
                      <span className="text-gold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ConfigBlock({
  title,
  en,
  children,
}: {
  title: string;
  en: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] tracking-luxe text-gold/60">
          {en} / {title}
        </span>
        <span className="w-8 h-px bg-gold/30" />
      </div>
      {children}
    </div>
  );
}
