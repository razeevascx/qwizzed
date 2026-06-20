import React from "react";
import {
  Home,
  Mail,
  PlusCircle,
  BarChart3,
  Trophy,
  Settings,
  Plug,
  Folder,
  Image as ImageIcon,
  LayoutTemplate,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
  subItems?: SidebarItem[];
}

export const Sidebarlink: SidebarItem[] = [
  {
    label: "Home",
    href: "/app/",
    icon: <Home className="w-4 h-4" />,
    section: "Main",
  },
  {
    label: "Invitations",
    href: "/app/invitations",
    icon: <Mail className="w-4 h-4" />,
    section: "Main",
  },

  {
    label: "All Quizzes",
    href: "/app/quizzes",
    icon: <Folder className="w-4 h-4" />,
    section: "Quizzes",
  },
  {
    label: "Media Library",
    href: "/app/media",
    icon: <ImageIcon className="w-4 h-4" />,
    section: "Quizzes",
  },
  {
    label: "Templates",
    href: "/app/templates",
    icon: <LayoutTemplate className="w-4 h-4" />,
    section: "Quizzes",
  },
  {
    label: "Create New",
    href: "/app/create",
    icon: <PlusCircle className="w-4 h-4" />,
    section: "Quizzes",
  },
  {
    label: "Analytics",
    href: "/app/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    section: "Insights",
  },
  {
    label: "Leaderboard",
    href: "/app/leaderboard",
    icon: <Trophy className="w-4 h-4" />,
    section: "Insights",
  },

  {
    label: "Integrations",
    href: "/app/integrations",
    icon: <Plug className="w-4 h-4" />,
    section: "Settings",
  },
  {
    label: "Account & Team",
    href: "/app/settings",
    icon: <Settings className="w-4 h-4" />,
    section: "Settings",
  },
];
