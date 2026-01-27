"use client";

import { useState, useEffect, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: Toast) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  show: (message: string, type: ToastType = "info", title?: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, title, duration };
    listeners.forEach((listener) => listener(newToast));
    return id;
  },
  success: (message: string, title?: string, duration?: number) =>
    toast.show(message, "success", title, duration),
  error: (message: string, title?: string, duration?: number) =>
    toast.show(message, "error", title, duration),
  info: (message: string, title?: string, duration?: number) =>
    toast.show(message, "info", title, duration),
  warning: (message: string, title?: string, duration?: number) =>
    toast.show(message, "warning", title, duration),
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((newToast: Toast) => {
    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration !== 0) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, newToast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, [addToast]);

  return { toasts, removeToast, ...toast };
}
