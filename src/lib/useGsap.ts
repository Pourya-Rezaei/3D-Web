"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register only on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes a GSAP scroll-triggered text reveal animation.
 * Each character/word animates from a hidden state to visible as user scrolls.
 */
export function useGsapTextReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    stagger?: number;
    duration?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) {
  const ref = useRef<T>(null);
  const {
    stagger = 0.05,
    duration = 1,
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
  } = options;

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      const elements = ref.current!.querySelectorAll("[data-reveal]");
      gsap.fromTo(
        elements,
        { y: 60, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger,
          duration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub: scrub || false,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [stagger, duration, start, end, scrub]);

  return ref;
}

/**
 * Parallax effect — element moves at a different rate than scroll.
 */
export function useGsapParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.3
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * Horizontal pin-and-scroll section.
 * Children scroll horizontally as user scrolls vertically.
 */
export function useGsapHorizontalScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      const track = ref.current!.querySelector("[data-horizontal-track]");
      if (!track) return;
      const totalWidth = (track as HTMLElement).scrollWidth;
      gsap.to(track, {
        x: -(totalWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${totalWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Generic scroll-trigger registration helper.
 * Pass a callback to set up any GSAP animation inside the element.
 */
export function useGsapEffect<T extends HTMLElement = HTMLDivElement>(
  setup: (el: HTMLElement, gsap: typeof import("gsap").gsap) => void,
  deps: any[] = []
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      setup(ref.current!, gsap);
    }, ref);
    return () => ctx.revert();
  }, deps);

  return ref;
}
