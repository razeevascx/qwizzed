"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  PlusCircle,
  UserCircle,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { CurrentUserAvatar } from "./current-user-avatar";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

const navItems: SidebarItem[] = [
  {
    label: "My Quizzes",
    href: "/quiz/my-quizzes",
    icon: <UserCircle className="w-4 h-4" />,
    section: "Quiz",
  },
  {
    label: "Analytics",
    href: "/quiz/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    section: "Insights",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const name = useCurrentUserName();

  const initials = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  // Group items by section
  const grouped = navItems.reduce<Record<string, SidebarItem[]>>(
    (acc, item) => {
      const key = item.section || "";
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    },
    {},
  );

  return (
    <>
      <button
        type="button"
        className="sm:hidden mb-3 inline-flex items-center justify-between w-full gap-2 rounded-lg bg-background border border-border px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted/50"
        aria-expanded={isOpen}
        aria-controls="quiz-sidebar"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Navigation
        </span>
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <aside
        id="quiz-sidebar"
        className={cn(
          "shrink-0 bg-background/95 backdrop-blur-sm border-r border-border/50",
          "sm:w-64 lg:w-72",
          "flex h-screen flex-col",
          isOpen ? "block" : "hidden",
          "sm:block",
        )}
      >
        <div className="space-y-6 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                Q
              </div>
              <div className="leading-tight">
                <p className="text-base font-bold tracking-tight">Qwizzed</p>
                <p className="text-xs text-muted-foreground">Quiz platform</p>
              </div>
            </div>
          </div>

          <Link
            href="/quiz/create"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 w-full"
          >
            <PlusCircle className="h-5 w-5" />
            Create new quiz
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <LayoutGrid className="h-4 w-4" />
                <span className="text-xs font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">Active</span>
              </div>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "scale-110" : "",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="leading-none">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-border/50 p-4 sm:p-5">
          <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5">
            <CurrentUserAvatar size="sm" />
            <div className="flex-1 leading-tight">
              <p className="text-sm font-semibold text-foreground">
                {name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">View profile</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
