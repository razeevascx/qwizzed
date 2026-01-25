import Link from "next/link";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-emerald-500/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-emerald-500/20 border border-primary/30">
              <CheckCircle className="w-10 h-10 text-primary animate-in zoom-in duration-500" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Account created!
          </h1>
          <p className="text-lg text-muted-foreground">
            We've sent you a verification email
          </p>
        </div>

        {/* Email Notification */}
        <div className="flex items-start gap-4 p-4 bg-background/50 border border-border/60 rounded-lg hover:border-border/80 transition-colors">
          <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div className="space-y-2">
            <p className="font-semibold text-sm">Check your inbox</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click the confirmation link in the email we sent you to activate
              your account and get started creating quizzes.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 pt-2">
          <Link href="/get-started" className="block">
            <Button
              size="lg"
              className="w-full h-11 bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 text-primary-foreground font-semibold rounded-lg transition-all duration-200 group"
            >
              Back to Login
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground text-center">
            Didn't receive an email?{" "}
            <Link
              href="/"
              className="underline hover:text-foreground transition-colors"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
