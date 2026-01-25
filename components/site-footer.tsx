import Link from "next/link";
import { BookOpen, Github, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-background/40">
      {/* Gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Qwizzed
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Create, share, and master quizzes with our modern platform.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm w-full"
            >
              <Link
                href="/quiz/create"
                className="flex items-center gap-1.5 justify-center group"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/quizzes"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Browse Quizzes
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz/create"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Create Quiz
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz/my-quizzes"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  My Quizzes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <p className="text-xs text-muted-foreground">
            © {year} Qwizzed. Built by Rajeev Puri.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              title="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
