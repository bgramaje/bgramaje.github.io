import { X } from "lucide-react";

interface TerminalTitleBarProps {
  title?: string;
  onClose?: () => void;
}

export function TerminalTitleBar({ title = "whoami", onClose }: TerminalTitleBarProps) {
  const trafficLightsWidth = "w-14"; // 3.5rem, mismo ancho que los tres círculos + gap

  return (
    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-transparent border-b border-terminal-border/60 shrink-0">
      <div className={`${trafficLightsWidth} shrink-0 flex gap-2`}>
        <div className="w-3 h-3 bg-[#ff5f57] rounded-full" />
        <div className="w-3 h-3 bg-[#ffbd2e] rounded-full" />
        <div className="w-3 h-3 bg-[#28ca42] rounded-full" />
      </div>
      <div className="flex-1 text-center min-w-0">
        <span className="text-terminal-muted text-sm">{title}</span>
      </div>
      <div className={`${trafficLightsWidth} shrink-0 flex items-center justify-end`}>
        {onClose ? (
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-terminal-muted hover:text-terminal-text transition-colors rounded-md hover:bg-terminal-border/10"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

