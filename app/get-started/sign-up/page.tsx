import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">
            Join thousands of creators
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Get started
          </h1>
          <p className="text-lg text-muted-foreground max-w-sm">
            Create your free account and start building amazing quizzes today
          </p>
        </div>

        {/* Form */}
        <div className="pt-4">
          <SignUpForm />
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          By creating an account, you agree to{" "}
          <Link
            href="/terms"
            className="underline hover:text-foreground transition-colors"
          >
            Qwizzed's Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
