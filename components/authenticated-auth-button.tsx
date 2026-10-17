"use client";

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

export function AuthenticatedAuthButton() {
  return (
    <div className="flex items-center gap-3">
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Open Dashboard"
            labelIcon={<LayoutDashboard className="size-4" aria-hidden="true" />}
            href="/app"
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}
