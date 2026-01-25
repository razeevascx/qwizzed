import { BarChart3, Share2, Zap, CheckCircle2 } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex h-screen">
      {/* Left Side - Decorative */}
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
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
        {children}
      </div>
    </section>
  );
}
