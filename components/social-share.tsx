"use client";

import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SocialShareProps {
  scorePercentage: number;
  quizTitle: string;
  organizerName?: string | null;
  className?: string;
}

export function SocialShare({
  scorePercentage,
  quizTitle,
  organizerName,
  className = "",
}: SocialShareProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const organizerText =
      organizerName && organizerName !== "null"
        ? ` organized by ${organizerName}`
        : "";
    const text = `I just scored ${scorePercentage}% on ${quizTitle}${organizerText}!`;
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text,
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url,
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied", "Quiz link copied to clipboard");
  };

  return (
    <div className={`pt-6 ${className}`}>
      <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Share your result
      </p>
      <div className="border border-dashed border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4">
          <button
            className="p-6 py-8 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 border-r border-dashed border-border group"
            onClick={() => handleShare("twitter")}
            title="Share on Twitter"
          >
            <Twitter className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Twitter
            </span>
          </button>
          <button
            className="p-6 py-8 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 border-r border-dashed border-border group"
            onClick={() => handleShare("linkedin")}
            title="Share on LinkedIn"
          >
            <Linkedin className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              LinkedIn
            </span>
          </button>
          <button
            className="p-6 py-8 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 border-r border-dashed border-border group"
            onClick={() => handleShare("facebook")}
            title="Share on Facebook"
          >
            <Facebook className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Facebook
            </span>
          </button>
          <button
            className="p-6 py-8 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 group"
            onClick={handleCopyLink}
            title="Copy Link"
          >
            <Share2 className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Copy Link
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
