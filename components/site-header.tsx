import Link from "next/link";
import { Suspense } from "react";
import {
  BookOpen,
  LayoutGrid,
  List,
  Trophy,
  Plus,
  BarChart3,
} from "lucide-react";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

const navItems = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/quiz", label: "Explore", icon: List },
  { href: "/privacy", label: "Privacy", icon: LayoutGrid },
  { href: "/term", label: "Term", icon: Plus },
];

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm  text-muted-foreground hover:text-foreground hover:underline font-bold transition-all duration-200"
    >
      <span>{label}</span>
    </Link>
  );
}

function NavLoadingSkeleton() {
  return (
    <div className="hidden md:flex items-center gap-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-9 w-20 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl transition-all duration-300 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 border border-primary/20 group-hover:border-primary/30 transition-all duration-300">
              <BookOpen className="h-5 w-5 text-primary relative z-10" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
            Qwizzed
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center">
          <Suspense fallback={<NavLoadingSkeleton />}>
            <div className="flex items-center gap-1 px-1 py-1 ">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>
          </Suspense>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="relative hidden sm:block">
            <ThemeSwitcher />
            <div className="absolute inset-0 -z-10 bg-primary/20 blur-lg rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Auth Button */}
          <Suspense
            fallback={
              <div className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
            }
          >
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
