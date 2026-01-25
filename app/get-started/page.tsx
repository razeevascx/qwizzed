import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Zap,
  BarChart3,
  Share2,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back Home</span>
          </Link>

          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Secure Login
              </span>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
                Welcome back
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Sign in to your account and start creating amazing quizzes
              </p>
            </div>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer */}
          <div className="text-center space-y-3 pt-4">
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
              <div className="h-px bg-border/50 flex-1" />
              <span>New here?</span>
              <div className="h-px bg-border/50 flex-1" />
            </div>
            <Link
              href="/get-started/sign-up"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create an account
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center px-8 py-12 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 max-w-lg space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Create Quizzes That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-emerald-500">
                Engage
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Build, share, and track quizzes with our modern platform designed
              for educators and learners.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: Zap,
                title: "Quick Setup",
                description: "Start in seconds",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Track progress",
              },
              {
                icon: Share2,
                title: "Easy Share",
                description: "With anyone",
              },
              {
                icon: CheckCircle2,
                title: "Multiple Types",
                description: "Questions",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur hover:bg-card/60 hover:border-primary/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { number: "1000+", label: "Quizzes Created" },
              { number: "50K+", label: "Students Helped" },
              { number: "98%", label: "Happy Users" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                  {stat.number}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm space-y-4 relative overflow-hidden group hover:border-primary/30 transition-all">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
              "
            </div>

            <blockquote className="text-base font-medium text-foreground leading-relaxed">
              "Qwizzed transformed how we conduct assessments. It's intuitive,
              powerful, and our students actually enjoy taking quizzes!"
            </blockquote>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                RP
              </div>
              <div>
                <p className="font-semibold text-sm">Rajeev Puri</p>
                <p className="text-xs text-muted-foreground">
                  Founder & Creator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
