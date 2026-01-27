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
  FileText,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { CurrentUserAvatar } from "./current-user-avatar";
import { createClient } from "@/lib/supabase/client";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
  subItems?: SidebarItem[];
}

const navItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutGrid className="w-4 h-4" />,
    section: "Main",
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: <UserCircle className="w-4 h-4" />,
    section: "Workspace",
    subItems: [
      {
        label: "My Quizzes",
        href: "/quizzes",
        icon: <UserCircle className="w-4 h-4" />,
      },
      {
        label: "Create New",
        href: "/create",
        icon: <PlusCircle className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    section: "Insights",
  },
  {
    label: "Developer",
    href: "/developer",
    icon: <Code className="w-4 h-4" />,
    section: "Platform",
  },
  {
    label: "Legal",
    href: "/legal",
    icon: <ShieldCheck className="w-4 h-4" />,
    section: "Management",
    subItems: [
      {
        label: "Privacy Policy",
        href: "/privacy",
        icon: <ShieldCheck className="w-4 h-4" />,
      },
      {
        label: "Terms of Service",
        href: "/terms",
        icon: <ScrollText className="w-4 h-4" />,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Quizzes: true,
    Developer: true,
    Settings: true,
    Legal: false,
  });
  const name = useCurrentUserName();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const toggleSection = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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

  const renderNavItem = (item: SidebarItem, isSubItem = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems[item.label];
    const normalizedHref = item.href.split("#")[0];
    const isActive =
      pathname === normalizedHref ||
      (normalizedHref !== "/" && pathname.startsWith(`${normalizedHref}/`));

    return (
      <div key={item.href} className="space-y-1">
        {hasSubItems ? (
          <button
            onClick={() => !isCollapsed && toggleSection(item.label)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive && !hasSubItems
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
              isCollapsed && "justify-center",
            )}
          >
            <span
              className={cn(
                "transition-transform",
                isActive ? "scale-110" : "",
              )}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="flex-1 text-left">{item.label}</span>
            )}
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-180" : "",
                )}
              />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={close}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
              isCollapsed && "justify-center",
              isSubItem && "ml-4",
            )}
          >
            <span
              className={cn(
                "transition-transform",
                isActive ? "scale-110" : "",
              )}
            >
              {item.icon}
            </span>
            {!isCollapsed && <span className="flex-1">{item.label}</span>}
            {isActive && !isCollapsed && !isSubItem && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            )}
          </Link>
        )}

        {!isCollapsed && hasSubItems && isExpanded && (
          <div className="space-y-1">
            {item.subItems!.map((sub) => renderNavItem(sub, true))}
          </div>
        )}
      </div>
    );
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
          href="/create"
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
          "fixed sm:static z-50 inset-y-0 left-0 transition-all duration-300",
          isCollapsed ? "sm:w-20" : "sm:w-64 lg:w-72",
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          "shrink-0 bg-background border-r border-border/60",
          "flex h-screen sm:h-screen flex-col shadow-xl sm:shadow-none",
          "sm:sticky sm:top-0",
        )}
      >
        <div className="flex items-center justify-between gap-3 p-4 border-b border-border/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
              Q
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <p className="text-base font-bold tracking-tight">Qwizzed</p>
                <p className="text-xs text-muted-foreground">Quiz platform</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="hidden sm:inline-flex shrink-0 h-8 w-8 items-center justify-center rounded-lg border border-border/60 hover:bg-muted/60"
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

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section || "default"} className="space-y-2">
              {section && !isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {section}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 p-4 bg-muted/20">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "justify-center" : "",
            )}
          >
            <CurrentUserAvatar size="sm" />
            {!isCollapsed && (
              <div className="flex-1 leading-tight truncate">
                <p className="text-sm font-semibold text-foreground truncate">
                  {name || "User"}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full h-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
