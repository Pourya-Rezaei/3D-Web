/**
 * AURUM watch catalog — the single source of truth for the collection.
 * Kept data-only (no logic) so the catalog can later be swapped for a DB
 * or CMS without touching the scoring/narrative code.
 */

export type QuizAnswers = {
  style?: string; // casual | formal | sport
  occasion?: string; // daily | special | adventure
  material?: string; // gold | steel | platinum
  function?: string; // simple | function | art
  era?: string; // vintage | modern | timeless
};

export type Watch = {
  id: string;
  name: string;
  nameFa: string;
  ref: string;
  price: string;
  image: string;
  caliber: string;
  material: string;
  diameter: string;
  edition: string;
  description: string;
  tags: string[];
};

export const WATCH_DATABASE: Watch[] = [
  {
    id: "tourbillon",
    name: "AURUM Tourbillon",
    nameFa: "آوروم توربیون",
    ref: "AR-007-PT",
    price: "₠ ۲۴۰٬۰۰۰",
    image: "/watches/watch-3.png",
    caliber: "دستی — توربیون پروانه‌ای",
    material: "پلاتین ۹۵۰",
    diameter: "۴۲ میلی‌متر",
    edition: "۱۲ قطعه در سال",
    description:
      "شاهکار ساعت‌سازی. توربیون پروانه‌ای شناور درون قاب پلاتین ۹۵۰.",
    tags: ["formal", "art", "rare", "heritage", "manual", "platinum", "timeless"],
  },
  {
    id: "rose",
    name: "AURUM Rose",
    nameFa: "آوروم رُز",
    ref: "AR-024-RG",
    price: "₠ ۴۸٬۰۰۰",
    image: "/watches/watch-1.png",
    caliber: "اتوماتیک — کالیبر AR-880",
    material: "رُز‌گلد ۱۸ قیراط",
    diameter: "۴۰ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "سفتی از طلای رُز‌گلد ۱۸ قیراط با دیسک خورشیدی مشکی.",
    tags: ["casual", "warm", "modern", "automatic", "gold", "simple"],
  },
  {
    id: "abyss",
    name: "AURUM Abyss",
    nameFa: "آوروم اَبیس",
    ref: "AR-031-BL",
    price: "₠ ۶۲٬۰۰۰",
    image: "/watches/watch-2.png",
    caliber: "اتوماتیک — کالیبر AR-920",
    material: "فولاد ضدزنگ ۹۰۴L",
    diameter: "۴۴ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "اعماق اقیانوس‌ها. مقاوم تا ۶۰۰ متر با بیزل سرامیکی.",
    tags: ["sport", "adventure", "modern", "automatic", "rugged", "steel"],
  },
  {
    id: "chrono",
    name: "AURUM Chrono",
    nameFa: "آوروم کرونو",
    ref: "AR-014-CG",
    price: "₠ ۵۸٬۰۰۰",
    image: "/watches/watch-4.png",
    caliber: "اتوماتیک — کرونوگراف",
    material: "گلد/فولاد دو رنگ",
    diameter: "۴۲ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "کرنوگراف با کالیبر AR-770. دو رنگ، دو روح، یک ساعت.",
    tags: ["sport", "function", "modern", "automatic", "gold", "steel"],
  },
  {
    id: "luna",
    name: "AURUM Luna",
    nameFa: "آوروم لونا",
    ref: "AR-019-WH",
    price: "₠ ۴۲٬۰۰۰",
    image: "/watches/watch-5.png",
    caliber: "کوارتز — کالیبر AR-Q1",
    material: "رُز‌گلد + مروارید",
    diameter: "۳۶ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "صفحه‌ی مروارید مادر، نازک و ظریف. حاصل از همکاری با طراحان مایلان.",
    tags: ["casual", "minimal", "elegant", "modern", "gold", "simple"],
  },
  {
    id: "aviator",
    name: "AURUM Aviator",
    nameFa: "آوروم اَویاتور",
    ref: "AR-022-AV",
    price: "₠ ۵۲٬۰۰۰",
    image: "/watches/watch-6.png",
    caliber: "اتوماتیک — کالیبر AR-660",
    material: "فولاد + سرامیک",
    diameter: "۴۴ میلی‌متر",
    edition: "تولید انبوه محدود",
    description: "اسباب خلبانان. بزرگ، خوانا، جسور با شماره‌های لومینوس.",
    tags: ["sport", "vintage", "function", "automatic", "steel"],
  },
];

export const STYLE_LABELS: Record<string, string> = {
  casual: "روزمره و بی‌تکلف",
  formal: "رسمی و باشکوه",
  sport: "پویا و ماجراجو",
};

export const OCCASION_LABELS: Record<string, string> = {
  daily: "همراهیِ روزانه",
  special: "لحظه‌های خاص",
  adventure: "ماجراجویی‌ها",
};
