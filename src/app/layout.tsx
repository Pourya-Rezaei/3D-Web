import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AURUM — ساعت‌سازی لوکس | کالای زمان",
  description:
    "AURUM، برند لوکس ساعت‌سازی. تلفیق هنر سنتی ساعت‌سازی سوئیسی با تکنولوژی روز. ساعت‌های شیک، مکانیزم‌های دقیق، طراحی بی‌بدیل.",
  keywords: ["ساعت لوکس", "AURUM", "ساعت مچی", "ساعت سوئیسی", "توربیون", "کرنوگراف"],
  authors: [{ name: "AURUM Atelier" }],
  openGraph: {
    title: "AURUM — ساعت‌سازی لوکس",
    description: "تلفیق هنر و تکنولوژی در ساعت‌سازی",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${vazirmatn.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
