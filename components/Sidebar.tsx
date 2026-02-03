"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PlusCircle,
  UserCircle,
  BarChart3,
  Menu,
  LogOut,
  Mail,
  ShieldCheck,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Code,
  ChevronDown,
  Home,
  X,
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
    label: "Home",
    href: "/",
    icon: <Home className="w-4 h-4" />,
    section: "Main",
  },
  {
    label: "Invitations",
    href: "/dashboard/invitations",
    icon: <Mail className="w-4 h-4" />,
    section: "Main",
  },
  {
    label: "Quizzes",
    href: "/dashboard/quizzes",
    icon: <UserCircle className="w-4 h-4" />,
    section: "Workspace",
    subItems: [
      {
        label: "My Quizzes",
        href: "/dashboard/quizzes",
        icon: <UserCircle className="w-4 h-4" />,
      },
      {
        label: "Create New",
        href: "/dashboard/create",
        icon: <PlusCircle className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    section: "Insights",
  },
  {
    label: "Developer",
    href: "/dashboard/developer",
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              isActive && !hasSubItems
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted/50 hover:text-foreground",
              isCollapsed && "justify-center px-2",
            )}
          >
            <span
              className={cn(
                "transition-all duration-200 flex-shrink-0",
                isActive ? "text-primary" : "group-hover:text-foreground",
              )}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 flex-shrink-0 text-muted-foreground",
                    isExpanded ? "rotate-180" : "",
                    isActive && "text-primary",
                  )}
                />
              </>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={close}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted/50 hover:text-foreground",
              isCollapsed && "justify-center px-2",
              isSubItem &&
                !isCollapsed &&
                "ml-8 pl-4 border-l-2 border-border/30",
            )}
          >
            <span
              className={cn(
                "transition-all duration-200 flex-shrink-0",
                isActive ? "text-primary" : "group-hover:text-foreground",
              )}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="flex-1 truncate">{item.label}</span>
            )}
            {isActive && !isCollapsed && !isSubItem && (
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            )}
          </Link>
        )}

        {!isCollapsed && hasSubItems && isExpanded && (
          <div className="space-y-1 mt-1">
            {item.subItems!.map((sub) => renderNavItem(sub, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            aria-expanded={isOpen}
            aria-controls="quiz-sidebar"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              Q
            </div>
            <span className="font-bold text-base tracking-tight">Qwizzed</span>
          </div>

          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="quiz-sidebar"
        className={cn(
          "fixed lg:sticky z-50 inset-y-0 left-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-64",
          "shrink-0 bg-background border-r border-border/50",
          "flex h-screen flex-col shadow-xl lg:shadow-none",
          "lg:top-0",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-[1.125rem] shadow-sm">
              Q
            </div>
            {!isCollapsed && (
              <div className="leading-tight min-w-0">
                <p className="text-base font-bold tracking-tight truncate">
                  Qwizzed
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Quiz platform
                </p>
              </div>
            )}
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            className="lg:hidden shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse button for desktop */}
          <button
            type="button"
            className="hidden lg:inline-flex shrink-0 h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-5">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section || "default"} className="space-y-2">
              {section && !isCollapsed && (
                <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {section}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border/50 p-3 bg-muted/20">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 min-w-0">
                <CurrentUserAvatar size="sm" className="shrink-0" />
                <div className="leading-tight min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Manage account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-1">
              <CurrentUserAvatar size="sm" />
              <button
                type="button"
                onClick={handleLogout}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
