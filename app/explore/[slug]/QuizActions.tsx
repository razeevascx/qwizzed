"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, QrCode, X as CloseIcon } from "lucide-react";
import { QuizQrDisplay } from "@/components/quiz-qr-display";
import { toast } from "@/hooks/use-toast";

interface QuizActionsProps {
  slug: string;
  quizTitle: string;
  organizerName?: string | null;
}

export function QuizActions({ slug, quizTitle, organizerName }: Readonly<QuizActionsProps>) {
  const [showQr, setShowQr] = useState(false);

  const quizUrl =
    globalThis.window === undefined
      ? ""
      : `${globalThis.location.origin}/explore/${slug}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: quizTitle,
          text: `Take the "${quizTitle}" quiz on Qwizzed!`,
          url: quizUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback to copy link
      try {
        await navigator.clipboard.writeText(quizUrl);
        toast.success(
          "Native share not supported. Quiz link copied to clipboard.",
          "Link copied",
        );
      } catch (err) {
        console.error("Failed to copy:", err);
      }
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

  const shareViaLinkedin = () => {
    const url = encodeURIComponent(quizUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* QR Code Trigger */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setShowQr(true)}
        className="h-12 px-6 gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all duration-300"
      >
        <QrCode className="h-5 w-5" />
        <span className="font-bold uppercase tracking-widest text-xs">QR Code</span>
      </Button>

      <div className="flex items-center gap-2">
        {/* X (Twitter) Share */}
        <Button
          variant="outline"
          size="icon-lg"
          onClick={shareViaTwitter}
          title="Share on X"
          className="h-12 w-12 border-border/50 hover:bg-[#000000] hover:border-[#000000] hover:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-black transition-all duration-300"
        >
          <Twitter className="h-5 w-5" />
        </Button>

        {/* LinkedIn Share */}
        <Button
          variant="outline"
          size="icon-lg"
          onClick={shareViaLinkedin}
          title="Share on LinkedIn"
          className="h-12 w-12 border-border/50 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-all duration-300"
        >
          <Linkedin className="h-5 w-5" />
        </Button>

        {/* Native Share Trigger */}
        <Button
          variant="outline"
          size="icon-lg"
          onClick={handleNativeShare}
          title="Share"
          className="h-12 w-12 border-border/50 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* QR Code Modal Overlay */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-background rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <button
              onClick={() => setShowQr(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-[60]"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <div className="p-4">
              <QuizQrDisplay
                url={quizUrl}
                title={quizTitle}
                organizerName={organizerName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
