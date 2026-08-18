"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Typewriter hook — types out text character by character.
 *
 * Usage:
 *   const { text, isDone, restart } = useTypewriter("سلام دنیا", { speed: 50 });
 *
 * Features:
 *   - Per-character typing with adjustable speed
 *   - Optional start delay
 *   - Optional blinking cursor
 *   - Restart on demand
 *   - Respects reduced motion preference
 */
export function useTypewriter(
  fullText: string,
  options: {
    speed?: number; // ms per character
    startDelay?: number; // ms delay before typing starts
    enabled?: boolean; // can be toggled to pause
    onDone?: () => void;
  } = {}
) {
  const { speed = 45, startDelay = 0, enabled = true, onDone } = options;
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!enabled) return;
    // Respect reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayText(fullText);
      setIsDone(true);
      onDoneRef.current?.();
      return;
    }

    setDisplayText("");
    setIsDone(false);
    setIsTyping(true);

    let i = 0;
    const startTimer = setTimeout(() => {
      const tick = () => {
        if (i >= fullText.length) {
          setIsTyping(false);
          setIsDone(true);
          onDoneRef.current?.();
          return;
        }
        setDisplayText(fullText.slice(0, i + 1));
        i++;
        // Slight randomness for human-like typing
        const charDelay = fullText[i - 1] === " " ? speed * 0.5 : speed * (0.7 + Math.random() * 0.6);
        timerRef.current = setTimeout(tick, charDelay);
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fullText, speed, startDelay, enabled]);

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayText("");
    setIsDone(false);
    setIsTyping(true);
    // Trigger effect again by using a state toggle - or just call the same logic
    let i = 0;
    const tick = () => {
      if (i >= fullText.length) {
        setIsTyping(false);
        setIsDone(true);
        onDoneRef.current?.();
        return;
      }
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      const charDelay = fullText[i - 1] === " " ? speed * 0.5 : speed * (0.7 + Math.random() * 0.6);
      timerRef.current = setTimeout(tick, charDelay);
    };
    tick();
  };

  const skip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayText(fullText);
    setIsTyping(false);
    setIsDone(true);
    onDoneRef.current?.();
  };

  return { text: displayText, isTyping, isDone, restart, skip };
}

/**
 * Multi-line typewriter — types each line sequentially.
 */
export function useMultiLineTypewriter(
  lines: string[],
  options: {
    speed?: number;
    lineDelay?: number; // delay between lines
    startDelay?: number;
    enabled?: boolean;
    onDone?: () => void;
  } = {}
) {
  const { speed = 45, lineDelay = 400, startDelay = 0, enabled = true, onDone } = options;
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!enabled || lines.length === 0) return;
    setCurrentLine(0);
    setDisplayedLines([]);
    setIsDone(false);

    let lineIdx = 0;
    let charIdx = 0;

    const startTimer = setTimeout(() => {
      const processLine = () => {
        if (lineIdx >= lines.length) {
          setIsDone(true);
          onDoneRef.current?.();
          return;
        }
        const line = lines[lineIdx];
        if (charIdx >= line.length) {
          // Move to next line
          setDisplayedLines((prev) => [...prev, line]);
          lineIdx++;
          charIdx = 0;
          setCurrentLine(lineIdx);
          setTimeout(processLine, lineDelay);
          return;
        }
        charIdx++;
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[lineIdx] = line.slice(0, charIdx);
          // Pad if we haven't gotten to this index yet
          while (next.length < lineIdx) next.push("");
          return next;
        });
        const charDelay = line[charIdx - 1] === " " ? speed * 0.5 : speed * (0.7 + Math.random() * 0.6);
        setTimeout(processLine, charDelay);
      };
      processLine();
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [lines, speed, lineDelay, startDelay, enabled]);

  return { lines: displayedLines, currentLine, isDone };
}
