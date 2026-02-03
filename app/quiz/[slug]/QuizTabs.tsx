"use client";

import { useState } from "react";
import { QuizLeaderboard } from "@/components/quiz-leaderboard";
import { QuizQrDisplay } from "@/components/quiz-qr-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Share2, Copy, Check, QrCode } from "lucide-react";

interface QuizTabsProps {
  slug: string;
  quizId: string;
  quizTitle: string;
  organizerName?: string | null;
}

export function QuizTabs({
  slug,
  quizId,
  quizTitle,
  organizerName,
}: QuizTabsProps) {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "share">(
    "leaderboard",
  );
  const [copied, setCopied] = useState(false);

  const quizUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz/${slug}`
      : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Take the "${quizTitle}" quiz on Qwizzed!`);
    const url = encodeURIComponent(quizUrl);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
    );
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(quizUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const shareViaLinkedin = () => {
    const url = encodeURIComponent(quizUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 border-b border-border">
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "leaderboard"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("share")}
          className={`flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "share"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Share2 className="w-4 h-4" />
          Share Quiz
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "leaderboard" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Top Performers</h2>
            <QuizLeaderboard quizSlug={slug} limit={100} />
          </div>
        )}

        {activeTab === "share" && (
          <div className="space-y-6">
            {/* QR Code - Full Width Top */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">QR Code</h3>
                  <p className="text-xs text-muted-foreground">
                    Scan to access instantly
                  </p>
                </div>
              </div>
              <QuizQrDisplay
                url={quizUrl}
                title={quizTitle}
                organizerName={organizerName}
              />
            </div>

            {/* Bottom Row - Quick Share & Social Media */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Share Link */}
              <div className="border border-border rounded-lg p-6 space-y-4 bg-card">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Share</h3>
                    <p className="text-xs text-muted-foreground">
                      Copy and share the quiz link
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={quizUrl}
                    readOnly
                    className="flex-1 font-mono text-sm bg-muted/50"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant={copied ? "outline" : "default"}
                    size="lg"
                    className="min-w-28"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Social Media */}
              <div className="border border-border rounded-lg p-6 space-y-4 bg-card">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Social Media</h3>
                    <p className="text-xs text-muted-foreground">
                      Share on your favorite platforms
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={shareViaTwitter}
                    variant="outline"
                    size="lg"
                    className="flex-col h-auto py-4 gap-2 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2] transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-xs font-medium">Twitter</span>
                  </Button>
                  <Button
                    onClick={shareViaFacebook}
                    variant="outline"
                    size="lg"
                    className="flex-col h-auto py-4 gap-2 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50 hover:text-[#1877F2] transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-xs font-medium">Facebook</span>
                  </Button>
                  <Button
                    onClick={shareViaLinkedin}
                    variant="outline"
                    size="lg"
                    className="flex-col h-auto py-4 gap-2 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/50 hover:text-[#0A66C2] transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-xs font-medium">LinkedIn</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
