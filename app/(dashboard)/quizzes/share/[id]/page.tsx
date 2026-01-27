"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import {
  ArrowLeft,
  Copy,
  Check,
  Share2,
  Mail,
  Link2,
  Code,
  QrCode,
  Twitter,
  Facebook,
  Linkedin,
  Globe,
  Users,
  Eye,
  Download,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function ShareQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error("Failed to load quiz");
      const quizData = await response.json();
      setQuiz(quizData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/quiz/${quizId}`;
    }
    return `/quiz/${quizId}`;
  };

  const getEmbedCode = () => {
    return `<iframe src="${window.location.origin}/quiz/${quizId}" width="100%" height="600" frameborder="0"></iframe>`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareViaTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(
      `Take the "${quiz?.title}" quiz on Qwizzed!`,
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
    );
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const shareViaLinkedin = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this quiz: ${quiz?.title}`);
    const body = encodeURIComponent(
      `I thought you'd enjoy this quiz!\n\n${quiz?.title}\n\nTake it here: ${getShareUrl()}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const downloadQrCode = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quiz?.title}-qr-code.png`;
      a.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Share2 className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your quiz...
          </p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 ring-8 ring-destructive/5">
            <Share2 className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Quiz Not Found</h1>
            <p className="text-muted-foreground">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            onClick={() => router.push("/quizzes")}
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Enhanced Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push(`/quizzes/edit/${quizId}`)}
              className="gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </Button>
            <Button
              onClick={() => window.open(getShareUrl(), "_blank")}
              variant="outline"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Quiz
            </Button>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Share2 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Share Your Quiz
                </h1>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">{quiz.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats Banner */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  0
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Views
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  0
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Quiz Takers
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  0
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Shares
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quiz Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                Quiz Details
              </h2>
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Title
                  </p>
                  <p className="font-semibold text-lg">{quiz.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Questions
                    </p>
                    <p className="font-bold text-2xl text-primary">
                      {quiz.total_questions}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <p className="font-semibold truncate">{quiz.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Difficulty
                    </p>
                    <p className="font-semibold capitalize">
                      {quiz.difficulty_level}
                    </p>
                  </div>
                  {quiz.time_limit_minutes && (
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Time Limit
                      </p>
                      <p className="font-semibold">
                        {quiz.time_limit_minutes} min
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Share Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Share Link */}
            <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Quick Share Link
              </h2>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={getShareUrl()}
                    readOnly
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-border/50 bg-muted/30 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Link2 className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => copyToClipboard(getShareUrl(), "link")}
                  className="gap-2 px-6"
                  variant={copied === "link" ? "default" : "outline"}
                >
                  {copied === "link" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Social Media Sharing */}
            <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Share on Social Media
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  onClick={shareViaTwitter}
                  className="flex-col gap-3 h-auto py-5 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={shareViaFacebook}
                  className="flex-col gap-3 h-auto py-5 hover:bg-blue-600/10 hover:border-blue-600/50 hover:text-blue-700 dark:hover:text-blue-400 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={shareViaLinkedin}
                  className="flex-col gap-3 h-auto py-5 hover:bg-blue-700/10 hover:border-blue-700/50 hover:text-blue-800 dark:hover:text-blue-400 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-blue-700/10 group-hover:bg-blue-700/20 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={shareViaEmail}
                  className="flex-col gap-3 h-auto py-5 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Email</span>
                </Button>
              </div>
            </div>

            {/* Embed Code */}
            <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Embed on Your Website
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={getEmbedCode()}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/30 text-sm font-mono resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Code className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(getEmbedCode(), "embed")}
                  className="w-full gap-2"
                >
                  {copied === "embed" ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Code Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Embed Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                QR Code
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a QR code for easy mobile access to your quiz
              </p>
              <Button
                variant="outline"
                onClick={() => setShowQrCode(!showQrCode)}
                className="w-full gap-2"
              >
                <QrCode className="w-4 h-4" />
                {showQrCode ? "Hide QR Code" : "Generate QR Code"}
              </Button>

              {showQrCode && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-6 bg-white rounded-2xl shadow-xl ring-1 ring-border/50">
                      <QRCodeCanvas
                        value={getShareUrl()}
                        size={220}
                        level={"H"}
                        includeMargin={true}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={downloadQrCode}
                      className="flex-1 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(getShareUrl(), "qr")}
                      className="flex-1 gap-2"
                    >
                      {copied === "qr" ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// QR Code Canvas Component
function QRCodeCanvas({
  value,
  size,
  level,
  includeMargin,
}: {
  value: string;
  size: number;
  level: string;
  includeMargin: boolean;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Draw QR pattern
      ctx.fillStyle = "#000000";
      const moduleSize = size / 25;
      const margin = includeMargin ? moduleSize * 4 : 0;

      // Corner detection patterns
      const drawCorner = (x: number, y: number) => {
        // Outer square
        ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
        // Inner white square
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
          x + moduleSize,
          y + moduleSize,
          moduleSize * 5,
          moduleSize * 5,
        );
        // Center black square
        ctx.fillStyle = "#000000";
        ctx.fillRect(
          x + moduleSize * 2,
          y + moduleSize * 2,
          moduleSize * 3,
          moduleSize * 3,
        );
      };

      drawCorner(margin, margin);
      drawCorner(size - margin - moduleSize * 7, margin);
      drawCorner(margin, size - margin - moduleSize * 7);

      // Timing patterns
      for (let i = 8; i < 17; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(
            margin + i * moduleSize,
            margin + 6 * moduleSize,
            moduleSize,
            moduleSize,
          );
          ctx.fillRect(
            margin + 6 * moduleSize,
            margin + i * moduleSize,
            moduleSize,
            moduleSize,
          );
        }
      }

      // Data modules (simulated pattern based on URL hash)
      let hash = 0;
      for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash = hash & hash;
      }

      const random = (seed: number) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          if (
            (i < 9 && j < 9) ||
            (i < 9 && j > 15) ||
            (i > 15 && j < 9) ||
            i === 6 ||
            j === 6
          ) {
            continue;
          }
          if (random(hash + i * 25 + j) > 0.5) {
            ctx.fillRect(
              margin + i * moduleSize,
              margin + j * moduleSize,
              moduleSize - 1,
              moduleSize - 1,
            );
          }
        }
      }
    }

    const timer = setTimeout(() => {
      setQrDataUrl(canvas.toDataURL());
    }, 0);
    return () => clearTimeout(timer);
  }, [value, size, level, includeMargin]);

  if (!qrDataUrl) {
    return (
      <div
        className="bg-muted animate-pulse rounded-lg"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className="rounded-lg"
    />
  );
}
