import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Qwizzed - Quiz Platform",
  description: "Create, share, and take interactive quizzes with Qwizzed",
  applicationName: "Qwizzed",
  keywords: [
    "quiz platform",
    "online quizzes",
    "create quizzes",
    "interactive learning",
    "knowledge tests",
    "education",
    "Qwizzed",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Qwizzed",
    title: "Qwizzed - Quiz Platform",
    description: "Create, share, and take interactive quizzes with Qwizzed",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Qwizzed - Quiz Platform",
      },
    ],
  },
  authors: [
    {
      name: "Rajeev Puri",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Qwizzed - Quiz Platform",
    description: "Create, share, and take interactive quizzes with Qwizzed",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased bg-background text-foreground `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
