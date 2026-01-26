"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  PlusCircle,
  UserCircle,
  BarChart3,
  Menu,
  X,
  LogOut,
  BookOpen,
  Home,
  ShieldCheck,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Code,
  ExternalLink,
} from "lucide-react";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { CurrentUserAvatar } from "./current-user-avatar";
import { createClient } from "@/lib/supabase/client";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

const navItems: SidebarItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="w-4 h-4" />,
    section: "Main",
  },
  {
    label: "Dashboard",
    href: "/quiz",
    icon: <LayoutGrid className="w-4 h-4" />,
    section: "Workspace",
  },
  {
    label: "My Quizzes",
    href: "/quiz/my-quizzes",
    icon: <UserCircle className="w-4 h-4" />,
    section: "Workspace",
  },
  {
    label: "Create Quiz",
    href: "/quiz/create",
    icon: <PlusCircle className="w-4 h-4" />,
    section: "Workspace",
  },
  {
    label: "Analytics",
    href: "/quiz/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    section: "Insights",
  },
  {
    label: "Privacy",
    href: "/privacy",
    icon: <ShieldCheck className="w-4 h-4" />,
    section: "Legal",
  },
  {
    label: "Terms",
    href: "/terms",
    icon: <ScrollText className="w-4 h-4" />,
    section: "Legal",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const name = useCurrentUserName();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const grouped = navItems.reduce<Record<string, SidebarItem[]>>(
    (acc, item) => {
      const key = item.section || "";
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    },
    {},
  );

  const toggle = () => setIsOpen((open) => !open);
  const close = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/get-started");
  };

  return (
    <>
      <div className="sm:hidden mb-4 flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-background border border-border px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-muted/50"
          aria-expanded={isOpen}
          aria-controls="quiz-sidebar"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>
        <Link
          href="/quiz/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          New
        </Link>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={close}
        />
      )}

      <aside
        id="quiz-sidebar"
        className={cn(
          "fixed sm:static z-50 inset-y-0 left-0 w-[78%] max-w-sm",
          isCollapsed ? "sm:w-16 lg:w-20" : "sm:w-64 lg:w-72",
          "transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          "shrink-0 bg-gradient-to-b from-background via-background to-primary/5 backdrop-blur-md border-r border-border/60",
          "flex h-screen sm:h-[calc(100vh-2rem)] flex-col rounded-r-2xl sm:rounded-none shadow-xl sm:shadow-none",
          "sm:top-4 sm:bottom-4 sm:sticky",
        )}
      >
        <div className="space-y-6 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                Q
              </div>
              {!isCollapsed && (
                <div className="leading-tight">
                  <p className="text-base font-bold tracking-tight">Qwizzed</p>
                  <p className="text-xs text-muted-foreground">Quiz platform</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 hover:bg-muted/60"
                onClick={toggleCollapse}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 hover:bg-muted/60"
                onClick={close}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(grouped).map(([section, items]) => (
              <div key={section || "default"} className="space-y-2">
                {section && !isCollapsed && (
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {section}
                  </p>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const normalizedHref = item.href.split("#")[0];
                    const isDashboard = normalizedHref === "/quiz";
                    const isHome = normalizedHref === "/";
                    const allowPrefix = !isDashboard && !isHome;
                    const isActive =
                      pathname === normalizedHref ||
                      (allowPrefix &&
                        pathname.startsWith(`${normalizedHref}/`));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground",
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
                        {isCollapsed ? (
                          <span className="sr-only">{item.label}</span>
                        ) : (
                          <span className="leading-none">{item.label}</span>
                        )}
                        {isActive && !isCollapsed && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 p-4 sm:p-5 bg-background/70 backdrop-blur flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            {!isCollapsed && <span>Collapse</span>}
          </span>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 hover:bg-muted/60"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-auto border-t border-border/60 p-4 sm:p-5 bg-background/80 backdrop-blur">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5",
              isCollapsed && "justify-center",
            )}
          >
            <CurrentUserAvatar size="sm" />
            {!isCollapsed && (
              <div className="flex-1 leading-tight">
                <p className="text-sm font-semibold text-foreground">
                  {name || "User"}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50",
              isCollapsed && "justify-center px-2",
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!isCollapsed && <span>Logout</span>}
            {isCollapsed && <span className="sr-only">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
