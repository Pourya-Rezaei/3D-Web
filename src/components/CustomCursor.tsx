"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor with magnetic effect:
 * - Small dot follows mouse precisely
 * - Outer ring lags with spring physics
 * - Grows + changes label when hovering interactive elements (a, button, [data-cursor])
 * - Shows custom text when data-cursor-text attribute is present
 */
export function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState<string>("");
  const [hidden, setHidden] = useState(false);
  const [clicking, setClicking] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smoothed outer ring (springs)
  const ringX = useSpring(mouseX, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 350, damping: 28, mass: 0.5 });

  // Inner dot tracks closely
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(hover: none)").matches) {
      const t = window.setTimeout(() => setHidden(true), 0);
      return () => window.clearTimeout(t);
    }

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], [role='button']"
      );
      if (target) {
        setHovered(true);
        const text = target.getAttribute("data-cursor-text");
        setLabel(text ?? "");
      } else {
        setHovered(false);
        setLabel("");
      }
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [mouseX, mouseY]);

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      {/* Outer ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute"
        animate={{
          width: hovered ? 90 : 32,
          height: hovered ? 90 : 32,
          opacity: clicking ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <div
          className="w-full h-full rounded-full border flex items-center justify-center"
          style={{
            borderColor: hovered ? "rgba(201, 169, 106, 0.9)" : "rgba(201, 169, 106, 0.5)",
            backgroundColor: hovered ? "rgba(201, 169, 106, 0.08)" : "transparent",
            transform: "translate(-50%, -50%)",
          }}
        >
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-fa text-[9px] tracking-wide-luxe text-gold uppercase"
            >
              {label}
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        animate={{ scale: hovered ? 0 : 1, opacity: hovered ? 0 : 1 }}
        className="absolute"
      >
        <div
          className="w-2 h-2 rounded-full bg-gold"
          style={{
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 12px rgba(201, 169, 106, 0.8)",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Magnetic wrapper — element gets attracted to cursor on hover.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
