import Link from "next/link";
import { BookOpen, Github, Twitter, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-background via-background to-background/95">
      {/* Gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary via-primary to-emerald-500 bg-clip-text text-transparent">
                  Qwizzed
                </span>
                <p className="text-xs text-muted-foreground">Quiz Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Build engaging quizzes, track performance, and share knowledge
              effortlessly. The modern platform for educators and learners.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all group"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all group"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@qwizzed.com"
                className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all group"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-5">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Browse Quizzes", href: "/quizzes" },
                { name: "Create Quiz", href: "/quiz/create" },
                { name: "My Quizzes", href: "/quiz/my-quizzes" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-5">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="my-12 p-6 rounded-xl border border-border/60 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5">
          <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">
                  Ready to create your first quiz?
                </p>
                <p className="text-xs text-muted-foreground">
                  Join thousands of educators today
                </p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 text-primary-foreground whitespace-nowrap"
            >
              <Link href="/quiz/create">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
