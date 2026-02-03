import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { FloatingPaths } from "@/components/3d/Floating-path";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 flex-col justify-end p-8 bg-background relative overflow-hidden">
        <FloatingPaths position={1} />

        <div className="flex items-center justify-between relative z-10">
          <Link href="/" className="inline-flex items-center gap-4">
            <div className="w-12 h-12 [&_svg]:w-full [&_svg]:h-full">
              <Logo />
            </div>
            <span className="font-bold text-2xl text-foreground">Qwizzed</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/quiz"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col bg-muted/30">
        <div className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {children}
        </div>
      </div>
    </section>
  );
}
