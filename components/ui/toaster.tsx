"use client";

import { useToast, Toast } from "@/hooks/use-toast";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 p-6 z-[9999] flex flex-col gap-3 w-full max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-primary" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  };

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border bg-card p-4 shadow-2xl animate-in slide-in-from-right-full fade-in duration-300",
        toast.type === "success" && "border-emerald-500/20 bg-emerald-500/5",
        toast.type === "error" && "border-destructive/20 bg-destructive/5",
        toast.type === "warning" && "border-amber-500/20 bg-amber-500/5",
        toast.type === "info" && "border-primary/20 bg-primary/5"
      )}
    >
      <div className="shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 space-y-1">
        {toast.title && <p className="text-sm font-bold">{toast.title}</p>}
        <p className="text-sm text-muted-foreground leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 rounded-md p-1 hover:bg-muted/50 transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Progress line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-full",
          toast.type === "success" && "text-emerald-500",
          toast.type === "error" && "text-destructive",
          toast.type === "warning" && "text-amber-500",
          toast.type === "info" && "text-primary"
        )}
        style={{
          width: "100%",
          animation: `toast-progress ${toast.duration || 5000}ms linear forwards`
        }}
      />

      <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
