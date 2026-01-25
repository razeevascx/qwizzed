import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, ArrowRight } from "lucide-react";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function SiteHeader() {
  return (
    <header className="relative border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors duration-200 group"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Qwizzed
          </span>
        </Link>

        {/* Right side navigation */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Auth Button */}
          <Suspense fallback={<div className="h-9 w-24 rounded-md bg-muted" />}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
