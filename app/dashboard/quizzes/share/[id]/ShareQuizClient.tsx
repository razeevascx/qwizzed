"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/lib/types/quiz";
import Link from "next/link";
import {
  Copy,
  Check,
  Mail,
  Link2,
  Code,
  Twitter,
  Facebook,
  Linkedin,
  Globe,
  Users,
  Eye,
  TrendingUp,
  PlusCircle,
} from "lucide-react";
import { QuizQrDisplay } from "@/components/quiz-qr-display";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ShareQuizClient() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quiz/${quizId}`);
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
        <Button onClick={() => router.push("/dashboard/quizzes")}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/quizzes">
              My Quizzes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Share</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section with Properties */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">{quiz.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">
                  {quiz.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground capitalize">
                  {quiz.difficulty_level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">
                  {quiz.total_questions} Questions
                </span>
              </div>
              {quiz.time_limit_minutes && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">
                    {quiz.time_limit_minutes}m limit
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/quizzes/edit/${quizId}`)}
          >
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
          <QuizQrDisplay
            url={getShareUrl()}
            title={quiz?.title}
            organizerName={quiz?.organizer_name}
          />
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
                {
                  label: "Twitter",
                  icon: <Twitter />,
                  action: shareViaTwitter,
                  color: "hover:text-blue-400",
                },
                {
                  label: "Facebook",
                  icon: <Facebook />,
                  action: shareViaFacebook,
                  color: "hover:text-blue-600",
                },
                {
                  label: "LinkedIn",
                  icon: <Linkedin />,
                  action: shareViaLinkedin,
                  color: "hover:text-blue-700",
                },
                {
                  label: "Email",
                  icon: <Mail />,
                  action: shareViaEmail,
                  color: "hover:text-purple-500",
                },
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
            <p className="text-[10px] text-muted-foreground">
              Copy and paste this code snippets into your website's HTML to
              embed the quiz player.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
