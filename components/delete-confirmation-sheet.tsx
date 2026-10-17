"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/hangry-ui/components/bottom-sheet";
import { Button } from "@/components/ui/button";

export function DeleteConfirmationSheet({ title, description, onConfirm, onClose }: {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <BottomSheet open title={title} description={description} onClose={onClose} dismissible={!isDeleting}>
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-3" aria-busy={isDeleting}>
        <Button variant="outline" onClick={onClose} disabled={isDeleting} autoFocus>Cancel</Button>
        <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </BottomSheet>
  );
}
