"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Audio engine for the cinematic experience.
 * All sounds are generated procedurally via Web Audio API — no external files.
 *
 * Sounds:
 *   - tickTock: subtle clock tick (background)
 *   - paper rustle: envelope opening
 *   - click: UI feedback
 *   - chime: chapter transition
 *   - gearWhir: mechanical gear rotation
 *   - success: positive feedback (e.g. assembly complete)
 */

type SoundType =
  | "tickTock"
  | "paperRustle"
  | "click"
  | "chime"
  | "gearWhir"
  | "success"
  | "whoosh";

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Lazy init AudioContext (must be created/resumed after user gesture)
  const initCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Play a single sound
  const playSound = useCallback(
    (type: SoundType, options: { volume?: number; duration?: number } = {}) => {
      const ctx = initCtx();
      if (!ctx || !isEnabled) return;
      const { volume = 0.3, duration = 0.5 } = options;
      const now = ctx.currentTime;

      switch (type) {
        case "tickTock": {
          // Short tick — high-pitched wooden click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 2000;
          filter.Q.value = 2;
          osc.type = "square";
          osc.frequency.value = 1800;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume * 0.15, now + 0.001);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case "click": {
          // UI click — soft metallic
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          filter.type = "highpass";
          filter.frequency.value = 1500;
          osc.type = "sine";
          osc.frequency.value = 1200;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case "paperRustle": {
          // Paper rustle — filtered white noise
          const bufferSize = ctx.sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            // Filtered noise with envelope
            const t = i / bufferSize;
            const env = Math.sin(Math.PI * t) * (1 - t * 0.5);
            data[i] = (Math.random() * 2 - 1) * env * 0.3;
          }
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 3000;
          filter.Q.value = 1.5;
          const gain = ctx.createGain();
          gain.gain.value = volume * 0.4;
          src.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          src.start(now);
          break;
        }

        case "chime": {
          // Soft chime — three sine waves
          const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
          freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            const start = now + i * 0.08;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(volume * 0.15, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 1.5);
          });
          break;
        }

        case "gearWhir": {
          // Mechanical gear whir — filtered sawtooth
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 800;
          filter.Q.value = 3;
          osc.type = "sawtooth";
          osc.frequency.value = 60;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume * 0.1, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + duration + 0.1);
          break;
        }

        case "success": {
          // Success — ascending notes
          const freqs = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
          freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.value = freq;
            const start = now + i * 0.1;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(volume * 0.18, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 1);
          });
          break;
        }

        case "whoosh": {
          // Whoosh — filtered noise sweep
          const bufferSize = ctx.sampleRate * duration;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            const env = Math.sin(Math.PI * t);
            data[i] = (Math.random() * 2 - 1) * env * 0.4;
          }
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(200, now);
          filter.frequency.exponentialRampToValueAtTime(4000, now + duration);
          filter.Q.value = 1;
          const gain = ctx.createGain();
          gain.gain.value = volume * 0.4;
          src.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          src.start(now);
          break;
        }
      }
    },
    [initCtx, isEnabled]
  );

  // Start background tick-tock loop
  const startTickTock = useCallback(() => {
    if (tickIntervalRef.current) return;
    if (!isEnabled) return;
    tickIntervalRef.current = setInterval(() => {
      playSound("tickTock", { volume: 0.3 });
    }, 1000); // 60 BPM
  }, [isEnabled, playSound]);

  // Stop tick-tock loop
  const stopTickTock = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  // Enable audio on first user interaction
  const enableAudio = useCallback(() => {
    const ctx = initCtx();
    if (ctx) {
      setIsEnabled(true);
      setIsStarted(true);
    }
  }, [initCtx]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopTickTock();
      if (ctxRef.current) {
        ctxRef.current.close();
      }
    };
  }, [stopTickTock]);

  return {
    playSound,
    startTickTock,
    stopTickTock,
    enableAudio,
    isEnabled,
    isStarted,
  };
}
