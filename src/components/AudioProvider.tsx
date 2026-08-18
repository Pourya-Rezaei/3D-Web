"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAudioEngine } from "@/lib/useAudioEngine";

type AudioContextType = ReturnType<typeof useAudioEngine>;

const AudioCtx = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudioEngine();
  return <AudioCtx.Provider value={audio}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    // Return a no-op fallback if used outside provider
    return {
      playSound: () => {},
      startTickTock: () => {},
      stopTickTock: () => {},
      enableAudio: () => {},
      isEnabled: false,
      isStarted: false,
    };
  }
  return ctx;
}
