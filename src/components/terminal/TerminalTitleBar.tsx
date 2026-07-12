import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalTitleBarProps {
  title?: string;
  onClose?: () => void;
}

export function TerminalTitleBar({ title = "whoami", onClose }: TerminalTitleBarProps) {
  const trafficLightsWidth = "w-14";

  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-border/50 bg-card/90 px-2 py-1.5 backdrop-blur-md">
      <div className={cn(trafficLightsWidth, "flex shrink-0 gap-2")}>
        <div className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" aria-hidden />
        <div className="h-3 w-3 rounded-full bg-[#28ca42]" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-center">
        <span className="truncate text-sm font-medium tracking-tight text-muted-foreground">
          {title}
        </span>
      </div>
      <div className={cn(trafficLightsWidth, "flex shrink-0 items-center justify-end")}>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-border/20 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95"
            aria-label="Close dialog"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
