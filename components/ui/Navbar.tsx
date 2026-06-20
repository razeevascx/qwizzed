import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Logo from "@/components/Logo";
import { Navlinks } from "@/data/Navlink";

function NavLink({
  href,
  label,
}: Readonly<{
  href: string;
  label: string;
  icon?: React.ElementType;
}>) {
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
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <Logo />
            </div>
          </div>
          <span className="bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
            Qwizzed
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center">
          <Suspense fallback={<NavLoadingSkeleton />}>
            <div className="flex items-center gap-1 px-1 py-1 ">
              {Navlinks.map((item) => (
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
