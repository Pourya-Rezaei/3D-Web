"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AudioProvider } from "@/components/AudioProvider";
import { CinematicUI } from "@/components/sections/CinematicUI";
import { ChapterI } from "@/components/sections/ChapterI";
import { ChapterII } from "@/components/sections/ChapterII";
import { ChapterIII } from "@/components/sections/ChapterIII";
import { ChapterIV } from "@/components/sections/ChapterIV";
import { ChapterV } from "@/components/sections/ChapterV";
import { ChapterVI } from "@/components/sections/ChapterVI";

export default function CinematicExperience() {
  const [userName, setUserName] = useState("");

  // Listen for storage events from ChapterV (when user submits name)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "aurum-user-name" && e.newValue) {
        setUserName(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    // Also poll in same-tab navigation
    const interval = setInterval(() => {
      const name = window.localStorage.getItem("aurum-user-name");
      if (name && name !== userName) {
        setUserName(name);
      }
    }, 1000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [userName]);

  return (
    <AudioProvider>
      <main className="relative bg-[#060a18] min-h-screen">
        <CinematicUI />

        {/* Back to main site link (top-right fixed) */}
        <Link
          href="/"
          className="fixed top-3 left-6 z-[60] hidden md:flex items-center gap-2 px-4 py-2 glass-midnight border border-gold/20 hover:border-gold/60 transition-colors group"
        >
          <span className="text-gold group-hover:-translate-x-1 transition-transform">→</span>
          <span className="font-fa text-xs text-foreground/70 group-hover:text-gold transition-colors">
            بازگست به سایت
          </span>
        </Link>

        {/* Chapter I: The Invitation */}
        <ChapterI />

        {/* Chapter II: Atelier 1986 */}
        <ChapterII />

        {/* Chapter III: The Choice */}
        <ChapterIII />

        {/* Chapter IV: Assembly */}
        <ChapterIV />

        {/* Chapter V: The Birth */}
        <NameCaptureWrapper onNameSet={setUserName}>
          <ChapterV />
        </NameCaptureWrapper>

        {/* Chapter VI: The Legacy */}
        <ChapterVI userName={userName} />

        {/* Footer */}
        <footer className="relative bg-[#060a18] border-t border-gold/10 py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="w-16 h-px bg-gold/40" />
              <span className="text-[10px] tracking-luxe text-gold/70">
                AURUM — MAISON HORLOGÈRE — GENÈVE 1986
              </span>
              <span className="w-16 h-px bg-gold/40" />
            </div>
            <div className="font-display text-3xl text-gold-gradient mb-2">AURUM</div>
            <p className="font-fa text-xs text-foreground/40 mb-6">
              تجربه‌ی تعاملی ساعت‌سازی — © ۲۰۲۵
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-fa text-sm text-gold border border-gold/30 hover:bg-gold/10 px-6 py-3 transition-colors"
            >
              <span>→</span>
              <span>بازگست به وب‌سایت اصلی</span>
            </Link>
          </div>
        </footer>
      </main>
    </AudioProvider>
  );
}

/**
 * Wrapper that captures the name from the ChapterV input via a custom event
 * and stores it in localStorage so ChapterVI can read it.
 */
function NameCaptureWrapper({
  children,
  onNameSet,
}: {
  children: React.ReactNode;
  onNameSet: (name: string) => void;
}) {
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        onNameSet(customEvent.detail);
        window.localStorage.setItem("aurum-user-name", customEvent.detail);
      }
    };
    window.addEventListener("aurum-name-set", handler as EventListener);
    return () => window.removeEventListener("aurum-name-set", handler as EventListener);
  }, [onNameSet]);

  return <>{children}</>;
}
