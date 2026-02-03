import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import {
  Zap,
  Users,
  Heart,
  Code,
  Target,
  Lightbulb,
  Github,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Qwizzed | Quiz Platform",
  description:
    "Learn about Qwizzed - a modern quiz platform built for educators, teams, and creators.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Fast & Efficient",
      description:
        "Every feature is optimized for speed. Create quizzes in minutes, not hours. Lightning-fast performance that doesn't compromise on power.",
      stat: "< 2s",
      statLabel: "Load time",
    },
    {
      icon: Users,
      title: "User-Focused",
      description:
        "Your feedback drives our roadmap. We listen, iterate, and ship features that matter. Built by understanding real educator needs.",
      stat: "99.9%",
      statLabel: "Satisfaction",
    },
    {
      icon: Heart,
      title: "Quality First",
      description:
        "Reliable infrastructure, thoughtful design, and code that lasts. Enterprise-grade security meets delightful user experience.",
      stat: "100%",
      statLabel: "Uptime SLA",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Cutting-edge web technology meets practical solutions. We push boundaries while keeping the experience intuitive and accessible.",
      stat: "Weekly",
      statLabel: "Updates",
    },
  ];

  const features = [
    {
      icon: Sparkles,
      label: "AI-Powered Insights",
      description: "Smart analytics that help improve your content",
    },
    {
      icon: Shield,
      label: "Enterprise Security",
      description: "Bank-level encryption and compliance",
    },
    {
      icon: Clock,
      label: "Real-time Sync",
      description: "Instant updates across all devices",
    },
    {
      icon: TrendingUp,
      label: "Advanced Analytics",
      description: "Deep insights into learner performance",
    },
  ];

  const techStack = [
    {
      category: "Frontend",
      technologies: [
        { name: "Next.js 16", description: "React framework for production" },
        { name: "React 19", description: "UI library with server components" },
        { name: "TypeScript", description: "Type-safe JavaScript" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework" },
        { name: "Radix UI", description: "Accessible component primitives" },
      ],
    },
    {
      category: "Backend & Infrastructure",
      technologies: [
        { name: "Supabase", description: "Backend-as-a-service platform" },
        { name: "PostgreSQL", description: "Relational database" },
        {
          name: "Authentication",
          description: "Secure user management",
        },
        { name: "Real-time Sync", description: "Live data synchronization" },
        { name: "Edge Functions", description: "Serverless computing" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b border-border/30 py-24 md:py-32 px-6 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <Layout>
            <div className="relative max-w-4xl space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary backdrop-blur-sm">
                <Lightbulb className="w-4 h-4" />
                <span>About Our Mission</span>
              </div>

              {/* Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                  Making assessment{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                      frictionless
                    </span>
                    <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary/10 -z-0 transform -skew-y-1" />
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
                  Qwizzed is built for educators, trainers, and content creators
                  who want to create engaging quizzes without wrestling with
                  complicated tools.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/dashboard/create">
                    <Button size="lg" className="gap-2 h-12 px-6">
                      Create Your First Quiz
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/quiz">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-6 border-2"
                    >
                      Explore Quizzes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Layout>
        </section>

        {/* Mission & Vision - Side by Side */}
        <section className="border-b border-border/30 py-20 px-6">
          <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Mission */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Our Mission
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Empower
                    <br />
                    Assessment
                  </h2>

                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We're democratizing quiz creation. Whether you're a
                    classroom teacher, corporate trainer, or course creator,
                    Qwizzed gives you powerful assessment tools without the
                    bloat.
                  </p>

                  <ul className="space-y-3 pt-2">
                    {[
                      "Create once, share everywhere",
                      "No learning curve required",
                      "Focus on teaching, not tools",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Vision */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Our Vision
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    The Standard
                    <br />
                    Tool
                  </h2>

                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We envision a world where quality assessment is accessible
                    to everyone. Where creating a quiz takes minutes, not hours.
                    Where educators spend less time on tools and more time on
                    impact.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-lg border border-border/60 bg-card/30">
                      <div className="text-3xl font-bold text-primary mb-1">
                        10x
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Faster creation
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border/60 bg-card/30">
                      <div className="text-3xl font-bold text-primary mb-1">
                        100%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Open source
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </section>

        {/* Core Values */}
        <section className="border-b border-border/30 py-20 px-6 bg-gradient-to-b from-background to-muted/20">
          <Layout>
            <div className="space-y-12">
              {/* Section Header */}
              <div className="max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Our Values
                </h2>
                <p className="text-lg text-muted-foreground">
                  The principles that guide everything we build and every
                  decision we make.
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-border/60 p-8 hover:border-primary/40 transition-all duration-300 bg-card/50 backdrop-blur-sm"
                    >
                      {/* Icon & Title */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {value.title}
                            </h3>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-2xl font-bold text-primary">
                                {value.stat}
                              </span>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                {value.statLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>

                      {/* Hover Effect Line */}
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </Layout>
        </section>

        {/* Features Highlight */}
        <section className="border-b border-border/30 py-20 px-6">
          <Layout>
            <div className="space-y-12">
              {/* Section Header */}
              <div className="max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Why Choose Qwizzed?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Powerful features that make assessment simple, fast, and
                  effective.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 p-6 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-card/50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">
                          {feature.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Features List */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {[
                  "Lightning-fast creation",
                  "Mobile-first design",
                  "Real-time analytics",
                  "Instant deployment",
                  "Custom branding",
                  "Team collaboration",
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </Layout>
        </section>

        {/* Tech Stack */}
        <section className="border-b border-border/30 py-20 px-6">
          <Layout>
            <div className="space-y-12">
              {/* Section Header */}
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Technology
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Built With Modern Tech
                </h2>
                <p className="text-lg text-muted-foreground">
                  Industry-leading technologies ensure reliability, performance,
                  and scalability at every level.
                </p>
              </div>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {techStack.map((stack, idx) => (
                  <div
                    key={idx}
                    className="space-y-6 p-8 rounded-xl border border-border/60 bg-card/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <h3 className="text-2xl font-semibold">
                        {stack.category}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {stack.technologies.map((tech, techIdx) => (
                        <div
                          key={techIdx}
                          className="flex items-start gap-3 group"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div className="space-y-1">
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {tech.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Open Source Badge */}
              <div className="flex items-start gap-4 p-6 rounded-xl border-2 border-primary/20 bg-primary/5">
                <Github className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">
                    Open Source & Transparent
                  </h4>
                  <p className="text-muted-foreground">
                    Built on proven open-source technologies. Our commitment to
                    transparency means you can trust the tools powering your
                    assessments.
                  </p>
                  <Link
                    href="https://github.com/razeevascx/qwizzed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="link" className="p-0 h-auto gap-2">
                      View on GitHub
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Layout>
        </section>

        {/* Community Section */}
        <section className="border-b border-border/30 py-20 px-6 bg-gradient-to-b from-background to-primary/5">
          <Layout>
            <div className="space-y-12">
              {/* Section Header */}
              <div className="max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Join Our Community
                </h2>
                <p className="text-lg text-muted-foreground">
                  Connect with educators, trainers, and creators using Qwizzed
                  to transform assessment.
                </p>
              </div>

              {/* Community Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">
                      Built by Developers
                    </h3>
                    <p className="text-primary font-medium">
                      For educators, trainers & creators
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Created with passion by developers who understand the pain
                    points of assessment. Every feature is designed with real
                    educator feedback.
                  </p>
                </div>

                <div className="p-8 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">
                      Open & Transparent
                    </h3>
                    <p className="text-primary font-medium">
                      Powered by open source
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Built on proven technologies: Next.js, React, TypeScript,
                    Supabase, and Tailwind CSS. Transparency at every level.
                  </p>
                </div>
              </div>
            </div>
          </Layout>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <Layout>
            <div className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-12 md:p-16 overflow-hidden">
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="relative max-w-3xl space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl">
                    Join thousands of educators and creators who trust Qwizzed
                    for their assessment needs. Create your first quiz in
                    minutes.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/create">
                    <Button size="lg" className="gap-2 h-12 px-6">
                      Create Your First Quiz
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/quiz">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-6 border-2"
                    >
                      Explore Public Quizzes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Layout>
        </section>

        {/* Contact Section */}
        <section className="border-t border-border/30 py-20 px-6">
          <Layout>
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground">
                  Have questions, feedback, or ideas? We'd love to hear from
                  you. Our team responds to every message.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="mailto:hello@qwizzed.com">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 h-12 px-6 border-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </Button>
                </Link>
                <Link
                  href="https://github.com/razeevascx/qwizzed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 h-12 px-6 border-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </Layout>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
