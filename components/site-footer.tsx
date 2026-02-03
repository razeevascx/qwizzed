import Link from "next/link";
import GetStarted from "./Get-started";
import Logo from "@/components/Logo";

const productLinks = [
  { name: "Browse Quizzes", href: "/quiz" },
  { name: "Create Quiz", href: "/dashboard/create" },
  { name: "My Quizzes", href: "/dashboard/quizzes" },
  { name: "Analytics", href: "/dashboard/analytics" },
];

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const resourceLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Get Started", href: "/get-started" },
];

export function SiteFooter() {
  return (
    <>
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-4">
                <Logo />
                <span className="font-bold text-xl text-foreground">
                  Qwizzed
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Build engaging quizzes, track performance, and share knowledge
                effortlessly. The modern platform for educators and learners.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {new Date().getFullYear()} Qwizzed. All rights reserved.
              </p>
              <div className="flex gap-6">
                {[...companyLinks, ...productLinks].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <GetStarted />
    </>
  );
}
