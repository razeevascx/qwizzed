import CurrentTime from "../CurrentTime";
import Layout from "../layout/Layout";
import { Zap, Share2, BarChart3, Shield } from "lucide-react";

const features = [
  {
    number: "01",
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create and deploy quizzes in seconds with our intuitive interface. No complicated setup or lengthy tutorials required to get started.",
    bgColor: "bg-primary/10",
  },
  {
    number: "02",
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share via link, QR code, or embed anywhere instantly. Your audience can join from any device without downloading apps or creating accounts.",
    bgColor: "bg-accent/20",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track performance and get actionable insights as responses come in. Identify trends, knowledge gaps, and make data-driven decisions instantly.",
    bgColor: "bg-secondary/50",
  },
  {
    number: "04",
    icon: Shield,
    title: "Secure & Private",
    description:
      "Enterprise-grade security with end-to-end encryption. Your data is protected with industry-leading security protocols and compliance standards.",
    bgColor: "bg-muted",
  },
];

const stats = [
  { component: CurrentTime, label: "Current Time" },
  { value: "0.1s", label: "Avg Response Time" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Features() {
  return (
    <section className="border-t border-border/30 py-24 bg-background relative overflow-hidden">
      <Layout className="relative z-10">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          Features
        </h2>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={idx}
                className="group relative backdrop-blur-sm border border-primary/20 p-8 transition-all duration-300 hover:bg-card/80 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Number and Title Row */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-primary text-sm font-mono font-semibold">
                    [{feature.number}]
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                </div>
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        <div className="border-t border-border/30 " />
      </Layout>
    </section>
  );
}
