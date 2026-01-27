"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 animate-pulse bg-muted"
      />
    );
  }

  const ICON_SIZE = 18;

  const getCurrentIcon = () => {
    if (theme === "light") {
      return <Sun size={ICON_SIZE} className="text-amber-500" />;
    }
    if (theme === "dark") {
      return <Moon size={ICON_SIZE} className="text-indigo-400" />;
    }
    return <Laptop size={ICON_SIZE} className="text-muted-foreground" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-lg hover:bg-secondary/50 hover:text-foreground transition-all duration-200 group"
        >
          <span className="relative">{getCurrentIcon()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 p-1.5 bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem
            value="light"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 focus:bg-secondary/50"
          >
            <Sun
              size={ICON_SIZE}
              className="text-amber-500 group-hover:text-amber-400 transition-colors"
            />
            <span className="text-sm">Light</span>
            {theme === "light" && (
              <Check size={14} className="ml-auto text-primary" />
            )}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 focus:bg-secondary/50"
          >
            <Moon
              size={ICON_SIZE}
              className="text-indigo-400 group-hover:text-indigo-300 transition-colors"
            />
            <span className="text-sm">Dark</span>
            {theme === "dark" && (
              <Check size={14} className="ml-auto text-primary" />
            )}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 focus:bg-secondary/50"
          >
            <Laptop
              size={ICON_SIZE}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
            <span className="text-sm">System</span>
            {theme === "system" && (
              <Check size={14} className="ml-auto text-primary" />
            )}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
