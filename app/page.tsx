import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function Home() {
  return (
    <main className="flex flex-col bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative w-full px-4 py-24 md:py-40 overflow-hidden">
        <Layout>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
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
                <Link href="/quiz/create" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-base"
                  >
                    Create Quiz Free <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/quizzes" className="flex-1 sm:flex-none">
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

            {/* Right Image Placeholder */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-primary/10 rounded-2xl" />
              <div className="absolute inset-0 backdrop-blur-sm" />
              <div className="relative h-full flex items-center justify-center p-8">
                <div className="space-y-6 w-full">
                  <div className="bg-card/40 backdrop-blur border border-border/30 rounded-xl p-4 space-y-3">
                    <div className="h-3 bg-primary/20 rounded w-32" />
                    <div className="h-3 bg-primary/15 rounded w-24" />
                  </div>
                  <div className="bg-card/30 backdrop-blur border border-border/30 rounded-xl p-4 space-y-3">
                    <div className="h-3 bg-accent/20 rounded w-28" />
                    <div className="h-3 bg-accent/15 rounded w-20" />
                  </div>
                  <div className="bg-card/40 backdrop-blur border border-border/30 rounded-xl p-4 space-y-3">
                    <div className="h-3 bg-secondary/20 rounded w-32" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border border-border/30 rounded-2xl" />
            </div>
          </div>

          {/* 3-Step Flow - Below Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 mt-16 border-t border-border/30 pt-16">
            {[
              {
                step: 1,
                title: "Create",
                desc: "Build questions in seconds",
                color: "from-primary/20 to-primary/5",
                accent: "bg-primary/10 text-primary",
              },
              {
                step: 2,
                title: "Share",
                desc: "Get instant shareable link",
                color: "from-accent/20 to-accent/5",
                accent: "bg-accent/10 text-accent",
              },
              {
                step: 3,
                title: "Analyze",
                desc: "Track all responses",
                color: "from-secondary/20 to-secondary/5",
                accent: "bg-secondary/10 text-secondary",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative p-6 rounded-xl border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative space-y-4">
                  {/* Step number */}
                  <div
                    className={`w-12 h-12 rounded-full ${item.accent} flex items-center justify-center font-bold text-lg`}
                  >
                    {item.step}
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Arrow indicator */}
                  <div className="pt-2 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Layout>
      </section>

      {/* Feature Showcase with Image */}
      <section className="w-full py-20 md:py-28 px-4 border-t border-border">
        <Layout>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Image */}
            <div className="order-2 md:order-1">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 via-primary/10 to-card border border-border/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="text-center space-y-4 p-8">
                  <div className="flex gap-3 justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Analytics Dashboard
                  </p>
                </div>
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

              <Link href="/quizzes">
                <Button variant="outline" className="gap-2">
                  Explore Quizzes <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Layout>
      </section>

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
                  intuitive editor handles all question types and automatically
                  grades responses.
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

              <Link href="/quiz/create">
                <Button className="gap-2">
                  Start Creating <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div>
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/20 via-primary/10 to-card border border-border/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="text-center space-y-4 p-8">
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/30 rounded w-24 mx-auto" />
                    <div className="h-3 bg-primary/20 rounded w-32 mx-auto" />
                  </div>
                  <p className="text-muted-foreground text-sm">Quiz Editor</p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </section>
    </main>
  );
}
