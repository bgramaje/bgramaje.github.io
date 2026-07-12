import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={(event) => toggle(event.clientX, event.clientY)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md",
        "text-muted-foreground transition-colors duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "active:scale-95",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
    </button>
  );
}
