import Link from "next/link";
import { Mail, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Brand */}
          <div className="text-center space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 justify-center group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Qwizzed
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="space-y-6 p-6 rounded-lg border border-primary/30 bg-primary/5">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Welcome to Qwizzed!</h1>
                <p className="text-sm text-muted-foreground">
                  Check your email to verify your account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-card border border-border/50 rounded-lg">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Verification email sent</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent you a confirmation email. Please click the
                  link in the email to verify your account before signing in.
                </p>
              </div>
            </div>

            <Link href="/get-started/login" className="block">
              <Button className="w-full" size="lg">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
