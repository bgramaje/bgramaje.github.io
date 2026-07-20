import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalTitleBarProps {
  title?: string;
  onClose?: () => void;
}

export function TerminalTitleBar({ title = "whoami", onClose }: TerminalTitleBarProps) {
  const trafficLightsWidth = "w-12";

  return (
    <div className="flex shrink-0 items-center gap-1 border-b border-border/50 bg-card/90 px-2 py-1 backdrop-blur-md">
      <div className={cn(trafficLightsWidth, "flex shrink-0 gap-1.5")}>
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--traffic-red)]" aria-hidden />
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--traffic-yellow)]" aria-hidden />
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--traffic-green)]" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-center">
        <span className="truncate text-xs font-medium tracking-tight text-muted-foreground">
          {title}
        </span>
      </div>
      <div className={cn(trafficLightsWidth, "flex shrink-0 items-center justify-end")}>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-100 ease-out hover:bg-border/20 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97]"
            aria-label="Close dialog"
          >
            <X size={14} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
