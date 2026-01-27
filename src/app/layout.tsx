import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

// Configure Kanit font with multiple weights for versatility
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

// SEO Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: "Hongson e-Learning - คลังความรู้ดิจิทัล",
    template: "%s | Hongson e-Learning",
  },
  description:
    "แหล่งรวมสื่อการสอนและบทเรียนออนไลน์สำหรับครูและนักเรียน",
  keywords: [
    "e-learning",
    "online courses",
    "hongson e-learning",
    "knowledge repository",
    "digital library",
    "ห้องสอนศึกษา",
    "สื่อการสอน",
    "บทเรียนออนไลน์",
    "ครู",
    "นักเรียน",
  ],
  authors: [{ name: "COOLNUT Academy", url: "https://coolnut.academy" }],
  creator: "COOLNUT Academy",
  publisher: "COOLNUT Academy",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "x", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hongson e-Learning - คลังความรู้ดิจิทัล",
    description: "คลังความรู้และสื่อการสอนดิจิทัลสำหรับครูและนักเรียน",
    type: "website",
    locale: "th_TH",
    siteName: "Hongson e-Learning",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hongson e-Learning - Digital Knowledge Repository",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hongson e-Learning - คลังความรู้ดิจิทัล",
    description: "คลังความรู้และสื่อการสอนดิจิทัลสำหรับครูและนักเรียน",
    images: ["/og-image.png"],
  },
};

// Viewport Configuration (separated from metadata in Next.js 13+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={kanit.variable}>
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className="font-kanit antialiased">
        {/* Liquid Glass Background - iOS 26 Style */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-cyan-50/50 to-purple-50/60" />

          {/* Animated Liquid Orbs for Depth - Green Theme */}
          <div
            className="liquid-orb absolute -left-[20%] top-[10%] w-[50%] h-[50%]"
            style={{
              animationDelay: '0s',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)' // Emerald
            }}
          />
          <div
            className="liquid-orb absolute -right-[15%] top-[30%] w-[45%] h-[45%]"
            style={{
              animationDelay: '-4s',
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, transparent 70%)' // Emerald-400
            }}
          />
          <div
            className="liquid-orb absolute left-[30%] -bottom-[20%] w-[40%] h-[40%]"
            style={{
              animationDelay: '-7s',
              background: 'radial-gradient(circle, rgba(110, 231, 183, 0.3) 0%, transparent 70%)' // Emerald-300
            }}
          />
          <div
            className="liquid-orb absolute right-[20%] top-[60%] w-[35%] h-[35%] opacity-30"
            style={{
              animationDelay: '-2s',
              background: 'radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, transparent 70%)' // Emerald-200
            }}
          />

          {/* Subtle Noise Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
