"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  triggerLabel?: string;
  open?: boolean;
  onClose?: () => void;
  dismissible?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function BottomSheet({ triggerLabel = "Open bottom sheet", title = "Make yourself at home", description = "A little space for your next action. Press Escape or close to return.", children, open, onClose, dismissible = true, className = "" }: BottomSheetProps = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    else if (open === false && dialog.current?.open) dialog.current.close();
  }, [open]);
  return <div className={className}>
    {open === undefined && <button type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()} className="min-h-11 bg-emerald-400 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">{triggerLabel}</button>}
    <dialog ref={dialog} onClose={onClose} onCancel={event => { if (!dismissible) event.preventDefault(); }} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onClick={event => { if (dismissible && event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden border border-border rounded-t-2xl bg-background px-6 pt-6 pb-8 text-foreground shadow-xl backdrop:bg-black/60 sm:mx-auto sm:max-w-2xl">
      <div aria-hidden="true" className="mx-auto mb-6 h-1 w-10 bg-muted-foreground/40" />
      <div className="flex items-start justify-between gap-4">
        <h2 id={`${id}-title`} className="text-xl font-semibold">{title}</h2>
        <button type="button" aria-label="Close bottom sheet" disabled={!dismissible} onClick={() => dialog.current?.close()} className="flex size-11 shrink-0 items-center justify-center rounded-lg disabled:opacity-50 hover:bg-muted focus-visible:outline-2 focus-visible:outline-emerald-400"><X aria-hidden="true" className="size-7" /></button>
      </div>
      <p id={`${id}-description`} className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </dialog>
  </div>;
}
