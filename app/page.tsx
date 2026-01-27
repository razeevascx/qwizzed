import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Share2, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col bg-background text-foreground">
        {/* Hero Section with Image */}
        <Layout className="relative w-full  md:py-40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm w-fit hover:border-border transition-colors">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  The easiest way to create quizzes
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[1.1]">
                  Create{" "}
                  <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative">
                    Quizzes
                  </span>
                  <br />
                  <span className="text-foreground">That Engage</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Build interactive quizzes in minutes. Share with a link. Track
                  results instantly. Perfect for teachers, trainers, and teams.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/dashboard/create" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-base"
                  >
                    Create Quiz Free <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/quiz" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base"
                  >
                    See Examples
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/15">
              <Image
                src="/quzi-collection.png"
                alt="Quiz sharing preview"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 90vw"
              />
            </div>
          </div>

          {/* 3-Step Flow - Below Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-16 border-t border-border/30 pt-16">
            {[
              {
                title: "Design in minutes",
                desc: "Draft questions, add options, and set scoring rules without leaving the canvas.",
                color: "from-primary/25 via-primary/10 to-transparent",
                iconBg: "bg-primary/10 text-primary",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                title: "Publish & invite",
                desc: "Generate share links or email invites. No login required for takers.",
                color: "from-accent/25 via-accent/10 to-transparent",
                iconBg: "bg-accent/10 text-accent",
                icon: <Share2 className="w-5 h-5" />,
              },
              {
                title: "See results live",
                desc: "Monitor submissions, scores, and completion times with real-time charts.",
                color: "from-secondary/25 via-secondary/10 to-transparent",
                iconBg: "bg-secondary/10 text-secondary",
                icon: <BarChart3 className="w-5 h-5" />,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative p-5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

                <div className="relative flex flex-col gap-3">
                  <div
                    className={`w-11 h-11 rounded-full border border-border/50 flex items-center justify-center ${item.iconBg} shadow-inner`}
                  >
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Layout>

        {/* Feature Showcase with Image */}
        <Layout className="py-20 md:py-28 px-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Image */}
            <div className="order-2 md:order-1">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden border border-border/40 bg-card">
                <Image
                  src="/quzi-collection.png"
                  alt="Quiz collection preview"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 45vw, 90vw"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 md:order-2 space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-4">Share & Collaborate</h2>
                <p className="text-lg text-muted-foreground">
                  Publish quizzes instantly with shareable links. Your audience
                  can take quizzes without signup. Track every submission and
                  response in real-time.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  "One-click publishing with instant sharing",
                  "Real-time submission tracking",
                  "Detailed performance analytics",
                  "Export results and reports",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold">✓</span>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard/quizzes">
                <Button variant="outline" className="gap-2">
                  Explore Quizzes <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Layout>

        {/* Second Feature with Image */}
        <section className="w-full py-20 md:py-28 px-4 bg-muted/30 border-t border-border">
          <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold mb-4">Simple & Powerful</h2>
                  <p className="text-lg text-muted-foreground">
                    Create beautiful quizzes without technical knowledge. Our
                    intuitive editor handles all question types and
                    automatically grades responses.
                  </p>
                </div>

                <ul className="space-y-4">
                  {[
                    "Drag-and-drop question builder",
                    "Multiple choice, true/false, and short answers",
                    "Automatic scoring and feedback",
                    "Customize branding and colors",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold">✓</span>
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard/create">
                  <Button className="gap-2">
                    Start Creating <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Right Image */}
              <div>
                <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden border border-border/40 bg-card">
                  <Image
                    src="/quiz-editor.png"
                    alt="Quiz editor preview"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 45vw, 90vw"
                  />
                </div>
              </div>
            </div>
          </Layout>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
