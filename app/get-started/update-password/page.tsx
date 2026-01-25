import { UpdatePasswordForm } from "@/components/update-password-form";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Main Content */}
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
            <div>
              <h1 className="text-2xl font-bold mb-1">Create new password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>
          </div>

          {/* Form */}
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
