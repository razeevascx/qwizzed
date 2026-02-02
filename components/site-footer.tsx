import Link from "next/link";
import { BookOpen } from "lucide-react";
import GetStarted from "./Get-started";

export function SiteFooter() {
  return (
    <>
      <footer className="relative border-t border-border/40 bg-linear-to-b from-background via-background to-background/95">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 py-16 ">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="font-bold text-xl bg-linear-to-r from-primary via-primary to-emerald-500 bg-clip-text text-transparent">
                    Qwizzed
                  </span>
                  <p className="text-xs text-muted-foreground">Quiz Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Build engaging quizzes, track performance, and share knowledge
                effortlessly. The modern platform for educators and learners.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Browse Quizzes", href: "/quiz" },
                  { name: "Create Quiz", href: "/dashboard/create" },
                  { name: "My Quizzes", href: "/dashboard/quizzes" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group hover:underline"
                    >
                      {link.name}
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
                  { name: "About", href: "/about" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group hover:underline underline-red"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <GetStarted />
    </>
  );
}
