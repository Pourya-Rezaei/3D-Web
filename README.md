# AURUM — Maison Horlogère

وب‌سایت پرزنت لوکس برای برند ساعت‌سازی خیالی «AURUM» با سه تجربهٔ تعاملی غوطه‌ورکننده. رابط کاربری فارسی و راست‌چین (RTL)، تم مشکی/طلایی، و مدل‌های سه‌بعدی ساعت که کاملاً به‌صورت هندسی (بدون فایل خارجی) ساخته شده‌اند.

- **تجربهٔ سینمایی** (`/cinematic`) — داستان تعاملی ۶ فصلی با GSAP، صدا و letterbox سینمایی.
- **کنسیرج شخصی‌سازی** (`/experience`) — کوئیز ۵ سؤالی شخصیت → توصیهٔ ساعت بر اساس منطق محلی.
- **کالبدشکافی مکانیزم** (`/movement`) — نمای انفجاری ۷ لایهٔ مکانیزم ساعت با جریان انرژی زنده.

## استک تکنولوژی

| حوزه | ابزار |
|---|---|
| فریم‌ورک | Next.js 16 (App Router) · React 19 · TypeScript 5 |
| استایل | Tailwind CSS v4 · shadcn/ui (فقط toast) · tw-animate-css |
| سه‌بعدی | Three.js · @react-three/fiber · drei · postprocessing · Babylon.js |
| انیمیشن | Framer Motion · GSAP (ScrollTrigger) |
| تست | `node:test` داخلی Node.js (بدون وابستگی اضافه) |
| زبان | فارسی (فونت وزیرمتن) + متن‌های تزئینی انگلیسی |

## پیش‌نیازها

- Node.js **20+** (تست‌ها با type-stripping داخلی Node 22.6+ اجرا می‌شوند؛ Node 24 توصیه می‌شود)
- [bun](https://bun.sh) برای نصب وابستگی‌ها و اجرای production (`bun.lock` منبع حقیقت است)

## راه‌اندازی

```bash
# نصب وابستگی‌ها
bun install

# اجرای سرور توسعه
bun run dev            # http://localhost:3000
```

## اسکریپت‌ها

| دستور | کار |
|---|---|
| `bun run dev` | سرور توسعه روی پورت 3000 (خروجی در `dev.log`) |
| `bun run build` | بیلد production + کپی خروجی standalone و `public` |
| `bun run start` | اجرای خروجی standalone در حالت production |
| `bun test` | اجرای تست‌های واحد (`src/**/*.test.ts`) |
| `bun run lint` | ESLint روی کل پروژه |

## API

| اندپوینت | متد | توضیح |
|---|---|---|
| `/api` | GET | health check — `{ message: "Hello, world!" }` |
| `/api/concierge` | POST | بدنه: `{ answers: { style, occasion, material, function, era } }` → `{ recommendation, alternative, narrative, quizAnswers }` |

توصیهٔ کنسیرج کاملاً **محلی** است (هیچ سرویس هوش مصنوعی خارجی ندارد): کاتالوگ ساعت‌ها امتیازدهی می‌شود و روایت به زبان فارسی تولید می‌گردد.

## ساختار پروژه

```
src/
├─ app/
│  ├─ api/
│  │  ├─ route.ts               # GET /api — health check
│  │  └─ concierge/route.ts     # POST /api/concierge (آداپتور نازک HTTP)
│  ├─ page.tsx                  # صفحهٔ اصلی
│  ├─ experience/               # کوئیز شخصیت + توصیه
│  ├─ cinematic/                # تجربهٔ سینمایی ۶ فصلی
│  ├─ movement/                 # کالبدشکافی مکانیزم
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ three/                    # مدل‌های 3D هندسی (WatchModelV2, MovementModel)
│  ├─ sections/                 # سکشن‌ها، بنرها و فصل‌های سینمایی
│  ├─ ui/                       # کامپوننت‌های shadcn استفاده‌شده (فقط toast/toaster)
│  ├─ CustomCursor.tsx
│  ├─ AudioProvider.tsx
│  └─ PageTransition.tsx
├─ hooks/
│  └─ use-toast.ts
└─ lib/
   ├─ watches.ts                # دادهٔ کاتالوگ + تایپ‌های مشترک (منبع واحد حقیقت)
   ├─ concierge.ts              # منطق خالص امتیازدهی/توصیه/روایت
   ├─ concierge.test.ts         # تست واحد منطق توصیه
   ├─ useTypewriter.ts
   ├─ useGsap.ts
   ├─ useAudioEngine.ts
   └─ utils.ts
```

## معماری کد

منطق توصیه به‌صورت **سه‌لایه** جدا شده است تا قابل تست و قابل جایگزینی باشد:

1. **داده** — `src/lib/watches.ts`: کاتالوگ ساعت‌ها و تایپ‌های `Watch`/`QuizAnswers`. اگر بعداً دیتا از دیتابیس یا CMS بیاید، فقط همین فایل عوض می‌شود.
2. **منطق** — `src/lib/concierge.ts`: توابع خالص `scoreWatch`، `recommend` و `buildNarrative` بدون هیچ وابستگی به HTTP یا React.
3. **HTTP** — `src/app/api/concierge/route.ts`: فقط پارس بدنهٔ درخواست و برگرداندن نتیجهٔ `recommend()`.

بخش‌های سنگین صفحهٔ اصلی (سکشن‌های پایین صفحه و Babylon.js) با `next/dynamic` به‌صورت code-split بارگذاری می‌شوند تا بار اولیهٔ موبایل سبک بماند.

## استقرار (Deployment)

بیلد، خروجی **standalone** تولید می‌کند:

```bash
bun run build
bun run start    # NODE_ENV=production bun .next/standalone/server.js
```

اسکریپت‌های `.zscripts/` برای استقرار روی پلتفرم (شامل `build.sh`، `start.sh` و runtime پایتون) آماده شده‌اند. پورت‌ها: Next روی 3000 و Caddy روی 81 (پروکسی معکوس).

## نکته‌ها

- **بدون هوش مصنوعی:** این پروژه هیچ سرویس AI خارجی ندارد؛ توصیهٔ کنسیرج کاملاً لوکال است.
- **مدیر بسته:** فقط `bun.lock` استفاده می‌شود. اگر وابستگی‌ها را دستی تغییر دادید، یک‌بار `bun install` بزنید تا `node_modules` و lockfile همگام شوند.
- **تست‌ها:** بدون نصب هیچ فریم‌ورکی اجرا می‌شوند (`node --test` + type-stripping داخلی Node).