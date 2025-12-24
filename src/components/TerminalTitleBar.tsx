import { X } from "lucide-react";

interface TerminalTitleBarProps {
  title?: string;
  onClose?: () => void;
}

export function TerminalTitleBar({ title = "bgramaje@portfolio", onClose }: TerminalTitleBarProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-terminal-bg border-b-2 border-terminal-border shrink-0">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-terminal-error" />
        <div className="w-3 h-3 bg-terminal-warning" />
        <div className="w-3 h-3 bg-terminal-success" />
      </div>
      <div className="flex-1 text-center">
        <span className="text-terminal-muted text-sm">{title}</span>
      </div>
      {onClose ? (
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-terminal-muted hover:text-terminal-text transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      ) : (
        <div className="w-16" />
      )}
    </div>
  );
}

