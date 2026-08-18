"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Personality Quiz — 5 questions, each with 3-4 options.
 * Each answer adds to a profile that's sent to /api/concierge for AI recommendation.
 */

type Question = {
  id: keyof Answers;
  number: string;
  title: string;
  titleFa: string;
  subtitle: string;
  options: QuizOption[];
};

type QuizOption = {
  value: string;
  label: string;
  labelFa: string;
  description: string;
  descriptionFa: string;
  icon: string; // emoji or single character
};

type Answers = {
  style?: string;
  occasion?: string;
  material?: string;
  function?: string;
  era?: string;
};

const questions: Question[] = [
  {
    id: "style",
    number: "01",
    title: "Personal Style",
    titleFa: "سبک شخصی",
    subtitle: "وقتی به یک رویداد می‌روید، چه حسی می‌خواهید منتقل کنید؟",
    options: [
      {
        value: "casual",
        label: "Effortless",
        labelFa: "بی‌تكلف",
        description: "Refined simplicity",
        descriptionFa: "سادگیِ ظریف",
        icon: "○",
      },
      {
        value: "formal",
        label: "Commanding",
        labelFa: "باصدا",
        description: "Quiet authority",
        descriptionFa: "هیبتِ آرام",
        icon: "◆",
      },
      {
        value: "sport",
        label: "Adventurous",
        labelFa: "ماجراجو",
        description: "Ready for anything",
        descriptionFa: "آماده‌ی هر چیزی",
        icon: "▲",
      },
    ],
  },
  {
    id: "occasion",
    number: "02",
    title: "Daily Companion",
    titleFa: "همراه روزانه",
    subtitle: "ساعت شما بیشتر در چه محیط‌هایی حضور دارد؟",
    options: [
      {
        value: "daily",
        label: "The Office",
        labelFa: "دفتر کار",
        description: "Meetings, city life",
        descriptionFa: "جلسات، شهر",
        icon: "▦",
      },
      {
        value: "special",
        label: "Special Evenings",
        labelFa: "شب‌های خاص",
        description: "Galas, celebrations",
        descriptionFa: "ضیافت‌ها، جشن‌ها",
        icon: "✦",
      },
      {
        value: "adventure",
        label: "The Open World",
        labelFa: "جهانِ باز",
        description: "Travel, ocean, mountains",
        descriptionFa: "سفر، اقیانوس، کوه",
        icon: "⛰",
      },
    ],
  },
  {
    id: "material",
    number: "03",
    title: "Material Soul",
    titleFa: "روحِ متریال",
    subtitle: "کدام فلز با پوست شما هم‌نوا می‌شود؟",
    options: [
      {
        value: "gold",
        label: "Warm Gold",
        labelFa: "طلای گرم",
        description: "18k yellow / rose",
        descriptionFa: "طلای ۱۸ عیار",
        icon: "●",
      },
      {
        value: "steel",
        label: "Cool Steel",
        labelFa: "فولاد خنک",
        description: "904L stainless",
        descriptionFa: "فولاد ۹۰۴L",
        icon: "◐",
      },
      {
        value: "platinum",
        label: "Rare Platinum",
        labelFa: "پلاتین کمیاب",
        description: "950 platinum",
        descriptionFa: "پلاتین ۹۵۰",
        icon: "◎",
      },
    ],
  },
  {
    id: "function",
    number: "04",
    title: "Heart's Function",
    titleFa: "کارکردِ قلب",
    subtitle: "ساعت برای شما چیست؟",
    options: [
      {
        value: "simple",
        label: "Time Itself",
        labelFa: "خودِ زمان",
        description: "Hours and minutes, nothing more",
        descriptionFa: "ساعت و دقیقه، نه بیشتر",
        icon: "⏱",
      },
      {
        value: "function",
        label: "Precision Tools",
        labelFa: "ابزارِ دقیق",
        description: "Chronograph, dual time",
        descriptionFa: "کرنوگراف، دو منطقه",
        icon: "⊙",
      },
      {
        value: "art",
        label: "Living Art",
        labelFa: "هنرِ زنده",
        description: "Tourbillon, skeleton",
        descriptionFa: "توربیون، اسکلت",
        icon: "✧",
      },
    ],
  },
  {
    id: "era",
    number: "05",
    title: "Time's Era",
    titleFa: "دورانِ زمان",
    subtitle: "کدام دوران شما را صدا می‌زند؟",
    options: [
      {
        value: "vintage",
        label: "The Classics",
        labelFa: "کلاسیک‌ها",
        description: "1950s—1970s heritage",
        descriptionFa: "میراث ۱۹۵۰—۱۹۷۰",
        icon: "❖",
      },
      {
        value: "modern",
        label: "The Contemporary",
        labelFa: "معاصر",
        description: "Today's design language",
        descriptionFa: "زبان طراحی امروز",
        icon: "▣",
      },
      {
        value: "timeless",
        label: "The Eternal",
        labelFa: "جاودان",
        description: "Beyond any era",
        descriptionFa: "فراتر از هر دوران",
        icon: "∞",
      },
    ],
  },
];

export function PersonalityQuiz({
  onComplete,
}: {
  onComplete: (answers: Answers) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;

  const handleSelect = (value: string) => {
    if (selectedOption !== null) return; // prevent double-select
    setSelectedOption(value);
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after a delay
    setTimeout(() => {
      if (isLast) {
        onComplete(newAnswers);
      } else {
        setCurrentQuestion((q) => q + 1);
        setSelectedOption(null);
      }
    }, 900);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="relative min-h-screen gallery-theme gallery-noise flex items-center justify-center px-6 py-20">
      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(212, 176, 116, 0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(184, 148, 90, 0.06), transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-4xl">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-3 text-[10px] tracking-luxe text-[#4a3f2a]/60">
            <span>
              QUESTION {question.number} / 0{questions.length}
            </span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-px bg-[#b8945a]/15 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8a6d3a] via-[#b8945a] to-[#d4b074]"
              animate={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Question label */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] tracking-luxe text-[#b8945a] mb-3"
              >
                {question.number} — {question.title.toUpperCase()}
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-light text-[#1a1410] mb-4">
                <span className="italic text-gold-gradient">{question.title}</span>
              </h1>
              <h2 className="font-fa text-2xl md:text-3xl text-[#4a3f2a] mb-6">
                {question.titleFa}
              </h2>
              <p className="font-fa text-base text-[#4a3f2a]/70 max-w-xl mx-auto leading-relaxed">
                {question.subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    onClick={() => handleSelect(opt.value)}
                    className={`gallery-option p-8 text-left group relative ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="text-4xl text-[#b8945a] mb-4 group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </div>

                    {/* English label */}
                    <div className="font-display text-2xl text-[#1a1410] mb-1">
                      {opt.label}
                    </div>
                    <div className="text-[10px] tracking-luxe text-[#b8945a]/70 mb-4">
                      {opt.description.toUpperCase()}
                    </div>

                    {/* Persian label */}
                    <div className="font-fa text-lg text-[#4a3f2a]">
                      {opt.labelFa}
                    </div>
                    <div className="font-fa text-xs text-[#4a3f2a]/60 mt-1">
                      {opt.descriptionFa}
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#d4b074] to-[#b8945a] flex items-center justify-center text-white"
                      >
                        ✓
                      </motion.div>
                    )}

                    {/* Hover line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-px bg-[#b8945a] transition-all duration-500" />
                  </motion.button>
                );
              })}
            </div>

            {/* Back button */}
            {currentQuestion > 0 && (
              <div className="text-center mt-12">
                <button
                  onClick={handleBack}
                  className="font-fa text-xs text-[#4a3f2a]/60 hover:text-[#b8945a] transition-colors tracking-wide-luxe"
                >
                  → سؤال قبلی
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export type { Answers };
export { questions };
