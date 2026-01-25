"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2, Check } from "lucide-react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const passwordLongEnough = password.length >= 8;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create new password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your new password below to complete the reset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-4">
              {error && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a new password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
                {password.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordLongEnough ? (
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                    )}
                    <span
                      className={
                        passwordLongEnough
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat your new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordsMatch ? (
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                    )}
                    <span
                      className={
                        passwordsMatch
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords don't match"}
                    </span>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={isLoading || !passwordsMatch || !passwordLongEnough}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
