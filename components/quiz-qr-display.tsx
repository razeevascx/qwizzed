"use client";

import { useRef, useEffect, useState } from "react";
import { QrCode, Maximize2, Minimize2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toggleFullscreen } from "@/lib/fullscreen";

interface QuizQrDisplayProps {
  url: string;
  title?: string;
  organizerName?: string | null;
}

export function QuizQrDisplay({ url, title, organizerName }: QuizQrDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <div className="rounded-lg border border-border/40 bg-card/50 p-8 flex flex-col text-center space-y-8 h-full min-h-[600px]">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <QrCode className="w-6 h-6 text-primary" />
          <span>Access QR Code</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreen();
            }}
            className="ml-1 p-2 rounded-lg bg-muted/30 hover:bg-primary/10 border border-border/40 transition-all text-muted-foreground hover:text-primary inline-flex items-center justify-center group/max shadow-sm"
            title="Maximize for Presentation"
          >
            <Maximize2 className="w-4 h-4 group-hover/max:scale-110 transition-transform" />
          </button>
        </h2>
        <p className="text-muted-foreground text-sm">
          Scan this code to take the quiz on any device
        </p>
      </div>

      {/* Native Fullscreen Target */}
      <div className="flex-1 flex items-center justify-center">
        <div
          ref={qrRef}
          className="relative flex flex-col items-center justify-center transition-all duration-300 w-full h-full p-8 rounded-[40px] bg-white shadow-2xl ring-4 ring-primary/5 cursor-zoom-in group/qr [&:fullscreen]:rounded-none [&:fullscreen]:p-0 [&:fullscreen]:bg-[#0F1116] [&:fullscreen]:ring-0 [&:fullscreen]:cursor-default"
          onClick={!isFullscreen ? handleFullscreen : undefined}
        >
          {isFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.exitFullscreen();
              }}
              className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-md border border-white/20"
              title="Exit Presentation"
            >
              <Minimize2 className="w-8 h-8" />
            </button>
          )}

          {/* QR Container - Always White */}
          <div className={`bg-white p-8 rounded-[3rem] shadow-2xl transition-all duration-500 ${isFullscreen ? 'scale-110' : ''}`}>
            <QRCodeCanvas
              value={url}
              size={isFullscreen ? 500 : 400}
              level={"H"}
              includeMargin={false}
            />
          </div>

          {/* Text Section - Visible in Fullscreen */}
          <div
            className={`${
              isFullscreen ? "flex" : "hidden"
            } mt-16 flex-col items-center space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700`}
          >
            <div className="space-y-2">
              {title && (
                <p className="text-3xl font-bold text-white/90 tracking-wide uppercase">
                  {title}
                </p>
              )}
              {organizerName && organizerName !== "null" && (
                <p className="text-xl text-white/60 font-medium">
                  Organized By / <span className="text-white font-semibold">{organizerName}</span>
                </p>
              )}
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
  );
}
