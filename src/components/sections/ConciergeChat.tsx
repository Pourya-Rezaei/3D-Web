"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type WatchContext = {
  name: string;
  ref: string;
  description: string;
};

/**
 * AI Concierge chatbot.
 * Talks with /api/chat endpoint which uses z-ai-web-dev-sdk.
 */
export function ConciergeChat({
  watchContext,
  narrative,
}: {
  watchContext?: WatchContext;
  narrative?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with AI narrative as first assistant message
  useEffect(() => {
    if (narrative) {
      setMessages([
        {
          role: "assistant",
          content: narrative,
          timestamp: Date.now(),
        },
        {
          role: "assistant",
          content:
            "اگر سؤالی دارید — درباره‌ی این قطعه، مکانیزم، متریال، یا حتی تاریخچه‌ی AURUM — بپرسید. من اینجا هستم.",
          timestamp: Date.now() + 100,
        },
      ]);
    }
  }, [narrative]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          watchContext,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "ببخشید، ارتباط با سرور قطع شد. لطفاً دوباره تلاش کنید.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Suggested questions
  const suggestions = [
    "چرا این ساعت برای من مناسب است؟",
    "این مکانیزم چطور کار می‌کند؟",
    "تاریخچه‌ی AURUM چیست؟",
    "تفاوت طلای رُز با پلاتین چیست؟",
  ];

  return (
    <div className="gallery-card p-6 md:p-8 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#b8945a]/15">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-[#b8945a]/40" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#d4b074] to-[#8a6d3a]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-display text-lg text-[#1a1410]">
              AURUM Concierge
            </div>
            <div className="flex items-center gap-2 text-[9px] tracking-luxe text-[#b8945a]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>آنلاین — ژنو</span>
            </div>
          </div>
        </div>
        <div className="text-[9px] tracking-luxe text-[#4a3f2a]/40">
          AI-POWERED
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl bubble-in ${
                msg.role === "user"
                  ? "bg-[#1a1410] text-[#f5f1e8] rounded-tl-sm"
                  : "bg-gradient-to-br from-[#fff8e8] to-[#f5f1e8] text-[#1a1410] border border-[#b8945a]/20 rounded-tr-sm"
              }`}
            >
              <p className="font-fa text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-gradient-to-br from-[#fff8e8] to-[#f5f1e8] border border-[#b8945a]/20 px-5 py-4 rounded-2xl rounded-tr-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b8945a] dot-1" />
                <span className="w-2 h-2 rounded-full bg-[#b8945a] dot-2" />
                <span className="w-2 h-2 rounded-full bg-[#b8945a] dot-3" />
              </div>
            </div>
          </div>
        )}

        {/* Suggestions (only shown initially) */}
        {messages.length <= 2 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-2 pt-4"
          >
            <div className="text-[9px] tracking-luxe text-[#4a3f2a]/50 text-center mb-2">
              پیشنهادها
            </div>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="block w-full text-right text-sm font-fa text-[#4a3f2a]/80 hover:text-[#b8945a] py-2 px-3 hover:bg-[#b8945a]/5 rounded transition-colors"
              >
                ← {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-[#b8945a]/15">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="سؤال خود را بپرسید..."
            className="flex-1 bg-[#f5f1e8] border border-[#b8945a]/20 px-4 py-3 text-sm text-[#1a1410] focus:outline-none focus:border-[#b8945a] transition-colors font-fa placeholder:text-[#4a3f2a]/40"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="gallery-button px-5 py-3 text-sm font-fa tracking-wide-luxe disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>ارسال</span>
          </button>
        </div>
      </div>
    </div>
  );
}
