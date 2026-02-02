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
        "We believe great tools should be quick to use and learn. Every feature is optimized for speed.",
    },
    {
      icon: Users,
      title: "User-Focused",
      description:
        "Your feedback drives our roadmap. We listen, iterate, and ship features that matter to you.",
    },
    {
      icon: Heart,
      title: "Quality First",
      description:
        "We invest in reliable infrastructure, thoughtful design, and code that lasts.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We stay on the cutting edge of web technology to bring you the best experience.",
    },
  ];

  const teamMembers = [
    {
      name: "Built by developers",
      role: "For educators, trainers & creators",
      description:
        "Created with passion by developers who understand the pain points of assessment.",
    },
    {
      name: "Open & Transparent",
      role: "Powered by open source",
      description:
        "Built on proven technologies: Next.js, React, TypeScript, Supabase, and Tailwind CSS.",
    },
  ];

  const features = [
    "⚡ Lightning-fast quiz creation",
    "🎨 Modern, responsive design",
    "📊 Real-time analytics",
    "🔒 Enterprise-grade security",
    "🚀 Instant deployment",
    "📱 Mobile-first experience",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border/30 py-20 px-6 bg-gradient-to-b from-primary/5 via-background to-background">
          <Layout>
            <div className="max-w-3xl space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary">
                  <Lightbulb className="w-4 h-4" />
                  About Our Mission
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                  Making assessment{" "}
                  <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                    frictionless
                  </span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Qwizzed is built for educators, trainers, and content creators
                who want to create engaging quizzes without wrestling with
                complicated tools. We handle the technical complexity so you can
                focus on teaching and learning.
              </p>
            </div>
          </Layout>
        </section>

        <section className="border-b border-border/30 py-16 px-6">
          <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Our Mission
                  </span>
                </div>
                <h2 className="text-3xl font-bold">Empower Assessment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We're on a mission to democratize quiz creation. Whether
                  you're a classroom teacher, corporate trainer, or course
                  creator, Qwizzed gives you powerful assessment tools without
                  the bloat. Create once, share everywhere.
                </p>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Our Vision
                  </span>
                </div>
                <h2 className="text-3xl font-bold">The Standard Tool</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We envision a world where quality assessment is accessible to
                  everyone. Where creating a quiz takes minutes, not hours.
                  Where educators spend less time on tools and more time on
                  impact.
                </p>
              </div>
            </div>
          </Layout>
        </section>

        <section className="border-b border-border/30 py-16 px-6">
          <Layout>
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2">Our Values</h2>
              <p className="text-muted-foreground">
                What guides us in everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-lg border border-border/60 p-6 hover:border-primary/40 hover:bg-card/50 transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 mb-4 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Layout>
        </section>

        <section className="border-b border-border/30 py-16 px-6">
          <Layout>
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2">
                Built With Modern Tech
              </h2>
              <p className="text-muted-foreground">
                We use industry-leading technologies to ensure reliability and
                performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Frontend</h3>
                <ul className="space-y-3">
                  {[
                    "Next.js 16",
                    "React 19",
                    "TypeScript",
                    "Tailwind CSS",
                    "Radix UI",
                  ].map((tech, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Backend & Services</h3>
                <ul className="space-y-3">
                  {[
                    "Supabase",
                    "PostgreSQL",
                    "Authentication",
                    "Real-time Sync",
                    "Edge Functions",
                  ].map((tech, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Layout>
        </section>

        <section className="border-b border-border/30 py-16 px-6">
          <Layout>
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2">Why Choose Qwizzed?</h2>
              <p className="text-muted-foreground">
                Features that make assessment simple and powerful
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/60 p-4 hover:border-primary/40 hover:bg-card/50 transition-all duration-300"
                >
                  <p className="text-sm font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </Layout>
        </section>

        <section className="border-b border-border/30 py-16 px-6">
          <Layout>
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2">Join Our Community</h2>
              <p className="text-muted-foreground">
                Connect with educators, trainers, and creators using Qwizzed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/60 p-6 hover:border-primary/40 hover:bg-card/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </Layout>
        </section>

        <section className="border-b border-border/30 py-16 px-6 bg-gradient-to-b from-background to-primary/5">
          <Layout>
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of educators and creators who trust Qwizzed for
                  their assessment needs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/create">
                  <Button size="lg" className="gap-2">
                    Create Your First Quiz
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button size="lg" variant="outline">
                    Explore Public Quizzes
                  </Button>
                </Link>
              </div>
            </div>
          </Layout>
        </section>

        <section className="py-16 px-6">
          <Layout>
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Have questions or feedback? We'd love to hear from you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="mailto:hello@qwizzed.com">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email Us
                  </Button>
                </Link>
                <Link
                  href="https://github.com/razeevascx/qwizzed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="gap-2">
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
