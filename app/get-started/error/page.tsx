import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="w-full p-6 border-b border-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

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

          {/* Error Card */}
          <div className="space-y-6 p-6 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-sm text-muted-foreground">
                  We encountered an error processing your request
                </p>
              </div>
            </div>

            {params?.error && (
              <div className="p-4 bg-card border border-border/50 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {params.error}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Link href="/get-started/login" className="block">
                <Button className="w-full">Try Again</Button>
              </Link>
              <Link href="/" className="block">
                <Button className="w-full" variant="outline">
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
