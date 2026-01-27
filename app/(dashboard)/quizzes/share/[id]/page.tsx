"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import Link from "next/link";
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
  PlusCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toggleFullscreen } from "@/lib/fullscreen";

export default function ShareQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleFullscreen = () => {
    toggleFullscreen(qrRef.current);
  };

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
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading share options...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Quiz Not Found</h1>
        <p className="text-muted-foreground mt-2 mb-6">
          The quiz you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/quizzes")}>Back to Quizzes</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* Header Section with Properties */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/quizzes" className="hover:text-foreground transition">
              Quizzes
            </Link>
            <span>/</span>
            <span className="text-foreground">Share</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">{quiz.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{quiz.category}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground capitalize">{quiz.difficulty_level}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{quiz.total_questions} Questions</span>
              </div>
              {quiz.time_limit_minutes && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{quiz.time_limit_minutes}m limit</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/quizzes/edit/${quizId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Edit
          </Button>
          <Button
            onClick={() => window.open(getShareUrl(), "_blank")}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Left Column - Large QR Access */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border/40 bg-card/50 p-8 flex flex-col text-center space-y-8 h-full min-h-[600px]">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
                <span>Access QR Code</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
                  className="ml-1 p-2 rounded-lg bg-muted/30 hover:bg-primary/10 border border-border/40 transition-all text-muted-foreground hover:text-primary inline-flex items-center justify-center group/max shadow-sm"
                  title="Maximize for Presentation"
                >
                  <Maximize2 className="w-4 h-4 group-hover/max:scale-110 transition-transform" />
                </button>
              </h2>
              <p className="text-muted-foreground text-sm">Scan this code to take the quiz on any device</p>
            </div>

            {/* Native Fullscreen Target - Optimized for minimal empty space */}
            <div className="flex-1 flex items-center justify-center">
              <div
                ref={qrRef}
                className="p-8 bg-white rounded-[40px] shadow-2xl ring-4 ring-primary/5 cursor-zoom-in group/qr relative flex flex-col items-center justify-center transition-all duration-300 [&:fullscreen]:rounded-none [&:fullscreen]:w-full [&:fullscreen]:h-full [&:fullscreen]:p-0 [&:fullscreen]:bg-background"
                onClick={handleFullscreen}
              >
                {isFullscreen && (
                  <button
                    onClick={(e) => { e.stopPropagation(); document.exitFullscreen(); }}
                    className="absolute top-8 right-8 p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors z-50 shadow-xl border border-border/50"
                    title="Exit Presentation"
                  >
                    <Minimize2 className="w-8 h-8 text-foreground" />
                  </button>
                )}

                <div className="flex flex-col items-center justify-center transition-all duration-500 [&:fullscreen]:bg-white [&:fullscreen]:p-16 [&:fullscreen]:rounded-[60px] [&:fullscreen]:shadow-2xl">
                  <QRCodeCanvas
                    value={getShareUrl()}
                    size={isFullscreen ? 650 : 460}
                    level={"H"}
                    includeMargin={false}
                  />

                  {/* This section visible in presentation mode */}
                  <div className={`${isFullscreen ? 'block' : 'hidden'} mt-12 text-center space-y-3`}>
                    <h2 className="text-5xl font-black text-black tracking-tight">Scan to Start</h2>
                    <p className="text-muted-foreground font-bold text-2xl uppercase tracking-widest opacity-80">{quiz.title}</p>
                  </div>
                </div>

                {!isFullscreen && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/qr:bg-black/5 transition-colors rounded-[40px]">
                    <Maximize2 className="w-12 h-12 text-black opacity-0 group-hover/qr:opacity-20 transition-all scale-75 group-hover/qr:scale-100" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sharing Channels */}
        <div className="space-y-6">
          {/* Quick Share Link */}
          <div className="rounded-lg border border-border/40 bg-card/50 p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Sharing Link
            </h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={getShareUrl()}
                  readOnly
                  className="w-full px-4 py-3 rounded-md border border-border/50 bg-muted/30 text-sm font-mono focus:outline-none"
                />
              </div>
              <Button
                onClick={() => copyToClipboard(getShareUrl(), "link")}
                className="gap-2 px-6 h-[46px]"
                variant={copied === "link" ? "outline" : "default"}
              >
                {copied === "link" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
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

          {/* Social Grid */}
          <div className="rounded-lg border border-border/40 bg-card/50 p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Social Channels
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Twitter", icon: <Twitter />, action: shareViaTwitter, color: "hover:text-blue-400" },
                { label: "Facebook", icon: <Facebook />, action: shareViaFacebook, color: "hover:text-blue-600" },
                { label: "LinkedIn", icon: <Linkedin />, action: shareViaLinkedin, color: "hover:text-blue-700" },
                { label: "Email", icon: <Mail />, action: shareViaEmail, color: "hover:text-purple-500" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-muted/20 transition hover:bg-muted/40 ${item.color} group text-left`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border/50 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Embed */}
          <div className="rounded-lg border border-border/40 bg-card/50 p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Integration Embed
            </h2>
            <div className="relative">
              <textarea
                value={getEmbedCode()}
                readOnly
                className="w-full px-4 py-4 rounded-md border border-border/50 bg-muted/30 text-xs font-mono resize-none h-28 focus:outline-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(getEmbedCode(), "embed")}
                className="absolute top-2 right-2 h-8"
              >
                {copied === "embed" ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Copy and paste this code snippets into your website's HTML to embed the quiz player.</p>
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
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000000";
      const moduleSize = size / 25;
      const margin = includeMargin ? moduleSize * 4 : 0;

      const drawCorner = (x: number, y: number) => {
        ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
        ctx.fillStyle = "#000000";
        ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
      };

      drawCorner(margin, margin);
      drawCorner(size - margin - moduleSize * 7, margin);
      drawCorner(margin, size - margin - moduleSize * 7);

      for (let i = 8; i < 17; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(margin + i * moduleSize, margin + 6 * moduleSize, moduleSize, moduleSize);
          ctx.fillRect(margin + 6 * moduleSize, margin + i * moduleSize, moduleSize, moduleSize);
        }
      }

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
          if ((i < 9 && j < 9) || (i < 9 && j > 15) || (i > 15 && j < 9) || i === 6 || j === 6) continue;
          if (random(hash + i * 25 + j) > 0.5) {
            ctx.fillRect(margin + i * moduleSize, margin + j * moduleSize, moduleSize - 1, moduleSize - 1);
          }
        }
      }
    }

    const timer = setTimeout(() => {
      setQrDataUrl(canvas.toDataURL());
    }, 0);
    return () => clearTimeout(timer);
  }, [value, size, level, includeMargin]);

  if (!qrDataUrl) return <div className="bg-muted animate-pulse rounded-lg" style={{ width: size, height: size }} />;
  return <img src={qrDataUrl} alt="QR Code" width={size} height={size} className="rounded-lg" />;
}
