import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider } from "@/components/convex-provider";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qwizzed | Create and share online quizzes",
    template: "%s | Qwizzed",
  },
  description: "Create, share, and take interactive quizzes with Qwizzed. Build engaging quizzes for learning, teams, and events.",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Qwizzed",
    title: "Qwizzed | Create and share online quizzes",
    description: "Create, share, and take interactive quizzes with Qwizzed. Build engaging quizzes for learning, teams, and events.",
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
    title: "Qwizzed | Create and share online quizzes",
    description: "Create, share, and take interactive quizzes with Qwizzed. Build engaging quizzes for learning, teams, and events.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Qwizzed",
                  url: siteUrl,
                  logo: `${siteUrl}/opengraph-image`,
                },
                {
                  "@type": "WebSite",
                  name: "Qwizzed",
                  url: siteUrl,
                  description: "Create, share, and take interactive quizzes.",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <ClerkProvider
          appearance={{ theme: shadcn }}
          signInUrl="/get-started"
          signUpUrl="/get-started/sign-up"
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
        >
          <ConvexProvider>
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
          </ConvexProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
