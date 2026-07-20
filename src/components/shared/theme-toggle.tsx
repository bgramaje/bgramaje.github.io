import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/app/theme-provider";
import { cn } from "@/lib/utils";

const iconTransition = { type: "spring" as const, duration: 0.3, bounce: 0 };

export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={(event) => toggle(event.clientX, event.clientY)}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md",
        "text-muted-foreground transition-[color,background-color,transform] duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "active:scale-[0.96]",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
    >
      <span className="relative flex size-[17px] items-center justify-center">
        {reduceMotion ? (
          isDark ? (
            <Sun size={17} aria-hidden />
          ) : (
            <Moon size={17} aria-hidden />
          )
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {isDark ? (
              <motion.span
                key="sun"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                transition={iconTransition}
              >
                <Sun size={17} aria-hidden />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                transition={iconTransition}
              >
                <Moon size={17} aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </span>
    </button>
  );
}
